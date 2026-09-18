'use client'

import { useEffect, useRef, useState } from 'react'
import { useAdminEdit } from './AdminEditProvider'

interface EditableSettingProps {
  /** website_settings key, e.g. "footer_business_phone". */
  settingKey: string
  value: string
  as?: React.ElementType
  className?: string
  multiline?: boolean
}

// Inline editing for site-wide text kept in website_settings (footer tagline,
// address, phone, email) — the same fields as Dashboard → Settings. Follows the
// homepage draft model: applied locally and undoable, and only written (via the
// bulk settings API) when the admin clicks "Done Editing".
export function EditableSetting({ settingKey, value, as: Tag = 'span', className, multiline = false }: EditableSettingProps) {
  const { isAdmin, editMode, record, registerCommitter } = useAdminEdit()
  const [current, setCurrent] = useState(value)
  const currentRef = useRef(value)
  const savedRef = useRef(value)

  // Follow the server value when it changes (e.g. after a publish + refresh).
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) { setPrevValue(value); setCurrent(value) }
  useEffect(() => {
    currentRef.current = value
    savedRef.current = value
  }, [value])

  useEffect(() => {
    if (!isAdmin) return
    return registerCommitter(`setting:${settingKey}`, async () => {
      if (currentRef.current === savedRef.current) return
      const res = await fetch('/api/admin/settings/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: [{ key: settingKey, value: currentRef.current }] }),
      })
      if (!res.ok) throw new Error(res.status === 403 ? 'Your role can\'t change site settings (footer text)' : 'Saving the footer text failed')
      savedRef.current = currentRef.current
    })
  }, [isAdmin, settingKey, registerCommitter])

  if (!(isAdmin && editMode)) return <Tag className={className}>{current}</Tag>

  function handleBlur(e: React.FocusEvent<HTMLElement>) {
    const next = ((multiline ? e.currentTarget.innerText : e.currentTarget.textContent) ?? '').trim()
    if (next === currentRef.current) return
    const prev = currentRef.current
    currentRef.current = next
    setCurrent(next)
    record({
      label: `Edit ${settingKey}`,
      undo: () => { currentRef.current = prev; setCurrent(prev) },
      redo: () => { currentRef.current = next; setCurrent(next) },
    })
  }

  return (
    <Tag
      key={current}
      className={[className, 'outline-dashed outline-2 outline-offset-2 outline-primary/50 rounded-sm cursor-text'].filter(Boolean).join(' ')}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
    >
      {current}
    </Tag>
  )
}
