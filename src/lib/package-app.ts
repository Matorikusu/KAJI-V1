import JSZip from "jszip";
import { packAsar, utf8 } from "@/lib/asar";
import type { Analysis, FileMap } from "@/lib/detect";
import type { ForgePlan } from "@/lib/forge-plan";
import type { Platform } from "@/lib/types";
import { slugify } from "@/lib/utils";

const RUNTIME = {
  windows: "/kaji-runtime/neutralino-win_x64.exe",
  macos: "/kaji-runtime/neutralino-mac_universal",
  linux: "/kaji-runtime/neutralino-linux_x64",
  client: "/kaji-runtime/neutralino.js",
} as const;

const runtimeCache = new Map<string, Promise<Uint8Array>>();

async function loadRuntime(path: string) {
  let pending = runtimeCache.get(path);
  if (!pending) {
    pending = fetch(path).then(async (res) => {
      if (!res.ok) throw new Error("Runtime missing");
      return new Uint8Array(await res.arrayBuffer());
    });
    runtimeCache.set(path, pending);
  }
  return pending;
}

function fileSafe(name: string) {
  const cleaned = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").trim();
  return cleaned || slugify(name);
}

function appId(name: string) {
  return `app.kaji.${slugify(name).replace(/[^a-z0-9-]/g, "") || "app"}`;
}

function escapeHtml(value: string) {
  const amp = "\u0026";
  return value
    .replaceAll(amp, amp + "amp;")
    .replaceAll("<", amp + "lt;")
    .replaceAll(">", amp + "gt;")
    .replaceAll('"', amp + "quot;");
}

function decodeDataUrl(dataUrl: string): Uint8Array | null {
  const match = dataUrl.match(/^data:([^;,]+)?(;charset=[^;,]*)?(;base64)?,(.*)$/s);
  if (!match) return null;
  const payload = match[4] ?? "";
  if (match[3]) {
    const binary = atob(payload);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  }
  try {
    return utf8(decodeURIComponent(payload));
  } catch {
    return utf8(payload);
  }
}

async function rasterIcon(dataUrl: string): Promise<Uint8Array | null> {
  const raw = decodeDataUrl(dataUrl);
  if (!raw) return null;
  if (/^data:image\/png/i.test(dataUrl)) return raw;
  if (typeof document === "undefined") return raw;
  return await new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(raw);
        return;
      }
      ctx.drawImage(img, 0, 0, 256, 256);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(raw);
            return;
          }
          void blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
        },
        "image/png",
      );
    };
    img.onerror = () => resolve(raw);
    img.src = dataUrl;
  });
}

function shellHtml(opts: {
  name: string;
  description?: string;
  hasCover: boolean;
  hasClient: boolean;
}) {
  const picture = opts.hasCover ? `<img src="cover.png" alt="" />` : "";
  const client = opts.hasClient
    ? `<script src="js/neutralino.js"></script><script>Neutralino.init();</script>`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(opts.name)}</title>
  <style>
    :root { color-scheme: dark; }
    html, body { margin: 0; height: 100%; background: #0b0b0c; color: #f4f2ec; font-family: Georgia, serif; }
    main { min-height: 100%; display: grid; place-items: center; padding: 48px 24px; }
    .card { width: min(720px, 100%); }
    img { width: 100%; border-radius: 16px; display: block; }
    h1 { font-weight: 400; font-size: 42px; letter-spacing: -0.03em; margin: 28px 0 8px; }
    p { margin: 0; color: #8a8882; line-height: 1.5; }
  </style>
</head>
<body>
  <main>
    <div class="card">
      ${picture}
      <h1>${escapeHtml(opts.name)}</h1>
      <p>${escapeHtml(opts.description || "Forged by Kaji.")}</p>
    </div>
  </main>
  ${client}
</body>
</html>
`;
}

function makeConfig(opts: {
  name: string;
  slug: string;
  width: number;
  height: number;
  url: string;
  enableServer: boolean;
  icon: boolean;
}) {
  return {
    applicationId: appId(opts.name),
    version: "1.0.0",
    defaultMode: "window",
    port: 0,
    documentRoot: "/resources/",
    url: opts.url,
    enableServer: opts.enableServer,
    enableNativeAPI: true,
    tokenSecurity: "one-time",
    logging: { enabled: false, writeToLogFile: false },
    nativeAllowList: ["app.*", "window.*"],
    modes: {
      window: {
        title: opts.name,
        width: opts.width,
        height: opts.height,
        minWidth: 480,
        minHeight: 320,
        fullScreen: false,
        alwaysOnTop: false,
        icon: opts.icon ? "/resources/icons/app.png" : undefined,
        enableInspector: false,
        borderless: false,
        maximize: false,
        hidden: false,
        resizable: true,
        exitProcessOnClose: true,
        center: true,
      },
    },
    cli: {
      binaryName: opts.slug,
      resourcesPath: "/resources/",
      clientLibrary: "/resources/js/neutralino.js",
      binaryVersion: "6.9.0",
      clientVersion: "6.9.0",
    },
  };
}

function webRootFromFiles(files: FileMap) {
  const html = Object.keys(files).find((path) =>
    path.replace(/\\/g, "/").toLowerCase().endsWith("index.html"),
  );
  if (!html) return null;
  const normalized = html.replace(/\\/g, "/");
  const dir = normalized.includes("/") ? normalized.slice(0, normalized.lastIndexOf("/") + 1) : "";
  const out: Record<string, string> = {};
  for (const [path, content] of Object.entries(files)) {
    const n = path.replace(/\\/g, "/");
    if (dir && !n.startsWith(dir)) continue;
    const rel = dir ? n.slice(dir.length) : n;
    if (!rel || rel.endsWith("/")) continue;
    if (!/\.(html?|css|js|mjs|cjs|svg)$/i.test(rel)) continue;
    if (/^package(-lock)?\.json$/i.test(rel.split("/").pop() || "")) continue;
    out[rel] = content;
  }
  return Object.keys(out).length ? out : null;
}

function infoPlist(opts: { name: string; slug: string; id: string }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>en</string>
  <key>CFBundleDisplayName</key>
  <string>${escapeHtml(opts.name)}</string>
  <key>CFBundleExecutable</key>
  <string>${escapeHtml(opts.slug)}</string>
  <key>CFBundleIdentifier</key>
  <string>${escapeHtml(opts.id)}</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>${escapeHtml(opts.name)}</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>CFBundleVersion</key>
  <string>1.0.0</string>
  <key>LSMinimumSystemVersion</key>
  <string>11.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>NSPrincipalClass</key>
  <string>NSApplication</string>
</dict>
</plist>
`;
}

export async function buildDesktopZip(opts: {
  name: string;
  analysis: Analysis;
  plan: ForgePlan;
  platform: Platform;
  iconDataUrl: string | null;
  pictureDataUrl: string | null;
  files?: FileMap;
}) {
  const name = opts.name.trim() || "App";
  const slug = slugify(name);
  const safe = fileSafe(name);
  const startUrl = opts.analysis.startUrl;
  const remote = Boolean(startUrl && /^https?:\/\//i.test(startUrl));
  const staticFiles =
    !remote && opts.analysis.framework === "Static site"
      ? webRootFromFiles(opts.files ?? {})
      : null;

  const asarFiles: Record<string, Uint8Array> = {};
  let iconPacked = false;
  if (opts.iconDataUrl) {
    const png = await rasterIcon(opts.iconDataUrl);
    if (png) {
      asarFiles["resources/icons/app.png"] = png;
      iconPacked = true;
    }
  }

  if (remote) {
    // Remote sites load inside the native window as-is.
  } else if (staticFiles) {
    for (const [rel, content] of Object.entries(staticFiles)) {
      asarFiles[`resources/${rel}`] = utf8(content);
    }
  } else {
    let hasCover = false;
    if (opts.pictureDataUrl) {
      const png = await rasterIcon(opts.pictureDataUrl);
      if (png) {
        asarFiles["resources/cover.png"] = png;
        hasCover = true;
      }
    }
    const client = await loadRuntime(RUNTIME.client);
    asarFiles["resources/js/neutralino.js"] = client;
    asarFiles["resources/index.html"] = utf8(
      shellHtml({
        name,
        description: opts.analysis.description,
        hasCover,
        hasClient: true,
      }),
    );
  }

  const config = makeConfig({
    name,
    slug,
    width: opts.plan.window.width,
    height: opts.plan.window.height,
    url: remote ? (startUrl as string) : "/",
    enableServer: !remote,
    icon: iconPacked,
  });
  asarFiles["neutralino.config.json"] = utf8(JSON.stringify(config));

  const resourcesNeu = packAsar(asarFiles);
  const binary = await loadRuntime(RUNTIME[opts.platform]);
  const zip = new JSZip();

  if (opts.platform === "windows") {
    zip.file(`${safe}.exe`, binary, { binary: true });
    zip.file("resources.neu", resourcesNeu, { binary: true });
    zip.file(
      "Read me.txt",
      `Double-click ${safe}.exe to open ${name}.\nNo Visual Studio. No Node. No install wizard.\nWindows 10 or 11 with Microsoft Edge is enough.\n`,
    );
  } else if (opts.platform === "macos") {
    const app = `${safe}.app`;
    zip.file(`${app}/Contents/Info.plist`, infoPlist({ name, slug, id: appId(name) }));
    zip.file(`${app}/Contents/MacOS/${slug}`, binary, {
      binary: true,
      unixPermissions: 0o755,
    });
    zip.file(`${app}/Contents/MacOS/resources.neu`, resourcesNeu, { binary: true });
    zip.file(`${app}/Contents/PkgInfo`, "APPL????");
    zip.file(
      "Read me.txt",
      `Double-click ${safe}.app to open ${name}.\nFirst launch: right-click the app, choose Open, then Open again.\n`,
    );
  } else {
    zip.file(slug, binary, { binary: true, unixPermissions: 0o755 });
    zip.file("resources.neu", resourcesNeu, { binary: true });
    zip.file(
      `${slug}.desktop`,
      `[Desktop Entry]
Type=Application
Name=${name}
Exec=./${slug}
Icon=applications-internet
Terminal=false
Categories=Utility;
`,
    );
    zip.file(
      "Read me.txt",
      `Run ./${slug} to open ${name}.\nchmod +x ${slug} if your archive tool dropped the execute bit.\n`,
    );
  }

  const blob = await zip.generateAsync({
    type: "blob",
    platform: opts.platform === "windows" ? "DOS" : "UNIX",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const filename =
    opts.platform === "windows"
      ? `${slug}-windows.zip`
      : opts.platform === "macos"
        ? `${slug}-macos.zip`
        : `${slug}-linux.zip`;

  return { blob, filename };
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
