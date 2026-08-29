import { join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { promisify } from "node:util";
//#region node_modules/.nitro/vite/services/ssr/assets/compile.server-C0FVNEfn.js
var execFileAsync = promisify(execFile);
async function runCompileWorker(files) {
	const stamp = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
	const dir = join(tmpdir(), `kaji-job-${stamp}`);
	const inputPath = join(dir, "in.json");
	const outputPath = join(dir, "out.json");
	const script = resolve(process.cwd(), "scripts/kaji-compile.mjs");
	await mkdir(dir, { recursive: true });
	try {
		await writeFile(inputPath, JSON.stringify({ files }));
		try {
			await execFileAsync(process.execPath, [
				script,
				inputPath,
				outputPath
			], {
				timeout: 12e4,
				maxBuffer: 8e6,
				env: {
					PATH: process.env.PATH,
					HOME: process.env.HOME,
					NODE_PATH: resolve(process.cwd(), "node_modules")
				}
			});
		} catch (err) {
			try {
				return JSON.parse(await readFile(outputPath, "utf8"));
			} catch {
				return {
					ok: false,
					error: "The project failed to compile.",
					log: [(err instanceof Error ? err.message : "Compile worker failed.").slice(0, 400)]
				};
			}
		}
		return JSON.parse(await readFile(outputPath, "utf8"));
	} finally {
		await rm(dir, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { runCompileWorker };
