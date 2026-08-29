import { createServerFn } from "@tanstack/react-start";
import { detectProject, type Analysis, type FileMap } from "@/lib/detect";
import { titleFromSlug } from "@/lib/utils";

export type InspectOk = {
  ok: true;
  analysis: Analysis;
  files: FileMap;
};

export type InspectErr = { ok: false; error: string };
export type InspectResult = InspectOk | InspectErr;

const INTERESTING = [
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
  "README.md",
];

const SOURCE_FILE = /\.(html?|css|js|jsx|mjs|cjs|ts|tsx|json|svg|md)$/i;
const SOURCE_DIR =
  /^(src|app|pages|public|components|lib|styles|assets|css|js|hooks|utils|features)\//;
const SKIP_DIR = /(^|\/)(node_modules|dist|build|out|\.git|\.next|coverage)(\/|$)/;

function parseGithub(raw: string): { owner: string; repo: string } | null {
  const trimmed = raw.trim().replace(/\/+$/, "");
  const ssh = trimmed.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (ssh) return { owner: ssh[1], repo: ssh[2] };
  const shorthand = trimmed.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (shorthand && !trimmed.includes(".")) return { owner: shorthand[1], repo: shorthand[2] };
  try {
    const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const u = new URL(withProto);
    if (!/(^|\.)github\.com$/i.test(u.hostname)) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/i, "") };
  } catch {
    return null;
  }
}

function isPrivateHost(hostname: string) {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1" || h === "0.0.0.0" || h === "::1") return true;
  if (/^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;
  return false;
}

async function fetchText(url: string, timeoutMs = 8000): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Kaji-Forge", Accept: "text/plain, application/json, */*" },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const length = Number(res.headers.get("content-length") || 0);
    if (length > 400_000) return null;
    const text = await res.text();
    if (text.length > 400_000) return text.slice(0, 400_000);
    return text;
  } catch {
    return null;
  }
}

async function fetchJson<T>(url: string): Promise<T | null> {
  const text = await fetchText(url);
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function extractTitle(html: string) {
  const og = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
  if (og?.[1]) return decodeHtml(og[1]);
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (title?.[1]) return decodeHtml(title[1].trim());
  return undefined;
}

function decodeHtml(value: string) {
  const amp = "\u0026";
  return value
    .replaceAll(amp + "amp;", amp)
    .replaceAll(amp + "lt;", "<")
    .replaceAll(amp + "gt;", ">")
    .replaceAll(amp + "quot;", '"')
    .replaceAll(amp + "#39;", "'");
}

type GithubRepo = {
  name: string;
  description: string | null;
  homepage: string | null;
  default_branch: string;
  html_url: string;
  language: string | null;
};

type GithubContent = { name: string; path: string; type: "file" | "dir" | string };

async function fetchGithubSources(
  owner: string,
  repo: string,
  branch: string,
  files: FileMap,
) {
  const tree = await fetchJson<{ tree?: { path: string; type: string; size?: number }[] }>(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
  );
  if (!tree?.tree) return;

  const wanted = tree.tree.filter((item) => {
    if (item.type !== "blob") return false;
    if (SKIP_DIR.test(item.path)) return false;
    if ((item.size || 0) > 200_000) return false;
    if (files[item.path]) return false;
    if (SOURCE_DIR.test(item.path) && SOURCE_FILE.test(item.path)) return true;
    if (!item.path.includes("/") && SOURCE_FILE.test(item.path)) return true;
    return false;
  });

  const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`;
  const cap = wanted.slice(0, 70);
  const queue = [...cap];
  const workers = Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const item = queue.shift();
      if (!item) return;
      const text = await fetchText(rawBase + item.path, 6000);
      if (text != null) files[item.path] = text;
    }
  });
  await Promise.all(workers);
}

async function inspectGithub(owner: string, repo: string): Promise<InspectResult> {
  const apiRepo = await fetchJson<GithubRepo>(
    `https://api.github.com/repos/${owner}/${repo}`,
  );
  const branch = apiRepo?.default_branch || "main";
  const files: FileMap = {};

  const listing = await fetchJson<GithubContent[] | { message?: string }>(
    `https://api.github.com/repos/${owner}/${repo}/contents/?ref=${encodeURIComponent(branch)}`,
  );

  const names = new Set<string>();
  if (Array.isArray(listing)) {
    for (const item of listing) names.add(item.path);
  }

  const candidates = INTERESTING.filter((name) => names.size === 0 || names.has(name) || name.includes("/"));
  const rawBases = [
    `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/`,
    `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/`,
  ];
  if (branch !== "main") rawBases.push(`https://raw.githubusercontent.com/${owner}/${repo}/main/`);
  if (branch !== "master") rawBases.push(`https://raw.githubusercontent.com/${owner}/${repo}/master/`);

  await Promise.all(
    candidates.map(async (rel) => {
      for (const base of rawBases) {
        const text = await fetchText(base + rel, 7000);
        if (text != null) {
          files[rel] = text;
          return;
        }
      }
    }),
  );

  await fetchGithubSources(owner, repo, branch, files);

  if (Object.keys(files).length === 0 && !apiRepo) {
    return {
      ok: false,
      error: "Could not open that repository. Check the address, or drop the files instead.",
    };
  }

  const suggestedName = titleFromSlug(apiRepo?.name || repo);
  const analysis = detectProject(files, {
    sourceKind: "github",
    sourceLabel: `${owner}/${repo}`,
    suggestedName,
    repoUrl: apiRepo?.html_url || `https://github.com/${owner}/${repo}`,
    homepage: apiRepo?.homepage || undefined,
    description: apiRepo?.description || undefined,
    startUrl: apiRepo?.homepage || undefined,
  });

  if (apiRepo?.language && analysis.language === "HTML") {
    analysis.language = apiRepo.language;
  }

  return { ok: true, analysis, files };
}

async function inspectLiveUrl(url: string): Promise<InspectResult> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, error: "That does not look like a URL." };
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Use an https address." };
  }
  if (isPrivateHost(parsed.hostname)) {
    return { ok: false, error: "That address cannot be opened from here." };
  }

  const html = await fetchText(parsed.toString(), 9000);
  const title = html ? extractTitle(html) : undefined;
  const hostLabel = parsed.hostname.replace(/^www\./, "");
  const suggestedName = titleFromSlug(title?.split(/[·|—–-]/)[0]?.trim() || hostLabel);
  const files: FileMap = html ? { "index.html": html.slice(0, 80_000) } : {};
  const analysis = detectProject(files, {
    sourceKind: "url",
    sourceLabel: hostLabel,
    suggestedName,
    homepage: parsed.toString(),
    startUrl: parsed.toString(),
    description: `Live site at ${hostLabel}`,
  });
  analysis.framework = "Live web app";
  analysis.startUrl = parsed.toString();
  analysis.entry = parsed.toString();
  return { ok: true, analysis, files };
}

export const inspectUrl = createServerFn({ method: "POST" })
  .validator((input: { url: string }) => input)
  .handler(async ({ data }): Promise<InspectResult> => {
    const raw = (data.url || "").trim();
    if (!raw) return { ok: false, error: "Paste a GitHub address or a site URL." };

    const gh = parseGithub(raw);
    if (gh) return inspectGithub(gh.owner, gh.repo);

    const asUrl = /^https?:\/\//i.test(raw) ? raw : /^[\w.-]+\.[a-z]{2,}/i.test(raw) ? `https://${raw}` : null;
    if (asUrl) return inspectLiveUrl(asUrl);

    return {
      ok: false,
      error: "Paste a GitHub repository or a website URL.",
    };
  });
