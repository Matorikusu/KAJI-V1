import { useEffect, useState } from "react";
import { executeForge } from "@/lib/forge/pipeline";
import { useKaji } from "@/lib/kaji-store";

export function ForgeStage() {
  const analysis = useKaji((s) => s.analysis);
  const files = useKaji((s) => s.files);
  const name = useKaji((s) => s.name);
  const iconDataUrl = useKaji((s) => s.iconDataUrl);
  const finishForge = useKaji((s) => s.finishForge);
  const failForge = useKaji((s) => s.failForge);

  const [lines, setLines] = useState<string[]>(["Opened the crate."]);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (!analysis) {
      failForge("Nothing to forge.");
      return;
    }

    let cancelled = false;
    const log = (line: string) => {
      if (cancelled) return;
      setLines((prev) => (prev[prev.length - 1] === line ? prev : [...prev, line]));
      setProgress((p) => Math.min(92, p + 10));
    };

    executeForge({ analysis, files, name: name.trim() || "App", log })
      .then((result) => {
        if (cancelled) return;
        if (!result.ok) {
          failForge(result.error);
          return;
        }
        setProgress(100);
        finishForge(result.plan, { assets: result.assets, kind: result.kind });
      })
      .catch(() => {
        if (!cancelled) failForge("The forge could not finish.");
      });

    return () => {
      cancelled = true;
    };
  }, [analysis, failForge, files, finishForge, name]);

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
        {lines.map((line, i) => (
          <li key={`${i}-${line}`} className={i === lines.length - 1 ? "text-fg" : "text-muted"}>
            {line}
          </li>
        ))}
      </ol>
    </section>
  );
}