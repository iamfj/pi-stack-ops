# Plan: <feature>

Spec: `<spec path>`
ADR: `<adr path or none>`
Spec PR branch: `<branch>`
Stack root: `<trunk or parent>`
Plan artifact: `.pi/stack-ops/plans/<feature>.plan.md`
Generated: `<iso timestamp>`

## Goal

<one sentence>

## Code map

### Existing files

- `<path>`
  - responsibility: <what this file owns>
  - relevant current behavior: <brief>

### New files

- `<path>`
  - responsibility: <what this file will own>

## Stack shape

```text
<trunk>
└── <spec branch>        # spec/ADR PR
    └── <slice branch 1> # S1
        └── <slice branch 2> # S2
```

## Slices

### S1 — <title>

Branch: `<branch>`
Parent: `<parent>`
PR type: implementation slice

Files:
- Create: `<path>`
- Modify: `<path>`
- Test: `<path>`

Acceptance:
- <specific outcome>

Validation:
- `<exact command>`

Stop conditions:
- <condition requiring human approval or replanning>

Reviewer focus:
- <focus area>

## Cross-slice risks

- <risk and mitigation>

## Plan self-review

- [ ] Every spec requirement maps to a slice.
- [ ] Every slice has exact files.
- [ ] Every slice has validation.
- [ ] Every slice has stop conditions.
- [ ] Branch parents form a valid stax chain.
- [ ] Plan is saved in the gitignored stack-ops artifact directory.
