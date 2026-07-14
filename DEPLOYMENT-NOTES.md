# EYESHOT deployment notes

## 2026-07-14 deployment acceleration pass

This pass turns the previously manual production route into a repeatable fast path.

### Recent deployment recap

- 2026-07-03: confirmed the active Vercel auto-deploy project is `eyeshot.xyz`, not the older `eyeshot.art` project. The working production action was to point the `eyeshot.art` alias to the latest READY deployment from `eyeshot.xyz`.
- 2026-07-13: confirmed that the saved Open Design Vercel token plus the REST API is more reliable than the local Vercel CLI login state. The route worked, but still required manual Git tree alignment and manual alias inspection.
- 2026-07-14: confirmed the current OD workspace had no persistent Git checkout. Re-cloning the GitHub repo was slow because the static site contains many large assets. The production alias reached deployment `dpl_CJpiW9uW2vJ83EVJhasSqJoarLh9` for GitHub commit `985bd41a18c44d94fed91c262869bc8eef273759`.

### Root causes of slow deployment

- The deployable source lived in `release-eyeshot/`, but the GitHub deployment workspace was recreated in temporary folders.
- Full or shallow Git clones still had to negotiate a large static asset tree.
- The Vercel CLI login state was unreliable in Open Design; the successful path was the Vercel REST API token in `~/.open-design/vercel.json`.
- Screenshot capture is still environment-dependent. Treat screenshot failure as a rendering-tool limitation only after HTTP, DNS, content markers, CSS, and asset checks pass.

### New standard fast path

Use the fixed deploy workspace inside the current OD project:

```text
deploy/eyeshot-github
```

Run:

```bash
release-eyeshot/scripts/deploy-production.sh "Deploy latest EYESHOT site"
```

The script:

1. Builds `release-eyeshot/`.
2. Initializes or reuses `deploy/eyeshot-github` without downloading the full remote asset tree.
3. Fetches only the remote `main` head as the parent commit.
4. Syncs the current OD release package into the deploy workspace.
5. Creates and pushes a GitHub commit to `chenyq773308-spec/eyeshot`.
6. Polls Vercel project `eyeshot.xyz` for a READY deployment.
7. Writes the production alias `eyeshot.art`.
8. Verifies DNS, homepage markers, project detail CSS, and live HTML content.

### Why this should be faster next time

- No temporary clone is needed.
- No Vercel CLI auth path is needed.
- The Git commit is created from the current OD release tree and parented on remote `main`.
- Deployment validation is a fixed checklist instead of a sequence of ad-hoc retries.

## 2026-07-13 production deployment

This run repeated the successful split-project path and confirmed the current Open Design release is live on `https://eyeshot.art`.

### Outcome

- Production domain: `https://eyeshot.art`
- Final status: HTTP `200`
- Release package: `release-eyeshot/`
- GitHub repositories now aligned on `main`:
  - `chenyq773308-spec/eyeshot`
  - `chenyq773308-spec/eyeshot.xyz`
- Source content commit: `c961d6e66a5098f9bb2f326f1d619b0fa3aa658a`
- Trigger commit: `4dd5a8e972a7f702f8633fe26a61de940701ce66`
- Active Vercel project: `eyeshot.xyz`
- Active Vercel project ID: `prj_FZC5xDQu5C713Sqg2GmgzzilWl2u`
- READY deployment: `dpl_DKKUbFXgH5zKKpfXd8TdrTgZo9b8`
- Deployment URL: `https://eyeshot-hpss6nvny-sts-projects1.vercel.app`
- Production alias: `eyeshot.art`

### Path that worked

1. Sync the current Open Design files into `release-eyeshot/`.
2. Build locally with the Open Design Node path available:

```bash
PATH="/Users/chenyongqiang/.local/nodejs/bin:$PATH" npm run build
```

3. Commit the release package.
4. Push to `chenyq773308-spec/eyeshot`.
5. Ensure the Vercel-linked repository `chenyq773308-spec/eyeshot.xyz` also points at the same tree.
   When histories differ or a pure trigger is needed, create a non-force trigger commit parented on the current linked repo head:

```bash
remote_url="https://github.com/chenyq773308-spec/eyeshot.xyz.git"
git fetch "$remote_url" main
remote_head=$(git rev-parse FETCH_HEAD)
tree=$(git rev-parse HEAD^{tree})
new_commit=$(printf 'Trigger Vercel production deploy\n\nContent tree matches the latest release package.\n' | git commit-tree "$tree" -p "$remote_head")
git update-ref refs/heads/main "$new_commit"
git push origin main
git push "$remote_url" "${new_commit}:refs/heads/main"
```

6. List deployments on the active `eyeshot.xyz` Vercel project, not the old `eyeshot.art` project:

```bash
token=$(python3 - <<'PY'
import json, os
print(json.load(open(os.path.expanduser('~/.open-design/vercel.json'))).get('token',''))
PY
)

curl -fsS -H "Authorization: Bearer $token" \
  "https://api.vercel.com/v6/deployments?projectId=eyeshot.xyz&teamId=team_VwnzYYHnljU6gVjznYTtMNWV&limit=10"
```

7. Alias the latest READY deployment to production:

```bash
curl -fsS -X POST \
  -H "Authorization: Bearer $token" \
  -H 'Content-Type: application/json' \
  "https://api.vercel.com/v2/deployments/dpl_DKKUbFXgH5zKKpfXd8TdrTgZo9b8/aliases?teamId=team_VwnzYYHnljU6gVjznYTtMNWV" \
  -d '{"alias":"eyeshot.art"}'
```

8. Confirm alias lookup:

```bash
curl -fsS -H "Authorization: Bearer $token" \
  "https://api.vercel.com/v4/aliases/eyeshot.art?teamId=team_VwnzYYHnljU6gVjznYTtMNWV"
```

Expected alias result for this run: `eyeshot.art -> dpl_DKKUbFXgH5zKKpfXd8TdrTgZo9b8`, project `prj_FZC5xDQu5C713Sqg2GmgzzilWl2u`.

### Tooling notes

- The Vercel MCP deploy action was cancelled in this run, so the reliable route was the saved Open Design Vercel token plus the Vercel REST alias API.
- `/Users/chenyongqiang/.local/nodejs/bin/node` hung when invoked directly, but `"$OD_NODE_BIN"` could run the Vercel CLI enough to inspect version/help.
- `/Users/chenyongqiang/Library/Application Support/com.vercel.cli/auth.json` was expired/invalid; do not rely on it for production deployment.
- The working token source was `~/.open-design/vercel.json`.
- Use `"${new_commit}:refs/heads/main"` in zsh. Without braces, zsh can misparse `变量:refs`.

### Public verification

DNS:

- `eyeshot.art` local resolver: `76.76.21.21`
- `www.eyeshot.art` CNAME: `cname.vercel-dns.com.`

HTTP:

- `https://eyeshot.art/`: HTTP `200`
- `https://eyeshot.art/solutions/facade/index.html`: HTTP `200`
- `https://eyeshot.art/solutions/landscape/index.html`: HTTP `200`

Content markers:

- Homepage matched `assets/img/applications/public-space/luxury-flagship-light.png`.
- CSS matched `.solution-visual-lead` and `.visual-modules`.
- Facade solution matched `GSG 精研组合构造` inside `.visual-modules`.
- Landscape solution matched `.solution-visual-lead rev` and `展墙界面`.

Static assets returned HTTP `200`:

- `https://eyeshot.art/assets/style.css`
- `https://eyeshot.art/assets/img/applications/public-space/luxury-flagship-light.png`
- `https://eyeshot.art/assets/img/projects/gsg-composite-facade.png`
- `https://eyeshot.art/assets/img/projects/poly-yuncheng-2.jpg`

Screenshot evidence:

- `output/verify-deploy/live-home-2026-07-13-thum.png`
- `output/verify-deploy/live-facade-2026-07-13-thum.png`

## 2026-07-03 production deployment

This note records the successful path for the current static multi-page EYESHOT site so the next iteration can repeat the same route without rediscovering the Vercel project split.

### Outcome

- Production domain: `https://eyeshot.art`
- Final status: HTTP `200`
- GitHub repository: `chenyq773308-spec/eyeshot`
- GitHub commit: `1e8dfe3ebb218daafa15b0a956dc3c38ad47c48d`
- Commit message: `Deploy current EYESHOT static site`
- Vercel team: `sts-projects1`
- Vercel team ID: `team_VwnzYYHnljU6gVjznYTtMNWV`
- Active Vercel project: `eyeshot.xyz`
- Active Vercel project ID: `prj_FZC5xDQu5C713Sqg2GmgzzilWl2u`
- Deployment ID: `dpl_CSszH8MSKakUXGvYmnBt8joUQafi`
- Deployment URL: `https://eyeshot-ish3ncojg-sts-projects1.vercel.app`
- Production alias: `eyeshot.art`

### Important finding

The latest GitHub auto-deployment appeared under Vercel project `eyeshot.xyz`, not the older fixed project `eyeshot.art`.

Do not rely only on the old project:

- Old project: `eyeshot.art`
- Old project ID: `prj_RKy8CJec4LW9U43mD7UTYUalFCpK`
- Old latest deployment during this run: `dpl_HwqmqfV12QUVArK57LjucZX6cib2`
- Old deployment commit: `f70faa9...`

The successful production fix was to alias `eyeshot.art` to the latest READY deployment from `eyeshot.xyz`.

### Build and release package

Release package: `release-eyeshot/`

Build command:

```bash
"$OD_NODE_BIN" scripts/build-static.mjs
```

Build verification:

- `HTML_FILES 67`
- `MISSING_REFS 0`
- Key files present:
  - `dist/index.html`
  - `dist/contact/index.html`
  - `dist/assets/style.css`
  - `dist/llms.txt`
  - `dist/sitemap.xml`
  - `dist/robots.txt`

Build/release support changes made in this iteration:

- `release-eyeshot/scripts/build-static.mjs` added.
- `release-eyeshot/package.json` build script changed to `node scripts/build-static.mjs`.
- `release-eyeshot/.gitignore` excludes `output/`, `*.artifact.json`, and `eyeshot-share-poster.html`.

### Vercel API path that worked

Use the Open Design saved Vercel token without printing it:

```bash
token=$(python3 - <<'PY'
import json
print(json.load(open('/Users/chenyongqiang/.open-design/vercel.json')).get('token',''))
PY
)
```

List deployments for the active auto-deploy project:

```bash
curl -sS -H "Authorization: Bearer $token" \
  "https://api.vercel.com/v6/deployments?projectId=eyeshot.xyz&teamId=team_VwnzYYHnljU6gVjznYTtMNWV&limit=5"
```

Alias the latest READY deployment to production:

```bash
curl -sS -X POST \
  -H "Authorization: Bearer $token" \
  -H 'Content-Type: application/json' \
  "https://api.vercel.com/v2/deployments/<deployment-id>/aliases?teamId=team_VwnzYYHnljU6gVjznYTtMNWV" \
  -d '{"alias":"eyeshot.art"}'
```

Confirm the alias:

```bash
curl -sS -H "Authorization: Bearer $token" \
  "https://api.vercel.com/v4/aliases/eyeshot.art?teamId=team_VwnzYYHnljU6gVjznYTtMNWV"
```

The alias response moved `eyeshot.art` away from old deployment `dpl_HwqmqfV12QUVArK57LjucZX6cib2` and subsequent lookup showed deployment `dpl_CSszH8MSKakUXGvYmnBt8joUQafi`.

### GitHub status check

```bash
curl -sS -H 'Accept: application/vnd.github+json' \
  https://api.github.com/repos/chenyq773308-spec/eyeshot/commits/<commit>/status
```

Successful signal observed:

```text
Vercel success https://vercel.com/sts-projects1/eyeshot.xyz/CSszH8MSKakUXGvYmnBt8joUQafi
```

### Public verification

DNS:

- `eyeshot.art` from local resolver: `76.76.21.21`
- `eyeshot.art` from `1.1.1.1`: `76.76.21.21`
- `eyeshot.art` from `8.8.8.8`: `76.76.21.21`
- `www.eyeshot.art` CNAME: `cname.vercel-dns.com.`

HTTP:

- `https://eyeshot.art`: HTTP `200`
- `Last-Modified`: `Fri, 03 Jul 2026 18:26:29 GMT`
- `content-length`: `14583`
- `x-vercel-cache`: `HIT` after first request

Content markers:

- Homepage matched `EYESHOT 颜界｜热熔天然石·透光石材空间解决方案`
- Contact page matched `发送样板申请`
- `llms.txt` matched `EYESHOT 颜界 (eyeshot.art)`
- `sitemap.xml` contained `58` URLs

Static assets returned HTTP `200`:

- `https://eyeshot.art/assets/style.css`
- `https://eyeshot.art/assets/eyeshot/logo-for-dark-bg.png`
- `https://eyeshot.art/assets/img/projects/the-reserve-sg-1.jpg`
- `https://eyeshot.art/downloads/wall-panel-2026.pdf`

### Known local tooling issue

Vercel CLI notes:

- CLI path the user pointed to: `/Users/chenyongqiang/.local/nodejs/bin/vercel`
- Node path: `/Users/chenyongqiang/.local/nodejs/bin/node`
- Node version: `v24.15.0`
- Vercel CLI under Node 24 failed with `The value of "err" is out of range. It must be a negative integer. Received 1`.
- Temporary Node 22 got further, but `/Users/chenyongqiang/Library/Application Support/com.vercel.cli/auth.json` was invalid or expired.
- The Open Design saved token at `/Users/chenyongqiang/.open-design/vercel.json` worked for API list and alias calls.

Open Design visual export note:

- Visual export failed with `desktop renderer unavailable: unknown desktop sidecar message: render-slides`.
- Treat this as a local OD renderer limitation, not a deployment failure, when HTTP/content/resource checks pass.
