#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DOCKER_USER:-}" ]; then
  echo "Set DOCKER_USER to your Docker Hub username first, e.g.:"
  echo "  export DOCKER_USER=your-name"
  exit 1
fi

services=(
  "auth"
  "products"
  "orders"
  "payments"
  "cart"
  "notifications"
  "uploads"
  "gateway"
)

for svc in "${services[@]}"; do
  image="$DOCKER_USER/mercado-$svc:latest"
  echo "=== Building $image ==="
  docker build -t "$image" -f "apps/$svc/Dockerfile" .
  echo "=== Pushing $image ==="
  docker push "$image"
done