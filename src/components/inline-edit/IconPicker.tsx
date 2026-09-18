'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface IconOption { value: string; label: string; icon: LucideIcon }

interface IconPickerProps {
  options: IconOption[]
  value: string
  onSelect: (value: string) => void
  /** The current icon's rendered tile — click it to open the picker. */
  trigger: React.ReactNode
}

// Popover grid of icon buttons, opened by clicking the existing icon tile.
// Shared by every icon-bearing card (industries, services, trust bar, why-choose-us).
// Scrolls and has a search box so a large icon set stays usable.
export function IconPicker({ options, value, onSelect, trigger }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? options.filter(o => o.label.toLowerCase().includes(q) || o.value.includes(q)) : options
  }, [options, query])

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="block rounded-xl outline-dashed outline-2 outline-offset-2 outline-primary/50 hover:outline-primary transition-colors"
        title="Change icon"
      >
        {trigger}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setQuery('') }} />
          <div className="absolute z-50 top-full left-0 mt-2 p-2 rounded-xl bg-white border border-slate-200 shadow-xl w-72">
            {options.length > 12 && (
              <div className="relative mb-2">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search icons…"
                  className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-primary"
                />
              </div>
            )}
            <div className="grid grid-cols-6 gap-1 max-h-64 overflow-y-auto">
              {shown.map(opt => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.value}
                    type="button"
                    title={opt.label}
                    onClick={() => { onSelect(opt.value); setOpen(false); setQuery('') }}
                    className={[
                      'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                      opt.value === value ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-primary-50 hover:text-primary',
                    ].join(' ')}
                  >
                    <Icon size={18} />
                  </button>
                )
              })}
              {shown.length === 0 && <p className="col-span-6 text-xs text-slate-400 py-3 text-center">No icons match</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
