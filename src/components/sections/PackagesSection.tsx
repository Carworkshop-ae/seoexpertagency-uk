import Link from 'next/link'
import type { SEOPackageData } from '@/lib/data/agency-data'
import { getPackages } from '@/lib/data/content'
import { PackageCard } from '@/components/sections/PackageCard'

interface PackagesSectionProps {
  packages?: SEOPackageData[]
  title?: React.ReactNode
  subtitle?: React.ReactNode
  eyebrow?: React.ReactNode
}

export async function PackagesSection({
  packages: packagesProp,
  title = 'Predictable, Transparent SEO Packages',
  subtitle = 'Choose the ideal engagement tier engineered to outpace your competitors and scale organic customer acquisition.',
  eyebrow = 'TRANSPARENT PRICING',
}: PackagesSectionProps) {
  const packages = packagesProp ?? await getPackages()

  return (
    <section className="py-16 lg:py-24 bg-white border-b border-slate-100" id="pricing" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
          {eyebrow && (
            <span className="inline-block text-xs font-extrabold text-primary tracking-wider uppercase mb-2">
              {eyebrow}
            </span>
          )}
          <h2 id="pricing-heading" className="display-tight text-balance text-3xl sm:text-4xl font-extrabold text-dark mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-pretty text-slate-600 text-sm sm:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            Need a custom enterprise scope, multi-lingual setup, or dedicated embedded team?{' '}
            <Link href="/contact" className="text-primary font-bold hover:underline">
              Request a Custom Retainer Proposal →
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
