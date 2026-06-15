# Security policy

`pi-stack-ops` is a Pi extension package. Extensions run with the user's local
permissions, so security issues can affect source code, local files, shell
commands, GitHub access, and workflow artifacts.

## Supported versions

| Version | Supported |
| --- | --- |
| `0.x` | Best-effort security fixes before the first stable release |

## Reporting a vulnerability

Report suspected vulnerabilities privately through GitHub private vulnerability
reporting at
`https://github.com/iamfj/pi-stack-ops/security/advisories/new`. If that isn't
available, contact the maintainer directly before publishing details.

Include:

- affected version or commit;
- installation source;
- operating system;
- reproduction steps;
- impact assessment;
- whether secrets, source code, or local files are exposed or modified.

## Security scope

In scope:

- install or publish supply-chain issues;
- package tarball contents;
- extension runtime behavior;
- CLI filesystem cleanup behavior;
- subprocess execution;
- status/footer rendering of local state;
- handling of `.pi/stack-ops/` artifacts.

Out of scope:

- vulnerabilities in a consuming repository's own code;
- compromised local developer machines;
- malicious configuration intentionally added by a repository owner.

## Maintainer expectations

Maintainers must:

- keep runtime dependencies minimal;
- avoid install-time lifecycle scripts;
- review package contents with `bun run pack:dry-run` before release;
- publish with npm provenance when publishing to npm;
- keep GitHub Actions permissions least-privilege;
- pin third-party GitHub Actions to full commit SHAs;
- treat destructive filesystem changes as explicit, confirmed actions.
