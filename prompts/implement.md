---
description: Implement one approved stax slice from a stack-ops plan
argument-hint: "<plan-path> [instructions]"
---
Use stack-ops to implement exactly one approved stax slice from a code-bound plan.

Input:
$ARGUMENTS

Rules:
- Work stax-first on the intended slice branch.
- Implement at most one slice unless explicitly approved.
- Use `stack-ops.slice-builder` as the single writer.
- Run `stack-ops.validator` for focused validation.
- Run fresh-context `stack-ops.reviewer` and, when relevant, `stack-ops.security-reviewer`.
- Use `stack-ops.blocker-resolver` only for accepted blocker fixes.
- Use `stack-ops.readiness` before advancing or submitting/updating PRs.
- Before starting another slice, run `stack-ops context-budget --guard next-slice --out .pi/stack-ops/context-budget/implement-<slice>.json --json`; continue only on `continue` and stop with a handoff on `stop` or `unknown`.
- Use `stack-ops.stack-operator` for stax/GitHub mechanics only after readiness.
- Update stack-ops state, blockers, validation artifacts, and latest summary.
- End with the compact stack-ops summary and exact next prompt suggestions. Start continuation handoffs with `/new` before the suggested workflow prompt.

If blockers remain, suggest:
1. `/new`
2. `/implement <plan-path> only resolve the blockers`

If the slice is clean and more slices remain, suggest:
1. `/new`
2. `/implement <plan-path>`

If all slices are complete, suggest:
1. `/new`
2. `/finish <plan-path>`
