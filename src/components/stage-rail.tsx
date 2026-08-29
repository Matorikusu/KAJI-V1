import { useKaji, type Stage } from "@/lib/kaji-store";
import { cn } from "@/lib/utils";

const STEPS: { id: Stage; n: string; label: string }[] = [
  { id: "drop", n: "01", label: "Drop" },
  { id: "set", n: "02", label: "Set" },
  { id: "forge", n: "03", label: "Forge" },
  { id: "done", n: "04", label: "Done" },
];

const ORDER: Stage[] = ["drop", "set", "forge", "done"];

export function StageRail() {
  const stage = useKaji((s) => s.stage);
  const analysis = useKaji((s) => s.analysis);
  const plan = useKaji((s) => s.plan);
  const forging = useKaji((s) => s.forging);
  const goDrop = useKaji((s) => s.goDrop);
  const goSet = useKaji((s) => s.goSet);

  return (
    <nav
      aria-label="Forge stages"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <ol className="pointer-events-auto flex items-center gap-1 rounded-xl bg-bg/80 px-2 py-2 shadow-[var(--shadow-border)] backdrop-blur-sm sm:gap-2 sm:px-3">
        {STEPS.map((step) => {
          const active = step.id === stage;
          const idx = ORDER.indexOf(step.id);
          const current = ORDER.indexOf(stage);
          const done = idx < current;
          const canGo =
            !forging &&
            ((step.id === "drop") ||
              (step.id === "set" && analysis) ||
              (step.id === "done" && plan));
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!canGo || active}
                onClick={() => {
                  if (step.id === "drop") goDrop();
                  if (step.id === "set") goSet();
                  if (step.id === "done" && plan) useKaji.setState({ stage: "done" });
                }}
                className={cn(
                  "flex h-11 min-w-11 items-center gap-2 rounded-lg px-2.5 text-xs tracking-wide sm:px-3",
                  active && "text-fg",
                  !active && done && "text-muted",
                  !active && !done && "text-subtle",
                  canGo && !active && "hover:text-fg",
                )}
              >
                <span className="font-mono tabular-nums">{step.n}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
