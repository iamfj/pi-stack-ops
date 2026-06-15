# Your first stack

This walkthrough continues the `admin-audit-logging` quickstart after `/plan` has produced `.pi/stack-ops/plans/admin-audit-logging.md`.

## Target stack shape

A typical first stack should be boring and reviewable:

```text
main
└─ stack/admin-audit-logging-spec       # spec-only PR
   └─ stack/admin-audit-logging-model   # S1: audit event model and migration
      └─ stack/admin-audit-logging-api  # S2: write events from admin actions
         └─ stack/admin-audit-logging-ui # S3: read-only admin audit view, if in scope
```

PR order is bottom-up: spec first, then S1, then S2, then S3. Merge readiness is checked in that order too.

## 1. Review the plan quality

Before implementing, verify each slice has:

- one branch name and parent branch;
- exact files or areas to edit;
- acceptance criteria copied from the approved spec;
- validation commands, for example `bun run check` and focused tests;
- stop conditions for product, architecture, data, or security questions.

If the plan is vague, rerun or refine `/plan` before writing code. See [Generate a plan](../how-to/generate-a-plan.md).

## 2. Implement S1 only

```text
/implement .pi/stack-ops/plans/admin-audit-logging.md implement S1 only
```

Expected result:

- one slice branch is active;
- only S1 files changed;
- focused validation ran;
- `.pi/stack-ops/validation/` has evidence or the summary names the command output;
- `.pi/stack-ops/state.json` records the active slice and next prompt.

Do not let S1 include API wiring or UI work just because the files are nearby. That belongs in later slices.

## 3. Validate and decide whether to continue

Run the commands named by the summary or plan, for example:

```bash
bun run check
bun run test
stack-ops status
```

Before another slice, Stack Ops should guard context with a command shaped like:

```bash
stack-ops context-budget --guard next-slice --out .pi/stack-ops/context-budget/implement-S1.json --json
```

Continue only when the verdict is `continue`. Stop and hand off when the verdict is `stop` or `unknown`.

## 4. Pause and resume safely

When you stop, rely on local state rather than memory:

```bash
stack-ops status
ls .pi/stack-ops/summaries
ls .pi/stack-ops/blockers
```

Resume with the prompt suggested by `status`, usually:

```text
/implement .pi/stack-ops/plans/admin-audit-logging.md
```

See [Resume work](../how-to/resume-work.md) if the state is stale or blocked.

## 5. Finish PR bodies bottom-up

After all approved slices are implemented:

```text
/finish .pi/stack-ops/plans/admin-audit-logging.md
```

Expected artifacts:

- `.pi/stack-ops/pr-bodies/` contains draft PR bodies;
- each PR body lists scope, validation, risks, and reviewer focus;
- lower PRs are ready before dependent PRs are marked ready.

Use [Prepare PRs](../how-to/prepare-prs.md) and [Validate a stack](../how-to/validate-a-stack.md) before asking reviewers to spend time on the stack.

Next: when CI or review feedback arrives, use [Handle blockers](../how-to/handle-blockers.md) or `/iterate` from the [workflow prompt reference](../reference/commands.md).
