# Agent Instructions

## Package Manager

- Use **Bun**: `bun install`.
- Do not edit `bun.lock` manually; update it through Bun commands.

## Commands

| Task | Command |
| --- | --- |
| Typecheck | `bun run check` |
| Unit tests | `bun run test` |
| CLI doctor | `bun run doctor` |
| Build CLI | `bun run build` |
| Package dry run | `bun run pack:dry-run` |
| Release checks | `bun run release:check` |
| Local CLI status | `bun ./src/cli/index.ts status` |
| Local CLI init | `bun ./src/cli/index.ts init` |

## External References

| Need | File |
| --- | --- |
| Product/package overview | `README.md` |
| Design concept | `docs/concept.md` |
| Security policy | `SECURITY.md` |
| Security hardening | `docs/security-hardening.md` |
| Plan artifact template | `templates/plan.md` |
| Session summary template | `templates/session-summary.md` |

## Stack-Ops Methodology

- Keep the package stax-first: PR 1 is spec/ADR-only; later PRs are stacked implementation slices.
- Treat specs and ADRs as durable checked-in artifacts.
- Treat generated implementation plans as disposable, code-bound artifacts under `.pi/stack-ops/plans/`.
- Keep runtime state, summaries, snapshots, validation evidence, blockers, and PR drafts under `.pi/stack-ops/`.
- Keep `.pi/stack-ops/` and `.stack-ops/` gitignored in consuming repositories.
- End workflow-facing changes with a compact summary: phase, stack/slice, done, blockers, next prompts, and state paths.

## Git and Commit Conventions

- Use Conventional Commits: `<type>(<scope>): <summary>`.
- Prefer `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `build`, and `ci` as commit types.
- Keep each commit small, well scoped, and independently reviewable.
- Keep commit slices isolated: don't mix unrelated docs, refactors, formatting, or behavior changes.
- Commit only clean, intentional changes; remove debug code and unrelated edits first.
- Use a precise scope when it clarifies the affected area, such as `cli`, `core`, `agents`, or `docs`.
- Write summaries in imperative mood and keep them concise.
- Add an extended commit body when context, tradeoffs, migration notes, or validation evidence matter.
- Use breaking-change footers only when the change is intentionally incompatible.

## Agent and Resource Conventions

- Namespace packaged subagents with `package: stack-ops`, producing runtime names such as `stack-ops.architect`.
- Name agent files after their local role: `agents/<name>.md` with `name: <name>`.
- Use lowercase kebab-case local names without repeating the namespace, such as `architect`, `planner`, `slice-builder`, `security-reviewer`, `readiness`, and `stack-operator`.
- Refer to agents by dotted runtime name in docs, prompts, and self-identification, such as `stack-ops.slice-builder`.
- Run `bun run test` after agent changes; `tests/agents.test.ts` enforces the naming convention.
- Prefer extending Pi status/footer surfaces over building a custom TUI.
- Publish footer-compatible status keys with the `stack-ops-` prefix.
- Keep deterministic tooling small; add commands only for mechanical state, hygiene, validation, and doctor checks.
- Add or update Bun unit tests for CLI/core behavior changes; `release:check` must run them.

## Key Paths

- Extension entrypoint: `extensions/stack-ops.ts`.
- CLI source: `src/cli/`; core CLI logic: `src/core/`.
- Generated bundled CLI entrypoint: `bin/stack-ops.js`; do not commit it.
- Prompt templates: `prompts/`.
- Skills: `skills/`.
- Agent definitions: `agents/`.
- Templates: `templates/`.
