import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const artifactDirs = ["plans", "summaries", "validation", "snapshots", "blockers", "pr-bodies", "logs", "context-budget"] as const;

const maxStateBytes = 256 * 1024;
const maxStringLength = 240;
const maxArrayItems = 20;
const stateSchema = "https://raw.githubusercontent.com/iamfj/pi-stack-ops/main/schemas/stack-ops-state.schema.json";

export type Phase = "idle" | "draft" | "discuss" | "plan" | "implement" | "finish" | "iterate" | "blocked";

export type StackOpsState = {
  "$schema"?: string;
  version: 1;
  phase: Phase;
  stack?: string;
  slice?: string;
  branch?: string;
  plan?: string;
  gates?: string;
  blockers: Array<{ id: string; summary: string; severity?: "info" | "warning" | "blocking" }>;
  next: string[];
  updatedAt: string;
};

export type StackOpsContext = {
  cwd: string;
  root: string;
  stateFile: string;
};

export function createContext(cwd = process.cwd()): StackOpsContext {
  const root = resolve(cwd, ".pi", "stack-ops");
  return { cwd, root, stateFile: join(root, "state.json") };
}

export function ensureDirs(context = createContext()) {
  mkdirSync(context.root, { recursive: true });
  for (const dir of artifactDirs) mkdirSync(join(context.root, dir), { recursive: true });
}

export function defaultState(): StackOpsState {
  return {
    "$schema": stateSchema,
    version: 1,
    phase: "idle",
    blockers: [],
    next: ["/draft <idea-or-source>"],
    updatedAt: new Date().toISOString(),
  };
}

function sanitize(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.replace(/[\u0000-\u001f\u007f-\u009f]/g, "").slice(0, maxStringLength);
}

function optionalString(value: unknown) {
  const sanitized = sanitize(value, "");
  return sanitized.length > 0 ? sanitized : undefined;
}

export function sanitizeState(inputState: unknown): StackOpsState {
  const state = inputState && typeof inputState === "object" ? inputState as Record<string, unknown> : {};
  const fallback = defaultState();
  const phases = new Set<Phase>(["idle", "draft", "discuss", "plan", "implement", "finish", "iterate", "blocked"]);
  const rawBlockers = Array.isArray(state.blockers) ? state.blockers.slice(0, maxArrayItems) : [];
  const rawNext = Array.isArray(state.next) ? state.next.slice(0, maxArrayItems) : [];

  return {
    "$schema": typeof state.$schema === "string" ? sanitize(state.$schema, fallback.$schema) : fallback.$schema,
    version: 1,
    phase: typeof state.phase === "string" && phases.has(state.phase as Phase) ? state.phase as Phase : fallback.phase,
    stack: optionalString(state.stack),
    slice: optionalString(state.slice),
    branch: optionalString(state.branch),
    plan: optionalString(state.plan),
    gates: optionalString(state.gates),
    blockers: rawBlockers.map((rawBlocker, index) => {
      const blocker = rawBlocker && typeof rawBlocker === "object" ? rawBlocker as Record<string, unknown> : {};
      return {
        id: sanitize(blocker.id, `B${index + 1}`),
        summary: sanitize(blocker.summary, "Malformed blocker"),
        severity: blocker.severity === "info" || blocker.severity === "warning" || blocker.severity === "blocking" ? blocker.severity : undefined,
      };
    }),
    next: rawNext.map((next) => sanitize(next)).filter(Boolean),
    updatedAt: sanitize(state.updatedAt, fallback.updatedAt),
  };
}

export function readState(context = createContext()): StackOpsState {
  if (!existsSync(context.stateFile)) return defaultState();
  try {
    const raw = readFileSync(context.stateFile, "utf8");
    if (Buffer.byteLength(raw, "utf8") > maxStateBytes) {
      return { ...defaultState(), phase: "blocked", blockers: [{ id: "state", summary: "state.json exceeds the 256 KiB safety limit" }] };
    }
    return sanitizeState(JSON.parse(raw));
  } catch {
    return { ...defaultState(), phase: "blocked", blockers: [{ id: "state", summary: "Could not parse state.json" }] };
  }
}

export function writeState(state: unknown, context = createContext()) {
  ensureDirs(context);
  writeFileSync(context.stateFile, `${JSON.stringify({ ...sanitizeState(state), updatedAt: new Date().toISOString() }, null, 2)}\n`, { mode: 0o600 });
}

export function renderState(state: StackOpsState) {
  const blockers = state.blockers.length === 0
    ? "none"
    : state.blockers.map((blocker) => `- ${blocker.id}: ${blocker.summary}`).join("\n");
  const next = state.next.length === 0 ? "- none" : state.next.map((prompt) => `- ${prompt}`).join("\n");
  return `stack-ops status\n\nPhase: ${state.phase}\nStack: ${state.stack ?? "none"}\nSlice: ${state.slice ?? "none"}\nBranch: ${state.branch ?? "unknown"}\nPlan: ${state.plan ?? "none"}\nGates: ${state.gates ?? "unknown"}\nUpdated: ${state.updatedAt}\n\nBlockers:\n${blockers}\n\nNext:\n${next}\n`;
}
