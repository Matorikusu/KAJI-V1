import { i as __toESM } from "../_runtime.mjs";
import { y as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as heuristicNotes, i as hashSeed, n as detectProject, o as slugify, r as forgeLogLines, t as cn } from "./detect-4ghxlhvC.mjs";
import { a as Folder, c as ArrowLeft, i as Image, n as Scan, o as Download, r as Paperclip, s as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CJfR8zIZ.js
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
function extFromDataUrl(dataUrl) {
	const mime = dataUrl.match(/^data:([^;,]+)/)?.[1] || "";
	if (mime.includes("svg")) return "svg";
	if (mime.includes("jpeg")) return "jpg";
	if (mime.includes("webp")) return "webp";
	if (mime.includes("gif")) return "gif";
	return "png";
}
function addDataUrl(zip, path, dataUrl) {
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
function launcher(platform, productName) {
	if (platform === "windows") return {
		name: "Start.bat",
		unixPermissions: void 0,
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
`
	};
	if (platform === "macos") return {
		name: "Start.command",
		unixPermissions: 493,
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
`
	};
	return {
		name: "start.sh",
		unixPermissions: 493,
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
`
	};
}
function shellHtml(opts) {
	const picture = opts.picturePath ? `<img src="${opts.picturePath}" alt="" />` : "";
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
function escapeHtml(value) {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;");
}
function mainJs(opts) {
	const load = opts.startUrl ? `win.loadURL(${JSON.stringify(opts.startUrl)});` : `win.loadFile(path.join(__dirname, "app", "index.html"));`;
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
async function buildDesktopZip(opts) {
	const zip = new import_lib.default();
	const slug = slugify(opts.name);
	const root = zip.folder(opts.name) ?? zip;
	const platformLabel = opts.platform === "macos" ? "macOS" : opts.platform === "windows" ? "Windows" : "Linux";
	let iconPath = null;
	if (opts.iconDataUrl) iconPath = addDataUrl(root, `icon.${extFromDataUrl(opts.iconDataUrl)}`, opts.iconDataUrl);
	let pictureRel = null;
	if (opts.pictureDataUrl) {
		const saved = addDataUrl(root, `app/cover.${extFromDataUrl(opts.pictureDataUrl)}`, opts.pictureDataUrl);
		if (saved) pictureRel = saved.replace(/^app\//, "");
	}
	root.file("package.json", JSON.stringify({
		name: slug,
		productName: opts.name,
		version: "1.0.0",
		private: true,
		main: "main.cjs",
		scripts: { start: "electron ." },
		devDependencies: { electron: "^33.4.0" }
	}, null, 2));
	root.file("main.cjs", mainJs({
		productName: opts.name,
		width: opts.plan.window.width,
		height: opts.plan.window.height,
		startUrl: opts.analysis.startUrl
	}));
	root.file("preload.cjs", `const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("kaji", { forged: true });
`);
	root.file("app/index.html", shellHtml({
		name: opts.name,
		description: opts.analysis.description,
		picturePath: pictureRel,
		startUrl: opts.analysis.startUrl
	}));
	root.file("kaji.json", JSON.stringify({
		name: opts.name,
		platform: opts.platform,
		analysis: opts.analysis,
		plan: opts.plan,
		icon: iconPath,
		forgedAt: (/* @__PURE__ */ new Date()).toISOString()
	}, null, 2));
	const boot = launcher(opts.platform, opts.name);
	root.file(boot.name, boot.body, boot.unixPermissions ? { unixPermissions: boot.unixPermissions } : void 0);
	const openHow = opts.platform === "windows" ? "Double-click Start.bat." : opts.platform === "macos" ? "Double-click Start.command." : "Run ./start.sh.";
	root.file("README.txt", `${opts.name}
Forged by Kaji for ${platformLabel}.

${openHow}
The first launch prepares the runtime. After that, it opens like any other app.

Window ${opts.plan.window.width}×${opts.plan.window.height}
${opts.analysis.framework} · ${opts.analysis.language}
`);
	return {
		blob: await zip.generateAsync({
			type: "blob",
			platform: opts.platform === "windows" ? "DOS" : "UNIX"
		}),
		filename: `${slug}-1.0.0-${opts.platform}.zip`
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
	window.setTimeout(() => URL.revokeObjectURL(url), 2e3);
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
var SAMPLES = [
	{
		id: "north",
		name: "North",
		blurb: "React + Vite",
		files: {
			"package.json": JSON.stringify({
				name: "north",
				private: true,
				type: "module",
				scripts: {
					dev: "vite",
					build: "tsc -b && vite build",
					preview: "vite preview"
				},
				dependencies: {
					react: "^19.0.0",
					"react-dom": "^19.0.0"
				},
				devDependencies: {
					vite: "^6.0.0",
					typescript: "^5.7.0",
					"@vitejs/plugin-react": "^4.0.0"
				}
			}, null, 2),
			"index.html": `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>North</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>`,
			"vite.config.ts": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });
`,
			"tsconfig.json": `{ "compilerOptions": { "jsx": "react-jsx", "strict": true } }`,
			"src/main.tsx": `import { createRoot } from "react-dom/client";
import { App } from "./App";
createRoot(document.getElementById("root")!).render(<App />);
`,
			"src/App.tsx": `export function App() {
  return (
    <main>
      <h1>North</h1>
      <p>Inventory, quiet and close at hand.</p>
    </main>
  );
}
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
		blurb: "Next.js",
		files: {
			"package.json": JSON.stringify({
				name: "harbor",
				private: true,
				scripts: {
					dev: "next dev",
					build: "next build",
					start: "next start"
				},
				dependencies: {
					next: "^15.0.0",
					react: "^19.0.0",
					"react-dom": "^19.0.0"
				}
			}, null, 2),
			"next.config.mjs": "export default {};\n",
			"app/layout.tsx": `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
			"app/page.tsx": `export default function Page() {
  return (
    <main>
      <h1>Harbor</h1>
      <p>Arrivals, departures, the day’s tide.</p>
    </main>
  );
}
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
				plan: null
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
			plan: null
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
			plan: null
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
			error: null
		});
	},
	finishForge: (plan) => {
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
		plan: null
	})
}));
var PLATFORM_LABEL = {
	windows: "Windows",
	macos: "macOS",
	linux: "Linux"
};
function DoneStage() {
	const analysis = useKaji((s) => s.analysis);
	const plan = useKaji((s) => s.plan);
	const name = useKaji((s) => s.name);
	const iconDataUrl = useKaji((s) => s.iconDataUrl);
	const pictureDataUrl = useKaji((s) => s.pictureDataUrl);
	const platforms = useKaji((s) => s.platforms);
	const reset = useKaji((s) => s.reset);
	const [busy, setBusy] = (0, import_react.useState)(null);
	const selected = Object.keys(platforms).filter((p) => platforms[p]);
	async function download(platform) {
		if (!analysis || !plan) return;
		setBusy(platform);
		try {
			const pack = await buildDesktopZip({
				name: name.trim(),
				analysis,
				plan,
				platform,
				iconDataUrl,
				pictureDataUrl
			});
			triggerDownload(pack.blob, pack.filename);
			toast.success(`${PLATFORM_LABEL[platform]} is ready`);
		} catch {
			toast.error("Could not prepare that download.");
		} finally {
			setBusy(null);
		}
	}
	async function downloadAll() {
		setBusy("all");
		try {
			for (const p of selected) await download(p);
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
				children: "Download the desktop app for each platform you chose. The first launch prepares the runtime — after that, it opens like anything else."
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
					}), busy === p ? "Preparing" : PLATFORM_LABEL[p]]
				}, p)), selected.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "lg",
					variant: "ghost",
					disabled: busy !== null,
					onClick: downloadAll,
					children: busy === "all" ? "Preparing" : "All platforms"
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
						label: "Window",
						value: `${plan.window.width} × ${plan.window.height}`
					}),
					analysis.entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Entry",
						value: analysis.entry
					}) : null,
					analysis.packageManager ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Lock",
						value: analysis.packageManager
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
var planForge = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("90f0238d0981348cc35948c8d1e89788d47bedbb92c75f99f95de535ab261262"));
function ForgeStage() {
	const analysis = useKaji((s) => s.analysis);
	const name = useKaji((s) => s.name);
	const iconDataUrl = useKaji((s) => s.iconDataUrl);
	const platforms = useKaji((s) => s.platforms);
	const finishForge = useKaji((s) => s.finishForge);
	const failForge = useKaji((s) => s.failForge);
	const selected = (0, import_react.useMemo)(() => Object.keys(platforms).filter((p) => platforms[p]), [platforms]);
	const lines = (0, import_react.useMemo)(() => analysis ? forgeLogLines(analysis, name.trim() || "App", selected) : [], [
		analysis,
		name,
		selected
	]);
	const [shown, setShown] = (0, import_react.useState)(1);
	const [progress, setProgress] = (0, import_react.useState)(6);
	const planRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!analysis) {
			failForge("Nothing to forge.");
			return;
		}
		let cancelled = false;
		planForge({ data: {
			analysis,
			name: name.trim()
		} }).then((plan) => {
			if (!cancelled) planRef.current = plan;
		}).catch(() => {
			if (!cancelled) planRef.current = {
				window: {
					width: 1280,
					height: 800
				},
				notes: heuristicNotes(analysis),
				caveats: []
			};
		});
		const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const stepMs = reduce ? 40 : 420;
		let i = 1;
		const id = window.setInterval(() => {
			i += 1;
			setShown(i);
			setProgress(Math.min(96, Math.round(i / Math.max(lines.length, 1) * 100)));
			if (i >= lines.length) {
				window.clearInterval(id);
				window.setTimeout(() => {
					if (cancelled) return;
					const plan = planRef.current ?? {
						window: {
							width: 1280,
							height: 800
						},
						notes: heuristicNotes(analysis),
						caveats: []
					};
					finishForge(plan);
				}, reduce ? 50 : 700);
			}
		}, stepMs);
		return () => {
			cancelled = true;
			window.clearInterval(id);
		};
	}, [
		analysis,
		failForge,
		finishForge,
		lines.length,
		name
	]);
	const visible = lines.slice(0, shown);
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
				children: visible.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: i === visible.length - 1 ? "text-fg" : "text-muted",
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
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
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
