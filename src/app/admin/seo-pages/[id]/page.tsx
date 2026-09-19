import { notFound } from 'next/navigation'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SeoPageForm } from '@/components/admin/seo-pages/SeoPageForm'
import { createServiceClient } from '@/lib/supabase/service'
import type { FieldValue } from '@/components/admin/content/ContentForm'

export const metadata = { title: 'Edit SEO Page' }
export const dynamic = 'force-dynamic'

export default async function EditSeoPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = createServiceClient()
  const { data } = await service.from('seo_pages').select('*').eq('id', id).maybeSingle()
  if (!data) notFound()

  // Nulls become empty strings so the controlled inputs stay controlled.
  const initial = Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([k, val]) => [k, val ?? ''])
  ) as Record<string, FieldValue>

  return (
    <>
      <AdminTopbar title="EDIT SEO PAGE" />
      <div className="p-6">
        <SeoPageForm id={id} initial={initial} />
      </div>
    </>
  )
}
