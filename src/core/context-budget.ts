import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, resolve } from "node:path";
import type { StackOpsContext } from "./state.js";
import { createContext } from "./state.js";

const usage = `Usage: stack-ops context-budget [options]

Check whether the recorded Pi session has enough context for another workflow unit.

Options:
  --json                                 Print JSON output
  --snapshot                             Record current usage without guarding
  --guard <unit>                         Guard the next workflow unit
  --session <id|path>                    Session id or JSONL path; defaults to .pi/stack-ops/session.json
  --session-dir <path>                   Directory used to resolve session ids
  --context-window <tokens>              Context window, for example 272000 or 272K
  --max-used-percent <number>            Stop at or above this used percentage (default: 60)
  --out <path>                           Write JSON under .pi/stack-ops/context-budget/
`;

export type ContextBudgetVerdict = "continue" | "stop" | "unknown";

type ParsedArgs =
  | { kind: "help" }
  | { kind: "error"; message: string }
  | {
      kind: "run";
      json: boolean;
      snapshot: boolean;
      guard?: string;
      session?: string;
      sessionDir?: string;
      contextWindow?: number;
      maxUsedPercent: number;
      out?: string;
    };

type ActiveSessionRecord = {
  schemaVersion: 1;
  sessionId?: string;
  sessionFile?: string;
  contextWindow?: number;
  model?: string;
  updatedAt: string;
};

type SessionHeader = {
  type: "session";
  id?: string;
  cwd?: string;
};

type SessionEntry = {
  type?: string;
  message?: {
    role?: string;
    usage?: { totalTokens?: number; input?: number; output?: number };
    model?: string;
  };
  modelId?: string;
};

export type ContextBudgetSnapshot = {
  schemaVersion: 1;
  createdAt: string;
  command: "context-budget";
  verdict: ContextBudgetVerdict;
  reason: string;
  nextAction: string;
  guard?: string;
  session: {
    id?: string;
    file?: string;
    cwd?: string;
    model?: string;
    contextWindow: number | null;
  };
  usage: {
    tokens: number | null;
    percent: number | null;
    remainingTokens: number | null;
  };
  budget: {
    maxUsedPercent: number;
  };
  issues: string[];
};

export type CommandResult = { exitCode: number; stdout: string; stderr: string };

export function activeSessionPath(context = createContext()) {
  return join(context.root, "session.json");
}

export function writeActiveSession(record: Omit<ActiveSessionRecord, "schemaVersion" | "updatedAt">, context = createContext()) {
  mkdirSync(context.root, { recursive: true });
  writeFileSync(
    activeSessionPath(context),
    `${JSON.stringify({ schemaVersion: 1, ...record, updatedAt: new Date().toISOString() }, null, 2)}\n`,
    { mode: 0o600 },
  );
}

export function runContextBudget(args: string[], context: StackOpsContext = createContext()): CommandResult {
  const parsed = parseArgs(args);
  if (parsed.kind === "help") return { exitCode: 0, stdout: usage, stderr: "" };
  if (parsed.kind === "error") return { exitCode: 1, stdout: "", stderr: `${parsed.message}\n\n${usage}` };

  const activeSession = parsed.session ? undefined : readActiveSession(context);
  const sessionFile = resolveSessionFile(parsed.session, parsed.sessionDir, activeSession, context.cwd);
  if (sessionFile.kind === "error") return { exitCode: 1, stdout: "", stderr: `${sessionFile.message}\n` };

  const session = readSession(sessionFile.path);
  if (session.kind === "error") return { exitCode: 1, stdout: "", stderr: `${session.message}\n` };

  const contextWindow = parsed.contextWindow ?? activeSession?.contextWindow ?? null;
  const snapshot = evaluateContextBudget({
    guard: parsed.guard,
    sessionFile: sessionFile.path,
    sessionId: session.header.id ?? activeSession?.sessionId,
    sessionCwd: session.header.cwd,
    model: session.usage.model ?? activeSession?.model,
    contextWindow,
    tokens: session.usage.tokens,
    maxUsedPercent: parsed.maxUsedPercent,
  });

  if (parsed.out) {
    const outPath = resolveOutPath(parsed.out, context);
    if (outPath.kind === "error") return { exitCode: 1, stdout: "", stderr: `${outPath.message}\n` };
    mkdirSync(dirname(outPath.path), { recursive: true });
    writeFileSync(outPath.path, `${JSON.stringify(snapshot, null, 2)}\n`, { mode: 0o600 });
  }

  return {
    exitCode: snapshot.verdict === "continue" ? 0 : 2,
    stdout: parsed.json ? `${JSON.stringify(snapshot, null, 2)}\n` : printContextBudgetSnapshot(snapshot),
    stderr: "",
  };
}

function parseArgs(args: string[]): ParsedArgs {
  let json = false;
  let snapshot = false;
  let guard: string | undefined;
  let session: string | undefined;
  let sessionDir: string | undefined;
  let contextWindow: number | undefined;
  let maxUsedPercent = 60;
  let out: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--help" || arg === "-h") return { kind: "help" };
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (arg === "--snapshot") {
      snapshot = true;
      continue;
    }
    const valueArg = () => {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) return undefined;
      index += 1;
      return value;
    };
    if (arg === "--guard") {
      guard = valueArg();
      if (!guard) return { kind: "error", message: "Missing value for --guard" };
      continue;
    }
    if (arg === "--session") {
      session = valueArg();
      if (!session) return { kind: "error", message: "Missing value for --session" };
      continue;
    }
    if (arg === "--session-dir") {
      sessionDir = valueArg();
      if (!sessionDir) return { kind: "error", message: "Missing value for --session-dir" };
      continue;
    }
    if (arg === "--context-window") {
      const value = parseTokenCount(valueArg());
      if (!value || value <= 0) return { kind: "error", message: "Invalid --context-window" };
      contextWindow = value;
      continue;
    }
    if (arg === "--max-used-percent") {
      const value = Number(valueArg());
      if (!Number.isFinite(value) || value < 0 || value > 100) return { kind: "error", message: "Invalid --max-used-percent" };
      maxUsedPercent = value;
      continue;
    }
    if (arg === "--out") {
      out = valueArg();
      if (!out) return { kind: "error", message: "Missing value for --out" };
      continue;
    }
    return { kind: "error", message: `Unknown option: ${arg}` };
  }

  return { kind: "run", json, snapshot, guard, session, sessionDir, contextWindow, maxUsedPercent, out };
}

function readActiveSession(context: StackOpsContext): ActiveSessionRecord | undefined {
  const path = activeSessionPath(context);
  if (!existsSync(path)) return undefined;
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as Partial<ActiveSessionRecord>;
    if (parsed.schemaVersion !== 1) return undefined;
    return parsed as ActiveSessionRecord;
  } catch {
    return undefined;
  }
}

function resolveSessionFile(
  session: string | undefined,
  sessionDir: string | undefined,
  activeSession: ActiveSessionRecord | undefined,
  cwd: string,
): { kind: "ok"; path: string } | { kind: "error"; message: string } {
  const target = session ?? activeSession?.sessionFile ?? activeSession?.sessionId;
  if (!target) return { kind: "error", message: "No recorded session; run inside Pi or pass --session" };
  const expanded = expandHome(target);
  if (existsSync(expanded)) return { kind: "ok", path: resolve(expanded) };

  const root = sessionDir ? expandHome(sessionDir) : defaultSessionDir();
  const matches = findSessionFiles(root).filter((file) => {
    const header = readSessionHeader(file);
    return header?.id?.startsWith(target) || file.includes(target);
  });
  if (matches.length === 1) return { kind: "ok", path: matches[0] };
  if (matches.length > 1) return { kind: "error", message: `Multiple sessions match ${target}; pass a full session path` };
  return { kind: "error", message: `No session found for ${target} under ${root} from ${cwd}` };
}

function readSession(file: string): { kind: "ok"; header: SessionHeader; usage: { tokens: number | null; model?: string } } | { kind: "error"; message: string } {
  try {
    const lines = readFileSync(file, "utf8").trim().split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) return { kind: "error", message: `${file} is empty` };
    const header = JSON.parse(lines[0]) as SessionHeader;
    if (header.type !== "session") return { kind: "error", message: `${file} is not a Pi session file` };
    let tokens: number | null = null;
    let model: string | undefined;
    let usageAfterLatestCompaction = false;
    for (const line of lines.slice(1)) {
      const entry = JSON.parse(line) as SessionEntry;
      if (entry.type === "compaction") usageAfterLatestCompaction = false;
      const usage = entry.message?.usage;
      const total = typeof usage?.totalTokens === "number"
        ? usage.totalTokens
        : typeof usage?.input === "number" && typeof usage?.output === "number"
          ? usage.input + usage.output
          : undefined;
      if (total !== undefined) {
        tokens = total;
        usageAfterLatestCompaction = true;
      }
      model = entry.message?.model ?? entry.modelId ?? model;
    }
    return { kind: "ok", header, usage: { tokens: usageAfterLatestCompaction ? tokens : null, model } };
  } catch (error) {
    return { kind: "error", message: `Could not read session ${file}: ${error instanceof Error ? error.message : String(error)}` };
  }
}

function readSessionHeader(file: string): SessionHeader | undefined {
  try {
    const [line] = readFileSync(file, "utf8").split(/\r?\n/, 1);
    const header = JSON.parse(line) as SessionHeader;
    return header.type === "session" ? header : undefined;
  } catch {
    return undefined;
  }
}

export function evaluateContextBudget(input: {
  guard?: string;
  sessionFile?: string;
  sessionId?: string;
  sessionCwd?: string;
  model?: string;
  contextWindow: number | null;
  tokens: number | null;
  maxUsedPercent: number;
}): ContextBudgetSnapshot {
  const issues: string[] = [];
  const percent = input.tokens !== null && input.contextWindow !== null ? (input.tokens / input.contextWindow) * 100 : null;
  const remainingTokens = input.tokens !== null && input.contextWindow !== null ? input.contextWindow - input.tokens : null;
  let verdict: ContextBudgetVerdict = "continue";
  let reason = "context_budget_allows_continuation";
  let nextAction = input.guard ? `continue_${input.guard}` : "record_context_budget_snapshot";

  if (input.contextWindow === null) {
    verdict = input.guard ? "unknown" : "continue";
    reason = input.guard ? "unknown_context_window" : "context_budget_snapshot_recorded_with_unknown_context_window";
    nextAction = input.guard ? "stop_before_next_workflow_unit_and_emit_handoff" : nextAction;
    issues.push("context window is unknown; pass --context-window or run through the stack-ops Pi extension");
  } else if (input.tokens === null) {
    verdict = input.guard ? "unknown" : "continue";
    reason = input.guard ? "unknown_context_usage" : "context_budget_snapshot_recorded_with_unknown_context_usage";
    nextAction = input.guard ? "stop_before_next_workflow_unit_and_emit_handoff" : nextAction;
    issues.push("context usage is unknown for the recorded session");
  } else if (input.guard && percent !== null && percent >= input.maxUsedPercent) {
    verdict = "stop";
    reason = "context_used_percent_exceeds_guard";
    nextAction = "stop_before_next_workflow_unit_and_emit_handoff";
  }

  return {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    command: "context-budget",
    verdict,
    reason,
    nextAction,
    guard: input.guard,
    session: {
      id: input.sessionId,
      file: input.sessionFile,
      cwd: input.sessionCwd,
      model: input.model,
      contextWindow: input.contextWindow,
    },
    usage: { tokens: input.tokens, percent, remainingTokens },
    budget: { maxUsedPercent: input.maxUsedPercent },
    issues,
  };
}

function resolveOutPath(out: string, context: StackOpsContext): { kind: "ok"; path: string } | { kind: "error"; message: string } {
  const resolved = resolve(context.cwd, out);
  const allowedRoot = resolve(context.root, "context-budget");
  if (resolved !== allowedRoot && !resolved.startsWith(`${allowedRoot}/`)) {
    return { kind: "error", message: `context-budget --out must be under .pi/stack-ops/context-budget/: ${out}` };
  }
  return { kind: "ok", path: resolved };
}

function findSessionFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const files: string[] = [];
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const path = join(dir, entry);
      const stat = statSync(path);
      if (stat.isDirectory()) visit(path);
      else if (entry.endsWith(".jsonl")) files.push(path);
    }
  };
  visit(root);
  return files;
}

function defaultSessionDir() {
  return process.env.PI_CODING_AGENT_SESSION_DIR ?? join(process.env.HOME ?? "", ".pi", "agent", "sessions");
}

function expandHome(value: string) {
  if (value === "~") return process.env.HOME ?? value;
  if (value.startsWith("~/")) return join(process.env.HOME ?? "", value.slice(2));
  return isAbsolute(value) ? value : value;
}

function parseTokenCount(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.trim().match(/^(\d+(?:\.\d+)?)([kKmM])?$/);
  if (!match) return undefined;
  const base = Number(match[1]);
  const suffix = match[2]?.toLowerCase();
  return Math.round(base * (suffix === "m" ? 1_000_000 : suffix === "k" ? 1_000 : 1));
}

export function printContextBudgetSnapshot(snapshot: ContextBudgetSnapshot): string {
  return [
    `session: ${snapshot.session.id ?? "unknown"}`,
    `file: ${snapshot.session.file ?? "unknown"}`,
    `context: ${formatNumber(snapshot.usage.tokens)} / ${formatNumber(snapshot.session.contextWindow)} tokens (${formatPercent(snapshot.usage.percent)})`,
    `remaining: ${formatNumber(snapshot.usage.remainingTokens)} tokens`,
    `guard: ${snapshot.guard ?? "none"}`,
    `max used: ${snapshot.budget.maxUsedPercent}%`,
    `verdict: ${snapshot.verdict}`,
    `reason: ${snapshot.reason}`,
    `next action: ${snapshot.nextAction}`,
    ...snapshot.issues.map((issue) => `issue: ${issue}`),
  ].join("\n") + "\n";
}

function formatNumber(value: number | null) {
  return value === null ? "unknown" : String(Math.round(value));
}

function formatPercent(value: number | null) {
  return value === null ? "unknown" : `${value.toFixed(1)}%`;
}
