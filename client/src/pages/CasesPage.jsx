import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { caseApi, orderApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import {
  FileText,
  Gavel,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Send,
  Check,
  X,
  PlusCircle,
  Building,
  Calendar,
  Lock,
  Layers
} from 'lucide-react'

const SEEDED_CASES = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    caseNumber: 'OS-2024-00123',
    caseType: 'CIVIL_SUIT',
    title: 'দেওয়ানি মোকদ্দমা (Title & Permanent Injunction Suit)',
    summary: 'ধানমন্ডি মৌজার জমি সংক্রান্ত স্বত্ব ঘোষণা ও চিরস্থায়ী নিষেধাজ্ঞার মামলা।',
    orderId: 'e1000000-0000-0000-0000-000000000001',
    parcelId: 'b1000000-0000-0000-0000-000000000001',
    filingDate: '2024-01-15',
  },
  {
    id: 'c2000000-0000-0000-0000-000000000002',
    caseNumber: 'MS-2024-00456',
    caseType: 'LAND_DISPUTE',
    title: 'জমি বিরোধ মোকদ্দমা (Boundary & Partition Dispute)',
    summary: 'গুলশান মৌজার সীমানা নির্ধারণ ও বণ্টন বিরোধ সংক্রান্ত দেওয়ানি মামলা।',
    orderId: 'e2000000-0000-0000-0000-000000000002',
    parcelId: 'b2000000-0000-0000-0000-000000000002',
    filingDate: '2024-02-10',
  },
]

export default function CasesPage() {
  const { user, hasRole } = useAuth()
  const [selectedCaseId, setSelectedCaseId] = useState(SEEDED_CASES[0].id)
  const [caseData, setCaseData] = useState(null)
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const loadCaseDetails = async (caseId) => {
    setLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await caseApi.getById(caseId)
      const data = res.data?.data
      setCaseData(data)

      const seeded = SEEDED_CASES.find((c) => c.id === caseId)
      if (seeded?.orderId) {
        try {
          const orderRes = await orderApi.getById(seeded.orderId)
          setOrderData(orderRes.data?.data)
        } catch {
          setOrderData(null)
        }
      } else {
        setOrderData(null)
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'মামলার বিবরণ লোড করতে সমস্যা হয়েছে।',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCaseDetails(selectedCaseId)
  }, [selectedCaseId])

  const handleSubmitOrder = async (orderId) => {
    setActionLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await orderApi.submit(orderId)
      setMessage({ text: 'আদেশটি সফলভাবে অনুমোদনের জন্য দাখিল করা হয়েছে (SUBMITTED)।', type: 'success' })
      loadCaseDetails(selectedCaseId)
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'আদেশ দাখিল করতে ব্যর্থ হয়েছে।',
        type: 'error',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleApproveOrder = async (orderId) => {
    setActionLoading(true)
    setMessage({ text: '', type: '' })
    try {
      const res = await orderApi.approve(orderId, 'বিজ্ঞ বিচারক কর্তৃক যথাযথ পর্যালোচনা সাপেক্ষে আদেশ অনুমোদিত')
      setMessage({ text: 'আদেশটি সফলভাবে অনুমোদিত হয়েছে এবং পার্সেলে নিষেধাজ্ঞা কার্যকর হয়েছে!', type: 'success' })
      loadCaseDetails(selectedCaseId)
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'আদেশ অনুমোদন ব্যর্থ হয়েছে। (লক্ষ্য করুন: আদেশ প্রস্তুতকারী নিজে অনুমোদন করতে পারবেন না)',
        type: 'error',
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-govt-green flex items-center gap-2">
              <Gavel size={26} />
              <span>আদালতের মামলা ও নিষেধাজ্ঞার আদেশ (Court Orders)</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              দেওয়ানি আদালতের স্থগিতাদেশ, নিষেধাজ্ঞা এবং জমি সংক্রান্ত বিচারিক কার্যক্রম ব্যবস্থাপনা
            </p>
          </div>
        </div>

        {/* Feedback message */}
        {message.text && (
          <div
            className={`p-4 rounded-lg text-sm border flex items-start gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-300 text-green-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            {message.type === 'success' ? <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-600" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5 text-red-600" />}
            <div>{message.text}</div>
          </div>
        )}

        {/* Case selector cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEEDED_CASES.map((sc) => {
            const isSelected = selectedCaseId === sc.id
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedCaseId(sc.id)}
                className={`card p-4 cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'border-govt-green bg-green-50/50 shadow-md ring-2 ring-govt-green/30'
                    : 'border-govt-border hover:border-govt-green hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-govt-green bg-white px-2.5 py-1 rounded border border-govt-border">
                    {sc.caseNumber}
                  </span>
                  <span className="text-xs text-gray-500 font-sans">
                    দাখিল: {sc.filingDate}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 text-sm">{sc.title}</h2>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{sc.summary}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-govt-green font-semibold">
                  <span>পার্সেল আইডি: {sc.parcelId.substring(0, 16)}...</span>
                  <span className="flex items-center gap-1">
                    <span>বিশ্লেষণ দেখুন</span>
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Detailed Case View */}
        {loading ? (
          <LoadingSpinner text="মামলা ও আদেশের বিস্তারিত তথ্য লোড হচ্ছে..." />
        ) : caseData ? (
          <div className="space-y-6">
            {/* Case Details Card */}
            <div className="card shadow-sm border-t-4 border-t-govt-green">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-govt-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-300">
                      মোকদ্দমা নং: {caseData.caseNumber}
                    </span>
                    <StatusBadge decision={caseData.caseStatus} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-2">
                    মামলার ধরন: {caseData.caseType}
                  </h2>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  <div>দাখিলের তারিখ: {caseData.filingDate}</div>
                  <div className="font-mono mt-0.5">কেস আইডি: {caseData.id}</div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xs font-bold text-gray-600 uppercase mb-1">মামলার মূল বিষয়বস্তু ও সংক্ষেপ:</h3>
                <p className="text-sm text-gray-800 bg-gray-50 p-3.5 rounded border border-govt-border leading-relaxed">
                  {caseData.restrictedSummary || 'কোনো বিবরণ প্রদান করা হয়নি।'}
                </p>
              </div>

              {/* Linked Parcels */}
              <div className="mt-5">
                <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                  <Layers size={16} />
                  <span>মামলা সংশ্লিষ্ট ভূমি পার্সেলসমূহ:</span>
                </h3>
                {caseData.parcels && caseData.parcels.length > 0 ? (
                  <div className="space-y-2">
                    {caseData.parcels.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-white border border-govt-border rounded-lg flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-gray-900">
                            পার্সেল আইডি: <span className="font-mono">{p.parcelId}</span>
                          </div>
                          <div className="text-gray-500 mt-0.5">
                            আওতা: {p.scopeType} | আয়তন: {p.scopeArea} শতাংশ (শেয়ার: {p.scopeShare})
                          </div>
                        </div>
                        <a
                          href={`/parcels/${p.parcelId}`}
                          className="text-govt-green font-semibold hover:underline flex items-center gap-1"
                        >
                          <span>পার্সেল বিবরণ</span>
                          <ArrowRight size={12} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">কোনো পার্সেল যুক্ত করা হয়নি।</p>
                )}
              </div>
            </div>

            {/* Attached Court Order Card */}
            {orderData && (
              <div className="card shadow-sm border-t-4 border-t-govt-gold">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-govt-border">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                      বিচারিক আদেশপত্র (Judicial Order)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-gray-900">
                        {orderData.orderReference}
                      </span>
                      <StatusBadge decision={orderData.approvalStatus} />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>আদেশের তারিখ: {orderData.orderDate}</div>
                    <div>মেয়াদ: {orderData.effectiveFrom} হতে {orderData.effectiveUntil || 'অনির্দিষ্টকাল'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <span className="text-gray-500 block">আদেশের ধরন:</span>
                    <span className="font-bold text-gray-800">{orderData.orderType}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <span className="text-gray-500 block">স্থগিত লেনদেন স্কোপ:</span>
                    <span className="font-bold text-red-700">{orderData.transactionScope}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <span className="text-gray-500 block">যাচাইকরণ স্থিতি:</span>
                    <span className="font-semibold text-gray-800">{orderData.verificationStatus}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded border border-gray-200">
                    <span className="text-gray-500 block">সংযুক্তি দলিল:</span>
                    <span className="font-mono text-gray-800">{orderData.sourceDocumentReference}</span>
                  </div>
                </div>

                {/* Workflow Actions based on Role */}
                <div className="mt-6 pt-4 border-t border-govt-border flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-gray-600">
                    {orderData.approvalStatus === 'APPROVED' && (
                      <span className="text-green-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 size={16} /> এই আদেশ অনুমোদিত এবং রেজিস্ট্রিতে স্বয়ংক্রিয় নিষেধাজ্ঞা আরোপিত রয়েছে।
                      </span>
                    )}
                    {orderData.approvalStatus === 'DRAFT' && (
                      <span className="text-yellow-700 font-semibold flex items-center gap-1">
                        <Clock size={16} /> এটি একটি খসড়া আদেশ। অনুমোদনের পূর্বে রেজিস্ট্রিতে কার্যকর হবে না।
                      </span>
                    )}
                    {orderData.approvalStatus === 'SUBMITTED' && (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <Clock size={16} /> আদেশটি বিচারক/অনুমোদনকারীর স্বাক্ষরের জন্য অপেক্ষমাণ।
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Submit Order action: For COURT_OFFICER or ADMIN on DRAFT */}
                    {orderData.approvalStatus === 'DRAFT' && hasRole(['COURT_OFFICER', 'SYSTEM_ADMIN']) && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleSubmitOrder(orderData.id)}
                        className="btn-primary text-xs flex items-center gap-1.5"
                      >
                        <Send size={14} />
                        <span>অনুমোদনের জন্য দাখিল করুন</span>
                      </button>
                    )}

                    {/* Approve Order action: For ORDER_APPROVER or ADMIN on SUBMITTED or DRAFT */}
                    {(orderData.approvalStatus === 'SUBMITTED' || orderData.approvalStatus === 'DRAFT') &&
                      hasRole(['ORDER_APPROVER', 'SYSTEM_ADMIN']) && (
                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={() => handleApproveOrder(orderData.id)}
                          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Check size={14} />
                          <span>আদেশ অনুমোদন করুন (Approve Order)</span>
                        </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Layout>
  )
}
