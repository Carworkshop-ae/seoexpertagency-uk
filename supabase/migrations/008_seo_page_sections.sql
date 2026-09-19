-- ─────────────────────────────────────────────────────────────────────────────
-- 007_seo_page_sections.sql — per-page overrides for the shared homepage-style
-- sections (Trust Bar, 4-Step Process, CTA Banner, Final CTA, Testimonials,
-- and the title/subtitle/eyebrow of the Services/Packages/Industries/Projects/
-- Blog/FAQ sections) that every SEO page renders via [...slug]/page.tsx.
--
-- These sections have no dedicated columns of their own — they mirror the
-- schemaless approach static_pages.content_json already uses for the same
-- purpose, addressed via the same dot-path get/set helpers
-- (src/lib/inline-edit/path.ts), so each SEO page can carry its own
-- independent copy instead of sharing the components' hardcoded defaults.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE seo_pages ADD COLUMN sections_json JSONB NOT NULL DEFAULT '{}'::JSONB;
