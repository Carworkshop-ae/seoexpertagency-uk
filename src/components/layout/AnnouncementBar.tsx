'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import type { SiteSettings } from '@/types/settings'

interface AnnouncementBarProps {
  settings: Pick<SiteSettings, 'announcement_bar_bg_color' | 'announcement_bar_text_color' | 'announcement_bar_link'>
}

const DEFAULT_AGENCY_ANNOUNCEMENT =
  'Special Q1 Strategy Offer: Receive a complimentary 20-page technical search audit with every consultation.'

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const text = DEFAULT_AGENCY_ANNOUNCEMENT
  const bgColor = settings.announcement_bar_bg_color || '#0066FF'
  const textColor = settings.announcement_bar_text_color || '#FFFFFF'

  const inner = (
    <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold tracking-wide">
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider shrink-0">
        <Sparkles className="w-3 h-3" /> Special Offer
      </span>
      <span>{text}</span>
      <span className="hidden md:inline-flex items-center gap-0.5 text-xs font-bold underline underline-offset-2 ml-1">
        Claim Free Audit <ArrowRight size={12} />
      </span>
    </div>
  )

  return (
    <div
      className="relative w-full shadow-sm z-50 py-2 px-4 border-b border-blue-400/20"
      style={{ backgroundColor: bgColor, color: textColor }}
      role="region"
      aria-label="Announcement"
    >
      <div className="max-w-7xl mx-auto text-center">
        <Link href="/contact" className="hover:opacity-95 transition-opacity">
          {inner}
        </Link>
      </div>
    </div>
  )
}
