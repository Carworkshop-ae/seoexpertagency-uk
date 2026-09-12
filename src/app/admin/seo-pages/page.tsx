import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SeoPagesTable, type SeoPageRow } from '@/components/admin/seo-pages/SeoPagesTable'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'

export const metadata = { title: 'SEO Pages' }
export const dynamic = 'force-dynamic'

export default async function SeoPagesListPage() {
  const acting = await getActingUser()
  const service = createServiceClient()
  const { data } = await service
    .from('seo_pages')
    .select('id, slug, status, sort_order, updated_at, title:headline, seo_title, faq_json, state:locations(name), creator:users!created_by(full_name)')
    .order('sort_order', { ascending: true })

  return (
    <>
      <AdminTopbar title="SEO Pages" />
      <div className="p-6">
        <SeoPagesTable
          rows={(data ?? []) as unknown as SeoPageRow[]}
          canDelete={acting?.role === 'super_admin' || acting?.role === 'admin'}
        />
      </div>
    </>
  )
}
