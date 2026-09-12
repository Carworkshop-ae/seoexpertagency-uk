-- ─────────────────────────────────────────────────────────────────────────────
-- 001_baseline.sql — SEO Expert Agency
--
-- Consolidated baseline. This project was scaffolded from a car-servicing site
-- in order to reuse its CMS; that product's data model (brands, vehicle models,
-- the brand/model page generator) has been removed here, while the CMS itself —
-- roles and approval workflow, the seo_json SEO overlay, media, audit logging —
-- is carried forward unchanged.
--
-- Nothing was ever deployed from the previous migration history, so it has been
-- squashed rather than layered over. This file is the whole schema.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE content_status  AS ENUM ('draft', 'published', 'archived');
CREATE TYPE lead_status     AS ENUM ('new', 'contacted', 'in_progress', 'converted', 'closed');
CREATE TYPE user_role       AS ENUM ('super_admin', 'admin', 'editor', 'content_writer', 'support_staff', 'seo_editor');
CREATE TYPE audit_action    AS ENUM ('create', 'update', 'delete', 'publish', 'unpublish', 'generate');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'resubmission_required', 'rejected');

-- ─── Users ───────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL UNIQUE,
  full_name  TEXT NOT NULL,
  role       user_role NOT NULL DEFAULT 'content_writer',
  avatar_url TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Role lookups run inside the users RLS policies themselves. A plain EXISTS
-- subquery there recurses; SECURITY DEFINER breaks the cycle.
CREATE OR REPLACE FUNCTION public.is_staff(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role::text = ANY(roles)
  );
$$;

REVOKE ALL ON FUNCTION public.is_staff(TEXT[]) FROM public;
GRANT EXECUTE ON FUNCTION public.is_staff(TEXT[]) TO anon, authenticated, service_role;

-- ─── Marketing content ───────────────────────────────────────────────────────
-- services / locations carry forward; industries / projects are new. All four
-- share a shape: identity + SEO + a `*_json` block per template section, so one
-- admin module pattern and one public template pattern covers them.

CREATE TABLE services (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  short_description   TEXT,
  content             TEXT,
  icon                TEXT,
  icon_url            TEXT,
  image_url           TEXT,
  starting_price      DECIMAL(10,2),
  starting_price_label TEXT,
  hero_badge          TEXT,
  headline            TEXT,
  subheadline         TEXT,
  overview            TEXT,
  problems_json       JSONB NOT NULL DEFAULT '[]'::JSONB,
  benefits_json       JSONB NOT NULL DEFAULT '[]'::JSONB,
  deliverables_json   JSONB NOT NULL DEFAULT '[]'::JSONB,
  process_json        JSONB NOT NULL DEFAULT '[]'::JSONB,
  includes_json       JSONB NOT NULL DEFAULT '[]'::JSONB,
  faq_json            JSONB NOT NULL DEFAULT '[]'::JSONB,
  content_json        JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_json            JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_title           TEXT,
  seo_description     TEXT,
  og_image_url        TEXT,
  schema_type         TEXT DEFAULT 'Service',
  status              content_status NOT NULL DEFAULT 'draft',
  sort_order          INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_services_slug   ON services(slug);
CREATE INDEX idx_services_status ON services(status);

-- `region` (not `emirate`) and `country_code`: locations span UAE, UK and
-- international, and must extend to country/region/city without a rebuild.
CREATE TABLE locations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name              TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  region            TEXT NOT NULL DEFAULT '',
  country_code      TEXT NOT NULL DEFAULT '',
  address           TEXT,
  lat               DECIMAL(10,8),
  lng               DECIMAL(11,8),
  description       TEXT,
  maps_embed_url    TEXT,
  hero_badge        TEXT,
  headline          TEXT,
  subheadline       TEXT,
  overview          TEXT,
  local_factors_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  deliverables_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  faq_json          JSONB NOT NULL DEFAULT '[]'::JSONB,
  content_json      JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_json          JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_title         TEXT,
  seo_description   TEXT,
  status            content_status NOT NULL DEFAULT 'draft',
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_locations_slug    ON locations(slug);
CREATE INDEX idx_locations_country ON locations(country_code);

CREATE TABLE industries (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  short_description    TEXT,
  icon                 TEXT,
  image_url            TEXT,
  hero_badge           TEXT,
  headline             TEXT,
  subheadline          TEXT,
  overview             TEXT,
  challenges_json      JSONB NOT NULL DEFAULT '[]'::JSONB,
  strategy_json        JSONB NOT NULL DEFAULT '[]'::JSONB,
  deliverables_json    JSONB NOT NULL DEFAULT '[]'::JSONB,
  faq_json             JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Service slugs, resolved at render time. Text rather than a join table:
  -- the ordering is editorial and the list is short.
  recommended_services TEXT[] NOT NULL DEFAULT '{}',
  content_json         JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_json             JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_title            TEXT,
  seo_description      TEXT,
  og_image_url         TEXT,
  status               content_status NOT NULL DEFAULT 'draft',
  sort_order           INTEGER NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_industries_slug   ON industries(slug);
CREATE INDEX idx_industries_status ON industries(status);

CREATE TABLE projects (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL UNIQUE,
  client              TEXT,
  industry            TEXT,
  timeline            TEXT,
  summary             TEXT,
  challenge           TEXT,
  strategy            TEXT,
  services            TEXT[] NOT NULL DEFAULT '{}',
  implementation_json JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Empty unless the client has verified and approved the figures. The public
  -- template omits the results block entirely when this is empty; never
  -- populate it with estimates, projections or illustrative numbers.
  results_json        JSONB NOT NULL DEFAULT '[]'::JSONB,
  deliverables_json   JSONB NOT NULL DEFAULT '[]'::JSONB,
  image_url           TEXT,
  gallery_json        JSONB NOT NULL DEFAULT '[]'::JSONB,
  content_json        JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_json            JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_title           TEXT,
  seo_description     TEXT,
  og_image_url        TEXT,
  status              content_status NOT NULL DEFAULT 'draft',
  sort_order          INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projects_slug   ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);

-- ─── Static pages ────────────────────────────────────────────────────────────

CREATE TABLE static_pages (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  sub_title         TEXT,
  h3_text           TEXT,
  short_description TEXT,
  sections_json     JSONB NOT NULL DEFAULT '[]'::JSONB,
  content_json      JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_json          JSONB NOT NULL DEFAULT '{}'::JSONB,
  seo_title         TEXT,
  seo_description   TEXT,
  meta_keyword      TEXT,
  og_image_url      TEXT,
  status            content_status NOT NULL DEFAULT 'draft',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Blog ────────────────────────────────────────────────────────────────────

CREATE TABLE blog_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_tags (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE blog_posts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  excerpt         TEXT,
  content         TEXT,
  blockquote      TEXT,
  featured_image  TEXT,
  image_webp_url  TEXT,
  image_alt       TEXT,
  author_id       UUID REFERENCES users(id),
  category_id     UUID REFERENCES blog_categories(id),
  tags            TEXT,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  seo_title       TEXT,
  seo_description TEXT,
  meta_keyword    TEXT,
  seo_json        JSONB NOT NULL DEFAULT '{}'::JSONB,
  status          content_status NOT NULL DEFAULT 'draft',
  approval_status approval_status NOT NULL DEFAULT 'approved',
  assignee_id     UUID REFERENCES users(id),
  assigned_at     TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  scheduled_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_blog_posts_slug     ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status   ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_approval ON blog_posts(approval_status);

CREATE TABLE blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ─── Media, leads, settings, audit ───────────────────────────────────────────

CREATE TABLE media (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename      TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url           TEXT NOT NULL,
  alt_text      TEXT DEFAULT '',
  mime_type     TEXT NOT NULL,
  size_bytes    INTEGER NOT NULL,
  width         INTEGER,
  height        INTEGER,
  folder        TEXT NOT NULL DEFAULT 'general',
  uploaded_by   UUID REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_media_folder ON media(folder);

CREATE TABLE form_submissions (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT,
  website_url      TEXT,
  service_id       UUID REFERENCES services(id) ON DELETE SET NULL,
  service_name     TEXT,
  location_id      UUID REFERENCES locations(id) ON DELETE SET NULL,
  message          TEXT,
  source_url       TEXT NOT NULL,
  source_page_slug TEXT,
  ip_address       INET,
  user_agent       TEXT,
  status           lead_status NOT NULL DEFAULT 'new',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_leads_status     ON form_submissions(status);
CREATE INDEX idx_leads_created_at ON form_submissions(created_at DESC);

CREATE TABLE website_settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE SET NULL,
  action       audit_action NOT NULL,
  table_name   TEXT NOT NULL,
  record_id    TEXT NOT NULL,
  changes_json JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_user  ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name, record_id);

-- ─── Standalone admin modules ────────────────────────────────────────────────

CREATE TABLE faqs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country          TEXT NOT NULL DEFAULT 'AE',
  name             TEXT NOT NULL,
  description_html TEXT NOT NULL DEFAULT '',
  display_order    INTEGER NOT NULL DEFAULT 0,
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_faqs_country_order ON faqs(country, display_order);

CREATE TABLE language_keys (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name     TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  value_en     TEXT NOT NULL DEFAULT '',
  comment      TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE search_content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  url           TEXT NOT NULL,
  keywords      TEXT[] NOT NULL DEFAULT '{}',
  description   TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Row Level Security ──────────────────────────────────────────────────────
-- Public reads are limited to published/active rows. Writes go through the
-- admin API on the service-role key, so `admin_all_*` covers direct access
-- (Studio, psql, any future authenticated client) rather than the app path.

ALTER TABLE users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_pages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags    ENABLE ROW LEVEL SECURITY;
ALTER TABLE media             ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs        ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs              ENABLE ROW LEVEL SECURITY;
ALTER TABLE language_keys     ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_content    ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY users_read_own      ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY super_admin_all_users ON users FOR ALL   USING (public.is_staff(ARRAY['super_admin']));
CREATE POLICY admin_read_users    ON users FOR SELECT USING (public.is_staff(ARRAY['super_admin','admin']));

-- Published content: readable by anyone, writable by content staff.
CREATE POLICY public_read_services   ON services   FOR SELECT USING (status = 'published');
CREATE POLICY admin_all_services     ON services   FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor']));
CREATE POLICY public_read_locations  ON locations  FOR SELECT USING (status = 'published');
CREATE POLICY admin_all_locations    ON locations  FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor']));
CREATE POLICY public_read_industries ON industries FOR SELECT USING (status = 'published');
CREATE POLICY admin_all_industries   ON industries FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor']));
CREATE POLICY public_read_projects   ON projects   FOR SELECT USING (status = 'published');
CREATE POLICY admin_all_projects     ON projects   FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor']));

CREATE POLICY public_read_static_pages ON static_pages FOR SELECT USING (status = 'published');
CREATE POLICY admin_all_static_pages   ON static_pages FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor','content_writer']));
CREATE POLICY public_read_blog_posts   ON blog_posts   FOR SELECT USING (status = 'published');
CREATE POLICY admin_all_blog_posts     ON blog_posts   FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor','content_writer']));

CREATE POLICY public_read_blog_categories ON blog_categories FOR SELECT USING (true);
CREATE POLICY admin_all_blog_categories   ON blog_categories FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor','content_writer']));
CREATE POLICY public_read_blog_tags       ON blog_tags       FOR SELECT USING (true);
CREATE POLICY admin_all_blog_tags         ON blog_tags       FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor','content_writer']));
CREATE POLICY public_read_blog_post_tags  ON blog_post_tags  FOR SELECT USING (true);
CREATE POLICY admin_all_blog_post_tags    ON blog_post_tags  FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor','content_writer']));

CREATE POLICY public_read_media ON media FOR SELECT USING (true);
CREATE POLICY admin_all_media   ON media FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','editor','content_writer']));

CREATE POLICY public_read_settings ON website_settings FOR SELECT USING (true);
CREATE POLICY admin_all_settings   ON website_settings FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin']));

-- Leads: anyone may submit; only staff may read them back.
CREATE POLICY public_insert_leads        ON form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY admin_read_leads           ON form_submissions FOR SELECT USING (public.is_staff(ARRAY['super_admin','admin','support_staff']));
CREATE POLICY support_update_lead_status ON form_submissions FOR UPDATE USING (public.is_staff(ARRAY['super_admin','admin','support_staff']));
CREATE POLICY admin_delete_leads         ON form_submissions FOR DELETE USING (public.is_staff(ARRAY['super_admin','admin']));

CREATE POLICY admin_read_audit    ON audit_logs FOR SELECT USING (public.is_staff(ARRAY['super_admin','admin']));
CREATE POLICY service_insert_audit ON audit_logs FOR INSERT WITH CHECK (true);

CREATE POLICY public_read_faqs      ON faqs           FOR SELECT USING (is_active = true);
CREATE POLICY admin_all_faqs        ON faqs           FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','seo_editor']));
CREATE POLICY public_read_lang_keys ON language_keys  FOR SELECT USING (is_published = true);
CREATE POLICY admin_all_lang_keys   ON language_keys  FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','seo_editor']));
CREATE POLICY public_read_search    ON search_content FOR SELECT USING (is_active = true);
CREATE POLICY admin_all_search      ON search_content FOR ALL    USING (public.is_staff(ARRAY['super_admin','admin','seo_editor']));

-- ─── seo_editor write restriction ────────────────────────────────────────────
-- Backstop for direct (non-service-role) writes: an seo_editor may touch
-- seo_json and nothing else. The admin API enforces the same rule in
-- src/proxy.ts, which is what actually gates the app path — this covers
-- Studio, psql and any future authenticated client.

CREATE OR REPLACE FUNCTION enforce_seo_editor_seo_json_only()
RETURNS TRIGGER AS $$
DECLARE is_seo_editor BOOLEAN;
BEGIN
  SELECT (role = 'seo_editor') INTO is_seo_editor FROM public.users WHERE id = auth.uid();
  IF COALESCE(is_seo_editor, false) THEN
    IF to_jsonb(NEW) - 'seo_json' - 'updated_at' IS DISTINCT FROM to_jsonb(OLD) - 'seo_json' - 'updated_at' THEN
      RAISE EXCEPTION 'seo_editor may only update seo_json';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_seo_editor_services     BEFORE UPDATE ON services     FOR EACH ROW EXECUTE FUNCTION enforce_seo_editor_seo_json_only();
CREATE TRIGGER trg_seo_editor_locations    BEFORE UPDATE ON locations    FOR EACH ROW EXECUTE FUNCTION enforce_seo_editor_seo_json_only();
CREATE TRIGGER trg_seo_editor_industries   BEFORE UPDATE ON industries   FOR EACH ROW EXECUTE FUNCTION enforce_seo_editor_seo_json_only();
CREATE TRIGGER trg_seo_editor_projects     BEFORE UPDATE ON projects     FOR EACH ROW EXECUTE FUNCTION enforce_seo_editor_seo_json_only();
CREATE TRIGGER trg_seo_editor_static_pages BEFORE UPDATE ON static_pages FOR EACH ROW EXECUTE FUNCTION enforce_seo_editor_seo_json_only();
CREATE TRIGGER trg_seo_editor_blog_posts   BEFORE UPDATE ON blog_posts   FOR EACH ROW EXECUTE FUNCTION enforce_seo_editor_seo_json_only();
