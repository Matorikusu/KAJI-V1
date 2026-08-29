import { useKaji } from "@/lib/kaji-store";

export function KajiHeader() {
  const reset = useKaji((s) => s.reset);
  const forging = useKaji((s) => s.forging);

  return (
    <header className="relative z-20 flex items-center justify-between px-5 py-5 sm:px-8">
      <button
        type="button"
        onClick={() => {
          if (!forging) reset();
        }}
        className="font-display text-2xl leading-none tracking-tight text-fg"
        aria-label="Kaji, start over"
      >
        Kaji
      </button>
      <p className="text-xs tracking-[0.18em] text-subtle uppercase">Matorikusu</p>
    </header>
  );
}
