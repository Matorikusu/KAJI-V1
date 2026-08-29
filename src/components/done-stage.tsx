import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { DesktopWindow } from "@/components/desktop-window";
import { Button } from "@/components/ui/button";
import { buildDesktopZip, triggerDownload } from "@/lib/package-app";
import { useKaji } from "@/lib/kaji-store";
import { PLATFORM_ARTIFACT, PLATFORM_LABEL, type Platform } from "@/lib/types";

const KIND_LABEL = {
  vite: "Compiled with Vite",
  static: "Packed as static files",
  url: "Live site in a native window",
} as const;

export function DoneStage() {
  const analysis = useKaji((s) => s.analysis);
  const plan = useKaji((s) => s.plan);
  const name = useKaji((s) => s.name);
  const iconDataUrl = useKaji((s) => s.iconDataUrl);
  const pictureDataUrl = useKaji((s) => s.pictureDataUrl);
  const platforms = useKaji((s) => s.platforms);
  const files = useKaji((s) => s.files);
  const builtAssets = useKaji((s) => s.builtAssets);
  const buildKind = useKaji((s) => s.buildKind);
  const reset = useKaji((s) => s.reset);
  const [busy, setBusy] = useState<Platform | "all" | null>(null);

  const selected = (Object.keys(platforms) as Platform[]).filter((p) => platforms[p]);

  async function pack(platform: Platform) {
    if (!analysis || !plan) throw new Error("missing");
    return buildDesktopZip({
      name: name.trim(),
      analysis,
      plan,
      platform,
      iconDataUrl,
      pictureDataUrl,
      files,
      assets: builtAssets,
      kind: buildKind,
    });
  }

  async function download(platform: Platform) {
    setBusy(platform);
    try {
      const built = await pack(platform);
      triggerDownload(built.blob, built.filename);
      toast.success(
        `${PLATFORM_LABEL[platform]}${PLATFORM_ARTIFACT[platform] ? ` ${PLATFORM_ARTIFACT[platform]}` : ""} is ready`,
      );
    } catch {
      toast.error("Could not compile that build.");
    } finally {
      setBusy(null);
    }
  }

  async function downloadAll() {
    setBusy("all");
    try {
      for (const p of selected) {
        const built = await pack(p);
        triggerDownload(built.blob, built.filename);
      }
      toast.success("All builds are ready");
    } catch {
      toast.error("Could not compile those builds.");
    } finally {
      setBusy(null);
    }
  }

  if (!analysis || !plan) return null;

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-5 pb-28 pt-2 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div>
        <p className="text-sm tracking-[0.22em] text-muted uppercase">Done</p>
        <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-6xl">
          {name.trim()} is forged.
        </h2>
        <p className="mt-4 max-w-md text-muted">
          Compiled to a standalone desktop app. Download, unzip, and double-click. No Visual
          Studio. No Node. No terminal.
        </p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {selected.map((p) => (
            <Button
              key={p}
              size="lg"
              variant={p === selected[0] ? "primary" : "outline"}
              className="min-w-40"
              disabled={busy !== null}
              onClick={() => download(p)}
            >
              <Download className="size-4" strokeWidth={1.75} />
              {busy === p
                ? "Compiling"
                : PLATFORM_ARTIFACT[p]
                  ? `${PLATFORM_LABEL[p]} (${PLATFORM_ARTIFACT[p]})`
                  : PLATFORM_LABEL[p]}
            </Button>
          ))}
          {selected.length > 1 ? (
            <Button size="lg" variant="ghost" disabled={busy !== null} onClick={downloadAll}>
              {busy === "all" ? "Compiling" : "All platforms"}
            </Button>
          ) : null}
        </div>

        <dl className="mt-10 grid gap-4 text-sm sm:grid-cols-2">
          <Fact label="What it is" value={`${analysis.framework} · ${analysis.language}`} />
          <Fact
            label="Forge"
            value={buildKind ? KIND_LABEL[buildKind] : "Native window"}
          />
          <Fact label="Window" value={`${plan.window.width} × ${plan.window.height}`} />
          {analysis.entry ? <Fact label="Entry" value={analysis.entry} /> : null}
        </dl>

        {plan.notes.length ? (
          <ul className="mt-8 space-y-2 text-sm text-muted">
            {plan.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        {plan.caveats.length ? (
          <ul className="mt-4 space-y-1 text-sm text-subtle">
            {plan.caveats.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}

        <Button variant="quiet" className="mt-10 -ml-2" onClick={reset}>
          Forge another
        </Button>
      </div>

      <DesktopWindow
        name={name.trim()}
        icon={iconDataUrl}
        picture={pictureDataUrl}
        className="reveal"
      />
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs tracking-[0.16em] text-subtle uppercase">{label}</dt>
      <dd className="mt-1 truncate text-fg">{value}</dd>
    </div>
  );
}
