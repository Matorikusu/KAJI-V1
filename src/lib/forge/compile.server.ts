import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import type { FileMap } from "@/lib/detect";
import type { IsolatedBuildResult } from "@/lib/forge/types";

const execFileAsync = promisify(execFile);

export async function runCompileWorker(files: FileMap): Promise<IsolatedBuildResult> {
  const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const dir = join(tmpdir(), `kaji-job-${stamp}`);
  const inputPath = join(dir, "in.json");
  const outputPath = join(dir, "out.json");
  const scriptCandidates = [
    resolve(process.cwd(), "scripts/kaji-compile.mjs"),
    resolve(process.cwd(), "kaji-compile.mjs"),
    resolve(process.cwd(), "../scripts/kaji-compile.mjs"),
  ];
  const { access } = await import("node:fs/promises");
  let script = scriptCandidates[0];
  for (const candidate of scriptCandidates) {
    try {
      await access(candidate);
      script = candidate;
      break;
    } catch {
      /* try next */
    }
  }

  await mkdir(dir, { recursive: true });
  try {
    await writeFile(inputPath, JSON.stringify({ files }));
    try {
      await execFileAsync(process.execPath, [script, inputPath, outputPath], {
        timeout: 120_000,
        maxBuffer: 8_000_000,
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          NODE_PATH: resolve(process.cwd(), "node_modules"),
        },
      });
    } catch (err) {
      try {
        return JSON.parse(await readFile(outputPath, "utf8")) as IsolatedBuildResult;
      } catch {
        const message = err instanceof Error ? err.message : "Compile worker failed.";
        return { ok: false, error: "The project failed to compile.", log: [message.slice(0, 400)] };
      }
    }
    return JSON.parse(await readFile(outputPath, "utf8")) as IsolatedBuildResult;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
