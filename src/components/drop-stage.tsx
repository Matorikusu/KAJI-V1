import { useRef, useState, type DragEvent, type FormEvent } from "react";
import { ArrowRight, Folder, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SAMPLES } from "@/lib/samples";
import { useKaji } from "@/lib/kaji-store";
import { readFileList, uriFromDrop } from "@/lib/read-drop";
import { cn } from "@/lib/utils";

export function DropStage() {
  const ingestUrl = useKaji((s) => s.ingestUrl);
  const ingestSample = useKaji((s) => s.ingestSample);
  const ingestFiles = useKaji((s) => s.ingestFiles);
  const analyzing = useKaji((s) => s.analyzing);
  const error = useKaji((s) => s.error);
  const history = useKaji((s) => s.history);
  const [value, setValue] = useState("");
  const [over, setOver] = useState(false);
  const filesRef = useRef<HTMLInputElement>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  async function submitUrl(raw: string) {
    const next = raw.trim();
    if (!next || analyzing) return;
    await ingestUrl(next);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await submitUrl(value);
  }

  async function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    if (analyzing) return;
    const uri = uriFromDrop(e.nativeEvent);
    if (uri) {
      setValue(uri);
      await submitUrl(uri);
      return;
    }
    if (e.dataTransfer.files?.length) {
      const read = await readFileList(e.dataTransfer.files);
      ingestFiles(read.files, read.images);
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 pb-28 pt-6 sm:px-8">
      <p className="reveal text-sm tracking-[0.22em] text-muted uppercase">Your code. Their desktop.</p>
      <h1 className="reveal mt-4 font-display text-5xl leading-[0.95] tracking-tight text-fg sm:text-7xl">
        Drop a project.
        <br />
        <span className="italic">Kaji does the rest.</span>
      </h1>
      <p className="reveal mt-6 max-w-md text-base leading-relaxed text-muted delay-100">
        Name it. Add an icon. Add a picture. Choose the platforms. Forge.
      </p>

      <form
        onSubmit={onSubmit}
        onDragEnter={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "reveal mt-10 rounded-2xl bg-surface p-3 delay-150 sm:p-4",
          "shadow-[var(--shadow-border)] transition-[box-shadow] duration-150",
          over && "shadow-[var(--shadow-border-hover)]",
        )}
      >
        <label className="sr-only" htmlFor="project-url">
          GitHub repository or website URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            id="project-url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={over ? "Release to open" : "github.com/you/project"}
            disabled={analyzing}
            autoComplete="off"
            spellCheck={false}
            className="h-14 rounded-xl bg-elevated text-base sm:flex-1"
          />
          <Button
            type="submit"
            size="xl"
            disabled={analyzing || !value.trim()}
            className="w-full shrink-0 sm:w-auto"
          >
            {analyzing ? "Opening" : "Open"}
            <ArrowRight className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
          <span className="text-xs text-subtle">Or</span>
          <Button
            variant="quiet"
            size="sm"
            className="h-11 px-2"
            onClick={() => filesRef.current?.click()}
            disabled={analyzing}
          >
            <Paperclip className="size-3.5" strokeWidth={1.75} />
            Files
          </Button>
          <Button
            variant="quiet"
            size="sm"
            className="h-11 px-2"
            onClick={() => folderRef.current?.click()}
            disabled={analyzing}
          >
            <Folder className="size-3.5" strokeWidth={1.75} />
            Folder
          </Button>
          <input
            ref={filesRef}
            type="file"
            className="sr-only"
            multiple
            onChange={async (e) => {
              if (!e.target.files?.length) return;
              const read = await readFileList(e.target.files);
              ingestFiles(read.files, read.images);
              e.target.value = "";
            }}
          />
          <input
            ref={folderRef}
            type="file"
            className="sr-only"
            multiple
            {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
            onChange={async (e) => {
              if (!e.target.files?.length) return;
              const read = await readFileList(e.target.files);
              ingestFiles(read.files, read.images);
              e.target.value = "";
            }}
          />
        </div>
      </form>

      {error ? (
        <p className="mt-4 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-4 text-sm text-subtle">Drop a folder, a zip, or paste any live site to wrap it.</p>
      )}

      <div className="reveal mt-10 delay-200">
        <p className="text-xs tracking-[0.18em] text-subtle uppercase">Try a crate</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              disabled={analyzing}
              onClick={() => ingestSample(sample.id)}
              className="flex h-11 items-center gap-3 rounded-lg bg-surface px-4 text-sm shadow-[var(--shadow-border)] transition-[box-shadow] duration-150 hover:shadow-[var(--shadow-border-hover)]"
            >
              <span className="text-fg">{sample.name}</span>
              <span className="text-subtle">{sample.blurb}</span>
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 ? (
        <div className="mt-10">
          <p className="text-xs tracking-[0.18em] text-subtle uppercase">Recent</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
            {history.map((item) => (
              <li key={item.id}>
                <span className="text-fg">{item.name}</span>
                <span className="text-subtle"> · {item.framework}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
