import { useState } from 'react'
import {
  X,
  Clock,
  User,
  Building,
  Fingerprint,
  FileText,
  ShieldCheck,
  Layers,
  History,
  Check,
  Copy,
  ExternalLink,
  Info,
  Calendar,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEntityAuditHistory } from '../../hooks/useAuditExplorer'
import StatusBadge from '../design-system/StatusBadge'
import Button from '../design-system/Button'
import {
  toBengaliNumber,
  AUDIT_ACTIONS_BN,
  KNOWN_ACTORS,
  KNOWN_INSTITUTIONS,
} from '../design-system/constants'

// Format timestamp with BST (UTC+6)
function formatTz(dt) {
  if (!dt) return 'N/A'
  try {
    const d = new Date(dt)
    return `${d.toISOString().slice(0, 10)} ${d.toTimeString().slice(0, 8)} BST (UTC+6)`
  } catch {
    return dt
  }
}

export default function AuditEventTimelineDrawer({
  event,
  isOpen,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('details') // 'details' or 'timeline'
  const [copiedTrace, setCopiedTrace] = useState(false)

  // Fetch chronological audit history for this specific entity
  const {
    data: entityHistory = [],
    isLoading: historyLoading,
  } = useEntityAuditHistory(event?.entityType, event?.entityId)

  if (!isOpen || !event) return null

  const actorInfo = KNOWN_ACTORS[event.actorUserId] || null
  const instName = KNOWN_INSTITUTIONS[event.institutionId] || event.institutionId || 'কেন্দ্রীয় প্রশাসন'
  const actionLabel = AUDIT_ACTIONS_BN[event.action] || event.action

  const handleCopyTrace = () => {
    if (!event.correlationId) return
    navigator.clipboard.writeText(event.correlationId)
    setCopiedTrace(true)
    setTimeout(() => setCopiedTrace(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden font-bangla"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audit-drawer-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-govt-border flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-govt-green text-white flex items-start justify-between border-b border-govt-green-dark">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/20 text-white uppercase font-sans">
                  অডিট ইভেন্ট ডকেট
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 text-emerald-200">
                  {event.entityType || 'SYSTEM'}
                </span>
              </div>

              <h2
                id="audit-drawer-title"
                className="text-base sm:text-lg font-bold text-white flex items-center gap-2"
              >
                <ShieldCheck size={20} className="text-govt-gold" aria-hidden="true" />
                <span>{actionLabel}</span>
              </h2>

              <p className="text-xs text-green-100 flex items-center gap-1.5 font-sans">
                <Clock size={13} aria-hidden="true" />
                <span>{formatTz(event.occurredAt)}</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold"
              aria-label="ড্রয়ার বন্ধ করুন"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-govt-border bg-govt-paper px-4 sm:px-6 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex items-center gap-1.5 py-3 px-3 sm:px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'details'
                  ? 'border-govt-green text-govt-green font-bold bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText size={14} aria-hidden="true" />
              <span>ইভেন্টের বিস্তারিত তথ্য</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-1.5 py-3 px-3 sm:px-4 border-b-2 font-medium transition-colors ${
                activeTab === 'timeline'
                  ? 'border-govt-green text-govt-green font-bold bg-white'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <History size={14} aria-hidden="true" />
              <span>
                সত্তার টাইমলাইন ইতিহাস ({toBengaliNumber(entityHistory.length || 1)})
              </span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs sm:text-sm text-gray-800">
            {/* TAB 1: DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-4">
                {/* Security read-only notice */}
                <div className="p-3.5 bg-gray-50 border border-govt-border rounded-lg flex items-start gap-2.5 text-xs text-gray-700">
                  <ShieldCheck size={18} className="text-govt-green shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="block text-gray-900 font-semibold mb-0.5">
                      অপরিবর্তনীয় নিরীক্ষা নীতি (Read-Only Audit Trail):
                    </strong>
                    এই রেকর্ডটি ডাটাবেজে অপরিবর্তনীয়ভাবে সংরক্ষিত। কোনো ঐতিহাসিক অডিট এন্ট্রি মুছে ফেলা বা সম্পাদনা করার কোনো অনুমতি বা নিয়ন্ত্রণ সিস্টেমে নেই।
                  </div>
                </div>

                {/* Actor & Authorization box */}
                <div className="border border-govt-border rounded-lg p-4 bg-gray-50/70 space-y-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-1.5">
                    <User size={14} className="text-gray-500" />
                    <span>সম্পাদনকারী কর্মকর্তা ও প্রতিষ্ঠান</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">কর্মকর্তার নাম:</span>
                      <strong className="text-gray-900">
                        {actorInfo ? actorInfo.name : 'সিস্টেম বা অভ্যন্তরীণ সার্ভিস'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">দাপ্তরিক পদবি (Role):</span>
                      <strong className="text-govt-green">
                        {actorInfo ? actorInfo.roleBn : 'INTERNAL / SYSTEM'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">অ্যাক্টর ইউজার আইডি (UUID):</span>
                      <span className="font-mono text-[11px] text-gray-700">
                        {event.actorUserId || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">অনুমোদিত প্রতিষ্ঠান:</span>
                      <span className="text-gray-900 font-medium">
                        {instName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Resource box */}
                <div className="border border-govt-border rounded-lg p-4 bg-gray-50/70 space-y-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2 flex items-center gap-1.5">
                    <Layers size={14} className="text-gray-500" />
                    <span>সম্পৃক্ত রিসোর্স বা সত্তা (Resource Target)</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">সত্তার ধরন (Entity Type):</span>
                      <strong className="text-gray-900">{event.entityType || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">সত্তা রেফারেন্স আইডি (UUID):</span>
                      <span className="font-mono text-[11px] text-gray-700">
                        {event.entityId || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {event.entityType === 'LandParcel' && event.entityId && (
                    <div className="pt-2 border-t border-gray-200 flex justify-end">
                      <Link
                        to={`/parcels/${event.entityId}`}
                        className="text-xs font-bold text-govt-green hover:underline inline-flex items-center gap-1"
                      >
                        <span>পার্সেল বিবরণী পৃষ্ঠা দেখুন</span>
                        <ExternalLink size={12} />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Change Summary & Legal Reason */}
                <div className="border border-govt-border rounded-lg p-4 bg-white space-y-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                    আইনি কারণ ও সিদ্ধান্তের সারসংক্ষেপ (Change Summary & Reason)
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-gray-500 block mb-0.5">কার্যক্রমের কারণ / ভিত্তি:</span>
                      <div className="p-2.5 bg-gray-50 rounded border border-gray-200 text-gray-900 leading-relaxed font-sans">
                        {event.reason || 'স্বাভাবিক দাপ্তরিক কার্যক্রম লিপিবদ্ধকরণ।'}
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-500 block mb-0.5">বিস্তারিত বিবরণ ও ফিল্ড পরিবর্তন:</span>
                      <div className="p-2.5 bg-gray-50 rounded border border-gray-200 font-mono text-[11px] text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {event.changeSummary || 'কোনো অতিরিক্ত পরিবর্তন তথ্য নেই।'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trace ID box */}
                <div className="border border-govt-border rounded-lg p-4 bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Fingerprint size={14} className="text-gray-500" />
                      <span>কোরিলেশন ট্রেস আইডি (Audit Trace ID)</span>
                    </span>
                    {event.correlationId && (
                      <button
                        type="button"
                        onClick={handleCopyTrace}
                        className="inline-flex items-center gap-1 text-xs text-govt-green hover:underline font-semibold"
                      >
                        {copiedTrace ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span>কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy size={13} />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="font-mono text-xs text-gray-900 bg-white p-2 rounded border border-gray-200 break-all select-all">
                    {event.correlationId || 'N/A'}
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    এই ট্রেস আইডি দিয়ে সংশ্লিষ্ট বিতরণকৃত ট্রানজ্যাকশন, মাইক্রোসার্ভিস লগ এবং গেটকিপার সিদ্ধান্ত পারস্পরিকভাবে মেলানো সম্ভব।
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ENTITY TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-950 flex items-start gap-2">
                  <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    সত্তা: <strong>{event.entityType}</strong> (আইডি: <span className="font-mono">{event.entityId?.slice(0, 12)}...</span>) এর সম্পূর্ণ ঐতিহাসিক টাইমলাইন প্রদর্শিত হচ্ছে।
                  </div>
                </div>

                {historyLoading ? (
                  <div className="py-8 text-center text-xs text-gray-500 space-y-2">
                    <div className="w-6 h-6 border-2 border-govt-green border-t-transparent rounded-full animate-spin mx-auto" />
                    <p>টাইমলাইন ডেটা লোড হচ্ছে...</p>
                  </div>
                ) : entityHistory.length === 0 ? (
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center text-xs text-gray-500">
                    এই সত্তার জন্য কোনো পূর্ববর্তী টাইমলাইন ইভেন্ট রেকর্ড পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-govt-green/40 space-y-6 pt-2">
                    {entityHistory.map((item, index) => {
                      const isCurrent = item.id === event.id
                      const itemActor = KNOWN_ACTORS[item.actorUserId]
                      const itemLabel = AUDIT_ACTIONS_BN[item.action] || item.action

                      return (
                        <div key={item.id} className="relative group">
                          {/* Dot indicator */}
                          <div
                            className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs ${
                              isCurrent ? 'bg-govt-green ring-4 ring-green-100' : 'bg-gray-400'
                            }`}
                            aria-hidden="true"
                          />

                          <div
                            className={`p-3.5 rounded-lg border transition-all text-xs ${
                              isCurrent
                                ? 'bg-green-50/80 border-govt-green shadow-xs'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-bold text-gray-900 text-xs sm:text-sm">
                                {itemLabel}
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded bg-govt-green text-white text-[10px] font-bold">
                                  বর্তমান ইভেন্ট
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-gray-500 font-sans flex items-center gap-1.5 mb-2">
                              <Clock size={12} className="text-gray-400" />
                              <span>{formatTz(item.occurredAt)}</span>
                            </div>

                            <div className="text-gray-700 space-y-1">
                              <div className="flex items-center gap-1 text-[11px]">
                                <User size={12} className="text-gray-400" />
                                <span>
                                  {itemActor ? `${itemActor.name} (${itemActor.roleBn})` : 'সিস্টেম'}
                                </span>
                              </div>

                              {item.reason && (
                                <div className="text-gray-600 font-sans bg-gray-50 p-2 rounded border border-gray-100 mt-1">
                                  {item.reason}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-between text-xs text-gray-500">
            <span>বাংলাদেশ ভূমি আইনি-ঝুঁকি যাচাইকরণ পোর্টাল • কেন্দ্রীয় অডিট</span>
            <Button variant="outline" size="sm" onClick={onClose}>
              বন্ধ করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
