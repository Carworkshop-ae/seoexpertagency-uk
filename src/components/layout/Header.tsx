import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { SiteSettings } from '@/types/settings'

interface HeaderProps {
  settings: SiteSettings
}

export function Header({ settings }: HeaderProps) {
  return (
    // .bg-header-deep shares .bg-hero-deep's #003D99 base and continues its
    // top-right glow, so on the hero routes the bar reads as part of the same
    // surface rather than a strip cutting across it. No border: one would
    // reintroduce the very line this is removing.
    <header className="sticky top-0 z-50 bg-header-deep">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label={`${settings.site_name} home`}>
            {settings.header_logo_url ? (
              <Image src={settings.header_logo_url} alt={`${settings.site_name} logo`} width={160} height={42} className="h-9 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur-sm flex items-center justify-center text-white font-extrabold text-sm group-hover:scale-105 group-hover:bg-white/20 transition-all">
                  <Sparkles size={18} />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  SEO<span className="text-blue-200">Expert</span><span className="text-blue-100/70 font-semibold text-sm ml-1 hidden sm:inline">Agency</span>
                </span>
              </div>
            )}
          </Link>

          {settings.header_cta_visible && (
            // Matches the hero's primary CTA: a solid white pill on blue.
            <Link
              href={settings.header_cta_link || '/contact'}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold bg-white text-primary hover:bg-slate-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              {settings.header_cta_text || 'Get Free Audit'}
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
