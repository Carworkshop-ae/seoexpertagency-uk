'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useAdminEdit } from '@/components/inline-edit/AdminEditProvider'
import { IconPicker } from '@/components/inline-edit/IconPicker'
import { SERVICE_ICONS, SERVICE_ICON_MAP, DEFAULT_SERVICE_ICON } from '@/lib/service-icons'

// Inline "add a service" affordance rendered at the end of the service grid
// (homepage and anywhere else ServiceCardsSection appears), visible only to a
// signed-in admin with edit mode on. Posts straight to the existing services
// CRUD route — no new backend needed.
export function AddServiceCard() {
  const { isAdmin, editMode } = useAdminEdit()
  const canEdit = isAdmin && editMode
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState(SERVICE_ICONS[0].value)
  const [saving, setSaving] = useState(false)
  const Icon = SERVICE_ICON_MAP[icon] || DEFAULT_SERVICE_ICON

  if (!canEdit) return null

  async function submit() {
    if (!name.trim()) { toast.error('Service name is required'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), short_description: description.trim() || null, icon, status: 'published' }),
      })
      if (!res.ok) throw new Error('Create failed')
      toast.success('Service added')
      setName(''); setDescription(''); setIcon(SERVICE_ICONS[0].value); setAdding(false)
      router.refresh()
    } catch {
      toast.error('Could not add service — please try again')
    } finally {
      setSaving(false)
    }
  }

  if (!adding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex flex-col items-center justify-center gap-2 p-6 sm:p-7 rounded-2xl border-2 border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary-50/50 transition-all min-h-[180px]"
      >
        <Plus size={22} />
        <span className="text-sm font-bold">Add Service</span>
      </button>
    )
  }

  return (
    <div className="flex flex-col p-6 sm:p-7 rounded-2xl bg-white border-2 border-primary/40 gap-3">
      <IconPicker
        options={SERVICE_ICONS}
        value={icon}
        onSelect={setIcon}
        trigger={
          <div className="w-12 h-12 rounded-xl bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
          </div>
        }
      />
      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Service name"
        className="text-base sm:text-lg font-bold text-dark border-b border-slate-200 focus:outline-none focus:border-primary pb-1"
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Short description"
        rows={3}
        className="text-xs sm:text-sm text-slate-600 border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-primary resize-none"
      />
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          disabled={saving}
          onClick={() => void submit()}
          className="flex-1 px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => { setAdding(false); setName(''); setDescription(''); setIcon(SERVICE_ICONS[0].value) }}
          className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
