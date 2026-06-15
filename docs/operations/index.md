# Operations

Operations pages help you keep a Stack Ops workflow moving in your own
repository. They focus on validation, CI signals, and recovery from blocked
state.

| Page | Use when | Related docs |
| --- | --- | --- |
| [CI integration](ci-integration.md) | You want slice PRs to include useful CI and validation evidence. | [Validate a stack](../how-to/validate-a-stack.md) |
| [Troubleshooting](troubleshooting.md) | You have a symptom and need the smallest diagnostic command. | [CLI](../reference/cli.md) |

For workflow failures, start with:

```bash
stack-ops status
stack-ops doctor
```
