-- 004_security_hardening.sql
--
-- Closes three over-permissive RLS policies inherited from the baseline schema.
-- All three granted rights to the `anon` role, which is reachable by anyone holding
-- NEXT_PUBLIC_SUPABASE_ANON_KEY — and that key ships in the client bundle by design.
--
-- None of these policies were load-bearing: every application code path that touches
-- these three tables goes through the service-role client (src/lib/supabase/service.ts),
-- which bypasses RLS entirely. Verified before writing this migration:
--   website_settings  -> src/lib/hooks/useSettings.ts, src/app/api/admin/settings/*
--   form_submissions  -> src/app/api/leads/route.ts (insert), src/app/api/admin/leads/*
--   audit_logs        -> src/lib/audit.ts
-- The one session-client reader (src/app/admin/(dashboard)/page.tsx counting new leads)
-- is served by the untouched `admin_read_leads` SELECT policy.

-- ---------------------------------------------------------------------------
-- H1: deactivating a user did not actually revoke anything.
--
-- users.is_active is written by PUT /api/admin/users/[id]/deactivate, but
-- is_staff() only matched on role — so every RLS policy on all 19 tables kept
-- returning true for a deactivated account. Adding the predicate here fixes the
-- database layer everywhere at once; src/lib/auth-guard.ts covers the app layer.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_staff(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND is_active
      AND role::text = ANY(roles)
  );
$$;

-- CREATE OR REPLACE drops the grants set in 001_baseline, so restate them.
REVOKE ALL ON FUNCTION public.is_staff(TEXT[]) FROM public;
GRANT EXECUTE ON FUNCTION public.is_staff(TEXT[]) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- C1 (CRITICAL): website_settings was world-readable, exposing email credentials.
--
-- `public_read_settings ... USING (true)` allowed any anon caller to run
--   GET /rest/v1/website_settings?select=*
-- and read every row — including `resend_api_key` and `smtp_password`, which
-- src/types/settings.ts declares as SECRET_SETTING_KEYS. The masking applied in
-- src/app/api/admin/settings/route.ts only covers the app's own endpoint and was
-- bypassed completely by querying PostgREST directly.
--
-- Public pages do not need this policy: they read settings server-side via the
-- service role and expose only PUBLIC_SETTING_KEYS through /api/settings.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS public_read_settings ON website_settings;

-- Staff may read settings through a user session; everyone else gets nothing.
-- (`admin_all_settings` already grants super_admin/admin full write access.)
DROP POLICY IF EXISTS staff_read_settings ON website_settings;
CREATE POLICY staff_read_settings ON website_settings
  FOR SELECT USING (public.is_staff(ARRAY['super_admin', 'admin']));

-- Defence in depth: remove the table-level grant so a future permissive policy
-- cannot re-expose the table to anonymous callers.
REVOKE ALL ON website_settings FROM anon;

-- ---------------------------------------------------------------------------
-- M2: anonymous callers could insert leads straight into PostgREST, bypassing
-- every application-layer control on /api/leads — origin check, honeypot, zod
-- validation and the Upstash rate limiter. The API route inserts with the
-- service role, so it does not rely on this policy.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS public_insert_leads ON form_submissions;
REVOKE INSERT ON form_submissions FROM anon;

-- ---------------------------------------------------------------------------
-- M3: `service_insert_audit ... WITH CHECK (true)` let any anonymous caller forge
-- audit_logs rows, poisoning the trail that admins read for attribution.
-- src/lib/audit.ts writes with the service role, which is not subject to RLS.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS service_insert_audit ON audit_logs;
REVOKE INSERT ON audit_logs FROM anon, authenticated;
