-- ─────────────────────────────────────────────────────────────────────────────
-- 005_market_geography.sql — per-market geography for SEO pages.
--
-- One codebase serves three domains (see src/lib/market.ts):
--   seoexpertagency.com → global; SEO pages carry no country and no state
--   seoexpertagency.uk  → United Kingdom
--   seoexpertagency.ae  → United Arab Emirates
--
-- Two changes:
--   1. seo_pages.location_id becomes nullable, so the global deployment can
--      publish an SEO page with no geography at all. Both geo markets still
--      require one — enforced in src/lib/schemas/content.ts, which branches on
--      the build's market, and in the admin form.
--   2. The seven emirates are seeded into `locations` so the .ae deployment's
--      State dropdown is populated. Without them the SEO Page form has an empty
--      required dropdown and cannot be submitted at all.
--
-- The emirates land as `draft` on purpose: each one is also a public page at
-- /locations/{slug}, and publishing seven empty pages would put thin content on
-- a search-marketing site. They are selectable in admin while draft. Publish
-- each from Admin → Locations once it has real copy.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE seo_pages ALTER COLUMN location_id DROP NOT NULL;

-- The 7 emirates — the UAE's complete set of first-level administrative
-- divisions. Idempotent: re-running skips rows already present by slug.
INSERT INTO locations (name, slug, region, country_code, status, sort_order) VALUES
  ('Abu Dhabi',      'abu-dhabi',      'United Arab Emirates', 'AE', 'draft', 1),
  ('Dubai',          'dubai',          'United Arab Emirates', 'AE', 'draft', 2),
  ('Sharjah',        'sharjah',        'United Arab Emirates', 'AE', 'draft', 3),
  ('Ajman',          'ajman',          'United Arab Emirates', 'AE', 'draft', 4),
  ('Umm Al Quwain',  'umm-al-quwain',  'United Arab Emirates', 'AE', 'draft', 5),
  ('Ras Al Khaimah', 'ras-al-khaimah', 'United Arab Emirates', 'AE', 'draft', 6),
  ('Fujairah',       'fujairah',       'United Arab Emirates', 'AE', 'draft', 7)
ON CONFLICT (slug) DO NOTHING;
