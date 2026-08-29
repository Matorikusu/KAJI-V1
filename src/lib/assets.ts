import { hashSeed } from "@/lib/utils";

export function letterIcon(name: string) {
  const letter = (name.trim().charAt(0) || "K").toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
  <rect width="256" height="256" rx="52" fill="#141414"/>
  <rect x="12" y="12" width="232" height="232" rx="42" fill="none" stroke="#ece8df" stroke-width="3" opacity="0.35"/>
  <text x="128" y="172" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="132" fill="#ece8df">${escapeXml(letter)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function geometricCover(name: string) {
  const seed = hashSeed(name || "kaji");
  const rnd = mulberry(seed);
  const bars = Array.from({ length: 5 }, (_, i) => {
    const x = 80 + rnd() * 1040;
    const y = 70 + rnd() * 420;
    const w = 120 + rnd() * 280;
    const h = 16 + rnd() * 90;
    const o = 0.12 + rnd() * 0.28;
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

function mulberry(seed: number) {
  let s = seed || 1;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function escapeXml(value: string) {
  const amp = "\u0026";
  return value
    .replaceAll(amp, amp + "amp;")
    .replaceAll("<", amp + "lt;")
    .replaceAll(">", amp + "gt;")
    .replaceAll('"', amp + "quot;");
}

export function isImagePath(path: string) {
  return /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(path);
}

export function looksLikeIcon(path: string) {
  const n = path.toLowerCase();
  return /(^|\/)(icon|logo|app-icon|favicon)s?(\.|$)/.test(n);
}

export function looksLikePicture(path: string) {
  const n = path.toLowerCase();
  return /(screenshot|preview|cover|hero|banner|promo)/.test(n);
}
