import { revalidatePath, revalidateTag } from 'next/cache'

// The four CMS-managed marketing content types, plus blog and static pages.
export type RevalidateType =
  | 'blog'
  | 'service'
  | 'industry'
  | 'project'
  | 'location'
  | 'package'
  | 'seo_page'
  | 'static'
  | 'all'

// Static-page slug → public path(s). Covers content pages + listing slugs.
const STATIC_PATHS: Record<string, string[]> = {
  home: ['/'],
  about: ['/about'],
  contact: ['/contact'],
  faq: ['/faq'],
  privacy: ['/privacy'],
  terms: ['/terms'],
  'blog-listing': ['/blog'],
  blog: ['/blog'],
}

// Detail path + the listing that indexes it, per content type. The homepage is
// added on top for projects because it surfaces there. Services and
// industries have no standalone public pages — they only render as cards on
// the homepage. Locations has no public page at all anymore (admin CRUD
// stays only to feed the SEO Page geo-targeting picker) — nothing public to
// revalidate.
const CONTENT_PATHS: Record<'service' | 'industry' | 'project' | 'location', (slug?: string) => string[]> = {
  service:  () => ['/'],
  industry: () => ['/'],
  project:  slug => [`/projects/${slug}`, '/projects', '/'],
  location: () => [],
}

// The Supabase table each type reads from, matching the `supabase:<table>` tag
// createPublicSupabase() attaches to every REST fetch (see supabase/public.ts).
// revalidatePath() alone clears the rendered page (Full Route Cache) but NOT
// the separate Data Cache entry for the underlying fetch — a route with
// `export const revalidate = N` caches that fetch for N seconds regardless of
// the page-level purge. Without also busting the tag, a publish/edit/delete
// can appear to do nothing for up to an hour.
const TABLE_FOR_TYPE: Record<'service' | 'industry' | 'project' | 'location' | 'package' | 'blog' | 'seo_page', string> = {
  service: 'services', industry: 'industries', project: 'projects',
  location: 'locations', package: 'packages', blog: 'blog_posts', seo_page: 'seo_pages',
}

// Single source of truth for which public paths an entity change must refresh.
// Used by both the direct helper (admin routes) and the /api/revalidate webhook.
export function pathsForRevalidate(type: RevalidateType, slug?: string): string[] {
  switch (type) {
    case 'blog': return [`/blog/${slug}`, '/blog']
    case 'service':
    case 'industry':
    case 'project':
    case 'location':
      return slug ? CONTENT_PATHS[type](slug) : []
    // Packages only ever render on the homepage — no slug/detail path to key on.
    case 'package': return ['/']
    // The slug already IS the full public path (`{location}/{service}`), not
    // nested under a fixed prefix like the four types above.
    case 'seo_page': return slug ? [`/${slug}`] : []
    case 'static': return slug ? (STATIC_PATHS[slug] ?? [`/${slug}`]) : []
    case 'all': return ['/']
    default: return []
  }
}

// Direct, in-process ISR invalidation for use inside admin API routes (after a
// successful save). No HTTP round-trip — calls revalidatePath directly, same as
// the SEO handler. Always best-effort: never throws, never fails the save.
export async function revalidatePage(type: RevalidateType, slug?: string): Promise<void> {
  try {
    if (type === 'all') { revalidatePath('/', 'layout'); return }
    for (const p of pathsForRevalidate(type, slug)) {
      try { revalidatePath(p) } catch { /* best-effort per path */ }
    }
    const table = type in TABLE_FOR_TYPE ? TABLE_FOR_TYPE[type as keyof typeof TABLE_FOR_TYPE] : undefined
    if (table) {
      try { revalidateTag(`supabase:${table}`, 'default') } catch { /* best-effort */ }
    }
  } catch (err) {
    console.error('revalidatePage error:', err)
  }
}
