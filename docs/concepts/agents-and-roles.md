# Agents and roles

`pi-stack-ops` includes focused Pi agents for planning, implementation, review,
validation, security, readiness, and stack operations. You do not need to call
these agents directly during normal use.

## Why roles matter

Long workflows fail when one conversation tries to carry every decision, file,
and validation result. Focused roles keep the context smaller and the task
boundaries clearer.

## Packaged roles

The package includes these role types.

| Role | Purpose |
| --- | --- |
| `stack-ops.spec-writer` | Drafts and refines specs or ADRs. |
| `stack-ops.planner` | Creates local implementation plans. |
| `stack-ops.slice-builder` | Implements one approved slice. |
| `stack-ops.reviewer` | Reviews specs, plans, diffs, and slices. |
| `stack-ops.security-reviewer` | Checks security, privacy, secrets, and dependency risk. |
| `stack-ops.validator` | Runs focused validation and summarizes evidence. |
| `stack-ops.readiness` | Decides whether a phase, PR, slice, or stack can advance. |
| `stack-ops.stack-operator` | Handles stax and GitHub mechanics after readiness. |

## Next steps

Read [Reference: agents](../reference/agents.md) for a lookup table of packaged
agents.
