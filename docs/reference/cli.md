# CLI reference

The standalone CLI manages local Stack Ops state and utility checks. Run commands from the repository root.

## No arguments

```bash
stack-ops
```

Same as `stack-ops status`. It ensures `.pi/stack-ops/` directories exist and prints current state.

## `init`

```bash
stack-ops init
```

Creates `.pi/stack-ops/`, artifact directories, and `state.json` if missing. Output:

```text
Initialized stack-ops at /path/to/repo/.pi/stack-ops
```

## `status`

```bash
stack-ops status
```

Prints phase, stack, slice, branch, plan, gates, blockers, and next prompts. If `state.json` is missing, status renders the default idle state.

## `doctor`

```bash
stack-ops doctor
```

Checks artifact directory, state file, `stax`, `gh`, `git`, and `semble`. Exit code is `0` when all required checks pass; otherwise `1`. A missing `semble` check is optional for simple workflows and does not make `doctor` return non-zero.

## `clean`

```bash
stack-ops clean
```

Deletes `.pi/stack-ops/logs/` only, then recreates required directories.

```bash
stack-ops clean --all
stack-ops clean --all --yes
```

Deletes all `.pi/stack-ops/` artifacts and resets `state.json`. Without `--yes`, interactive terminals must type `delete`; non-interactive runs are refused.

## `context-budget`

```bash
stack-ops context-budget [options]
```

Checks the recorded Pi session for enough context before another workflow unit.

Common examples:

```bash
stack-ops context-budget --snapshot --json --out .pi/stack-ops/context-budget/snapshot.json
stack-ops context-budget --guard next-slice --context-window 272K --max-used-percent 60 --json
stack-ops context-budget --session /path/to/session.jsonl --context-window 272000
```

Key options:

| Option | Meaning |
| --- | --- |
| `--json` | Print JSON instead of text. |
| `--snapshot` | Record usage without guarding the next unit. |
| `--guard <unit>` | Return a continue/stop/unknown verdict for a named unit. |
| `--session <id|path>` | Use a session id or JSONL path instead of `.pi/stack-ops/session.json`. |
| `--session-dir <path>` | Directory used to resolve session ids. |
| `--context-window <tokens>` | Model window, for example `272000` or `272K`. |
| `--max-used-percent <number>` | Stop threshold; default is `60`. |
| `--out <path>` | Write JSON under `.pi/stack-ops/context-budget/` or another safe path. |

Exit code is `0` for `continue`, `2` for `stop` or `unknown`, and `1` for invalid arguments or unreadable sessions.

Next: see [State files](state-files.md) for output paths.
