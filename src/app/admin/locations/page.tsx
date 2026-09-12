import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentTable, type ContentRow } from '@/components/admin/content/ContentTable'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'

export const metadata = { title: 'Locations' }
export const dynamic = 'force-dynamic'

export default async function LocationListPage() {
  const acting = await getActingUser()
  const service = createServiceClient()
  const { data } = await service
    .from('locations')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <>
      <AdminTopbar title="Locations" />
      <div className="p-6">
        <ContentTable
          rows={(data ?? []) as unknown as ContentRow[]}
          basePath="locations"
          singular="Location"
          plural="Locations"
          canDelete={acting?.role === 'super_admin' || acting?.role === 'admin'}
        />
      </div>
    </>
  )
}
