import { Search, RotateCcw, Filter, AlertCircle, Calendar, Building, Gavel } from 'lucide-react'
import { toBengaliNumber } from '../design-system/constants'

export default function ApprovalQueueFilters({
  searchQuery,
  onSearchChange,
  courtFilter,
  onCourtChange,
  typeFilter,
  onTypeChange,
  dateFilter,
  onDateChange,
  urgencyFilter,
  onUrgencyChange,
  workflowFilter,
  onWorkflowChange,
  onReset,
  institutions = [],
  totalCount,
  filteredCount,
}) {
  const hasActiveFilters =
    searchQuery ||
    courtFilter !== 'ALL' ||
    typeFilter !== 'ALL' ||
    dateFilter !== 'ALL' ||
    urgencyFilter !== 'ALL' ||
    workflowFilter !== 'PENDING_ONLY'

  return (
    <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs space-y-3 font-bangla">
      {/* Top Search bar & Workflow State Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="রেফারেন্স আইডি, মোকদ্দমা নং, কর্মকর্তা বা দাগ নম্বর অনুসন্ধান..."
            aria-label="অনুমোদন কিউ অনুসন্ধান"
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-900 placeholder:text-gray-400 transition-colors"
          />
        </div>

        {/* Workflow State Segmented Selector */}
        <div className="flex items-center gap-1 p-1 bg-govt-paper rounded border border-govt-border text-xs shrink-0">
          <button
            type="button"
            onClick={() => onWorkflowChange('PENDING_ONLY')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              workflowFilter === 'PENDING_ONLY'
                ? 'bg-govt-green text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            অপেক্ষমাণ কিউ (Pending)
          </button>
          <button
            type="button"
            onClick={() => onWorkflowChange('ALL')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              workflowFilter === 'ALL'
                ? 'bg-govt-green text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            সকল আদেশ (All)
          </button>
          <button
            type="button"
            onClick={() => onWorkflowChange('APPROVED')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors cursor-pointer ${
              workflowFilter === 'APPROVED'
                ? 'bg-govt-green text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            অনুমোদিত (Approved)
          </button>
        </div>
      </div>

      {/* Second Row: Specific Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1">
        {/* 1. Court filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <Building size={12} className="text-gray-400" />
            <span>আদালত</span>
          </label>
          <select
            value={courtFilter}
            onChange={(e) => onCourtChange(e.target.value)}
            aria-label="বিজ্ঞ আদালত ফিল্টার"
            className="w-full text-xs py-1.5 px-2 bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-800"
          >
            <option value="ALL">সকল আদালত</option>
            {institutions
              .filter((i) => i.institutionType === 'COURT')
              .map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
          </select>
        </div>

        {/* 2. Order Type filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <Gavel size={12} className="text-gray-400" />
            <span>আদেশের ধরন</span>
          </label>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            aria-label="আদেশের ধরন ফিল্টার"
            className="w-full text-xs py-1.5 px-2 bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-800"
          >
            <option value="ALL">সকল ধরন</option>
            <option value="INJUNCTION">নিষেধাজ্ঞা (Injunction)</option>
            <option value="STATUS_QUO">স্থিতাবস্থা (Status Quo)</option>
            <option value="ATTACHMENT">ক্রোকের আদেশ (Attachment)</option>
            <option value="STAY_ORDER">স্থগিতাদেশ (Stay Order)</option>
            <option value="TITLE_DECLARATION">স্বত্ব ঘোষণা (Title)</option>
          </select>
        </div>

        {/* 3. Urgency filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <AlertCircle size={12} className="text-gray-400" />
            <span>জরুরিতা / প্রায়োরিটি</span>
          </label>
          <select
            value={urgencyFilter}
            onChange={(e) => onUrgencyChange(e.target.value)}
            aria-label="জরুরিতা ফিল্টার"
            className="w-full text-xs py-1.5 px-2 bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-800"
          >
            <option value="ALL">সকল মাত্রা</option>
            <option value="URGENT">জরুরি (URGENT)</option>
            <option value="PRIORITY">অগ্রাধিকার (PRIORITY)</option>
            <option value="NORMAL">সাধারণ (NORMAL)</option>
          </select>
        </div>

        {/* 4. Submission Date filter */}
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
            <Calendar size={12} className="text-gray-400" />
            <span>দাখিলের সময়সীমা</span>
          </label>
          <select
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="দাখিলের সময় ফিল্টার"
            className="w-full text-xs py-1.5 px-2 bg-govt-paper/50 border border-govt-border rounded focus:border-govt-green focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green text-gray-800"
          >
            <option value="ALL">সকল সময়কাল</option>
            <option value="TODAY">আজকের দাখিল</option>
            <option value="LAST_7_DAYS">গত ৭ দিনের দাখিল</option>
            <option value="LAST_30_DAYS">গত ৩০ দিন</option>
          </select>
        </div>

        {/* 5. Reset button */}
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="w-full px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 border border-gray-300 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>রিসেট ফিল্টার</span>
            </button>
          ) : (
            <div className="text-[11px] text-gray-400 italic py-1 text-center w-full">
              ডিফল্ট ভিউ
            </div>
          )}
        </div>
      </div>

      {/* Summary status footer */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-govt-border/60">
        <div className="flex items-center gap-1.5 font-sans">
          <Filter size={13} className="text-gray-400" />
          <span>
            অনুমোদন কিউতে প্রদর্শিত:{' '}
            <strong className="text-gray-900 font-bold">
              {toBengaliNumber(filteredCount)}
            </strong>{' '}
            / মোট {toBengaliNumber(totalCount)} টি আদেশ
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
