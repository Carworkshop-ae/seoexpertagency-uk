import { notFound } from 'next/navigation'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ContentForm, type FieldValue } from '@/components/admin/content/ContentForm'
import { locationSections } from '@/components/admin/content/specs'
import { createServiceClient } from '@/lib/supabase/service'

export const metadata = { title: 'Edit Location' }
export const dynamic = 'force-dynamic'

export default async function EditLocationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = createServiceClient()
  const { data } = await service.from('locations').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()

  // Nulls become empty strings so the controlled inputs stay controlled.
  const initial = Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([k, val]) => [k, val ?? ''])
  ) as Record<string, FieldValue>

  return (
    <>
      <AdminTopbar title="EDIT LOCATION" />
      <div className="p-6">
        <ContentForm
          id={id}
          basePath="locations"
          singular="Location"
          titleField="name"
          sections={locationSections}
          initial={initial}
        />
      </div>
    </>
  )
}
