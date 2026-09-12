'use client'

import { useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

export interface IconOption { value: string; label: string; icon: LucideIcon }

interface IconPickerProps {
  options: IconOption[]
  value: string
  onSelect: (value: string) => void
  /** The current icon's rendered tile — click it to open the picker. */
  trigger: React.ReactNode
}

// Small popover grid of icon buttons, opened by clicking the existing icon
// tile. Used in edit mode on ServiceFeatureCard/IndustryFeatureCard and their
// "add new" counterparts — deliberately generic over the icon set so both
// share one implementation.
export function IconPicker({ options, value, onSelect, trigger }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div className="relative inline-block" ref={ref}>
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
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 top-full left-0 mt-2 p-2 rounded-xl bg-white border border-slate-200 shadow-xl grid grid-cols-4 gap-1 w-48">
            {options.map(opt => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.label}
                  onClick={() => { onSelect(opt.value); setOpen(false) }}
                  className={[
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    opt.value === value ? 'bg-primary text-white' : 'bg-slate-50 text-slate-500 hover:bg-primary-50 hover:text-primary',
                  ].join(' ')}
                >
                  <Icon size={18} />
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
