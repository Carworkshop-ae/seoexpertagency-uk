import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getActingUser } from '@/lib/auth-guard'
import { SEO_ROLES } from '@/lib/seo-route'
import { getSeoHealth } from '@/lib/seo-health'

export const metadata = { title: 'SEO Health' }

async function counts() {
  const h = await getSeoHealth()
  return {
    total: h.total,
    noTitle: h.missingMetaTitle,
    noDesc: h.missingMetaDescription,
    noindex: h.noindex,
    custom: h.withCustomSeo,
  }
}

export default async function SeoHealthPage() {
  const acting = await getActingUser()
  if (!acting || !SEO_ROLES.includes(acting.role)) redirect('/admin')
  const c = await counts()

  const rows = [
    { ok: c.total - c.noTitle, bad: c.noTitle, label: 'meta title', fix: '/admin/static-page-seo' },
    { ok: c.total - c.noDesc, bad: c.noDesc, label: 'meta description', fix: '/admin/static-page-seo' },
    { ok: c.total, bad: c.noindex, label: 'noindex set (review)', fix: '/admin/static-page-seo', invert: true },
    { ok: c.custom, bad: c.total - c.custom, label: 'custom SEO overlay', fix: '/admin/static-page-seo', soft: true },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-zinc-900">SEO Health Dashboard</h1>
      <p className="text-sm text-zinc-500 mt-1 mb-6">Across {c.total.toLocaleString('en-AE')} published pages.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[['Total pages', c.total], ['Custom SEO', c.custom], ['Missing description', c.noDesc], ['NoIndex', c.noindex]].map(([l, v]) => (
          <div key={l} className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4">
            <p className="text-2xl font-extrabold text-zinc-900">{Number(v).toLocaleString('en-AE')}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm divide-y divide-zinc-100">
        {rows.map(r => (
          <div key={r.label} className="flex items-center justify-between px-5 py-3.5 text-sm">
            <span className="flex items-center gap-2">
              {r.bad === 0
                ? <span className="text-green-600">✅</span>
                : <span className={r.soft ? 'text-amber-500' : 'text-red-500'}>{r.invert || r.soft ? '⚠️' : '❌'}</span>}
              <span className="text-zinc-700">
                {r.bad === 0
                  ? <>All pages have {r.label}</>
                  : <><strong>{r.bad.toLocaleString('en-AE')}</strong> pages {r.invert ? 'have' : r.soft ? 'have no' : 'missing'} {r.label}</>}
              </span>
            </span>
            {r.bad > 0 && <Link href={r.fix} className="text-xs font-semibold text-[#4472C4] hover:underline">Fix These →</Link>}
          </div>
        ))}
      </div>
    </div>
  )
}
