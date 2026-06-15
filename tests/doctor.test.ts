import { describe, expect, test } from "bun:test";
import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { doctorPassed, getDoctorChecks, type DoctorCheck } from "../src/core/doctor.js";
import { createContext } from "../src/core/state.js";

function tempContext() {
  return createContext(mkdtempSync(join(tmpdir(), "stack-ops-test-")));
}

describe("stack-ops doctor", () => {
  test("marks semble optional and required checks required", () => {
    const context = tempContext();
    const checks = getDoctorChecks(context, "");

    expect(checks.find((check) => check.name === "semble")?.required).toBe(false);
    for (const name of ["artifact directory", "state file", "stax", "gh", "git"]) {
      expect(checks.find((check) => check.name === name)?.required).toBe(true);
    }
  });

  test("passes when only optional checks fail", () => {
    const checks: DoctorCheck[] = [
      { name: "artifact directory", ok: true, required: true },
      { name: "state file", ok: true, required: true },
      { name: "stax", ok: true, required: true },
      { name: "gh", ok: true, required: true },
      { name: "git", ok: true, required: true },
      { name: "semble", ok: false, required: false },
    ];

    expect(doctorPassed(checks)).toBe(true);
  });

  test("fails when required checks fail", () => {
    const checks: DoctorCheck[] = [
      { name: "stax", ok: false, required: true },
      { name: "semble", ok: false, required: false },
    ];

    expect(doctorPassed(checks)).toBe(false);
  });

  test("creates artifact root while checking", () => {
    const context = tempContext();

    getDoctorChecks(context, "");

    expect(existsSync(context.root)).toBe(true);
  });
});
