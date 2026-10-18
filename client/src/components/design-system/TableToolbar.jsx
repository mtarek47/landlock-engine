import { RotateCcw, Filter, X } from 'lucide-react'
import { toBengaliNumber } from './constants'

/**
 * TableToolbar Component
 * Responsive toolbar accommodating search, filter selects, active filter chips, and action buttons.
 */
export default function TableToolbar({
  searchSlot,
  filtersSlot,
  actionSlot,
  activeFilters = [], // Array of { key, label, onRemove }
  onResetFilters,
  totalRecords,
  className = '',
}) {
  const hasActiveFilters = activeFilters.length > 0

  return (
    <div className={`space-y-3 font-bangla ${className}`}>
      {/* Primary Row: Search + Filters + Actions */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search Bar & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 min-w-0">
          {searchSlot && <div className="w-full sm:max-w-xs">{searchSlot}</div>}
          {filtersSlot && (
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {filtersSlot}
            </div>
          )}
        </div>

        {/* Right: Actions & Total Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {totalRecords !== undefined && (
            <div className="text-xs text-gray-500 hidden sm:block">
              মোট: <strong className="text-gray-900 font-sans">{toBengaliNumber(totalRecords)}</strong>
            </div>
          )}
          {actionSlot && <div className="flex items-center gap-2">{actionSlot}</div>}
        </div>
      </div>

      {/* Secondary Row: Active Filter Chips & Reset All */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 text-xs">
          <span className="text-gray-500 font-semibold flex items-center gap-1 text-[11px]">
            <Filter size={12} className="text-govt-green" />
            <span>সক্রিয় ফিল্টার:</span>
          </span>

          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-govt-green-dark border border-green-200 text-xs font-medium"
            >
              <span>{filter.label}</span>
              {filter.onRemove && (
                <button
                  type="button"
                  onClick={filter.onRemove}
                  className="p-0.5 rounded-full hover:bg-green-200/60 transition-colors text-govt-green"
                  aria-label={`${filter.label} ফিল্টার মুছুন`}
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}

          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[11px] font-semibold text-gray-500 hover:text-red-700 underline underline-offset-2 ml-1 transition-colors flex items-center gap-1"
            >
              <RotateCcw size={11} />
              <span>ফিল্টার রিসেট</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}
