---
name: writing-stack-plans
description: Use when creating implementation plans for stack-ops. Plans must be gitignored, code-bound, and organized as stax slice PRs.
---

# Writing stack-ops plans

Use this skill when planning from an approved spec/ADR.

Inspired by strict implementation planning practices, but adapted for stax-first stacked PR delivery.

## Save location

Save plans under:

```text
.pi/stack-ops/plans/<feature>.plan.md
```

or the configured stack-ops artifact directory.

Plans are **not** checked into version control.

## Required properties

A plan must include:

- source spec/ADR paths;
- current stax root/spec branch;
- exact slice order;
- exact branch names and parent relationships;
- exact files to create, modify, and test;
- validation commands per slice;
- reviewer focus per slice;
- stop conditions per slice;
- no placeholders.

## Plan failures

Never write:

- TBD
- TODO
- implement later
- add appropriate tests
- handle edge cases
- similar to previous task
- vague file areas instead of exact paths
- slices without validation
- slices without stop conditions

## Slice shape

Each slice should be independently reviewable:

```markdown
### S1 — <slice title>

Branch: `<branch>`
Parent: `<parent branch>`
PR type: implementation slice

Files:
- Create: `<path>`
- Modify: `<path>`
- Test: `<path>`

Acceptance:
- <specific outcome>

Validation:
- `<exact command>`

Stop conditions:
- <when to stop and ask/replan>

Reviewer focus:
- <what reviewers should inspect>
```

## Final self-review

Before handing off:

1. Every spec requirement maps to a slice.
2. Every slice has exact files.
3. Every slice has validation.
4. Every slice has stop conditions.
5. Branch parents form a valid stax chain.
6. The plan path is gitignored.

End with the compact stack-ops summary and next prompt.
