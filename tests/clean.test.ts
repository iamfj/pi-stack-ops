import { describe, expect, test } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { assertSafeDeleteTarget, cleanTarget } from "../src/core/clean.js";
import { createContext } from "../src/core/state.js";

function tempContext() {
  return createContext(mkdtempSync(join(tmpdir(), "stack-ops-test-")));
}

describe("clean target safety", () => {
  test("uses logs by default and root with --all", () => {
    const context = tempContext();

    expect(cleanTarget(false, context)).toBe(join(context.root, "logs"));
    expect(cleanTarget(true, context)).toBe(context.root);
  });

  test("rejects paths outside the artifact directory", () => {
    const context = tempContext();

    expect(() => assertSafeDeleteTarget(resolve(context.cwd, ".pi"), context)).toThrow("Refusing to clean outside");
  });
});
