# Implement a slice

## When to use this

Use this to build one approved slice from a local plan.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```text
/implement .pi/stack-ops/plans/admin-audit-logging.plan.md implement S1 only
```

Verify locally:

```bash
git diff --stat
bun run check
bun run test
stack-ops status
```

## Expected result

Only the requested slice changed, validation evidence is recorded or summarized under `.pi/stack-ops/validation/`, blockers are explicit, and status suggests the next `/implement`, `/finish`, or blocker-resolution prompt.

## Troubleshooting

- Stop if the work spills into another slice.
- Stop for product, architecture, data, or security decisions not approved in the spec/ADR.
- If context-budget returns `stop` or `unknown`, write a handoff and resume in a fresh session.

## Next steps

[Validate a stack](validate-a-stack.md) or [Prepare PRs](prepare-prs.md).
