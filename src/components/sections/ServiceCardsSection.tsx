import { ServiceFeatureCard } from '@/components/sections/ServiceFeatureCard'
import { AddServiceCard } from '@/components/sections/AddServiceCard'
import type { SEOServiceData } from '@/lib/data/agency-data'
import { getServices } from '@/lib/data/content'

interface ServiceCardsSectionProps {
  services?: SEOServiceData[]
  title?: string
  subtitle?: string
  eyebrow?: string
  limit?: number
}

export async function ServiceCardsSection({
  services: servicesProp,
  title = 'Our Core SEO Services',
  subtitle = 'Data-backed search optimization strategies engineered to scale high-intent traffic, dominate keywords, and grow organic revenue.',
  eyebrow = 'WHAT WE DELIVER',
  limit,
}: ServiceCardsSectionProps) {
  const services = servicesProp ?? await getServices()
  const displayedServices = limit ? services.slice(0, limit) : services

  if (displayedServices.length === 0) return null

  return (
    <section id="services" className="py-16 lg:py-24 bg-slate-50/50 border-b border-slate-100" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="services-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedServices.map(service => (
            <ServiceFeatureCard key={service.slug} service={service} />
          ))}
          {!limit && <AddServiceCard />}
        </div>
      </div>
    </section>
  )
}
