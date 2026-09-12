'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { SERVICE_ICONS, SERVICE_ICON_MAP, DEFAULT_SERVICE_ICON } from '@/lib/service-icons'
import { EditableText } from '@/components/inline-edit/EditableText'
import { IconPicker } from '@/components/inline-edit/IconPicker'
import { useAdminEdit } from '@/components/inline-edit/AdminEditProvider'
import type { SEOServiceData } from '@/lib/data/agency-data'

interface ServiceFeatureCardProps {
  service?: Partial<SEOServiceData> & {
    name?: string
    slug?: string
    shortDescription?: string
    icon?: string
  }
}

async function patchService(id: string, patch: Record<string, unknown>) {
  const res = await fetch(`/api/admin/services/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  })
  if (!res.ok) throw new Error('Save failed')
}

export function ServiceFeatureCard({ service }: ServiceFeatureCardProps) {
  const router = useRouter()
  const { isAdmin, editMode } = useAdminEdit()
  const canEdit = isAdmin && editMode
  const name = service?.name || 'SEO Service'
  const description = service?.shortDescription || ''
  const iconKey = service?.icon || 'search'
  const Icon = SERVICE_ICON_MAP[iconKey] || DEFAULT_SERVICE_ICON
  const id = service?.id

  async function save(patch: Record<string, unknown>) {
    if (!id) return
    try {
      await patchService(id, patch)
      toast.success('Saved')
      router.refresh()
    } catch {
      toast.error('Save failed — please try again')
    }
  }

  async function handleDelete() {
    if (!id) return
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Service deleted')
      router.refresh()
    } catch {
      toast.error('Delete failed — please try again')
    }
  }

  const iconTile = (
    <div className="w-12 h-12 rounded-xl bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center mb-5">
      <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
    </div>
  )

  return (
    <div className="relative card-premium flex flex-col p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 transition-all duration-200">
      {canEdit && id && (
        <button
          type="button"
          onClick={() => void handleDelete()}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
          aria-label={`Delete ${name}`}
        >
          <X size={14} />
        </button>
      )}

      {canEdit && id ? (
        <IconPicker options={SERVICE_ICONS} value={iconKey} onSelect={v => void save({ icon: v })} trigger={iconTile} />
      ) : (
        iconTile
      )}

      <EditableText
        as="h3"
        className="text-base sm:text-lg font-bold text-dark mb-2"
        value={name}
        onSave={id ? v => save({ name: v }) : undefined}
      />

      {(description || id) && (
        <EditableText
          as="p"
          multiline
          className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed"
          value={description}
          onSave={id ? v => save({ short_description: v }) : undefined}
        />
      )}
    </div>
  )
}
