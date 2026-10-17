import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { parcelApi } from '../api/client'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Building,
  Calendar,
  Info,
  HelpCircle,
  ExternalLink
} from 'lucide-react'

const DEMO_PARCELS = [
  {
    label: 'ধানমন্ডি দাগ ৫০০১ (নিষেধাজ্ঞা ও বন্ধকযুক্ত)',
    mouza: 'DHANMONDI-01',
    dag: '5001',
    khatian: '101',
    id: 'b1000000-0000-0000-0000-000000000001',
  },
  {
    label: 'গুলশান দাগ ৬০০২ (মামলা প্রক্রিয়াধীন)',
    mouza: 'GULSHAN-02',
    dag: '6002',
    khatian: '202',
    id: 'b2000000-0000-0000-0000-000000000002',
  },
  {
    label: 'মিরপুর দাগ ৭০০৩ (ঝুঁকিমুক্ত ও পরিষ্কার)',
    mouza: 'MIRPUR-03',
    dag: '7003',
    khatian: '303',
    id: 'b3000000-0000-0000-0000-000000000003',
  },
]

export default function CitizenSearchPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null)
  const [activeParcel, setActiveParcel] = useState(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      mouza: '',
      dag: '',
      khatian: '',
    }
  })

  const loadStatusForParcel = async (parcel) => {
    setActiveParcel(parcel)
    setLoading(true)
    setError('')
    try {
      const res = await parcelApi.publicStatus(parcel.id)
      setSelectedStatus(res.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'পাবলিক স্ট্যাটাস প্রাপ্তিতে সমস্যা হয়েছে।')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setError('')
    setSearchResults(null)
    setSelectedStatus(null)
    setActiveParcel(null)
    setLoading(true)

    try {
      const params = {}
      if (data.mouza) params.mouza = data.mouza.trim()
      if (data.dag) params.dag = data.dag.trim()
      if (data.khatian) params.khatian = data.khatian.trim()

      const res = await parcelApi.search(params)
      const parcels = res.data?.data || []
      setSearchResults(parcels)

      if (parcels.length === 0) {
        setError('প্রদত্ত তথ্যের সাথে মেলে এমন কোনো নিবন্ধিত জমি পাওয়া যায়নি। অনুগ্রহ করে মৌজা বা দাগ নম্বর পুনরায় যাচাই করুন।')
      } else if (parcels.length === 1) {
        await loadStatusForParcel(parcels[0])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'অনুসন্ধান কার্যক্রমটি সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoSelect = async (demo) => {
    setValue('mouza', demo.mouza)
    setValue('dag', demo.dag)
    setValue('khatian', demo.khatian)
    await onSubmit({ mouza: demo.mouza, dag: demo.dag, khatian: demo.khatian })
  }

  return (
    <div className="min-h-screen bg-govt-paper font-bangla flex flex-col justify-between">
      <div>
        <div className="h-1.5 bg-govt-gold" />
        <header className="bg-govt-green text-white py-4 px-6 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-govt-green font-bold border-2 border-govt-gold text-sm shadow">
                বা
              </div>
              <div>
                <div className="text-xs text-green-200">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
                <div className="font-bold text-lg">ল্যান্ডলক ইঞ্জিন — নাগরিক সেবা পোর্টাল</div>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="text-white/80 hover:text-white text-xs sm:text-sm flex items-center gap-1 hover:underline"
              >
                <ArrowLeft size={16} />
                <span>মূল পাতা</span>
              </Link>
              <Link
                to="/login"
                className="bg-white text-govt-green font-semibold text-xs sm:text-sm px-3.5 py-1.5 rounded hover:bg-green-50 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Building size={16} />
                <span>অফিসিয়াল লগইন</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto py-8 px-4">
          {/* Headline */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 bg-green-100 text-govt-green px-3 py-1 rounded-full text-xs font-semibold mb-2">
              <Shield size={14} />
              <span>উন্মুক্ত নাগরিক সেবা (লগইন প্রয়োজন নেই)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-govt-green">
              জমির আইনি নিষেধাজ্ঞা ও দায় অনুসন্ধান
            </h1>
            <p className="text-gray-600 text-sm max-w-2xl mx-auto mt-2">
              যেকোনো জমি কেনার আগে বা বায়না করার পূর্বে সংশ্লিষ্ট খতিয়ান ও দাগের বিপরীতে আদালতের নিষেধাজ্ঞা অথবা ব্যাংকের ঋণ দায় আছে কি না জেনে নিন।
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 bg-white border border-govt-border p-4 rounded-lg shadow-sm">
            <div className="text-xs font-semibold text-gray-500 mb-2">
              দ্রুত পরীক্ষার জন্য ডেমো খতিয়ান নির্বাচন করুন:
            </div>
            <div className="flex flex-wrap gap-2">
              {DEMO_PARCELS.map((item) => (
                <button
                  key={item.dag}
                  type="button"
                  onClick={() => handleDemoSelect(item)}
                  className="text-xs px-3 py-1.5 bg-gray-50 hover:bg-green-50 hover:text-govt-green text-gray-700 font-medium rounded border border-govt-border hover:border-govt-green transition-colors"
                >
                  ⚡ {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <div className="card shadow-sm mb-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="mouza" className="label">
                    মৌজা কোড / নাম <span className="text-gray-400 text-xs font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    id="mouza"
                    type="text"
                    className="input-field font-sans"
                    placeholder="যেমন: DHANMONDI-01"
                    {...register('mouza')}
                  />
                  <span className="text-[11px] text-gray-400 mt-0.5 block">উদাহরণ: DHANMONDI-01, GULSHAN-02</span>
                </div>

                <div>
                  <label htmlFor="dag" className="label">
                    দাগ নম্বর (Dag No.) <span className="text-gray-400 text-xs font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    id="dag"
                    type="text"
                    className="input-field font-sans"
                    placeholder="যেমন: 5001"
                    {...register('dag')}
                  />
                  <span className="text-[11px] text-gray-400 mt-0.5 block">উদাহরণ: 5001, 6002, 7003</span>
                </div>

                <div>
                  <label htmlFor="khatian" className="label">
                    খতিয়ান নম্বর (Khatian No.) <span className="text-gray-400 text-xs font-normal">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    id="khatian"
                    type="text"
                    className="input-field font-sans"
                    placeholder="যেমন: 101"
                    {...register('khatian')}
                  />
                  <span className="text-[11px] text-gray-400 mt-0.5 block">উদাহরণ: 101, 202, 303</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full md:w-auto px-8 py-2.5 flex items-center justify-center gap-2 cursor-pointer text-base"
                >
                  <Search size={18} />
                  <span>তথ্য অনুসন্ধান করুন</span>
                </button>
              </div>
            </form>
          </div>

          {/* Loading Indicator */}
          {loading && <LoadingSpinner text="জমির পাবলিক রেকর্ড অনুসন্ধান করা হচ্ছে..." />}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 rounded-lg p-4 mb-6 text-sm flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-600" />
              <div>{error}</div>
            </div>
          )}

          {/* Multiple Search Results if any */}
          {searchResults && searchResults.length > 1 && (
            <div className="card mb-6">
              <h3 className="font-bold text-gray-800 mb-3 text-base">
                একাধিক জমি পাওয়া গেছে ({searchResults.length} টি)। বিস্তারিত স্থিতি দেখতে একটি নির্বাচন করুন:
              </h3>
              <div className="space-y-2">
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => loadStatusForParcel(p)}
                    className={`p-3 rounded border cursor-pointer transition-colors flex items-center justify-between ${
                      activeParcel?.id === p.id
                        ? 'bg-green-50 border-govt-green'
                        : 'bg-gray-50 border-govt-border hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-gray-800">
                        মৌজা: {p.mouzaCode} | দাগ: {p.dagNumber} | খতিয়ান: {p.khatianNumber} ({p.khatianType})
                      </div>
                      <div className="text-xs text-gray-500">
                        উপজেলা: {p.upazilaCode}, জেলা: {p.districtCode} | আয়তন: {p.recordedArea} {p.areaUnit}
                      </div>
                    </div>
                    <span className="text-xs text-govt-green font-semibold">স্থিতি দেখুন →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Status Display */}
          {selectedStatus && (
            <div className="space-y-6">
              {/* Primary Big Indicator Card */}
              <div
                className={`card border-2 p-6 rounded-xl transition-all shadow-sm ${
                  selectedStatus.hasActiveRestriction
                    ? 'border-red-400 bg-red-50/70'
                    : selectedStatus.hasActiveMortgage
                    ? 'border-amber-400 bg-amber-50/70'
                    : 'border-green-400 bg-green-50/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {selectedStatus.hasActiveRestriction ? (
                      <div className="w-12 h-12 rounded-full bg-red-100 border border-red-300 flex items-center justify-center text-red-700 shrink-0">
                        <XCircle size={30} />
                      </div>
                    ) : selectedStatus.hasActiveMortgage ? (
                      <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                        <AlertTriangle size={30} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 border border-green-300 flex items-center justify-center text-green-700 shrink-0">
                        <CheckCircle2 size={30} />
                      </div>
                    )}

                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                        {selectedStatus.hasActiveRestriction
                          ? 'সক্রিয় আদালতের নিষেধাজ্ঞা রয়েছে (লেনদেন ঝুঁকিপূর্ণ)'
                          : selectedStatus.hasActiveMortgage
                          ? 'ব্যাংকের বন্ধক / লিয়েন রয়েছে (অনাপত্তি আবশ্যক)'
                          : 'কোনো সক্রিয় আইনি নিষেধাজ্ঞা পাওয়া যায়নি'}
                      </h2>
                      <p className="text-xs text-gray-600 mt-1 flex items-center gap-2">
                        <Calendar size={14} />
                        <span>সর্বশেষ যাচাইয়ের সময়: {new Date(selectedStatus.lastChecked).toLocaleString('bn-BD')}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badges Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                  <div className={`p-4 rounded-lg border ${
                    selectedStatus.hasActiveRestriction
                      ? 'bg-red-100/70 border-red-300 text-red-900'
                      : 'bg-white border-govt-border text-gray-800'
                  }`}>
                    <div className="font-bold text-sm mb-1 flex items-center justify-between">
                      <span>আদালতি নিষেধাজ্ঞা স্থিতি:</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        selectedStatus.hasActiveRestriction ? 'bg-red-200 text-red-900' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedStatus.hasActiveRestriction ? 'নিষেধাজ্ঞা কার্যকর' : 'নিষেধাজ্ঞামুক্ত'}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {selectedStatus.hasActiveRestriction
                        ? 'বিজ্ঞ আদালতের আদেশ অনুযায়ী এই জমির হস্তান্তর, বিক্রয় বা নামজারি স্থগিত রয়েছে।'
                        : 'বর্তমানে কোনো সক্রিয় আদালতের নিষেধাজ্ঞার রেকর্ড নথিভুক্ত নেই।'}
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg border ${
                    selectedStatus.hasActiveMortgage
                      ? 'bg-amber-100/70 border-amber-300 text-amber-900'
                      : 'bg-white border-govt-border text-gray-800'
                  }`}>
                    <div className="font-bold text-sm mb-1 flex items-center justify-between">
                      <span>ব্যাংক বন্ধক / লিয়েন স্থিতি:</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                        selectedStatus.hasActiveMortgage ? 'bg-amber-200 text-amber-900' : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedStatus.hasActiveMortgage ? 'বন্ধক বিদ্যমান' : 'দায়মুক্ত'}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {selectedStatus.hasActiveMortgage
                        ? 'সংশ্লিষ্ট তফসিলি ব্যাংক থেকে ঋণ গ্রহণের বিপরীতে সম্পত্তিটি বন্ধক রয়েছে। বিক্রয়ের পূর্বে ব্যাংক থেকে দায়মুক্তি আবশ্যক।'
                        : 'কোনো আর্থিক প্রতিষ্ঠানের সক্রিয় বন্ধকী দাবি নথিভুক্ত নেই।'}
                    </p>
                  </div>
                </div>

                {/* Parcel Metadata if available */}
                {activeParcel && (
                  <div className="mt-5 p-4 bg-white rounded-lg border border-govt-border">
                    <h3 className="font-bold text-sm text-gray-800 mb-2">জমির তফসিল ও রেকর্ড বিবরণী:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700">
                      <div><span className="text-gray-500 block">মৌজা কোড:</span> <span className="font-semibold">{activeParcel.mouzaCode}</span></div>
                      <div><span className="text-gray-500 block">দাগ নম্বর:</span> <span className="font-semibold">{activeParcel.dagNumber}</span></div>
                      <div><span className="text-gray-500 block">খতিয়ান নম্বর:</span> <span className="font-semibold">{activeParcel.khatianNumber} ({activeParcel.khatianType})</span></div>
                      <div><span className="text-gray-500 block">রেকর্ডকৃত আয়তন:</span> <span className="font-semibold">{activeParcel.recordedArea} {activeParcel.areaUnit}</span></div>
                    </div>
                  </div>
                )}

                {/* Legal Disclaimer Box */}
                <div className="mt-5 p-3.5 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-900 leading-relaxed flex items-start gap-2">
                  <Info size={16} className="text-yellow-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>সংবিধিবদ্ধ আইনি অস্বীকৃতি (Legal Disclaimer):</strong> {selectedStatus.disclaimer}
                  </div>
                </div>

                {/* Call to Action for login */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 bg-white/70 p-3 rounded border border-gray-200">
                  <span>আপনি কি সাব-রেজিস্ট্রি অফিসার বা আইনজীবী? পূর্ণাঙ্গ নথি ও কেস হিস্ট্রি দেখার জন্য লগইন করুন।</span>
                  <Link
                    to="/login"
                    className="text-govt-green font-bold hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>প্রাতিষ্ঠানিক পোর্টাল</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-white border-t border-govt-border py-4 text-center text-xs text-gray-500">
        ল্যান্ডলক ইঞ্জিন — গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রতীকী আদলে প্রস্তুতকৃত হ্যাকাথন প্রোটোটাইপ
      </footer>
    </div>
  )
}
