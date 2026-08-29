import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DesktopWindow({
  name,
  icon,
  picture,
  className,
  children,
}: {
  name: string;
  icon?: string | null;
  picture?: string | null;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-3 px-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-fg/25" />
          <span className="size-2 rounded-full bg-fg/15" />
          <span className="size-2 rounded-full bg-fg/10" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          {icon ? (
            <img
              src={icon}
              alt=""
              className="size-4 rounded-sm outline outline-1 -outline-offset-1 outline-fg/10"
            />
          ) : null}
          <span className="truncate text-xs text-muted">{name || "Untitled"}</span>
        </div>
        <div className="w-10" />
      </div>
      <div className="relative aspect-video bg-elevated">
        {children ??
          (picture ? (
            <img
              src={picture}
              alt=""
              className="absolute inset-0 size-full object-cover outline outline-1 -outline-offset-1 outline-fg/10"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-sm text-subtle">
              {name || "Your app"}
            </div>
          ))}
      </div>
    </div>
  );
}
