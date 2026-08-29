import JSZip from "jszip";
import { slugify } from "@/lib/utils";
import type { Analysis } from "@/lib/detect";
import type { ForgePlan } from "@/lib/forge-plan";
import type { Platform } from "@/lib/types";

function extFromDataUrl(dataUrl: string) {
  const mime = dataUrl.match(/^data:([^;,]+)/)?.[1] || "";
  if (mime.includes("svg")) return "svg";
  if (mime.includes("jpeg")) return "jpg";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "png";
}

function addDataUrl(zip: JSZip, path: string, dataUrl: string) {
  const base64 = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
  if (base64) {
    zip.file(path, base64[1], { base64: true });
    return path;
  }
  const svg = dataUrl.match(/^data:image\/svg\+xml(?:;charset=utf-8)?,(.*)$/i);
  if (svg) {
    const out = path.replace(/\.[a-z]+$/i, ".svg");
    zip.file(out, decodeURIComponent(svg[1]));
    return out;
  }
  return null;
}

function launcher(platform: Platform, productName: string) {
  if (platform === "windows") {
    return {
      name: "Start.bat",
      unixPermissions: undefined as number | undefined,
      body: `@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo ${productName} needs Node.js the first time it launches.
  echo Get it from https://nodejs.org then double-click Start.bat again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Preparing ${productName}...
  call npm install --no-fund --no-audit
)
npx --yes electron .
`,
    };
  }
  if (platform === "macos") {
    return {
      name: "Start.command",
      unixPermissions: 0o755,
      body: `#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  osascript -e 'display dialog "${productName} needs Node.js the first time it launches. Get it from https://nodejs.org" buttons {"OK"} default button 1'
  open "https://nodejs.org"
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Preparing ${productName}..."
  npm install --no-fund --no-audit
fi
npx --yes electron .
`,
    };
  }
  return {
    name: "start.sh",
    unixPermissions: 0o755,
    body: `#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "${productName} needs Node.js the first time it launches."
  echo "Install Node, then run ./start.sh again."
  exit 1
fi
if [ ! -d node_modules ]; then
  echo "Preparing ${productName}..."
  npm install --no-fund --no-audit
fi
npx --yes electron .
`,
  };
}

function shellHtml(opts: {
  name: string;
  description?: string;
  picturePath?: string | null;
  startUrl?: string;
}) {
  const picture = opts.picturePath
    ? `<img src="${opts.picturePath}" alt="" />`
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
    img { width: 100%; border-radius: 16px; display: block; outline: 1px solid rgba(244,242,236,.12); outline-offset: -1px; }
    h1 { font-weight: 400; font-size: 42px; letter-spacing: -0.03em; margin: 28px 0 8px; }
    p { margin: 0; color: #8a8882; line-height: 1.5; }
    .by { margin-top: 36px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #5c5b56; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <main>
    <div class="card">
      ${picture}
      <h1>${escapeHtml(opts.name)}</h1>
      <p>${escapeHtml(opts.description || "Forged by Kaji.")}</p>
      <div class="by">Kaji</div>
    </div>
  </main>
</body>
</html>
`;
}

function escapeHtml(value: string) {
  const amp = "\u0026";
  return value
    .replaceAll(amp, amp + "amp;")
    .replaceAll("<", amp + "lt;")
    .replaceAll(">", amp + "gt;")
    .replaceAll('"', amp + "quot;");
}

function mainJs(opts: { productName: string; width: number; height: number; startUrl?: string }) {
  const load = opts.startUrl
    ? `win.loadURL(${JSON.stringify(opts.startUrl)});`
    : `win.loadFile(path.join(__dirname, "app", "index.html"));`;
  return `const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: ${opts.width},
    height: ${opts.height},
    title: ${JSON.stringify(opts.productName)},
    autoHideMenuBar: true,
    backgroundColor: "#0b0b0c",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  ${load}
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
`;
}

export async function buildDesktopZip(opts: {
  name: string;
  analysis: Analysis;
  plan: ForgePlan;
  platform: Platform;
  iconDataUrl: string | null;
  pictureDataUrl: string | null;
}) {
  const zip = new JSZip();
  const slug = slugify(opts.name);
  const root = zip.folder(opts.name) ?? zip;
  const platformLabel =
    opts.platform === "macos" ? "macOS" : opts.platform === "windows" ? "Windows" : "Linux";

  let iconPath: string | null = null;
  if (opts.iconDataUrl) {
    iconPath = addDataUrl(root, `icon.${extFromDataUrl(opts.iconDataUrl)}`, opts.iconDataUrl);
  }
  let pictureRel: string | null = null;
  if (opts.pictureDataUrl) {
    const saved = addDataUrl(
      root,
      `app/cover.${extFromDataUrl(opts.pictureDataUrl)}`,
      opts.pictureDataUrl,
    );
    if (saved) pictureRel = saved.replace(/^app\//, "");
  }

  root.file(
    "package.json",
    JSON.stringify(
      {
        name: slug,
        productName: opts.name,
        version: "1.0.0",
        private: true,
        main: "main.cjs",
        scripts: { start: "electron ." },
        devDependencies: { electron: "^33.4.0" },
      },
      null,
      2,
    ),
  );
  root.file(
    "main.cjs",
    mainJs({
      productName: opts.name,
      width: opts.plan.window.width,
      height: opts.plan.window.height,
      startUrl: opts.analysis.startUrl,
    }),
  );
  root.file(
    "preload.cjs",
    `const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("kaji", { forged: true });
`,
  );
  root.file(
    "app/index.html",
    shellHtml({
      name: opts.name,
      description: opts.analysis.description,
      picturePath: pictureRel,
      startUrl: opts.analysis.startUrl,
    }),
  );
  root.file(
    "kaji.json",
    JSON.stringify(
      {
        name: opts.name,
        platform: opts.platform,
        analysis: opts.analysis,
        plan: opts.plan,
        icon: iconPath,
        forgedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  const boot = launcher(opts.platform, opts.name);
  root.file(boot.name, boot.body, boot.unixPermissions ? { unixPermissions: boot.unixPermissions } : undefined);

  const openHow =
    opts.platform === "windows"
      ? "Double-click Start.bat."
      : opts.platform === "macos"
        ? "Double-click Start.command."
        : "Run ./start.sh.";

  root.file(
    "README.txt",
    `${opts.name}
Forged by Kaji for ${platformLabel}.

${openHow}
The first launch prepares the runtime. After that, it opens like any other app.

Window ${opts.plan.window.width}×${opts.plan.window.height}
${opts.analysis.framework} · ${opts.analysis.language}
`,
  );

  const blob = await zip.generateAsync({
    type: "blob",
    platform: opts.platform === "windows" ? "DOS" : "UNIX",
  });
  return { blob, filename: `${slug}-1.0.0-${opts.platform}.zip` };
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}
