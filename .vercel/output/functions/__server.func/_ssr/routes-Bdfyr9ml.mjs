import { i as __toESM } from "../_runtime.mjs";
import { y as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as slugify, i as heuristicNotes, n as detectProject, r as hashSeed, t as cn } from "./detect-B61kcKp4.mjs";
import { a as Folder, c as ArrowLeft, i as Image$1, n as Scan, o as Download, r as Paperclip, s as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bdfyr9ml.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function DesktopWindow({ name, icon, picture, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-10 items-center gap-3 px-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					"aria-hidden": true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-fg/25" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-fg/15" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-fg/10" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-1 items-center justify-center gap-2",
					children: [icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: icon,
						alt: "",
						className: "size-4 rounded-sm outline outline-1 -outline-offset-1 outline-fg/10"
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-xs text-muted",
						children: name || "Untitled"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative aspect-video bg-elevated",
			children: children ?? (picture ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: picture,
				alt: "",
				className: "absolute inset-0 size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 grid place-items-center text-sm text-subtle",
				children: name || "Your app"
			}))
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 font-medium transition-[opacity,transform,background-color,box-shadow,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			primary: "bg-accent text-accent-fg hover:opacity-90",
			ghost: "bg-transparent text-fg hover:bg-elevated",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			quiet: "bg-transparent text-muted hover:text-fg"
		},
		size: {
			sm: "h-10 rounded-md px-3 text-sm",
			md: "h-11 rounded-md px-4 text-sm",
			lg: "h-12 rounded-lg px-5 text-base",
			xl: "h-14 rounded-xl px-6 text-base"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function concat(parts) {
	const total = parts.reduce((n, p) => n + p.length, 0);
	const out = new Uint8Array(total);
	let offset = 0;
	for (const p of parts) {
		out.set(p, offset);
		offset += p.length;
	}
	return out;
}
function u32(value) {
	const buf = /* @__PURE__ */ new Uint8Array(4);
	new DataView(buf.buffer).setUint32(0, value, true);
	return buf;
}
function align4(n) {
	return n + 3 & -4;
}
function pickleUInt32(value) {
	return concat([u32(4), u32(value)]);
}
function pickleString(value) {
	const str = new TextEncoder().encode(value);
	const payload = align4(4 + str.length);
	const buf = new Uint8Array(4 + payload);
	const view = new DataView(buf.buffer);
	view.setUint32(0, payload, true);
	view.setUint32(4, str.length, true);
	buf.set(str, 8);
	return buf;
}
function ensureDir(root, parts) {
	let dir = root;
	for (const part of parts) {
		const existing = dir.files[part];
		if (existing && "files" in existing) dir = existing;
		else {
			const next = { files: {} };
			dir.files[part] = next;
			dir = next;
		}
	}
	return dir;
}
/** Pack a map of archive paths → bytes into an Electron asar buffer (resources.neu). */
function packAsar(files) {
	const header = { files: {} };
	const blobs = [];
	let offset = 0;
	const names = Object.keys(files).sort();
	for (const name of names) {
		const data = files[name];
		const parts = name.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter(Boolean);
		if (parts.length === 0) continue;
		const base = parts.pop();
		const dir = ensureDir(header, parts);
		dir.files[base] = {
			size: data.length,
			offset: String(offset)
		};
		blobs.push(data);
		offset += data.length;
	}
	const headerPickle = pickleString(JSON.stringify(header));
	return concat([
		pickleUInt32(headerPickle.length),
		headerPickle,
		...blobs
	]);
}
function utf8(value) {
	return new TextEncoder().encode(value);
}
var RUNTIME = {
	windows: "/kaji-runtime/neutralino-win_x64.exe",
	macos: "/kaji-runtime/neutralino-mac_universal",
	linux: "/kaji-runtime/neutralino-linux_x64",
	client: "/kaji-runtime/neutralino.js"
};
var runtimeCache = /* @__PURE__ */ new Map();
async function loadRuntime(path) {
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
function fileSafe(name) {
	return name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "").trim() || slugify(name);
}
function appId(name) {
	return `app.kaji.${slugify(name).replace(/[^a-z0-9-]/g, "") || "app"}`;
}
function escapeHtml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function decodeDataUrl(dataUrl) {
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
function decodeAsset(asset) {
	if (asset.encoding === "base64") {
		const binary = atob(asset.content);
		const out = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
		return out;
	}
	return utf8(asset.content);
}
async function rasterIcon(dataUrl) {
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
			canvas.toBlob((blob) => {
				if (!blob) {
					resolve(raw);
					return;
				}
				blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
			}, "image/png");
		};
		img.onerror = () => resolve(raw);
		img.src = dataUrl;
	});
}
function makeConfig(opts) {
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
		logging: {
			enabled: false,
			writeToLogFile: false
		},
		nativeAllowList: ["app.*", "window.*"],
		modes: { window: {
			title: opts.name,
			width: opts.width,
			height: opts.height,
			minWidth: 480,
			minHeight: 320,
			fullScreen: false,
			alwaysOnTop: false,
			icon: opts.icon ? "/resources/icons/app.png" : void 0,
			enableInspector: false,
			borderless: false,
			maximize: false,
			hidden: false,
			resizable: true,
			exitProcessOnClose: true,
			center: true
		} },
		cli: {
			binaryName: opts.slug,
			resourcesPath: "/resources/",
			clientLibrary: "/resources/js/neutralino.js",
			binaryVersion: "6.9.0",
			clientVersion: "6.9.0"
		}
	};
}
function infoPlist(opts) {
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
async function buildDesktopZip(opts) {
	const name = opts.name.trim() || "App";
	const slug = slugify(name);
	const safe = fileSafe(name);
	const startUrl = opts.analysis.startUrl;
	const remote = opts.kind === "url" && Boolean(startUrl && /^https?:\/\//i.test(startUrl));
	const asarFiles = {};
	let iconPacked = false;
	if (opts.iconDataUrl) {
		const png = await rasterIcon(opts.iconDataUrl);
		if (png) {
			asarFiles["resources/icons/app.png"] = png;
			iconPacked = true;
		}
	}
	if (remote) {} else if (opts.assets?.length) for (const asset of opts.assets) {
		const rel = asset.path.replace(/^\/+/, "");
		if (!rel) continue;
		asarFiles[`resources/${rel}`] = decodeAsset(asset);
	}
	else throw new Error("Nothing compiled to wrap.");
	const config = makeConfig({
		name,
		slug,
		width: opts.plan.window.width,
		height: opts.plan.window.height,
		url: remote ? startUrl : "/",
		enableServer: !remote,
		icon: iconPacked
	});
	asarFiles["neutralino.config.json"] = utf8(JSON.stringify(config));
	const resourcesNeu = packAsar(asarFiles);
	const binary = await loadRuntime(RUNTIME[opts.platform]);
	const zip = new import_lib.default();
	if (opts.platform === "windows") {
		zip.file(`${safe}.exe`, binary, { binary: true });
		zip.file("resources.neu", resourcesNeu, { binary: true });
		zip.file("Read me.txt", `Double-click ${safe}.exe to open ${name}.\nNo Visual Studio. No Node. No install wizard.\nWindows 10 or 11 with Microsoft Edge is enough.\n`);
	} else if (opts.platform === "macos") {
		const app = `${safe}.app`;
		zip.file(`${app}/Contents/Info.plist`, infoPlist({
			name,
			slug,
			id: appId(name)
		}));
		zip.file(`${app}/Contents/MacOS/${slug}`, binary, {
			binary: true,
			unixPermissions: 493
		});
		zip.file(`${app}/Contents/MacOS/resources.neu`, resourcesNeu, { binary: true });
		zip.file(`${app}/Contents/PkgInfo`, "APPL????");
		zip.file("Read me.txt", `Double-click ${safe}.app to open ${name}.\nFirst launch: right-click the app, choose Open, then Open again.\n`);
	} else {
		zip.file(slug, binary, {
			binary: true,
			unixPermissions: 493
		});
		zip.file("resources.neu", resourcesNeu, { binary: true });
		zip.file(`${slug}.desktop`, `[Desktop Entry]
Type=Application
Name=${name}
Exec=./${slug}
Icon=applications-internet
Terminal=false
Categories=Utility;
`);
		zip.file("Read me.txt", `Run ./${slug} to open ${name}.\nchmod +x ${slug} if your archive tool dropped the execute bit.\n`);
	}
	return {
		blob: await zip.generateAsync({
			type: "blob",
			platform: opts.platform === "windows" ? "DOS" : "UNIX",
			compression: "DEFLATE",
			compressionOptions: { level: 6 }
		}),
		filename: opts.platform === "windows" ? `${slug}-windows.zip` : opts.platform === "macos" ? `${slug}-macos.zip` : `${slug}-linux.zip`
	};
}
function triggerDownload(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function letterIcon(name) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="52" fill="#141414"/>
  <rect x="12" y="12" width="232" height="232" rx="42" fill="none" stroke="#ece8df" stroke-width="3" opacity="0.35"/>
  <text x="128" y="172" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="132" fill="#ece8df">${escapeXml((name.trim().charAt(0) || "K").toUpperCase())}</text>
</svg>`;
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function geometricCover(name) {
	const rnd = mulberry(hashSeed(name || "kaji"));
	const bars = Array.from({ length: 5 }, (_, i) => {
		const x = 80 + rnd() * 1040;
		const y = 70 + rnd() * 420;
		const w = 120 + rnd() * 280;
		const h = 16 + rnd() * 90;
		const o = .12 + rnd() * .28;
		return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="#ece8df" opacity="${o.toFixed(2)}"/>`;
	});
	const windowX = 180 + rnd() * 120;
	const windowY = 90 + rnd() * 40;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#0b0b0c"/>
  <rect x="${windowX}" y="${windowY}" width="840" height="450" rx="18" fill="#141414" stroke="#ece8df" stroke-opacity="0.22"/>
  <circle cx="${windowX + 28}" cy="${windowY + 24}" r="5" fill="#ece8df" opacity="0.35"/>
  <circle cx="${windowX + 46}" cy="${windowY + 24}" r="5" fill="#ece8df" opacity="0.22"/>
  <circle cx="${windowX + 64}" cy="${windowY + 24}" r="5" fill="#ece8df" opacity="0.14"/>
  <text x="${windowX + 84}" y="${windowY + 29}" font-family="Georgia, serif" font-size="16" fill="#ece8df" opacity="0.55">${escapeXml(name || "Kaji")}</text>
  <rect x="${windowX + 24}" y="${windowY + 48}" width="792" height="1" fill="#ece8df" opacity="0.12"/>
  ${bars.join("\n  ")}
  <rect x="${windowX + 40}" y="${windowY + 80}" width="200" height="330" rx="10" fill="#ece8df" opacity="0.05"/>
  <rect x="${windowX + 260}" y="${windowY + 80}" width="540" height="70" rx="8" fill="#ece8df" opacity="0.08"/>
  <rect x="${windowX + 260}" y="${windowY + 170}" width="260" height="180" rx="8" fill="#ece8df" opacity="0.06"/>
  <rect x="${windowX + 540}" y="${windowY + 170}" width="260" height="180" rx="8" fill="#ece8df" opacity="0.06"/>
</svg>`;
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
function mulberry(seed) {
	let s = seed || 1;
	return () => {
		s += 1831565813;
		let t = Math.imul(s ^ s >>> 15, 1 | s);
		t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function escapeXml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function looksLikeIcon(path) {
	const n = path.toLowerCase();
	return /(^|\/)(icon|logo|app-icon|favicon)s?(\.|$)/.test(n);
}
function looksLikePicture(path) {
	const n = path.toLowerCase();
	return /(screenshot|preview|cover|hero|banner|promo)/.test(n);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var inspectUrl = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("7a5d44b7352bf7aa960bbbc4866e5fa04de0ef887dcd1e0fa7de50fbc0613eda"));
var vitePkg = (name) => JSON.stringify({
	name,
	private: true,
	type: "module",
	scripts: {
		dev: "vite",
		build: "vite build",
		preview: "vite preview"
	},
	dependencies: {
		react: "^19.0.0",
		"react-dom": "^19.0.0"
	},
	devDependencies: {
		vite: "^6.0.0",
		"@vitejs/plugin-react": "^4.3.0"
	}
}, null, 2);
var viteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });
`;
var indexHtml = (title) => `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>
`;
var mainTsx = `import { createRoot } from "react-dom/client";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(<App />);
`;
var SAMPLES = [
	{
		id: "north",
		name: "North",
		blurb: "React + Vite",
		files: {
			"package.json": vitePkg("north"),
			"index.html": indexHtml("North"),
			"vite.config.ts": viteConfig,
			"src/main.tsx": mainTsx,
			"src/App.tsx": `import "./app.css";

const rows = [
  ["N-104", "Wool coat", "On hand"],
  ["N-221", "Field notebook", "Low"],
  ["N-308", "Brass lamp", "On hand"],
];

export function App() {
  return (
    <main>
      <header>
        <p>Inventory</p>
        <h1>North</h1>
      </header>
      <table>
        <thead>
          <tr>
            <th>Sku</th>
            <th>Item</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell) => (
                <td key={cell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
`,
			"src/app.css": `html, body, #root { margin: 0; min-height: 100%; background: #0b0b0c; color: #f4f2ec; font-family: Georgia, serif; }
main { padding: 48px 40px; }
header p { margin: 0; letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; color: #8a8882; font-family: system-ui, sans-serif; }
h1 { font-weight: 400; font-size: 48px; letter-spacing: -0.04em; margin: 8px 0 32px; }
table { width: min(640px, 100%); border-collapse: collapse; }
th, td { text-align: left; padding: 12px 0; border-bottom: 1px solid #2a2a2c; }
th { font-family: system-ui, sans-serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8a8882; font-weight: 500; }
`
		}
	},
	{
		id: "quill",
		name: "Quill",
		blurb: "Static site",
		files: {
			"index.html": `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Quill</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <article>
      <h1>Quill</h1>
      <p>A place to write without the rest of the internet.</p>
    </article>
  </body>
</html>`,
			"styles.css": `html, body { margin: 0; background: #0b0b0c; color: #f4f2ec; font-family: Georgia, serif; }
article { max-width: 36rem; margin: 20vh auto; padding: 0 1.5rem; }
h1 { font-weight: 400; letter-spacing: -0.03em; }
`
		}
	},
	{
		id: "harbor",
		name: "Harbor",
		blurb: "React + Vite",
		files: {
			"package.json": vitePkg("harbor"),
			"index.html": indexHtml("Harbor"),
			"vite.config.ts": viteConfig,
			"src/main.tsx": mainTsx,
			"src/App.tsx": `import "./app.css";

const tide = [
  ["06:40", "Skua", "In"],
  ["08:15", "Lark", "Out"],
  ["11:05", "Tern", "In"],
];

export function App() {
  return (
    <main>
      <p>Today</p>
      <h1>Harbor</h1>
      <ul>
        {tide.map(([time, name, dir]) => (
          <li key={time}>
            <span>{time}</span>
            <strong>{name}</strong>
            <em>{dir}</em>
          </li>
        ))}
      </ul>
    </main>
  );
}
`,
			"src/app.css": `html, body, #root { margin: 0; min-height: 100%; background: #0b0b0c; color: #f4f2ec; font-family: Georgia, serif; }
main { padding: 48px 40px; }
p { margin: 0; letter-spacing: 0.18em; text-transform: uppercase; font-size: 11px; color: #8a8882; font-family: system-ui, sans-serif; }
h1 { font-weight: 400; font-size: 48px; letter-spacing: -0.04em; margin: 8px 0 32px; }
ul { list-style: none; padding: 0; margin: 0; width: min(420px, 100%); }
li { display: grid; grid-template-columns: 4.5rem 1fr 3rem; gap: 12px; padding: 14px 0; border-bottom: 1px solid #2a2a2c; }
em { font-style: normal; color: #8a8882; }
`
		}
	}
];
function getSample(id) {
	return SAMPLES.find((s) => s.id === id);
}
var HISTORY_KEY = "kaji.history";
function readHistory() {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = localStorage.getItem(HISTORY_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
	} catch {
		return [];
	}
}
function writeHistory(items) {
	try {
		localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 6)));
	} catch {}
}
var emptyPlatforms = {
	windows: true,
	macos: true,
	linux: true
};
function applyProject(analysis, files, images) {
	const name = analysis.suggestedName;
	let icon = letterIcon(name);
	let picture = geometricCover(name);
	if (images) {
		const iconHit = images.find((i) => looksLikeIcon(i.path));
		const picHit = images.find((i) => looksLikePicture(i.path)) || images[0];
		if (iconHit) icon = iconHit.dataUrl;
		if (picHit && !looksLikeIcon(picHit.path)) picture = picHit.dataUrl;
	}
	return {
		analysis,
		files,
		name,
		iconDataUrl: icon,
		pictureDataUrl: picture
	};
}
var useKaji = create((set, get) => ({
	stage: "drop",
	analyzing: false,
	forging: false,
	error: null,
	name: "",
	iconDataUrl: null,
	pictureDataUrl: null,
	platforms: { ...emptyPlatforms },
	analysis: null,
	files: {},
	plan: null,
	builtAssets: null,
	buildKind: null,
	history: [],
	ingestUrl: async (raw) => {
		set({
			analyzing: true,
			error: null
		});
		try {
			const result = await inspectUrl({ data: { url: raw } });
			if (!result.ok) {
				set({
					analyzing: false,
					error: result.error
				});
				return;
			}
			set({
				...applyProject(result.analysis, result.files),
				analyzing: false,
				error: null,
				stage: "set",
				plan: null,
				builtAssets: null,
				buildKind: null
			});
		} catch {
			set({
				analyzing: false,
				error: "Could not open that project. Try a sample, or drop the files."
			});
		}
	},
	ingestSample: (id) => {
		const sample = getSample(id);
		if (!sample) {
			set({ error: "That sample is missing." });
			return;
		}
		set({
			...applyProject(detectProject(sample.files, {
				sourceKind: "sample",
				sourceLabel: sample.name,
				suggestedName: sample.name
			}), sample.files),
			error: null,
			analyzing: false,
			stage: "set",
			plan: null,
			builtAssets: null,
			buildKind: null
		});
	},
	ingestFiles: (files, images) => {
		const keys = Object.keys(files);
		if (keys.length === 0 && (!images || images.length === 0)) {
			set({ error: "Nothing readable in that drop." });
			return;
		}
		const folder = keys[0]?.split(/[/\\]/)[0];
		set({
			...applyProject(detectProject(files, {
				sourceKind: "files",
				sourceLabel: folder || "Dropped project",
				suggestedName: folder
			}), files, images),
			error: null,
			analyzing: false,
			stage: "set",
			plan: null,
			builtAssets: null,
			buildKind: null
		});
	},
	setName: (name) => {
		const current = get();
		const next = { name };
		if (current.iconDataUrl && current.iconDataUrl.startsWith("data:image/svg+xml")) next.iconDataUrl = letterIcon(name || "K");
		set(next);
	},
	setIcon: (iconDataUrl) => set({ iconDataUrl }),
	setPicture: (pictureDataUrl) => set({ pictureDataUrl }),
	togglePlatform: (p) => {
		const platforms = {
			...get().platforms,
			[p]: !get().platforms[p]
		};
		if (!platforms.windows && !platforms.macos && !platforms.linux) return;
		set({ platforms });
	},
	goSet: () => {
		if (get().analysis) set({
			stage: "set",
			error: null
		});
	},
	goDrop: () => {
		if (get().forging) return;
		set({
			stage: "drop",
			error: null
		});
	},
	startForge: () => {
		const { name, analysis, platforms } = get();
		if (!analysis || !name.trim()) {
			set({ error: "Give the application a name." });
			return;
		}
		if (!platforms.windows && !platforms.macos && !platforms.linux) {
			set({ error: "Choose at least one platform." });
			return;
		}
		set({
			stage: "forge",
			forging: true,
			error: null,
			builtAssets: null,
			buildKind: null
		});
	},
	finishForge: (plan, built) => {
		const { name, analysis, history } = get();
		const item = {
			id: crypto.randomUUID(),
			name: name.trim(),
			framework: analysis?.framework || "App",
			at: Date.now()
		};
		const nextHistory = [item, ...history.filter((h) => h.name !== item.name)].slice(0, 6);
		writeHistory(nextHistory);
		set({
			plan,
			builtAssets: built.assets,
			buildKind: built.kind,
			forging: false,
			stage: "done",
			history: nextHistory
		});
	},
	failForge: (message) => set({
		forging: false,
		error: message,
		stage: "set"
	}),
	loadHistory: () => set({ history: readHistory() }),
	reset: () => set({
		stage: "drop",
		analyzing: false,
		forging: false,
		error: null,
		name: "",
		iconDataUrl: null,
		pictureDataUrl: null,
		platforms: { ...emptyPlatforms },
		analysis: null,
		files: {},
		plan: null,
		builtAssets: null,
		buildKind: null
	})
}));
var PLATFORM_LABEL = {
	windows: "Windows",
	macos: "macOS",
	linux: "Linux"
};
var PLATFORM_ARTIFACT = {
	windows: ".exe",
	macos: ".app",
	linux: ""
};
var KIND_LABEL = {
	vite: "Compiled with Vite",
	static: "Packed as static files",
	url: "Live site in a native window"
};
function DoneStage() {
	const analysis = useKaji((s) => s.analysis);
	const plan = useKaji((s) => s.plan);
	const name = useKaji((s) => s.name);
	const iconDataUrl = useKaji((s) => s.iconDataUrl);
	const pictureDataUrl = useKaji((s) => s.pictureDataUrl);
	const platforms = useKaji((s) => s.platforms);
	const files = useKaji((s) => s.files);
	const builtAssets = useKaji((s) => s.builtAssets);
	const buildKind = useKaji((s) => s.buildKind);
	const reset = useKaji((s) => s.reset);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const selected = Object.keys(platforms).filter((p) => platforms[p]);
	async function pack(platform) {
		if (!analysis || !plan) throw new Error("missing");
		return buildDesktopZip({
			name: name.trim(),
			analysis,
			plan,
			platform,
			iconDataUrl,
			pictureDataUrl,
			files,
			assets: builtAssets,
			kind: buildKind
		});
	}
	async function download(platform) {
		setBusy(platform);
		try {
			const built = await pack(platform);
			triggerDownload(built.blob, built.filename);
			toast.success(`${PLATFORM_LABEL[platform]}${PLATFORM_ARTIFACT[platform] ? ` ${PLATFORM_ARTIFACT[platform]}` : ""} is ready`);
		} catch {
			toast.error("Could not compile that build.");
		} finally {
			setBusy(null);
		}
	}
	async function downloadAll() {
		setBusy("all");
		try {
			for (const p of selected) {
				const built = await pack(p);
				triggerDownload(built.blob, built.filename);
			}
			toast.success("All builds are ready");
		} catch {
			toast.error("Could not compile those builds.");
		} finally {
			setBusy(null);
		}
	}
	if (!analysis || !plan) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid w-full max-w-6xl flex-1 gap-10 px-5 pb-28 pt-2 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm tracking-[0.22em] text-muted uppercase",
				children: "Done"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "mt-2 font-display text-4xl tracking-tight sm:text-6xl",
				children: [name.trim(), " is forged."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-md text-muted",
				children: "Compiled to a standalone desktop app. Download, unzip, and double-click. No Visual Studio. No Node. No terminal."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap",
				children: [selected.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					variant: p === selected[0] ? "primary" : "outline",
					className: "min-w-40",
					disabled: busy !== null,
					onClick: () => download(p),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "size-4",
						strokeWidth: 1.75
					}), busy === p ? "Compiling" : PLATFORM_ARTIFACT[p] ? `${PLATFORM_LABEL[p]} (${PLATFORM_ARTIFACT[p]})` : PLATFORM_LABEL[p]]
				}, p)), selected.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: "ghost",
					disabled: busy !== null,
					onClick: downloadAll,
					children: busy === "all" ? "Compiling" : "All platforms"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-10 grid gap-4 text-sm sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "What it is",
						value: `${analysis.framework} · ${analysis.language}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Forge",
						value: buildKind ? KIND_LABEL[buildKind] : "Native window"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Window",
						value: `${plan.window.width} × ${plan.window.height}`
					}),
					analysis.entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Entry",
						value: analysis.entry
					}) : null
				]
			}),
			plan.notes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 space-y-2 text-sm text-muted",
				children: plan.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note }, note))
			}) : null,
			plan.caveats.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-1 text-sm text-subtle",
				children: plan.caveats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: c }, c))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "quiet",
				className: "mt-10 -ml-2",
				onClick: reset,
				children: "Forge another"
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopWindow, {
			name: name.trim(),
			icon: iconDataUrl,
			picture: pictureDataUrl,
			className: "reveal"
		})]
	});
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs tracking-[0.16em] text-subtle uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-1 truncate text-fg",
		children: value
	})] });
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("h-12 w-full rounded-lg bg-elevated px-4 text-base text-fg placeholder:text-subtle shadow-[var(--shadow-border)]", "transition-[box-shadow] duration-150 ease-out", "focus-visible:outline-none focus-visible:shadow-[var(--shadow-border-hover)]", "disabled:opacity-50", className),
		...props
	});
}
var SKIP = /(^|\/)(node_modules|\.git|dist|build|\.next|coverage|\.turbo|vendor)(\/|$)/i;
var TEXT_OK = /\.(json|html?|css|js|jsx|ts|tsx|mjs|cjs|md|txt|toml|ya?ml|lock|svg|vue|svelte|xml|env|gitignore|npmrc)$/i;
var TEXT_NAMES = /^(dockerfile|makefile|license|readme)$/i;
var IMAGE_OK = /\.(png|jpe?g|gif|webp|svg|ico)$/i;
var MAX_FILES = 80;
var MAX_TEXT = 2e5;
function shouldKeep(path) {
	const clean = path.replace(/\\/g, "/");
	if (SKIP.test(clean)) return false;
	const base = clean.split("/").pop() || "";
	return TEXT_OK.test(base) || TEXT_NAMES.test(base) || IMAGE_OK.test(base);
}
function isText(path) {
	const base = path.split("/").pop() || "";
	return TEXT_OK.test(base) || TEXT_NAMES.test(base) || /\.svg$/i.test(base);
}
async function fileAsText(file) {
	const buf = await file.arrayBuffer();
	if (buf.byteLength > MAX_TEXT) return new TextDecoder().decode(buf.slice(0, MAX_TEXT));
	return new TextDecoder().decode(buf);
}
async function fileAsDataUrl(file) {
	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(reader.error);
		reader.onload = () => resolve(String(reader.result || ""));
		reader.readAsDataURL(file);
	});
}
async function unpackZip(file) {
	const zip = await import_lib.default.loadAsync(file);
	const files = {};
	const images = [];
	const entries = Object.values(zip.files).filter((e) => !e.dir && shouldKeep(e.name));
	for (const entry of entries.slice(0, MAX_FILES)) if (IMAGE_OK.test(entry.name) && !/\.svg$/i.test(entry.name)) {
		const buf = await entry.async("base64");
		const mime = entry.name.match(/\.png$/i) ? "image/png" : entry.name.match(/\.webp$/i) ? "image/webp" : entry.name.match(/\.gif$/i) ? "image/gif" : "image/jpeg";
		images.push({
			path: entry.name,
			dataUrl: `data:${mime};base64,${buf}`
		});
	} else if (isText(entry.name)) files[entry.name] = await entry.async("string");
	return {
		files,
		images
	};
}
async function readFileList(list) {
	const arr = Array.from(list);
	const files = {};
	const images = [];
	for (const file of arr) {
		if (file.name.toLowerCase().endsWith(".zip")) {
			const unpacked = await unpackZip(file);
			Object.assign(files, unpacked.files);
			images.push(...unpacked.images);
			continue;
		}
		const rel = file.webkitRelativePath || file.name;
		if (!shouldKeep(rel)) continue;
		if (IMAGE_OK.test(rel) && !/\.svg$/i.test(rel)) images.push({
			path: rel,
			dataUrl: await fileAsDataUrl(file)
		});
		else if (isText(rel)) files[rel] = await fileAsText(file);
		if (Object.keys(files).length + images.length >= MAX_FILES) break;
	}
	return {
		files,
		images
	};
}
function uriFromDrop(event) {
	const text = (event.dataTransfer?.getData("text/uri-list") || event.dataTransfer?.getData("text/plain"))?.trim();
	if (!text) return null;
	if (/^https?:\/\//i.test(text) || /github\.com/i.test(text) || /^[\w.-]+\/[\w.-]+$/.test(text)) return text.split("\n")[0]?.trim() || null;
	return null;
}
function DropStage() {
	const ingestUrl = useKaji((s) => s.ingestUrl);
	const ingestSample = useKaji((s) => s.ingestSample);
	const ingestFiles = useKaji((s) => s.ingestFiles);
	const analyzing = useKaji((s) => s.analyzing);
	const error = useKaji((s) => s.error);
	const history = useKaji((s) => s.history);
	const [value, setValue] = (0, import_react.useState)("");
	const [over, setOver] = (0, import_react.useState)(false);
	const filesRef = (0, import_react.useRef)(null);
	const folderRef = (0, import_react.useRef)(null);
	async function submitUrl(raw) {
		const next = raw.trim();
		if (!next || analyzing) return;
		await ingestUrl(next);
	}
	async function onSubmit(e) {
		e.preventDefault();
		await submitUrl(value);
	}
	async function onDrop(e) {
		e.preventDefault();
		setOver(false);
		if (analyzing) return;
		const uri = uriFromDrop(e.nativeEvent);
		if (uri) {
			setValue(uri);
			await submitUrl(uri);
			return;
		}
		if (e.dataTransfer.files?.length) {
			const read = await readFileList(e.dataTransfer.files);
			ingestFiles(read.files, read.images);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 pb-28 pt-6 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "reveal text-sm tracking-[0.22em] text-muted uppercase",
				children: "Your code. Their desktop."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "reveal mt-4 font-display text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl",
				children: [
					"Drop a project.",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "italic",
						children: "Kaji does the rest."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "reveal mt-6 max-w-md text-base leading-relaxed text-muted delay-100",
				children: "Name it. Add an icon. Add a picture. Choose the platforms. Forge."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				onDragEnter: (e) => {
					e.preventDefault();
					setOver(true);
				},
				onDragOver: (e) => {
					e.preventDefault();
					setOver(true);
				},
				onDragLeave: () => setOver(false),
				onDrop,
				className: cn("reveal mt-10 rounded-2xl bg-surface p-3 delay-150 sm:p-4", "shadow-[var(--shadow-border)] transition-[box-shadow] duration-150", over && "shadow-[var(--shadow-border-hover)]"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "sr-only",
						htmlFor: "project-url",
						children: "GitHub repository or website URL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "project-url",
							value,
							onChange: (e) => setValue(e.target.value),
							placeholder: over ? "Release to open" : "github.com/you/project",
							disabled: analyzing,
							autoComplete: "off",
							spellCheck: false,
							className: "h-14 rounded-xl bg-elevated text-base sm:flex-1"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							size: "xl",
							disabled: analyzing || !value.trim(),
							className: "w-full shrink-0 sm:w-auto",
							children: [analyzing ? "Opening" : "Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "size-4",
								strokeWidth: 1.75
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-2 px-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: "Or"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "quiet",
								size: "sm",
								className: "h-11 px-2",
								onClick: () => filesRef.current?.click(),
								disabled: analyzing,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, {
									className: "size-3.5",
									strokeWidth: 1.75
								}), "Files"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "quiet",
								size: "sm",
								className: "h-11 px-2",
								onClick: () => folderRef.current?.click(),
								disabled: analyzing,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, {
									className: "size-3.5",
									strokeWidth: 1.75
								}), "Folder"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: filesRef,
								type: "file",
								className: "sr-only",
								multiple: true,
								onChange: async (e) => {
									if (!e.target.files?.length) return;
									const read = await readFileList(e.target.files);
									ingestFiles(read.files, read.images);
									e.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: folderRef,
								type: "file",
								className: "sr-only",
								multiple: true,
								webkitdirectory: "",
								directory: "",
								onChange: async (e) => {
									if (!e.target.files?.length) return;
									const read = await readFileList(e.target.files);
									ingestFiles(read.files, read.images);
									e.target.value = "";
								}
							})
						]
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-danger",
				role: "alert",
				children: error
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-subtle",
				children: "Drop a folder, a zip, or paste any live site to wrap it."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "reveal mt-10 delay-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-subtle uppercase",
					children: "Try a crate"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: SAMPLES.map((sample) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: analyzing,
						onClick: () => ingestSample(sample.id),
						className: "flex h-11 items-center gap-3 rounded-lg bg-surface px-4 text-sm shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: sample.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: sample.blurb
						})]
					}, sample.id))
				})]
			}),
			history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs tracking-[0.18em] text-subtle uppercase",
					children: "Recent"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted",
					children: history.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: item.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-subtle",
						children: [" · ", item.framework]
					})] }, item.id))
				})]
			}) : null
		]
	});
}
function paths(files) {
	return Object.keys(files).map((p) => p.replace(/\\/g, "/").replace(/^\.\//, ""));
}
function hasFile(files, suffix) {
	const needle = suffix.toLowerCase();
	return paths(files).some((p) => p.toLowerCase() === needle || p.toLowerCase().endsWith("/" + needle));
}
function hasViteSource(files) {
	const html = hasFile(files, "index.html");
	const entry = hasFile(files, "src/main.tsx") || hasFile(files, "src/main.ts") || hasFile(files, "src/main.jsx") || hasFile(files, "src/main.js") || hasFile(files, "src/index.tsx") || hasFile(files, "src/index.ts") || hasFile(files, "src/index.jsx") || hasFile(files, "src/index.js") || hasFile(files, "src/App.tsx");
	const pkg = hasFile(files, "package.json");
	return html && entry && pkg;
}
function planBuild(analysis, files) {
	if (analysis.sourceKind === "url" && analysis.startUrl) return {
		kind: "url",
		packageManager: "npm",
		outDir: "",
		reason: "Live site — wrap the address in a native window."
	};
	if (hasViteSource(files) && (analysis.bundler === "Vite" || analysis.framework.includes("Vite") || hasFile(files, "vite.config.ts") || hasFile(files, "vite.config.js") || hasFile(files, "vite.config.mts"))) return {
		kind: "vite",
		packageManager: "npm",
		outDir: "dist",
		reason: "Install dependencies, run Vite, wrap dist/."
	};
	if (analysis.framework === "Static site" || hasFile(files, "index.html")) {
		if (analysis.framework === "Static site" || !analysis.buildCommand) return {
			kind: "static",
			packageManager: "npm",
			outDir: "",
			reason: "Static files — no compile step."
		};
	}
	if (analysis.startUrl && /^https?:\/\//i.test(analysis.startUrl)) return {
		kind: "url",
		packageManager: "npm",
		outDir: "",
		reason: "Source is not a Vite app; wrapping the live address."
	};
	return {
		kind: "none",
		reason: "Kaji forges Vite, React, and static sites. Drop a project with an index.html, or paste a live URL."
	};
}
var STATIC_EXT = /\.(html?|css|js|mjs|cjs|svg)$/i;
function staticAssetsFromFiles(files) {
	const entries = Object.entries(files).map(([path, content]) => ({
		path: path.replace(/\\/g, "/").replace(/^\.\//, ""),
		content
	}));
	const html = entries.find((e) => e.path.toLowerCase().endsWith("index.html"));
	const dir = html?.path.includes("/") ? html.path.slice(0, html.path.lastIndexOf("/") + 1) : "";
	const assets = [];
	for (const { path, content } of entries) {
		if (dir && !path.startsWith(dir)) continue;
		const rel = dir ? path.slice(dir.length) : path;
		if (!rel || !STATIC_EXT.test(rel)) continue;
		const base = rel.split("/").pop() || "";
		if (/^package(-lock)?\.json$/i.test(base)) continue;
		assets.push({
			path: rel,
			encoding: "utf8",
			content
		});
	}
	return assets;
}
createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("90f0238d0981348cc35948c8d1e89788d47bedbb92c75f99f95de535ab261262"));
var forgeJob = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("59c84470a2103de2db0f645c69a36714be92e5ac0bb08dd0e7944d4ea0ee73df"));
async function executeForge(opts) {
	const logs = [];
	const say = (line) => {
		logs.push(line);
		opts.log(line);
	};
	say("Opened the crate.");
	const exec = planBuild(opts.analysis, opts.files);
	if (exec.kind === "none") {
		say(exec.reason);
		return {
			ok: false,
			error: exec.reason,
			logs
		};
	}
	say(`Found ${opts.analysis.framework}.`);
	if (opts.analysis.bundler) say(`${opts.analysis.bundler}, ready.`);
	let assets = null;
	const kind = exec.kind;
	let plan = {
		window: {
			width: 1280,
			height: 800
		},
		notes: heuristicNotes(opts.analysis),
		caveats: []
	};
	if (exec.kind === "vite") {
		say("Opening an isolated sandbox.");
		say("Compiling.");
		const job = await forgeJob({ data: {
			analysis: opts.analysis,
			name: opts.name,
			files: opts.files,
			kind: "vite"
		} });
		plan = job.plan;
		if (!job.compile?.ok) {
			const extra = job.compile?.log ?? [];
			for (const line of extra) say(line);
			return {
				ok: false,
				error: job.compile?.error || "The project failed to compile.",
				logs
			};
		}
		for (const line of job.compile.log) say(line);
		assets = job.compile.assets;
		say("Wrapping the compiled app in a native window.");
	} else if (exec.kind === "static") {
		plan = (await forgeJob({ data: {
			analysis: opts.analysis,
			name: opts.name,
			files: {},
			kind: "static"
		} })).plan;
		assets = staticAssetsFromFiles(opts.files);
		if (!assets.length) return {
			ok: false,
			error: "No HTML to pack.",
			logs
		};
		say("Packing the site as-is.");
		say("Wrapping it in a native window.");
	} else {
		plan = (await forgeJob({ data: {
			analysis: opts.analysis,
			name: opts.name,
			files: {},
			kind: "url"
		} })).plan;
		say(`Pointing the window at ${opts.analysis.startUrl}.`);
	}
	say(`Stamped “${opts.name}”.`);
	say("Ready.");
	return {
		ok: true,
		kind,
		assets,
		plan,
		logs
	};
}
function ForgeStage() {
	const analysis = useKaji((s) => s.analysis);
	const files = useKaji((s) => s.files);
	const name = useKaji((s) => s.name);
	const iconDataUrl = useKaji((s) => s.iconDataUrl);
	const finishForge = useKaji((s) => s.finishForge);
	const failForge = useKaji((s) => s.failForge);
	const [lines, setLines] = (0, import_react.useState)(["Opened the crate."]);
	const [progress, setProgress] = (0, import_react.useState)(8);
	(0, import_react.useEffect)(() => {
		if (!analysis) {
			failForge("Nothing to forge.");
			return;
		}
		let cancelled = false;
		const log = (line) => {
			if (cancelled) return;
			setLines((prev) => prev[prev.length - 1] === line ? prev : [...prev, line]);
			setProgress((p) => Math.min(92, p + 10));
		};
		executeForge({
			analysis,
			files,
			name: name.trim() || "App",
			log
		}).then((result) => {
			if (cancelled) return;
			if (!result.ok) {
				failForge(result.error);
				return;
			}
			setProgress(100);
			finishForge(result.plan, {
				assets: result.assets,
				kind: result.kind
			});
		}).catch(() => {
			if (!cancelled) failForge("The forge could not finish.");
		});
		return () => {
			cancelled = true;
		};
	}, [
		analysis,
		failForge,
		files,
		finishForge,
		name
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 pb-28 pt-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-accent",
				style: { transform: `scaleX(${progress / 100})` },
				"aria-hidden": true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "forge-ring relative mb-10 grid size-28 place-items-center rounded-3xl bg-surface shadow-[var(--shadow-border)]",
				children: iconDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: iconDataUrl,
					alt: "",
					className: "size-16 rounded-2xl outline outline-1 -outline-offset-1 outline-fg/10"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-4xl",
					children: (name.trim().charAt(0) || "K").toUpperCase()
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs tracking-[0.22em] text-subtle uppercase",
				children: "Forging"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-4xl tracking-tight",
				children: name.trim() || "App"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 w-full min-h-40 self-stretch space-y-2 text-left font-mono text-sm",
				children: lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: i === lines.length - 1 ? "text-fg" : "text-muted",
					children: line
				}, `${i}-${line}`))
			})
		]
	});
}
function KajiHeader() {
	const reset = useKaji((s) => s.reset);
	const forging = useKaji((s) => s.forging);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "relative z-20 flex items-center justify-between px-5 py-5 sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => {
				if (!forging) reset();
			},
			className: "font-display text-2xl leading-none tracking-tight text-fg",
			"aria-label": "Kaji, start over",
			children: "Kaji"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-[0.18em] text-subtle uppercase",
			children: "Matorikusu"
		})]
	});
}
var PLATFORM_ORDER = [
	"windows",
	"macos",
	"linux"
];
async function readImage(file) {
	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = () => reject(reader.error);
		reader.onload = () => resolve(String(reader.result || ""));
		reader.readAsDataURL(file);
	});
}
function SetStage() {
	const analysis = useKaji((s) => s.analysis);
	const name = useKaji((s) => s.name);
	const setName = useKaji((s) => s.setName);
	const iconDataUrl = useKaji((s) => s.iconDataUrl);
	const pictureDataUrl = useKaji((s) => s.pictureDataUrl);
	const setIcon = useKaji((s) => s.setIcon);
	const setPicture = useKaji((s) => s.setPicture);
	const platforms = useKaji((s) => s.platforms);
	const togglePlatform = useKaji((s) => s.togglePlatform);
	const startForge = useKaji((s) => s.startForge);
	const goDrop = useKaji((s) => s.goDrop);
	const error = useKaji((s) => s.error);
	const iconRef = (0, import_react.useRef)(null);
	const pictureRef = (0, import_react.useRef)(null);
	if (!analysis) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid w-full max-w-6xl flex-1 gap-10 px-5 pb-28 pt-2 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "quiet",
				size: "sm",
				className: "mb-6 -ml-2",
				onClick: goDrop,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "size-4",
					strokeWidth: 1.75
				}), "Back"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: analysis.sourceKind === "url" ? analysis.sourceLabel : analysis.sourceKind === "github" ? analysis.repoUrl?.replace("https://", "") : analysis.sourceLabel
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 font-display text-4xl tracking-tight sm:text-5xl",
				children: "Set the stamp."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-md text-muted",
				children: [
					analysis.framework,
					" · ",
					analysis.language,
					analysis.bundler ? ` · ${analysis.bundler}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopWindow, {
					name: name || "Untitled",
					icon: iconDataUrl,
					picture: pictureDataUrl
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "app-name",
						className: "mb-2 block text-xs tracking-[0.16em] text-subtle uppercase",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "app-name",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "Application name",
						maxLength: 48
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadTile, {
								label: "Icon",
								hint: "Square mark",
								onClick: () => iconRef.current?.click(),
								children: iconDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: iconDataUrl,
									alt: "",
									className: "size-16 rounded-lg outline outline-1 -outline-offset-1 outline-fg/10"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, {
									className: "size-6 text-subtle",
									strokeWidth: 1.5
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadTile, {
								label: "Picture",
								hint: "Window cover",
								onClick: () => pictureRef.current?.click(),
								children: pictureDataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: pictureDataUrl,
									alt: "",
									className: "h-16 w-full rounded-md object-cover outline outline-1 -outline-offset-1 outline-fg/10"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image$1, {
									className: "size-6 text-subtle",
									strokeWidth: 1.5
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: iconRef,
								type: "file",
								accept: "image/*",
								className: "sr-only",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (file) setIcon(await readImage(file));
									e.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: pictureRef,
								type: "file",
								accept: "image/*",
								className: "sr-only",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									if (file) setPicture(await readImage(file));
									e.target.value = "";
								}
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs tracking-[0.16em] text-subtle uppercase",
						children: "Platforms"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: PLATFORM_ORDER.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => togglePlatform(p),
							className: cn("flex h-14 items-center justify-center rounded-lg text-sm transition-[box-shadow,background-color,color] duration-150", platforms[p] ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-[var(--shadow-border)] hover:text-fg"),
							children: PLATFORM_LABEL[p]
						}, p))
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						role: "alert",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "xl",
						className: "w-full",
						onClick: startForge,
						disabled: !name.trim(),
						children: "Forge"
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "reveal hidden lg:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesktopWindow, {
				name: name || "Untitled",
				icon: iconDataUrl,
				picture: pictureDataUrl
			}), analysis.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: analysis.description
			}) : null]
		})]
	});
}
function UploadTile({ label, hint, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: "flex min-h-28 flex-col items-start gap-3 rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs tracking-[0.16em] text-subtle uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex w-full items-center justify-center",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: hint
			})
		]
	});
}
var STEPS = [
	{
		id: "drop",
		n: "01",
		label: "Drop"
	},
	{
		id: "set",
		n: "02",
		label: "Set"
	},
	{
		id: "forge",
		n: "03",
		label: "Forge"
	},
	{
		id: "done",
		n: "04",
		label: "Done"
	}
];
var ORDER = [
	"drop",
	"set",
	"forge",
	"done"
];
function StageRail() {
	const stage = useKaji((s) => s.stage);
	const analysis = useKaji((s) => s.analysis);
	const plan = useKaji((s) => s.plan);
	const forging = useKaji((s) => s.forging);
	const goDrop = useKaji((s) => s.goDrop);
	const goSet = useKaji((s) => s.goSet);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Forge stages",
		className: "pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "pointer-events-auto flex items-center gap-1 rounded-xl bg-bg/80 px-2 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm sm:gap-2 sm:px-3",
			children: STEPS.map((step) => {
				const active = step.id === stage;
				const done = ORDER.indexOf(step.id) < ORDER.indexOf(stage);
				const canGo = !forging && (step.id === "drop" || step.id === "set" && analysis || step.id === "done" && plan);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: !canGo || active,
					onClick: () => {
						if (step.id === "drop") goDrop();
						if (step.id === "set") goSet();
						if (step.id === "done" && plan) useKaji.setState({ stage: "done" });
					},
					className: cn("flex h-11 min-w-11 items-center gap-2 rounded-lg px-2.5 text-xs tracking-wide sm:px-3", active && "text-fg", !active && done && "text-muted", !active && !done && "text-subtle", canGo && !active && "hover:text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono tabular-nums",
						children: step.n
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: step.label
					})]
				}) }, step.id);
			})
		})
	});
}
function KajiApp() {
	const stage = useKaji((s) => s.stage);
	const loadHistory = useKaji((s) => s.loadHistory);
	(0, import_react.useEffect)(() => {
		loadHistory();
	}, [loadHistory]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KajiHeader, {}),
			stage === "drop" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropStage, {}) : null,
			stage === "set" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetStage, {}) : null,
			stage === "forge" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForgeStage, {}) : null,
			stage === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoneStage, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageRail, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "bottom-center",
				toastOptions: { className: "!bg-elevated !text-fg !border-border !font-sans" }
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KajiApp, {});
}
//#endregion
export { Home as component };
