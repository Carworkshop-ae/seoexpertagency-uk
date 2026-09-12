'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { AdminSectionCard } from '@/components/admin/ui/AdminSectionCard'
import { AdminInput, AdminSelect, AdminLabel } from '@/components/admin/ui/AdminField'
import { AdminButton } from '@/components/admin/ui/AdminButton'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { COUNTRIES } from '@/lib/countries'

export interface FaqFormValues {
  country: string
  name: string
  description_html: string
  display_order: number
  is_active: boolean
}

export const EMPTY_FAQ: FaqFormValues = {
  country: 'AE', name: '', description_html: '',
  display_order: 0, is_active: true,
}

interface Props {
  faqId?: string
  initial: FaqFormValues
}

export function FaqForm({ faqId, initial }: Props) {
  const router = useRouter()
  const [v, setV] = useState<FaqFormValues>(initial)
  const [saving, setSaving] = useState(false)

  const set = <K extends keyof FaqFormValues>(key: K, value: FaqFormValues[K]) =>
    setV(prev => ({ ...prev, [key]: value }))

  async function save(exitAfter: boolean) {
    if (!v.name) { toast.error('Name is required'); return }
    setSaving(true)
    const res = await fetch(faqId ? `/api/admin/faqs/${faqId}` : '/api/admin/faqs', {
      method: faqId ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(v),
    })
    setSaving(false)
    if (!res.ok) {
      const d = await res.json().catch(() => null) as { error?: string } | null
      toast.error(d?.error ?? 'Save failed')
      return
    }
    toast.success('Saved')
    if (exitAfter) router.push('/admin/faqs')
    else if (!faqId) {
      const d = await res.json() as { id?: string }
      if (d.id) router.replace(`/admin/faqs/${d.id}`)
    }
    router.refresh()
  }

  return (
    <div className="max-w-5xl space-y-5">
      <AdminSectionCard title="General Details" headerColor="#22C55E">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminSelect label="Country" required value={v.country} onChange={e => set('country', e.target.value)} options={COUNTRIES.map(c => ({ value: c.code, label: c.name }))} />
          <AdminInput label="Name" required value={v.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div>
          <AdminLabel>Description</AdminLabel>
          <RichTextEditor value={v.description_html} onChange={html => set('description_html', html)} minHeight={200} />
        </div>
      </AdminSectionCard>

      <AdminSectionCard title="Display Information" headerColor="#22C55E">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <AdminInput label="Display Order" required type="number" min={0} value={String(v.display_order)} onChange={e => set('display_order', Number(e.target.value) || 0)} />
          <div>
            <AdminLabel required>Display</AdminLabel>
            <div className="flex items-center gap-5 h-10">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="display" checked={v.is_active} onChange={() => set('is_active', true)} /> Yes
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="display" checked={!v.is_active} onChange={() => set('is_active', false)} /> No
              </label>
            </div>
          </div>
        </div>
      </AdminSectionCard>

      <div className="flex gap-3">
        <AdminButton variant="success" loading={saving} onClick={() => void save(false)}>SAVE &amp; KEEP EDITING</AdminButton>
        <AdminButton variant="success" loading={saving} onClick={() => void save(true)}>SAVE &amp; EXIT</AdminButton>
        <AdminButton variant="outline" onClick={() => router.push('/admin/faqs')}>Cancel</AdminButton>
      </div>
    </div>
  )
}
