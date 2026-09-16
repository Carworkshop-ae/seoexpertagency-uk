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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.co.uk'
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertagency.co.uk'
  const pageUrl = `${siteUrl}/${page.slug}`
  const faqs = (page.faq_json ?? []) as unknown as FAQItem[]
  const whyChooseUsItems = (page.why_choose_us_json ?? []) as unknown as Array<{ title: string; description: string }>

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CustomSchemas seoJson={(page.seo_json ?? {}) as SeoJson} faqs={faqs} />

      {/* 1. Hero — H1 + short paragraph */}
      <HeroSection
        h1={page.headline || page.slug}
        subtitle={page.subheadline || undefined}
        rightSlot={<HeroLeadForm sourcePageSlug={`seo-page-${page.slug}`} />}
      />

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Core SEO Services */}
      <ServiceCardsSection />

      {/* 4. Packages / Pricing */}
      <PackagesSection />

      {/* 5. CTA Banner */}
      <CTABanner />

      {/* 6. Industries We Serve */}
      <IndustriesSection />

      {/* 7. Projects / Case Studies */}
      <ProjectsSection />

      {/* 8. 4-Step SEO Framework */}
      <ProcessSteps />

      {/* 9. Why Choose Us */}
      <WhyChooseUs
        heading={page.why_choose_us_heading || undefined}
        items={whyChooseUsItems.length > 0 ? whyChooseUsItems : undefined}
      />

      {/* 10. Long-form SEO content */}
      {page.overview && (
        <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rich-content">
            <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(page.overview) }} />
          </div>
        </section>
      )}

      {/* 11. Client Testimonials */}
      <TestimonialsSection />

      {/* 12. SEO Blog Preview */}
      <BlogPreview posts={(posts as unknown as BlogPost[]) ?? []} />

      {/* 13. FAQ */}
      <FAQSection faqs={faqs} title={page.headline ? `${page.headline} FAQs` : undefined} includeSchema={false} />

      {/* 14. Final CTA */}
      <FinalCTASection />
    </>
  )
}
