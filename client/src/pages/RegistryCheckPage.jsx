import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { registryApi } from '../api/client'
import {
  ClipboardCheck,
  ShieldAlert,
  CheckCircle,
  AlertOctagon,
  Clock,
  RotateCcw,
  FileText,
  Building,
  Info,
  Hash,
  ArrowRight
} from 'lucide-react'

const TRANSACTION_TYPES = [
  { value: 'SALE', label: 'বিক্রয় (Sale Deed)' },
  { value: 'GIFT', label: 'দান (Gift Deed / হেবা)' },
  { value: 'MORTGAGE', label: 'বন্ধক (Mortgage / Lien)' },
  { value: 'LEASE', label: 'ইজারা (Lease Agreement)' },
  { value: 'HEIRSHIP_TRANSFER', label: 'ওয়ারিশান হস্তান্তর (Heirship Transfer)' },
  { value: 'OTHER', label: 'অন্যান্য দলিল (Other Transfer)' },
]

const REASON_CODES_BN = {
  ACTIVE_COURT_INJUNCTION_OR_BLOCK: 'সক্রিয় আদালতি নিষেধাজ্ঞা বা স্থগিতাদেশ বলবৎ রয়েছে',
  TRANSFER_PROHIBITED: 'উক্ত লেনদেনের জন্য আইনগত হস্তান্তর সম্পূর্ণ নিষিদ্ধ',
  ACTIVE_MORTGAGE_NO_RELEASE: 'আর্থিক প্রতিষ্ঠানের সক্রিয় বন্ধক বিদ্যমান এবং কোনো অনাপত্তি (NOC) বা দায়মুক্তি দাখিল করা হয়নি',
  PARCEL_NOT_FOUND: 'প্রদত্ত আইডি বা বিবরণীর কোনো পার্সেল রেজিস্ট্রিতে খুঁজে পাওয়া যায়নি',
  INVALID_TRANSACTION_TYPE: 'অকার্যকর বা অননুমোদিত লেনদেনের ধরন',
}

const DEMO_PRESETS = [
  {
    label: 'পার্সেল ১: ধানমন্ডি (আদালতের নিষেধাজ্ঞায় অবরুদ্ধ SALE)',
    parcelId: 'b1000000-0000-0000-0000-000000000001',
    transactionType: 'SALE',
  },
  {
    label: 'পার্সেল ১: ধানমন্ডি (বন্ধক যাচাই MORTGAGE)',
    parcelId: 'b1000000-0000-0000-0000-000000000001',
    transactionType: 'MORTGAGE',
  },
  {
    label: 'পার্সেল ৩: মিরপুর (পরিষ্কার ও ঝুঁকিমুক্ত CLEAR)',
    parcelId: 'b3000000-0000-0000-0000-000000000003',
    transactionType: 'SALE',
  },
]

export default function RegistryCheckPage() {
  const [searchParams] = useSearchParams()
  const initialParcelId = searchParams.get('parcelId') || ''

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [decisionResult, setDecisionResult] = useState(null)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      parcelId: initialParcelId,
      transactionType: 'SALE',
      requestId: crypto.randomUUID(),
    }
  })

  // Set initial parcel ID if in query params
  useEffect(() => {
    if (initialParcelId) {
      setValue('parcelId', initialParcelId)
    }
  }, [initialParcelId, setValue])

  const regenerateRequestId = () => {
    setValue('requestId', crypto.randomUUID())
  }

  const applyPreset = (preset) => {
    setValue('parcelId', preset.parcelId)
    setValue('transactionType', preset.transactionType)
    regenerateRequestId()
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')
    setDecisionResult(null)

    try {
      const payload = {
        requestId: data.requestId || crypto.randomUUID(),
        parcelId: data.parcelId.trim(),
        transactionType: data.transactionType,
      }

      const res = await registryApi.check(payload)
      setDecisionResult(res.data?.data)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'রেজিস্ট্রি গেটকিপার সিদ্ধান্ত গণনায় ত্রুটি দেখা দিয়েছে।'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-govt-green flex items-center gap-2">
            <ClipboardCheck size={26} />
            <span>সাব-রেজিস্ট্রি ও ব্যাংক গেটকিপার যাচাই (Transaction Gatekeeper)</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            দলিল নিবন্ধন সম্পন্ন করার পূর্বে বা ব্যাংক ঋণ অনুমোদনের পূর্বে ল্যান্ডলক ইঞ্জিনের মাধ্যমে জমির ওপর বৈধ স্থগিতাদেশ ও বন্ধক স্বয়ংক্রিয়ভাবে যাচাই করুন
          </p>
        </div>

        {/* Presets Bar */}
        <div className="bg-white border border-govt-border rounded-lg p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="text-xs font-bold text-govt-green flex items-center gap-1.5 uppercase tracking-wider">
              <Info size={15} />
              <span>রেজিস্ট্রি গেটকিপার সিমুলেশন ও ডেমো ডক্যুমেন্টেশন (Demo Documentation)</span>
            </div>
            <span className="text-[11px] text-gray-500">পরীক্ষার জন্য দ্রুত প্রিসেট নির্বাচন করুন:</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {DEMO_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(p)}
                className="text-xs px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-govt-green font-semibold rounded-md border border-emerald-300 hover:border-govt-green transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>🔍 {p.label}</span>
              </button>
            ))}
          </div>

          {/* Decision Engine Documentation Accordion / Matrix */}
          <div className="bg-gray-50 border border-gray-200 rounded p-4 text-xs text-gray-700 space-y-3">
            <div className="font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center justify-between">
              <span>🧠 গেটকিপার সিদ্ধান্ত অ্যালগরিদম (Decision Logic Hierarchy):</span>
              <span className="text-[11px] text-govt-green font-semibold">৫টি সিদ্ধান্ত স্তর</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="bg-white p-2.5 rounded border-l-4 border-l-red-600 border border-gray-200">
                <div className="font-bold text-red-700 text-xs">BLOCKED_BY_VALID_ORDER</div>
                <div className="text-[11px] text-gray-600 mt-1">
                  আদালতের কোনো অনুমোদিত বৈধ আদেশ যদি প্রস্তাবিত লেনদেন নিষিদ্ধ করে (যেমন: ধানমন্ডি পার্সেল ১ এ বিক্রয়)।
                </div>
              </div>
              <div className="bg-white p-2.5 rounded border-l-4 border-l-amber-500 border border-gray-200">
                <div className="font-bold text-amber-700 text-xs">MORTGAGE_REQUIRES_RELEASE</div>
                <div className="text-[11px] text-gray-600 mt-1">
                  জমিতে বাণিজ্যিক ব্যাংকের সক্রিয় বন্ধক বলবৎ থাকলে এবং অনুমোদিত অনাপত্তি (NOC) বা দায়মুক্তি না থাকলে।
                </div>
              </div>
              <div className="bg-white p-2.5 rounded border-l-4 border-l-yellow-500 border border-gray-200">
                <div className="font-bold text-yellow-700 text-xs">REVIEW_REQUIRED</div>
                <div className="text-[11px] text-gray-600 mt-1">
                  পার্সেল শনাক্তকরণে গরমিল, অসঙ্গতি বা তথ্যের অস্পষ্টতা থাকলে কোনো বিভ্রান্তিকর ছাড়পত্র না দিয়ে রিভিউ পাঠানো হয়।
                </div>
              </div>
              <div className="bg-white p-2.5 rounded border-l-4 border-l-emerald-600 border border-gray-200">
                <div className="font-bold text-emerald-700 text-xs">CLEAR</div>
                <div className="text-[11px] text-gray-600 mt-1">
                  কোনো নিষেধাজ্ঞা বা অপরিশোধিত বন্ধক না থাকলে লেনদেন নিরাপদ ঘোষণা করা হয় (যেমন: মিরপুর পার্সেল ৩)।
                </div>
              </div>
            </div>
            <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-1">
              <span>🔑 <strong>আইডেমপোটেন্সি কি (Idempotency Key):</strong> <code className="font-mono bg-white px-1 py-0.5 rounded border">requestId</code> নিশ্চিত করে যে একই অনুরোধের জন্য একাধিকবার অডিট ও লেনদেন রিকোয়েস্ট তৈরি হবে না।</span>
              <span className="text-govt-green font-medium">নিরাপত্তা: সাব-রেজিস্ট্রার কর্তৃক অনুমোদিত এপিআই কল</span>
            </div>
          </div>
        </div>

        {/* Check Request Form */}
        <div className="card shadow-sm border-t-4 border-t-govt-green">
          <h2 className="font-bold text-base text-gray-800 mb-4 pb-2 border-b border-govt-border">
            নতুন লেনদেন যাচাইকরণ অনুরোধ
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parcelId" className="label">
                  পার্সেল আইডি (Parcel UUID) <span className="text-red-500">*</span>
                </label>
                <input
                  id="parcelId"
                  type="text"
                  placeholder="যেমন: b1000000-0000-0000-0000-000000000001"
                  className={`input-field font-mono text-xs ${errors.parcelId ? 'border-red-400' : ''}`}
                  {...register('parcelId', {
                    required: 'পার্সেল আইডি প্রদান আবশ্যক',
                    pattern: {
                      value: /^[0-9a-fA-F-]{36}$/,
                      message: 'একটি সঠিক UUID ফরম্যাট প্রদান করুন',
                    }
                  })}
                />
                {errors.parcelId && (
                  <p className="text-red-600 text-xs mt-1">{errors.parcelId.message}</p>
                )}
                <span className="text-[11px] text-gray-400 mt-1 block">
                  সিস্টেমের ডেমো পার্সেল আইডি: <code>b1000000-0000-0000-0000-000000000001</code>
                </span>
              </div>

              <div>
                <label htmlFor="transactionType" className="label">
                  লেনদেনের ধরন (Transaction Type) <span className="text-red-500">*</span>
                </label>
                <select
                  id="transactionType"
                  className="input-field font-medium text-gray-800"
                  {...register('transactionType', { required: 'লেনদেনের ধরন নির্বাচন করুন' })}
                >
                  {TRANSACTION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-gray-400 mt-1 block">
                  আদালতের আদেশ কোন ধরনের দলিলের ওপর প্রযোজ্য তা পরীক্ষা করা হবে
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="requestId" className="label">
                  রিকোয়েস্ট আইডি / আইডেমপোটেন্সি কি (Request UUID)
                </label>
                <button
                  type="button"
                  onClick={regenerateRequestId}
                  className="text-xs text-govt-green hover:underline flex items-center gap-1 font-semibold"
                >
                  <RotateCcw size={12} />
                  নতুন কি তৈরি করুন
                </button>
              </div>
              <input
                id="requestId"
                type="text"
                readOnly
                className="input-field font-mono text-xs bg-gray-50 text-gray-600"
                {...register('requestId', { required: true })}
              />
              <span className="text-[11px] text-gray-400 mt-0.5 block">
                পুনরাবৃত্তিমূলক লেনদেন ট্র্যাকিং ও অডিট সুরক্ষার জন্য স্বয়ংক্রিয়ভাবে জেনারেট হয়
              </span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-2.5 text-base flex items-center gap-2 cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>যাচাইকরণ প্রসেসিং হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <ClipboardCheck size={18} />
                    <span>সিদ্ধান্ত যাচাই করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded p-4 text-sm flex items-start gap-3">
            <AlertOctagon size={20} className="shrink-0 text-red-600 mt-0.5" />
            <div>
              <strong>যাচাইকরণ ব্যর্থ:</strong> {error}
            </div>
          </div>
        )}

        {/* Decision Result Display */}
        {decisionResult && (
          <div className="space-y-4">
            <div
              className={`card border-2 p-6 rounded-xl shadow-md ${
                decisionResult.decision === 'BLOCKED_BY_VALID_ORDER'
                  ? 'border-red-500 bg-red-50/80'
                  : decisionResult.decision === 'CLEAR'
                  ? 'border-green-500 bg-green-50/80'
                  : decisionResult.decision === 'MORTGAGE_REQUIRES_RELEASE'
                  ? 'border-orange-500 bg-orange-50/80'
                  : 'border-yellow-500 bg-yellow-50/80'
              }`}
            >
              {/* Header result */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-300">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-gray-600 block mb-1">
                    গেটকিপার সিদ্ধান্ত ফলাফল
                  </span>
                  <div className="flex items-center gap-3">
                    <StatusBadge decision={decisionResult.decision} className="text-base px-4 py-1.5" />
                    <span className="text-xs font-mono text-gray-500">
                      ({decisionResult.decision})
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs text-gray-600">
                  <div className="font-mono">যাচাই আইডি: {decisionResult.checkId}</div>
                  <div className="mt-0.5">
                    যাচাই সম্পন্ন: {new Date(decisionResult.checkedAt).toLocaleString('bn-BD')}
                  </div>
                </div>
              </div>

              {/* Summary text */}
              <div className="mt-4 p-3 bg-white/90 rounded border border-gray-200 text-sm font-semibold text-gray-800">
                {decisionResult.summary || 'কোনো সারাংশ প্রদান করা হয়নি।'}
              </div>

              {/* Reason Codes */}
              {decisionResult.reasonCodes && decisionResult.reasonCodes.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
                    কারণ নির্দেশক কোডসমূহ (Reason Codes):
                  </h4>
                  <ul className="space-y-1.5">
                    {decisionResult.reasonCodes.map((code, idx) => (
                      <li
                        key={idx}
                        className="text-xs flex items-start gap-2 bg-white/80 p-2.5 rounded border border-red-200 text-red-900"
                      >
                        <AlertOctagon size={14} className="shrink-0 text-red-600 mt-0.5" />
                        <div>
                          <strong>{REASON_CODES_BN[code] || code}</strong>
                          <span className="font-mono text-gray-500 block text-[11px] mt-0.5">
                            কোড: {code}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Statistics & References */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                  <div className="font-bold text-sm text-gray-800 mb-2 flex items-center justify-between">
                    <span>সক্রিয় আইনি বিধিনিষেধ:</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      decisionResult.activeRestrictionCount > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {decisionResult.activeRestrictionCount} টি পাওয়া গেছে
                    </span>
                  </div>
                  {decisionResult.restrictionReferences && decisionResult.restrictionReferences.length > 0 ? (
                    <ul className="text-xs font-mono text-gray-700 space-y-1">
                      {decisionResult.restrictionReferences.map((ref, idx) => (
                        <li key={idx} className="bg-gray-50 p-1.5 rounded border border-gray-200">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">কোনো নিষেধাজ্ঞা রেফারেন্স নেই</p>
                  )}
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
                  <div className="font-bold text-sm text-gray-800 mb-2 flex items-center justify-between">
                    <span>সক্রিয় ব্যাংক বন্ধক:</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      decisionResult.activeMortgageCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {decisionResult.activeMortgageCount} টি পাওয়া গেছে
                    </span>
                  </div>
                  {decisionResult.mortgageReferences && decisionResult.mortgageReferences.length > 0 ? (
                    <ul className="text-xs font-mono text-gray-700 space-y-1">
                      {decisionResult.mortgageReferences.map((ref, idx) => (
                        <li key={idx} className="bg-gray-50 p-1.5 rounded border border-gray-200">
                          {ref}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">কোনো বন্ধক রেফারেন্স নেই</p>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-5 p-3.5 bg-yellow-50/90 border border-yellow-300 rounded text-xs text-yellow-900 leading-relaxed flex items-start gap-2">
                <Info size={16} className="text-yellow-700 shrink-0 mt-0.5" />
                <div>
                  <strong>আইনি অস্বীকৃতি:</strong> {decisionResult.disclaimer}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
