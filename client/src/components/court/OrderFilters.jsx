import { Search, RotateCcw, Filter } from 'lucide-react'
import { toBengaliNumber } from '../design-system/constants'

export default function OrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onReset,
  totalResults,
  filteredCount,
}) {
  const hasActiveFilters = searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'

  return (
    <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="মোকদ্দমা নম্বর, আদেশের রেফারেন্স বা বিবরণ দ্বারা অনুসন্ধান..."
            aria-label="মোকদ্দমা বা আদেশ অনুসন্ধান"
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-900 placeholder:text-gray-400 transition-colors"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status filter */}
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="আদেশের স্থিতি ফিল্টার"
              className="w-full text-xs sm:text-sm py-2 px-2.5 bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-800"
            >
              <option value="ALL">সকল স্থিতি (All Statuses)</option>
              <option value="APPROVED">সক্রিয় / অনুমোদিত (Approved)</option>
              <option value="SUBMITTED">দাখিলকৃত / অপেক্ষমাণ (Submitted)</option>
              <option value="DRAFT">খসড়া (Draft)</option>
              <option value="RELEASED">অবমুক্ত / প্রত্যাহারকৃত (Released)</option>
              <option value="REJECTED">প্রত্যাখ্যাত (Rejected)</option>
              <option value="EXPIRED">মেয়াদোত্তীর্ণ (Expired)</option>
            </select>
          </div>

          {/* Type filter */}
          <div className="w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => onTypeChange(e.target.value)}
              aria-label="আদেশের প্রকৃতি ফিল্টার"
              className="w-full text-xs sm:text-sm py-2 px-2.5 bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-800"
            >
              <option value="ALL">সকল ধরন (All Types)</option>
              <option value="INJUNCTION">নিষেধাজ্ঞা (Injunction)</option>
              <option value="STATUS_QUO">স্থিতাবস্থা (Status Quo)</option>
              <option value="ATTACHMENT">ক্রোকের আদেশ (Attachment)</option>
              <option value="STAY_ORDER">স্থগিতাদেশ (Stay Order)</option>
              <option value="TITLE_DECLARATION">স্বত্ব ঘোষণা (Title Declaration)</option>
            </select>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 border border-gray-300 rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="ফিল্টার রিসেট করুন"
            >
              <RotateCcw size={14} />
              <span>রিসেট</span>
            </button>
          )}
        </div>
      </div>

      {/* Result metrics bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-govt-border/60">
        <div className="flex items-center gap-1.5 font-sans">
          <Filter size={13} className="text-gray-400" />
          <span>
            প্রদর্শিত ফলাফল:{' '}
            <strong className="text-gray-800 font-bold">
              {toBengaliNumber(filteredCount)}
            </strong>{' '}
            / মোট {toBengaliNumber(totalResults)} টি আদেশ
          </span>
        </div>
        {hasActiveFilters && (
          <span className="text-[11px] text-govt-green font-medium">
            ফিল্টার সক্রিয় রয়েছে
          </span>
        )}
      </div>
    </div>
  )
}
