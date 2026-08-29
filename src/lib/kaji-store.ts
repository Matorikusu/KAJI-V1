import { create } from "zustand";
import { geometricCover, letterIcon, looksLikeIcon, looksLikePicture } from "@/lib/assets";
import { detectProject, type Analysis, type FileMap } from "@/lib/detect";
import type { BuildKind, BuiltAsset } from "@/lib/forge/types";
import { inspectUrl } from "@/lib/inspect";
import { getSample } from "@/lib/samples";
import type { HistoryItem, Platform, Platforms } from "@/lib/types";
import type { ForgePlan } from "@/lib/forge-plan";

export type Stage = "drop" | "set" | "forge" | "done";

const HISTORY_KEY = "kaji.history";

function readHistory(): HistoryItem[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed.slice(0, 6) : [];
  } catch {
    return [];
  }
}

function writeHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 6)));
  } catch {
    /* quota */
  }
}

type KajiState = {
  stage: Stage;
  analyzing: boolean;
  forging: boolean;
  error: string | null;
  name: string;
  iconDataUrl: string | null;
  pictureDataUrl: string | null;
  platforms: Platforms;
  analysis: Analysis | null;
  files: FileMap;
  plan: ForgePlan | null;
  builtAssets: BuiltAsset[] | null;
  buildKind: BuildKind | null;
  history: HistoryItem[];
  ingestUrl: (raw: string) => Promise<void>;
  ingestSample: (id: string) => void;
  ingestFiles: (files: FileMap, images?: { path: string; dataUrl: string }[]) => void;
  setName: (name: string) => void;
  setIcon: (dataUrl: string | null) => void;
  setPicture: (dataUrl: string | null) => void;
  togglePlatform: (p: Platform) => void;
  goSet: () => void;
  goDrop: () => void;
  startForge: () => void;
  finishForge: (plan: ForgePlan, built: { assets: BuiltAsset[] | null; kind: BuildKind }) => void;
  failForge: (message: string) => void;
  loadHistory: () => void;
  reset: () => void;
};

const emptyPlatforms: Platforms = { windows: true, macos: true, linux: true };

function applyProject(
  analysis: Analysis,
  files: FileMap,
  images?: { path: string; dataUrl: string }[],
) {
  const name = analysis.suggestedName;
  let icon = letterIcon(name);
  let picture = geometricCover(name);
  if (images) {
    const iconHit = images.find((i) => looksLikeIcon(i.path));
    const picHit = images.find((i) => looksLikePicture(i.path)) || images[0];
    if (iconHit) icon = iconHit.dataUrl;
    if (picHit && !looksLikeIcon(picHit.path)) picture = picHit.dataUrl;
  }
  return { analysis, files, name, iconDataUrl: icon, pictureDataUrl: picture };
}

export const useKaji = create<KajiState>((set, get) => ({
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
  builtAssets: null,
  buildKind: null,
  history: [],

  ingestUrl: async (raw) => {
    set({ analyzing: true, error: null });
    try {
      const result = await inspectUrl({ data: { url: raw } });
      if (!result.ok) {
        set({ analyzing: false, error: result.error });
        return;
      }
      set({
        ...applyProject(result.analysis, result.files),
        analyzing: false,
        error: null,
        stage: "set",
        plan: null,
        builtAssets: null,
        buildKind: null,
      });
    } catch {
      set({
        analyzing: false,
        error: "Could not open that project. Try a sample, or drop the files.",
      });
    }
  },

  ingestSample: (id) => {
    const sample = getSample(id);
    if (!sample) {
      set({ error: "That sample is missing." });
      return;
    }
    const analysis = detectProject(sample.files, {
      sourceKind: "sample",
      sourceLabel: sample.name,
      suggestedName: sample.name,
    });
    set({
      ...applyProject(analysis, sample.files),
      error: null,
      analyzing: false,
      stage: "set",
      plan: null,
      builtAssets: null,
      buildKind: null,
    });
  },

  ingestFiles: (files, images) => {
    const keys = Object.keys(files);
    if (keys.length === 0 && (!images || images.length === 0)) {
      set({ error: "Nothing readable in that drop." });
      return;
    }
    const folder = keys[0]?.split(/[/\\]/)[0];
    const analysis = detectProject(files, {
      sourceKind: "files",
      sourceLabel: folder || "Dropped project",
      suggestedName: folder,
    });
    set({
      ...applyProject(analysis, files, images),
      error: null,
      analyzing: false,
      stage: "set",
      plan: null,
      builtAssets: null,
      buildKind: null,
    });
  },

  setName: (name) => {
    const current = get();
    const next: Partial<KajiState> = { name };
    if (current.iconDataUrl && current.iconDataUrl.startsWith("data:image/svg+xml")) {
      next.iconDataUrl = letterIcon(name || "K");
    }
    set(next);
  },
  setIcon: (iconDataUrl) => set({ iconDataUrl }),
  setPicture: (pictureDataUrl) => set({ pictureDataUrl }),
  togglePlatform: (p) => {
    const platforms = { ...get().platforms, [p]: !get().platforms[p] };
    if (!platforms.windows && !platforms.macos && !platforms.linux) return;
    set({ platforms });
  },
  goSet: () => {
    if (get().analysis) set({ stage: "set", error: null });
  },
  goDrop: () => {
    if (get().forging) return;
    set({ stage: "drop", error: null });
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
    set({ stage: "forge", forging: true, error: null, builtAssets: null, buildKind: null });
  },
  finishForge: (plan, built) => {
    const { name, analysis, history } = get();
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      framework: analysis?.framework || "App",
      at: Date.now(),
    };
    const nextHistory = [item, ...history.filter((h) => h.name !== item.name)].slice(0, 6);
    writeHistory(nextHistory);
    set({
      plan,
      builtAssets: built.assets,
      buildKind: built.kind,
      forging: false,
      stage: "done",
      history: nextHistory,
    });
  },
  failForge: (message) => set({ forging: false, error: message, stage: "set" }),
  loadHistory: () => set({ history: readHistory() }),
  reset: () =>
    set({
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
      builtAssets: null,
      buildKind: null,
    }),
}));
