# Security hardening stack

Scenario: harden token handling with explicit review gates.

```text
main
└─ stack/security-token-handling-adr
   └─ stack/security-redaction-core
      └─ stack/security-logging-tests
```

Stop conditions should name data exposure, compatibility, and migration decisions. Use a security reviewer before readiness and record validation under `.pi/stack-ops/validation/`.

Use this as a shape check, not a substitute for an approved spec and plan. Start with [Quickstart](../getting-started/quickstart.md), then use [Your first stack](../getting-started/first-stack.md) for the full walkthrough.
