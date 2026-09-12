import { createPublicSupabase } from '@/lib/supabase/public'
import type { SeoJson } from '@/lib/schemas/seo'

// Per-record SEO overlay loaders for public generateMetadata(). Each returns the
// seo_json (or {}) for the matching published record. Used with resolveSEO().

type SeoTable = 'services' | 'industries' | 'projects' | 'locations' | 'static_pages' | 'blog_posts'

async function pick<T extends string>(table: SeoTable, col: 'id' | 'slug', val: T): Promise<SeoJson> {
  try {
    const supabase = await createPublicSupabase()
    const { data } = await supabase.from(table).select('seo_json').eq(col, val).maybeSingle()
    return (data?.seo_json ?? {}) as SeoJson
  } catch {
    return {}
  }
}

export const getServiceSeo = (slug: string) => pick('services', 'slug', slug)
export const getIndustrySeo = (slug: string) => pick('industries', 'slug', slug)
export const getProjectSeo = (slug: string) => pick('projects', 'slug', slug)
export const getLocationSeo = (slug: string) => pick('locations', 'slug', slug)
export const getStaticPageSeo = (pageSlug: string) => pick('static_pages', 'slug', pageSlug)
export const getBlogPostSeo = (postSlug: string) => pick('blog_posts', 'slug', postSlug)

// Meta keyword tag (comma-separated) set via the Static Page SEO admin editor.
export async function getStaticPageMetaKeyword(pageSlug: string): Promise<string | null> {
  try {
    const supabase = await createPublicSupabase()
    const { data } = await supabase.from('static_pages').select('meta_keyword').eq('slug', pageSlug).maybeSingle()
    return data?.meta_keyword ?? null
  } catch {
    return null
  }
}
