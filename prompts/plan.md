---
description: Create a gitignored, code-bound stax implementation plan
argument-hint: "<approved-spec-path>"
---
Use stack-ops to create a code-bound implementation plan for stacked slice PRs.

Input:
$ARGUMENTS

Rules:
- The source spec/ADR must be durable and checked in or ready in the spec PR.
- The generated plan must live under `.pi/stack-ops/plans/` or the configured gitignored artifact directory.
- The plan must not be checked into version control.
- Use `stack-ops.planner`.
- The plan must include exact files, slice branches, parent branches, validation commands, review focus, and stop conditions.
- Use Semble first when available; use code-review-graph for impact-sensitive changes.
- Update stack-ops state with the active plan path.
- End with the compact stack-ops summary and exact next prompt suggestions. Start continuation handoffs with `/new` before the suggested workflow prompt.

Expected next prompts:
1. `/new`
2. `/implement .pi/stack-ops/plans/<plan>.md`
