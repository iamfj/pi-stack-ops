# CI integration

Use CI as evidence for each slice. Stack Ops does not replace your project's CI;
it helps you capture which checks ran, which checks failed, and what reviewers
need to know before the stack moves forward.

## What to run in CI

Use the checks your project already trusts. Common examples include:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

or, for Bun projects:

```bash
bun run test
bun run check
bun run build
```

The important part is not the package manager. The important part is that every
slice has a clear validation story.

## Put validation in the plan

When you review the generated plan, check that each slice has specific validation
commands.

| Slice | Weak validation | Better validation |
| --- | --- | --- |
| Data model | "run tests" | `npm test -- audit-event-model` plus migration check. |
| CLI change | "manual check" | `npm run test -- stack-ops-cli` and one copied command output. |
| Docs change | "review docs" | docs build command plus rendered preview review, if your project has one. |

If the plan only says "manual review," stop and ask Stack Ops to name the actual
checks or explain why automation is not available.

## Use CI results during Stack Ops phases

CI usually matters in three places.

1. During `/implement`, record focused checks for the current slice.
2. During `/finish`, summarize validation in the generated PR bodies.
3. During `/iterate`, use CI failures as input for the next fix pass.

Example iterate prompt:

```text
/iterate .pi/stack-ops/plans/admin-audit-logging.md fix the failing audit-event-model test on PR 2
```

## What to include in PR evidence

For each slice PR, include:

- exact commands run;
- pass or fail result;
- CI job names that matter for the slice;
- skipped checks and the reason;
- unresolved blockers from `.pi/stack-ops/blockers/`.

Do not paste full logs into the PR body. Include the command, result, and a link
to CI when the log is long.

Next: [Validate a stack](../how-to/validate-a-stack.md).
