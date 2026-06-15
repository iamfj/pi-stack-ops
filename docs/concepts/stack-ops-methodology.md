# Stack Ops methodology

The Stack Ops methodology keeps implementation work visible, reviewable, and
resumable. It treats a stack as the unit of work and a slice as the unit of
review.

## Workflow

A normal stack moves through these phases.

1. Draft a spec or ADR.
2. Discuss and approve the durable decision.
3. Generate a local plan.
4. Implement one slice.
5. Validate and summarize the slice.
6. Prepare, iterate, and merge PRs with approval.

## Human checkpoints

The workflow slows down at decision points. Specs, ADRs, branch changes, PR
creation, destructive cleanup, and merges stay visible so you can review them
before the stack moves forward. If a phase changes the approved product scope,
security posture, privacy behavior, or data-retention rules, stop and update the
spec or ADR before continuing.

## Handoffs

Each phase ends with a compact handoff. The handoff lists the current phase,
stack, slice, completed work, blockers, next prompts, and state paths. That
summary lets you continue later without relying on chat memory.

## Next steps

Read [Stacks and slices](stacks-and-slices.md) to see how the methodology maps to
branches and pull requests.
