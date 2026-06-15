---
description: Start a stax-first spec/ADR PR for a new change
argument-hint: "<idea-or-source>"
---
Use stack-ops to draft the first PR of a stax stack: a spec/ADR-only PR.

Input:
$ARGUMENTS

Rules:
- Treat this as stax-first work. The first PR is for durable spec/ADR artifacts only.
- Do not implement code in this phase.
- Use `stack-ops.architect` for context mapping when needed.
- Use `stack-ops.spec-writer` to draft or refine durable artifacts.
- Update stack-ops state under `.pi/stack-ops/`.
- End with the compact stack-ops summary and exact next prompt suggestions. Start continuation handoffs with `/new` before the suggested workflow prompt.

Expected next prompts usually:
1. `/new`
2. `/discuss <spec-path>`
