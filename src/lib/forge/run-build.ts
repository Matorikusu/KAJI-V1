import { createServerFn } from "@tanstack/react-start";
import type { FileMap } from "@/lib/detect";
import type { IsolatedBuildResult } from "@/lib/forge/types";

const COMPILE_URL = "http://127.0.0.1:8787/compile";

export const runIsolatedBuild = createServerFn({ method: "POST" })
  .validator((input: { files: FileMap }) => input)
  .handler(async ({ data }): Promise<IsolatedBuildResult> => {
    try {
      const res = await fetch(COMPILE_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ files: data.files }),
        signal: AbortSignal.timeout(120_000),
      });
      const body = (await res.json()) as IsolatedBuildResult;
      if (body && typeof body === "object") return body;
      return { ok: false, error: "Empty compile response.", log: [] };
    } catch {
      return {
        ok: false,
        error: "The compile worker is not running.",
        log: ["Could not reach the isolated build worker."],
      };
    }
  });
