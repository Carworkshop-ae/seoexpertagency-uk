import { notFound } from 'next/navigation'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentForm, type FieldValue } from '@/components/admin/content/ContentForm'
import { projectSections } from '@/components/admin/content/specs'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata = { title: 'Edit Case Study' }
export const dynamic = 'force-dynamic'

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = createServiceClient()
  const { data } = await service.from('projects').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()

  // Nulls become empty strings so the controlled inputs stay controlled.
  const initial = Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([k, val]) => [k, val ?? ''])
  ) as Record<string, FieldValue>

  return (
    <>
      <AdminTopbar title="EDIT CASE STUDY" />
      <div className="p-6">
        <ContentForm
          id={id}
          basePath="projects"
          publicPrefix="/projects"
          singular="Case Study"
          titleField="title"
          sections={projectSections}
          initial={initial}
        />
      </div>
    </>
  )
}
