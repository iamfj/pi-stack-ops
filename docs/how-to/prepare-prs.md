# Prepare PRs

## When to use this

Use this after approved slices are implemented and validated.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```text
/finish .pi/stack-ops/plans/admin-audit-logging.md
```

Inspect drafts:

```bash
ls .pi/stack-ops/pr-bodies
stack-ops status
```

## Expected result

PR bodies exist under `.pi/stack-ops/pr-bodies/`, PRs are processed bottom-up, readiness checks are current, and no dependent PR is marked ready before its parent.

## Troubleshooting

- Stop if lower PRs are blocked.
- Stop if validation evidence is stale.
- Do not merge from `/finish`; use `/merge` only after explicit approval.

## Next steps

[Validate a stack](validate-a-stack.md) and then [Commands](../reference/commands.md).
