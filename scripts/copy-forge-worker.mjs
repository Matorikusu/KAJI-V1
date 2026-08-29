import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "scripts/kaji-compile.mjs");
const destDir = join(root, ".vercel/output/functions/__server.func/scripts");
await mkdir(destDir, { recursive: true });
await copyFile(src, join(destDir, "kaji-compile.mjs"));
