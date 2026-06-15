# Templates reference

Source templates live in `templates/`. They guide generated artifacts, but the generated output path depends on the repository and prompt.

| Template | Used by | Durable? | Required review |
| --- | --- | --- | --- |
| `templates/spec.md` | `/draft` for product or workflow specs | Yes; commit generated spec | Maintainer approves scope, acceptance criteria, risks, and non-goals. |
| `templates/adr.md` | `/draft` for architecture decisions | Yes; commit generated ADR | Maintainer approves decision, context, consequences, and alternatives. |
| `templates/plan.md` | `/plan` | No; output under `.pi/stack-ops/plans/` | Maintainer checks slices, branches, validation, stop conditions. |
| `templates/pr-body.md` | `/finish` and `/iterate` | No source artifact; PR body is durable in GitHub | Maintainer checks summary, validation, risks, and reviewer focus. |
| `templates/session-summary.md` | All workflow phases | No; output under `.pi/stack-ops/summaries/` | Used for handoff and resume, not code review. |

## Example output paths

```text
docs/specs/admin-audit-logging.md
docs/adrs/record-admin-audit-events.md
.pi/stack-ops/plans/admin-audit-logging.md
.pi/stack-ops/pr-bodies/admin-audit-logging-S1.md
.pi/stack-ops/summaries/2026-06-15-admin-audit-logging.md
```

Generated specs and ADRs should be clear enough to review without reading the local plan. Generated plans should be specific enough to implement without reopening the whole design discussion.

Next: [Draft a spec or ADR](../how-to/draft-a-spec-or-adr.md).
