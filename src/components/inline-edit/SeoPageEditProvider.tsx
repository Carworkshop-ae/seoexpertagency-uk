'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getByPath, setByPath } from '@/lib/inline-edit/path'
import { useAdminEdit } from './AdminEditProvider'
import { EditContext } from './EditContext'

// Columns that live directly on the seo_pages row. Everything else (Trust Bar,
// Process Steps, CTA Banner, Final CTA, Testimonials, and the title/subtitle/
// eyebrow of the Services/Packages/Industries/Projects/Blog/FAQ sections) has
// no dedicated column — it rolls into the generic `sections_json` blob so each
// SEO page can carry its own independent copy of those otherwise-shared
// section defaults (see 007_seo_page_sections.sql).
const DIRECT_COLUMNS = new Set([
  'headline', 'subheadline', 'overview', 'why_choose_us_heading', 'why_choose_us_json', 'faq_json',
])

interface SeoPageEditProviderProps {
  /** seo_pages.id */
  id: string
  /** Server-rendered row fields plus sections_json, flattened into one object
   *  so path-based get/set works the same way as static_pages.content_json. */
  initialContent: {
    headline?: string | null
    subheadline?: string | null
    overview?: string | null
    why_choose_us_heading?: string | null
    why_choose_us_json?: unknown
    faq_json?: unknown
    sections_json?: Record<string, unknown> | null
  }
  children: React.ReactNode
}

// Sibling to StaticPageEditProvider, for seo_pages rows. [...slug]/page.tsx
// already server-fetches the full row, so — unlike static pages — there's no
// fetch-on-mount step: canEdit only waits on the site-wide admin/edit-mode
// toggle. `save` routes a changed path to its own column when one exists,
// otherwise folds it into `sections_json`, and PATCHes only that one key so a
// section edit never touches this page's other fields.
export function SeoPageEditProvider({ id, initialContent, children }: SeoPageEditProviderProps) {
  const { isAdmin, editMode, record, registerCommitter } = useAdminEdit()
  const [content, setContent] = useState<Record<string, unknown>>(() => ({
    headline: initialContent.headline ?? '',
    subheadline: initialContent.subheadline ?? '',
    overview: initialContent.overview ?? '',
    why_choose_us_heading: initialContent.why_choose_us_heading ?? '',
    why_choose_us_json: initialContent.why_choose_us_json ?? [],
    faq_json: initialContent.faq_json ?? [],
    ...(initialContent.sections_json ?? {}),
  }))
  const savedRef = useRef<Record<string, unknown> | null>(null)
  const contentRef = useRef<Record<string, unknown>>(content)
  if (savedRef.current === null) savedRef.current = content

  const getValue = useCallback((path: string) => getByPath(content, path), [content])
  const canEdit = isAdmin && editMode

  // Buffered like StaticPageEditProvider: applied locally + recorded for
  // undo/redo, and PATCHed once on "Done Editing".
  const save = useCallback(async (path: string, value: unknown) => {
    const prev = contentRef.current
    const next = setByPath(prev, path, value) as Record<string, unknown>
    contentRef.current = next
    setContent(next)
    record({
      label: `Edit ${path}`,
      undo: () => { contentRef.current = prev; setContent(prev) },
      redo: () => { contentRef.current = next; setContent(next) },
    })
  }, [record])

  useEffect(() => {
    if (!isAdmin) return
    return registerCommitter(`seo-page:${id}`, async () => {
      const now = contentRef.current
      const saved = savedRef.current ?? {}
      if (now === saved) return
      const body: Record<string, unknown> = {}
      for (const key of DIRECT_COLUMNS) {
        if (JSON.stringify(now[key]) !== JSON.stringify(saved[key])) body[key] = now[key]
      }
      const sectionsOf = (c: Record<string, unknown>) => Object.fromEntries(Object.entries(c).filter(([k]) => !DIRECT_COLUMNS.has(k)))
      if (JSON.stringify(sectionsOf(now)) !== JSON.stringify(sectionsOf(saved))) body.sections_json = sectionsOf(now)
      if (Object.keys(body).length === 0) return
      const res = await fetch(`/api/admin/seo-pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Saving the SEO page failed')
      savedRef.current = now
    })
  }, [isAdmin, id, registerCommitter])

  return (
    <EditContext.Provider value={{ canEdit, saving: false, getValue, save }}>
      {children}
    </EditContext.Provider>
  )
}
