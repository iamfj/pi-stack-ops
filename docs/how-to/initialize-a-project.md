# Initialize a project

## When to use this

Use this once per repository, or again after cleaning all local Stack Ops artifacts.

## Prerequisites

- Run from the repository root.
- `stack-ops status` works.
- Run `git status --short`; stop if unrelated changes are present.

## Steps

```bash
stack-ops doctor
stack-ops init
stack-ops status
```

## Expected result

.pi/stack-ops/state.json exists with `Phase: idle`, artifact directories exist, and the next prompt is `/draft <idea-or-source>`.

## Troubleshooting

- `⚠ stax`, `⚠ gh`, or `⚠ git`: install or authenticate the missing tool before using stack prompts.
- `⚠ semble`: continue for simple work, but expect less repository discovery in planning.
- `⚠ code-review-graph`: continue for simple work, but expect less automated impact analysis for broad or dependency-sensitive changes.
- Status says `blocked`: inspect `.pi/stack-ops/state.json` and [Handle blockers](handle-blockers.md).

## Next steps

[Draft a spec or ADR](draft-a-spec-or-adr.md)
