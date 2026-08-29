#!/usr/bin/env node
/**
 * Isolated compile worker. Runs in a child process so it cannot deadlock
 * the Kaji Vite server. Reads { files } JSON, writes a Vite sandbox,
 * builds, emits { ok, assets, log, error }.
 */
import { mkdir, mkdtemp, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, extname, join, resolve, sep } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const require = createRequire(import.meta.url);
const here = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(here, "..");

const BINARY_EXT = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".wasm",
]);

const KNOWN_TOOLING = new Set([
  "react",
  "react-dom",
  "vite",
  "@vitejs/plugin-react",
  "typescript",
  "@types/react",
  "@types/react-dom",
  "@types/node",
]);

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath || !outputPath) {
  process.stderr.write("usage: kaji-compile.mjs <input.json> <output.json>\n");
  process.exit(2);
}

const log = [];
function say(line) {
  log.push(line);
}

async function writeResult(result) {
  await writeFile(outputPath, JSON.stringify(result));
}

function extraRuntimeDeps(files) {
  const raw = files["package.json"] || files["./package.json"];
  if (!raw) return [];
  try {
    const pkg = JSON.parse(raw);
    const names = [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.devDependencies || {}),
    ];
    return names.filter((name) => !KNOWN_TOOLING.has(name));
  } catch {
    return ["unknown"];
  }
}

function assertSafeRel(rel) {
  const normalized = rel.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!normalized || normalized.includes("\0")) throw new Error("Bad path");
  const parts = normalized.split("/");
  if (parts.some((p) => p === ".." || p === "." || p === "node_modules" || p === ".git")) {
    throw new Error("Bad path");
  }
  return normalized;
}

async function collect(dir, prefix = "") {
  const out = [];
  const listing = await readdir(dir, { withFileTypes: true });
  for (const entry of listing) {
    if (out.length >= 80) break;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      out.push(...(await collect(full, rel)));
      continue;
    }
    const info = await stat(full);
    if (info.size > 1_500_000) continue;
    const ext = extname(entry.name).toLowerCase();
    if (BINARY_EXT.has(ext)) {
      const buf = await readFile(full);
      out.push({ path: rel, encoding: "base64", content: buf.toString("base64") });
    } else {
      out.push({ path: rel, encoding: "utf8", content: await readFile(full, "utf8") });
    }
  }
  return out;
}

try {
  const payload = JSON.parse(await readFile(inputPath, "utf8"));
  const files = payload.files || {};
  const root = await mkdtemp(join(tmpdir(), "kaji-"));
  const rootJoin = (rel) => {
    const resolved = resolve(root, rel);
    const base = resolve(root) + sep;
    if (resolved !== resolve(root) && !resolved.startsWith(base)) {
      throw new Error("Path escaped sandbox");
    }
    return resolved;
  };

  try {
    let total = 0;
    for (const [raw, content] of Object.entries(files).slice(0, 120)) {
      let rel;
      try {
        rel = assertSafeRel(raw);
      } catch {
        continue;
      }
      if (rel.startsWith("dist/") || rel.startsWith("build/")) continue;
      const bytes = Buffer.byteLength(String(content), "utf8");
      if (bytes > 400_000) continue;
      total += bytes;
      if (total > 4_000_000) break;
      const dest = rootJoin(rel);
      await mkdir(dirname(dest), { recursive: true });
      await writeFile(dest, String(content), "utf8");
    }
    say("Sandbox ready.");

    const extras = extraRuntimeDeps(files);
    if (extras.length) {
      await execFileAsync("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], {
        cwd: root,
        timeout: 90_000,
        maxBuffer: 4_000_000,
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          npm_config_update_notifier: "false",
          CI: "1",
        },
      });
      say("Dependencies installed.");
    } else {
      say("Using the forge toolchain (React + Vite).");
    }

    const { build } = await import(require.resolve("vite", { paths: [workspaceRoot] }));
    const reactMod = await import(
      require.resolve("@vitejs/plugin-react", { paths: [workspaceRoot] })
    );
    const react = reactMod.default;

    await build({
      root,
      base: "./",
      configFile: false,
      logLevel: "error",
      plugins: [react()],
      resolve: extras.length
        ? undefined
        : {
            alias: {
              react: join(workspaceRoot, "node_modules/react"),
              "react-dom": join(workspaceRoot, "node_modules/react-dom"),
            },
          },
      build: {
        outDir: "dist",
        emptyOutDir: true,
        sourcemap: false,
      },
    });
    say("Vite build finished.");

    const dist = join(root, "dist");
    await stat(dist);
    const assets = await collect(dist);
    if (!assets.some((a) => a.path.toLowerCase().endsWith("index.html"))) {
      await writeResult({ ok: false, error: "The build did not produce an index.html.", log });
      process.exit(1);
    }
    say(`Collected ${assets.length} files from dist/.`);
    await writeResult({ ok: true, assets, outDir: "dist", log });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  say(message.slice(0, 800));
  await writeResult({ ok: false, error: "The project failed to compile.", log });
  process.exit(1);
}
