# Troubleshooting

Use this guide when `pi-stack-ops` doesn't install, load, or pass
`/stack-ops doctor`. Most issues come from missing local tools, a shell `PATH`
that Pi can't see, or running the extension outside the repository you want to
manage.

## Start with doctor

The fastest way to find setup problems is to run the doctor command from the
project repository where you want to use stacked PRs.

```text
/stack-ops doctor
```

If the standalone `stack-ops` command is available in your shell, you can run
the same check there.

```bash
stack-ops doctor
```

Doctor checks for the local artifact directory, `state.json`, `stax`, `gh`,
`git`, and `semble`. `semble` is optional, so a warning for `semble` doesn't
block the core workflow.

## Common problems on all platforms

These issues can happen on macOS, Linux, Windows, and WSL.

### Pi doesn't recognize `/stack-ops`

If Pi reports that `/stack-ops` is unknown, the package probably isn't installed
in the Pi environment that you're currently running.

1. Install the package again from inside Pi.

   ```bash
   pi install npm:pi-stack-ops
   ```

2. Restart Pi so it reloads installed package extensions.
3. Run `/stack-ops doctor` from the repository where you want to work.

### Doctor reports missing `stax`, `gh`, or `git`

`pi-stack-ops` calls local CLIs for stack and PR operations. The tools must be
installed and visible on the `PATH` used by Pi.

- Install [Git](https://git-scm.com).
- Install [GitHub CLI](https://cli.github.com), then run `gh auth login`.
- Install [stax](https://github.com/cesarferreira/stax), then verify
  `stax --version`.
- Restart your terminal, editor, or Pi session after changing `PATH`.

If a command works in one terminal but doctor still reports it missing, start Pi
from the same terminal where the command works. GUI apps often inherit a smaller
or older environment than your interactive shell.

### `/stack-ops init` creates files in the wrong place

`pi-stack-ops` stores runtime files under `.pi/stack-ops/` relative to the
current working directory. Start Pi from the repository root before you run
workflow commands.

```bash
cd path/to/your/repository
pi
```

If you initialized the wrong directory, remove the misplaced `.pi/stack-ops/`
directory only after confirming it doesn't contain state you need.

### GitHub operations fail after doctor passes

Doctor only checks whether `gh` exists. It doesn't prove that GitHub auth or
repository permissions are ready.

Run these commands in the same shell you use for Pi:

```bash
gh auth status
gh repo view
```

If either command fails, run `gh auth login` and confirm that your account can
read and write pull requests in the target repository.

### Stack commands fail in a new repository

`stax` needs to know the repository and trunk branch it works with. If stack
commands fail, initialize or repair stax in the repository first.

```bash
stax doctor --fix
```

You can also follow the stax setup guide for your repository if doctor reports a
trunk, remote, or authentication problem.

## macOS problems

macOS setup issues usually come from missing Homebrew tools or a `PATH` mismatch
between Terminal, your editor, and Pi.

### Homebrew tools aren't visible to Pi

Apple Silicon Homebrew commonly installs tools under `/opt/homebrew/bin`, while
Intel Homebrew commonly installs them under `/usr/local/bin`. Confirm that the
directory for your machine is on `PATH`.

```bash
echo $PATH
which stax
which gh
which git
```

If `which` can't find a tool, add the correct Homebrew shell environment to your
shell profile and restart Pi.

```bash
eval "$(brew shellenv)"
```

For a persistent fix, follow the command printed by `brew shellenv` for your
shell.

### Command line developer tools are missing

Some Git operations require Apple's command line developer tools. If `git` or
build tooling fails with an `xcrun` or developer tools error, install them.

```bash
xcode-select --install
```

After installation finishes, open a new terminal and run `/stack-ops doctor`
again.

## Linux problems

Linux setup issues usually come from package names, missing permissions, or a
user-local binary directory that isn't on `PATH`.

### User-local installs aren't on `PATH`

Some stax install methods place binaries in `~/.local/bin`. Confirm that your
shell and Pi can see that directory.

```bash
echo $PATH
ls ~/.local/bin/stax
```

If needed, add it to your shell profile and restart Pi.

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### GitHub CLI isn't installed from your package manager

Install GitHub CLI using the method for your distribution, then authenticate.

```bash
gh auth login
```

If `gh` is installed through Snap, Flatpak, or another sandboxed package system,
confirm that it can access your repository directory and Git credentials.

### File permissions block installed CLIs

Doctor checks whether commands are executable. If you installed a prebuilt
binary manually, confirm that it has execute permission.

```bash
chmod +x ~/.local/bin/stax ~/.local/bin/st
```

Then open a new terminal and run `/stack-ops doctor` again.

## Windows problems

Windows works best when Pi, Git, GitHub CLI, stax, and the repository all run in
the same environment. If you mix PowerShell, Git Bash, WSL, and GUI-launched
apps, each environment may have a different `PATH` and different credentials.

### Native Windows tools aren't on `PATH`

Install the required CLIs, then open a new PowerShell session and verify them.

```powershell
git --version
gh --version
stax --version
```

If PowerShell can't find a command, add the directory that contains the
executable to your user `Path`, then restart PowerShell and Pi.

### PowerShell blocks scripts or local commands

If PowerShell reports that scripts are disabled, change the policy for your user
account, then restart the shell.

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Use your organization's approved policy if your machine is managed.

### WSL and Windows credentials don't match

WSL has its own Linux filesystem, `PATH`, Git config, and GitHub CLI auth. If
you run Pi in WSL, install and authenticate the tools inside WSL too.

```bash
git --version
gh auth login
stax --version
```

Keep the repository inside the same environment where you run Pi. For WSL, a
path under your Linux home directory is usually more reliable than a mounted
Windows path for Git-heavy workflows.

### stax Windows limitations affect shell integration

stax supports Windows, but some shell integration features are Unix-specific.
If a stax worktree command prints a path instead of changing directories, run
`cd` to that path manually. For tmux-based workflows, use WSL or another
Unix-like environment.

## Reset local stack-ops state

Use cleanup only when you want to remove generated runtime artifacts. This
doesn't uninstall the Pi package.

To remove logs only, run:

```text
/stack-ops clean
```

To remove all local stack-ops artifacts for the current repository, run:

```text
/stack-ops clean --all
```

The full cleanup removes `.pi/stack-ops/`, including active state, plans,
summaries, validation evidence, blockers, snapshots, logs, and PR body drafts.

## Next steps

After fixing the reported issue, run `/stack-ops doctor` again. When doctor
passes for required tools, run `/stack-ops init`, then continue with `/draft` in
the target repository.
