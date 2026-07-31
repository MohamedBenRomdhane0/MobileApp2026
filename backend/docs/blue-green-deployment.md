# Blue-Green Deployment — Backend + Two Frontends

This document describes the production topology and zero-downtime deployment
workflow for the Abajim stack, including the newly added **frontend-parent**
React/Vite SPA served on **port 2060**.

---

## 1. Topology

```
                        ┌──────────────────────────────────────────┐
Browser ── :80   ─────▶ │  nginx (container: nginx)                 │
                        │   • server :80   → main SPA + Laravel API │──▶ php_backend
Browser ── :2060 ─────▶ │   • server :2060 → proxy frontend_parent  │      (app_blue|green:9000)
                        └──────────────────────────────────────────┘
                                          │ proxy_pass
                                          ▼
                        frontend_parent_blue | frontend_parent_green  (nginx serving Vite dist)
```

- **Main frontend** (`~/frontend`, `abajim-front-v2`) → built `dist/` mounted into nginx, served on **:80**.
- **Parent frontend** (`~/frontend-parent`, `abajim-frontend-parent`) → built into its own image, served on **:2060** via blue-green containers.
- **Both SPAs call the same Laravel API** (`/api`, `/sanctum`, `/broadcasting`) through the port-80 nginx → PHP-FPM → `app_blue|green`. There is only ever **one shared API/Laravel backend**.

### Server folder layout
```
~/backend          = abajim-v2              (compose file + scripts live here)
~/frontend         = abajim-front-v2        (main SPA → :80)
~/frontend-parent  = abajim-frontend-parent (parent SPA → :2060)
```

---

## 2. Container & port map

| Container | Role | Host port | Internal |
|-----------|------|-----------|----------|
| `nginx` | Reverse proxy / SPA server | `80`, `2060` | 80, 2060 |
| `app_blue` / `app_green` | Laravel PHP-FPM (blue-green) | — | 9000 |
| `queue_blue` / `queue_green` | Laravel queue workers | — | — |
| `frontend_parent_blue` / `frontend_parent_green` | Parent SPA (blue-green) | — | 80 |
| `scheduler` | Laravel scheduler | — | — |
| `db` | MySQL 5.7 | `3306` | 3306 |
| `redis` | Redis | `6379` | 6379 |
| `phpmyadmin` | DB admin | `6090` | 80 |

---

## 3. How traffic is switched (blue-green)

State is tracked in `~/backend/.deployment-state` (`blue` or `green`). Two
dynamic nginx upstream files decide which color is live:

| File | Controls | Upstream name |
|------|----------|---------------|
| `nginx/upstream.conf` | Laravel API backend | `php_backend` |
| `nginx/frontend-parent-upstream.conf` | Parent SPA | `frontend_parent_backend` |

Both are rewritten by the deploy/rollback scripts and `nginx -s reload`'d, so
the switch is atomic with no dropped connections. The backend and the
frontend-parent are switched to the **same color** in lockstep each deploy.

---

## 4. First-time setup (one-off, on the server)

`Dockerfile`, `.dockerignore`, and `docker-nginx.conf` are now **tracked in git**
and pulled normally. Only `.env` is gitignored and must be created manually
**once** in `~/frontend-parent` (it persists across future pulls).

### 4.1 `~/frontend-parent/.env`
```dotenv
VITE_API_ENDPOINT=http://102.204.206.251/api
VITE_HASH_KEY=<same as main frontend>
VITE_MEDIA_BASE_URL=http://102.204.206.251/storage
VITE_MEDIA_S3_BUCKET=<s3 bucket name, if used>
VITE_S3_BUCKET_URL=<s3 bucket url, if used>
VITE_PUSHER_KEY=<pusher/reverb app key>
VITE_PUSHER_CLUSTER=<cluster>
VITE_PUSHER_HOST=102.204.206.251
VITE_PUSHER_PORT=443
VITE_PUSHER_SCHEME=https
VITE_API_BROEADCATING_URL=http://102.204.206.251/broadcasting/auth
```
> ⚠️ Vite bakes `VITE_*` values into the bundle at **build time**. This file
> must exist before the image is built. Copy real values from `~/frontend/.env`.

### 4.2 Docker build files (tracked — no manual step)
`Dockerfile`, `.dockerignore`, and `docker-nginx.conf` live in the
`abajim-frontend-parent` repo and are pulled automatically. The build uses a
multi-stage image:
- **Stage 1** `node:22-alpine` → `yarn install --frozen-lockfile` + `yarn build`
  (Node 22 is required; some deps such as `camera-controls` need engine `>=22`).
- **Stage 2** `nginx:alpine` → serves `/dist` with SPA fallback via `docker-nginx.conf`.

### 4.3 Open the firewall port
```bash
sudo ufw allow 2060/tcp
```

---

## 5. Deploy (zero-downtime)

```bash
cd ~/backend
./scripts/deploy-zero-downtime.sh
```

What it does (relevant new steps in **bold**):
1. `git pull` backend, main frontend, **and frontend-parent**
2. Build main frontend `dist/`
3. Determine active/inactive color
4. Build inactive `app_<color>` **and `frontend_parent_<color>` images**
5. Start inactive `app_`, `queue_`, **and `frontend_parent_`** containers
6. Wait for health (backend **and frontend-parent**)
7. Run migrations + rebuild Laravel caches
8. Test the app
9. Switch `php_backend` upstream → reload nginx
10. **Switch `frontend_parent_backend` upstream → reload nginx**
11. Save new state, stop old `app_`, `queue_`, **and `frontend_parent_`** containers
12. Prune old images

If any health check fails, the script aborts and the previous color keeps
serving traffic on both ports.

---

## 6. Rollback

```bash
cd ~/backend
./scripts/rollback.sh
```
Restarts the previous color's `app_`, `queue_`, **and `frontend_parent_`**
containers, switches both upstreams back, reloads nginx, and stops the bad color.

---

## 7. First start (cold boot)

```bash
cd ~/backend
docker compose -f docker-compose.blue-green.yml up -d
```
This brings up `db`, `redis`, `app_blue`, `queue_blue`, `frontend_parent_blue`,
`scheduler`, `nginx`, and `phpmyadmin`. Defaults match the initial
`nginx/upstream.conf` and `nginx/frontend-parent-upstream.conf` (both point to
**blue**).

---

## 8. CORS

`nginx/conf.d/blue-green.conf` uses a `$cors_allow_origin` map that echoes the
request `Origin` only when it matches an allow-list. Both origins are allowed:
- `http://102.204.206.251` (main frontend)
- `http://102.204.206.251:2060` (parent frontend)

Add more origins (e.g. real domains) to that `map` block as needed, then reload nginx.

---

## 9. Troubleshooting

| Symptom | Check |
|---------|-------|
| `:2060` returns 502 | Is `frontend_parent_<active>` running & healthy? `docker ps` |
| Parent SPA can't reach API | `VITE_API_ENDPOINT` baked correctly? Rebuild image after `.env` change |
| CORS error in parent SPA | Origin in the `map` block in `blue-green.conf`? |
| Build has empty env vars | `.env` missing in `~/frontend-parent` at build time |
| `nginx -t` fails after switch | Inspect `nginx/frontend-parent-upstream.conf` syntax |
