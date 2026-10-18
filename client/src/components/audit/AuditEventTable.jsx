import { useState } from 'react'
import {
  Clock,
  User,
  Fingerprint,
  FileText,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Building,
  Shield,
  Layers,
  ExternalLink,
} from 'lucide-react'
import StatusBadge from '../design-system/StatusBadge'
import Button from '../design-system/Button'
import {
  toBengaliNumber,
  AUDIT_ACTIONS_BN,
  KNOWN_ACTORS,
  KNOWN_INSTITUTIONS,
} from '../design-system/constants'

// Format timestamp with explicit BST (Bangladesh Standard Time, UTC+6)
function formatTimestampWithTimezone(dateString) {
  if (!dateString) return { bnText: 'N/A', isoText: 'N/A' }
  try {
    const d = new Date(dateString)
    // Format in Bangladesh Standard Time (UTC+6)
    const options = {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    const formatted = new Intl.DateTimeFormat('en-GB', options).format(d)
    return {
      date: formatted.slice(0, 10),
      time: formatted.slice(12),
      tz: 'BST (UTC+6)',
      raw: d.toISOString(),
    }
  } catch {
    return { date: dateString, time: '', tz: 'UTC+6', raw: dateString }
  }
}

// Extract result badge from reason / changeSummary
function deriveResultBadge(event) {
  const text = `${event.reason || ''} ${event.changeSummary || ''}`.toUpperCase()

  if (text.includes('BLOCKED_BY_VALID_ORDER')) {
    return <StatusBadge decision="BLOCKED_BY_VALID_ORDER" size="sm" />
  }
  if (text.includes('CLEAR')) {
    return <StatusBadge decision="CLEAR" size="sm" />
  }
  if (text.includes('MORTGAGE_REQUIRES_RELEASE')) {
    return <StatusBadge decision="MORTGAGE_REQUIRES_RELEASE" size="sm" />
  }
  if (text.includes('REVIEW_REQUIRED')) {
    return <StatusBadge decision="REVIEW_REQUIRED" size="sm" />
  }
  if (event.action === 'APPROVE_ORDER') {
    return <StatusBadge status="APPROVED" size="sm" />
  }
  if (event.action === 'REJECT_ORDER') {
    return <StatusBadge status="REJECTED" size="sm" />
  }
  if (event.action === 'SUBMIT_ORDER') {
    return <StatusBadge status="SUBMITTED" size="sm" />
  }
  if (event.action === 'RELEASE_MORTGAGE' || event.action === 'RELEASE_RESTRICTION') {
    return <StatusBadge status="RELEASED" size="sm" />
  }

  // Default success badge
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300">
      সম্পন্ন (Logged)
    </span>
  )
}

export default function AuditEventTable({
  events,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  pageSize,
  onPageChange,
  onInspectEvent,
  onResetFilters,
}) {
  const [copiedTraceId, setCopiedTraceId] = useState(null)

  const handleCopyTrace = (traceId, e) => {
    e.stopPropagation()
    if (!traceId) return
    navigator.clipboard.writeText(traceId)
    setCopiedTraceId(traceId)
    setTimeout(() => {
      setCopiedTraceId(null)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-govt-border rounded-lg p-6 shadow-xs space-y-4 font-bangla">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white border border-govt-border rounded-lg p-8 sm:p-12 text-center shadow-xs font-bangla space-y-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 mx-auto flex items-center justify-center">
          <Layers size={24} aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-gray-800">
          কোনো নিরীক্ষা রেকর্ড পাওয়া যায়নি
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          আপনার সক্রিয় ফিল্টার বা অনুসন্ধানের সাথে মিল সম্পন্ন কোনো অডিট ইভেন্ট খুঁজে পাওয়া যায়নি। ফিল্টার রিসেট করুন বা অন্য শর্তাবলি প্রয়োগ করুন।
        </p>
        <div className="pt-2 flex justify-center">
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            সকল ফিল্টার রিসেট করুন
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-govt-border rounded-lg shadow-xs overflow-hidden font-bangla">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="bg-govt-paper border-b border-govt-border text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
              <th scope="col" className="py-3 px-3 sm:px-4">
                সময়কাল ও টাইমজোন
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                সম্পাদনকারী কর্মকর্তা ও পদবি
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                কার্যক্রম (Action)
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                সম্পৃক্ত সত্তা (Resource)
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                ফলাফল / সিদ্ধান্ত
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                ট্রেস আইডি (Trace ID)
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-right">
                টাইমলাইন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {events.map((ev) => {
              const tzData = formatTimestampWithTimezone(ev.occurredAt)
              const actorInfo = KNOWN_ACTORS[ev.actorUserId] || null
              const actionLabel = AUDIT_ACTIONS_BN[ev.action] || ev.action

              return (
                <tr
                  key={ev.id}
                  className="hover:bg-green-50/40 transition-colors group cursor-pointer"
                  onClick={() => onInspectEvent(ev)}
                >
                  {/* Column 1: Timestamp with Timezone */}
                  <td className="py-3 px-3 sm:px-4 align-top whitespace-nowrap">
                    <div className="font-semibold text-gray-900 font-sans text-xs">
                      {tzData.date}
                    </div>
                    <div className="text-[11px] text-gray-600 font-sans flex items-center gap-1 mt-0.5">
                      <Clock size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
                      <span>{tzData.time}</span>
                      <span className="text-[10px] text-gray-500 font-bold px-1 py-0.2 bg-gray-100 rounded">
                        {tzData.tz}
                      </span>
                    </div>
                  </td>

                  {/* Column 2: Actor & Role */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    {actorInfo ? (
                      <div className="space-y-0.5">
                        <div className="font-bold text-gray-900 text-xs sm:text-sm">
                          {actorInfo.name}
                        </div>
                        <div className="text-[11px] text-govt-green font-semibold">
                          {actorInfo.roleBn}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">
                          ID: {ev.actorUserId ? `${ev.actorUserId.slice(0, 8)}...` : 'System'}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="font-semibold text-gray-900 text-xs">
                          {ev.actorUserId ? 'অননুমোদিত / বহিরাগত কর্মকর্তা' : 'সিস্টেম প্রক্রিয়া (System)'}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          {ev.actorUserId ? `${ev.actorUserId.slice(0, 12)}...` : 'INTERNAL'}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Column 3: Action */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                      {actionLabel}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase mt-0.5">
                      {ev.action}
                    </div>
                  </td>

                  {/* Column 4: Resource Reference */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    <div className="font-semibold text-gray-800 text-xs">
                      {ev.entityType || 'N/A'}
                    </div>
                    <div className="text-[11px] font-mono text-gray-600 truncate max-w-[140px]" title={ev.entityId}>
                      {ev.entityId ? `${ev.entityId.slice(0, 12)}...` : 'কোনো সত্তা নেই'}
                    </div>
                  </td>

                  {/* Column 5: Result / Decision */}
                  <td className="py-3 px-3 sm:px-4 align-top whitespace-nowrap">
                    {deriveResultBadge(ev)}
                  </td>

                  {/* Column 6: Trace ID */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-200 w-fit">
                      <Fingerprint size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
                      <span className="truncate max-w-[100px]" title={ev.correlationId}>
                        {ev.correlationId ? `${ev.correlationId.slice(0, 8)}...` : 'N/A'}
                      </span>
                      {ev.correlationId && (
                        <button
                          type="button"
                          onClick={(e) => handleCopyTrace(ev.correlationId, e)}
                          className="text-gray-400 hover:text-gray-800 focus:outline-none"
                          title="ট্রেস আইডি কপি করুন"
                          aria-label="ট্রেস আইডি কপি করুন"
                        >
                          {copiedTraceId === ev.correlationId ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Column 7: Actions */}
                  <td className="py-3 px-3 sm:px-4 align-top text-right whitespace-nowrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onInspectEvent(ev)
                      }}
                      leftIcon={FileText}
                      className="text-gray-700 hover:text-govt-green"
                    >
                      টাইমলাইন
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 sm:p-4 bg-govt-paper border-t border-govt-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <span>
            সর্বমোট <strong className="font-sans text-gray-900">{toBengaliNumber(totalElements)}</strong> টি ইভেন্টের মধ্যে পৃষ্ঠা{' '}
            <strong className="font-sans text-gray-900">{toBengaliNumber(currentPage)}</strong> (মোট{' '}
            <strong className="font-sans text-gray-900">{toBengaliNumber(totalPages)}</strong> পৃষ্ঠা)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            leftIcon={ChevronLeft}
          >
            পূর্ববর্তী পৃষ্ঠা
          </Button>

          <span className="font-semibold text-gray-700 px-2 font-sans">
            {toBengaliNumber(currentPage)} / {toBengaliNumber(totalPages)}
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            rightIcon={ChevronRight}
          >
            পরবর্তী পৃষ্ঠা
          </Button>
        </div>
      </div>
    </div>
  )
}
