'use client'

import { createContext, useContext } from 'react'

// Shared shape every per-page edit provider implements — StaticPageEditProvider
// (static_pages.content_json) and SeoPageEditProvider (seo_pages columns/
// sections_json). EditableText/EditableRichText are deliberately dumb: they
// don't know which kind of page they're on, only that *some* provider above
// them can resolve a dot-path and save it.

export interface EditContextValue {
  /** True once it's actually safe to render editable affordances — admin,
   *  edit mode on, and the page's row loaded (needed to avoid clobbering
   *  fields this component doesn't manage on save). */
  canEdit: boolean
  saving: boolean
  getValue: (path: string) => unknown
  save: (path: string, value: unknown) => Promise<void>
}

const noop = async () => {}
export const EditContext = createContext<EditContextValue>({
  canEdit: false, saving: false, getValue: () => undefined, save: noop,
})

export function useEditContext(): EditContextValue {
  return useContext(EditContext)
}
