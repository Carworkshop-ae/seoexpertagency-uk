-- ─────────────────────────────────────────────────────────────────────────────
-- 003_seo_pages.sql — SEO landing pages, one per Location × page name.
--
-- An admin picks a State (a row from the `locations` catalog — each of which
-- already represents one country/market, e.g. "United Arab Emirates" or
-- "United Kingdom") and types an H1, a short hero paragraph, long-form SEO
-- body content, a per-page "Why Choose Us" block, and FAQs. Its public URL is
-- `{location.slug}/{page-slug}`; many pages can exist per location. Its page
-- reuses the homepage's own sections (Services/Packages/Industries/etc)
-- rather than a bespoke template. Follows the same identity + SEO shape as
-- services/industries/projects/locations (see 001_baseline.sql) so it fits the
-- generic content-api CRUD unmodified.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE seo_pages (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_id            UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  -- Derived as `{location.slug}/{headline-slug}` on create; editable afterwards.
  slug                   TEXT NOT NULL UNIQUE,
  headline               TEXT,       -- H1
  subheadline            TEXT,       -- Hero paragraph ("short SEO content")
  overview               TEXT,       -- Long-form SEO body, rendered late in the page
  why_choose_us_heading  TEXT,
  why_choose_us_json     JSONB NOT NULL DEFAULT '[]'::JSONB,
  faq_json               JSONB NOT NULL DEFAULT '[]'::JSONB,
  seo_json               JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_title              TEXT,
  seo_description        TEXT,
  meta_keyword           TEXT,
  og_image_url           TEXT,
  status                 content_status NOT NULL DEFAULT 'draft',
  sort_order             INTEGER NOT NULL DEFAULT 0,
  created_by             UUID REFERENCES users(id),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_seo_pages_slug     ON seo_pages(slug);
CREATE INDEX idx_seo_pages_status   ON seo_pages(status);
CREATE INDEX idx_seo_pages_location ON seo_pages(location_id);

ALTER TABLE seo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY public_read_seo_pages ON seo_pages FOR SELECT USING (status = 'published');
-- Admin/super_admin only — no approval workflow for this content type, and
-- seo_editor is deliberately excluded (unlike services/industries/projects/
-- locations, which grant broader staff access).
CREATE POLICY admin_all_seo_pages ON seo_pages FOR ALL USING (public.is_staff(ARRAY['super_admin','admin']));
