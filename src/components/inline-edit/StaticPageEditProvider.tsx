'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { getByPath, setByPath } from '@/lib/inline-edit/path'
import { useAdminEdit } from './AdminEditProvider'

interface StaticPageRow {
  title?: string | null
  seo_title?: string | null
  seo_description?: string | null
  sub_title?: string | null
  h3_text?: string | null
  short_description?: string | null
  meta_keyword?: string | null
}

interface StaticPageEditContextValue {
  /** True once it's actually safe to render editable affordances — admin,
   *  edit mode on, and the full page row has loaded (needed to avoid
   *  clobbering fields this component doesn't manage on save). */
  canEdit: boolean
  saving: boolean
  getValue: (path: string) => unknown
  save: (path: string, value: unknown) => Promise<void>
}

const noop = async () => {}
const StaticPageEditContext = createContext<StaticPageEditContextValue>({
  canEdit: false, saving: false, getValue: () => undefined, save: noop,
})

export function useStaticPageEdit(): StaticPageEditContextValue {
  return useContext(StaticPageEditContext)
}

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
// write cycle against PUT /api/admin/pages/static/[slug], so nested
// EditableText/EditableRichText components can stay simple path+value leaves.
export function StaticPageEditProvider({ slug, initialContent, children }: StaticPageEditProviderProps) {
  const { isAdmin, editMode } = useAdminEdit()
  const router = useRouter()
  const [content, setContent] = useState(initialContent)
  const [row, setRow] = useState<StaticPageRow | null>(null)
  const [saving, setSaving] = useState(false)
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

  const getValue = useCallback((path: string) => getByPath(content, path), [content])
  const canEdit = isAdmin && editMode && row !== null

  const save = useCallback(async (path: string, value: unknown) => {
    if (!row) return
    const prevContent = content
    const nextContent = setByPath(content, path, value)
    setContent(nextContent)
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/pages/static/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: row.title ?? undefined,
          seo_title: row.seo_title ?? null,
          seo_description: row.seo_description ?? null,
          sub_title: row.sub_title ?? null,
          h3_text: row.h3_text ?? null,
          short_description: row.short_description ?? null,
          meta_keyword: row.meta_keyword ?? null,
          content_json: nextContent,
          // Inline edits publish immediately — there's no separate draft step.
          status: 'published',
        }),
      })
      if (!res.ok) throw new Error('save failed')
      toast.success('Saved')
      router.refresh()
    } catch {
      setContent(prevContent)
      toast.error('Save failed — please try again')
    } finally {
      setSaving(false)
    }
  }, [content, row, slug, router])

  return (
    <StaticPageEditContext.Provider value={{ canEdit, saving, getValue, save }}>
      {children}
    </StaticPageEditContext.Provider>
  )
}
