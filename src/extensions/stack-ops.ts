import type { ExtensionAPI, ExtensionCommandContext, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cleanTarget } from "../core/clean.js";
import { evaluateContextBudget, printContextBudgetSnapshot, writeActiveSession } from "../core/context-budget.js";
import { getDoctorChecks } from "../core/doctor.js";
import { createContext, defaultState, ensureDirs, readState, renderState, writeState } from "../core/state.js";

const statusKeys = {
  phase: "stack-ops-phase",
  stack: "stack-ops-stack",
  slice: "stack-ops-slice",
  gates: "stack-ops-gates",
  blockers: "stack-ops-blockers",
  next: "stack-ops-next",
};

function stackOpsContext(ctx: ExtensionContext) {
  return createContext(ctx.cwd);
}

function parseCommandOption(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  return value && !value.startsWith("--") ? value : undefined;
}

function publishStatus(ctx: ExtensionContext): void {
  const state = readState(stackOpsContext(ctx));
  ctx.ui.setStatus(statusKeys.phase, state.phase);
  ctx.ui.setStatus(statusKeys.stack, state.stack ?? "none");
  ctx.ui.setStatus(statusKeys.slice, state.slice ?? "none");
  ctx.ui.setStatus(statusKeys.gates, state.gates ?? "unknown");
  ctx.ui.setStatus(statusKeys.blockers, String(state.blockers.length));
  ctx.ui.setStatus(statusKeys.next, state.next[0] ?? "none");
}

function recordActiveSession(ctx: ExtensionContext): void {
  const usage = ctx.getContextUsage();
  writeActiveSession({
    sessionId: ctx.sessionManager.getSessionId(),
    sessionFile: ctx.sessionManager.getSessionFile(),
    contextWindow: usage?.contextWindow,
    model: ctx.model?.id,
  }, stackOpsContext(ctx));
}

function renderContextBudget(ctx: ExtensionContext, args: string[]): string {
  recordActiveSession(ctx);

  const usage = ctx.getContextUsage();
  const maxUsedPercent = Number(parseCommandOption(args, "--max-used-percent") ?? "60");
  if (!Number.isFinite(maxUsedPercent) || maxUsedPercent < 0 || maxUsedPercent > 100) return "Invalid --max-used-percent";

  const guard = parseCommandOption(args, "--guard");
  const snapshot = evaluateContextBudget({
    guard,
    sessionId: ctx.sessionManager.getSessionId(),
    sessionFile: ctx.sessionManager.getSessionFile(),
    sessionCwd: ctx.cwd,
    model: ctx.model?.id,
    contextWindow: usage?.contextWindow ?? null,
    tokens: usage?.tokens ?? null,
    maxUsedPercent,
  });

  const out = parseCommandOption(args, "--out");
  if (out) {
    const context = stackOpsContext(ctx);
    const resolved = resolve(ctx.cwd, out);
    const allowedRoot = resolve(context.root, "context-budget");
    if (resolved !== allowedRoot && !resolved.startsWith(`${allowedRoot}/`)) {
      return `context-budget --out must be under .pi/stack-ops/context-budget/: ${out}`;
    }
    mkdirSync(dirname(resolved), { recursive: true });
    writeFileSync(resolved, `${JSON.stringify(snapshot, null, 2)}\n`, { mode: 0o600 });
  }

  return args.includes("--json") ? JSON.stringify(snapshot, null, 2) : printContextBudgetSnapshot(snapshot);
}

async function command(args: string, ctx: ExtensionCommandContext): Promise<void> {
  const [action = "status", ...rest] = args.trim().split(/\s+/).filter(Boolean);
  const context = stackOpsContext(ctx);

  if (action === "init") {
    ensureDirs(context);
    writeState(readState(context), context);
    publishStatus(ctx);
    ctx.ui.notify(`Initialized stack-ops at ${context.root}`, "info");
    return;
  }

  if (action === "status") {
    ensureDirs(context);
    const state = readState(context);
    publishStatus(ctx);
    ctx.ui.notify(renderState(state), state.blockers.length > 0 ? "warning" : "info");
    return;
  }

  if (action === "context-budget") {
    ensureDirs(context);
    ctx.ui.notify(renderContextBudget(ctx, rest), "info");
    return;
  }

  if (action === "doctor") {
    const checks = getDoctorChecks(context);
    const text = checks.map(([name, ok]) => `${ok ? "✓" : "⚠"} ${name}`).join("\n");
    ctx.ui.notify(`stack-ops doctor\n\n${text}`, checks.every(([, ok]) => ok) ? "info" : "warning");
    return;
  }

  if (action === "clean") {
    ensureDirs(context);
    const all = rest.includes("--all");
    const target = cleanTarget(all, context);
    if (all && !rest.includes("--yes")) {
      const ok = await ctx.ui.confirm("Clean stack-ops artifacts?", "This removes .pi/stack-ops entirely, including active state. Continue?");
      if (!ok) return;
    }
    rmSync(target, { recursive: true, force: true });
    ensureDirs(context);
    if (all) writeState(defaultState(), context);
    publishStatus(ctx);
    ctx.ui.notify(`Cleaned ${target}`, "info");
    return;
  }

  ctx.ui.notify("Unknown stack-ops action: " + action + "\n\nUsage: /stack-ops init|doctor|status|context-budget|clean [--all] [--yes]", "warning");
}

export default function stackOps(pi: ExtensionAPI) {
  pi.on("session_start", async (_event, ctx) => {
    ensureDirs(stackOpsContext(ctx));
    recordActiveSession(ctx);
    publishStatus(ctx);
  });

  pi.registerCommand("stack-ops", {
    description: "Stax-first stack workflow status, context budget, doctor, init, and cleanup",
    handler: command,
  });
}
