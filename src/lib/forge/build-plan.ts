import type { Analysis, FileMap } from "@/lib/detect";
import type { BuiltAsset, ExecutablePlan } from "@/lib/forge/types";

function paths(files: FileMap) {
  return Object.keys(files).map((p) => p.replace(/\\/g, "/").replace(/^\.\//, ""));
}

function hasFile(files: FileMap, suffix: string) {
  const needle = suffix.toLowerCase();
  return paths(files).some((p) => p.toLowerCase() === needle || p.toLowerCase().endsWith("/" + needle));
}

export function hasViteSource(files: FileMap) {
  const html = hasFile(files, "index.html");
  const entry =
    hasFile(files, "src/main.tsx") ||
    hasFile(files, "src/main.ts") ||
    hasFile(files, "src/main.jsx") ||
    hasFile(files, "src/main.js") ||
    hasFile(files, "src/index.tsx") ||
    hasFile(files, "src/index.ts") ||
    hasFile(files, "src/index.jsx") ||
    hasFile(files, "src/index.js") ||
    hasFile(files, "src/App.tsx");
  const pkg = hasFile(files, "package.json");
  return html && entry && pkg;
}

export function planBuild(analysis: Analysis, files: FileMap): ExecutablePlan | { kind: "none"; reason: string } {
  if (analysis.sourceKind === "url" && analysis.startUrl) {
    return {
      kind: "url",
      packageManager: "npm",
      outDir: "",
      reason: "Live site — wrap the address in a native window.",
    };
  }

  const viteProject =
    hasViteSource(files) &&
    (analysis.bundler === "Vite" ||
      analysis.framework.includes("Vite") ||
      hasFile(files, "vite.config.ts") ||
      hasFile(files, "vite.config.js") ||
      hasFile(files, "vite.config.mts"));

  if (viteProject) {
    return {
      kind: "vite",
      packageManager: "npm",
      outDir: "dist",
      reason: "Install dependencies, run Vite, wrap dist/.",
    };
  }

  if (analysis.framework === "Static site" || hasFile(files, "index.html")) {
    const htmlOnly = analysis.framework === "Static site" || !analysis.buildCommand;
    if (htmlOnly) {
      return {
        kind: "static",
        packageManager: "npm",
        outDir: "",
        reason: "Static files — no compile step.",
      };
    }
  }

  if (analysis.startUrl && /^https?:\/\//i.test(analysis.startUrl)) {
    return {
      kind: "url",
      packageManager: "npm",
      outDir: "",
      reason: "Source is not a Vite app; wrapping the live address.",
    };
  }

  return {
    kind: "none",
    reason:
      "Kaji forges Vite, React, and static sites. Drop a project with an index.html, or paste a live URL.",
  };
}

const STATIC_EXT = /\.(html?|css|js|mjs|cjs|svg)$/i;

export function staticAssetsFromFiles(files: FileMap): BuiltAsset[] {
  const entries = Object.entries(files).map(([path, content]) => ({
    path: path.replace(/\\/g, "/").replace(/^\.\//, ""),
    content,
  }));
  const html = entries.find((e) => e.path.toLowerCase().endsWith("index.html"));
  const dir = html?.path.includes("/") ? html.path.slice(0, html.path.lastIndexOf("/") + 1) : "";
  const assets: BuiltAsset[] = [];
  for (const { path, content } of entries) {
    if (dir && !path.startsWith(dir)) continue;
    const rel = dir ? path.slice(dir.length) : path;
    if (!rel || !STATIC_EXT.test(rel)) continue;
    const base = rel.split("/").pop() || "";
    if (/^package(-lock)?\.json$/i.test(base)) continue;
    assets.push({ path: rel, encoding: "utf8", content });
  }
  return assets;
}
