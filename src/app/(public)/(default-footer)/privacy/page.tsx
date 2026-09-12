import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { StaticPageEditProvider } from '@/components/inline-edit/StaticPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { EditableRichText } from '@/components/inline-edit/EditableRichText'
import { getPrivacyContent } from '@/lib/data/content'
import { sanitizeHTML } from '@/lib/sanitize'

export const metadata: Metadata = {
  title: 'Privacy Policy | SEO Expert Agency',
  description: 'How SEO Expert Agency collects, handles, and protects client and visitor data.',
}

export const revalidate = 86400

export default async function PrivacyPage() {
  const content = await getPrivacyContent()

  return (
    <StaticPageEditProvider slug="privacy" initialContent={content}>
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
        eyebrow="LEGAL & DATA PROTECTION"
        title={<EditableText path="h1" value={content.h1} as="span" />}
        subtitle={<>Last updated: <EditableText path="last_updated" value={content.last_updated} as="span" /></>}
        showTrust={false}
      />
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <EditableRichText
            path="content"
            value={sanitizeHTML(content.content)}
            className="rich-content text-slate-700 leading-relaxed text-base"
          />
        </div>
      </section>
    </StaticPageEditProvider>
  )
}
