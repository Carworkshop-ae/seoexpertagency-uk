import React from 'react'
import type { FAQItem } from '@/types'

interface AccordionProps {
  items: FAQItem[]
  className?: string
}

export function Accordion({ items, className = '' }: AccordionProps) {
  return (
    <div className={['space-y-3.5', className].join(' ')}>
      {items.map((item, index) => (
        <details
          key={index}
          className="group card-premium rounded-2xl bg-white border border-slate-200/90 open:ring-2 open:ring-primary/20 open:border-primary px-5 sm:px-6 transition-all duration-200"
        >
          <summary className="flex items-center justify-between gap-4 py-4 sm:py-5 cursor-pointer list-none font-bold text-sm sm:text-base text-dark group-hover:text-primary transition-colors select-none">
            <span>{item.question}</span>
            <span className="shrink-0 h-7 w-7 rounded-full bg-primary-50 flex items-center justify-center ring-1 ring-primary-200/60 group-open:bg-primary group-open:text-white transition-colors">
              <svg
                className="w-3.5 h-3.5 text-primary group-open:text-white group-open:rotate-45 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </span>
          </summary>
          <div className="pb-5 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 pt-3">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  )
}
