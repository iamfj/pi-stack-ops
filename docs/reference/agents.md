# Agents

The package ships namespaced Pi agents for common Stack Ops roles. Normal users
usually interact with prompts rather than calling these agents directly.

## Packaged agents

| Agent | Purpose |
| --- | --- |
| `stack-ops.architect` | Reviews architecture direction and tradeoffs. |
| `stack-ops.spec-writer` | Drafts and edits specs or ADRs. |
| `stack-ops.planner` | Creates implementation plans. |
| `stack-ops.slice-builder` | Implements one approved slice. |
| `stack-ops.reviewer` | Reviews specs, plans, and diffs. |
| `stack-ops.security-reviewer` | Reviews security, privacy, auth, and dependency risk. |
| `stack-ops.validator` | Runs validation and summarizes evidence. |
| `stack-ops.workflow-reviewer` | Audits workflow and artifact hygiene; reports only. |
| `stack-ops.readiness` | Returns the READY/BLOCKED gate decision. |
| `stack-ops.blocker-resolver` | Applies only explicitly accepted blocker fixes for the active slice. |
| `stack-ops.stack-operator` | Handles stack and PR mechanics after readiness and explicit approval. |
| `stack-ops.state-keeper` | Performs optional state-only maintenance. |

## Next steps

Read [Agents and roles](../concepts/agents-and-roles.md) for the conceptual
model.
