<div align="center">

# pi-stack-ops

*AI-assisted stacked PRs with clear human checkpoints*

[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-3c873a?style=flat-square)](https://nodejs.org)
[![Pi](https://img.shields.io/badge/Pi-%3E%3D0.74.0-blue?style=flat-square)](https://github.com/earendil-works/pi-coding-agent)
[![npm version](https://img.shields.io/npm/v/pi-stack-ops?style=flat-square)](https://www.npmjs.com/package/pi-stack-ops)

</div>

`pi-stack-ops` helps you turn one idea into a calm, reviewable stack of small
pull requests. It gives Pi a guided workflow for specs or ADRs (architecture
decision records), plans, implementation slices, validation, review, and merge
readiness, so AI-assisted coding stays visible and controlled.

Instead of asking you to manage every branch, note, blocker, and next step in
your head, `pi-stack-ops` records the workflow locally and ends each phase with a
compact summary of what changed, what is blocked, and what to do next.

<!-- prettier-ignore -->
> [!NOTE]
> `pi-stack-ops` is early `0.x` software. Review generated plans, branch
> operations, and PR actions before you apply them. It will not run a merge
> command unless you explicitly approve it.

## The problem it solves

AI coding agents can move quickly, but large changes are hard to review and easy
to lose track of. Stacked PRs keep the work reviewable by breaking it into
smaller pull requests, which helps keep the human in the loop at every important
step. They also add their own coordination work: branch order, specs, plans,
feedback, validation evidence, and handoffs between sessions.

`pi-stack-ops` adds structure around that work:

- Start from an agreed spec or ADR before implementation begins.
- Break large changes into focused, reviewable PR slices.
- Keep human review at the center of each slice before the stack moves forward.
- Keep plans, blockers, validation, and summaries in one local place.
- Pause at important boundaries instead of letting automation run ahead.
- Keep the human in charge of decisions, branch operations, and merges.

## Core concepts

`pi-stack-ops` uses three simple artifacts to keep the work understandable. Specs
and ADRs are durable project documents. Plans are local working notes for the
current stack.

| Artifact | What it is | Why it matters |
| --- | --- | --- |
| Spec | A short description of the problem, goals, non-goals, acceptance criteria, risks, and open questions. | It gives you and the agent a shared target before code changes begin. |
| ADR | An architecture decision record that explains an important decision, the context behind it, alternatives considered, and consequences. | It keeps major tradeoffs visible for reviewers and future maintainers. |
| Plan | A generated, gitignored implementation map saved under `.pi/stack-ops/plans/`. | It turns the approved spec or ADR into slices, branches, files, validation commands, and stop conditions. |

A good stack usually starts with a spec. Add an ADR when the work includes an
important technical or product decision that future readers need to understand.
Use the plan as a temporary guide while implementing; keep the spec or ADR as the
long-term record.

## How the workflow feels

Each phase has one job. You always know whether you are deciding, planning,
implementing, reviewing, or merging.

| Phase | Prompt | What it helps you do |
| --- | --- | --- |
| Draft | `/draft <idea-or-source>` | Turn an idea into the first spec or ADR shape. |
| Discuss | `/discuss <spec-or-adr-path>` | Refine decisions, risks, and acceptance criteria. |
| Plan | `/plan <approved-spec-path>` | Create a local plan for the stack. |
| Implement | `/implement <plan-path>` | Build one approved implementation slice. |
| Finish | `/finish <plan-path>` | Prepare draft PRs from the bottom of the stack up. |
| Iterate | `/iterate <plan-path>` | Work through CI, review feedback, and restacking. |
| Merge | `/merge <plan-path>` | Check readiness and offer guarded merge execution. |

A typical stack starts with a durable decision, then adds focused code changes in
later PRs.

```text
main
└── feature/spec          # PR 1: spec or ADR only
    └── feature/slice-1   # PR 2: focused implementation slice
        └── feature/slice-2
            └── feature/slice-3
```

## Clear handoffs after each stage

`pi-stack-ops` ends every stage with a short handoff summary, so you can see the
state of the stack before deciding what happens next. Each summary shows what was
completed, what is blocked, and the safest prompt to run next. For longer work,
the handoff can start with `/new` so the next stage begins in a fresh session
with the current state still visible.

For example, after finishing the first slice of a fictional audit logging stack,
the response might end like this:

```text
Phase: implement
Stack: admin-audit-logging
Current: S1/3
Done:
- Added the audit event model and tests.
- Ran the focused unit tests for audit events.

Blockers:
- None.

Next:
1. Review the S1 diff.
2. Run `/new` to start a fresh session.
3. Run `/implement .pi/stack-ops/plans/admin-audit-logging.plan.md` to start S2.
```

When work is not ready to continue, the summary stops at the blocker instead of
nudging the stack forward:

```text
Blockers:
- S2 changes the retention policy, but the spec does not define retention rules.

Next:
1. Run `/new` to start a fresh session.
2. Run `/discuss docs/specs/admin-audit-logging.md` to decide retention rules.
3. Continue implementation only after the spec is updated.
```

The result is a resumable workflow with no hidden memory dependency: you can
continue in the same session or a fresh one with the current phase, blockers, and
next prompt visible.

## Safeguards by design

`pi-stack-ops` is designed to slow down at the moments where human judgment
matters. It helps Pi organize the work, but it does not replace your review.

- **Spec first**: Implementation starts from an explicit spec or ADR, not an
  implicit plan hidden in a chat.
- **One slice at a time**: Implementation prompts focus on one approved slice,
  which keeps diffs smaller and easier to review.
- **Visible local state**: Plans, summaries, blockers, snapshots, validation,
  and PR body drafts are stored under `.pi/stack-ops/`.
- **Human approval**: Merge execution is never automatic. The merge phase gathers
  evidence first, then waits for your approval.
- **Safer cleanup**: Destructive cleanup asks before deleting local workflow
  artifacts, or requires `--yes` in automation.
- **Context handoffs**: Long workflows stop with compact summaries before the
  conversation gets too crowded, so you can continue in a fresh run.
- **Focused agent roles**: Planning, building, review, security, validation, and
  readiness work can use separate subagents, so each role gets the context it
  needs without one long conversation carrying everything.

<!-- prettier-ignore -->
> [!IMPORTANT]
> Keep `.pi/stack-ops/` and `.stack-ops/` out of version control. They contain
> generated workflow artifacts for your local work, not durable project docs.

## Security posture

Because Pi extensions operate in your local development environment,
`pi-stack-ops` keeps runtime behavior small and bounded.

- It avoids install-time lifecycle scripts.
- It keeps runtime dependencies minimal.
- It writes workflow artifacts under the configured stack-ops artifact
  directory.
- It sanitizes local state before rendering it in terminal or footer surfaces.
- It caps displayed state size to avoid noisy or unsafe output.
- It treats destructive filesystem changes as explicit, confirmed actions.

For more detail, see the [security policy](SECURITY.md) and
[security hardening notes](docs/security-hardening.md).

## Benefits

Use `pi-stack-ops` when you want AI help without losing the review trail.

- **Less overwhelm**: One phase, one prompt, and one clear next step at a time.
- **Smaller reviews**: Large ideas become focused PR slices.
- **Better decisions**: Specs and ADRs capture intent before code changes.
- **Clearer evidence**: Validation notes, blockers, and PR drafts stay together.
- **Safer handoffs**: Session summaries make it easier to resume later.
- **Longer-running work**: Focused subagents and local state help larger stacks
  stay performant without losing the workflow rules.
- **More control**: Important actions stay visible and approval-based.

## Requirements

Use `pi-stack-ops` inside a repository where you want to manage a stacked
change.

- [Pi coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)
  `>=0.74.0 <1`
- [Node.js](https://nodejs.org) `>=20`
- [Git](https://git-scm.com)
- [stax](https://github.com/cesarferreira/stax), the stacked-branch tool used
  for PR stack operations
- [GitHub CLI](https://cli.github.com) for GitHub PR operations
- Optional: [Semble](https://github.com/MinishLab/semble) for code discovery
  during planning

Recommended companion Pi packages:

```bash
pi install npm:pi-subagents
pi install npm:pi-mcp-adapter
pi install npm:pi-powerline-footer
```

## Installation

Install the package into Pi, then run the doctor command in your project
repository.

```bash
pi install npm:pi-stack-ops
```

```text
/stack-ops doctor
```

If the `stack-ops` CLI is on your `PATH`, you can run the same check from a
shell.

```bash
stack-ops doctor
```

If installation or doctor checks fail, see the
[`pi-stack-ops` troubleshooting guide](TROUBLESHOOTING.md).

## Quick start

Start with one idea. Let `pi-stack-ops` show the next safe step.

```text
/stack-ops init
/draft Add audit logging for admin actions
```

When the spec or ADR is ready, continue through discussion, planning, and one
implementation slice.

```text
/discuss docs/specs/admin-audit-logging.md
/plan docs/specs/admin-audit-logging.md
/implement .pi/stack-ops/plans/admin-audit-logging.plan.md
```

Use `/stack-ops status` whenever you need the current phase, active plan,
blockers, gates, and next prompts.

## Local workflow state

`pi-stack-ops` separates durable repository documentation from disposable local
workflow artifacts.

Durable artifacts belong in your repository:

- Specs
- ADRs
- Intentional project documentation changes

Disposable artifacts stay local:

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

These files are working artifacts for your local workflow. Review them when
needed, and only copy content into durable documentation when you mean to keep
it.

## Commands

Use `/stack-ops` inside Pi for local workflow state and hygiene. The standalone
CLI exposes the same actions as `stack-ops <action>`.

| Command | Description |
| --- | --- |
| `/stack-ops init` | Create `.pi/stack-ops/` and initialize `state.json`. |
| `/stack-ops status` | Show phase, stack, slice, blockers, gates, and next prompts. |
| `/stack-ops doctor` | Check required directories and local tools. |
| `/stack-ops context-budget` | Check whether the recorded Pi session is below the context guard. |
| `/stack-ops clean` | Remove stack-ops logs and recreate required directories. |
| `/stack-ops clean --all` | Remove all stack-ops artifacts after confirmation. |

Use `--yes` with `clean --all` only for non-interactive automation.

## Agent support

The package includes namespaced Pi agents that help with the workflow. You do not
need to manage them directly in normal use; the prompts call on the right roles
for planning, writing, review, security checks, validation, readiness, and stack
operations.

This role-based setup helps with long-running work. Instead of asking one agent
to hold every detail in one crowded context window, `pi-stack-ops` can hand a
focused task to the right subagent, collect the result, update local state, and
return to the next workflow step. The workflow guidance stays the same: follow
the spec, work one slice at a time, validate, summarize, and stop for blockers or
approval.

Examples include:

- `stack-ops.spec-writer` for specs and ADRs.
- `stack-ops.planner` for local implementation plans.
- `stack-ops.slice-builder` for one approved slice at a time.
- `stack-ops.security-reviewer` for security, privacy, auth, secrets, and
  dependency risk.
- `stack-ops.readiness` for deciding whether a phase, PR, slice, or stack can
  advance.
- `stack-ops.stack-operator` for stax and GitHub mechanics after readiness.

## Next steps

Install the package, run `/stack-ops doctor`, and start with `/draft` in the
repository where you want to create a stacked change.
