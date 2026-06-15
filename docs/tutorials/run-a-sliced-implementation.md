# Run a sliced implementation

This tutorial shows how to use a generated plan to implement one reviewable slice
at a time.

## Open the plan

Find the plan under `.pi/stack-ops/plans/` and read the first slice before you
run implementation.

## Implement the first slice

Run the implementation prompt with the plan path.

```text
/implement .pi/stack-ops/plans/admin-audit-logging.plan.md
```

## Review the handoff

At the end of the slice, read the summary. Check the files changed, validation
evidence, blockers, and next prompt.

## Continue or stop

Continue only when the slice is reviewable and no blocker requires a spec update.
If a blocker appears, return to `/discuss` before implementation continues.

## Next steps

When all slices are complete, follow
[Review and merge a stack](review-and-merge-a-stack.md).
