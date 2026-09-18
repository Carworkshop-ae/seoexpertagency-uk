'use client'

import { X } from 'lucide-react'
import { INDUSTRY_ICONS, INDUSTRY_ICON_MAP, DEFAULT_INDUSTRY_ICON } from '@/lib/industry-icons'
import { EditableText } from '@/components/inline-edit/EditableText'
import { IconPicker } from '@/components/inline-edit/IconPicker'
import { useAdminEdit } from '@/components/inline-edit/AdminEditProvider'
import type { SEOIndustryData } from '@/lib/data/agency-data'

interface IndustryFeatureCardProps {
  industry?: Partial<SEOIndustryData> & {
    name?: string
    slug?: string
    shortDescription?: string
    icon?: string
  }
}

export function IndustryFeatureCard({ industry }: IndustryFeatureCardProps) {
  const { isAdmin, editMode, cards } = useAdminEdit()
  const canEdit = isAdmin && editMode
  const id = industry?.id
  const draft = id ? cards.patchFor('industries', id) : undefined
  const name = (draft?.name as string | undefined) ?? (industry?.name || 'Industry')
  const description = (draft?.short_description as string | undefined) ?? (industry?.shortDescription || '')
  const iconKey = (draft?.icon as string | undefined) ?? (industry?.icon || '')
  const Icon = INDUSTRY_ICON_MAP[iconKey] || DEFAULT_INDUSTRY_ICON

  // Edits are buffered (see AdminEditProvider) — nothing is saved or visible to
  // visitors until "Done Editing".
  function save(patch: Record<string, unknown>) {
    if (!id) return
    cards.patch('industries', id, patch, `Edit ${name}`)
  }

  function handleDelete() {
    if (!id) return
    cards.remove('industries', id, `Delete ${name}`)
  }

  if (id && cards.isRemoved('industries', id)) return null

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
          onClick={handleDelete}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
          aria-label={`Delete ${name}`}
        >
          <X size={14} />
        </button>
      )}

      {canEdit && id ? (
        <IconPicker options={INDUSTRY_ICONS} value={iconKey} onSelect={v => save({ icon: v })} trigger={iconTile} />
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
