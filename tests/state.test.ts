import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { artifactDirs, createContext, ensureDirs, readState, renderState, sanitizeState, writeState } from "../src/core/state.js";

function tempContext() {
  return createContext(mkdtempSync(join(tmpdir(), "stack-ops-test-")));
}

describe("stack-ops state", () => {
  test("creates the expected artifact directories", () => {
    const context = tempContext();

    ensureDirs(context);

    expect(existsSync(context.root)).toBe(true);
    for (const dir of artifactDirs) expect(existsSync(join(context.root, dir))).toBe(true);
  });

  test("sanitizes malformed state input", () => {
    const state = sanitizeState({
      phase: "bad",
      stack: "stack\u0000name",
      blockers: [{ summary: "blocked\u0007", severity: "critical" }],
      next: ["/next\u0000", 123],
    });

    expect(state.phase).toBe("idle");
    expect(state.stack).toBe("stackname");
    expect(state.blockers).toEqual([{ id: "B1", summary: "blocked", severity: undefined }]);
    expect(state.next).toEqual(["/next"]);
  });

  test("returns a blocked state for invalid JSON", () => {
    const context = tempContext();
    ensureDirs(context);
    writeFileSync(context.stateFile, "not-json");

    const state = readState(context);

    expect(state.phase).toBe("blocked");
    expect(state.blockers[0]?.id).toBe("state");
  });

  test("writes state files with owner-only permissions", () => {
    const context = tempContext();

    writeState({ phase: "plan", next: ["/implement"] }, context);

    const raw = readFileSync(context.stateFile, "utf8");
    expect(JSON.parse(raw).phase).toBe("plan");
    expect((statSync(context.stateFile).mode & 0o777).toString(8)).toBe("600");
  });

  test("renders status text for CLI and extension entrypoints", () => {
    const text = renderState({ ...sanitizeState({ phase: "implement", stack: "demo", next: ["/finish"] }), updatedAt: "now" });

    expect(text).toContain("Phase: implement");
    expect(text).toContain("Stack: demo");
    expect(text).toContain("- /finish");
  });
});
