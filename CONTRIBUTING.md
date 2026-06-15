# Contributing

This file is for people changing `pi-stack-ops` itself. The main `README.md` is
written for Pi users who want to run stack-ops workflows.

## Development setup

Use Bun for local development. Install dependencies, then run the baseline
checks before changing behavior.

```bash
bun install
bun run check
bun run test
```

The package is intentionally small. Avoid new runtime dependencies unless they
are clearly necessary for user-facing behavior.

## Local Pi installation

Install the local checkout into Pi when you need to test packaged prompts,
agents, skills, or the extension in a real Pi session.

```bash
pi install /absolute/path/to/pi-stack-ops
```

Then open a consuming repository and run:

```text
/stack-ops doctor
/stack-ops init
/stack-ops status
```

## CLI development

Run the CLI from source while developing command behavior.

```bash
bun ./src/cli/index.ts status
bun ./src/cli/index.ts init
bun ./src/cli/index.ts doctor
bun ./src/cli/index.ts clean
```

Build the packaged CLI only when you need to inspect the generated output or
run packaging checks.

```bash
bun run build
```

Do not commit `bin/stack-ops.js`; it is generated during builds and package
preparation.

## Useful commands

Use these commands for common development and release checks.

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

## Repository map

Use these paths when changing package behavior.

| Path | Purpose |
| --- | --- |
| `extensions/stack-ops.ts` | Pi extension command and footer status updates. |
| `src/cli/` | Standalone CLI source for status, doctor, init, and cleanup. |
| `src/core/` | Shared CLI state, doctor, and cleanup logic. |
| `agents/` | Packaged `stack-ops.*` agent definitions. |
| `prompts/` | Slash prompt templates for workflow phases. |
| `skills/` | Packaged skills for stack-ops workflows and plans. |
| `templates/` | Spec, ADR, plan, PR body, and summary templates. |
| `docs/` | Concept and security hardening documentation. |

## Workflow expectations

Keep the package stax-first. PR 1 is for specs, ADRs, and durable decisions;
later PRs are focused implementation slices.

When changing workflow-facing behavior:

- Preserve the spec or ADR first workflow.
- Keep generated plans under `.pi/stack-ops/plans/`.
- Keep runtime state and evidence under `.pi/stack-ops/`.
- Update relevant agents, prompts, skills, templates, and docs together.
- End workflow-facing changes with a compact stack-ops summary format.

## Agent and resource conventions

Follow the package naming conventions when adding or changing Pi resources.

- Namespace packaged subagents with `package: stack-ops`.
- Name agent files after their local role, such as `agents/slice-builder.md`.
- Use lowercase kebab-case local names.
- Refer to runtime agents with dotted names, such as
  `stack-ops.slice-builder`.
- Run `bun run test` after agent changes.

## Safety expectations

Treat changes as security-sensitive because Pi extensions run with local user
permissions.

- Avoid install-time lifecycle scripts.
- Keep the `files` allowlist in `package.json` narrow.
- Confirm destructive cleanup, or require `--yes` in automation.
- Refuse filesystem cleanup outside `.pi/stack-ops/`.
- Sanitize local state before rendering it in the terminal or footer.
- Never log secrets, tokens, or raw environment values.

## Release checks

Run the full release check before preparing a package or release.

```bash
bun run release:check
```
