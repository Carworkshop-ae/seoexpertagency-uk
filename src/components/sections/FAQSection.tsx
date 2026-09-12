import { Accordion } from '@/components/ui/Accordion'
import { HOMEPAGE_FAQS } from '@/lib/data/agency-data'
import type { FAQItem } from '@/types'

interface FAQSectionProps {
  faqs?: FAQItem[]
  title?: string
  subtitle?: string
  eyebrow?: string
  includeSchema?: boolean
}

export function FAQSection({
  faqs = HOMEPAGE_FAQS,
  title = 'Frequently Asked Questions',
  subtitle = 'Clear answers to common questions about our data-driven SEO methodologies, retainers, and timelines.',
  eyebrow = 'QUESTIONS & ANSWERS',
  includeSchema = true,
}: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null

  const faqSchema = includeSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.answer,
          },
        })),
      }
    : null

  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 border-b border-slate-100" id="faq" aria-labelledby="faq-heading">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="faq-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <Accordion items={faqs} />
      </div>
    </section>
  )
}
