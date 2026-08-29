import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/detect-4ghxlhvC.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function slugify(name) {
	return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "app";
}
function titleFromSlug(value) {
	const cleaned = value.replace(/[-_]+/g, " ").replace(/\.(git|zip)$/i, "").trim();
	if (!cleaned) return "Untitled";
	return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}
function hashSeed(input) {
	let h = 2166136261;
	for (let i = 0; i < input.length; i++) {
		h ^= input.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function parseJson(text) {
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}
function lowerKeys(files) {
	const map = /* @__PURE__ */ new Map();
	for (const [path] of Object.entries(files)) map.set(path.replace(/\\/g, "/").replace(/^\.\//, "").toLowerCase(), path);
	return {
		has: (suffix) => {
			const needle = suffix.toLowerCase();
			for (const [lower, orig] of map) if (lower === needle || lower.endsWith("/" + needle)) return orig;
		},
		read: (suffix) => {
			const orig = (() => {
				const needle = suffix.toLowerCase();
				for (const [lower, origPath] of map) if (lower === needle || lower.endsWith("/" + needle)) return origPath;
			})();
			return orig ? files[orig] : void 0;
		},
		names: () => [...map.keys()]
	};
}
function hasDep(pkg, name) {
	return Boolean(pkg.dependencies?.[name] || pkg.devDependencies?.[name]);
}
function detectPackageManager(files, pkg) {
	if (files.has("pnpm-lock.yaml") || pkg?.packageManager?.startsWith("pnpm")) return "pnpm";
	if (files.has("yarn.lock") || pkg?.packageManager?.startsWith("yarn")) return "yarn";
	if (files.has("bun.lock") || files.has("bun.lockb") || pkg?.packageManager?.startsWith("bun")) return "bun";
	if (files.has("package-lock.json") || files.has("package.json")) return "npm";
}
function detectProject(files, meta) {
	const index = lowerKeys(files);
	const pkg = parseJson(index.read("package.json")) ?? null;
	const cargo = index.read("cargo.toml") ?? "";
	const pyproject = index.read("pyproject.toml") ?? "";
	const requirements = index.read("requirements.txt") ?? "";
	const goMod = index.read("go.mod");
	const composer = index.read("composer.json");
	const features = [];
	let framework = "Static site";
	let language = "HTML";
	let bundler;
	let entry;
	let alreadyDesktop;
	const names = index.names();
	if (Boolean(pkg?.workspaces || names.some((n) => n === "packages" || n.startsWith("packages/") || n === "apps" || n.startsWith("apps/")))) features.push("Monorepo");
	if (pkg) {
		language = index.has("tsconfig.json") || names.some((n) => n.endsWith(".ts") || n.endsWith(".tsx")) ? "TypeScript" : "JavaScript";
		if (hasDep(pkg, "electron") || hasDep(pkg, "electron-builder")) {
			alreadyDesktop = "electron";
			features.push("Already a desktop app");
		}
		if (hasDep(pkg, "@tauri-apps/api") || index.has("tauri.conf.json") || /tauri/i.test(cargo)) {
			alreadyDesktop = "tauri";
			features.push("Already a desktop app");
		}
		if (hasDep(pkg, "next")) {
			framework = "Next.js";
			bundler = "Next";
			entry = index.has("app/page.tsx") ? "app/page.tsx" : index.has("pages/index.tsx") ? "pages/index.tsx" : index.has("pages/index.js") ? "pages/index.js" : "next";
		} else if (hasDep(pkg, "nuxt") || hasDep(pkg, "nuxt3")) {
			framework = "Nuxt";
			bundler = "Nitro";
			language = "Vue";
		} else if (hasDep(pkg, "astro")) {
			framework = "Astro";
			bundler = "Astro";
		} else if (hasDep(pkg, "@sveltejs/kit")) {
			framework = "SvelteKit";
			bundler = "Vite";
			language = "Svelte";
		} else if (hasDep(pkg, "svelte")) {
			framework = "Svelte";
			bundler = hasDep(pkg, "vite") ? "Vite" : bundler;
			language = "Svelte";
		} else if (hasDep(pkg, "@remix-run/react") || hasDep(pkg, "react-router")) {
			framework = hasDep(pkg, "@remix-run/react") ? "Remix" : "React Router";
			bundler = hasDep(pkg, "vite") ? "Vite" : bundler;
		} else if (hasDep(pkg, "@tanstack/react-start")) {
			framework = "TanStack Start";
			bundler = "Vite";
		} else if (hasDep(pkg, "gatsby")) framework = "Gatsby";
		else if (hasDep(pkg, "@angular/core")) {
			framework = "Angular";
			language = "TypeScript";
		} else if (hasDep(pkg, "vue") || hasDep(pkg, "nuxt")) {
			framework = hasDep(pkg, "nuxt") ? "Nuxt" : "Vue";
			bundler = hasDep(pkg, "vite") ? "Vite" : bundler;
			language = "Vue";
		} else if (hasDep(pkg, "react")) {
			framework = hasDep(pkg, "vite") || index.has("vite.config.ts") || index.has("vite.config.js") ? "React (Vite)" : hasDep(pkg, "react-scripts") ? "Create React App" : "React";
			bundler = hasDep(pkg, "vite") || index.has("vite.config.ts") || index.has("vite.config.js") ? "Vite" : hasDep(pkg, "webpack") ? "webpack" : bundler;
		} else if (hasDep(pkg, "preact")) {
			framework = "Preact";
			bundler = hasDep(pkg, "vite") ? "Vite" : bundler;
		} else if (hasDep(pkg, "solid-js")) {
			framework = "Solid";
			bundler = hasDep(pkg, "vite") ? "Vite" : bundler;
		} else if (hasDep(pkg, "express") || hasDep(pkg, "fastify") || hasDep(pkg, "hono") || hasDep(pkg, "koa")) {
			framework = hasDep(pkg, "fastify") ? "Fastify" : hasDep(pkg, "hono") ? "Hono" : hasDep(pkg, "koa") ? "Koa" : "Express";
			language = language === "HTML" ? "JavaScript" : language;
		} else if (index.has("vite.config.ts") || index.has("vite.config.js") || hasDep(pkg, "vite")) {
			framework = "Vite";
			bundler = "Vite";
		} else {
			framework = "Node app";
			language = language === "HTML" ? "JavaScript" : language;
		}
		if (!bundler && (index.has("vite.config.ts") || index.has("vite.config.js") || hasDep(pkg, "vite"))) bundler = "Vite";
		if (!entry) entry = index.has("index.html") || index.has("src/main.tsx") || index.has("src/main.ts") || index.has("src/index.tsx") || index.has("src/index.ts") || index.has("src/App.tsx") || (pkg.scripts?.start ? "package.json" : void 0);
	} else if (/\[package\.metadata\.tauri\]/i.test(cargo) || index.has("tauri.conf.json")) {
		framework = "Tauri";
		language = "Rust";
		alreadyDesktop = "tauri";
	} else if (cargo) {
		framework = "Rust";
		language = "Rust";
	} else if (goMod) {
		framework = "Go";
		language = "Go";
	} else if (composer) {
		framework = "PHP";
		language = "PHP";
	} else if (pyproject || requirements) {
		language = "Python";
		const blob = `${pyproject}\n${requirements}`.toLowerCase();
		if (blob.includes("django")) framework = "Django";
		else if (blob.includes("flask")) framework = "Flask";
		else if (blob.includes("fastapi")) framework = "FastAPI";
		else if (blob.includes("streamlit")) framework = "Streamlit";
		else framework = "Python app";
	} else if (index.has("index.html") || names.some((n) => n.endsWith(".html"))) {
		framework = "Static site";
		language = "HTML";
		entry = index.has("index.html") ?? names.find((n) => n.endsWith(".html"));
	} else if (meta.startUrl) {
		framework = "Live web app";
		language = "HTML";
		entry = meta.startUrl;
	}
	if (index.has("dockerfile") || index.has("Dockerfile")) features.push("Docker");
	if (index.has("index.html")) features.push("Browser entry");
	if (pkg?.scripts?.build) features.push("Has a build");
	const suggestedName = meta.suggestedName || (pkg?.name && !pkg.name.startsWith("@") ? titleFromSlug(pkg.name) : void 0) || titleFromSlug(meta.sourceLabel);
	return {
		sourceKind: meta.sourceKind,
		sourceLabel: meta.sourceLabel,
		suggestedName,
		repoUrl: meta.repoUrl,
		homepage: meta.homepage || pkg?.homepage,
		description: meta.description || pkg?.description,
		framework,
		language,
		bundler,
		packageManager: detectPackageManager(index, pkg),
		entry,
		devCommand: pkg?.scripts?.dev,
		buildCommand: pkg?.scripts?.build,
		startCommand: pkg?.scripts?.start,
		alreadyDesktop,
		startUrl: meta.startUrl || meta.homepage || pkg?.homepage,
		nodeHint: pkg?.engines?.node,
		features,
		fileCount: Object.keys(files).length
	};
}
function heuristicNotes(analysis) {
	const notes = [];
	notes.push(`${analysis.framework} · ${analysis.language}.`);
	if (analysis.bundler) notes.push(`Built with ${analysis.bundler}.`);
	if (analysis.alreadyDesktop) notes.push("Already wears a desktop shell — Kaji will restamp it.");
	else notes.push("Will open in its own window, like any other app.");
	if (analysis.startUrl) notes.push("Points at a live address.");
	return notes.slice(0, 3);
}
function forgeLogLines(analysis, name, platforms) {
	const lines = ["Opened the crate."];
	lines.push(`Found ${analysis.framework}.`);
	lines.push(`${analysis.language} throughout.`);
	if (analysis.bundler) lines.push(`${analysis.bundler}, ready.`);
	if (analysis.entry) lines.push(`Entry at ${analysis.entry}.`);
	if (analysis.buildCommand) lines.push(`Build known.`);
	if (analysis.alreadyDesktop) lines.push("Shell already present — restamping.");
	else lines.push("Shaping the shell.");
	for (const p of platforms) {
		const label = p === "macos" ? "macOS" : p === "windows" ? "Windows" : "Linux";
		lines.push(`${label}, cut.`);
	}
	lines.push(`Stamped “${name}”.`);
	lines.push("Quenching.");
	lines.push("Ready.");
	return lines;
}
//#endregion
export { heuristicNotes as a, hashSeed as i, detectProject as n, slugify as o, forgeLogLines as r, titleFromSlug as s, cn as t };
