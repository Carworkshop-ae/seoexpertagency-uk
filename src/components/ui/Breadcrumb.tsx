import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  /** `dark` is for placement on a saturated/dark surface (the hero). Defaults
   *  to `light`, so every existing caller renders exactly as before. */
  tone?: 'light' | 'dark'
}

const TONES = {
  light: {
    list: 'text-[#6B7280]',
    separator: 'text-[#9CA3AF]',
    current: 'text-[#1F2937] font-medium',
    link: 'hover:text-primary hover:underline transition-colors',
  },
  dark: {
    list: 'text-blue-100',
    separator: 'text-white/40',
    current: 'text-white font-medium',
    link: 'hover:text-white hover:underline transition-colors',
  },
} as const

export function Breadcrumb({ items, tone = 'light' }: BreadcrumbProps) {
  const t = TONES[tone]

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1 text-sm ${t.list}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <svg className={`w-3 h-3 shrink-0 ${t.separator}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              {isLast || !item.href ? (
                <span className={isLast ? t.current : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className={t.link}>
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
