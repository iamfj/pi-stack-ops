---
description: Process human review, CI, and restack feedback for a stax stack
argument-hint: "<plan-path> [instructions]"
---
Use stack-ops to iterate on a ready-for-review stax stack.

Input:
$ARGUMENTS

Rules:
- Work bottom-up through the stax stack.
- Classify CI failures and review feedback before applying changes.
- Apply only accepted fixes.
- Ask the human before scope, product, architecture, or security changes.
- Validate after fixes.
- Refresh stack state with stax.
- Update PR bodies/review threads only after validation evidence is current.
- Do not merge without explicit human approval.
- Before starting another iteration pass, run `stack-ops context-budget --guard next-iteration --out .pi/stack-ops/context-budget/iterate-<n>.json --json`; continue only on `continue` and stop with a handoff on `stop` or `unknown`.
- Update stack-ops state and latest summary.
- End with the compact stack-ops summary and exact next prompt suggestions. Start continuation handoffs with `/new` before the suggested workflow prompt.

If blockers remain, suggest:
1. `/new`
2. `/iterate <plan-path> only resolve blockers`

If green/current/approved, suggest:
1. `/new`
2. `/merge <plan-path>`
