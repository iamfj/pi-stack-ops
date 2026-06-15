# Generate a plan

## When to use this

Use this after the spec or ADR is approved. Plans are local and gitignored.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```text
/plan docs/specs/admin-audit-logging.md
```

Inspect the result:

```bash
ls .pi/stack-ops/plans
sed -n '1,220p' .pi/stack-ops/plans/admin-audit-logging.md
stack-ops status
```

## Expected result

The plan lives under `.pi/stack-ops/plans/`, status records the plan path, and each slice has branch names, parent branches, files, validation commands, review focus, and stop conditions.

## Troubleshooting

- Do not continue if a slice mixes unrelated concerns.
- Do not commit the plan.
- Regenerate or refine if validation commands or stop conditions are missing.

## Next steps

[Implement a slice](implement-a-slice.md).
