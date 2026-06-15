# Security hardening

`pi-stack-ops` runs inside Pi and can execute with the user's local permissions.
This page records the release and runtime rules that reduce risk for extension
users.

## Supply chain rules

Keep the package small and traceable.

- Keep runtime dependencies at zero unless a dependency is clearly necessary.
- Use Bun with `trustedDependencies: []` in `package.json`.
- Do not add install-time lifecycle scripts.
- Keep the `files` allowlist narrow.
- Run `bun run release:check` before publishing.
- Publish npm releases with provenance.
- Require maintainer two-factor authentication for npm publishing.

## Runtime rules

Keep runtime behavior predictable and bounded.

- Write only under the configured stack-ops artifact directory.
- Confirm destructive cleanup, or require `--yes` in automation.
- Refuse cleanup targets outside `.pi/stack-ops/`.
- Avoid shell command strings; use allowlists for command discovery.
- Sanitize local state before rendering it in the terminal or footer.
- Cap local state size and displayed string lengths.
- Never log secrets, tokens, or raw environment values.

## GitHub Actions rules

Use GitHub Actions as part of the release boundary.

- Use least-privilege workflow permissions.
- Pin third-party actions to full commit SHAs.
- Run CI with `bun install --frozen-lockfile`.
- Run typecheck and package dry-run checks in CI.
- Use npm trusted publishing for release workflows when publishing to npm.

## Release checklist

Before release:

1. Run `bun install --frozen-lockfile`.
2. Run `bun run check`.
3. Run `bun run pack:dry-run`.
4. Inspect the tarball file list.
5. Confirm `SECURITY.md` is current.
6. Publish with provenance from a protected tag or release workflow.
