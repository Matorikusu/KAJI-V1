#!/usr/bin/env node
import http from "node:http";
import { spawn } from "node:child_process";
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const PORT = Number(process.env.KAJI_COMPILE_PORT || 8787);
const here = dirname(fileURLToPath(import.meta.url));
const compileScript = join(here, "kaji-compile.mjs");

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 5_000_000) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function compile(files) {
  const dir = join("/tmp", `kaji-job-${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const inputPath = join(dir, "in.json");
  const outputPath = join(dir, "out.json");
  await mkdir(dir, { recursive: true });
  try {
    await writeFile(inputPath, JSON.stringify({ files }));
    await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [compileScript, inputPath, outputPath], {
        stdio: ["ignore", "pipe", "pipe"],
        env: { ...process.env, NODE_PATH: join(here, "..", "node_modules") },
      });
      let stderr = "";
      child.stderr.on("data", (d) => {
        stderr += d.toString();
      });
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error("Compile timed out."));
      }, 120_000);
      child.on("exit", (code) => {
        clearTimeout(timer);
        if (code === 0) resolve();
        else reject(new Error(stderr.slice(0, 400) || `Compile exited ${code}`));
      });
      child.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch (err) {
    try {
      return JSON.parse(await readFile(outputPath, "utf8"));
    } catch {
      return {
        ok: false,
        error: "The project failed to compile.",
        log: [err instanceof Error ? err.message.slice(0, 400) : "Compile failed."],
      };
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

const server = http.createServer(async (req, res) => {
  const json = (status, body) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
  if (req.method === "GET" && req.url === "/health") {
    json(200, { ok: true });
    return;
  }
  if (req.method !== "POST" || req.url !== "/compile") {
    json(404, { ok: false, error: "Not found." });
    return;
  }
  try {
    const raw = await readBody(req);
    const payload = JSON.parse(raw.toString("utf8"));
    const result = await compile(payload.files || {});
    json(200, result);
  } catch (err) {
    json(500, {
      ok: false,
      error: "The project failed to compile.",
      log: [err instanceof Error ? err.message : "Compile failed."],
    });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  process.stderr.write(`kaji-compile listening on 127.0.0.1:${PORT}\n`);
});
