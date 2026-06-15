# Review and merge a stack

This tutorial covers the final workflow: prepare PRs, handle feedback, check
readiness, and merge only after approval.

## Prepare draft PRs

After all slices are complete and validated, prepare PRs from the bottom of the
stack upward.

```text
/finish .pi/stack-ops/plans/admin-audit-logging.plan.md
```

## Iterate on feedback

Use the iterate phase for CI failures, review comments, and restacking work.

```text
/iterate .pi/stack-ops/plans/admin-audit-logging.plan.md
```

## Check readiness

Use the merge phase when review and validation evidence are complete.

```text
/merge .pi/stack-ops/plans/admin-audit-logging.plan.md
```

The merge phase gathers evidence first. It does not execute a merge without your
approval.

## Next steps

Use [Validate a stack](../how-to/validate-a-stack.md) for a focused validation
checklist.
