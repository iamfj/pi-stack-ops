# Create your first stack

This tutorial walks through the first half of a stack: initialize state, draft a
spec, refine it, and generate a local plan.

## Start with an idea

Use a change that is useful but bounded.

```text
/draft Add audit logging for admin actions
```

## Discuss the draft

Open the generated spec and refine the goals, non-goals, risks, and acceptance
criteria.

```text
/discuss docs/specs/admin-audit-logging.md
```

## Generate the plan

Create the local plan only after the spec is clear enough to implement.

```text
/plan docs/specs/admin-audit-logging.md
```

## Check the result

Review the generated plan before you run implementation. Confirm that each slice
has a narrow purpose, validation commands, and a clear stop condition.

## Next steps

Continue with [Run a sliced implementation](run-a-sliced-implementation.md).
