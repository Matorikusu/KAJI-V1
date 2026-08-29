import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { n as detectProject, o as titleFromSlug } from "./detect-B61kcKp4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inspect-D3CIq0pd.js
var INTERESTING = [
	"package.json",
	"package-lock.json",
	"pnpm-lock.yaml",
	"yarn.lock",
	"bun.lock",
	"bun.lockb",
	"vite.config.ts",
	"vite.config.js",
	"vite.config.mts",
	"next.config.js",
	"next.config.mjs",
	"next.config.ts",
	"nuxt.config.ts",
	"astro.config.mjs",
	"svelte.config.js",
	"angular.json",
	"tauri.conf.json",
	"src-tauri/tauri.conf.json",
	"Cargo.toml",
	"go.mod",
	"composer.json",
	"pyproject.toml",
	"requirements.txt",
	"index.html",
	"Dockerfile",
	"dockerfile",
	"tsconfig.json",
	".nvmrc",
	".node-version",
	"app/page.tsx",
	"app/layout.tsx",
	"pages/index.tsx",
	"pages/index.js",
	"src/main.tsx",
	"src/main.ts",
	"src/index.tsx",
	"src/App.tsx",
	"README.md"
];
var SOURCE_FILE = /\.(html?|css|js|jsx|mjs|cjs|ts|tsx|json|svg|md)$/i;
var SOURCE_DIR = /^(src|app|pages|public|components|lib|styles|assets|css|js|hooks|utils|features)\//;
var SKIP_DIR = /(^|\/)(node_modules|dist|build|out|\.git|\.next|coverage)(\/|$)/;
function parseGithub(raw) {
	const trimmed = raw.trim().replace(/\/+$/, "");
	const ssh = trimmed.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i);
	if (ssh) return {
		owner: ssh[1],
		repo: ssh[2]
	};
	const shorthand = trimmed.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
	if (shorthand && !trimmed.includes(".")) return {
		owner: shorthand[1],
		repo: shorthand[2]
	};
	try {
		const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
		const u = new URL(withProto);
		if (!/(^|\.)github\.com$/i.test(u.hostname)) return null;
		const parts = u.pathname.split("/").filter(Boolean);
		if (parts.length < 2) return null;
		return {
			owner: parts[0],
			repo: parts[1].replace(/\.git$/i, "")
		};
	} catch {
		return null;
	}
}
function isPrivateHost(hostname) {
	const h = hostname.toLowerCase();
	if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h === "::1") return true;
	if (/^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) return true;
	if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
	return false;
}
async function fetchText(url, timeoutMs = 8e3) {
	try {
		const res = await fetch(url, {
			headers: {
				"User-Agent": "Kaji-Forge",
				Accept: "text/plain, application/json, */*"
			},
			signal: AbortSignal.timeout(timeoutMs),
			redirect: "follow"
		});
		if (!res.ok) return null;
		if (Number(res.headers.get("content-length") || 0) > 4e5) return null;
		const text = await res.text();
		if (text.length > 4e5) return text.slice(0, 4e5);
		return text;
	} catch {
		return null;
	}
}
async function fetchJson(url) {
	const text = await fetchText(url);
	if (!text) return null;
	try {
		return JSON.parse(text);
	} catch {
		return null;
	}
}
function extractTitle(html) {
	const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
	if (og?.[1]) return decodeHtml(og[1]);
	const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
	if (title?.[1]) return decodeHtml(title[1].trim());
}
function decodeHtml(value) {
	return value.replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", "\"").replaceAll("&#39;", "'");
}
async function fetchGithubSources(owner, repo, branch, files) {
	const tree = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
	if (!tree?.tree) return;
	const wanted = tree.tree.filter((item) => {
		if (item.type !== "blob") return false;
		if (SKIP_DIR.test(item.path)) return false;
		if ((item.size || 0) > 2e5) return false;
		if (files[item.path]) return false;
		if (SOURCE_DIR.test(item.path) && SOURCE_FILE.test(item.path)) return true;
		if (!item.path.includes("/") && SOURCE_FILE.test(item.path)) return true;
		return false;
	});
	const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
	const queue = [...wanted.slice(0, 70)];
	const workers = Array.from({ length: 6 }, async () => {
		while (queue.length) {
			const item = queue.shift();
			if (!item) return;
			const text = await fetchText(rawBase + item.path, 6e3);
			if (text != null) files[item.path] = text;
		}
	});
	await Promise.all(workers);
}
async function inspectGithub(owner, repo) {
	const apiRepo = await fetchJson(`https://api.github.com/repos/${owner}/${repo}`);
	const branch = apiRepo?.default_branch || "main";
	const files = {};
	const listing = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/contents/?ref=${encodeURIComponent(branch)}`);
	const names = /* @__PURE__ */ new Set();
	if (Array.isArray(listing)) for (const item of listing) names.add(item.path);
	const candidates = INTERESTING.filter((name) => names.size === 0 || names.has(name) || name.includes("/"));
	const rawBases = [`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`, `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/`];
	if (branch !== "main") rawBases.push(`https://raw.githubusercontent.com/${owner}/${repo}/main/`);
	if (branch !== "master") rawBases.push(`https://raw.githubusercontent.com/${owner}/${repo}/master/`);
	await Promise.all(candidates.map(async (rel) => {
		for (const base of rawBases) {
			const text = await fetchText(base + rel, 7e3);
			if (text != null) {
				files[rel] = text;
				return;
			}
		}
	}));
	await fetchGithubSources(owner, repo, branch, files);
	if (Object.keys(files).length === 0 && !apiRepo) return {
		ok: false,
		error: "Could not open that repository. Check the address, or drop the files instead."
	};
	const suggestedName = titleFromSlug(apiRepo?.name || repo);
	const analysis = detectProject(files, {
		sourceKind: "github",
		sourceLabel: `${owner}/${repo}`,
		suggestedName,
		repoUrl: apiRepo?.html_url || `https://github.com/${owner}/${repo}`,
		homepage: apiRepo?.homepage || void 0,
		description: apiRepo?.description || void 0,
		startUrl: apiRepo?.homepage || void 0
	});
	if (apiRepo?.language && analysis.language === "HTML") analysis.language = apiRepo.language;
	return {
		ok: true,
		analysis,
		files
	};
}
async function inspectLiveUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		return {
			ok: false,
			error: "That does not look like a URL."
		};
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return {
		ok: false,
		error: "Use an https address."
	};
	if (isPrivateHost(parsed.hostname)) return {
		ok: false,
		error: "That address cannot be opened from here."
	};
	const html = await fetchText(parsed.toString(), 9e3);
	const title = html ? extractTitle(html) : void 0;
	const hostLabel = parsed.hostname.replace(/^www\./, "");
	const suggestedName = titleFromSlug(title?.split(/[·|—–-]/)[0]?.trim() || hostLabel);
	const files = html ? { "index.html": html.slice(0, 8e4) } : {};
	const analysis = detectProject(files, {
		sourceKind: "url",
		sourceLabel: hostLabel,
		suggestedName,
		homepage: parsed.toString(),
		startUrl: parsed.toString(),
		description: `Live site at ${hostLabel}`
	});
	analysis.framework = "Live web app";
	analysis.startUrl = parsed.toString();
	analysis.entry = parsed.toString();
	return {
		ok: true,
		analysis,
		files
	};
}
var inspectUrl_createServerFn_handler = createServerRpc({
	id: "7a5d44b7352bf7aa960bbbc4866e5fa04de0ef887dcd1e0fa7de50fbc0613eda",
	name: "inspectUrl",
	filename: "src/lib/inspect.ts"
}, (opts) => inspectUrl.__executeServer(opts));
var inspectUrl = createServerFn({ method: "POST" }).validator((input) => input).handler(inspectUrl_createServerFn_handler, async ({ data }) => {
	const raw = (data.url || "").trim();
	if (!raw) return {
		ok: false,
		error: "Paste a GitHub address or a site URL."
	};
	const gh = parseGithub(raw);
	if (gh) return inspectGithub(gh.owner, gh.repo);
	const asUrl = /^https?:\/\//i.test(raw) ? raw : /^[\w.-]+\.[a-z]{2,}/i.test(raw) ? `https://${raw}` : null;
	if (asUrl) return inspectLiveUrl(asUrl);
	return {
		ok: false,
		error: "Paste a GitHub repository or a website URL."
	};
});
//#endregion
export { inspectUrl_createServerFn_handler };
