'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { useAdminEdit } from '@/components/inline-edit/AdminEditProvider'
import { IconPicker } from '@/components/inline-edit/IconPicker'
import { INDUSTRY_ICONS, INDUSTRY_ICON_MAP, DEFAULT_INDUSTRY_ICON } from '@/lib/industry-icons'

// Inline "add an industry" affordance rendered at the end of the industry
// grid (homepage), visible only to a signed-in admin with edit mode on.
// Posts straight to the existing industries CRUD route — no new backend needed.
export function AddIndustryCard() {
  const { isAdmin, editMode, cards } = useAdminEdit()
  const canEdit = isAdmin && editMode
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState(INDUSTRY_ICONS[0].value)
  const Icon = INDUSTRY_ICON_MAP[icon] || DEFAULT_INDUSTRY_ICON

  if (!canEdit) return null

  // Buffered until "Done Editing": the new card shows here as unpublished and
  // is only created (and made public) when the admin publishes their changes.
  function submit() {
    if (!name.trim()) { toast.error('Industry name is required'); return }
    cards.create('industries', { name: name.trim(), short_description: description.trim() || null, icon, status: 'published' }, `Add ${name.trim()}`)
    setName(''); setDescription(''); setIcon(INDUSTRY_ICONS[0].value); setAdding(false)
  }

  const wrap = (node: React.ReactNode) => (
    <>
      {cards.pendingCreates('industries').map(c => {
        const PIcon = INDUSTRY_ICON_MAP[String(c.body.icon)] || DEFAULT_INDUSTRY_ICON
        return (
          <div key={c.tempId} className="flex flex-col p-6 sm:p-7 rounded-2xl bg-white border-2 border-dashed border-amber-400/70">
            <div className="w-12 h-12 rounded-xl bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center mb-5">
              <PIcon className="w-6 h-6 text-primary" strokeWidth={1.8} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-dark mb-2">{String(c.body.name)}</h3>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">{String(c.body.short_description ?? '')}</p>
            <span className="mt-auto pt-3 text-[11px] font-bold text-amber-600 uppercase tracking-wider">Unpublished — publishes on Done Editing</span>
          </div>
        )
      })}
      {node}
    </>
  )

  if (!adding) {
    return wrap(
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex flex-col items-center justify-center gap-2 p-6 sm:p-7 rounded-2xl border-2 border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary-50/50 transition-all min-h-[180px]"
      >
        <Plus size={22} />
        <span className="text-sm font-bold">Add Industry</span>
      </button>
    )
  }

  return wrap(
    <div className="flex flex-col p-6 sm:p-7 rounded-2xl bg-white border-2 border-primary/40 gap-3">
      <IconPicker
        options={INDUSTRY_ICONS}
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
        placeholder="Industry name"
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
          onClick={submit}
          className="flex-1 px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold disabled:opacity-60"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => { setAdding(false); setName(''); setDescription(''); setIcon(INDUSTRY_ICONS[0].value) }}
          className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
