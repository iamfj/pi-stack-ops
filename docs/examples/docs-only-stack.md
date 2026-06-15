# Documentation-only stack

Scenario: improve onboarding docs while keeping nav stable.

```text
main
└─ stack/docs-onboarding-spec
   └─ stack/docs-homepage-quickstart
      └─ stack/docs-reference-operations
```

Even docs-only stacks need validation. Use your project's docs build, link checker, or preview workflow, and put generated plans and summaries under `.pi/stack-ops/`, not in the docs tree.

Use this as a shape check, not a substitute for an approved spec and plan. Start with [Quickstart](../getting-started/quickstart.md), then use [Your first stack](../getting-started/first-stack.md) for the full walkthrough.
