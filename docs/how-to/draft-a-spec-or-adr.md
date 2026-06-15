# Draft a spec or ADR

## When to use this

Use this when the change needs durable review before code.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```text
/draft admin-audit-logging: record admin changes in an audit log
```

Then inspect the durable artifact:

```bash
git diff -- docs/specs/admin-audit-logging.md
stack-ops status
```

## Expected result

A spec or ADR is ready on the spec branch, no implementation code changed, `.pi/stack-ops/summaries/` has a handoff, and status points to `/discuss <spec-or-adr-path>`.

## Troubleshooting

- Stop if the prompt starts editing implementation code.
- Stop if acceptance criteria, non-goals, or human decision points are missing.
- If the artifact belongs somewhere else in your repository, move it before `/discuss` and keep the path stable.

## Next steps

[Generate a plan](generate-a-plan.md) after `/discuss` approval.
