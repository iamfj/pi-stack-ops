# Configuration

Stack Ops has very little user-facing configuration. Most behavior comes from the
prompt you run, the approved spec or ADR, the generated plan, and the tools
available in your repository.

## What you can influence

| Area | How to control it | Notes |
| --- | --- | --- |
| Stack scope | Spec or ADR content | Put goals, non-goals, risks, and acceptance criteria in the durable artifact before planning. |
| Slice shape | Plan review | Ask Stack Ops to split, rename, or reorder slices before implementation starts. |
| Validation | Plan commands | Make validation commands project-specific. Use your real test, lint, typecheck, build, and manual review steps. |
| Context-budget checks | CLI options | Use `stack-ops context-budget --session`, `--session-dir`, `--context-window`, and `--max-used-percent` when automatic session lookup is ambiguous. |
| Tool discovery | `PATH` | `doctor` checks `stax`, `gh`, `git`, and `semble` by scanning your shell path. |

## What is fixed

The local artifact root is `.pi/stack-ops/`. Stack Ops creates these fixed
subdirectories: `plans`, `summaries`, `validation`, `snapshots`, `blockers`,
`pr-bodies`, `logs`, and `context-budget`.

Prompt names and phase names are fixed by the package. If your workflow needs a
different rule, write that rule into the spec, ADR, or plan instead of relying on
hidden local configuration.

## Environment expectations

Run commands from the repository where the stack lives. Stack Ops assumes normal
Git, `stax`, and GitHub CLI behavior in that repository. If your shell cannot
find those tools, fix `PATH` before running workflow prompts.

Next: [Directory layout](directory-layout.md).
