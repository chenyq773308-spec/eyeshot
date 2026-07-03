# EYESHOT deployment notes

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
