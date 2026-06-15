import { accessSync, constants, existsSync } from "node:fs";
import { delimiter, join } from "node:path";
import type { StackOpsContext } from "./state.js";
import { ensureDirs } from "./state.js";

export type DoctorCheck = [name: string, ok: boolean];

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
    ["artifact directory", existsSync(context.root)],
    ["state file", existsSync(context.stateFile)],
    ["stax", commandExists("stax", path)],
    ["gh", commandExists("gh", path)],
    ["git", commandExists("git", path)],
    ["semble", commandExists("semble", path)],
  ];
}
