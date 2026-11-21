# Geetha's birthday site

Files: `index.html` (site), `admin.html` (served at `/admin`), `api/` (login + responses), `vercel.json`.

## Logins
- Geetha: `geetha` / `geetha123` (change with env vars `GEETHA_USER`, `GEETHA_PASS`)
- Admin (you): `varun` / `geethavarun123` at `https://YOUR-SITE.vercel.app/admin` (env vars `ADMIN_USER`, `ADMIN_PASS`)
- Also set `AUTH_SECRET` to any long random string.

## Save responses (one-time)
1. Vercel project > Storage > Create > Upstash Redis (Marketplace) > connect to this project.
2. Redeploy. Responses then show up at `/admin`. They also always appear in Vercel > Logs ("GEETHA RESPONSE").
