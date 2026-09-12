import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { Accordion } from '@/components/ui/Accordion'
import { CTABanner } from '@/components/sections/CTABanner'
import { StaticPageEditProvider } from '@/components/inline-edit/StaticPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { getFaqPageContent } from '@/lib/data/content'
import { HOMEPAGE_FAQS } from '@/lib/data/agency-data'

const DEFAULT_TITLE = 'SEO Frequently Asked Questions | SEO Expert Agency'
const DEFAULT_DESC =
  'Detailed answers about our data-driven SEO methodologies, technical audits, time to results, retainers, and transparent reporting.'

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
}

export const revalidate = 86400

const EXTENDED_FAQS = [
  ...HOMEPAGE_FAQS,
  {
    question: 'How do you perform keyword research and intent mapping?',
    answer: 'We analyze real search demand, commercial intent, customer search journey stages, and competitor content gaps using industry-standard tools and proprietary clustering scripts.',
  },
  {
    question: 'What is your stance on AI-generated content for SEO?',
    answer: 'We utilize AI strictly for research and data clustering. All published content is crafted, reviewed, and enhanced by subject-matter experts to ensure high E-E-A-T signals and original value.',
  },
  {
    question: 'How do you build backlinks safely?',
    answer: 'We exclusively execute digital PR, proprietary data surveys, original research studies, and editorial outreach to secure natural, high-DR citations that never risk Google algorithmic penalties.',
  },
]

export default async function FAQPage() {
  const content = await getFaqPageContent()

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: EXTENDED_FAQS.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  return (
    <StaticPageEditProvider slug="faq" initialContent={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'FAQs' }]}
        eyebrow="CLEAR, TRANSPARENT ANSWERS"
        title={<EditableText path="hero.h1" value={content.hero.h1} as="span" />}
        subtitle={<EditableText path="hero.subheadline" value={content.hero.subheadline} as="span" multiline />}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <Accordion items={EXTENDED_FAQS} />
      </div>

      <CTABanner
        title={<EditableText path="cta_banner.headline" value={content.cta_banner.headline} as="span" />}
        subtitle={<EditableText path="cta_banner.subheadline" value={content.cta_banner.subheadline} as="span" multiline />}
        ctaLabel={content.cta_banner.button_text}
        ctaHref={content.cta_banner.button_link}
      />
    </StaticPageEditProvider>
  )
}
