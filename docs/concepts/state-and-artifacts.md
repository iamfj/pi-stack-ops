# State and artifacts

`pi-stack-ops` stores local workflow state under `.pi/stack-ops/`. These files
help you resume work, inspect blockers, and keep validation evidence together.

## Durable artifacts

Durable artifacts belong in the repository.

- Specs.
- ADRs.
- Intentional project documentation.

## Disposable artifacts

Disposable artifacts stay local and are gitignored.

```text
.pi/stack-ops/
  state.json
  plans/
  summaries/
  validation/
  snapshots/
  blockers/
  pr-bodies/
  logs/
  context-budget/
```

These files are useful while the stack is active, but they are not project
history. Plans can become stale after code changes. Validation notes can include
local paths or command output that does not belong in Git. Summaries are written
for handoff, not for long-term documentation.

## Cleanup

Use normal review before deleting workflow state. `stack-ops clean` removes local
logs. `stack-ops clean --all` removes all Stack Ops artifacts after confirmation,
or with `--yes` in automation. Run it only when you no longer need the active
plan, summaries, blockers, or validation evidence.

## Next steps

Use [Resume work](../how-to/resume-work.md) when you need to continue from local
state.
