#!/usr/bin/env bash
# Prépare le VPS pour héberger « Strasbourg n'est pas à vendre » À CÔTÉ du projet existant.
# Ne touche pas au site existant : ajoute un fichier Caddy séparé + une ligne d'import si absente.
# Usage (en root) :  bash setup-vps.sh <domaine> [utilisateur] [cle_publique.pub]
#   ex. bash setup-vps.sh strasbourg3000.duckdns.org s3k-deploy /root/s3k_deploy.pub
#   Pour réutiliser l'utilisateur de déploiement existant : passe son nom en 2e argument, sans clé.
set -euo pipefail

DOMAIN="${1:?Domaine manquant (ex. strasbourg3000.duckdns.org)}"
DEPLOY_USER="${2:-s3k-deploy}"
PUBKEY="${3:-}"
ROOT=/var/www/s3k
CADDYFILE=/etc/caddy/Caddyfile
SITES=/etc/caddy/sites

[ "$(id -u)" -eq 0 ] || { echo "À lancer en root"; exit 1; }

echo "== 1. Paquets"
apt-get update -qq && apt-get install -y -qq rsync >/dev/null

echo "== 2. Utilisateur de déploiement : $DEPLOY_USER"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  useradd --create-home --shell /bin/bash "$DEPLOY_USER"   # pas de sudo
fi
if [ -n "$PUBKEY" ]; then
  H=$(getent passwd "$DEPLOY_USER" | cut -d: -f6)
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$H/.ssh"
  touch "$H/.ssh/authorized_keys"
  grep -qxF "$(cat "$PUBKEY")" "$H/.ssh/authorized_keys" || cat "$PUBKEY" >> "$H/.ssh/authorized_keys"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$H/.ssh/authorized_keys"; chmod 600 "$H/.ssh/authorized_keys"
fi

echo "== 3. Dossiers du jeu : $ROOT"
install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$ROOT" "$ROOT/releases"
if [ ! -e "$ROOT/current" ]; then
  install -d -m 755 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$ROOT/releases/init"
  echo '<!doctype html><meta charset="utf-8"><title>S3K</title><p>Strasbourg n'"'"'est pas à vendre : premier déploiement en attente.</p>' \
    > "$ROOT/releases/init/index.html"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$ROOT/releases/init/index.html"
  ln -sfn "$ROOT/releases/init" "$ROOT/current"; chown -h "$DEPLOY_USER:$DEPLOY_USER" "$ROOT/current"
fi

echo "== 4. Caddy : site $DOMAIN (fichier séparé)"
install -d -m 755 "$SITES"
cat > "$SITES/s3k.caddy" <<EOF
# Strasbourg n'est pas à vendre — généré par setup-vps.sh
$DOMAIN {
	root * $ROOT/current
	encode zstd gzip
	file_server
	header /index.html Cache-Control "no-cache"
	header /assets/* Cache-Control "public, max-age=31536000, immutable"
}
EOF

BACKUP="$CADDYFILE.bak.$(date +%Y%m%d%H%M%S)"
cp "$CADDYFILE" "$BACKUP"
grep -qE '^\s*import\s+(/etc/caddy/)?sites/\*' "$CADDYFILE" || printf '\nimport %s/*.caddy\n' "$SITES" >> "$CADDYFILE"

# Config valide ET domaine bien présent dans la config adaptée (sinon l'import n'est pas pris en compte).
# grep sans -q : il lit toute la sortie, pas de SIGPIPE sur caddy adapt avec pipefail.
if caddy validate --config "$CADDYFILE" --adapter caddyfile >/dev/null 2>&1 \
   && caddy adapt --config "$CADDYFILE" --adapter caddyfile 2>/dev/null | grep -F "$DOMAIN" >/dev/null; then
  systemctl reload caddy
  echo "OK : Caddy rechargé (sauvegarde : $BACKUP)"
else
  echo "ERREUR de config Caddy : restauration de l'ancienne config, rien n'a changé."
  cp "$BACKUP" "$CADDYFILE"; rm -f "$SITES/s3k.caddy"
  caddy validate --config "$CADDYFILE" --adapter caddyfile || true
  exit 1
fi

echo
echo "Terminé. Vérifie : https://$DOMAIN (page d'attente, certificat HTTPS en ~30 s)."
echo "Secret GitHub SSH_USER = $DEPLOY_USER"
