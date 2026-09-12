import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { createServiceClient } from '@/lib/supabase/service'
import { STATIC_PAGE_PATHS } from '@/app/api/admin/pages/static/route'
import { StaticPageSeoTable, type StaticPageSeoRow } from './StaticPageSeoTable'

export const metadata = { title: 'Static Page SEO' }
export const dynamic = 'force-dynamic'

// SEO overview of static pages (Home, About, Contact, FAQ, Privacy, listings).
// Editing reuses the dedicated static page editors.
export default async function StaticPageSeoPage() {
  const service = createServiceClient()
  const { data } = await service
    .from('static_pages')
    .select('id, title, slug, seo_title, seo_description, meta_keyword, seo_json, status')
    .order('title')

  const rows: StaticPageSeoRow[] = (data ?? []).map(p => {
    const seo = (p.seo_json ?? {}) as { og_image?: string | null }
    return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      path: STATIC_PAGE_PATHS[p.slug] ?? `/${p.slug}`,
      status: p.status,
      seo_title: p.seo_title,
      seo_description: p.seo_description,
      meta_keyword: p.meta_keyword,
      og_image: seo.og_image ?? null,
    }
  })

  return (
    <>
      <AdminTopbar title="Static Page SEO" />
      <div className="p-6">
        <StaticPageSeoTable rows={rows} />
      </div>
    </>
  )
}
