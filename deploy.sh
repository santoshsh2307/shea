#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$ROOT_DIR/enterprise-ui"

usage() {
  cat <<'EOF'
Usage:
  ./deploy.sh build
  ./deploy.sh railway

Commands:
  build     Run the frontend production build locally.
  railway   Deploy the frontend through Railway using interactive login/link.
EOF
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

build_frontend() {
  require_command npm
  npm --prefix "$APP_DIR" run build
}

deploy_railway() {
  require_command railway

  if [ -n "${RAILWAY_API_KEY:-}" ]; then
    railway login --apiKey "$RAILWAY_API_KEY"
  else
    railway login
  fi

  if [ -n "${RAILWAY_PROJECT_ID:-}" ] && [ -n "${RAILWAY_SERVICE_ID:-}" ]; then
    railway link --project "$RAILWAY_PROJECT_ID" --service "$RAILWAY_SERVICE_ID"
  else
    railway link
  fi

  railway up --detach --yes
}

main() {
  case "${1:-}" in
    build)
      build_frontend
      ;;
    railway)
      build_frontend
      deploy_railway
      ;;
    -h|--help|help|"")
      usage
      ;;
    *)
      echo "Unknown command: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
}

main "$@"