import { renderSchemas } from '@/lib/seo'
import type { SeoJson } from '@/lib/schemas/seo'

interface Props {
  /** The row's `seo_json` overlay, as edited in the admin SEO panel. */
  seoJson: SeoJson | null | undefined
  faqs?: Array<{ question: string; answer: string }>
}

// Emits the JSON-LD entries an editor added under admin → SEO → Schema.
//
// Without this the `schemas` array in seo_json was stored and editable but
// never reached the page — the panel looked functional and did nothing. The
// automatic per-page schema (Service / BreadcrumbList / FAQPage) is still
// emitted by the pages themselves; these are the manual additions on top.
export function CustomSchemas({ seoJson, faqs }: Props) {
  const entries = seoJson?.schemas
  if (!entries || entries.length === 0) return null

  const blocks = renderSchemas(entries, { faqs })
  if (blocks.length === 0) return null

  return (
    <>
      {blocks.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
    </>
  )
}
