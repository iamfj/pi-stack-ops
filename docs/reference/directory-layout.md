# Directory layout

A consuming repository needs two kinds of files: durable project artifacts that
belong in Git, and local Stack Ops artifacts that must stay gitignored.

## Durable repository paths

These paths are examples. Use the conventions that fit your project, but keep
specs and ADRs somewhere reviewers can find them.

| Path | Commit? | Purpose |
| --- | --- | --- |
| `docs/specs/<stack>.md` | Yes | Product or implementation spec for the stack. |
| `docs/adrs/<decision>.md` | Yes | Architecture decision record for a durable tradeoff. |
| Application source files | Yes | The implementation changes for each slice. |
| Tests | Yes | Validation that belongs with the slice. |
| User-facing docs | Yes | Documentation changed intentionally by a slice. |

## Local Stack Ops paths

Stack Ops writes workflow state under `.pi/stack-ops/` in the repository where
you run it.

| Path | Commit? | Purpose |
| --- | --- | --- |
| `.pi/stack-ops/state.json` | No | Current phase, stack, slice, plan, blockers, and next prompts. |
| `.pi/stack-ops/session.json` | No | Active Pi session metadata for context-budget. |
| `.pi/stack-ops/plans/` | No | Code-bound implementation plans. |
| `.pi/stack-ops/summaries/` | No | Session handoffs. |
| `.pi/stack-ops/validation/` | No | Command outputs and evidence. |
| `.pi/stack-ops/snapshots/` | No | Stack or repository state snapshots used during workflow checks. |
| `.pi/stack-ops/blockers/` | No | Blocker records that explain why a phase stopped. |
| `.pi/stack-ops/pr-bodies/` | No | Draft PR descriptions. |
| `.pi/stack-ops/logs/` | No | Local command and workflow logs. |
| `.pi/stack-ops/context-budget/` | No | Context usage snapshots and guard output. |

Add these entries to your consuming repository's `.gitignore`:

```gitignore
.pi/stack-ops/
.stack-ops/
```

Next: [State files](state-files.md).
