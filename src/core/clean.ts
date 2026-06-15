import { isAbsolute, join, resolve } from "node:path";
import type { StackOpsContext } from "./state.js";

export function assertSafeDeleteTarget(target: string, context: StackOpsContext) {
  const resolved = resolve(target);
  if (!isAbsolute(resolved) || (resolved !== context.root && !resolved.startsWith(`${context.root}/`))) {
    throw new Error(`Refusing to clean outside stack-ops artifact directory: ${resolved}`);
  }
  return resolved;
}

export function cleanTarget(all: boolean, context: StackOpsContext) {
  return assertSafeDeleteTarget(all ? context.root : join(context.root, "logs"), context);
}
