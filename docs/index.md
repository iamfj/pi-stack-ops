# pi-stack-ops documentation

`pi-stack-ops` is a Pi package for maintainers who want one change split into a spec/ADR PR plus small implementation PRs. Use it when the work needs durable decisions, reviewable slices, validation evidence, and a clean handoff between Pi sessions.

Use plain one-off edits when the change is tiny and does not need a spec, ADR, or stacked review.

## Choose your path

<div class="grid cards" markdown>

-   **Start in 30 minutes**

    Install the package, initialize local state, check your tools, and draft a spec.

    [:octicons-arrow-right-24: Quickstart](getting-started/quickstart.md)

-   **Walk a full stack**

    Follow a spec-only PR and the first implementation slices for `admin-audit-logging`.

    [:octicons-arrow-right-24: Your first stack](getting-started/first-stack.md)

-   **Look up a command**

    Check standalone CLI commands, workflow prompts, state files, and generated artifacts.

    [:octicons-arrow-right-24: Reference](reference/index.md)

-   **Operate the workflow**

    Wire CI, deploy docs previews, and diagnose blocked state or tooling failures.

    [:octicons-arrow-right-24: Operations](operations/index.md)

</div>

## First 30 minutes

Run these from the repository where you want to use Stack Ops:

```bash
stack-ops doctor
stack-ops init
stack-ops status
```

Expected status shape after `init`:

```text
stack-ops status

Phase: idle
Stack: none
Slice: none
Branch: unknown
Plan: none
Gates: unknown

Blockers:
none

Next:
- /draft <idea-or-source>
```

Then start in Pi:

```text
/draft admin-audit-logging: record admin user changes in an audit log
/new
/discuss docs/specs/admin-audit-logging.md
/new
/plan docs/specs/admin-audit-logging.md
```

The `/new` steps are optional for tiny demos, but they are the normal handoff pattern for real stacks. They keep each phase from inheriting too much stale context.

After `/plan`, inspect `.pi/stack-ops/plans/` before any implementation starts.

## What gets committed

| Path | Commit it? | Why |
| --- | --- | --- |
| `docs/specs/<stack>.md` or another durable spec path | Yes | Reviewers need the product scope, acceptance criteria, and non-goals. |
| `docs/adrs/<decision>.md` or another ADR path | Yes | Architecture decisions should survive local sessions. |
| Implementation changes on slice branches | Yes | Each slice PR carries one reviewable change. |
| `.pi/stack-ops/plans/` | No | Plans are code-bound and local to the current repository state. |
| `.pi/stack-ops/summaries/` | No | Session handoffs may include local context. |
| `.pi/stack-ops/validation/` | No | Keep evidence local; summarize relevant results in PR bodies. |
| `.pi/stack-ops/state.json` and `session.json` | No | Runtime state is local and may include session identifiers. |

!!! warning "Human approval checkpoints"
    Stop for maintainer approval after `/discuss` before `/plan`, before accepting product or architecture scope changes, before marking PRs ready, and before any merge command. Approval must be a direct current-session message that names the exact action and target. Stack Ops can prepare evidence; it does not own the decision.

## Workflow at a glance

```text
Idea -> durable spec/ADR PR -> local plan -> one slice PR at a time -> validation -> PR readiness -> guarded merge
```

Useful next pages: [Quickstart](getting-started/quickstart.md), [Your first stack](getting-started/first-stack.md), [CLI reference](reference/cli.md), [Workflow prompt reference](reference/commands.md), [State files](reference/state-files.md), and [CI integration](operations/ci-integration.md).
