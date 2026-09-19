'use client'

interface AdminPaginationProps {
  page: number
  pageCount: number
  totalResults?: number
  onPageChange: (page: number) => void
}

export function AdminPagination({ page, pageCount, totalResults, onPageChange }: AdminPaginationProps) {
  if (pageCount <= 1) return null

  return (
    <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#E5E7EB]">
      {typeof totalResults === 'number' && (
        <span className="text-xs text-[#6B7280] mr-2">
          Page {page} of {pageCount} — {totalResults} Total Results
        </span>
      )}
      {Array.from({ length: pageCount }, (_, i) => i + 1)
        .filter(p => p === 1 || p === pageCount || Math.abs(p - page) <= 2)
        .map((p, idx, arr) => (
          <span key={p} className="flex items-center gap-2">
            {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-[#9CA3AF]">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={[
                'min-w-[30px] h-[30px] px-2 text-xs font-semibold rounded',
                p === page ? 'bg-[#1F2937] text-white' : 'bg-white border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]',
              ].join(' ')}
            >
              {p}
            </button>
          </span>
        ))}
      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className="h-[30px] px-3 text-xs font-bold rounded bg-[#1F2937] text-white disabled:opacity-40"
      >
        NEXT ▸
      </button>
    </div>
  )
}
