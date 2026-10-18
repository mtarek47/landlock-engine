import { useState } from 'react'
import {
  Search,
  Filter,
  RotateCcw,
  Calendar,
  User,
  Layers,
  Fingerprint,
  Download,
  Info,
  X,
} from 'lucide-react'
import Button from '../design-system/Button'
import {
  toBengaliNumber,
  AUDIT_ACTIONS_BN,
  KNOWN_ACTORS,
} from '../design-system/constants'

export default function AuditFilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalEvents,
  filteredCount,
}) {
  const [showExportNotice, setShowExportNotice] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasActiveFilters =
    Boolean(filters.q) ||
    Boolean(filters.traceId) ||
    Boolean(filters.startDate) ||
    Boolean(filters.endDate) ||
    filters.action !== 'ALL' ||
    filters.entityType !== 'ALL' ||
    filters.actor !== 'ALL' ||
    filters.result !== 'ALL'

  return (
    <div className="bg-white border border-govt-border rounded-lg p-4 shadow-xs font-bangla space-y-3">
      {/* Primary Row matching Screen 7: Search, Action/Event Type, Date From, Date To, Filter & Reset */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 items-end">
        {/* Search bar */}
        <div className="lg:col-span-4 relative">
          <label htmlFor="audit-search-input" className="block text-xs font-semibold text-gray-700 mb-1">
            ট্রেস আইডি বা বিবরণ দিয়ে অনুসন্ধান:
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="audit-search-input"
              type="search"
              value={filters.q}
              onChange={(e) => onFilterChange('q', e.target.value)}
              placeholder="ট্রেস আইডি, সত্তা বা বিবরণের শব্দ..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green transition-colors"
            />
          </div>
        </div>

        {/* Action / Event Type */}
        <div className="lg:col-span-3">
          <label htmlFor="filter-action" className="block text-xs font-semibold text-gray-700 mb-1">
            ইভেন্ট ধরন / অ্যাকশন:
          </label>
          <select
            id="filter-action"
            value={filters.action}
            onChange={(e) => onFilterChange('action', e.target.value)}
            className="w-full text-xs sm:text-sm py-1.5 px-2.5 bg-gray-50 border border-gray-300 rounded-md text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green"
          >
            <option value="ALL">সকল ইভেন্ট ধরন</option>
            <option value="REGISTRY_CHECK">রেজিস্ট্রি গেটকিপার যাচাই (Registry Check)</option>
            <option value="APPROVE_ORDER">আদেশ অনুমোদন (Approve Order)</option>
            <option value="REJECT_ORDER">আদেশ প্রত্যাখ্যান (Reject Order)</option>
            <option value="SUBMIT_ORDER">আদেশ দাখিল (Submit Order)</option>
            <option value="CREATE_ORDER">আদেশের খসড়া প্রস্তুত (Draft Order)</option>
            <option value="REGISTER_MORTGAGE">ব্যাংক বন্ধক নিবন্ধন (Register Mortgage)</option>
            <option value="RELEASE_MORTGAGE">বন্ধক অবমুক্তি (Release Mortgage)</option>
            <option value="CREATE_RESTRICTION">নিষেধাজ্ঞা আরোপ (Restriction)</option>
            <option value="CREATE_PARCEL">পার্সেল নিবন্ধন (Create Parcel)</option>
          </select>
        </div>

        {/* Date From */}
        <div className="lg:col-span-2">
          <label htmlFor="filter-start-date-top" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <Calendar size={13} className="text-gray-400" />
            <span>তারিখ থেকে:</span>
          </label>
          <input
            id="filter-start-date-top"
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full py-1.5 px-2 text-xs border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green"
          />
        </div>

        {/* Date To */}
        <div className="lg:col-span-2">
          <label htmlFor="filter-end-date-top" className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <Calendar size={13} className="text-gray-400" />
            <span>তারিখ পর্যন্ত:</span>
          </label>
          <input
            id="filter-end-date-top"
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className="w-full py-1.5 px-2 text-xs border border-gray-300 rounded-md bg-gray-50 text-gray-800 font-sans focus:bg-white focus:outline-none focus:ring-2 focus:ring-govt-green"
          />
        </div>

        {/* Buttons / Actions */}
        <div className="lg:col-span-1 flex items-center gap-1.5">
          {/* Advanced toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 text-xs font-semibold rounded-md border transition-colors ${
              showAdvanced || Boolean(filters.traceId || filters.entityType !== 'ALL' || filters.actor !== 'ALL' || filters.result !== 'ALL')
                ? 'bg-green-50 border-govt-green text-govt-green'
                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
            }`}
            title="আরও ফিল্টার অপশন"
            aria-expanded={showAdvanced}
          >
            <Filter size={14} aria-hidden="true" />
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="p-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              title="সকল ফিল্টার মুছুন"
            >
              <RotateCcw size={14} aria-hidden="true" />
            </button>
          )}

          {/* Export Action */}
          <button
            type="button"
            onClick={() => setShowExportNotice(true)}
            className="p-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors"
            title="নিরীক্ষা লগ রপ্তানি নীতি"
          >
            <Download size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Advanced Filter Collapsible Area */}
      {showAdvanced && (
        <div className="pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
          {/* Actor Filter */}
          <div>
            <label htmlFor="filter-actor" className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <User size={13} className="text-gray-400" />
              <span>সম্পাদনকারী কর্মকর্তা (Actor):</span>
            </label>
            <select
              id="filter-actor"
              value={filters.actor}
              onChange={(e) => onFilterChange('actor', e.target.value)}
              className="w-full py-1.5 px-2 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
            >
              <option value="ALL">সকল কর্মকর্তা</option>
              {Object.entries(KNOWN_ACTORS).map(([id, act]) => (
                <option key={id} value={id}>
                  {act.name} ({act.roleBn})
                </option>
              ))}
            </select>
          </div>

          {/* Result Filter */}
          <div>
            <label htmlFor="filter-result" className="block font-semibold text-gray-700 mb-1">
              ফলাফল / সিদ্ধান্ত (Result):
            </label>
            <select
              id="filter-result"
              value={filters.result}
              onChange={(e) => onFilterChange('result', e.target.value)}
              className="w-full py-1.5 px-2 bg-gray-50 border border-gray-300 rounded text-gray-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
            >
              <option value="ALL">সকল সিদ্ধান্ত</option>
              <option value="BLOCKED_BY_VALID_ORDER">বৈধ আদেশে অবরুদ্ধ (BLOCKED)</option>
              <option value="CLEAR">নিষেধাজ্ঞামুক্ত (CLEAR)</option>
              <option value="MORTGAGE_REQUIRES_RELEASE">বন্ধক মুক্তি আবশ্যক (MORTGAGE)</option>
              <option value="REVIEW_REQUIRED">পর্যালোচনা প্রয়োজন (REVIEW)</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="filter-start-date" className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Calendar size={13} className="text-gray-400" />
              <span>শুরুর তারিখ (Start Date):</span>
            </label>
            <input
              id="filter-start-date"
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded bg-gray-50 text-gray-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="filter-end-date" className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Calendar size={13} className="text-gray-400" />
              <span>সমাপ্তির তারিখ (End Date):</span>
            </label>
            <input
              id="filter-end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="w-full py-1 px-2 border border-gray-300 rounded bg-gray-50 text-gray-800 font-sans focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
            />
          </div>

          {/* Trace ID search */}
          <div className="sm:col-span-2 lg:col-span-4">
            <label htmlFor="filter-trace-id" className="block font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Fingerprint size={13} className="text-gray-400" />
              <span>কোরিলেশন / ট্রেস আইডি (Correlation Trace ID):</span>
            </label>
            <input
              id="filter-trace-id"
              type="text"
              value={filters.traceId}
              onChange={(e) => onFilterChange('traceId', e.target.value)}
              placeholder="যেমন: e6e28f2a-46a0-42ae-b6d7-843fb9848ae0"
              className="w-full py-1.5 px-3 border border-gray-300 rounded bg-gray-50 font-mono text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
            />
          </div>
        </div>
      )}

      {/* Footer info: counts and search summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span>
            প্রদর্শিত রেকর্ড: <strong className="font-sans text-gray-900">{toBengaliNumber(filteredCount)}</strong> টি
          </span>
          <span className="text-gray-400">•</span>
          <span>
            সার্ভারে সংরক্ষিত সর্বমোট: <strong className="font-sans text-gray-900">{toBengaliNumber(totalEvents)}</strong> টি
          </span>
        </div>

        {hasActiveFilters && (
          <span className="text-[11px] text-govt-green font-semibold">
            ফিল্টার সক্রিয় রয়েছে • পৃষ্ঠা ১ এ সংরক্ষিত
          </span>
        )}
      </div>

      {/* Export Policy Information Modal */}
      {showExportNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-bangla"
          role="dialog"
          aria-modal="true"
          aria-labelledby="export-dialog-title"
        >
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl border border-govt-border p-5 space-y-4 text-xs sm:text-sm">
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2 text-govt-green font-bold text-base">
                <Info size={20} className="text-govt-green shrink-0" />
                <h3 id="export-dialog-title">নিরীক্ষা লগ রপ্তানি নীতি (Audit Export Policy)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExportNotice(false)}
                className="text-gray-400 hover:text-gray-700"
                aria-label="বন্ধ করুন"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-gray-700 leading-relaxed">
              <p>
                ল্যান্ডলক ইঞ্জিনের অডিট সুরক্ষা নীতি অনুযায়ী, <strong>শুধুমাত্র সার্ভার-স্তরে অনুমোদিত ও ক্রিপ্টোগ্রাফিকভাবে স্বাক্ষরিত এক্সপোর্ট এন্ডপয়েন্ট</strong> সমর্থিত।
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-950 text-xs">
                <strong>বর্তমান স্ট্যাটাস:</strong> কেন্দ্রীয় ব্যাকএন্ড ক্লাস্টারে স্বায়ত্তশাসিত অডিট এক্সপোর্ট সার্ভিস এখনো অনুমোদিত নয়। ক্লায়েন্ট-সাইডে অননুমোদিত এক্সপোর্ট অডিট প্রমাণের বৈধতা নষ্ট করতে পারে।
              </div>
              <p className="text-[11px] text-gray-500">
                তথ্য অধিকার আইন ও বিচারিক সুরক্ষার স্বার্থে অডিট রেকর্ডসমূহ স্ক্রিনে সরাসরি নিরীক্ষাযোগ্য।
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowExportNotice(false)}>
                বুঝেছি
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
