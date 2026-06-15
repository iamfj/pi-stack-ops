# Resume work

## When to use this

Use this when a Pi session ended, you changed machines, or you are unsure what is active.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```bash
stack-ops status
ls .pi/stack-ops/summaries
ls .pi/stack-ops/plans
ls .pi/stack-ops/blockers
git status --short
```

## Expected result

You know the active phase, stack, slice, branch, plan path, blockers, and exact next prompt. The newest summary should match the current Git branch and status.

## Troubleshooting

- If `state.json` cannot parse, status enters `blocked`; recover from the latest summary and rewrite state by rerunning the appropriate prompt.
- If branch and state disagree, stop and decide whether to switch branches or update state through the workflow.
- If blockers exist, do not continue implementation until they are classified.

## Next steps

[Handle blockers](handle-blockers.md) or the prompt shown by `stack-ops status`.
