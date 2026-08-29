import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hasViteSource, planBuild, staticAssetsFromFiles } from "./build-plan.ts";
import { getSample } from "../samples.ts";
import type { Analysis } from "../detect.ts";

function stub(partial: Partial<Analysis>): Analysis {
  return {
    sourceKind: "sample",
    sourceLabel: "x",
    suggestedName: "X",
    framework: "Static site",
    language: "HTML",
    features: [],
    fileCount: 0,
    ...partial,
  };
}

describe("planBuild", () => {
  it("plans an isolated Vite compile for North", () => {
    const sample = getSample("north");
    assert.ok(sample);
    assert.equal(hasViteSource(sample.files), true);
    const plan = planBuild(
      stub({
        suggestedName: "North",
        framework: "React (Vite)",
        bundler: "Vite",
        language: "TypeScript",
        fileCount: Object.keys(sample.files).length,
      }),
      sample.files,
    );
    assert.equal(plan.kind, "vite");
  });

  it("plans a static pack for Quill", () => {
    const sample = getSample("quill");
    assert.ok(sample);
    const plan = planBuild(
      stub({
        suggestedName: "Quill",
        framework: "Static site",
        fileCount: Object.keys(sample.files).length,
      }),
      sample.files,
    );
    assert.equal(plan.kind, "static");
    const assets = staticAssetsFromFiles(sample.files);
    assert.ok(assets.some((a) => a.path === "index.html"));
    assert.ok(assets.some((a) => a.path === "styles.css"));
  });

  it("wraps a live URL instead of compiling", () => {
    const plan = planBuild(
      stub({
        sourceKind: "url",
        sourceLabel: "example.com",
        suggestedName: "Example",
        framework: "Live web app",
        startUrl: "https://example.com",
      }),
      {},
    );
    assert.equal(plan.kind, "url");
  });
});
