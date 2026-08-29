function concat(parts: Uint8Array[]) {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

function u32(value: number) {
  const buf = new Uint8Array(4);
  new DataView(buf.buffer).setUint32(0, value, true);
  return buf;
}

function align4(n: number) {
  return (n + 3) & ~3;
}

function pickleUInt32(value: number) {
  return concat([u32(4), u32(value)]);
}

function pickleString(value: string) {
  const str = new TextEncoder().encode(value);
  const payload = align4(4 + str.length);
  const buf = new Uint8Array(4 + payload);
  const view = new DataView(buf.buffer);
  view.setUint32(0, payload, true);
  view.setUint32(4, str.length, true);
  buf.set(str, 8);
  return buf;
}

type AsarDir = { files: Record<string, AsarNode> };
type AsarFile = { size: number; offset: string };
type AsarNode = AsarDir | AsarFile;

function ensureDir(root: AsarDir, parts: string[]) {
  let dir = root;
  for (const part of parts) {
    const existing = dir.files[part];
    if (existing && "files" in existing) {
      dir = existing;
    } else {
      const next: AsarDir = { files: {} };
      dir.files[part] = next;
      dir = next;
    }
  }
  return dir;
}

/** Pack a map of archive paths → bytes into an Electron asar buffer (resources.neu). */
export function packAsar(files: Record<string, Uint8Array>) {
  const header: AsarDir = { files: {} };
  const blobs: Uint8Array[] = [];
  let offset = 0;

  const names = Object.keys(files).sort();
  for (const name of names) {
    const data = files[name];
    const parts = name.replace(/\\/g, "/").replace(/^\/+/, "").split("/").filter(Boolean);
    if (parts.length === 0) continue;
    const base = parts.pop() as string;
    const dir = ensureDir(header, parts);
    dir.files[base] = { size: data.length, offset: String(offset) };
    blobs.push(data);
    offset += data.length;
  }

  const headerPickle = pickleString(JSON.stringify(header));
  const sizePickle = pickleUInt32(headerPickle.length);
  return concat([sizePickle, headerPickle, ...blobs]);
}

export function utf8(value: string) {
  return new TextEncoder().encode(value);
}
