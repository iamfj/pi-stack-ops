import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

export type AgentNamingIssue = {
  file: string;
  message: string;
};

const agentNamePattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const packageName = "stack-ops";

function parseFrontmatter(content: string): Record<string, string> | null {
  if (!content.startsWith("---\n")) return null;
  const end = content.indexOf("\n---", 4);
  if (end === -1) return null;

  const fields: Record<string, string> = {};
  for (const line of content.slice(4, end).split("\n")) {
    const match = /^(\w+):\s*(.*)$/.exec(line);
    if (match) fields[match[1]] = match[2].trim();
  }
  return fields;
}

export function validateAgentNaming(root: string): AgentNamingIssue[] {
  const agentsDir = join(root, "agents");
  const issues: AgentNamingIssue[] = [];
  const seen = new Set<string>();

  for (const entry of readdirSync(agentsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

    const file = join("agents", entry.name);
    const stem = basename(entry.name, ".md");
    const frontmatter = parseFrontmatter(readFileSync(join(agentsDir, entry.name), "utf8"));

    if (!frontmatter) {
      issues.push({ file, message: "agent file must start with frontmatter" });
      continue;
    }

    const name = frontmatter.name;
    if (!name) issues.push({ file, message: "agent name is required" });
    else {
      if (!agentNamePattern.test(name)) issues.push({ file, message: "agent name must be lowercase kebab-case" });
      if (name !== stem) issues.push({ file, message: "agent name must match the file basename" });
      if (name.startsWith(`${packageName}-`)) issues.push({ file, message: "agent name must not repeat the package namespace" });
      if (seen.has(name)) issues.push({ file, message: `duplicate agent name: ${name}` });
      seen.add(name);
    }

    if (frontmatter.package !== packageName) {
      issues.push({ file, message: `agent package must be ${packageName}` });
    }
  }

  return issues;
}
