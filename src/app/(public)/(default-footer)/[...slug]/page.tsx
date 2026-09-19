import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { HeroSection } from '@/components/sections/HeroSection'
import { HeroLeadForm } from '@/components/sections/HeroLeadForm'
import { TrustBar } from '@/components/sections/TrustBar'
import { ServiceCardsSection } from '@/components/sections/ServiceCardsSection'
import { PackagesSection } from '@/components/sections/PackagesSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { IndustriesSection } from '@/components/sections/IndustriesSection'
import { ProjectsSection } from '@/components/sections/ProjectsSection'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { FAQSection } from '@/components/sections/FAQSection'
import { FinalCTASection } from '@/components/sections/FinalCTASection'
import { createPublicSupabase } from '@/lib/supabase/public'
import { generateServicePageSchema } from '@/lib/page-engine/schema'
import { CustomSchemas } from '@/components/seo/CustomSchemas'
import { sanitizeHTML } from '@/lib/sanitize'
import { SeoPageEditProvider } from '@/components/inline-edit/SeoPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { EditableRichText } from '@/components/inline-edit/EditableRichText'
import type { FAQItem, BlogPost } from '@/types'
import type { SeoJson } from '@/lib/schemas/seo'
import { getHreflangCode } from '@/lib/market'

// A freeform "general" SEO landing page. Its slug isn't nested under any fixed
// prefix, so this catch-all only ever fires for a first segment that doesn't
// match one of (default-footer)'s static routes (about, blog, contact, faq,
// lp, pricing, privacy, projects, terms, (home)) — Next.js always matches a
// static segment before a dynamic one, so a page slug colliding with one of
// those names would simply be unreachable; that's a data-entry concern for
// whoever picks the slug, not a routing bug. (services, industries and
// locations no longer have standalone public pages — services/industries
// only render as cards on the homepage, and locations has no public page at
// all — so those names are free to use as SEO page slugs now.)

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// Each shared section this page renders has no dedicated column of its own —
// per-page overrides live in `sections_json` (007_seo_page_sections.sql),
// addressed the same way static_pages.content_json is. Defaults mirror each
// component's own hardcoded copy exactly, so a page looks unchanged until an
// admin actually edits one of these.
interface SeoPageSections {
  trust_bar?: { stats?: Array<{ icon?: string; value: string; label: string; sublabel?: string }> }
  process_steps?: { title?: string; subtitle?: string; eyebrow?: string; steps?: Array<{ title: string; description: string }> }
  cta_banner?: { title?: string; subtitle?: string; cta_label?: string; secondary_label?: string }
  final_cta?: { heading?: string; subtitle?: string; cta_text?: string }
  testimonials?: { title?: string; subtitle?: string; eyebrow?: string; items?: Array<{ quote: string; name: string; role: string; rating?: number }> }
  services_section?: { title?: string; subtitle?: string; eyebrow?: string }
  packages_section?: { title?: string; subtitle?: string; eyebrow?: string }
  industries_section?: { title?: string; subtitle?: string; eyebrow?: string }
  projects_section?: { title?: string; subtitle?: string; eyebrow?: string }
  blog_section?: { title?: string; subtitle?: string; eyebrow?: string }
  faq_section?: { title?: string; subtitle?: string; eyebrow?: string }
  [key: string]: unknown
}

const getPage = cache(async (slug: string) => {
  const supabase = createPublicSupabase()
  const { data } = await supabase
    .from('seo_pages')
    .select('*, state:locations(name, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return data
})

export async function generateStaticParams() {
  const supabase = createPublicSupabase()
  const { data } = await supabase.from('seo_pages').select('slug').eq('status', 'published')
  return (data ?? []).map(p => ({ slug: p.slug.split('/') }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug.join('/'))
  if (!page) return { title: 'Not Found' }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertsagency.co.uk'
  const url = `${siteUrl}/${page.slug}`
  const title = page.seo_title || `${page.headline} | SEO Expert Agency`
  const description = page.seo_description || page.subheadline || ''

  return {
    title,
    description,
    keywords: page.meta_keyword || undefined,
    alternates: {
      canonical: url,
      languages: { [getHreflangCode()]: url, 'x-default': url },
    },
    openGraph: { title, description, url, type: 'website' },
  }
}

export const revalidate = 3600

export default async function SeoPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPage(slug.join('/'))
  if (!page) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertsagency.co.uk'
  const pageUrl = `${siteUrl}/${page.slug}`
  const faqs = (page.faq_json ?? []) as unknown as FAQItem[]
  const whyChooseUsItems = (page.why_choose_us_json ?? []) as unknown as Array<{ title: string; description: string }>
  const sections = (page.sections_json ?? {}) as SeoPageSections

  const supabase = createPublicSupabase()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  const stateName = page.state?.name

  const schema = generateServicePageSchema({
    service: page.headline ?? undefined,
    location: stateName ?? undefined,
    url: pageUrl,
    faqs,
    // No public page exists for a location anymore, so the breadcrumb trail
    // just goes Home → this page rather than through a dead intermediate URL.
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: page.headline ?? page.slug, url: `/${page.slug}` },
    ],
  })

  // Defaults match each component's own hardcoded copy — see the components
  // themselves (TrustBar, ProcessSteps, CTABanner, FinalCTASection,
  // TestimonialsSection) for the source of truth.
  const trustStats = sections.trust_bar?.stats?.length ? sections.trust_bar.stats : [
    { icon: '📈', value: 'Data-Driven SEO', label: 'Search Strategies', sublabel: 'Custom tailored roadmaps' },
    { icon: '🛡️', value: '100% White-Hat', label: 'Safe Link Building', sublabel: 'Penalty-proof compliance' },
    { icon: '📊', value: 'Transparent ROI', label: 'Live Analytics & KPIs', sublabel: 'No vanity metric fluff' },
    { icon: '🏆', value: 'Senior Strategists', label: 'Dedicated SEO Team', sublabel: 'Direct expert access' },
  ]
  const processSteps = sections.process_steps?.steps?.length ? sections.process_steps.steps : [
    { title: 'Discovery & Deep Audit', description: 'We perform deep technical crawl diagnostics, log file reviews, and comprehensive competitor keyword gap analysis.' },
    { title: 'Strategic Architecture', description: 'We map out a sprint-by-sprint 12-month roadmap prioritizing high-impact quick wins and long-term search dominance.' },
    { title: 'Execution & Optimization', description: 'Our team implements technical fixes, Core Web Vitals optimizations, semantic content clusters, and structured schema.' },
    { title: 'Authority & Revenue Scale', description: 'We earn tier-1 editorial backlinks through digital PR and continuously optimize conversion funnels for maximum pipeline.' },
  ]
  const testimonialItems = sections.testimonials?.items?.length ? sections.testimonials.items : [
    { quote: 'Our organic traffic more than doubled within two quarters, and for the first time we could actually trace pipeline revenue back to specific keyword rankings.', name: 'VP of Marketing', role: 'B2B SaaS company', rating: 5 },
    { quote: 'What stood out was the transparency — weekly rank tracking, clear technical audits, and a team that explained the "why" behind every recommendation.', name: 'Director of E-Commerce', role: 'Online retail brand', rating: 5 },
    { quote: 'We had tried two other agencies before this. The difference was having senior strategists actually doing the work instead of handing it off to juniors.', name: 'Founder', role: 'Professional services firm', rating: 5 },
  ]

  return (
    <SeoPageEditProvider
      id={page.id}
      initialContent={{
        headline: page.headline,
        subheadline: page.subheadline,
        overview: page.overview,
        why_choose_us_heading: page.why_choose_us_heading,
        why_choose_us_json: whyChooseUsItems,
        faq_json: faqs,
        sections_json: sections,
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CustomSchemas seoJson={(page.seo_json ?? {}) as SeoJson} faqs={faqs} />

      {/* 1. Hero — H1 + short paragraph */}
      <HeroSection
        h1={<EditableText path="headline" value={page.headline || page.slug} as="span" />}
        subtitle={<EditableText path="subheadline" value={page.subheadline || ''} as="span" multiline />}
        rightSlot={<HeroLeadForm sourcePageSlug={`seo-page-${page.slug}`} />}
      />

      {/* 2. Trust Bar */}
      <TrustBar items={trustStats.map((s, i) => ({
        icon: s.icon ? <span className="text-lg">{s.icon}</span> : undefined,
        value: <EditableText path={`sections_json.trust_bar.stats.${i}.value`} value={s.value} as="span" />,
        label: <EditableText path={`sections_json.trust_bar.stats.${i}.label`} value={s.label} as="span" />,
        sublabel: s.sublabel ? <EditableText path={`sections_json.trust_bar.stats.${i}.sublabel`} value={s.sublabel} as="span" /> : undefined,
      }))} />

      {/* 3. Core SEO Services */}
      <ServiceCardsSection
        title={<EditableText path="sections_json.services_section.title" value={sections.services_section?.title || 'Our Core SEO Services'} as="span" />}
        subtitle={<EditableText path="sections_json.services_section.subtitle" value={sections.services_section?.subtitle || 'Data-backed search optimization strategies engineered to scale high-intent traffic, dominate keywords, and grow organic revenue.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.services_section.eyebrow" value={sections.services_section?.eyebrow || 'WHAT WE DELIVER'} as="span" />}
      />

      {/* 4. Packages / Pricing */}
      <PackagesSection
        title={<EditableText path="sections_json.packages_section.title" value={sections.packages_section?.title || 'Predictable, Transparent SEO Packages'} as="span" />}
        subtitle={<EditableText path="sections_json.packages_section.subtitle" value={sections.packages_section?.subtitle || 'Choose the ideal engagement tier engineered to outpace your competitors and scale organic customer acquisition.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.packages_section.eyebrow" value={sections.packages_section?.eyebrow || 'TRANSPARENT PRICING'} as="span" />}
      />

      {/* 5. CTA Banner */}
      <CTABanner
        title={<EditableText path="sections_json.cta_banner.title" value={sections.cta_banner?.title || 'Ready to Grow Your Search Visibility?'} as="span" />}
        subtitle={<EditableText path="sections_json.cta_banner.subtitle" value={sections.cta_banner?.subtitle || 'Schedule a 30-minute discovery call with our senior SEO strategists and receive a free comprehensive technical & keyword opportunity audit.'} as="span" multiline />}
      />

      {/* 6. Industries We Serve */}
      <IndustriesSection
        title={<EditableText path="sections_json.industries_section.title" value={sections.industries_section?.title || 'Tailored SEO for High-Growth Industries'} as="span" />}
        subtitle={<EditableText path="sections_json.industries_section.subtitle" value={sections.industries_section?.subtitle || 'Every industry operates under distinct search dynamics. We build bespoke search strategies that address the exact buyer intent and competitive barriers of your market.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.industries_section.eyebrow" value={sections.industries_section?.eyebrow || 'SPECIALIZED EXPERTISE'} as="span" />}
      />

      {/* 7. Projects / Case Studies */}
      <ProjectsSection
        title={<EditableText path="sections_json.projects_section.title" value={sections.projects_section?.title || 'Proven Organic Growth Case Studies'} as="span" />}
        subtitle={<EditableText path="sections_json.projects_section.subtitle" value={sections.projects_section?.subtitle || 'Discover how our technical architecture audits, strategic content hubs, and authority campaigns deliver predictable commercial search impact.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.projects_section.eyebrow" value={sections.projects_section?.eyebrow || 'PROVEN METHODOLOGY'} as="span" />}
      />

      {/* 8. 4-Step SEO Framework */}
      <ProcessSteps
        title={<EditableText path="sections_json.process_steps.title" value={sections.process_steps?.title || 'Our Proven 4-Step SEO Framework'} as="span" />}
        subtitle={<EditableText path="sections_json.process_steps.subtitle" value={sections.process_steps?.subtitle || 'A systematic, repeatable methodology that turns search engines into your most predictable customer acquisition channel.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.process_steps.eyebrow" value={sections.process_steps?.eyebrow || 'HOW WE DELIVER RESULTS'} as="span" />}
        steps={processSteps.map((s, i) => ({
          number: i + 1,
          title: <EditableText path={`sections_json.process_steps.steps.${i}.title`} value={s.title} as="span" />,
          description: <EditableText path={`sections_json.process_steps.steps.${i}.description`} value={s.description} as="span" multiline />,
        }))}
      />

      {/* 9. Why Choose Us */}
      <WhyChooseUs
        heading={<EditableText path="why_choose_us_heading" value={page.why_choose_us_heading || 'Why Ambitious Brands Choose SEO Expert Agency'} as="span" />}
        items={whyChooseUsItems.length > 0 ? whyChooseUsItems.map((it, i) => ({
          title: <EditableText path={`why_choose_us_json.${i}.title`} value={it.title} as="span" />,
          description: <EditableText path={`why_choose_us_json.${i}.description`} value={it.description} as="span" multiline />,
        })) : undefined}
      />

      {/* 10. Long-form SEO content */}
      {page.overview && (
        <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EditableRichText path="overview" value={sanitizeHTML(page.overview)} className="rich-content" />
          </div>
        </section>
      )}

      {/* 11. Client Testimonials */}
      <TestimonialsSection
        title={<EditableText path="sections_json.testimonials.title" value={sections.testimonials?.title || 'Trusted by Growth-Focused Teams'} as="span" />}
        subtitle={<EditableText path="sections_json.testimonials.subtitle" value={sections.testimonials?.subtitle || 'Real feedback from clients who partnered with us to turn organic search into a predictable revenue channel.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.testimonials.eyebrow" value={sections.testimonials?.eyebrow || 'CLIENT REVIEWS'} as="span" />}
        testimonials={testimonialItems.map((t, i) => ({
          quote: <EditableText path={`sections_json.testimonials.items.${i}.quote`} value={t.quote} as="span" multiline />,
          name: <EditableText path={`sections_json.testimonials.items.${i}.name`} value={t.name} as="span" />,
          role: <EditableText path={`sections_json.testimonials.items.${i}.role`} value={t.role} as="span" />,
          rating: t.rating,
        }))}
      />

      {/* 12. SEO Blog Preview */}
      <BlogPreview
        posts={(posts as unknown as BlogPost[]) ?? []}
        title={<EditableText path="sections_json.blog_section.title" value={sections.blog_section?.title || 'Latest SEO Insights & Search Research'} as="span" />}
        subtitle={<EditableText path="sections_json.blog_section.subtitle" value={sections.blog_section?.subtitle || 'Actionable guides, technical breakdowns, and algorithm analysis from our search marketing strategists.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.blog_section.eyebrow" value={sections.blog_section?.eyebrow || 'KNOWLEDGE & INSIGHTS'} as="span" />}
      />

      {/* 13. FAQ */}
      <FAQSection
        faqs={faqs}
        title={<EditableText path="sections_json.faq_section.title" value={sections.faq_section?.title || (page.headline ? `${page.headline} FAQs` : 'Frequently Asked Questions')} as="span" />}
        subtitle={<EditableText path="sections_json.faq_section.subtitle" value={sections.faq_section?.subtitle || 'Clear answers to common questions about our data-driven SEO methodologies, retainers, and timelines.'} as="span" multiline />}
        eyebrow={<EditableText path="sections_json.faq_section.eyebrow" value={sections.faq_section?.eyebrow || 'QUESTIONS & ANSWERS'} as="span" />}
        includeSchema={false}
      />

      {/* 14. Final CTA */}
      <FinalCTASection
        heading={<EditableText path="sections_json.final_cta.heading" value={sections.final_cta?.heading || "Let's Build Your Search Growth Strategy"} as="span" />}
        subtitle={<EditableText path="sections_json.final_cta.subtitle" value={sections.final_cta?.subtitle || 'Get in touch today for an in-depth competitive search audit, technical roadmap, and predictable organic growth plan.'} as="span" multiline />}
        ctaText={<EditableText path="sections_json.final_cta.cta_text" value={sections.final_cta?.cta_text || 'Book a Free Consultation'} as="span" />}
      />
    </SeoPageEditProvider>
  )
}
