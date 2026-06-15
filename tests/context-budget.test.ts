import { describe, expect, test } from "bun:test";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { activeSessionPath, runContextBudget, writeActiveSession } from "../src/core/context-budget.js";
import { createContext, ensureDirs } from "../src/core/state.js";

function tempContext() {
  const context = createContext(mkdtempSync(join(tmpdir(), "stack-ops-context-budget-test-")));
  ensureDirs(context);
  return context;
}

function writeSession(context: ReturnType<typeof tempContext>, name: string, tokens?: number) {
  const file = join(context.root, `${name}.jsonl`);
  const entries = [
    { type: "session", id: name, cwd: context.cwd },
    tokens === undefined
      ? { type: "message", message: { role: "user", content: "start" } }
      : { type: "message", message: { role: "assistant", usage: { totalTokens: tokens }, model: "test-model" } },
  ];
  writeFileSync(file, `${entries.map((entry) => JSON.stringify(entry)).join("\n")}\n`);
  return file;
}

function readJson(result: ReturnType<typeof runContextBudget>) {
  return JSON.parse(result.stdout) as { verdict: string; reason: string; usage: { percent: number | null } };
}

describe("context budget", () => {
  test("records and uses the active session instead of locating the latest cwd session", () => {
    const context = tempContext();
    const sessionFile = writeSession(context, "active-session", 59_000);

    writeActiveSession({ sessionId: "active-session", sessionFile, contextWindow: 100_000 }, context);

    const result = runContextBudget(["--guard", "next-iteration", "--json"], context);
    const snapshot = readJson(result);

    expect(result.exitCode).toBe(0);
    expect(snapshot.verdict).toBe("continue");
    expect(snapshot.usage.percent).toBe(59);
    expect(readFileSync(activeSessionPath(context), "utf8")).toContain("active-session");
  });

  test("stops at the default sixty percent guard", () => {
    const context = tempContext();
    const sessionFile = writeSession(context, "sixty-percent", 60_000);
    writeActiveSession({ sessionId: "sixty-percent", sessionFile, contextWindow: 100_000 }, context);

    const result = runContextBudget(["--guard", "next-iteration", "--json"], context);
    const snapshot = readJson(result);

    expect(result.exitCode).toBe(2);
    expect(snapshot.verdict).toBe("stop");
    expect(snapshot.reason).toBe("context_used_percent_exceeds_guard");
  });

  test("fails closed when context usage is unknown", () => {
    const context = tempContext();
    const sessionFile = writeSession(context, "unknown-usage");
    writeActiveSession({ sessionId: "unknown-usage", sessionFile, contextWindow: 100_000 }, context);

    const result = runContextBudget(["--guard", "next-iteration", "--json"], context);
    const snapshot = readJson(result);

    expect(result.exitCode).toBe(2);
    expect(snapshot.verdict).toBe("unknown");
    expect(snapshot.reason).toBe("unknown_context_usage");
  });

  test("fails closed when context window is unknown", () => {
    const context = tempContext();
    const sessionFile = writeSession(context, "unknown-window", 1_000);
    writeActiveSession({ sessionId: "unknown-window", sessionFile }, context);

    const result = runContextBudget(["--guard", "next-iteration", "--json"], context);
    const snapshot = readJson(result);

    expect(result.exitCode).toBe(2);
    expect(snapshot.verdict).toBe("unknown");
    expect(snapshot.reason).toBe("unknown_context_window");
  });

  test("rejects output outside the context-budget artifact directory", () => {
    const context = tempContext();
    const sessionFile = writeSession(context, "bad-out", 1_000);
    writeActiveSession({ sessionId: "bad-out", sessionFile, contextWindow: 100_000 }, context);

    const result = runContextBudget(["--out", ".pi/stack-ops/session.json"], context);

    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain("context-budget --out must be under .pi/stack-ops/context-budget/");
  });
});
