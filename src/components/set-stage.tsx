import { useRef, type ReactNode } from "react";
import { ArrowLeft, ImageIcon, Scan } from "lucide-react";
import { DesktopWindow } from "@/components/desktop-window";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKaji } from "@/lib/kaji-store";
import { PLATFORM_LABEL, type Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

const PLATFORM_ORDER: Platform[] = ["windows", "macos", "linux"];

async function readImage(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

export function SetStage() {
  const analysis = useKaji((s) => s.analysis);
  const name = useKaji((s) => s.name);
  const setName = useKaji((s) => s.setName);
  const iconDataUrl = useKaji((s) => s.iconDataUrl);
  const pictureDataUrl = useKaji((s) => s.pictureDataUrl);
  const setIcon = useKaji((s) => s.setIcon);
  const setPicture = useKaji((s) => s.setPicture);
  const platforms = useKaji((s) => s.platforms);
  const togglePlatform = useKaji((s) => s.togglePlatform);
  const startForge = useKaji((s) => s.startForge);
  const goDrop = useKaji((s) => s.goDrop);
  const error = useKaji((s) => s.error);
  const iconRef = useRef<HTMLInputElement>(null);
  const pictureRef = useRef<HTMLInputElement>(null);

  if (!analysis) return null;

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-5 pb-28 pt-2 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div>
        <Button variant="quiet" size="sm" className="mb-6 -ml-2" onClick={goDrop}>
          <ArrowLeft className="size-4" strokeWidth={1.75} />
          Back
        </Button>
        <p className="text-sm text-muted">
          {analysis.sourceKind === "url"
            ? analysis.sourceLabel
            : analysis.sourceKind === "github"
              ? analysis.repoUrl?.replace("https://", "")
              : analysis.sourceLabel}
        </p>
        <h2 className="mt-2 font-display text-4xl tracking-tight sm:text-5xl">Set the stamp.</h2>
        <p className="mt-3 max-w-md text-muted">
          {analysis.framework} · {analysis.language}
          {analysis.bundler ? ` · ${analysis.bundler}` : ""}
        </p>

        <div className="mt-6 lg:hidden">
          <DesktopWindow name={name || "Untitled"} icon={iconDataUrl} picture={pictureDataUrl} />
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="app-name" className="mb-2 block text-xs tracking-[0.16em] text-subtle uppercase">
              Name
            </label>
            <Input
              id="app-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Application name"
              maxLength={48}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <UploadTile
              label="Icon"
              hint="Square mark"
              onClick={() => iconRef.current?.click()}
            >
              {iconDataUrl ? (
                <img
                  src={iconDataUrl}
                  alt=""
                  className="size-16 rounded-lg outline outline-1 -outline-offset-1 outline-fg/10"
                />
              ) : (
                <Scan className="size-6 text-subtle" strokeWidth={1.5} />
              )}
            </UploadTile>
            <UploadTile
              label="Picture"
              hint="Window cover"
              onClick={() => pictureRef.current?.click()}
            >
              {pictureDataUrl ? (
                <img
                  src={pictureDataUrl}
                  alt=""
                  className="h-16 w-full rounded-md object-cover outline outline-1 -outline-offset-1 outline-fg/10"
                />
              ) : (
                <ImageIcon className="size-6 text-subtle" strokeWidth={1.5} />
              )}
            </UploadTile>
            <input
              ref={iconRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) setIcon(await readImage(file));
                e.target.value = "";
              }}
            />
            <input
              ref={pictureRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) setPicture(await readImage(file));
                e.target.value = "";
              }}
            />
          </div>

          <div>
            <p className="mb-2 text-xs tracking-[0.16em] text-subtle uppercase">Platforms</p>
            <div className="grid grid-cols-3 gap-2">
              {PLATFORM_ORDER.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={cn(
                    "flex h-14 items-center justify-center rounded-lg text-sm transition-[box-shadow,background-color,color] duration-150",
                    platforms[p]
                      ? "bg-accent text-accent-fg"
                      : "bg-surface text-muted shadow-[var(--shadow-border)] hover:text-fg",
                  )}
                >
                  {PLATFORM_LABEL[p]}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}

          <Button size="xl" className="w-full" onClick={startForge} disabled={!name.trim()}>
            Forge
          </Button>
        </div>
      </div>

      <div className="reveal hidden lg:block">
        <DesktopWindow name={name || "Untitled"} icon={iconDataUrl} picture={pictureDataUrl} />
        {analysis.description ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">{analysis.description}</p>
        ) : null}
      </div>
    </section>
  );
}

function UploadTile({
  label,
  hint,
  onClick,
  children,
}: {
  label: string;
  hint: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-28 flex-col items-start gap-3 rounded-xl bg-surface p-4 text-left shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
    >
      <span className="text-xs tracking-[0.16em] text-subtle uppercase">{label}</span>
      <div className="flex w-full items-center justify-center">{children}</div>
      <span className="text-xs text-muted">{hint}</span>
    </button>
  );
}
