import type { ReactNode } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ShieldCheck, BarChart3, Sparkles } from 'lucide-react'

interface BreadcrumbItem { label: string; href?: string }
interface PageHeaderProps {
  breadcrumb: BreadcrumbItem[]
  title: ReactNode
  subtitle?: ReactNode
  showTrust?: boolean
  eyebrow?: string
}

const SEO_TRUST = [
  { icon: ShieldCheck, label: '100% White-Hat SEO' },
  { icon: BarChart3, label: 'Data-Driven Analytics' },
  { icon: Sparkles, label: 'Senior Search Strategists' },
]

export function PageHeader({ breadcrumb, title, subtitle, showTrust = true, eyebrow }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-mesh border-b border-slate-100">
      <div className="absolute inset-0 texture-dots opacity-40 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <Breadcrumb items={breadcrumb} />
        {eyebrow && (
          <span className="inline-block mt-4 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-white text-primary border border-primary-200/60 shadow-sm">
            {eyebrow}
          </span>
        )}
        <h1 className="display-tight text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark mt-3 max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="text-pretty text-slate-600 mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        )}
        {showTrust && (
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 pt-4 border-t border-slate-200/60">
            {SEO_TRUST.map(t => {
              const Icon = t.icon
              return (
                <li key={t.label} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <Icon size={15} className="text-primary" />
                  {t.label}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
