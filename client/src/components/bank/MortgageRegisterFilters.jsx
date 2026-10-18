import { Search, Filter, RotateCcw } from 'lucide-react'
import { toBengaliNumber } from '../design-system/constants'

export default function MortgageRegisterFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  scopeFilter,
  onScopeChange,
  upazilaFilter,
  onUpazilaChange,
  onReset,
  totalRecords,
}) {
  const hasActiveFilters =
    Boolean(searchTerm) ||
    statusFilter !== 'ALL' ||
    scopeFilter !== 'ALL' ||
    upazilaFilter !== 'ALL'

  return (
    <div className="bg-white border border-govt-border rounded-lg p-4 shadow-xs font-bangla space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[260px]">
          <label htmlFor="mortgage-search" className="sr-only">
            বন্ধকী রেকর্ড অনুসন্ধান
          </label>
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            id="mortgage-search"
            type="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ঋণ দলিল নং (MORT-DB-...), দাগ নম্বর, খতিয়ান বা মৌজা দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green transition-colors"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-status" className="text-xs font-semibold text-gray-600 shrink-0">
              স্থিতি:
            </label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="text-xs sm:text-sm py-1.5 px-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green"
            >
              <option value="ALL">সকল স্থিতি</option>
              <option value="ACTIVE">সক্রিয় বন্ধক (Active)</option>
              <option value="RELEASE_PENDING">অবমুক্তি প্রক্রিয়াধীন (Pending Release)</option>
              <option value="RELEASED">দায়মুক্ত / অবমুক্ত (Released)</option>
              <option value="DISPUTED">বিরোধপূর্ণ বন্ধক (Disputed)</option>
            </select>
          </div>

          {/* Scope Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-scope" className="text-xs font-semibold text-gray-600 shrink-0">
              পরিধি:
            </label>
            <select
              id="filter-scope"
              value={scopeFilter}
              onChange={(e) => onScopeChange(e.target.value)}
              className="text-xs sm:text-sm py-1.5 px-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green"
            >
              <option value="ALL">সকল পরিধি</option>
              <option value="FULL_PARCEL">সম্পূর্ণ দাগ (Full Parcel)</option>
              <option value="PORTION">অংশবিশেষ (Portion)</option>
              <option value="SHARE">সুনির্দিষ্ট হিস্যা (Share)</option>
            </select>
          </div>

          {/* Upazila Filter */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="filter-upazila" className="text-xs font-semibold text-gray-600 shrink-0">
              উপজেলা:
            </label>
            <select
              id="filter-upazila"
              value={upazilaFilter}
              onChange={(e) => onUpazilaChange(e.target.value)}
              className="text-xs sm:text-sm py-1.5 px-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green"
            >
              <option value="ALL">সকল উপজেলা</option>
              <option value="DHANMONDI">ধানমন্ডি (Dhanmondi)</option>
              <option value="GULSHAN">গুলশান (Gulshan)</option>
              <option value="MIRPUR">মিরপুর (Mirpur)</option>
            </select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              title="ফিল্টার রিসেট করুন"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>রিসেট</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-gray-400" aria-hidden="true" />
          <span>
            ফিল্টার অনুসারে প্রদর্শিত: <strong className="font-sans text-gray-900">{toBengaliNumber(totalRecords)}</strong> টি বন্ধকী রেকর্ড
          </span>
        </div>
        {searchTerm && (
          <span className="text-[11px] text-gray-500">
            অনুসন্ধান: &ldquo;<span className="font-mono text-gray-700">{searchTerm}</span>&rdquo;
          </span>
        )}
      </div>
    </div>
  )
}
