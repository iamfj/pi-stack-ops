# Small feature stack

Scenario: add `admin-audit-logging` without mixing storage, write paths, and UI in one PR.

```text
main
└─ stack/admin-audit-logging-spec
   └─ stack/admin-audit-logging-model
      └─ stack/admin-audit-logging-api
```

Artifacts to expect: committed spec at `docs/specs/admin-audit-logging.md`, local plan at `.pi/stack-ops/plans/admin-audit-logging.md`, validation notes under `.pi/stack-ops/validation/`.

Use this as a shape check, not a substitute for an approved spec and plan. Start with [Quickstart](../getting-started/quickstart.md), then use [Your first stack](../getting-started/first-stack.md) for the full walkthrough.
