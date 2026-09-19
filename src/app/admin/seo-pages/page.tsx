import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SeoPagesTable, type SeoPageRow } from '@/components/admin/seo-pages/SeoPagesTable'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'

export const metadata = { title: 'SEO Pages' }
export const dynamic = 'force-dynamic'

export default async function SeoPagesListPage() {
  const acting = await getActingUser()
  const service = createServiceClient()
  // The API caps a single response at max_rows (1000); page through it so a
  // large catalogue is never silently truncated. `id` breaks sort_order ties
  // so rows can't repeat or vanish between chunks.
  const CHUNK = 1000
  const data: unknown[] = []
  for (let from = 0; ; from += CHUNK) {
    const { data: chunk } = await service
      .from('seo_pages')
      .select('id, slug, status, sort_order, updated_at, title:headline, seo_title, faq_json, creator:users!created_by(full_name)')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true })
      .range(from, from + CHUNK - 1)
    data.push(...(chunk ?? []))
    if (!chunk || chunk.length < CHUNK) break
  }

  return (
    <>
      <AdminTopbar title="SEO Pages" />
      <div className="p-6">
        <SeoPagesTable
          rows={data as SeoPageRow[]}
          canDelete={acting?.role === 'super_admin' || acting?.role === 'admin'}
        />
      </div>
    </>
  )
}
