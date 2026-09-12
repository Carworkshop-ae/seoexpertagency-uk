-- 002_settings_seed.sql — brand, contact and navigation defaults.
--
-- Lives in a migration rather than the seed file so a fresh `db push` to a new
-- environment comes up with a working header, footer and nav. Idempotent.
--
-- NOTE: values here are placeholders where the client has not supplied real
-- details (phone, address, social handles). Replace via admin → Settings before
-- launch; do not invent contact details or performance claims.

INSERT INTO website_settings (key, value) VALUES
  ('site_name',                 '"SEO Expert Agency"'),
  ('site_tagline',              '"Data-Driven SEO Agency & Search Marketing"'),
  ('header_phone_number',       '"+971 4 800 736"'),
  ('header_phone_visible',      'true'::jsonb),
  ('header_whatsapp_visible',   'true'::jsonb),
  ('header_cta_text',           '"Get Free SEO Audit"'),
  ('header_cta_link',           '"/contact"'),
  ('header_cta_visible',        'true'::jsonb),
  ('whatsapp_enabled',          'true'::jsonb),
  ('whatsapp_number',           '"+971501234567"'),
  ('whatsapp_message',          '"Hi SEO Expert Agency, I would like to request a free SEO audit and consultation for my website."'),
  ('call_enabled',              'true'::jsonb),
  ('call_number',               '"+9714800736"'),
  ('footer_copyright_text',     '"© 2026 SEO Expert Agency. All rights reserved."'),
  ('footer_tagline',            '"Data-driven search engine optimization for ambitious brands."'),
  ('footer_business_title',     '"SEO Expert Agency HQ"'),
  ('footer_business_address',   '"Level 24, Boulevard Plaza Tower 1, Downtown Dubai, UAE"'),
  ('footer_business_phone',     '"+971 4 800 736"'),
  ('footer_business_email',     '"hello@seoexpertagency.com"'),
  ('default_meta_title',        '"SEO Expert Agency — Data-Driven Search Engine Optimization"'),
  ('default_meta_description',  '"Grow your business with data-driven SEO strategies, technical excellence, and white-hat digital PR. Get a free custom SEO audit today."'),
  ('nav_items', '[
    {"id": "1", "label": "Services", "link": "/services", "has_dropdown": true, "visible": true, "order": 1, "children": [
      {"label": "Technical SEO", "link": "/services/technical-seo"},
      {"label": "Local SEO", "link": "/services/local-seo"},
      {"label": "E-Commerce SEO", "link": "/services/ecommerce-seo"},
      {"label": "Enterprise SEO", "link": "/services/enterprise-seo"},
      {"label": "SEO Strategy", "link": "/services/seo-strategy"},
      {"label": "On-Page SEO", "link": "/services/on-page-seo"},
      {"label": "Off-Page SEO & Links", "link": "/services/off-page-seo"},
      {"label": "Content SEO", "link": "/services/content-seo"}
    ]},
    {"id": "2", "label": "Industries", "link": "/industries", "has_dropdown": true, "visible": true, "order": 2, "children": [
      {"label": "SaaS & Tech", "link": "/industries/saas"},
      {"label": "E-Commerce & Retail", "link": "/industries/ecommerce"},
      {"label": "Healthcare & Medical", "link": "/industries/healthcare"},
      {"label": "Real Estate", "link": "/industries/real-estate"},
      {"label": "Finance & FinTech", "link": "/industries/finance"},
      {"label": "Professional Services", "link": "/industries/professional-services"}
    ]},
    {"id": "3", "label": "Projects", "link": "/projects", "has_dropdown": false, "visible": true, "order": 3},
    {"id": "4", "label": "Pricing", "link": "/pricing", "has_dropdown": false, "visible": true, "order": 4},
    {"id": "5", "label": "SEO Blog", "link": "/blog", "has_dropdown": false, "visible": true, "order": 5},
    {"id": "6", "label": "Locations", "link": "/locations", "has_dropdown": true, "visible": true, "order": 6, "children": [
      {"label": "UAE & Dubai", "link": "/locations/uae"},
      {"label": "United Kingdom", "link": "/locations/uk"},
      {"label": "Global & International", "link": "/locations/global"}
    ]},
    {"id": "7", "label": "About", "link": "/about", "has_dropdown": false, "visible": true, "order": 7},
    {"id": "8", "label": "Contact", "link": "/contact", "has_dropdown": false, "visible": true, "order": 8}
  ]'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
