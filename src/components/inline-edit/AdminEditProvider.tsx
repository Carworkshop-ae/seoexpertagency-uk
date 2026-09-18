'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Undo2, Redo2, Trash2, Check, Pencil } from 'lucide-react'
import { CardTable, CardState, EMPTY_CARD_STATE, cardKey, commitCardState, type PendingCreate } from '@/lib/inline-edit/card-buffer'

// One reversible edit. Every inline edit (text on a page, a card field, adding
// or deleting a card) records one of these instead of saving; nothing reaches
// the database until "Done Editing" runs the registered committers.
export interface Change { label: string; undo: () => void; redo: () => void }

export interface CardApi {
  /** Fields edited so far on a card (API column names), or undefined. */
  patchFor: (table: CardTable, id: string) => Record<string, unknown> | undefined
  isRemoved: (table: CardTable, id: string) => boolean
  pendingCreates: (table: CardTable) => PendingCreate[]
  patch: (table: CardTable, id: string, patch: Record<string, unknown>, label: string) => void
  remove: (table: CardTable, id: string, label: string) => void
  create: (table: CardTable, body: Record<string, unknown>, label: string) => void
}

interface AdminEditContextValue {
  /** Signed-in staff user, regardless of whether they've turned edit mode on. */
  isAdmin: boolean
  editMode: boolean
  setEditMode: (v: boolean) => void
  /** Record a reversible edit (already applied locally by the caller). */
  record: (change: Change) => void
  /** Register the function that persists one scope's edits on "Done Editing".
   *  Returns an unregister function. */
  registerCommitter: (key: string, commit: () => Promise<void>) => () => void
  cards: CardApi
}

const noopCards: CardApi = {
  patchFor: () => undefined, isRemoved: () => false, pendingCreates: () => [],
  patch: () => {}, remove: () => {}, create: () => {},
}

const AdminEditContext = createContext<AdminEditContextValue>({
  isAdmin: false, editMode: false, setEditMode: () => {},
  record: () => {}, registerCommitter: () => () => {}, cards: noopCards,
})

export function useAdminEdit(): AdminEditContextValue {
  return useContext(AdminEditContext)
}

// Mounted once in the public layout, so every public page — not just the ones
// with a per-page content_json editor — gets the same admin detection and
// edit-mode toggle. Detects admin sessions client-side only (public pages
// stay statically rendered — see src/lib/supabase/server.ts, which is
// admin-only and would force a route dynamic if imported there).
//
// It also owns the draft buffer: edits are applied locally and recorded as
// Changes (undo/redo/discard), and are published together, once, when the
// admin clicks "Done Editing". Visitors never see an edit before that.
export function AdminEditProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminChecked, setAdminChecked] = useState(false)
  const [editMode, setEditModeState] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const historyRef = useRef<Change[]>([])
  const futureRef = useRef<Change[]>([])
  // Mirrors of the history lengths, for rendering (refs can't be read in render).
  const [counts, setCounts] = useState({ dirty: 0, future: 0 })
  const rerender = useCallback(() => setCounts({ dirty: historyRef.current.length, future: futureRef.current.length }), [])

  const committers = useRef(new Map<string, () => Promise<void>>())
  const cardsRef = useRef<CardState>(EMPTY_CARD_STATE)
  const [cardState, setCardState] = useState<CardState>(EMPTY_CARD_STATE)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/me')
      .then(res => { if (!cancelled) setIsAdmin(res.ok) })
      .catch(() => { /* anonymous visitor — no admin UI */ })
      .finally(() => { if (!cancelled) setAdminChecked(true) })
    return () => { cancelled = true }
  }, [])

  const record = useCallback((change: Change) => {
    historyRef.current = [...historyRef.current, change]
    futureRef.current = []
    rerender()
  }, [rerender])

  const undo = useCallback(() => {
    const change = historyRef.current[historyRef.current.length - 1]
    if (!change) return
    historyRef.current = historyRef.current.slice(0, -1)
    futureRef.current = [...futureRef.current, change]
    change.undo()
    rerender()
  }, [rerender])

  const redo = useCallback(() => {
    const change = futureRef.current[futureRef.current.length - 1]
    if (!change) return
    futureRef.current = futureRef.current.slice(0, -1)
    historyRef.current = [...historyRef.current, change]
    change.redo()
    rerender()
  }, [rerender])

  const discard = useCallback(() => {
    while (historyRef.current.length > 0) {
      const change = historyRef.current[historyRef.current.length - 1]
      historyRef.current = historyRef.current.slice(0, -1)
      change.undo()
    }
    futureRef.current = []
    rerender()
  }, [rerender])

  const registerCommitter = useCallback((key: string, commit: () => Promise<void>) => {
    committers.current.set(key, commit)
    return () => { if (committers.current.get(key) === commit) committers.current.delete(key) }
  }, [])

  const applyCards = useCallback((label: string, fn: (s: CardState) => CardState) => {
    const prev = cardsRef.current
    const next = fn(prev)
    cardsRef.current = next
    setCardState(next)
    record({
      label,
      undo: () => { cardsRef.current = prev; setCardState(prev) },
      redo: () => { cardsRef.current = next; setCardState(next) },
    })
  }, [record])

  const cards = useMemo<CardApi>(() => ({
    patchFor: (table, id) => cardState.patches[cardKey(table, id)],
    isRemoved: (table, id) => Boolean(cardState.removed[cardKey(table, id)]),
    pendingCreates: table => cardState.created.filter(c => c.table === table),
    patch: (table, id, patch, label) => applyCards(label, s => ({
      ...s, patches: { ...s.patches, [cardKey(table, id)]: { ...s.patches[cardKey(table, id)], ...patch } },
    })),
    remove: (table, id, label) => applyCards(label, s => ({
      ...s, removed: { ...s.removed, [cardKey(table, id)]: true },
    })),
    create: (table, body, label) => applyCards(label, s => ({
      ...s, created: [...s.created, { tempId: `new-${Date.now()}-${s.created.length}`, table, body }],
    })),
  }), [cardState, applyCards])

  const setEditMode = useCallback((v: boolean) => {
    if (v) {
      // Starting a new session: drop the previous session's settled overrides.
      if (settleTimer.current) clearTimeout(settleTimer.current)
      cardsRef.current = EMPTY_CARD_STATE
      setCardState(EMPTY_CARD_STATE)
      historyRef.current = []
      futureRef.current = []
      rerender()
    }
    setEditModeState(v)
  }, [rerender])

  // "Done Editing": publish every buffered change, once.
  const done = useCallback(async () => {
    if (historyRef.current.length === 0) { setEditModeState(false); return }
    setPublishing(true)
    try {
      for (const commit of committers.current.values()) await commit()
      await commitCardState(cardsRef.current)
      historyRef.current = []
      futureRef.current = []
      rerender()
      // Created cards come back from the server on refresh; patches/removals
      // stay applied until then so nothing flickers back to the old value.
      cardsRef.current = { ...cardsRef.current, created: [] }
      setCardState(cardsRef.current)
      setEditModeState(false)
      toast.success('Changes published')
      router.refresh()
      settleTimer.current = setTimeout(() => { cardsRef.current = EMPTY_CARD_STATE; setCardState(EMPTY_CARD_STATE) }, 4000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Publishing failed — your edits are still here, try again')
    } finally {
      setPublishing(false)
    }
  }, [router, rerender])

  const dirty = counts.dirty
  useEffect(() => {
    if (dirty === 0) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const btn = 'inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <AdminEditContext.Provider value={{ isAdmin, editMode, setEditMode, record, registerCommitter, cards }}>
      {children}
      {adminChecked && isAdmin && (
        <div className="fixed bottom-5 right-5 z-[200] flex items-center gap-2 p-1.5 rounded-full bg-dark shadow-xl">
          {editMode ? (
            <>
              <button type="button" className={`${btn} text-white hover:bg-slate-700`} disabled={dirty === 0 || publishing} onClick={undo} title="Undo">
                <Undo2 size={14} /> Undo
              </button>
              <button type="button" className={`${btn} text-white hover:bg-slate-700`} disabled={counts.future === 0 || publishing} onClick={redo} title="Redo">
                <Redo2 size={14} /> Redo
              </button>
              <button
                type="button"
                className={`${btn} text-red-300 hover:bg-slate-700`}
                disabled={dirty === 0 || publishing}
                onClick={() => { if (window.confirm('Discard all unpublished changes?')) discard() }}
                title="Discard all unpublished changes"
              >
                <Trash2 size={14} /> Discard
              </button>
              <button type="button" className={`${btn} bg-primary text-white hover:bg-primary/90`} disabled={publishing} onClick={() => void done()}>
                <Check size={14} />
                {publishing ? 'Publishing…' : dirty > 0 ? `Done Editing · publish ${dirty}` : 'Done Editing'}
              </button>
            </>
          ) : (
            <button type="button" className={`${btn} text-white hover:bg-slate-700 px-4`} onClick={() => setEditMode(true)}>
              <Pencil size={14} /> Edit This Page
            </button>
          )}
        </div>
      )}
    </AdminEditContext.Provider>
  )
}
