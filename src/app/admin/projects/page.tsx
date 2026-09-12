import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentTable, type ContentRow } from '@/components/admin/content/ContentTable'
import { createServiceClient } from '@/lib/supabase/service'
import { getActingUser } from '@/lib/auth-guard'

export const metadata = { title: 'Case Studies' }
export const dynamic = 'force-dynamic'

export default async function CaseStudyListPage() {
  const acting = await getActingUser()
  const service = createServiceClient()
  const { data } = await service
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <>
      <AdminTopbar title="Case Studies" />
      <div className="p-6">
        <ContentTable
          rows={(data ?? []) as unknown as ContentRow[]}
          basePath="projects"
          publicPrefix="/projects"
          singular="Case Study"
          plural="Case Studies"
          canDelete={acting?.role === 'super_admin' || acting?.role === 'admin'}
        />
      </div>
    </>
  )
}
