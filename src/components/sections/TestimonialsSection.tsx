import { Quote, Star } from 'lucide-react'

// Placeholder copy — no real client has been quoted yet. Replace every entry
// here with a genuine, permissioned review before this ships to real traffic.
interface Testimonial {
  quote: React.ReactNode
  name: React.ReactNode
  role: React.ReactNode
  rating?: number
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: 'Our organic traffic more than doubled within two quarters, and for the first time we could actually trace pipeline revenue back to specific keyword rankings.',
    name: 'VP of Marketing',
    role: 'B2B SaaS company',
    rating: 5,
  },
  {
    quote: 'What stood out was the transparency — weekly rank tracking, clear technical audits, and a team that explained the "why" behind every recommendation.',
    name: 'Director of E-Commerce',
    role: 'Online retail brand',
    rating: 5,
  },
  {
    quote: 'We had tried two other agencies before this. The difference was having senior strategists actually doing the work instead of handing it off to juniors.',
    name: 'Founder',
    role: 'Professional services firm',
    rating: 5,
  },
]

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
  title?: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: React.ReactNode
}

export function TestimonialsSection({
  testimonials = DEFAULT_TESTIMONIALS,
  title = 'Trusted by Growth-Focused Teams',
  subtitle = 'Real feedback from clients who partnered with us to turn organic search into a predictable revenue channel.',
  eyebrow = 'CLIENT REVIEWS',
}: TestimonialsSectionProps = {}) {
  return (
    <section className="py-16 lg:py-24 bg-slate-50/50 border-b border-slate-100" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="testimonials-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="card-premium flex flex-col p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80">
              <Quote className="w-8 h-8 text-primary-200 mb-4" />
              {typeof t.rating === 'number' && (
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s < t.rating! ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}
                    />
                  ))}
                </div>
              )}
              <p className="text-sm text-slate-700 leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="pt-4 border-t border-slate-100">
                <p className="font-bold text-sm text-dark">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
