#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
RELEASE="$ROOT/release-eyeshot"
DEPLOY_REPO="${EYESHOT_DEPLOY_REPO:-$ROOT/deploy/eyeshot-github}"
REMOTE_URL="${EYESHOT_REMOTE_URL:-https://github.com/chenyq773308-spec/eyeshot.git}"
TEAM_ID="${EYESHOT_VERCEL_TEAM_ID:-team_VwnzYYHnljU6gVjznYTtMNWV}"
PROJECT_ID="${EYESHOT_VERCEL_PROJECT_ID:-eyeshot.xyz}"
ALIAS_DOMAIN="${EYESHOT_ALIAS_DOMAIN:-eyeshot.art}"
TOKEN_FILE="${EYESHOT_VERCEL_TOKEN_FILE:-$HOME/.open-design/vercel.json}"
NODE_BIN_DIR="/Users/chenyongqiang/.local/nodejs/bin"
COMMIT_MESSAGE="${1:-Deploy latest EYESHOT site}"

die() {
  printf 'ERROR: %s\n' "$*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

json_token() {
  python3 - "$TOKEN_FILE" <<'PY'
import json, sys
path = sys.argv[1]
with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)
token = data.get("token", "")
if not token:
    raise SystemExit("missing token")
print(token)
PY
}

latest_ready_deployment() {
  python3 - "$1" "$2" <<'PY'
import json, sys
payload = json.load(open(sys.argv[1], "r", encoding="utf-8"))
commit = sys.argv[2]
for item in payload.get("deployments", []):
    meta = item.get("meta") or {}
    if item.get("state") == "READY" and meta.get("githubCommitSha") == commit:
        print(item.get("uid", ""))
        raise SystemExit(0)
PY
}

require_cmd git
require_cmd rsync
require_cmd curl
require_cmd python3
require_cmd rg

cd "$RELEASE"
PATH="$NODE_BIN_DIR:$PATH" npm run build

mkdir -p "$DEPLOY_REPO"
if [ ! -d "$DEPLOY_REPO/.git" ]; then
  git -C "$DEPLOY_REPO" init -b main
  git -C "$DEPLOY_REPO" remote add origin "$REMOTE_URL"
fi

git -C "$DEPLOY_REPO" fetch --depth=1 --filter=blob:none origin main
remote_head="$(git -C "$DEPLOY_REPO" rev-parse FETCH_HEAD)"

rsync -a --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'dist/' \
  --exclude 'output/' \
  --exclude '.npm-cache/' \
  --exclude '*.artifact.json' \
  "$RELEASE/" "$DEPLOY_REPO/"

git -C "$DEPLOY_REPO" add -A
tree="$(git -C "$DEPLOY_REPO" write-tree)"

if git -C "$DEPLOY_REPO" diff --cached --quiet && [ "$(git -C "$DEPLOY_REPO" rev-parse --verify refs/heads/main 2>/dev/null || true)" = "$remote_head" ]; then
  commit="$remote_head"
  printf 'GitHub already matches the prepared source tree: %s\n' "$commit"
else
  commit="$(printf '%s\n\nGenerated from Open Design release-eyeshot.\n' "$COMMIT_MESSAGE" | git -C "$DEPLOY_REPO" commit-tree "$tree" -p "$remote_head")"
  git -C "$DEPLOY_REPO" update-ref refs/heads/main "$commit"
  git -C "$DEPLOY_REPO" push origin "refs/heads/main:refs/heads/main"
fi

remote_after="$(git -C "$DEPLOY_REPO" ls-remote origin refs/heads/main | awk '{print $1}')"
[ "$remote_after" = "$commit" ] || die "GitHub main is $remote_after, expected $commit"
printf 'GitHub main: %s\n' "$commit"

[ -f "$TOKEN_FILE" ] || die "Vercel token file not found: $TOKEN_FILE"
token="$(json_token)"

deploy_json="$ROOT/output/deploy-production/latest-deployments.json"
mkdir -p "$(dirname "$deploy_json")"

deployment_id=""
for _ in $(seq 1 36); do
  curl -fsS -H "Authorization: Bearer $token" \
    "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&teamId=$TEAM_ID&limit=10" \
    > "$deploy_json"
  deployment_id="$(latest_ready_deployment "$deploy_json" "$commit" || true)"
  [ -n "$deployment_id" ] && break
  sleep 10
done

[ -n "$deployment_id" ] || die "No READY deployment found for commit $commit in project $PROJECT_ID"
printf 'Vercel READY deployment: %s\n' "$deployment_id"

curl -fsS -X POST \
  -H "Authorization: Bearer $token" \
  -H 'Content-Type: application/json' \
  "https://api.vercel.com/v2/deployments/$deployment_id/aliases?teamId=$TEAM_ID" \
  -d "{\"alias\":\"$ALIAS_DOMAIN\"}" \
  > "$ROOT/output/deploy-production/alias-response.json"

curl -fsS -H "Authorization: Bearer $token" \
  "https://api.vercel.com/v4/aliases/$ALIAS_DOMAIN?teamId=$TEAM_ID" \
  > "$ROOT/output/deploy-production/alias-inspect.json"

home_html="$ROOT/output/deploy-production/live-home.html"
style_css="$ROOT/output/deploy-production/live-style.css"
project_html="$ROOT/output/deploy-production/live-crland-beijing.html"

curl -fsSL "https://$ALIAS_DOMAIN/" > "$home_html"
curl -fsSL "https://$ALIAS_DOMAIN/assets/style.css" > "$style_css"
curl -fsSL "https://$ALIAS_DOMAIN/projects/crland-beijing/index.html" > "$project_html"

rg -q 'EYESHOT 颜界' "$home_html"
rg -q '透 以 颜 · 臻 于 界' "$home_html"
rg -q 'hero-project-detail' "$project_html"
rg -q 'min-height: 280px' "$style_css"

{
  printf 'commit=%s\n' "$commit"
  printf 'deployment=%s\n' "$deployment_id"
  printf 'alias=%s\n' "$ALIAS_DOMAIN"
  printf 'dns_local=%s\n' "$(dig +short "$ALIAS_DOMAIN" | tr '\n' ' ')"
  printf 'dns_1_1_1_1=%s\n' "$(dig @1.1.1.1 +short "$ALIAS_DOMAIN" | tr '\n' ' ')"
  printf 'dns_8_8_8_8=%s\n' "$(dig @8.8.8.8 +short "$ALIAS_DOMAIN" | tr '\n' ' ')"
} > "$ROOT/output/deploy-production/verification.txt"

cat "$ROOT/output/deploy-production/verification.txt"
