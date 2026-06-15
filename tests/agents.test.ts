import { describe, expect, test } from "bun:test";
import { validateAgentNaming } from "../src/core/agents.js";

describe("agent naming compliance", () => {
  test("uses namespaced kebab-case runtime names", () => {
    expect(validateAgentNaming(process.cwd())).toEqual([]);
  });
});
