import type { Metadata } from 'next'
import { ContactForm } from './ContactForm'
import { getServices, getContactContent } from '@/lib/data/content'
import { FAQSection } from '@/components/sections/FAQSection'
import { StaticPageEditProvider } from '@/components/inline-edit/StaticPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { generateOrganizationSchema, organizationDetailsFromSettings } from '@/lib/page-engine/schema'
import { getSettings } from '@/lib/hooks/useSettings'

const DEFAULT_TITLE = 'Contact Our Senior SEO Strategists | SEO Expert Agency'
const DEFAULT_DESC =
  'Schedule a free organic search consultation, request a custom technical audit, or discuss enterprise SEO retainers with our senior directors.'

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESC,
}

export const revalidate = 3600

export default async function ContactPage() {
  const [services, schema, content] = await Promise.all([
    getServices(),
    getSettings().then(s => generateOrganizationSchema(organizationDetailsFromSettings(s))),
    getContactContent(),
  ])

  return (
    <StaticPageEditProvider slug="contact" initialContent={content}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ContactForm
        services={services}
        heroH1={<EditableText path="hero.h1" value={content.hero.h1} as="span" />}
        heroSubtitle={<EditableText path="hero.subheadline" value={content.hero.subheadline} as="span" multiline />}
      />
      <FAQSection />
    </StaticPageEditProvider>
  )
}
