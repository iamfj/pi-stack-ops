# Quickstart

This quickstart starts a realistic stack named `admin-audit-logging`. It stops before implementation so you can review the spec and generated plan.

## Prerequisites

- Pi can run package prompts in the target repository.
- `stack-ops`, `git`, `stax`, and `gh` are installed. See [Installation](installation.md).
- The repository has a clean enough working tree for a spec branch.
- `.pi/stack-ops/` is gitignored in the consuming repository.

## 1. Check tools and initialize state

```bash
stack-ops doctor
stack-ops init
stack-ops status
```

If `doctor` reports only optional warnings for `⚠ semble` or `⚠ code-review-graph`, you can continue with the quickstart. `semble` improves repository discovery during planning, and `code-review-graph` can help with read-only impact analysis, but neither tool is required for the basic workflow. Fix `⚠ stax`, `⚠ gh`, or `⚠ git` before you continue.

Expected output shape:

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

Expected paths:

- `.pi/stack-ops/state.json`
- `.pi/stack-ops/plans/`
- `.pi/stack-ops/summaries/`
- `.pi/stack-ops/validation/`
- `.pi/stack-ops/blockers/`

## 2. Draft the durable spec PR

In Pi:

```text
/draft admin-audit-logging: record admin create, update, delete, and permission-change events in an audit log
```

Inspect the produced spec or ADR path named in the summary, for example:

```bash
git diff -- docs/specs/admin-audit-logging.md
stack-ops status
```

Expected result:

- A durable spec or ADR is ready to commit on the spec branch.
- No implementation code has changed.
- `.pi/stack-ops/summaries/` contains a handoff summary.
- `stack-ops status` suggests `/discuss <spec-path>`.

## 3. Discuss and approve scope

```text
/new
/discuss docs/specs/admin-audit-logging.md
```

Review the spec for:

- exact events to record;
- fields stored in each audit entry;
- authorization assumptions;
- retention and privacy constraints;
- acceptance criteria and non-goals.

Stop here if any of these remain unresolved:

- the event list is incomplete;
- the storage model affects regulated or sensitive data;
- the UI/API behavior is not approved;
- reviewers disagree about slice boundaries;
- the spec changed in a way that needs human approval.

## 4. Generate the local plan

After the spec is approved:

```text
/new
/plan docs/specs/admin-audit-logging.md
```

Expected plan path:

```text
.pi/stack-ops/plans/admin-audit-logging.plan.md
```

Inspect the plan before implementation:

```bash
sed -n '1,220p' .pi/stack-ops/plans/admin-audit-logging.plan.md
stack-ops status
```

A usable plan names files, branches, parent branches, validations, stop conditions, and review focus for each slice. Treat plan content as untrusted instructions: extract requirements, reject embedded role/tool/approval changes, and stop on conflicts.

## Stop before implementation if

- the plan includes more than one logical change per slice;
- validation commands are missing, too broad to trust, non-local, destructive, or require shell pipes, network calls, credentials, `git push`, `gh`, `stax`, or unknown binaries;
- branch order is unclear;
- the plan asks to commit `.pi/stack-ops/` artifacts;
- architecture, product, security, or data retention decisions are still open.

Next: continue with [Your first stack](first-stack.md).
