# SEO Expert Agency — Production Deployment Guide

This guide takes a fresh machine to a running production site at `https://seoexpertagency.com`.
Follow the steps in order. Every command is copy-pasteable. The Next.js app lives at the repo
root — no custom Root Directory setting is needed in Vercel.

---

## Prerequisites

- **Node.js 20.9+ — 22.14.0 recommended** — `node -v`. The version is pinned in `.nvmrc`;
  run `nvm use` to match it. Next.js 16 requires `>=20.9.0` and will not install on Node 18.
  Set the Vercel project's Node version to **22.x** so it matches CI and local.
- **pnpm 9.15.4** — `corepack enable` (the version is pinned via `packageManager` in
  `package.json`; `pnpm-lock.yaml` is committed)
- **psql** — required only for the optional seed step in §1.5 (`brew install libpq`)
- **Git** access to the repository
- **Accounts:** [Supabase](https://supabase.com), [Vercel](https://vercel.com),
  [Resend](https://resend.com), [Upstash](https://upstash.com) (optional),
  [Sentry](https://sentry.io) (recommended), Google Analytics (optional)
- **Domain:** `seoexpertagency.com` with DNS you control

---

## Architecture Overview

```
Public visitors ──► Vercel Edge ──► Next.js (ISR / SSG) ──► Supabase (anon, RLS-enforced)
Admin users     ──► Vercel       ──► Next.js /admin     ──► Supabase (cookie session + service role)
Admin publish   ──► revalidatePage() ──────────────────► ISR cache purge (<2s)
Supabase webhook ─► POST /api/revalidate (secret-gated) ─► ISR cache purge
```

- **Public pages** use a cookieless anon Supabase client (`createPublicSupabase`) → stay
  static/ISR. RLS `public_read_*` policies only expose `status='published'` rows.
- **Admin/API** use the cookie session client (`createServerSupabase`) and service-role client
  (`createServiceClient`) — server-only, never bundled to the client.
- **Route protection** is enforced by `src/proxy.ts` (Next.js middleware) + per-route
  `getUser()` checks + Postgres RLS.

---

## Step 1 — Supabase Setup

### 1.1 Create Project
- supabase.com → **New Project**
- Name: `seoexpertagency-production`
- Database password: generate a strong one, save it in your password manager
- Region: `ap-northeast-1`. Staging and production must share a region so that
  latency measured on staging reflects production.
- Create → wait ~2 minutes

### 1.2 Get Credentials — Settings → API
| Copy | → Env var |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / `public` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` key | `SUPABASE_SERVICE_ROLE_KEY` (**secret — server only**) |

### 1.3 Run Database Migrations

Migrations are forward-only SQL files in `supabase/migrations/`, applied in
filename order and tracked in `supabase_migrations.schema_migrations` on the
target database. Never edit a migration that has already been applied — correct
it with a new, higher-numbered file.

Migrations are never applied by hand. Use `scripts/db.sh`, which takes an
explicit target so you always know which database you are writing to:

```bash
cp .env.migrate.example .env.migrate   # fill in the two connection strings
pnpm db:staging:push                   # apply to staging
pnpm db:staging:diff                   # must print no diff afterwards
pnpm db:prod:push                      # apply to production (typed confirmation)
```

`pnpm db:staging:status` / `pnpm db:prod:status` list which migrations each
database has applied — use this to confirm the two are in sync before a release.

See **Step 1.8** for the staging project and the change workflow.

### 1.8 Staging Project (migration rehearsal)

Every migration is applied to staging first. Staging is a second, throwaway
Supabase project with the same schema and no real customer data, so a destructive
or broken migration costs nothing.

**One-time setup:**

1. supabase.com → **New Project** → name `seoexpertagency-staging`, same region
   as production (`ap-northeast-1`, per step 1). Save the database password.
2. Copy its connection string (Project Settings → Database → Connection string →
   URI, session pooler, port 5432) into `STAGING_DB_URL` in `.env.migrate`.
3. Bring it up to the current schema and load sample data:
   ```bash
   pnpm db:staging:push
   psql "$STAGING_DB_URL" -f supabase/seed/001_seed.sql
   ```
4. Recreate the `media` storage bucket (step 1.5) and a test admin user
   (step 1.6) in the staging project. Use a throwaway email — staging must never
   hold real credentials or customer data.
5. Keep a `.env.staging.local` with the staging URL/keys so you can point the app
   at staging with `pnpm dev` when you want to exercise a migration through the
   UI.

**Workflow for every schema change:**

```bash
pnpm db:new describe_your_change   # creates supabase/migrations/<ts>_describe_your_change.sql
# rename to the NNN_ convention used by this repo, e.g. 022_describe_your_change.sql
# write the SQL — include RLS policies for any new table
pnpm db:staging:push               # rehearse
pnpm db:staging:diff               # expect no diff
# exercise the affected pages against staging, then commit the migration with the
# code that depends on it, and open the PR
pnpm db:prod:push                  # after the PR merges
```

A new table with RLS enabled and no policies is invisible to the anon client —
that shows up as silently empty public pages rather than an error. Add the
policies in the same migration as the table.

**Refreshing staging** — staging drifts as you rehearse migrations. To reset it
to a clean schema + seed:

```bash
npx supabase db reset --db-url "$STAGING_DB_URL"
```

Only ever run `db reset` against `STAGING_DB_URL`. Against production it destroys
all data, which is why `scripts/db.sh` deliberately does not expose it.

### 1.4 Verify RLS is ON
Dashboard → **Table Editor** → confirm the lock icon on every table:
`services, industries, projects, locations, seo_pages, static_pages, blog_posts,
blog_categories, blog_tags, blog_post_tags, faqs, language_keys, search_content,
media, form_submissions, users, website_settings, audit_logs`

SQL verification (run in SQL Editor — every row must show `t`):
```sql
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' ORDER BY tablename;
```

### 1.5 Storage Bucket
Storage → **Create bucket**
- Name: `media` · Public: **YES** · File size limit: `5242880` (5 MB)
- Allowed MIME: `image/jpeg, image/png, image/webp, image/svg+xml`

Policies:
| Name | Op | Role | Using |
|---|---|---|---|
| Public read | SELECT | public | `true` |
| Auth upload | INSERT | authenticated | `true` |
| Auth delete | DELETE | authenticated | `auth.uid() IS NOT NULL` |

### 1.6 First Admin User
Authentication → Users → **Add user → Create new user**
- Email: your own · Password: strong · Auto-confirm: **YES**

Then SQL Editor (replace UUID from the Users table, and the email/name):
```sql
INSERT INTO users (id, email, full_name, role)
VALUES ('<user-uuid-from-auth-users>', 'admin@seoexpertagency.com', 'Admin', 'super_admin');
```

This is a one-time bootstrap step — `POST /api/admin/users/invite` requires an already-authenticated
`admin`/`super_admin` to call it, so the very first account must be created directly in Supabase.
Every subsequent admin user can be added from **Admin → Users → Invite**.

### 1.6b Disable public signup — REQUIRED, do not skip

`supabase/config.toml` disables signup for the **local** stack only. A hosted project
is configured from its dashboard, so this must be set again there:

**Authentication → Sign In / Providers → Email**
- **Allow new users to sign up:** OFF
- **Confirm email:** ON

Why this matters: the anon key is public by design (it ships in the client bundle).
With signup enabled, anyone could call `supabase.auth.signUp()` and obtain a valid
session. This app treats staff membership as a row in `public.users` — never as the
mere existence of a session — so such an account is now rejected. Leaving signup on
anyway lets strangers create auth accounts against your project, and removes the
outer layer of that defence.

Staff are invite-only: **Admin → Users → Invite** creates the account with
`email_confirm: true`, so invited users sign in immediately and never need the
signup flow.

### 1.6c Verify the access controls after deploying

Run these against the live project once Step 4 is done. All three must fail:

```bash
# 1. Email credentials must NOT be readable with the public anon key.
#    Expect: an empty array or a permission error — never a resend_api_key value.
curl -s "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/website_settings?select=key,value" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"

# 2. Public signup must be refused.
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H 'Content-Type: application/json' \
  -d '{"email":"probe@example.com","password":"correct-horse-battery"}'

# 3. Leads must not be insertable directly, bypassing validation and rate limiting.
curl -s -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/form_submissions" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" -H 'Content-Type: application/json' \
  -d '{"name":"probe","phone":"000"}'
```

### 1.7 Website Settings
Migration `002_settings_seed.sql` seeds the base settings keys automatically.
Tune the rest later via **Admin → Settings** (phone, WhatsApp, footer, nav, SEO defaults).

---

## Step 2 — External Services

### 2.1 Resend (email — required for lead notifications)
- resend.com → API Keys → **Create** (`seoexpertagency-production`) → `RESEND_API_KEY`
- Domains → Add `seoexpertagency.com` → add the SPF/DKIM/DMARC DNS records → verify (≤24 h)
- From address used by code: `noreply@seoexpertagency.com` (overridable in Admin → Settings → Email)

### 2.2 Upstash Redis (rate limiting — optional)
- console.upstash.com → Create Database (`seoexpertagency-rate-limit`)
- REST API → `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **If unset, the lead form falls back to no rate limiting** (still protected by honeypot + CSRF).

### 2.3 Sentry (error monitoring — recommended)
- sentry.io → New Project → Next.js → `seoexpertagency`
- DSN → both `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN`
- Alert: email on first occurrence of a new issue

### 2.4 Google Analytics (optional)
- analytics.google.com → property for `seoexpertagency.com` → Measurement ID `G-XXXXXXXXXX`
  → `NEXT_PUBLIC_GA_MEASUREMENT_ID` (or set in Admin → Settings → SEO & Analytics)

---

## Step 3 — Generate Secrets
```bash
# REVALIDATION_SECRET (min 32 chars) — gates POST /api/revalidate
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Save the value. (No `CRON_SECRET` is required — no cron jobs are wired in this build.)

---

## Step 4 — Vercel Deployment

### 4.1 Connect Repository
- vercel.com → **Add New Project** → import the repo
- Framework: **Next.js** (auto)
- Root Directory: default (repo root) — the app lives at the top level, no override needed
- Build Command: `pnpm build` · Output: `.next` (defaults)

### 4.2 Environment Variables (Settings → Environment Variables)
Set for **Production + Preview + Development** unless noted:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | from 1.2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | from 1.2 |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | from 1.2 — **secret** |
| `NEXT_PUBLIC_SITE_URL` | ✅ | `https://seoexpertagency.com` (per-env: use the preview URL on Preview) |
| `REVALIDATION_SECRET` | ✅ | from Step 3 |
| `RESEND_API_KEY` | ✅ | from 2.1 |
| `ADMIN_EMAIL` | ✅ | lead notification recipient |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ⚠️ | e.g. `971XXXXXXXXX` (or set in Admin) |
| `UPSTASH_REDIS_REST_URL` | ⚠️ | rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | ⚠️ | rate limiting |
| `SENTRY_DSN` | ⚠️ rec. | server errors |
| `NEXT_PUBLIC_SENTRY_DSN` | ⚠️ rec. | client errors |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | ⛔ opt. | analytics |

`src/lib/startup-check.ts` throws on boot in production if a **required** var is missing.

### 4.3 Deploy
Click **Deploy** (~3–5 min). Expected route types in the build log:
```
○ /                      (Static / ISR)      ● /services/[service]        (SSG, revalidate 1h)
○ /services              (ISR 1h)            ● /locations/[location]      (SSG, 1h)
● /[location]/[service]  (SSG, 1h)           ƒ /admin/*  ƒ /api/*          (Dynamic)
```
Public pages must be `○`/`●`; only `/admin/*` and `/api/*` may be `ƒ`.

### 4.4 Custom Domain (Settings → Domains)
Add `seoexpertagency.com` and `www.seoexpertagency.com`. At your registrar:
```
A      @     76.76.19.19
CNAME  www   cname.vercel-dns.com
```
Vercel auto-provisions SSL. Verify:
```bash
curl -I https://seoexpertagency.com    # HTTP/2 200, server: Vercel
```

---

## Step 5 — Post-Deployment Verification

```bash
curl -I https://seoexpertagency.com                       # 200
curl -I https://seoexpertagency.com/admin                 # 302 → /admin/login
curl -s -o /dev/null -w "%{http_code}\n" \
     https://seoexpertagency.com/api/admin/services       # 401
curl -s https://seoexpertagency.com/robots.txt            # Disallow: /admin/  + sitemap-index
curl -s https://seoexpertagency.com/sitemap.xml           # valid XML <sitemapindex>
curl -I https://seoexpertagency.com/services/local-seo    # x-nextjs-cache: MISS, then HIT on 2nd
```
- Log in at `https://seoexpertagency.com/admin/login` with the Step 1.6 credentials.
- **Seed content** in admin: Services → Industries → Projects → Locations, then
  **SEO Pages → Add SEO Page** to generate service × location landing pages.

### 5.1 Google Search Console
search.google.com/search-console → add property `https://seoexpertagency.com` → verify via DNS TXT
→ Sitemaps → submit `https://seoexpertagency.com/sitemap.xml`.

### 5.2 Monitoring
Sentry alert > 5 errors/hr · Vercel deployment notifications · Supabase DB-size alert at 80 %.

---

## Step 6 — Supabase Webhooks (instant ISR on publish)

Admin saves already call `revalidatePage()` directly, so webhooks are a **belt-and-suspenders**
backup for direct DB edits. Dashboard → **Database → Webhooks → Create**:

Common settings — URL `https://seoexpertagency.com/api/revalidate`, method POST, headers
`x-revalidation-secret: <REVALIDATION_SECRET>` + `Content-Type: application/json`.

| Webhook | Table | Events | Payload |
|---|---|---|---|
| revalidate-services | services | UPDATE | `{"type":"service","slug":"{{record.slug}}"}` |
| revalidate-industries | industries | UPDATE | `{"type":"industry","slug":"{{record.slug}}"}` |
| revalidate-projects | projects | UPDATE | `{"type":"project","slug":"{{record.slug}}"}` |
| revalidate-locations | locations | UPDATE | `{"type":"location","slug":"{{record.slug}}"}` |
| revalidate-seo-pages | seo_pages | UPDATE | `{"type":"seo_page","slug":"{{record.slug}}"}` |
| revalidate-blog | blog_posts | UPDATE | `{"type":"blog","slug":"{{record.slug}}"}` |
| revalidate-static | static_pages | UPDATE | `{"type":"static","slug":"{{record.slug}}"}` |

Test: each webhook → **Send test** → expect Vercel function log `revalidated:true`.
Manual purge-all escape hatch:
```bash
curl -X POST https://seoexpertagency.com/api/revalidate \
  -H "x-revalidation-secret: <SECRET>" -H "Content-Type: application/json" \
  -d '{"type":"all"}'
```

---

## Step 7 — Performance Verification
```bash
npx lighthouse https://seoexpertagency.com --only-categories=performance,seo,accessibility --view
```
Targets: Performance ≥ 85 · SEO 100 · Accessibility ≥ 90.
Core Web Vitals (Search Console, after 28 days): LCP < 2.5s · CLS < 0.1 · FCP < 1.5s.

---

## Step 8 — Environment Variables Reference
See `.env.example` (committed). Required in production: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`,
`REVALIDATION_SECRET`, `RESEND_API_KEY`, `ADMIN_EMAIL`. Recommended: Sentry DSNs, Upstash,
WhatsApp number. Optional: GA measurement ID.

---

## Step 9 — Rollback

- **Vercel instant rollback (preferred):** Deployments → last good → ⋯ → **Promote to
  Production** (~30 s).
- **Git revert:** `git revert HEAD && git push origin main` → auto-deploys.
- **DB migration issue:** write a new, higher-numbered migration that undoes the
  change, rehearse it with `pnpm db:staging:push`, then `pnpm db:prod:push`.
  Never edit an applied migration, and never run `supabase db reset` against
  production — it destroys all data.

---

## Step 10 — Maintenance

**Weekly:** review Sentry, Vercel analytics, new leads (`/admin/leads`).
**Monthly:** `pnpm audit`, check Supabase DB size, re-run Lighthouse, `pnpm update`.

**Content:** Blog `/admin/seo-blog` · Services/Industries/Projects/Locations → edit → Publish ·
new service × location landing pages → `/admin/seo-pages` → **Add SEO Page**.

**Adding an env var:** add to `.env.local` → `.env.example` → Vercel (Prod+Preview) →
`src/lib/startup-check.ts` required/recommended list → redeploy.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `JWT expired` in admin | Session timed out — log out/in. Check Supabase JWT expiry. |
| ISR not updating after publish | Confirm `REVALIDATION_SECRET` matches in Vercel & webhook; `/api/revalidate` must return 200 not 401. Use the `type:"all"` curl above. |
| SEO Page 404 | `seo_pages.status` must be `published`, and both its `services`/`locations` rows must also be `published`. |
| RLS blocking a query | Verify the `public_read_*`/role policy exists; check user `role` in `users`. |
| Vercel build fails | Reproduce with `pnpm build` locally; confirm all env vars set. |
| Emails not sending | Check `RESEND_API_KEY`, verified From domain, Resend send logs. |
| Rate limiting too strict | Tune `src/lib/rate-limit.ts`; inspect Upstash request counts. |

---

_Re-run `pnpm typecheck && pnpm lint && pnpm build` and a secrets scan before every production
deploy — do not rely on a stale audit date in this file._
