# Troubleshooting

Start with the smallest command that explains the symptom.

| Symptom | Run | Expected next action |
| --- | --- | --- |
| `doctor` shows `⚠ stax` | `which stax && stax --help` | Install `stax` or fix PATH before stack operations. |
| `doctor` shows `⚠ gh` | `gh auth status` | Install/authenticate GitHub CLI. |
| `doctor` shows `⚠ git` | `git --version` | Install Git or fix PATH. |
| `doctor` shows `⚠ semble` | `which semble` | You can continue simple workflows, but `doctor` still exits non-zero until `semble` is installed. Install it when planning needs repository discovery. |
| Status is `blocked` with state parse error | `cat .pi/stack-ops/state.json` | Recover from latest summary, then rerun the appropriate prompt or `stack-ops init` if resetting. |
| Missing plan | `ls .pi/stack-ops/plans` | Rerun `/plan <approved-spec-path>`; do not invent a plan from memory. |
| Context budget verdict is `unknown` | `stack-ops context-budget --session <path> --context-window 272K --json` | Provide session and context window or stop with a handoff. |
| Context budget verdict is `stop` | Check `.pi/stack-ops/context-budget/` output | Stop before the next workflow unit and start a fresh session. |
| Project CI fails | Open the failing job | Copy the relevant command and failure summary into `/iterate <plan-path> ...`. |
| Docs build fails | Run your project's docs build locally | Fix the docs failure in the slice that changed documentation. |
| Unsure whether cleanup is safe | `stack-ops status && find .pi/stack-ops -maxdepth 2 -type f` | Delete logs only with `stack-ops clean`; avoid `clean --all` during active stacks. |
| CI fails after a slice | Re-run focused command locally | Classify as accepted fix, unrelated failure, or blocker needing human decision. |

When in doubt, preserve `.pi/stack-ops/summaries/`, the active plan, and PR body drafts before cleaning.

Next: [Handle blockers](../how-to/handle-blockers.md).
