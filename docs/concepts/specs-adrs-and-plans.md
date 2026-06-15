# Specs, ADRs, and plans

`pi-stack-ops` separates durable project documents from disposable workflow
notes. This split keeps long-term decisions in the repository and local
implementation mechanics out of version control.

## Specs

A spec describes a change before implementation starts. It defines the problem,
goals, non-goals, acceptance criteria, risks, and open questions.

## ADRs

An ADR records an important decision. Use one when future maintainers need to
understand the context, alternatives, and consequences of a choice.

## Plans

A plan turns an approved spec or ADR into slices, branches, files, validation
commands, and stop conditions. Plans are local working artifacts and usually use
`.pi/stack-ops/plans/<feature>.plan.md`.

## Next steps

Use [Draft a spec or ADR](../how-to/draft-a-spec-or-adr.md) when you are ready
to create the first durable artifact.
