import type { ReactNode } from 'react'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'
import { EditModeLink } from '@/components/inline-edit/EditModeLink'

interface FinalCTASectionProps {
  badge?: ReactNode
  phoneText?: ReactNode
  phoneHref?: string
  heading?: ReactNode
  subtitle?: ReactNode
  ctaText?: ReactNode
  ctaHref?: string
}

export function FinalCTASection({
  badge = 'Scale Your Organic Revenue',
  phoneText = 'Call +971 4 800 736',
  phoneHref = 'tel:+9714800736',
  heading = "Let's Build Your Search Growth Strategy",
  subtitle = 'Get in touch today for an in-depth competitive search audit, technical roadmap, and predictable organic growth plan.',
  ctaText = 'Book a Free Consultation',
  ctaHref = '/contact',
}: FinalCTASectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-mesh border-t border-slate-100 relative overflow-hidden" aria-labelledby="final-cta-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary-200/60 shadow-sm">
          <Sparkles size={14} />
          <span>{badge}</span>
        </div>

        <h2 id="final-cta-heading" className="display-tight text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark tracking-tight mb-5">
          {heading}
        </h2>

        <p className="text-pretty text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <EditModeLink
            href={ctaHref}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-sm shadow-[0_8px_24px_rgba(0,102,255,0.35)] hover:-translate-y-0.5 transition-all"
          >
            {ctaText}
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </EditModeLink>

          <EditModeLink
            href={phoneHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
          >
            <Phone size={15} className="text-primary" />
            {phoneText}
          </EditModeLink>
        </div>
      </div>
    </section>
  )
}
