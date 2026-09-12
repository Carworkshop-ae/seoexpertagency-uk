import { createServiceClient } from '@/lib/supabase/service'

// Tables whose published rows render a public page with its own metadata.
const SEO_TABLES = ['services', 'industries', 'projects', 'locations', 'seo_pages', 'blog_posts', 'static_pages'] as const
type SeoTable = (typeof SEO_TABLES)[number]

export interface SeoHealth {
  total: number
  missingMetaTitle: number
  missingMetaDescription: number
  noindex: number
  withCustomSeo: number
}

// Aggregated SEO coverage across every CMS-managed public page. Counts are
// summed per table rather than queried once, because these live in separate
// tables sharing a column convention (seo_title / seo_description / seo_json)
// rather than a single pages table.
export async function getSeoHealth(): Promise<SeoHealth> {
  const sb = createServiceClient()

  const perTable = await Promise.all(
    SEO_TABLES.map(async (table: SeoTable) => {
      const base = () => sb.from(table).select('*', { count: 'exact', head: true }).eq('status', 'published')
      const [total, noTitle, noDesc, noindex, custom] = await Promise.all([
        base(),
        base().or('seo_title.is.null,seo_title.eq.'),
        base().or('seo_description.is.null,seo_description.eq.'),
        base().ilike('seo_json->>robots', '%noindex%'),
        base().neq('seo_json', '{}'),
      ])
      return {
        total: total.count ?? 0,
        missingMetaTitle: noTitle.count ?? 0,
        missingMetaDescription: noDesc.count ?? 0,
        noindex: noindex.count ?? 0,
        withCustomSeo: custom.count ?? 0,
      }
    })
  )

  return perTable.reduce<SeoHealth>((acc, t) => ({
    total: acc.total + t.total,
    missingMetaTitle: acc.missingMetaTitle + t.missingMetaTitle,
    missingMetaDescription: acc.missingMetaDescription + t.missingMetaDescription,
    noindex: acc.noindex + t.noindex,
    withCustomSeo: acc.withCustomSeo + t.withCustomSeo,
  }), { total: 0, missingMetaTitle: 0, missingMetaDescription: 0, noindex: 0, withCustomSeo: 0 })
}
