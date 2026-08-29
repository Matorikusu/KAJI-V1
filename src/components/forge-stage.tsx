import { useEffect, useMemo, useRef, useState } from "react";
import { forgeLogLines, heuristicNotes } from "@/lib/detect";
import { planForge, type ForgePlan } from "@/lib/forge-plan";
import { useKaji } from "@/lib/kaji-store";
import type { Platform } from "@/lib/types";

export function ForgeStage() {
  const analysis = useKaji((s) => s.analysis);
  const name = useKaji((s) => s.name);
  const iconDataUrl = useKaji((s) => s.iconDataUrl);
  const platforms = useKaji((s) => s.platforms);
  const finishForge = useKaji((s) => s.finishForge);
  const failForge = useKaji((s) => s.failForge);

  const selected = useMemo(
    () => (Object.keys(platforms) as Platform[]).filter((p) => platforms[p]),
    [platforms],
  );
  const lines = useMemo(
    () => (analysis ? forgeLogLines(analysis, name.trim() || "App", selected) : []),
    [analysis, name, selected],
  );

  const [shown, setShown] = useState(1);
  const [progress, setProgress] = useState(6);
  const planRef = useRef<ForgePlan | null>(null);

  useEffect(() => {
    if (!analysis) {
      failForge("Nothing to forge.");
      return;
    }

    let cancelled = false;
    planForge({ data: { analysis, name: name.trim() } })
      .then((plan) => {
        if (!cancelled) planRef.current = plan;
      })
      .catch(() => {
        if (!cancelled) {
          planRef.current = {
            window: { width: 1280, height: 800 },
            notes: heuristicNotes(analysis),
            caveats: [],
          };
        }
      });

    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stepMs = reduce ? 40 : 420;
    let i = 1;
    const id = window.setInterval(() => {
      i += 1;
      setShown(i);
      setProgress(Math.min(96, Math.round((i / Math.max(lines.length, 1)) * 100)));
      if (i >= lines.length) {
        window.clearInterval(id);
        window.setTimeout(() => {
          if (cancelled) return;
          const plan = planRef.current ?? {
            window: { width: 1280, height: 800 },
            notes: heuristicNotes(analysis),
            caveats: [],
          };
          finishForge(plan);
        }, reduce ? 50 : 700);
      }
    }, stepMs);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [analysis, failForge, finishForge, lines.length, name]);

  const visible = lines.slice(0, shown);

  return (
    <section className="relative mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-5 pb-28 pt-6 text-center">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-accent"
        style={{ transform: `scaleX(${progress / 100})` }}
        aria-hidden
      />
      <div className="forge-ring relative mb-10 grid size-28 place-items-center rounded-3xl bg-surface shadow-[var(--shadow-border)]">
        {iconDataUrl ? (
          <img
            src={iconDataUrl}
            alt=""
            className="size-16 rounded-2xl outline outline-1 -outline-offset-1 outline-fg/10"
          />
        ) : (
          <span className="font-display text-4xl">{(name.trim().charAt(0) || "K").toUpperCase()}</span>
        )}
      </div>
      <p className="text-xs tracking-[0.22em] text-subtle uppercase">Forging</p>
      <h2 className="mt-2 font-display text-4xl tracking-tight">{name.trim() || "App"}</h2>
      <ol className="mt-8 w-full min-h-40 self-stretch space-y-2 text-left font-mono text-sm">
        {visible.map((line, i) => (
          <li
            key={`${i}-${line}`}
            className={i === visible.length - 1 ? "text-fg" : "text-muted"}
          >
            {line}
          </li>
        ))}
      </ol>
    </section>
  );
}
