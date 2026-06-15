---
name: stack-ops
description: Use for stax-first spec/ADR-led stacked PR workflows with specialized agents, local state, artifact hygiene, and compact next-step guidance.
---

# stack-ops

Use this skill when running or reasoning about the stack-ops workflow.

## Operating model

The workflow is stax-first:

1. First PR: spec/ADR only.
2. Follow-up PRs: small stacked implementation slices.
3. Plans are gitignored execution artifacts under `.pi/stack-ops/plans/`.
4. State, blockers, summaries, validation evidence, snapshots, and PR body drafts live under `.pi/stack-ops/`.
5. Every session ends with a compact summary and exact next prompt suggestions, starting with `/new` before the next workflow prompt when continuing work.

## Agent team

Use namespaced agents:

- `stack-ops.architect`
- `stack-ops.spec-writer`
- `stack-ops.planner`
- `stack-ops.slice-builder`
- `stack-ops.reviewer`
- `stack-ops.security-reviewer`
- `stack-ops.workflow-reviewer`
- `stack-ops.validator`
- `stack-ops.readiness`
- `stack-ops.stack-operator`
- `stack-ops.blocker-resolver`
- `stack-ops.state-keeper`

## Summary format

End with:

```markdown
## stack-ops summary

Phase: <draft|discuss|plan|implement|finish|iterate|merge>
Stack: <name or unknown>
Current: <spec PR|S1/N|PR #>
Plan: <path or none>

Done:
- <compact bullet>

Blockers:
- <none or blocker bullets>

Next:
1. `/new`
2. `<exact next workflow prompt>`
3. `<optional follow-up prompt>`

State:
- Updated: `.pi/stack-ops/state.json`
- Latest summary: `.pi/stack-ops/summaries/latest.md`
```
```

Keep it compact. Do not dump logs. Use `/new` as the first next step for continuation handoffs so the human can start the next workflow stage in a fresh session before running the suggested prompt.
