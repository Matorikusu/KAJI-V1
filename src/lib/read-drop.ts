import JSZip from "jszip";
import type { FileMap } from "@/lib/detect";

const SKIP = /(^|\/)(node_modules|\.git|dist|build|\.next|coverage|\.turbo|vendor)(\/|$)/i;
const TEXT_OK = /\.(json|html?|css|js|jsx|ts|tsx|mjs|cjs|md|txt|toml|ya?ml|lock|svg|vue|svelte|xml|env|gitignore|npmrc)$/i;
const TEXT_NAMES = /^(dockerfile|makefile|license|readme)$/i;
const IMAGE_OK = /\.(png|jpe?g|gif|webp|svg|ico)$/i;
const MAX_FILES = 80;
const MAX_TEXT = 200_000;

export type DropRead = {
  files: FileMap;
  images: { path: string; dataUrl: string }[];
};

function shouldKeep(path: string) {
  const clean = path.replace(/\\/g, "/");
  if (SKIP.test(clean)) return false;
  const base = clean.split("/").pop() || "";
  return TEXT_OK.test(base) || TEXT_NAMES.test(base) || IMAGE_OK.test(base);
}

function isText(path: string) {
  const base = path.split("/").pop() || "";
  return TEXT_OK.test(base) || TEXT_NAMES.test(base) || /\.svg$/i.test(base);
}

async function fileAsText(file: File) {
  const buf = await file.arrayBuffer();
  if (buf.byteLength > MAX_TEXT) return new TextDecoder().decode(buf.slice(0, MAX_TEXT));
  return new TextDecoder().decode(buf);
}

async function fileAsDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

async function unpackZip(file: File): Promise<DropRead> {
  const zip = await JSZip.loadAsync(file);
  const files: FileMap = {};
  const images: { path: string; dataUrl: string }[] = [];
  const entries = Object.values(zip.files).filter((e) => !e.dir && shouldKeep(e.name));
  for (const entry of entries.slice(0, MAX_FILES)) {
    if (IMAGE_OK.test(entry.name) && !/\.svg$/i.test(entry.name)) {
      const buf = await entry.async("base64");
      const mime = entry.name.match(/\.png$/i)
        ? "image/png"
        : entry.name.match(/\.webp$/i)
          ? "image/webp"
          : entry.name.match(/\.gif$/i)
            ? "image/gif"
            : "image/jpeg";
      images.push({ path: entry.name, dataUrl: `data:${mime};base64,${buf}` });
    } else if (isText(entry.name)) {
      files[entry.name] = await entry.async("string");
    }
  }
  return { files, images };
}

export async function readFileList(list: FileList | File[]): Promise<DropRead> {
  const arr = Array.from(list);
  const files: FileMap = {};
  const images: { path: string; dataUrl: string }[] = [];

  for (const file of arr) {
    if (file.name.toLowerCase().endsWith(".zip")) {
      const unpacked = await unpackZip(file);
      Object.assign(files, unpacked.files);
      images.push(...unpacked.images);
      continue;
    }
    const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    if (!shouldKeep(rel)) continue;
    if (IMAGE_OK.test(rel) && !/\.svg$/i.test(rel)) {
      images.push({ path: rel, dataUrl: await fileAsDataUrl(file) });
    } else if (isText(rel)) {
      files[rel] = await fileAsText(file);
    }
    if (Object.keys(files).length + images.length >= MAX_FILES) break;
  }

  return { files, images };
}

export function uriFromDrop(event: DragEvent): string | null {
  const uri = event.dataTransfer?.getData("text/uri-list") || event.dataTransfer?.getData("text/plain");
  const text = uri?.trim();
  if (!text) return null;
  if (/^https?:\/\//i.test(text) || /github\.com/i.test(text) || /^[\w.-]+\/[\w.-]+$/.test(text)) {
    return text.split("\n")[0]?.trim() || null;
  }
  return null;
}
