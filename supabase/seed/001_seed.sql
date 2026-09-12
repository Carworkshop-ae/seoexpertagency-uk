-- ─── SEO Expert Agency Initial Seed ──────────────────────────────────────────

-- 1. Services
INSERT INTO services (name, slug, short_description, starting_price, status, sort_order) VALUES
  ('Technical SEO', 'technical-seo', 'Deep crawl audits, Core Web Vitals optimization, indexability fixes, and robust schema architecture.', 1499.00, 'published', 1),
  ('Local SEO', 'local-seo', 'Google Business Profile dominance, geo-targeted localized pages, citation networks, and localized intent capture.', 999.00, 'published', 2),
  ('E-Commerce SEO', 'ecommerce-seo', 'Product page architecture, category faceted navigation SEO, commercial keyword mapping, and revenue scaling.', 1999.00, 'published', 3),
  ('Enterprise SEO', 'enterprise-seo', 'Scalable automation, cross-department governance, multi-domain architectures, and high-volume index management.', 3499.00, 'published', 4),
  ('SEO Strategy', 'seo-strategy', 'Market research, search intent mapping, competitive gap analysis, and tailored 12-month organic roadmaps.', 1299.00, 'published', 5),
  ('On-Page SEO', 'on-page-seo', 'Information architecture, semantic keyword optimization, internal link meshes, and conversion rate optimization.', 1199.00, 'published', 6),
  ('Off-Page SEO & Links', 'off-page-seo', 'High-authority digital PR, editorial outreach, brand mentions, and contextual backlink acquisition.', 1799.00, 'published', 7),
  ('Content SEO', 'content-seo', 'High-intent keyword content hubs, thought leadership articles, topical authority frameworks, and E-E-A-T optimization.', 1399.00, 'published', 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  starting_price = EXCLUDED.starting_price,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order;

-- 2. Locations
-- Matches the three location pages the site actually renders (uae / uk / global).
-- `region` + `country_code` replace the old UAE-only `emirate` column so the
-- model extends to country → region → city without a schema change.
INSERT INTO locations (name, slug, region, country_code, status, sort_order) VALUES
  ('United Arab Emirates', 'uae',    'Middle East',   'AE', 'published', 1),
  ('United Kingdom',       'uk',     'Europe',        'GB', 'published', 2),
  ('Global',               'global', 'International', '',   'published', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  region = EXCLUDED.region,
  country_code = EXCLUDED.country_code,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order;

-- 2b. Industries — the six the site renders. Long-form body copy is authored
-- in admin → Industries; this seeds identity and ordering only.
INSERT INTO industries (name, slug, short_description, icon, status, sort_order) VALUES
  ('SaaS & Technology',      'saas',                  'Organic pipeline growth for product-led and sales-led software businesses.', 'cpu',       'published', 1),
  ('E-Commerce & Retail',    'ecommerce',             'Category, collection and product architecture built for commercial search intent.', 'shopping-cart', 'published', 2),
  ('Healthcare & Medical',   'healthcare',            'YMYL-compliant content and E-E-A-T signals for clinics, providers and health platforms.', 'activity', 'published', 3),
  ('Real Estate',            'real-estate',           'Location-led search strategies for developers, brokerages and property portals.', 'home',      'published', 4),
  ('Finance & FinTech',      'finance',               'Authority building and compliance-aware content for regulated financial products.', 'landmark',  'published', 5),
  ('Professional Services',  'professional-services', 'Lead-generating search visibility for firms selling expertise.', 'briefcase', 'published', 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  icon = EXCLUDED.icon,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order;

-- 2c. Projects — intentionally not seeded.
-- Case studies are published only once the client has approved the write-up and
-- any figures it reports. Add them via admin → Projects.

-- 3. SEO Agency Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, seo_title, seo_description, status, published_at) VALUES
  (
    'The Complete Technical SEO Audit Checklist for 2026',
    'technical-seo-audit-checklist-2026',
    'Discover the essential technical search factors driving algorithmic visibility in 2026, from Core Web Vitals to server log analysis.',
    '<p>Technical SEO forms the bedrock of organic search performance. Without a crawlable, indexable, and fast web infrastructure, high-quality content cannot reach its ranking potential.</p><h2>1. Crawlability and Indexability</h2><p>Ensure your robots.txt and XML sitemaps provide explicit search engine directives...</p>',
    'Technical SEO Audit Checklist 2026 — SEO Expert Agency',
    'Actionable guide and audit checklist covering Core Web Vitals, index coverage, canonical hierarchy, and JavaScript rendering.',
    'published',
    NOW()
  ),
  (
    'How to Dominate Local Google Map Pack in the UAE',
    'dominate-local-google-map-pack-uae',
    'A tactical breakdown of localized keyword intent, Google Business Profile optimization, and citation architecture for UAE businesses.',
    '<p>Local SEO in Dubai and Abu Dhabi demands rigorous geographic relevance, verified localized citations, and authentic customer sentiment signals.</p><h2>Local Ranking Pillars</h2><p>Proximity, prominence, and relevance govern local map pack rankings in the GCC region...</p>',
    'Dominating Local Google Map Pack in UAE — Local SEO Blueprint',
    'Learn how top Dubai and UAE businesses capture high-converting local organic searches through targeted local SEO strategies.',
    'published',
    NOW()
  ),
  (
    'Enterprise E-Commerce SEO: Scaling to 100k+ SKUs',
    'enterprise-ecommerce-seo-scaling-skus',
    'How enterprise retailers maintain index hygiene, prevent duplicate faceted search bloat, and maximize transactional organic revenue.',
    '<p>E-commerce search marketing at scale requires algorithmic URL governance, dynamic schema markup, and robust internal linking networks.</p><h2>Faceted Navigation Management</h2><p>Prevent search engine spider traps by canonicalizing parameter combinations...</p>',
    'Enterprise E-Commerce SEO Guide: Managing 100k+ SKUs',
    'Proven SEO frameworks for enterprise e-commerce platforms tackling faceted search, duplicate content, and taxonomy mapping.',
    'published',
    NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  status = EXCLUDED.status;
