---
description: Finish draft stax PRs bottom-up and prepare them for human review
argument-hint: "<plan-path> [instructions]"
---
Use stack-ops to finish submitted draft PRs bottom-up.

Input:
$ARGUMENTS

Rules:
- Process the stax stack from the spec PR upward through slice PRs.
- Do not mark a PR ready if lower dependencies are blocked.
- Require current validation evidence, internal reviewer disposition, clean PR body, and readiness approval.
- Use `stack-ops.stack-operator` for PR body/stax/GitHub actions.
- Use `stack-ops.readiness` before marking any PR ready for review.
- Before starting another PR or repair loop, run `stack-ops context-budget --guard next-pr --out .pi/stack-ops/context-budget/finish-<pr>.json --json`; continue only on `continue` and stop with a handoff on `stop` or `unknown`.
- Do not merge.
- Update stack-ops state and latest summary.
- End with the compact stack-ops summary and exact next prompt suggestions. Start continuation handoffs with `/new` before the suggested workflow prompt.

Expected next prompts when ready-for-review feedback/CI remains:
1. `/new`
2. `/iterate <plan-path>`
