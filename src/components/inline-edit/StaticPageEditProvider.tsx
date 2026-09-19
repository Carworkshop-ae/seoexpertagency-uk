'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getByPath, setByPath } from '@/lib/inline-edit/path'
import { useAdminEdit } from './AdminEditProvider'
import { EditContext, useEditContext } from './EditContext'

interface StaticPageRow {
  title?: string | null
  seo_title?: string | null
  seo_description?: string | null
  sub_title?: string | null
  h3_text?: string | null
  short_description?: string | null
  meta_keyword?: string | null
}

// Kept as an alias — this used to be the only edit context in the codebase.
export const useStaticPageEdit = useEditContext

interface StaticPageEditProviderProps {
  /** static_pages.slug this content belongs to, e.g. "home". */
  slug: string
  /** Server-rendered, already-merged-with-defaults content — becomes the
   *  starting client state so there's no flash of different content. Typed
   *  loosely on purpose: every page's content_json has its own shape, and
   *  path-based get/set is untyped by nature. */
  initialContent: object
  children: React.ReactNode
}

// Nests under the site-wide AdminEditProvider (which owns admin detection and
// the edit-mode toggle) and adds this one page's content_json read-modify-
// write cycle against PUT /api/admin/pages/static/[slug] (run once, on "Done Editing"), so nested
// EditableText/EditableRichText components can stay simple path+value leaves.
export function StaticPageEditProvider({ slug, initialContent, children }: StaticPageEditProviderProps) {
  const { isAdmin, editMode, record, registerCommitter } = useAdminEdit()
  const [content, setContent] = useState(initialContent)
  const [row, setRow] = useState<StaticPageRow | null>(null)
  // What the server currently has — the committer skips the PUT when the
  // buffered content is identical to it (e.g. after Discard).
  const savedRef = useRef<object>(initialContent)
  const contentRef = useRef<object>(initialContent)
  const rowRef = useRef<StaticPageRow | null>(null)
  const fetchingRow = useRef(false)

  useEffect(() => {
    if (!isAdmin || !editMode || row || fetchingRow.current) return
    fetchingRow.current = true
    let cancelled = false
    fetch(`/api/admin/pages/static/${slug}`)
      .then(res => res.json())
      .then((d: { page?: StaticPageRow }) => { if (!cancelled && d.page) setRow(d.page) })
      .catch(() => { /* best-effort — canEdit stays false, no affordances render */ })
      .finally(() => { fetchingRow.current = false })
    return () => { cancelled = true }
  }, [isAdmin, editMode, row, slug])

  useEffect(() => { rowRef.current = row }, [row])

  const getValue = useCallback((path: string) => getByPath(content, path), [content])
  const canEdit = isAdmin && editMode && row !== null

  // Edits are applied locally and recorded for undo/redo — nothing is sent (or
  // visible to visitors) until "Done Editing" runs the committer below.
  const save = useCallback(async (path: string, value: unknown) => {
    if (!row) return
    const prev = contentRef.current
    const next = setByPath(prev, path, value)
    contentRef.current = next
    setContent(next)
    record({
      label: `Edit ${path}`,
      undo: () => { contentRef.current = prev; setContent(prev) },
      redo: () => { contentRef.current = next; setContent(next) },
    })
  }, [row, record])

  useEffect(() => {
    if (!isAdmin) return
    return registerCommitter(`static:${slug}`, async () => {
      const r = rowRef.current
      const toSave = contentRef.current
      if (!r || toSave === savedRef.current) return
      const res = await fetch(`/api/admin/pages/static/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: r.title ?? undefined,
          seo_title: r.seo_title ?? null,
          seo_description: r.seo_description ?? null,
          sub_title: r.sub_title ?? null,
          h3_text: r.h3_text ?? null,
          short_description: r.short_description ?? null,
          meta_keyword: r.meta_keyword ?? null,
          content_json: toSave,
          status: 'published',
        }),
      })
      if (!res.ok) throw new Error('Saving the page content failed')
      savedRef.current = toSave
    })
  }, [isAdmin, slug, registerCommitter])

  return (
    <EditContext.Provider value={{ canEdit, saving: false, getValue, save }}>
      {children}
    </EditContext.Provider>
  )
}
