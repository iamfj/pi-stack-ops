# Multi-agent workflow

Scenario: use specialized roles without losing single-writer control.

```text
architect/spec-writer -> planner -> slice-builder -> validator/reviewer -> readiness -> stack-operator
```

The implementation slice should still have one writer. Reviewers and validators produce findings; accepted fixes go back through the writer and are captured in summaries and blockers.

Use this as a shape check, not a substitute for an approved spec and plan. Start with [Quickstart](../getting-started/quickstart.md), then use [Your first stack](../getting-started/first-stack.md) for the full walkthrough.
