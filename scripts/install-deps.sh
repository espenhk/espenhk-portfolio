#!/usr/bin/env bash
# Install dependencies with bun, outside Lovable's sandbox.
#
# bun.lock is written by Lovable and points package tarballs at Lovable's private npm cache
# (europe-west*-npm.pkg.dev/lovable-core-prod/...), which CI and Claude Code sessions cannot reach.
# We point those URLs at registry.npmjs.org for the install only (same packages: bun still checks
# every tarball against the lockfile's integrity hash) and put bun.lock back afterwards,
# so Lovable's lockfile is never changed in git.
set -euo pipefail
cd "$(dirname "$0")/.."

backup="$(mktemp)"
cp bun.lock "$backup"
trap 'cp "$backup" bun.lock; rm -f "$backup"' EXIT

sed -i.bak -E 's#https://europe-west[0-9]+-npm\.pkg\.dev/[^/"]+/[^/"]+/((@[^/"]+/)?[^/"]+/-/[^"]+\.tgz)#https://registry.npmjs.org/\1#g' bun.lock
rm -f bun.lock.bak

bun install --frozen-lockfile "$@"
