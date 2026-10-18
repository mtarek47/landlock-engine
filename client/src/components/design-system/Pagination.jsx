import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { toBengaliNumber } from './constants'

/**
 * Pagination Component
 * Server-side / client-side pagination with Bengali numeral indicators and page-size selection.
 */
export default function Pagination({
  page = 1,
  pageSize = 10,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className = '',
  disabled = false,
}) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize))
  const currentPage = Math.min(Math.max(1, page), totalPages)

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endRecord = Math.min(currentPage * pageSize, totalRecords)

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  const handleFirst = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(1)
    }
  }

  const handleLast = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(totalPages)
    }
  }

  // Generate visible page numbers
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <nav
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-4 bg-white border-t border-govt-border text-xs text-gray-700 font-bangla select-none ${className}`}
      aria-label="পৃষ্ঠা পরিবর্তন নেভিগেশন"
    >
      {/* Left: Record Range Summary & Page Size */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-gray-600 font-medium">
          রেকর্ড:{' '}
          <strong className="text-gray-900 font-sans">
            {toBengaliNumber(startRecord)} - {toBengaliNumber(endRecord)}
          </strong>{' '}
          / মোট <strong className="text-gray-900 font-sans">{toBengaliNumber(totalRecords)}</strong> টি
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-gray-300">
            <label htmlFor="page-size-select" className="text-gray-500 text-[11px]">
              প্রতি পৃষ্ঠায়:
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              disabled={disabled}
              className="h-8 px-2 bg-gray-50 border border-gray-300 rounded text-xs font-sans text-gray-800 focus:outline-none focus:ring-1 focus:ring-govt-green disabled:opacity-50"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {toBengaliNumber(size)} টি
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          onClick={handleFirst}
          disabled={currentPage <= 1 || disabled}
          className="h-8 w-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="প্রথম পৃষ্ঠা"
          aria-label="প্রথম পৃষ্ঠায় যান"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1 || disabled}
          className="h-8 px-2 flex items-center justify-center gap-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
          aria-label="পূর্ববর্তী পৃষ্ঠা"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">পূর্ববর্তী</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {getPageNumbers().map((p) => {
            const isActive = p === currentPage
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange && onPageChange(p)}
                disabled={disabled}
                className={`h-8 min-w-[32px] px-2 flex items-center justify-center rounded text-xs font-sans transition-all ${
                  isActive
                    ? 'bg-govt-green text-white font-bold shadow-xs'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`পৃষ্ঠা ${toBengaliNumber(p)}`}
              >
                {toBengaliNumber(p)}
              </button>
            )
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= totalPages || disabled}
          className="h-8 px-2 flex items-center justify-center gap-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold"
          aria-label="পরবর্তী পৃষ্ঠা"
        >
          <span className="hidden sm:inline">পরবর্তী</span>
          <ChevronRight size={16} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={handleLast}
          disabled={currentPage >= totalPages || disabled}
          className="h-8 w-8 flex items-center justify-center rounded border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="সর্বশেষ পৃষ্ঠা"
          aria-label="সর্বশেষ পৃষ্ঠায় যান"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </nav>
  )
}
