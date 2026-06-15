---
description: Gather final guarded merge evidence for a stax stack
argument-hint: "<plan-path>"
---
Use stack-ops to run the merge phase for the stax stack.

Input:
$ARGUMENTS

Rules:
- Gather final merge evidence with stax; do not merge implicitly.
- Require explicit human approval before running any merge command.
- Verify the stack is green, current, approved, and matches the approved spec/plan.
- Use `stack-ops.readiness` and `stack-ops.stack-operator`.
- Update stack-ops state and latest summary.
- End with a compact overview of the evidence, blockers, and exact next actions. If more workflow work remains, start continuation handoffs with `/new` before the suggested workflow prompt.
- If everything is ready, offer assisted execution of `stax merge --when-ready` after explicit approval.
