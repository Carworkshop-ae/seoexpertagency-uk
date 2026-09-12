'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Pencil, ImageOff } from 'lucide-react'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { EmptyState } from '@/components/admin/ui/AdminStates'

export interface StaticPageSeoRow {
  id: string
  slug: string
  title: string
  path: string
  status: 'draft' | 'published' | 'archived'
  seo_title: string | null
  seo_description: string | null
  meta_keyword: string | null
  og_image: string | null
}

function truncate(s: string | null | undefined, max: number): string {
  if (!s) return '—'
  return s.length > max ? `${s.slice(0, max)}…` : s
}

export function StaticPageSeoTable({ rows }: { rows: StaticPageSeoRow[] }) {
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return rows.filter(r => {
      if (statusFilter && r.status !== statusFilter) return false
      if (!needle) return true
      return [r.title, r.path, r.seo_title, r.meta_keyword].some(v => v?.toLowerCase().includes(needle))
    })
  }, [rows, q, statusFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search title, URL, or keyword…"
            aria-label="Search static pages"
            className="w-full h-9 pl-9 pr-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4472C4]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="h-9 px-3 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4472C4]"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? 'No static pages found' : 'No matches'}
          description={rows.length === 0 ? undefined : 'Try a different search term or status filter.'}
        />
      ) : (
        <div className="overflow-x-auto border border-zinc-200 rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr className="text-left text-xs font-bold text-zinc-600 uppercase tracking-wide">
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3">Meta Title</th>
                <th className="px-4 py-3">Meta Keywords</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-zinc-50/70">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-zinc-900">{p.title}</p>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">{p.path}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600 max-w-xs" title={p.seo_title ?? ''}>
                    {p.seo_title ? truncate(p.seo_title, 50) : <span className="text-amber-600 font-semibold">Missing</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600" title={p.meta_keyword ?? ''}>{truncate(p.meta_keyword, 60)}</td>
                  <td className="px-4 py-3 text-xs text-zinc-600 max-w-xs" title={p.seo_description ?? ''}>
                    {p.seo_description ? truncate(p.seo_description, 80) : <span className="text-amber-600 font-semibold">Missing</span>}
                  </td>
                  <td className="px-4 py-3">
                    {p.og_image ? (
                      <div className="relative w-10 h-10 rounded overflow-hidden border border-zinc-200">
                        <Image src={p.og_image} alt="" fill className="object-cover" />
                      </div>
                    ) : (
                      <ImageOff size={16} className="text-zinc-300" />
                    )}
                  </td>
                  <td className="px-4 py-3"><AdminBadge kind={p.status}>{p.status}</AdminBadge></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/admin/pages/static/${p.slug}`}
                        aria-label={`Edit ${p.title}`}
                        className="flex items-center justify-center h-7 w-7 rounded-md bg-[#4472C4] text-white hover:opacity-90"
                      >
                        <Pencil size={13} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
