# Workflow prompt reference

These are Pi prompts supplied by the package. They update `.pi/stack-ops/` state and should end with a compact summary and exact next prompt suggestions. For long workflows, start the continuation with `/new`, then run the suggested workflow prompt so the next phase starts with a clean context.

| Prompt | Input | Produces | Human decision point | Next prompt |
| --- | --- | --- | --- | --- |
| `/draft` | Idea or source material | Durable spec/ADR draft; summary under `.pi/stack-ops/summaries/` | Approve that this needs a spec/ADR PR and no code is included. | `/new`, then `/discuss <spec-path>` |
| `/discuss` | Spec or ADR path | Refined durable decisions, acceptance criteria, risks, non-goals | Approve scope before planning. | `/new`, then `/plan <approved-spec-path>` |
| `/plan` | Approved spec path | Gitignored plan under `.pi/stack-ops/plans/` | Approve slice boundaries, branches, validation, and stop conditions. | `/new`, then `/implement <plan-path>` |
| `/implement` | Plan path plus optional slice instruction | One approved slice, validation evidence, blockers, summary | Approve any product, architecture, security, or data decision not already in the plan. | `/new`, then `/implement`, blocker resolution, or `/finish` |
| `/finish` | Plan path | Bottom-up PR body drafts under `.pi/stack-ops/pr-bodies/`, readiness evidence | Approve marking PRs ready; do not merge. | `/new`, then `/iterate <plan-path>` |
| `/iterate` | Plan path plus feedback instructions | Accepted fixes, refreshed validation, updated PR bodies | Approve scope changes and merging readiness. | `/new`, then `/merge <plan-path>` when green |
| `/merge` | Plan path | Final guarded merge evidence | Explicit approval before any merge command. | Assisted `stax merge --when-ready` only after approval |

Stop conditions shared by all prompts:

- unresolved product, architecture, security, privacy, or data-retention decisions;
- implementation requested during `/draft` or `/discuss`;
- plan asks to commit `.pi/stack-ops/` artifacts;
- context-budget guard returns `stop` or `unknown`;
- lower PRs are blocked while preparing upper PRs.

Next: use [CLI](cli.md) for standalone command details.
