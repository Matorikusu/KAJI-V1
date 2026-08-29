#!/bin/sh
set -eu
cd /workspace
# :8081 is QA-only — a revive must never inherit a stale built-output preview.
# Called directly, not via npm: no node_modules needed, so nothing to wait for.
node scripts/preview.mjs stop || true
if ! curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8787/health; then
  node scripts/kaji-compile-server.mjs >>/tmp/kaji-compile.log 2>&1 &
fi
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
