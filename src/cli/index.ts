import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import cac from "cac";
import { cleanTarget } from "../core/clean.js";
import { runContextBudget } from "../core/context-budget.js";
import { doctorPassed, getDoctorChecks } from "../core/doctor.js";
import { createContext, defaultState, ensureDirs, readState, renderState, writeState } from "../core/state.js";

declare const STACK_OPS_VERSION: string;

const stackOpsVersion = typeof STACK_OPS_VERSION === "string" ? STACK_OPS_VERSION : "0.0.0-dev";

async function confirmCleanAll(root: string, yes: boolean) {
  if (yes) return true;
  if (!input.isTTY) return false;
  const rl = createInterface({ input, output });
  try {
    const answer = await rl.question(`Delete all stack-ops artifacts at ${root}? Type "delete" to continue: `);
    return answer === "delete";
  } finally {
    rl.close();
  }
}

function printStatus(cwd = process.cwd()) {
  const context = createContext(cwd);
  ensureDirs(context);
  process.stdout.write(renderState(readState(context)));
}

function printDoctor(cwd = process.cwd()) {
  const checks = getDoctorChecks(createContext(cwd));
  console.log("stack-ops doctor\n");
  for (const check of checks) console.log(`${check.ok ? "✓" : "⚠"} ${check.name}`);
  process.exitCode = doctorPassed(checks) ? 0 : 1;
}

export async function main(argv = process.argv, cwd = process.cwd()) {
  const cli = cac("stack-ops");

  cli.command("init", "Initialize stack-ops state").action(() => {
    const context = createContext(cwd);
    ensureDirs(context);
    writeState(readState(context), context);
    console.log(`Initialized stack-ops at ${context.root}`);
  });

  cli.command("status", "Show current stack-ops state").action(() => {
    printStatus(cwd);
  });

  cli.command("doctor", "Run stack-ops environment checks").action(() => {
    printDoctor(cwd);
  });

  cli.command("clean", "Clean stack-ops logs or all artifacts")
    .option("--all", "Clean all stack-ops artifacts")
    .option("--yes", "Skip confirmation when used with --all")
    .action(async (options: { all?: boolean; yes?: boolean }) => {
      const context = createContext(cwd);
      const all = Boolean(options.all);
      const target = cleanTarget(all, context);
      if (all && !(await confirmCleanAll(context.root, Boolean(options.yes)))) {
        console.error("Refusing to clean all stack-ops artifacts without confirmation. Use --yes for automation.");
        process.exit(1);
      }
      rmSync(target, { recursive: true, force: true });
      ensureDirs(context);
      if (all) writeState(defaultState(), context);
      console.log(`Cleaned ${target}`);
    });

  cli.help();
  cli.version(stackOpsVersion);

  if (argv.slice(2).length === 0) {
    printStatus(cwd);
    return;
  }

  if (argv[2] === "context-budget") {
    const result = runContextBudget(argv.slice(3), createContext(cwd));
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exitCode = result.exitCode;
    return;
  }

  cli.parse(argv, { run: false });
  await cli.runMatchedCommand();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
