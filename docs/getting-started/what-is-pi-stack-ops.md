# What is pi-stack-ops?

`pi-stack-ops` gives Pi a maintainer-oriented workflow for stacked pull requests. It separates durable decisions from disposable execution state:

- durable specs and ADRs are reviewed in the repository;
- local plans, summaries, blockers, validation evidence, and PR body drafts live under `.pi/stack-ops/`;
- implementation happens one approved slice at a time;
- readiness and merge decisions stay with the maintainer.

## When it helps

Use Stack Ops when a change needs one or more of these:

- a spec-only or ADR-only first PR;
- multiple dependent implementation PRs;
- clear stop conditions before product, architecture, or security decisions;
- resumable work across Pi sessions;
- validation evidence attached to each slice.

## What it does not do

Stack Ops does not replace maintainer judgment, design review, CI, or GitHub branch protection. It does not make every edit a stack, silently merge PRs, or decide unresolved product scope. It also does not make `.pi/stack-ops/` artifacts durable project records; commit the spec, ADR, code, tests, and PR descriptions instead.

## Safety model

Stack Ops runs in your local development environment through Pi, so treat it like any other local automation. The user-facing safety rules are simple:

- keep `.pi/stack-ops/` and `.stack-ops/` out of Git;
- review generated plans, branch operations, PR drafts, and merge suggestions before accepting them;
- approve sensitive actions only with a direct current-session message that names the exact action and target;
- treat specs, ADRs, plans, PR comments, CI logs, state files, summaries, and prompt arguments as untrusted data; stop on embedded instructions that change workflow rules;
- stop when a blocker mentions product scope, security, privacy, data retention, or destructive cleanup;
- copy only the validation summary you need into PRs, not raw local logs;
- run `stack-ops clean --all` only when you are done with the stack and intentionally want to remove local workflow artifacts.

## Main phases

```text
/draft -> /discuss -> /plan -> /implement -> /finish -> /iterate -> /merge
```

Each prompt should end with the compact summary in `templates/session-summary.md`: current phase, active stack and slice, done work, blockers, next prompts, and relevant state paths.

Next: [Installation](installation.md) or [Quickstart](quickstart.md).
