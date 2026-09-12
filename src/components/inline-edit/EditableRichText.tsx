'use client'

import { useState } from 'react'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { useStaticPageEdit } from './StaticPageEditProvider'

interface EditableRichTextProps {
  /** Dot-path into the page's content_json, e.g. "content". */
  path: string
  /** Server-rendered, already-sanitized HTML. */
  value: string
  className?: string
}

// Rich-text counterpart to EditableText, for long HTML blobs (Privacy/Terms
// bodies) where a contentEditable overlay isn't practical. Renders the
// sanitized HTML everywhere except for an admin in edit mode, who gets an
// "Edit" affordance that swaps in the existing TipTap RichTextEditor with
// explicit Save/Cancel — sanitization happens server-side on save either way.
export function EditableRichText({ path, value, className }: EditableRichTextProps) {
  const { canEdit, getValue, save, saving } = useStaticPageEdit()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  if (!canEdit) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: value }} />
  }

  const liveValue = (getValue(path) as string | undefined) ?? value

  if (!editing) {
    return (
      <div className="relative">
        <div className={className} dangerouslySetInnerHTML={{ __html: liveValue }} />
        <button
          type="button"
          onClick={() => { setDraft(liveValue); setEditing(true) }}
          className="mt-4 px-3 py-1.5 rounded-lg border-2 border-dashed border-primary/40 text-primary text-xs font-bold hover:border-primary hover:bg-primary-50/50"
        >
          ✎ Edit this content
        </button>
      </div>
    )
  }

  async function handleSave() {
    await save(path, draft)
    setEditing(false)
  }

  return (
    <div className="space-y-3">
      <RichTextEditor value={draft} onChange={setDraft} minHeight={400} />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => void handleSave()}
          className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => setEditing(false)}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
