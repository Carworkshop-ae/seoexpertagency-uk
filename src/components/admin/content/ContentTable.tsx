'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Search, Trash2, Pencil, ExternalLink } from 'lucide-react'
import { AdminLinkButton } from '@/components/admin/ui/AdminButton'
import { AdminBadge } from '@/components/admin/ui/AdminBadge'
import { EmptyState } from '@/components/admin/ui/AdminStates'
import { ConfirmModal } from '@/components/admin/ConfirmModal'

export interface ContentRow {
  id: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  sort_order: number
  updated_at: string
  name?: string | null
  title?: string | null
  short_description?: string | null
  seo_title?: string | null
  seo_description?: string | null
}

interface Props {
  rows: ContentRow[]
  /** Admin module segment, e.g. `services`. */
  basePath: string
  /** Public URL prefix for the "view" link, e.g. `/projects`. Omit when this
   *  content type has no standalone public page (e.g. services and
   *  industries, which only render as cards on the homepage, and locations,
   *  which has no public page at all) — the "view" link is hidden instead. */
  publicPrefix?: string
  singular: string
  plural: string
  /** Whether the acting user may delete — deletion removes a live URL. */
  canDelete: boolean
}

export function ContentTable({ rows, basePath, publicPrefix, singular, plural, canDelete }: Props) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pendingDelete, setPendingDelete] = useState<ContentRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return rows.filter(r => {
      if (statusFilter && r.status !== statusFilter) return false
      if (!needle) return true
      return [r.name, r.title, r.slug].some(v => v?.toLowerCase().includes(needle))
    })
  }, [rows, q, statusFilter])

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/${basePath}/${pendingDelete.id}`, { method: 'DELETE' })
      const body = await res.json().catch(() => null) as { error?: string } | null
      if (!res.ok) throw new Error(body?.error ?? 'Delete failed')
      toast.success(`${singular} deleted`)
      setPendingDelete(null)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder={`Search ${plural.toLowerCase()}…`}
            aria-label={`Search ${plural.toLowerCase()}`}
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
        <AdminLinkButton href={`/admin/${basePath}/new`} variant="primary">
          <Plus size={15} /> Add {singular}
        </AdminLinkButton>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? `No ${plural.toLowerCase()} yet` : 'No matches'}
          description={
            rows.length === 0
              ? `Create your first ${singular.toLowerCase()} — it appears on the public site as soon as you publish it.`
              : 'Try a different search term or status filter.'
          }
        />
      ) : (
        <div className="overflow-x-auto border border-zinc-200 rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                <th className="px-4 py-3">{singular}</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">SEO</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map(row => {
                const label = row.name ?? row.title ?? row.slug
                // Surfaced inline because a published page with no metadata is
                // the single most common SEO regression in this CMS.
                const seoMissing = !row.seo_title || !row.seo_description
                return (
                  <tr key={row.id} className="hover:bg-zinc-50/70">
                    <td className="px-4 py-3">
                      <Link href={`/admin/${basePath}/${row.id}`} className="font-semibold text-zinc-900 hover:text-[#4472C4]">
                        {label}
                      </Link>
                      {row.short_description && (
                        <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1 max-w-md">{row.short_description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">/{row.slug}</td>
                    <td className="px-4 py-3"><AdminBadge kind={row.status}>{row.status}</AdminBadge></td>
                    <td className="px-4 py-3">
                      {seoMissing
                        ? <span className="text-xs font-semibold text-amber-600">Incomplete</span>
                        : <span className="text-xs text-zinc-400">Complete</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {row.status === 'published' && publicPrefix && (
                          <a
                            href={`${publicPrefix}/${row.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded text-zinc-400 hover:text-[#4472C4] hover:bg-zinc-100"
                            aria-label={`View ${label} on the site`}
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <Link
                          href={`/admin/${basePath}/${row.id}`}
                          className="p-1.5 rounded text-zinc-400 hover:text-[#4472C4] hover:bg-zinc-100"
                          aria-label={`Edit ${label}`}
                        >
                          <Pencil size={15} />
                        </Link>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => setPendingDelete(row)}
                            className="p-1.5 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50"
                            aria-label={`Delete ${label}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        title={`Delete this ${singular.toLowerCase()}?`}
        message={
          pendingDelete?.status === 'published' && publicPrefix
            ? `"${pendingDelete.name ?? pendingDelete.title}" is live at ${publicPrefix}/${pendingDelete.slug}. Deleting it removes that page and anyone linking to it will get a 404. This cannot be undone.`
            : pendingDelete?.status === 'published'
              ? `"${pendingDelete.name ?? pendingDelete.title}" is currently published and visible on the site. Deleting it cannot be undone.`
              : `"${pendingDelete?.name ?? pendingDelete?.title}" will be permanently deleted. This cannot be undone.`
        }
      />
    </div>
  )
}
