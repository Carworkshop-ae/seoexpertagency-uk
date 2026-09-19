'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Plus, Search, Trash2, Pencil, ExternalLink, Copy, RefreshCw } from 'lucide-react'
import { AdminLinkButton, AdminButton } from '@/components/admin/ui/AdminButton'
import { EmptyState } from '@/components/admin/ui/AdminStates'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { AdminPagination } from '@/components/admin/ui/AdminPagination'

export interface SeoPageRow {
  id: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  title: string | null
  seo_title: string | null
  faq_json: unknown
  creator: { full_name: string } | null
}

interface Props {
  rows: SeoPageRow[]
  /** Whether the acting user may delete — deletion removes a live URL. */
  canDelete: boolean
}

const ICON_BTN = 'flex items-center justify-center h-7 w-7 rounded-md text-white transition-opacity hover:opacity-90 disabled:opacity-50'

export function SeoPagesTable({ rows: initialRows, canDelete }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState(initialRows)
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [pageSize, setPageSize] = useState(30)
  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState<SeoPageRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return rows.filter(r => {
      if (statusFilter && r.status !== statusFilter) return false
      if (!needle) return true
      return [r.title, r.slug].some(v => v?.toLowerCase().includes(needle))
    })
  }, [rows, q, statusFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function refresh() {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 500)
  }

  async function togglePublish(row: SeoPageRow) {
    const nextStatus = row.status === 'published' ? 'draft' : 'published'
    setBusyId(row.id)
    try {
      const res = await fetch(`/api/admin/seo-pages/${row.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) throw new Error('Update failed')
      setRows(prev => prev.map(r => r.id === row.id ? { ...r, status: nextStatus } : r))
      toast.success(nextStatus === 'published' ? 'Page published' : 'Page unpublished')
    } catch {
      toast.error('Could not update publish status')
    } finally {
      setBusyId(null)
    }
  }

  async function duplicate(row: SeoPageRow) {
    setBusyId(row.id)
    try {
      const res = await fetch(`/api/admin/seo-pages/${row.id}/duplicate`, { method: 'POST' })
      const body = await res.json().catch(() => null) as { error?: string; id?: string } | null
      if (!res.ok) throw new Error(body?.error ?? 'Duplicate failed')
      toast.success('Page duplicated')
      if (body?.id) router.push(`/admin/seo-pages/${body.id}`)
      else router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Duplicate failed')
    } finally {
      setBusyId(null)
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/seo-pages/${pendingDelete.id}`, { method: 'DELETE' })
      const body = await res.json().catch(() => null) as { error?: string } | null
      if (!res.ok) throw new Error(body?.error ?? 'Delete failed')
      toast.success('SEO Page deleted')
      setRows(prev => prev.filter(r => r.id !== pendingDelete.id))
      setPendingDelete(null)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-zinc-600">
          Display
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
            aria-label="Rows to display"
            className="h-9 px-2 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4472C4]"
          >
            {[30, 60, 100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <AdminButton variant="success" onClick={refresh} loading={refreshing}>
          <RefreshCw size={14} /> Refresh
        </AdminButton>
        <div className="flex-1" />
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            value={q}
            onChange={e => { setQ(e.target.value); setPage(1) }}
            placeholder="Search page name…"
            aria-label="Search SEO pages"
            className="w-full h-9 pl-9 pr-3 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4472C4]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
          aria-label="Filter by status"
          className="h-9 px-3 border border-zinc-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4472C4]"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
        <AdminLinkButton href="/admin/seo-pages/new" variant="primary">
          <Plus size={15} /> Add SEO Page
        </AdminLinkButton>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? 'No SEO pages yet' : 'No matches'}
          description={
            rows.length === 0
              ? 'Create your first SEO page — it appears on the public site as soon as you publish it.'
              : 'Try a different search term or status filter.'
          }
        />
      ) : (
        <div className="overflow-x-auto border border-zinc-200 rounded-lg bg-white">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr className="text-left text-xs font-bold text-zinc-600 uppercase tracking-wide">
                <th className="px-4 py-3">Page Name</th>
                <th className="px-4 py-3">Slug URL</th>
                <th className="px-4 py-3">Meta Title</th>
                <th className="px-4 py-3">Created By</th>
                <th className="px-4 py-3">FAQ&apos;s</th>
                <th className="px-4 py-3">Publish</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {visible.map(row => {
                const label = row.title || row.slug
                const faqCount = Array.isArray(row.faq_json) ? row.faq_json.length : 0
                const isBusy = busyId === row.id
                return (
                  <tr key={row.id} className="hover:bg-zinc-50/70">
                    <td className="px-4 py-3">
                      <Link href={`/admin/seo-pages/${row.id}`} className="font-semibold text-zinc-900 hover:text-[#4472C4]">
                        {label}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#4472C4]">
                        /{row.slug}
                        {row.status === 'published' && (
                          <a
                            href={`/${row.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-400 hover:text-[#4472C4]"
                            aria-label={`View ${label} on the site`}
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 max-w-xs">
                      {row.seo_title || <span className="text-amber-600 font-semibold">Missing</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{row.creator?.full_name ?? '—'}</td>
                    <td className="px-4 py-3 text-xs text-zinc-600">{faqCount}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => togglePublish(row)}
                        disabled={isBusy}
                        aria-label={row.status === 'published' ? `Unpublish ${label}` : `Publish ${label}`}
                        className={[
                          'relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50',
                          row.status === 'published' ? 'bg-emerald-500' : 'bg-zinc-300',
                        ].join(' ')}
                      >
                        <span className={[
                          'inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform',
                          row.status === 'published' ? 'translate-x-[18px]' : 'translate-x-1',
                        ].join(' ')} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/seo-pages/${row.id}`}
                          className={`${ICON_BTN} bg-[#4472C4]`}
                          aria-label={`Edit ${label}`}
                        >
                          <Pencil size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => duplicate(row)}
                          disabled={isBusy}
                          className={`${ICON_BTN} bg-[#E8601C]`}
                          aria-label={`Duplicate ${label}`}
                        >
                          <Copy size={13} />
                        </button>
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => setPendingDelete(row)}
                            className={`${ICON_BTN} bg-red-500`}
                            aria-label={`Delete ${label}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <AdminPagination page={currentPage} pageCount={pageCount} totalResults={filtered.length} onPageChange={setPage} />
        </div>
      )}

      {pageCount <= 1 && filtered.length > 0 && (
        <p className="text-xs text-zinc-400">
          Showing {visible.length} of {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </p>
      )}

      <ConfirmModal
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        title="Delete this SEO page?"
        message={
          pendingDelete?.status === 'published'
            ? `"${pendingDelete.title ?? pendingDelete.slug}" is live at /${pendingDelete.slug}. Deleting it removes that page and anyone linking to it will get a 404. This cannot be undone.`
            : `"${pendingDelete?.title ?? pendingDelete?.slug}" will be permanently deleted. This cannot be undone.`
        }
      />
    </div>
  )
}
