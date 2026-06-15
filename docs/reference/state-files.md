# State files

The CLI writes local runtime state under `.pi/stack-ops/`. Treat it as disposable and gitignored.

## Files

| Path | Purpose | Safe to delete? |
| --- | --- | --- |
| `.pi/stack-ops/state.json` | Current workflow phase, stack, slice, branch, plan, gates, blockers, next prompts. | Only if you are ready to reset state; `stack-ops init` recreates default state. |
| `.pi/stack-ops/session.json` | Active session id/path/model/context window for context-budget. | Yes, but automatic session lookup may stop working. |

## Artifact directories

| Directory | Purpose | Safe to delete? |
| --- | --- | --- |
| `plans/` | Local implementation plans from `/plan`. | Only after the stack is done or plan is regenerated. |
| `summaries/` | Session summaries and handoffs. | After important context is captured elsewhere. |
| `validation/` | Local validation evidence. | After PR bodies or review comments contain needed evidence. |
| `snapshots/` | Runtime snapshots. | Usually yes. |
| `blockers/` | Blocker notes and triage artifacts. | Only after blockers are resolved or captured. |
| `pr-bodies/` | Draft PR descriptions. | After PRs are updated. |
| `logs/` | Logs. | Yes; `stack-ops clean` deletes this. |
| `context-budget/` | Context-budget JSON snapshots and guards. | Yes after handoff evidence is no longer needed. |

## Cleanup commands

```bash
stack-ops clean          # logs only
stack-ops clean --all    # all artifacts, interactive confirmation
stack-ops clean --all --yes  # all artifacts for automation
```

Do not run `clean --all` during an active stack unless you have the plan path, current branch, blockers, and validation evidence captured elsewhere.

Next: [Resume work](../how-to/resume-work.md).
