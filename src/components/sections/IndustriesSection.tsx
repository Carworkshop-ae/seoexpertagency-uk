import type { SEOIndustryData } from '@/lib/data/agency-data'
import { getIndustries } from '@/lib/data/content'
import { IndustryFeatureCard } from '@/components/sections/IndustryFeatureCard'
import { AddIndustryCard } from '@/components/sections/AddIndustryCard'

interface IndustriesSectionProps {
  industries?: SEOIndustryData[]
  title?: string
  subtitle?: string
  eyebrow?: string
}

export async function IndustriesSection({
  industries: industriesProp,
  title = 'Tailored SEO for High-Growth Industries',
  subtitle = 'Every industry operates under distinct search dynamics. We build bespoke search strategies that address the exact buyer intent and competitive barriers of your market.',
  eyebrow = 'SPECIALIZED EXPERTISE',
}: IndustriesSectionProps) {
  const industries = industriesProp ?? await getIndustries()

  return (
    <section id="industries" className="py-16 lg:py-24 bg-white border-b border-slate-100" aria-labelledby="industries-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="industries-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map(industry => (
            <IndustryFeatureCard key={industry.slug} industry={industry} />
          ))}
          <AddIndustryCard />
        </div>
      </div>
    </section>
  )
}
