import { heuristicNotes } from "@/lib/detect";
import type { Analysis, FileMap } from "@/lib/detect";
import { planBuild, staticAssetsFromFiles } from "@/lib/forge/build-plan";
import type { BuildKind, BuiltAsset } from "@/lib/forge/types";
import { forgeJob, type ForgePlan } from "@/lib/forge-plan";

export type PipelineOk = {
  ok: true;
  kind: BuildKind;
  assets: BuiltAsset[] | null;
  plan: ForgePlan;
  logs: string[];
};

export type PipelineErr = { ok: false; error: string; logs: string[] };

export async function executeForge(opts: {
  analysis: Analysis;
  files: FileMap;
  name: string;
  log: (line: string) => void;
}): Promise<PipelineOk | PipelineErr> {
  const logs: string[] = [];
  const say = (line: string) => {
    logs.push(line);
    opts.log(line);
  };

  say("Opened the crate.");
  const exec = planBuild(opts.analysis, opts.files);
  if (exec.kind === "none") {
    say(exec.reason);
    return { ok: false, error: exec.reason, logs };
  }

  say(`Found ${opts.analysis.framework}.`);
  if (opts.analysis.bundler) say(`${opts.analysis.bundler}, ready.`);

  let assets: BuiltAsset[] | null = null;
  const kind: BuildKind = exec.kind;
  let plan: ForgePlan = {
    window: { width: 1280, height: 800 },
    notes: heuristicNotes(opts.analysis),
    caveats: [],
  };

  if (exec.kind === "vite") {
    say("Opening an isolated sandbox.");
    say("Compiling.");
    const job = await forgeJob({
      data: { analysis: opts.analysis, name: opts.name, files: opts.files, kind: "vite" },
    });
    plan = job.plan;
    if (!job.compile?.ok) {
      const extra = job.compile?.log ?? [];
      for (const line of extra) say(line);
      return { ok: false, error: job.compile?.error || "The project failed to compile.", logs };
    }
    for (const line of job.compile.log) say(line);
    assets = job.compile.assets;
    say("Wrapping the compiled app in a native window.");
  } else if (exec.kind === "static") {
    const job = await forgeJob({
      data: { analysis: opts.analysis, name: opts.name, files: {}, kind: "static" },
    });
    plan = job.plan;
    assets = staticAssetsFromFiles(opts.files);
    if (!assets.length) {
      return { ok: false, error: "No HTML to pack.", logs };
    }
    say("Packing the site as-is.");
    say("Wrapping it in a native window.");
  } else {
    const job = await forgeJob({
      data: { analysis: opts.analysis, name: opts.name, files: {}, kind: "url" },
    });
    plan = job.plan;
    say(`Pointing the window at ${opts.analysis.startUrl}.`);
  }

  say(`Stamped “${opts.name}”.`);
  say("Ready.");
  return { ok: true, kind, assets, plan, logs };
}