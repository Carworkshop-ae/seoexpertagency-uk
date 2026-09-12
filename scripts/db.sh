#!/usr/bin/env bash
# Target-aware Supabase migration runner.
#
#   ./scripts/db.sh <staging|production> <push|diff|status|dump>
#
# Connection strings live in .env.migrate (gitignored) — see .env.migrate.example.
# Production is guarded: it requires typing the target name in full.
set -euo pipefail

cd "$(dirname "$0")/.."

TARGET="${1:-}"
ACTION="${2:-}"

usage() {
  echo "usage: ./scripts/db.sh <staging|production> <push|diff|status|dump>" >&2
  exit 64
}

[ -n "$TARGET" ] && [ -n "$ACTION" ] || usage

case "$TARGET" in staging|production) ;; *) usage ;; esac
case "$ACTION" in push|diff|status|dump) ;; *) usage ;; esac

if [ ! -f .env.migrate ]; then
  echo "error: .env.migrate not found." >&2
  echo "       cp .env.migrate.example .env.migrate  and fill in the connection strings." >&2
  exit 1
fi

# shellcheck disable=SC1091
set -a; . ./.env.migrate; set +a

case "$TARGET" in
  staging)
    DB_URL="${STAGING_DB_URL:-}"
    VAR_NAME=STAGING_DB_URL
    ;;
  production)
    DB_URL="${PRODUCTION_DB_URL:-}"
    VAR_NAME=PRODUCTION_DB_URL
    ;;
esac

if [ -z "$DB_URL" ]; then
  echo "error: $VAR_NAME is not set in .env.migrate" >&2
  exit 1
fi

# Anything that writes to production needs a deliberate, typed confirmation.
if [ "$TARGET" = production ] && [ "$ACTION" = push ]; then
  echo
  echo "  You are about to apply migrations to PRODUCTION."
  echo "  Host: $(printf '%s' "$DB_URL" | sed -E 's#.*@([^/?]+).*#\1#')"
  echo
  printf "  Type 'production' to continue: "
  read -r reply
  if [ "$reply" != "production" ]; then
    echo "  Aborted." >&2
    exit 1
  fi
fi

echo "==> supabase db $ACTION  (target: $TARGET)"

case "$ACTION" in
  push)
    npx --yes supabase db push --db-url "$DB_URL"
    ;;
  diff)
    npx --yes supabase db diff --db-url "$DB_URL"
    ;;
  status)
    npx --yes supabase migration list --db-url "$DB_URL"
    ;;
  dump)
    out="supabase/dumps/${TARGET}-$(date -u +%Y%m%dT%H%M%SZ).sql"
    mkdir -p supabase/dumps
    npx --yes supabase db dump --db-url "$DB_URL" -f "$out"
    echo "==> wrote $out"
    ;;
esac
