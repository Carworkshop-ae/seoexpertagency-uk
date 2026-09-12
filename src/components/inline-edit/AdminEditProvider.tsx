'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface AdminEditContextValue {
  /** Signed-in staff user, regardless of whether they've turned edit mode on. */
  isAdmin: boolean
  editMode: boolean
  setEditMode: (v: boolean) => void
}

const AdminEditContext = createContext<AdminEditContextValue>({
  isAdmin: false, editMode: false, setEditMode: () => {},
})

export function useAdminEdit(): AdminEditContextValue {
  return useContext(AdminEditContext)
}

// Mounted once in the public layout, so every public page — not just the ones
// with a per-page content_json editor — gets the same admin detection and
// edit-mode toggle. Detects admin sessions client-side only (public pages
// stay statically rendered — see src/lib/supabase/server.ts, which is
// admin-only and would force a route dynamic if imported there).
export function AdminEditProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminChecked, setAdminChecked] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/me')
      .then(res => { if (!cancelled) setIsAdmin(res.ok) })
      .catch(() => { /* anonymous visitor — no admin UI */ })
      .finally(() => { if (!cancelled) setAdminChecked(true) })
    return () => { cancelled = true }
  }, [])

  return (
    <AdminEditContext.Provider value={{ isAdmin, editMode, setEditMode }}>
      {children}
      {adminChecked && isAdmin && (
        <button
          type="button"
          onClick={() => setEditMode(v => !v)}
          className="fixed bottom-5 right-5 z-[200] inline-flex items-center gap-2 px-4 py-3 rounded-full bg-dark text-white text-xs font-bold shadow-xl hover:bg-slate-800 transition-colors"
        >
          {editMode ? '✓ Done Editing' : '✎ Edit This Page'}
        </button>
      )}
    </AdminEditContext.Provider>
  )
}
