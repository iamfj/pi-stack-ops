# How-to guides

Pick the guide that matches the phase you are in. If you are blocked, start with `stack-ops status`, then read [Handle blockers](handle-blockers.md).

| Phase | Task | Use when |
| --- | --- | --- |
| Setup | [Initialize a project](initialize-a-project.md) | `.pi/stack-ops/` does not exist or status is missing. |
| Decision | [Draft a spec or ADR](draft-a-spec-or-adr.md) | You have an idea but no approved durable artifact. |
| Planning | [Generate a plan](generate-a-plan.md) | A spec or ADR is approved and implementation slices need definition. |
| Implementation | [Implement a slice](implement-a-slice.md) | You are ready to build exactly one approved slice. |
| Recovery | [Resume work](resume-work.md) | A session ended, context changed, or state needs inspection. |
| Recovery | [Handle blockers](handle-blockers.md) | Status, CI, review, or validation reports a blocker. |
| PR prep | [Prepare PRs](prepare-prs.md) | Slice work is complete and PRs need bodies/readiness checks. |
| Validation | [Validate a stack](validate-a-stack.md) | You need evidence before review, iteration, or merge readiness. |

Each guide is intentionally narrow. Use [Your first stack](../getting-started/first-stack.md) for the tutorial flow.
