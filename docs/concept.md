# stack-ops concept

`stack-ops` is stax-first. It assumes the stack is the unit of workflow truth.

## Default stack

```text
main
└── feature/spec          # PR 1: spec/ADR only
    └── feature/slice-1   # PR 2
        └── feature/slice-2
            └── feature/slice-3
```

## Durable vs disposable artifacts

Durable and checked in:

- specs
- ADRs
- project documentation intentionally changed by the stack

Disposable and gitignored:

- implementation plans
- stack snapshots
- validation logs/summaries
- blocker ledgers
- generated PR body drafts
- session summaries

## Human guidance

Every stack-ops session should end with a compact summary:

- phase
- stack/slice
- done
- blockers
- exact next prompts
- state artifact pointers

The goal is that the human never has to wonder what to do next.

## UI integration

`stack-ops` publishes status keys for existing Pi footer/powerline integrations. It should not build a separate dashboard for MVP.
