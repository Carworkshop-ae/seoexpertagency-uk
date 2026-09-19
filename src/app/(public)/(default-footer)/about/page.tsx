import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { ProcessSteps } from '@/components/sections/ProcessSteps'
import { FAQSection } from '@/components/sections/FAQSection'
import { CTABanner } from '@/components/sections/CTABanner'
import { StaticPageEditProvider } from '@/components/inline-edit/StaticPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { generateOrganizationSchema, organizationDetailsFromSettings } from '@/lib/page-engine/schema'
import { getSettings } from '@/lib/hooks/useSettings'
import { getAboutContent } from '@/lib/data/content'
import { HOMEPAGE_FAQS } from '@/lib/data/agency-data'

const DEFAULT_TITLE = 'About SEO Expert Agency | Data-Driven Search Engine Optimization'
const DEFAULT_DESC =
  'SEO Expert Agency is a data-driven search engine optimization consultancy delivering predictable organic revenue growth through technical rigor, semantic content, and white-hat link acquisition.'

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
}

export const revalidate = 86400

export default async function AboutPage() {
  const [schema, content] = await Promise.all([
    getSettings().then(s => generateOrganizationSchema(organizationDetailsFromSettings(s))),
    getAboutContent(),
  ])

  const faqs = content.faq.faqs.length > 0
    ? content.faq.faqs.map(f => ({ question: f.q, answer: f.a }))
    : HOMEPAGE_FAQS

  return (
    <StaticPageEditProvider slug="about" initialContent={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
        eyebrow="OUR MISSION & PHILOSOPHY"
        title={<EditableText path="hero.h1" value={content.hero.h1} as="span" />}
        subtitle={<EditableText path="hero.subheadline" value={content.hero.subheadline} as="span" multiline />}
      />

      {/* Agency Philosophy Section */}
      <section className="py-16 lg:py-20 bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-slate-700 leading-relaxed text-base sm:text-lg">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark mb-4">
              <EditableText path="philosophy.heading" value={content.philosophy.heading} as="span" />
            </h2>
            <p>
              <EditableText path="philosophy.intro_paragraph" value={content.philosophy.intro_paragraph} as="span" multiline />
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-dark mb-3">
              <EditableText path="philosophy.tech_heading" value={content.philosophy.tech_heading} as="span" />
            </h3>
            <p>
              <EditableText path="philosophy.tech_paragraph" value={content.philosophy.tech_paragraph} as="span" multiline />
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars */}
      <section className="py-16 lg:py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-wider uppercase mb-2 inline-block">
              OUR CORE VALUES
            </span>
            <h2 className="display-tight text-balance text-2xl sm:text-3xl font-extrabold text-dark">
              The Principles That Guide Every Campaign
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {content.pillars.map((pillar, idx) => (
              <div key={idx} className="card-premium p-7 sm:p-8 rounded-2xl bg-white border border-slate-200/80 flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-xl">
                  {pillar.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-dark mb-1.5">
                    <EditableText path={`pillars.${idx}.title`} value={pillar.title} as="span" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <EditableText path={`pillars.${idx}.description`} value={pillar.description} as="span" multiline />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology */}
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

      {/* Why Choose Us */}
      <WhyChooseUs
        heading={<EditableText path="why_choose_us.heading" value={content.why_choose_us.heading} as="span" />}
        items={content.why_choose_us.items.map((it, i) => ({
          icon: it.icon,
          title: <EditableText path={`why_choose_us.items.${i}.title`} value={it.title} as="span" />,
          description: <EditableText path={`why_choose_us.items.${i}.description`} value={it.description} as="span" multiline />,
        }))}
      />

      {/* FAQs */}
      <FAQSection faqs={faqs} />

      {/* CTA */}
      <CTABanner
        title={<EditableText path="cta_banner.headline" value={content.cta_banner.headline} as="span" />}
        subtitle={<EditableText path="cta_banner.subheadline" value={content.cta_banner.subheadline} as="span" multiline />}
        ctaLabel={content.cta_banner.button_text}
        ctaHref={content.cta_banner.button_link}
      />
    </StaticPageEditProvider>
  )
}
