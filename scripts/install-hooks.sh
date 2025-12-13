#!/usr/bin/env bash
set -e
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.githooks"

mkdir -p "$HOOKS_DIR"

# Copy the provided pre-push script
cp "$REPO_ROOT/scripts/pre-push" "$HOOKS_DIR/pre-push"
chmod +x "$HOOKS_DIR/pre-push"

# Set the local git config value to use the repo hooks directory.
# This is local repo config only; does not affect other clones.
cd "$REPO_ROOT"
git config core.hooksPath "$HOOKS_DIR"

cat <<EOF
Installed git hooks into $HOOKS_DIR
To revert: git config --unset core.hooksPath
EOF
