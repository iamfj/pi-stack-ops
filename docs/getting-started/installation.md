# Installation

Install Stack Ops in the environment where you run Pi and work on the target repository.

## Required tools

| Tool | Required | Used for | Verify |
| --- | --- | --- | --- |
| Pi | Yes | Runs workflow prompts and packaged agents. | Open Pi in the repository. |
| Node.js 20+ | Yes | Runs the packaged CLI. | `node --version` |
| Git | Yes | Branches, diffs, and local repository state. | `git --version` |
| `stax` | Yes for stacked PR mechanics | Creates, submits, restacks, and merges stacks. | `stax --help` |
| GitHub CLI `gh` | Yes for GitHub PR operations | Reads and updates PRs. | `gh auth status` |
| `semble` | Optional but recommended | Repository discovery for planning. Doctor reports it so maintainers know whether richer discovery is available. | `semble --help` |
| `code-review-graph` | Optional | Read-only impact analysis for dependency, call-path, and blast-radius review. Doctor reports it without blocking workflows. | `code-review-graph --help` |

## Install Stack Ops

Install the published package through your Pi package flow, then verify that `stack-ops` is on PATH:

```bash
stack-ops --version
stack-ops doctor
```

## What doctor checks

```bash
stack-ops doctor
```

Expected shape:

```text
stack-ops doctor

✓ artifact directory
✓ state file
✓ stax
✓ gh
✓ git
⚠ semble
⚠ code-review-graph
```

`doctor` creates `.pi/stack-ops/` if it does not already exist. It exits `0` when all required checks pass. Optional `semble` and `code-review-graph` warnings do not block the core workflow or make `doctor` return non-zero. A `⚠ stax`, `⚠ gh`, or `⚠ git` line blocks normal stack operations.

## Initialize local state

```bash
stack-ops init
stack-ops status
```

Expected result:

- `.pi/stack-ops/state.json` exists.
- Artifact directories such as `.pi/stack-ops/plans/`, `.pi/stack-ops/summaries/`, and `.pi/stack-ops/validation/` exist.
- `stack-ops status` shows `Phase: idle` and `Next: /draft <idea-or-source>`.

Next: run the [Quickstart](quickstart.md).
