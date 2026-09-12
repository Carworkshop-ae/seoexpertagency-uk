import { z } from 'zod'
import { getMarket } from '@/lib/market'

// Validation for the four CMS-managed marketing content types. They share a
// common core (identity, SEO, status) plus a per-type set of JSON section
// blocks that mirror the public templates in src/app/(public).

export const FAQItemSchema = z.object({
  question: z.string().min(1).max(500),
  answer: z.string().min(1).max(2000),
})

/** Repeating title+description block: problems solved, benefits, challenges… */
export const TitleDescSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
})

export const ProcessStepSchema = z.object({
  step: z.string().max(10).optional().default(''),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
})

export const ImplementationPhaseSchema = z.object({
  phase: z.string().max(50),
  title: z.string().min(1).max(200),
  details: z.string().min(1).max(2000),
})

export const ResultMetricSchema = z.object({
  metric: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
})

// Slugs are normalised server-side via generateSlug(); this only rejects input
// that could not survive that (empty, or absurdly long).
const slug = z.string().min(1).max(120).trim()
const status = z.enum(['draft', 'published', 'archived']).default('draft')

const seoCore = {
  slug: slug.optional(),
  seo_title: z.string().max(120).trim().optional().nullable(),
  seo_description: z.string().max(320).trim().optional().nullable(),
  og_image_url: z.string().url().optional().nullable().or(z.literal('')),
  status,
  sort_order: z.number().int().min(0).max(9999).default(0),
}

const pageCore = {
  hero_badge: z.string().max(100).trim().optional().nullable(),
  headline: z.string().max(300).trim().optional().nullable(),
  subheadline: z.string().max(500).trim().optional().nullable(),
  overview: z.string().max(20000).optional().nullable(),
  deliverables_json: z.array(z.string().max(300)).max(30).default([]),
  faq_json: z.array(FAQItemSchema).max(30).default([]),
}

// ─── Services ────────────────────────────────────────────────────────────────

export const CreateServiceSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(120).trim(),
  short_description: z.string().max(500).trim().optional().nullable(),
  icon: z.string().max(50).trim().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  starting_price: z.number().min(0).max(9999999).optional().nullable(),
  starting_price_label: z.string().max(50).trim().optional().nullable(),
  problems_json: z.array(TitleDescSchema).max(20).default([]),
  benefits_json: z.array(TitleDescSchema).max(20).default([]),
  process_json: z.array(ProcessStepSchema).max(20).default([]),
  content: z.string().max(200000).optional().nullable(),
  ...pageCore,
  ...seoCore,
})
export const UpdateServiceSchema = CreateServiceSchema.partial()

// ─── Industries ──────────────────────────────────────────────────────────────

export const CreateIndustrySchema = z.object({
  name: z.string().min(1, 'Industry name is required').max(120).trim(),
  short_description: z.string().max(500).trim().optional().nullable(),
  icon: z.string().max(50).trim().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  challenges_json: z.array(TitleDescSchema).max(20).default([]),
  strategy_json: z.array(TitleDescSchema).max(20).default([]),
  recommended_services: z.array(z.string().max(120)).max(12).default([]),
  ...pageCore,
  ...seoCore,
})
export const UpdateIndustrySchema = CreateIndustrySchema.partial()

// ─── Projects / case studies ─────────────────────────────────────────────────

export const CreateProjectSchema = z.object({
  title: z.string().min(1, 'Case study title is required').max(200).trim(),
  client: z.string().max(200).trim().optional().nullable(),
  industry: z.string().max(200).trim().optional().nullable(),
  timeline: z.string().max(100).trim().optional().nullable(),
  summary: z.string().max(1000).trim().optional().nullable(),
  challenge: z.string().max(20000).optional().nullable(),
  strategy: z.string().max(20000).optional().nullable(),
  services: z.array(z.string().max(120)).max(12).default([]),
  implementation_json: z.array(ImplementationPhaseSchema).max(20).default([]),
  // Client-verified figures only. Left empty, the public template omits the
  // results block rather than rendering placeholders — see the projects table
  // comment in supabase/migrations/001_baseline.sql.
  results_json: z.array(ResultMetricSchema).max(12).default([]),
  deliverables_json: z.array(z.string().max(300)).max(30).default([]),
  image_url: z.string().url().optional().nullable().or(z.literal('')),
  gallery_json: z.array(z.string().url()).max(20).default([]),
  ...seoCore,
})
export const UpdateProjectSchema = CreateProjectSchema.partial()

// ─── Locations ───────────────────────────────────────────────────────────────

export const CreateLocationSchema = z.object({
  name: z.string().min(1, 'Location name is required').max(120).trim(),
  region: z.string().max(120).trim().default(''),
  country_code: z.string().max(2).trim().default(''),
  address: z.string().max(500).trim().optional().nullable(),
  description: z.string().max(20000).optional().nullable(),
  maps_embed_url: z.string().url().optional().nullable().or(z.literal('')),
  local_factors_json: z.array(TitleDescSchema).max(20).default([]),
  ...pageCore,
  ...seoCore,
})
export const UpdateLocationSchema = CreateLocationSchema.partial()

// ─── SEO Pages (per-Location landing page) ─────────────────────────────────────
//
// Doesn't reuse `pageCore` — every other user of it wants `deliverables_json`
// and `hero_badge`, but this content type has neither (its page reuses the
// homepage's own sections instead of a deliverables list, and has no eyebrow
// badge field in its form).

export const CreateSeoPageSchema = z.object({
  // Geography is a property of the deployment, not the content: the .ae and .uk
  // builds require a state, the global .com build has no country/state fields
  // at all. The market is fixed at build time, so this branch is too — the
  // column itself is nullable (005_market_geography.sql) and this is what
  // actually enforces the requirement on the two geo markets.
  location_id: getMarket().hasGeo
    ? z.string().uuid('Select a state')
    : z.string().uuid().nullable().optional(),
  headline: z.string().max(300).trim().optional().nullable(),
  subheadline: z.string().max(500).trim().optional().nullable(),
  overview: z.string().max(20000).optional().nullable(),
  meta_keyword: z.string().max(255).trim().optional().nullable(),
  why_choose_us_heading: z.string().max(150).trim().optional().nullable(),
  why_choose_us_json: z.array(TitleDescSchema).max(12).default([]),
  faq_json: z.array(FAQItemSchema).max(30).default([]),
  ...seoCore,
})
export const UpdateSeoPageSchema = CreateSeoPageSchema.partial()

export type CreateServiceInput = z.infer<typeof CreateServiceSchema>
export type CreateIndustryInput = z.infer<typeof CreateIndustrySchema>
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type CreateLocationInput = z.infer<typeof CreateLocationSchema>
export type CreateSeoPageInput = z.infer<typeof CreateSeoPageSchema>
