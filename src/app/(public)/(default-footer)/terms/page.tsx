import type { Metadata } from 'next'
import { PageHeader } from '@/components/sections/PageHeader'
import { StaticPageEditProvider } from '@/components/inline-edit/StaticPageEditProvider'
import { EditableText } from '@/components/inline-edit/EditableText'
import { EditableRichText } from '@/components/inline-edit/EditableRichText'
import { getTermsContent } from '@/lib/data/content'
import { sanitizeHTML } from '@/lib/sanitize'

export const metadata: Metadata = {
  title: 'Terms of Service | SEO Expert Agency',
  description: 'Terms and conditions governing our search engine optimization services and digital retainers.',
}

export const revalidate = 86400

export default async function TermsPage() {
  const content = await getTermsContent()

  return (
    <StaticPageEditProvider slug="terms" initialContent={content}>
      <PageHeader
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Terms of Service' }]}
        eyebrow="AGREEMENT & SERVICE TERMS"
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
