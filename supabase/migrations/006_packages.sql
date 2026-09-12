-- ─────────────────────────────────────────────────────────────────────────────
-- 006_packages.sql — editable Pricing/Packages tiers.
--
-- The homepage/pricing-page "Basic / Silver / Gold" tiers have been a
-- hardcoded constant (SEO_PACKAGES in src/lib/data/agency-data.ts) with zero
-- database backing — no admin page, no table. This adds one, following the
-- same conventions as `services` (JSONB section blocks, content_status,
-- public_read_*/admin_all_* RLS split).
--
-- Purely additive: no existing table, column, or row is touched. Exactly 3
-- rows are seeded below with today's live SEO_PACKAGES copy, so the site
-- renders identically before and after this migration — the app's fallback
-- to the hardcoded constant (same pattern as getServices()) never actually
-- triggers in production once this is applied, but stays as a safety net.
--
-- Tiers are fixed at exactly 3 by application logic (no admin UI to add or
-- remove a tier) — `tier` is UNIQUE but not constrained to an enum here,
-- since enforcing "exactly basic/silver/gold" at the DB layer would need a
-- CHECK this app doesn't otherwise use; the API route is the single place
-- that creates rows in this table, and it never exposes a create endpoint.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE packages (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tier           TEXT NOT NULL UNIQUE,
  name           TEXT NOT NULL,
  price          TEXT NOT NULL,
  billing_period TEXT NOT NULL DEFAULT 'per month',
  description    TEXT,
  is_popular     BOOLEAN NOT NULL DEFAULT false,
  cta_label      TEXT,
  features_json  JSONB NOT NULL DEFAULT '[]'::JSONB,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  status         content_status NOT NULL DEFAULT 'draft',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_packages_tier ON packages(tier);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_packages ON packages FOR SELECT USING (status = 'published');
CREATE POLICY admin_all_packages   ON packages FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor']));

CREATE TRIGGER trg_seo_editor_packages BEFORE UPDATE ON packages FOR EACH ROW EXECUTE FUNCTION enforce_seo_editor_seo_json_only();

-- Seed exactly 3 rows with today's live SEO_PACKAGES copy
-- (src/lib/data/agency-data.ts), published immediately.
INSERT INTO packages (tier, name, price, billing_period, description, is_popular, cta_label, features_json, sort_order, status) VALUES
(
  'basic', 'Basic', '$1,490', 'per month',
  'Essential SEO foundation and steady organic growth for emerging businesses and local service brands.',
  false, 'Get Started with Basic',
  '["Comprehensive Initial Technical Audit","Up to 25 Target Keywords Monitored","On-Page Optimization for up to 10 Key Pages/mo","2 In-Depth SEO Articles (1,500+ words/mo)","Google Business Profile & Local 3-Pack Optimization","3 High-Quality Contextual Backlinks/mo","Monthly Performance & Keyword Velocity Report","Dedicated SEO Account Manager"]'::JSONB,
  0, 'published'
),
(
  'silver', 'Silver', '$2,890', 'per month',
  'Our most popular comprehensive growth package for scaling companies targeting competitive commercial keywords.',
  true, 'Claim Growth Package',
  '["Everything in Basic Package","Up to 75 Target Keywords Monitored","On-Page Optimization for up to 25 Pages/mo","4 In-Depth SEO Articles & Topic Clusters/mo","Full Core Web Vitals & Technical Maintenance","7 High-Authority Editorial Backlinks/mo","Competitor Search Gap & Content Tracking","Interactive Conversion Rate (CRO) Recommendations","Bi-Weekly Strategy Calls & Custom Dashboard"]'::JSONB,
  1, 'published'
),
(
  'gold', 'Gold', '$4,990', 'per month',
  'Enterprise-grade search domination for high-growth e-commerce, multi-location, and high-volume brands.',
  false, 'Scale with Enterprise Gold',
  '["Everything in Silver Package","Unlimited Target Keywords Monitored","Comprehensive Site-Wide Architecture Governance","8 In-Depth SEO Articles & Pillar Page Hubs/mo","Custom Programmatic / Faceted Navigation SEO","15+ Premium Tier-1 Digital PR Backlinks/mo","Multi-Location / Multi-Region International SEO","Direct Slack/Teams Channel with Senior Strategist","Weekly Sprint Reviews & Executive KPI Reporting"]'::JSONB,
  2, 'published'
);
