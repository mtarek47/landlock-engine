import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { parcelApi } from '../api/client'
import { Search, MapPin, ArrowRight, Filter, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react'

export default function ParcelSearchPage() {
  const [parcels, setParcels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      mouza: '',
      dag: '',
      khatian: '',
    }
  })

  const loadParcels = async (params = {}) => {
    setLoading(true)
    setError('')
    try {
      const res = await parcelApi.search(params)
      setParcels(res.data?.data || [])
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.message || 'পার্সেল তথ্য লোড করতে ব্যর্থ হয়েছে।')
    } finally {
      setLoading(false)
    }
  }

  // Load initial parcels on mount so users see seeded data
  useEffect(() => {
    loadParcels({})
  }, [])

  const onSubmit = (data) => {
    const params = {}
    if (data.mouza) params.mouza = data.mouza.trim()
    if (data.dag) params.dag = data.dag.trim()
    if (data.khatian) params.khatian = data.khatian.trim()
    loadParcels(params)
  }

  const handleReset = () => {
    reset()
    loadParcels({})
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-govt-green flex items-center gap-2">
              <MapPin size={24} />
              <span>ভূমি পার্সেল ও খতিয়ান অনুসন্ধান</span>
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              সংশ্লিষ্ট মৌজা, খতিয়ান ও দাগ নম্বর দিয়ে নিবন্ধিত পার্সেলের আইনি অবস্থা ও তফসিল বিবরণী অনুসন্ধান করুন
            </p>
          </div>
          <button
            onClick={() => loadParcels({})}
            className="btn-secondary text-sm flex items-center gap-2 self-start"
            title="সব পার্সেল পুনরায় লোড করুন"
          >
            <RefreshCw size={16} />
            <span>সকল পার্সেল দেখুন</span>
          </button>
        </div>

        {/* Demo Documentation & Seeded Parcels Overview */}
        <div className="bg-white border border-govt-border rounded-lg p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-2.5">
            <div className="text-xs font-bold text-govt-green flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin size={15} />
              <span>ডেমো পার্সেল ডেটাবেজ ও ফিল্টার নির্দেশিকা (Demo Documentation)</span>
            </div>
            <span className="text-[11px] text-gray-500">৩টি সমন্বিত পাইলট পার্সেল সংরক্ষিত</span>
          </div>

          <div className="text-xs text-gray-700 leading-relaxed">
            ল্যান্ডলক ইঞ্জিন একক দাগ নম্বরের পরিবর্তে সমন্বিত কম্পোজিট আইডেন্টিফায়ার (বিভাগ, জেলা, উপজেলা, মৌজা, খতিয়ান টাইপ ও দাগ) ব্যবহার করে যাতে কোনো স্বত্বের অস্পষ্টতা না থাকে।
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <button
              type="button"
              onClick={() => { reset({ mouza: 'DHANMONDI-01', dag: '5001', khatian: '101' }); loadParcels({ mouza: 'DHANMONDI-01', dag: '5001', khatian: '101' }); }}
              className="p-3 bg-red-50/70 hover:bg-red-100/70 rounded border border-red-200 text-left transition-all cursor-pointer"
            >
              <div className="font-bold text-red-800 text-xs flex items-center justify-between">
                <span>ধানমন্ডি (দাগ ৫০০১)</span>
                <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.5 rounded">অবরুদ্ধ</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-1">খতিয়ান: ১০১ (RS) | ১০.৫০ শতক</div>
              <div className="text-[10px] text-red-700 mt-0.5 font-medium">আদালতি নিষেধাজ্ঞা + সক্রিয় ব্যাংক বন্ধক</div>
            </button>

            <button
              type="button"
              onClick={() => { reset({ mouza: 'GULSHAN-02', dag: '6002', khatian: '202' }); loadParcels({ mouza: 'GULSHAN-02', dag: '6002', khatian: '202' }); }}
              className="p-3 bg-amber-50/70 hover:bg-amber-100/70 rounded border border-amber-200 text-left transition-all cursor-pointer"
            >
              <div className="font-bold text-amber-800 text-xs flex items-center justify-between">
                <span>গুলশান (দাগ ৬০০২)</span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">মামলাধীন</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-1">খতিয়ান: ২০২ (RS) | ১৫.০০ শতক</div>
              <div className="text-[10px] text-amber-700 mt-0.5 font-medium">বণ্টন বিরোধের মামলা প্রক্রিয়াধীন</div>
            </button>

            <button
              type="button"
              onClick={() => { reset({ mouza: 'MIRPUR-03', dag: '7003', khatian: '303' }); loadParcels({ mouza: 'MIRPUR-03', dag: '7003', khatian: '303' }); }}
              className="p-3 bg-green-50/70 hover:bg-green-100/70 rounded border border-green-200 text-left transition-all cursor-pointer"
            >
              <div className="font-bold text-green-800 text-xs flex items-center justify-between">
                <span>মিরপুর (দাগ ৭০০৩)</span>
                <span className="text-[10px] bg-green-200 text-green-900 px-1.5 py-0.5 rounded">পরিষ্কার</span>
              </div>
              <div className="text-[11px] text-gray-600 mt-1">খতিয়ান: ৩০৩ (RS) | ৮.২৫ শতক</div>
              <div className="text-[10px] text-green-700 mt-0.5 font-medium">দায়মুক্ত (সাবেক বন্ধক অবমুক্ত)</div>
            </button>
          </div>
        </div>

        {/* Search Filter Card */}
        <div className="card shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="mouza" className="label">মৌজা কোড (Mouza Code)</label>
                <input
                  id="mouza"
                  type="text"
                  placeholder="যেমন: DHANMONDI-01"
                  className="input-field font-sans"
                  {...register('mouza')}
                />
              </div>

              <div>
                <label htmlFor="dag" className="label">দাগ নম্বর (Dag Number)</label>
                <input
                  id="dag"
                  type="text"
                  placeholder="যেমন: 5001"
                  className="input-field font-sans"
                  {...register('dag')}
                />
              </div>

              <div>
                <label htmlFor="khatian" className="label">খতিয়ান নম্বর (Khatian Number)</label>
                <input
                  id="khatian"
                  type="text"
                  placeholder="যেমন: 101"
                  className="input-field font-sans"
                  {...register('khatian')}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-govt-border">
              <div className="text-xs text-gray-500">
                দ্রুত সার্চ টেস্ট: <button type="button" onClick={() => { reset({ mouza: 'DHANMONDI-01' }); loadParcels({ mouza: 'DHANMONDI-01' }) }} className="text-govt-green underline mr-2">ধানমন্ডি</button>
                <button type="button" onClick={() => { reset({ dag: '6002' }); loadParcels({ dag: '6002' }) }} className="text-govt-green underline mr-2">দাগ ৬০০২</button>
                <button type="button" onClick={() => { reset({ khatian: '303' }); loadParcels({ khatian: '303' }) }} className="text-govt-green underline">খতিয়ান ৩০৩</button>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  রিসেট
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary text-sm flex items-center gap-1.5"
                >
                  <Search size={16} />
                  <span>অনুসন্ধান</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 rounded p-4 text-sm flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
            <div>{error}</div>
          </div>
        )}

        {/* Results Area */}
        {loading ? (
          <LoadingSpinner text="পার্সেল ডেটাবেজ অনুসন্ধান করা হচ্ছে..." />
        ) : (
          <div className="card p-0 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-govt-border bg-gray-50/50 flex items-center justify-between">
              <h2 className="font-bold text-gray-800 text-base">
                অনুসন্ধানের ফলাফল ({parcels.length} টি পার্সেল)
              </h2>
              <span className="text-xs text-gray-500">
                সর্বশেষ সিংককৃত রেকর্ডসমূহ
              </span>
            </div>

            {parcels.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="font-medium text-base mb-1">কোনো পার্সেল খুঁজে পাওয়া যায়নি</p>
                <p className="text-xs">আপনার ফিল্টার মান পরিবর্তন করে আবার অনুসন্ধান করুন অথবা ফিল্টার রিসেট করুন।</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-700">
                  <thead className="bg-gray-100/75 text-xs text-gray-600 uppercase border-b border-govt-border font-semibold">
                    <tr>
                      <th className="px-5 py-3">মৌজা ও জেএল</th>
                      <th className="px-5 py-3">দাগ নম্বর</th>
                      <th className="px-5 py-3">খতিয়ান নম্বর</th>
                      <th className="px-5 py-3">এলাকা / উপজেলা</th>
                      <th className="px-5 py-3">আয়তন</th>
                      <th className="px-5 py-3">যাচাইকরণ স্থিতি</th>
                      <th className="px-5 py-3 text-right">কার্যক্রম</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-govt-border">
                    {parcels.map((parcel) => (
                      <tr key={parcel.id} className="hover:bg-green-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-gray-900">{parcel.mouzaCode}</div>
                          <div className="text-xs text-gray-500 font-sans">JL: {parcel.jlNumber}</div>
                        </td>
                        <td className="px-5 py-3.5 font-bold font-sans text-gray-900">
                          {parcel.dagNumber}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium font-sans">{parcel.khatianNumber}</div>
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-200 text-gray-700 font-mono">
                            {parcel.khatianType}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          <div>{parcel.upazilaCode}</div>
                          <div className="text-gray-500">{parcel.districtCode}</div>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-sans">
                          <span className="font-semibold text-gray-900">{parcel.recordedArea}</span> {parcel.areaUnit}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge decision={parcel.verificationStatus} />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/parcels/${parcel.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-govt-green hover:text-govt-green-dark bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded transition-colors border border-green-200"
                          >
                            <span>আইনি বিবরণ</span>
                            <ArrowRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
