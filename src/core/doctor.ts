import { accessSync, constants, existsSync } from "node:fs";
import { delimiter, join } from "node:path";
import type { StackOpsContext } from "./state.js";
import { ensureDirs } from "./state.js";

export type DoctorCheck = { name: string; ok: boolean; required: boolean };

export function doctorPassed(checks: DoctorCheck[]) {
  return checks.every((check) => check.ok || !check.required);
}

export function commandExists(command: string, path = process.env.PATH ?? "") {
  if (!/^[A-Za-z0-9._-]+$/.test(command)) return false;
  for (const segment of path.split(delimiter)) {
    if (!segment) continue;
    const candidate = join(segment, command);
    try {
      accessSync(candidate, constants.X_OK);
      return true;
    } catch {
      // Continue scanning PATH.
    }
  }
  return false;
}

export function getDoctorChecks(context: StackOpsContext, path = process.env.PATH ?? ""): DoctorCheck[] {
  ensureDirs(context);
  return [
    { name: "artifact directory", ok: existsSync(context.root), required: true },
    { name: "state file", ok: existsSync(context.stateFile), required: true },
    { name: "stax", ok: commandExists("stax", path), required: true },
    { name: "gh", ok: commandExists("gh", path), required: true },
    { name: "git", ok: commandExists("git", path), required: true },
    { name: "semble", ok: commandExists("semble", path), required: false },
  ];
}
