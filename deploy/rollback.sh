#!/usr/bin/env bash
# Retour à la version précédente (à lancer sur le VPS avec l'utilisateur de déploiement).
# Usage : bash rollback.sh            -> version précédente
#         bash rollback.sh <dossier>  -> version précise (voir ls /var/www/s3k/releases)
set -euo pipefail
ROOT=/var/www/s3k
CUR=$(readlink -f "$ROOT/current")
if [ -n "${1:-}" ]; then TARGET="$ROOT/releases/$1"
else TARGET=$(ls -1d "$ROOT"/releases/2* | sort | grep -B1 -xF "$CUR" | head -n1); fi
[ -d "$TARGET" ] && [ "$TARGET" != "$CUR" ] || { echo "Pas de version précédente."; exit 1; }
ln -sfn "$TARGET" "$ROOT/current.tmp" && mv -Tf "$ROOT/current.tmp" "$ROOT/current"
echo "current -> $TARGET"
