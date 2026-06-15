---
description: Refine and approve a stack-ops spec/ADR PR before planning
argument-hint: "<spec-or-adr-path>"
---
Use stack-ops to discuss and refine the durable spec/ADR PR.

Input:
$ARGUMENTS

Rules:
- Keep this phase focused on scope, decisions, acceptance criteria, non-goals, and risks.
- Do not create tracked implementation plans.
- Do not implement code.
- If decisions are durable, capture them in the spec or ADR.
- Update stack-ops state under `.pi/stack-ops/`.
- End with the compact stack-ops summary and exact next prompt suggestions. Start continuation handoffs with `/new` before the suggested workflow prompt.

Expected next prompts after approval:
1. `/new`
2. `/plan <approved-spec-path>`
