'use client'

import { Plus, Minus } from 'lucide-react'
import { useEditContext } from './EditContext'

interface ListControlsProps {
  /** Dot-path of the array in the page's content_json, e.g. "trust_bar.stats". */
  path: string
  /** What a newly added item starts as (its text is then edited in place). */
  template: Record<string, unknown>
  noun: string
  /** Never remove below this many items. */
  min?: number
}

// Add / remove-last controls for a repeated homepage block (trust-bar items,
// why-choose-us cards, testimonials). Visible only in edit mode. Both actions
// go through the draft buffer, so they're undoable and unpublished until Done.
export function ListControls({ path, template, noun, min = 1 }: ListControlsProps) {
  const { canEdit, getValue, save } = useEditContext()
  if (!canEdit) return null
  const list = Array.isArray(getValue(path)) ? (getValue(path) as unknown[]) : []

  const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-primary/50 text-primary hover:bg-primary-50 disabled:opacity-40 disabled:cursor-not-allowed'
  return (
    <div className="flex justify-center gap-2 py-3">
      <button type="button" className={btn} onClick={() => void save(path, [...list, template])}>
        <Plus size={13} /> Add {noun}
      </button>
      <button type="button" className={btn} disabled={list.length <= min} onClick={() => void save(path, list.slice(0, -1))}>
        <Minus size={13} /> Remove last {noun}
      </button>
    </div>
  )
}
