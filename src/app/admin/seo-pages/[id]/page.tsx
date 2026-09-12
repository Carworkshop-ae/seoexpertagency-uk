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
  const [{ data }, { data: locations }] = await Promise.all([
    service.from('seo_pages').select('*').eq('id', id).maybeSingle(),
    service.from('locations').select('id, name, slug, country_code').order('name'),
  ])
  if (!data) notFound()

  const states = (locations ?? []).map(l => ({ id: l.id, name: l.name, slug: l.slug, country_code: l.country_code }))

  // Nulls become empty strings so the controlled inputs stay controlled.
  const initial = Object.fromEntries(
    Object.entries(data as Record<string, unknown>).map(([k, val]) => [k, val ?? ''])
  ) as Record<string, FieldValue>

  return (
    <>
      <AdminTopbar title="EDIT SEO PAGE" />
      <div className="p-6">
        <SeoPageForm id={id} initial={initial} states={states} />
      </div>
    </>
  )
}
