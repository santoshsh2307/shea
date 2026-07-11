#!/usr/bin/env bash
set -euo pipefail

# start.sh - entrypoint used by Railpack and simple deployments
# Tries docker-compose first, then docker image builds, then local run

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Starting from ${ROOT_DIR}"

if command -v docker-compose >/dev/null 2>&1 && [ -f "${ROOT_DIR}/docker-compose.yml" ]; then
  echo "Using docker-compose to build and start services"
  docker-compose -f "${ROOT_DIR}/docker-compose.yml" up -d --build
  exit 0
fi

if command -v docker >/dev/null 2>&1; then
  echo "Docker available. Building images if Dockerfiles are present..."
  if [ -f "${ROOT_DIR}/Dockerfile.backend" ] && [ -d "${ROOT_DIR}/enterprise-backend" ]; then
    docker build -f "${ROOT_DIR}/Dockerfile.backend" -t shea-backend "${ROOT_DIR}"
  fi
  if [ -f "${ROOT_DIR}/Dockerfile.frontend" ] && [ -d "${ROOT_DIR}/enterprise-ui" ]; then
    docker build -f "${ROOT_DIR}/Dockerfile.frontend" -t shea-frontend "${ROOT_DIR}"
  fi
  # Run containers with default ports
  docker run -d --rm --name shea-backend -p 8080:8080 shea-backend || true
  docker run -d --rm --name shea-frontend -p 3000:3000 shea-frontend || true
  exit 0
fi

echo "Docker not available; attempting local start (Maven and npm required)"
if [ -d "${ROOT_DIR}/enterprise-backend" ]; then
  (cd "${ROOT_DIR}/enterprise-backend" && mvn -DskipTests spring-boot:run &) 
fi
if [ -d "${ROOT_DIR}/enterprise-ui" ]; then
  (cd "${ROOT_DIR}/enterprise-ui" && REACT_APP_API_URL=http://localhost:8080 npm start &)
fi

wait
