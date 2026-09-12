import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, Phone, Sparkles } from 'lucide-react'

interface CTABannerProps {
  title?: ReactNode
  subtitle?: ReactNode
  ctaLabel?: string
  ctaHref?: string
  secondaryLabel?: string
  secondaryHref?: string
  bgColor?: string
}

export function CTABanner({
  title = 'Ready to Grow Your Search Visibility?',
  subtitle = 'Schedule a 30-minute discovery call with our senior SEO strategists and receive a free comprehensive technical & keyword opportunity audit.',
  ctaLabel = 'Get Your Free SEO Consultation',
  ctaHref = '/contact',
  secondaryLabel = 'Call Us Directly',
  secondaryHref = 'tel:+9714800736',
  bgColor,
}: CTABannerProps) {
  return (
    <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8" aria-labelledby="cta-heading">
      <div
        className={`relative overflow-hidden max-w-7xl mx-auto rounded-3xl px-6 py-12 sm:px-12 sm:py-16 text-center ${
          bgColor ? '' : 'bg-gradient-to-br from-primary via-primary-600 to-primary-800'
        } shadow-2xl`}
        style={bgColor ? { backgroundColor: bgColor } : undefined}
      >
        <div className="absolute inset-0 texture-dots opacity-20 pointer-events-none" aria-hidden="true" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" aria-hidden="true" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
            <Sparkles size={13} className="text-white" />
            Zero Obligation · Custom Strategy
          </span>

          <h2 id="cta-heading" className="display-tight text-balance text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {title}
          </h2>

          <p className="text-pretty text-blue-100 mt-4 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-3.5 mt-8">
            <Link
              href={ctaHref}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-primary hover:bg-slate-50 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-xs sm:text-sm"
            >
              {ctaLabel}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            {secondaryLabel && (
              <a
                href={secondaryHref}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-semibold ring-1 ring-white/30 hover:bg-white/20 backdrop-blur transition-all text-xs sm:text-sm"
              >
                <Phone size={15} />
                {secondaryLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
