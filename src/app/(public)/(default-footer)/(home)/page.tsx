import type { Metadata } from 'next'
import { createPublicSupabase } from '@/lib/supabase/public'
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
import { Reveal } from '@/components/ui/Reveal'
import { StaticPageEditProvider } from '@/components/inline-edit/StaticPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { ListControls } from '@/components/inline-edit/ListControls'
import { generateOrganizationSchema, organizationDetailsFromSettings } from '@/lib/page-engine/schema'
import { getSettings } from '@/lib/hooks/useSettings'
import { resolveSEO, seoToMetadata } from '@/lib/seo'
import { getStaticPageSeo, getStaticPageMetaKeyword } from '@/lib/get-page-seo'
import { HOMEPAGE_FAQS } from '@/lib/data/agency-data'
import { getServices, getHomeContent } from '@/lib/data/content'
import type { BlogPost, FAQItem } from '@/types'

const DEFAULT_TITLE = 'SEO Expert Agency — Data-Driven Search Engine Optimization'
const DEFAULT_DESC =
  'Grow your business with data-driven SEO strategies, technical excellence, and white-hat digital PR. Dominate high-intent search queries and scale organic revenue.'

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createPublicSupabase()
  const { data } = await supabase
    .from('static_pages')
    .select('seo_title, seo_description')
    .eq('slug', 'home')
    .eq('status', 'published')
    .maybeSingle()

  const title = data?.seo_title || DEFAULT_TITLE
  const description = data?.seo_description || DEFAULT_DESC
  const seo = resolveSEO(await getStaticPageSeo('home'), {
    title,
    description,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertsagency.co.uk',
  })
  return seoToMetadata(
    seo,
    process.env.NEXT_PUBLIC_SITE_URL || 'https://seoexpertsagency.co.uk',
    await getStaticPageMetaKeyword('home')
  )
}

export const revalidate = 3600

export default async function HomePage() {
  const supabase = createPublicSupabase()

  const [{ data: posts }, servicesToRender, content] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3),
    getServices(),
    getHomeContent(),
  ])

  const orgSchema = generateOrganizationSchema(organizationDetailsFromSettings(await getSettings()))

  // Schema.org FAQPage markup needs plain strings, so the CMS-edited FAQs
  // (when present) are kept out of the ReactNode-widened props used elsewhere
  // on this page — the accordion still shows them exactly as edited.
  const faqs: FAQItem[] = content.faq.faqs.length > 0
    ? content.faq.faqs.map(f => ({ question: f.q, answer: f.a }))
    : HOMEPAGE_FAQS

  return (
    <StaticPageEditProvider slug="home" initialContent={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      {/* 1. Hero Section with Lead Capture Form */}
      <HeroSection
        h1={<EditableText path="hero.h1" value={content.hero.h1} as="span" />}
        subtitle={<EditableText path="hero.subheadline" value={content.hero.subheadline} as="span" multiline />}
        badge={<EditableText path="hero.badge" value={content.hero.badge} as="span" />}
        ctaLabel={content.hero.cta_primary_text}
        ctaHref={content.hero.cta_primary_link}
        secondaryLabel={content.hero.cta_secondary_text}
        secondaryHref={content.hero.cta_secondary_link}
        rightSlot={<HeroLeadForm sourcePageSlug="homepage-hero" />}
      />

      {/* 2. Trust Bar */}
      <TrustBar items={content.trust_bar.stats.map((s, i) => ({
        icon: <EditableText path={`trust_bar.stats.${i}.icon`} value={s.icon || '⭐'} as="span" className="text-lg" />,
        value: <EditableText path={`trust_bar.stats.${i}.value`} value={s.value} as="span" />,
        label: <EditableText path={`trust_bar.stats.${i}.label`} value={s.label} as="span" />,
        sublabel: s.sublabel ? <EditableText path={`trust_bar.stats.${i}.sublabel`} value={s.sublabel} as="span" /> : undefined,
      }))} />
      <ListControls path="trust_bar.stats" noun="trust item" template={{ icon: '⭐', value: 'New highlight', label: 'Short label', sublabel: 'Supporting detail' }} />

      {/* 3. Core SEO Services */}
      <Reveal>
        <ServiceCardsSection
          services={servicesToRender}
          title={<EditableText path="services_section.title" value={content.services_section.title} as="span" />}
          subtitle={<EditableText path="services_section.subtitle" value={content.services_section.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="services_section.eyebrow" value={content.services_section.eyebrow} as="span" />}
        />
      </Reveal>

      {/* 4. Packages / Pricing */}
      <Reveal>
        <PackagesSection
          title={<EditableText path="packages_section.title" value={content.packages_section.title} as="span" />}
          subtitle={<EditableText path="packages_section.subtitle" value={content.packages_section.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="packages_section.eyebrow" value={content.packages_section.eyebrow} as="span" />}
        />
      </Reveal>

      {/* 5. High-Impact CTA Banner */}
      <Reveal>
        <CTABanner
          badge={<EditableText path="cta_banner.badge" value={content.cta_banner.badge} as="span" />}
          title={<EditableText path="cta_banner.headline" value={content.cta_banner.headline} as="span" />}
          subtitle={<EditableText path="cta_banner.subheadline" value={content.cta_banner.subheadline} as="span" multiline />}
          ctaLabel={<EditableText path="cta_banner.button_text" value={content.cta_banner.button_text} as="span" />}
          ctaHref={content.cta_banner.button_link}
          secondaryLabel={<EditableText path="cta_banner.secondary_text" value={content.cta_banner.secondary_text} as="span" />}
          secondaryHref={content.cta_banner.secondary_link}
        />
      </Reveal>

      {/* 6. Industries We Serve */}
      <Reveal>
        <IndustriesSection
          title={<EditableText path="industries_section.title" value={content.industries_section.title} as="span" />}
          subtitle={<EditableText path="industries_section.subtitle" value={content.industries_section.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="industries_section.eyebrow" value={content.industries_section.eyebrow} as="span" />}
        />
      </Reveal>

      {/* 7. Projects / Case Studies */}
      <Reveal>
        <ProjectsSection
          title={<EditableText path="projects_section.title" value={content.projects_section.title} as="span" />}
          subtitle={<EditableText path="projects_section.subtitle" value={content.projects_section.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="projects_section.eyebrow" value={content.projects_section.eyebrow} as="span" />}
        />
      </Reveal>

      {/* 8. 4-Step SEO Framework */}
      <Reveal>
        <ProcessSteps
          title={<EditableText path="process_steps.title" value={content.process_steps.title} as="span" />}
          subtitle={<EditableText path="process_steps.subtitle" value={content.process_steps.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="process_steps.eyebrow" value={content.process_steps.eyebrow} as="span" />}
          steps={content.process_steps.steps.map((s, i) => ({
            number: i + 1,
            title: <EditableText path={`process_steps.steps.${i}.title`} value={s.title} as="span" />,
            description: <EditableText path={`process_steps.steps.${i}.description`} value={s.description} as="span" multiline />,
          }))}
        />
      </Reveal>

      {/* 9. Why Choose Us */}
      <Reveal>
        <WhyChooseUs
          heading={<EditableText path="why_choose_us.heading" value={content.why_choose_us.heading} as="span" />}
          items={content.why_choose_us.items.map((it, i) => ({
            icon: <EditableText path={`why_choose_us.items.${i}.icon`} value={it.icon || '⭐'} as="span" />,
            title: <EditableText path={`why_choose_us.items.${i}.title`} value={it.title} as="span" />,
            description: <EditableText path={`why_choose_us.items.${i}.description`} value={it.description} as="span" multiline />,
          }))}
        />
        <ListControls path="why_choose_us.items" noun="card" min={3} template={{ icon: '⭐', title: 'New advantage', description: 'Describe this advantage in a sentence or two.' }} />
      </Reveal>

      {/* 10. Client Testimonials */}
      <Reveal>
        <TestimonialsSection
          title={<EditableText path="testimonials.title" value={content.testimonials.title} as="span" />}
          subtitle={<EditableText path="testimonials.subtitle" value={content.testimonials.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="testimonials.eyebrow" value={content.testimonials.eyebrow} as="span" />}
          testimonials={content.testimonials.items.map((t, i) => ({
            quote: <EditableText path={`testimonials.items.${i}.quote`} value={t.quote} as="span" multiline />,
            name: <EditableText path={`testimonials.items.${i}.name`} value={t.name} as="span" />,
            role: <EditableText path={`testimonials.items.${i}.role`} value={t.role} as="span" />,
            rating: t.rating,
          }))}
        />
        <ListControls path="testimonials.items" noun="testimonial" template={{ quote: 'Client feedback goes here.', name: 'Client name or title', role: 'Company or industry', rating: 5 }} />
      </Reveal>

      {/* 11. SEO Blog Preview */}
      <Reveal>
        <BlogPreview
          posts={(posts as unknown as BlogPost[]) ?? []}
          title={<EditableText path="blog_section.title" value={content.blog_section.title} as="span" />}
          subtitle={<EditableText path="blog_section.subtitle" value={content.blog_section.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="blog_section.eyebrow" value={content.blog_section.eyebrow} as="span" />}
        />
      </Reveal>

      {/* 12. FAQ Section with Schema */}
      <Reveal>
        <FAQSection
          faqs={faqs}
          title={<EditableText path="faq_section.title" value={content.faq_section.title} as="span" />}
          subtitle={<EditableText path="faq_section.subtitle" value={content.faq_section.subtitle} as="span" multiline />}
          eyebrow={<EditableText path="faq_section.eyebrow" value={content.faq_section.eyebrow} as="span" />}
        />
      </Reveal>

      {/* 13. Final Conversion CTA */}
      <Reveal>
        <FinalCTASection
          badge={<EditableText path="final_cta.badge" value={content.final_cta.badge} as="span" />}
          phoneText={<EditableText path="final_cta.phone_text" value={content.final_cta.phone_text} as="span" />}
          phoneHref={content.final_cta.phone_link}
          heading={<EditableText path="final_cta.heading" value={content.final_cta.heading} as="span" />}
          subtitle={<EditableText path="final_cta.subtitle" value={content.final_cta.subtitle} as="span" multiline />}
          ctaText={<EditableText path="final_cta.cta_text" value={content.final_cta.cta_text} as="span" />}
        />
      </Reveal>
    </StaticPageEditProvider>
  )
}
