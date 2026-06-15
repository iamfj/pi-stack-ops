# Validate a stack

## When to use this

Use this before asking for review, after feedback fixes, and before merge readiness.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```bash
bun run check
bun run test
stax status
gh pr status
stack-ops status
```

Record important outputs in the PR body or `.pi/stack-ops/validation/`.

## Expected result

Each PR has current validation evidence, stack order is known, blockers are empty or explicit, and reviewers can see what changed and what remains risky.

## Troubleshooting

- If `stax status` shows restack work, restack before readiness.
- If tests are skipped, say why in the PR body.
- If context-budget says `stop` or `unknown`, stop before the next workflow unit.

## Next steps

[Prepare PRs](prepare-prs.md) or `/iterate` in [Commands](../reference/commands.md).
