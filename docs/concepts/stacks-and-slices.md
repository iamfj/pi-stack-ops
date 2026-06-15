# Stacks and slices

A stack is an ordered set of branches and pull requests. A slice is one focused
step in that stack. The goal is to make every PR small enough to review without
losing the larger plan.

## Default shape

A typical stack starts with a spec or ADR-only branch, then adds implementation
slices. For an audit logging change, the stack might look like this:

```text
main
└── admin-audit-logging/spec
    └── admin-audit-logging/event-model
        └── admin-audit-logging/admin-actions
            └── admin-audit-logging/docs
```

The first PR should be easy to review without reading implementation code. Later
PRs should each answer one review question, such as "is this storage model
right?" or "are these events emitted in the right places?"

## Good slices

A good slice has one reason to exist. It contains the smallest useful change
that can be reviewed, validated, and explained on its own.

| Weak slice | Better slice |
| --- | --- |
| `audit-logging-implementation`: adds schema, admin event writes, UI, retention rules, and docs in one PR. | `audit-event-model`: adds the event type, storage shape, and tests before any UI wiring. |
| `final-polish`: fixes tests, changes copy, updates docs, and tweaks config. | `audit-docs`: documents behavior after the implementation is stable. |

Good slices usually include these traits.

- A clear review question.
- A bounded file set.
- Focused tests or validation commands.
- A stop condition for decisions outside the approved spec.
- A summary that explains what changed and what remains.

## Next steps

Read [Specs, ADRs, and plans](specs-adrs-and-plans.md) to understand how the
stack gets planned.
