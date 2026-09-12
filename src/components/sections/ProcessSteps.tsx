import { Search, Compass, Zap, TrendingUp } from 'lucide-react'

interface Step {
  number: number
  title: string
  description: string
  icon?: React.ReactNode
}

const DEFAULT_SEO_STEPS: Step[] = [
  {
    number: 1,
    title: 'Discovery & Deep Audit',
    description: 'We perform deep technical crawl diagnostics, log file reviews, and comprehensive competitor keyword gap analysis.',
    icon: <Search className="w-6 h-6 text-primary" />,
  },
  {
    number: 2,
    title: 'Strategic Architecture',
    description: 'We map out a sprint-by-sprint 12-month roadmap prioritizing high-impact quick wins and long-term search dominance.',
    icon: <Compass className="w-6 h-6 text-primary" />,
  },
  {
    number: 3,
    title: 'Execution & Optimization',
    description: 'Our team implements technical fixes, Core Web Vitals optimizations, semantic content clusters, and structured schema.',
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
  {
    number: 4,
    title: 'Authority & Revenue Scale',
    description: 'We earn tier-1 editorial backlinks through digital PR and continuously optimize conversion funnels for maximum pipeline.',
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
  },
]

interface ProcessStepsProps {
  title?: string
  subtitle?: string
  eyebrow?: string
  steps?: Step[]
}

export function ProcessSteps({
  title = 'Our Proven 4-Step SEO Framework',
  subtitle = 'A systematic, repeatable methodology that turns search engines into your most predictable customer acquisition channel.',
  eyebrow = 'HOW WE DELIVER RESULTS',
  steps = DEFAULT_SEO_STEPS,
}: ProcessStepsProps) {
  return (
    <section className="py-16 lg:py-24 bg-mesh border-b border-slate-100" aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="process-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative text-center group">
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[calc(50%+45px)] right-0 h-0.5 bg-gradient-to-r from-primary-200 to-transparent" aria-hidden="true" />
              )}
              <div className="relative z-10 w-20 h-20 mx-auto mb-5 rounded-3xl bg-white ring-1 ring-primary-200/70 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-primary transition-all duration-200">
                {step.icon ?? (
                  <span className="text-2xl font-extrabold text-primary">{step.number}</span>
                )}
              </div>
              <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider block mb-1">
                Step 0{step.number}
              </span>
              <h3 className="font-bold text-base text-dark mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[17rem] mx-auto">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
