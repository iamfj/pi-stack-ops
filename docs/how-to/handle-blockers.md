# Handle blockers

## When to use this

Use this when status, CI, review, validation, or a prompt reports unresolved work.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```bash
stack-ops status
find .pi/stack-ops/blockers -maxdepth 1 -type f -print
find .pi/stack-ops/validation -maxdepth 1 -type f -print
```

For implementation blockers:

```text
/implement .pi/stack-ops/plans/admin-audit-logging.plan.md only resolve the blockers
```

## Expected result

Each blocker is classified as accepted work, rejected scope, needs-human-decision, or external failure. Accepted work requires direct current-session human approval when it changes scope or behavior. Accepted fixes are validated and summarized; unresolved decisions remain visible.

## Troubleshooting

- Do not silently resolve product, architecture, security, or data retention questions.
- If CI fails for unrelated reasons, record that evidence separately from slice validation.
- If cleanup is tempting, read [State files](../reference/state-files.md) before deleting artifacts.

## Next steps

[Resume work](resume-work.md) after blockers are cleared.
