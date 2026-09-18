import Link from 'next/link'
import type { ReactNode } from 'react'
import { ShieldCheck, ArrowRight, BarChart3, Search, Sparkles } from 'lucide-react'

interface HeroStat { value: string; label: string }
interface HeroSectionProps {
  h1?: ReactNode
  subtitle?: ReactNode
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  badge?: React.ReactNode
  heroStats?: HeroStat[]
  rightSlot?: ReactNode
  /** Rendered inside the dark hero, above the badge. Detail routes pass
   *  <Breadcrumb tone="dark" …/> here instead of a separate light strip. */
  breadcrumb?: ReactNode
}

// Qualitative by design. Performance figures belong here only once they are
// real, measured and client-approved — set them per page via the `heroStats`
// prop (CMS-driven) rather than hardcoding a claim into every page.
export const DEFAULT_SEO_HERO_STATS: HeroStat[] = [
  { value: '100%', label: 'White-Hat SEO' },
  { value: 'Senior', label: 'In-House Team' },
  { value: 'Monthly', label: 'Transparent Reporting' },
  { value: 'No Lock-In', label: 'Rolling Contracts' },
]

export function HeroSection({
  h1 = 'Grow Your Business With Data-Driven SEO',
  subtitle = 'We help ambitious brands scale organic search traffic, dominate high-intent keywords, and convert qualified visitors into predictable revenue.',
  ctaLabel = 'Get a Free SEO Consultation',
  ctaHref = '#lead-form',
  secondaryLabel,
  secondaryHref,
  badge = 'RESULT-DRIVEN SEO AGENCY',
  heroStats,
  rightSlot,
  breadcrumb,
}: HeroSectionProps) {
  const stats = heroStats && heroStats.length >= 4 ? heroStats : DEFAULT_SEO_HERO_STATS

  return (
    <section className="relative overflow-hidden bg-hero-deep">
      {/* ── Decorative layers. All inert: no pointer events, hidden from AT. ── */}

      {/* Dot grids — bounded blocks rather than a full-bleed wash. */}
      <div className="absolute top-4 left-0 w-40 h-40 texture-dots-light opacity-70 pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/3 right-0 w-32 h-48 texture-dots-light opacity-50 pointer-events-none" aria-hidden="true" />

      {/* Concentric rings. Hidden on phones, where they crowd the headline. */}
      <svg
        className="absolute -top-32 right-[14%] w-[34rem] h-[34rem] pointer-events-none hidden md:block"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="80" stroke="white" strokeOpacity="0.14" strokeWidth="2" />
        <circle cx="200" cy="200" r="130" stroke="white" strokeOpacity="0.10" strokeWidth="2" />
        <circle cx="200" cy="200" r="180" stroke="white" strokeOpacity="0.07" strokeWidth="2" />
      </svg>

      {/* Chevron outlines. */}
      <svg
        className="absolute bottom-20 left-[6%] w-[26rem] h-[16rem] pointer-events-none hidden lg:block"
        viewBox="0 0 400 240"
        fill="none"
        aria-hidden="true"
      >
        <path d="M40 200 L200 50 L360 200" stroke="white" strokeOpacity="0.08" strokeWidth="3" />
        <path d="M40 250 L200 100 L360 250" stroke="white" strokeOpacity="0.05" strokeWidth="3" />
      </svg>

      {/* White wave dissolving into the section below — every caller hands off
          to a white surface, so this replaces the old hard bottom border. */}
      <svg
        className="absolute bottom-0 left-0 w-full h-16 sm:h-24 lg:h-28 pointer-events-none"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,72 C240,120 420,24 720,48 C1020,72 1200,116 1440,64 L1440,120 L0,120 Z" fill="white" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 lg:pt-20 pb-28 lg:pb-40">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline, Copy, Dual CTA & Trust badges */}
          <div className="lg:col-span-7 max-w-2xl">
            {breadcrumb && <div className="mb-5">{breadcrumb}</div>}

            {badge && (
              <span className="inline-flex items-center gap-2 mb-4 px-3.5 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-white/15 text-blue-100 ring-1 ring-white/25 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-blue-200 animate-pulse" />
                {badge}
              </span>
            )}

            <h1 className="display-tight text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {h1}
            </h1>

            {subtitle && (
              <p className="text-pretty text-base sm:text-lg text-blue-100 mt-5 max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3.5 mt-8">
              <Link
                href={ctaHref}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-primary hover:bg-slate-50 font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                {ctaLabel}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              {secondaryLabel && secondaryHref && (
                <Link
                  href={secondaryHref}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold text-sm ring-1 ring-white/30 hover:bg-white/20 backdrop-blur transition-all"
                >
                  {secondaryLabel}
                </Link>
              )}
            </div>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2.5 mt-8 pt-6 border-t border-white/15 text-xs font-semibold text-blue-100">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-blue-200" /> 100% White-Hat SEO
              </li>
              <li className="inline-flex items-center gap-1.5">
                <BarChart3 size={16} className="text-blue-200" /> Transparent ROI Reporting
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Sparkles size={16} className="text-blue-200" /> Google Search Certified
              </li>
            </ul>
          </div>

          {/* Right Column: Lead Form or Decorative Stat Card.
              The halo stands in for the card's own shadow, which is invisible
              against a dark surface. */}
          <div className="lg:col-span-5 relative" id="lead-form">
            <div className="absolute -inset-4 bg-white/10 blur-3xl rounded-[3rem] pointer-events-none" aria-hidden="true" />
            <div className="relative">
              {rightSlot ?? (
                <div className="card-premium p-7 rounded-3xl bg-white border border-slate-200/80">
                  <div className="bg-gradient-to-br from-primary to-primary-700 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-xs uppercase tracking-wider font-semibold opacity-90">{stats[0].label}</p>
                    <p className="text-2xl font-extrabold mt-1">{stats[0].value}</p>
                    <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
                      {stats.slice(1, 4).map(s => (
                        <div key={s.label} className="rounded-xl bg-white/10 backdrop-blur px-2 py-2.5">
                          <p className="text-base font-bold leading-none">{s.value}</p>
                          <p className="text-[10px] opacity-85 mt-1 font-medium">{s.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex items-center gap-3 p-2">
                    <div className="h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center text-primary font-bold">
                      <Search size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark">Data-Backed SEO Roadmaps</p>
                      <p className="text-[11px] text-slate-500">Customized search strategy tailored to your industry.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
