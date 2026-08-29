import { createServerFn } from "@tanstack/react-start";
import { heuristicNotes, type Analysis } from "@/lib/detect";
import type { IsolatedBuildResult } from "@/lib/forge/types";

export type ForgePlan = {
  window: { width: number; height: number };
  notes: string[];
  caveats: string[];
};

function fallbackPlan(analysis: Analysis): ForgePlan {
  const wide = /dashboard|analytics|admin|editor|ide/i.test(
    `${analysis.framework} ${analysis.suggestedName} ${analysis.description ?? ""}`,
  );
  return {
    window: { width: wide ? 1440 : 1280, height: wide ? 900 : 800 },
    notes: heuristicNotes(analysis),
    caveats: analysis.alreadyDesktop
      ? ["This project already ships as a desktop app. Kaji will restamp the name and icon."]
      : [],
  };
}

export const planForge = createServerFn({ method: "POST" })
  .validator((input: { analysis: Analysis; name: string }) => input)
  .handler(async ({ data }): Promise<ForgePlan> => {
    const fallback = fallbackPlan(data.analysis);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return fallback;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 400,
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content:
                'You are Kaji, a quiet desktop-app forge. Return JSON only: {"window":{"width":number,"height":number},"notes":[string],"caveats":[string]}. Notes: max 3, short, craftsman voice. Never mention Electron, Tauri, wrappers, or packaging tools. Caveats only if something will actually bite the user.',
            },
            {
              role: "user",
              content: JSON.stringify({
                name: data.name,
                framework: data.analysis.framework,
                language: data.analysis.language,
                bundler: data.analysis.bundler,
                entry: data.analysis.entry,
                startUrl: data.analysis.startUrl,
                alreadyDesktop: data.analysis.alreadyDesktop,
                features: data.analysis.features,
                description: data.analysis.description,
              }),
            },
          ],
        }),
        signal: AbortSignal.timeout(12_000),
      });
      if (!res.ok) return fallback;
      const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const text = body.choices?.[0]?.message?.content ?? "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return fallback;
      const parsed = JSON.parse(match[0]) as ForgePlan;
      const width = Number(parsed.window?.width) || fallback.window.width;
      const height = Number(parsed.window?.height) || fallback.window.height;
      const notes = Array.isArray(parsed.notes)
        ? parsed.notes.map(String).slice(0, 3)
        : fallback.notes;
      const caveats = Array.isArray(parsed.caveats) ? parsed.caveats.map(String).slice(0, 3) : [];
      return {
        window: {
          width: Math.min(1920, Math.max(800, width)),
          height: Math.min(1200, Math.max(600, height)),
        },
        notes: notes.length ? notes : fallback.notes,
        caveats,
      };
    } catch {
      return fallback;
    }
  });

export const forgeJob = createServerFn({ method: "POST" })
  .validator(
    (input: {
      analysis: Analysis;
      name: string;
      files: Record<string, string>;
      kind: "vite" | "static" | "url";
    }) => input,
  )
  .handler(async ({ data }): Promise<{ plan: ForgePlan; compile: IsolatedBuildResult | null }> => {
    const plan = fallbackPlan(data.analysis);
    if (data.kind !== "vite") return { plan, compile: null };
    try {
      const res = await fetch("http://127.0.0.1:8787/compile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ files: data.files }),
        signal: AbortSignal.timeout(120_000),
      });
      if (res.ok) {
        const compile = (await res.json()) as IsolatedBuildResult;
        return { plan, compile };
      }
    } catch {
      /* worker not running — compile in this process */
    }
    const { runCompileWorker } = await import("@/lib/forge/compile.server");
    const compile = await runCompileWorker(data.files);
    return { plan, compile };
  });
