import { ShieldCheck, Users, BarChart3, Unlock, Code2, Target } from 'lucide-react'

const SEO_REASONS = [
  {
    icon: <Unlock className="w-6 h-6 text-primary" />,
    title: 'No Hostile Lock-In Contracts',
    description: 'We earn your business every month through demonstrable organic traffic growth and revenue impact.',
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: 'Dedicated Senior Strategists',
    description: 'Work directly with seasoned SEO directors and technical architects, not entry-level account coordinators.',
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: '100% White-Hat Techniques',
    description: 'We adhere strictly to Google Webmaster Guidelines, ensuring penalty-proof rankings that stand the test of time.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    title: 'Transparent Real-Time Dashboards',
    description: '24/7 access to live rank tracking, keyword velocity, and multi-touch pipeline revenue attribution.',
  },
  {
    icon: <Code2 className="w-6 h-6 text-primary" />,
    title: 'Deep Engineering Expertise',
    description: 'We provide production-ready code tickets and direct developer collaboration for complex modern tech stacks.',
  },
  {
    icon: <Target className="w-6 h-6 text-primary" />,
    title: 'Commercial Intent Focus',
    description: 'We target high-converting commercial queries that drive qualified sales pipelines rather than vanity impressions.',
  },
]

interface WhyChooseUsItem {
  icon?: string | React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  text?: React.ReactNode
}

interface WhyChooseUsProps {
  heading?: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: string
  items?: WhyChooseUsItem[]
}

export function WhyChooseUs({
  heading = 'Why Ambitious Brands Choose SEO Expert Agency',
  subtitle = 'We eliminate the guesswork from organic search marketing with transparent, data-driven frameworks engineered for measurable business ROI.',
  eyebrow = 'THE SEO EXPERT DIFFERENCE',
  items,
}: WhyChooseUsProps = {}) {
  const useCustom = items && items.length > 0

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100" aria-labelledby="why-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="why-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {heading}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {useCustom
            ? items.map((it, i) => (
                <div key={i} className="card-premium flex gap-4 p-6 sm:p-7 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-200/80 transition-all">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center">
                    {typeof it.icon === 'string' ? <span className="text-xl">{it.icon}</span> : (it.icon ?? <ShieldCheck className="w-6 h-6 text-primary" />)}
                  </div>
                  <div>
                    {it.title && <h3 className="font-bold text-base text-dark mb-1">{it.title}</h3>}
                    {it.description && <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{it.description}</p>}
                    {it.text && <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{it.text}</p>}
                  </div>
                </div>
              ))
            : SEO_REASONS.map(reason => (
                <div key={reason.title} className="card-premium flex gap-4 p-6 sm:p-7 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-200/80 transition-all duration-200 hover:border-primary/30">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-50 ring-1 ring-primary-200/60 flex items-center justify-center">
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-dark mb-1.5">{reason.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{reason.description}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  )
}
