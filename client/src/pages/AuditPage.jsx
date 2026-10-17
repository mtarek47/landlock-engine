import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { auditApi } from '../api/client'
import {
  BarChart3,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Layers,
  FileCheck
} from 'lucide-react'

const ACTION_BN = {
  CREATE_PARCEL: 'পার্সেল নিবন্ধন',
  UPDATE_PARCEL: 'পার্সেল হালনাগাদ',
  CREATE_CASE: 'মামলা নথিভুক্তকরণ',
  CREATE_ORDER: 'আদেশ প্রস্তুতকরণ',
  SUBMIT_ORDER: 'আদেশ দাখিল',
  APPROVE_ORDER: 'আদেশ অনুমোদন',
  REJECT_ORDER: 'আদেশ প্রত্যাখ্যান',
  CREATE_RESTRICTION: 'নিষেধাজ্ঞা আরোপ',
  RELEASE_RESTRICTION: 'নিষেধাজ্ঞা প্রত্যাহার',
  CREATE_MORTGAGE: 'বন্ধক নিবন্ধন',
  RELEASE_MORTGAGE: 'বন্ধক অবমুক্তি',
  REGISTRY_CHECK: 'রেজিস্ট্রি গেটকিপার যাচাই',
}

export default function AuditPage() {
  const [events, setEvents] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAuditEvents = async (pageNumber = 0) => {
    setLoading(true)
    setError('')
    try {
      const res = await auditApi.getEvents({ page: pageNumber, size: 20 })
      const pageData = res.data?.data
      if (pageData?.content) {
        setEvents(pageData.content)
        setTotalPages(pageData.totalPages || 1)
        setTotalElements(pageData.totalElements || 0)
        setPage(pageData.number || 0)
      } else if (Array.isArray(pageData)) {
        setEvents(pageData)
        setTotalPages(1)
        setTotalElements(pageData.length)
        setPage(0)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'অডিট ইভেন্টসমূহ লোড করতে ব্যর্থ হয়েছে।')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAuditEvents(page)
  }, [page])

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-govt-green flex items-center gap-2">
              <BarChart3 size={26} />
              <span>নিরাপত্তা ও লেনদেন নিরীক্ষা লগ (Audit Trail)</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              সিস্টেমে সংরক্ষিত প্রতিটি দাপ্তরিক কার্যক্রম, আদেশ অনুমোদন ও গেটকিপার সিদ্ধান্তের অপরিবর্তনীয় অডিট ট্রেইল
            </p>
          </div>
          <button
            onClick={() => loadAuditEvents(page)}
            className="btn-secondary text-sm flex items-center gap-2 self-start"
            title="অডিট লগ রিফ্রেশ করুন"
          >
            <RefreshCw size={16} />
            <span>লগ রিফ্রেশ</span>
          </button>
        </div>

        {/* Security badge note */}
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded text-sm text-emerald-900 flex items-start gap-3 shadow-xs">
          <ShieldCheck size={20} className="shrink-0 text-emerald-700 mt-0.5" />
          <div className="leading-relaxed">
            <strong>টেম্পার-প্রুফ অডিট ট্রেইল:</strong> সকল অডিট রেকর্ড ক্রিপ্টোগ্রাফিক হ্যাশ চেইন ও কোরিলেশন আইডি দ্বারা সংরক্ষিত। কোনো ব্যবহারকারী বা অ্যাডমিনিস্ট্রেটর এই রেকর্ড অপসারণ বা পরিবর্তন করতে সক্ষম নয়।
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded p-4 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
            <div>{error}</div>
          </div>
        )}

        {/* Audit Log Table */}
        {loading ? (
          <LoadingSpinner text="অডিট লগ রেকর্ড সংগ্রহ করা হচ্ছে..." />
        ) : (
          <div className="card p-0 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-govt-border bg-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-base">
                সর্বশেষ নিরীক্ষা কার্যক্রম ({totalElements} টি সংরক্ষিত ঘটনা)
              </h2>
              <span className="text-xs text-gray-500 font-sans">
                পৃষ্ঠা {page + 1} / {totalPages}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="font-medium text-base mb-1">কোনো অডিট রেকর্ড পাওয়া যায়নি</p>
                <p className="text-xs">সিস্টেমে নতুন কোনো কার্যক্রম সম্পন্ন হলে এখানে স্বয়ংক্রিয়ভাবে লিপিবদ্ধ হবে।</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-gray-700">
                  <thead className="bg-gray-100 text-xs text-gray-600 uppercase border-b border-govt-border font-semibold">
                    <tr>
                      <th className="px-4 py-3">সময়কাল (Timestamp)</th>
                      <th className="px-4 py-3">কার্যক্রম (Action)</th>
                      <th className="px-4 py-3">সত্তার ধরন (Entity)</th>
                      <th className="px-4 py-3">সত্তা রেফারেন্স আইডি</th>
                      <th className="px-4 py-3">সম্পাদনকারী আইডি</th>
                      <th className="px-4 py-3">বিবরণ / কারণ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-govt-border">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-green-50/40 transition-colors">
                        <td className="px-4 py-3 font-sans text-xs whitespace-nowrap text-gray-600">
                          {ev.occurredAt ? new Date(ev.occurredAt).toLocaleString('bn-BD') : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-gray-900 block">
                            {ACTION_BN[ev.action] || ev.action}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500 uppercase">
                            {ev.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {ev.entityType}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {ev.entityId ? `${ev.entityId.substring(0, 14)}...` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {ev.actorUserId ? `${ev.actorUserId.substring(0, 12)}...` : 'সিস্টেম'}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate" title={ev.changeSummary || ev.reason}>
                          {ev.changeSummary || ev.reason || 'সফল লেনদেন'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-govt-border bg-gray-50 flex items-center justify-between">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(p - 1, 0))}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  <span>পূর্ববর্তী</span>
                </button>

                <span className="text-xs text-gray-600">
                  পৃষ্ঠা {page + 1} (মোট {totalPages} এর মধ্যে)
                </span>

                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>পরবর্তী</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
