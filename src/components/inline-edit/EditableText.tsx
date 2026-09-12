'use client'

import { useStaticPageEdit } from './StaticPageEditProvider'
import { useAdminEdit } from './AdminEditProvider'

interface EditableTextProps {
  /** Dot-path into the page's content_json, e.g. "hero.h1". Omit when
   *  passing a custom `onSave` (e.g. a field that lives in its own table,
   *  like a service's name, rather than in this page's content_json). */
  path?: string
  /** Overrides the page's default content_json save — used for fields whose
   *  data lives elsewhere (e.g. the `services` table). Still gated by the
   *  surrounding page's edit mode via context. */
  onSave?: (value: string) => Promise<void> | void
  /** Server-rendered value — used verbatim for anonymous visitors and admins
   *  who haven't turned edit mode on, so there's zero behavior change for
   *  the vast majority of page views. */
  value: string
  as?: React.ElementType
  className?: string
  /** Use a block element + newlines-preserved edit box for paragraph text. */
  multiline?: boolean
}

// Renders plain text everywhere except for an admin with edit mode on, where
// it becomes a contentEditable node that saves on blur. Deliberately dumb: it
// doesn't know which page or field it's editing — that's resolved by `path`
// against whatever StaticPageEditProvider is mounted above it, or overridden
// entirely via `onSave` for fields that don't live in that page's JSON.
export function EditableText({ path, onSave, value, as: Tag = 'span', className, multiline = false }: EditableTextProps) {
  const { canEdit, getValue, save, saving } = useStaticPageEdit()
  const { isAdmin, editMode } = useAdminEdit()
  // A custom `onSave` targets its own table directly (services, packages) and
  // has no page content_json to wait on — only the site-wide admin/edit-mode
  // toggle gates it. Path-based fields still wait for `canEdit` (the page's
  // row must be loaded first, so a save never clobbers fields this component
  // doesn't manage).
  const active = onSave ? (isAdmin && editMode) : canEdit

  if (!active) {
    return <Tag className={className}>{value}</Tag>
  }

  const liveValue = path ? ((getValue(path) as string | undefined) ?? value) : value

  function handleBlur(e: React.FocusEvent<HTMLElement>) {
    const next = (multiline ? e.currentTarget.innerText : e.currentTarget.textContent) ?? ''
    const trimmed = next.trim()
    if (trimmed === liveValue) return
    if (onSave) void onSave(trimmed)
    else if (path) void save(path, trimmed)
  }

  return (
    <Tag
      // Remount whenever the saved value changes so React never has to
      // reconcile children into a contentEditable node it doesn't own.
      key={`${path}:${liveValue}`}
      className={[
        className,
        'outline-dashed outline-2 outline-offset-2 outline-primary/50 rounded-sm cursor-text transition-opacity',
        saving ? 'opacity-60' : '',
      ].filter(Boolean).join(' ')}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
    >
      {liveValue}
    </Tag>
  )
}
