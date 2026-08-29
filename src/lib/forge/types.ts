export type BuildKind = "vite" | "static" | "url";

export type BuiltAsset = {
  path: string;
  encoding: "utf8" | "base64";
  content: string;
};

export type ExecutablePlan = {
  kind: BuildKind;
  packageManager: "npm";
  outDir: string;
  reason: string;
};

export type IsolatedBuildResult =
  | { ok: true; assets: BuiltAsset[]; outDir: string; log: string[] }
  | { ok: false; error: string; log: string[] };
