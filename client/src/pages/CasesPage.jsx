import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FileText,
  FilePlus,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  RotateCcw,
  Calendar,
  Building2,
  Clock,
  Check,
  X
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { orderApi, caseApi } from '../api/client'

export default function CasesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'new'

  // Form State matching Screen 4
  const [caseNumber, setCaseNumber] = useState('১২৩/২০২৪')
  const [courtName, setCourtName] = useState('ঢাকা জেলা জজ আদালত')
  const [orderType, setOrderType] = useState('আদালতের নিষেধাজ্ঞা (Stay Order)')
  const [orderDate, setOrderDate] = useState('2024-04-10')

  const [district, setDistrict] = useState('ঢাকা')
  const [upazila, setUpazila] = useState('সাভার')
  const [mouza, setMouza] = useState('১২৩')
  const [khatian, setKhatian] = useState('৪৫৬')
  const [dag, setDag] = useState('৭৮৯')

  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Demonstration court orders list for "আদেশসমূহ" tab
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2024-001',
      caseNumber: 'সিভিল মামলা নং: ১২৩/২০২৪',
      court: 'ঢাকা জেলা জজ আদালত',
      orderType: 'আদালতের নিষেধাজ্ঞা (Stay Order)',
      parcelInfo: 'ঢাকা, সাভার, মৌজা: ১২৩, খতিয়ান: ৪৫৬, দাগ: ৭৮৯',
      date: '২০২৪-০৪-১০',
      status: 'ACTIVE_LOCKED',
      statusLabel: 'সক্রিয় বলবৎ',
    },
    {
      id: 'ORD-2024-002',
      caseNumber: 'দেওয়ানি মোকদ্দমা নং: ৪৫৬/২০২৪',
      court: 'যুগ্ম জেলা জজ ১ম আদালত',
      orderType: 'স্থিতাবস্থা (Status Quo)',
      parcelInfo: 'রাজশাহী, বোয়ালিয়া, দাগ: ২২',
      date: '২০২৪-০২-১৫',
      status: 'PENDING_APPROVAL',
      statusLabel: 'অনুমোদন অপেক্ষমাণ',
    },
  ])

  const handleReset = () => {
    setCaseNumber('')
    setOrderDate('')
    setMouza('')
    setKhatian('')
    setDag('')
    setSuccessMsg('')
    setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      // Simulate/Trigger API creation
      await new Promise((r) => setTimeout(r, 600))
      
      const newOrder = {
        id: `ORD-2024-${Math.floor(100 + Math.random() * 900)}`,
        caseNumber: caseNumber.startsWith('মামলা') ? caseNumber : `মামলা নং: ${caseNumber}`,
        court: courtName,
        orderType,
        parcelInfo: `${district}, ${upazila}, মৌজা: ${mouza}, খতিয়ান: ${khatian}, দাগ: ${dag}`,
        date: orderDate || new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        statusLabel: 'দাখিলকৃত',
      }

      setOrders([newOrder, ...orders])
      setSuccessMsg('নতুন আদালতের নিষেধাজ্ঞা আদেশ সফলভাবে সিস্টেমে নিবন্ধিত হয়েছে।')
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err) {
      setErrorMsg('আদেশ সংরক্ষণ করতে সমস্যা হয়েছে।')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-bangla select-text pb-12">
        {/* Breadcrumbs matching Screen 4: হোম › কোর্ট অর্ডার › নতুন আদেশ */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-govt-green transition-colors">হোম</Link>
          <span>›</span>
          <Link to="/cases" className="hover:text-govt-green transition-colors">কোর্ট অর্ডার</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">
            {currentTab === 'list' ? 'আদেশসমূহ' : 'নতুন আদেশ'}
          </span>
        </div>

        {/* Heading matching Screen 4 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#004D38]">
            {currentTab === 'list' ? 'আদালতের আদেশ তালিকা' : 'নতুন আদালতের আদেশ নিবন্ধন'}
          </h1>

          {/* Quick tab switch */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'new' })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                currentTab !== 'list'
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              নতুন আদেশ
            </button>
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'list' })}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                currentTab === 'list'
                  ? 'bg-[#006A4E] text-white shadow-xs'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              আদেশসমূহ ({orders.length})
            </button>
          </div>
        </div>

        {/* Success / Error notification */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-950 rounded-lg text-xs sm:text-sm flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-300 text-red-950 rounded-lg text-xs sm:text-sm flex items-center gap-2.5">
            <AlertTriangle size={18} className="text-red-700 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {currentTab !== 'list' ? (
          /* ════════════════════════════════════════════════════════════════
             SCREEN 4: নতুন আদালতের আদেশ নিবন্ধন FORM
          ════════════════════════════════════════════════════════════════ */
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: মামলার তথ্য */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                  মামলার তথ্য
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* মামলা নম্বর */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      মামলা নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      placeholder="মামলা নম্বর লিখুন"
                      required
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>

                  {/* আদালত */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      আদালত <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={courtName}
                      onChange={(e) => setCourtName(e.target.value)}
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    >
                      <option value="ঢাকা জেলা জজ আদালত">ঢাকা জেলা জজ আদালত</option>
                      <option value="যুগ্ম জেলা জজ ১ম আদালত">যুগ্ম জেলা জজ ১ম আদালত</option>
                      <option value="সুপ্রিম কোর্ট হাইকোর্ট বিভাগ">সুপ্রিম কোর্ট হাইকোর্ট বিভাগ</option>
                      <option value="ভূমি আপিল ট্রাইব্যুনাল">ভূমি আপিল ট্রাইব্যুনাল</option>
                      <option value="সহকারী জজ আদালত, সাভার">সহকারী জজ আদালত, সাভার</option>
                    </select>
                  </div>

                  {/* আদেশের ধরন */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      আদেশের ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    >
                      <option value="আদালতের নিষেধাজ্ঞা (Stay Order)">আদালতের নিষেধাজ্ঞা (Stay Order)</option>
                      <option value="স্থিতাবস্থা (Status Quo)">স্থিতাবস্থা (Status Quo)</option>
                      <option value="বণ্টন মোকদ্দমা নিষেধাজ্ঞা">বণ্টন মোকদ্দমা নিষেধাজ্ঞা</option>
                      <option value="ক্রোক ও স্থগিতাদেশ">ক্রোক ও স্থগিতাদেশ</option>
                    </select>
                  </div>

                  {/* আদেশের তারিখ */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      আদেশের তারিখ <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        required
                        className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E] font-sans"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: জমির তথ্য */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                  জমির তথ্য
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* জেলা */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      জেলা <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    >
                      <option value="ঢাকা">ঢাকা</option>
                      <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                      <option value="রাজশাহী">রাজশাহী</option>
                      <option value="খুলনা">খুলনা</option>
                      <option value="বরিশাল">বরিশাল</option>
                      <option value="সিলেট">সিলেট</option>
                    </select>
                  </div>

                  {/* উপজেলা */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      উপজেলা <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={upazila}
                      onChange={(e) => setUpazila(e.target.value)}
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    >
                      <option value="সাভার">সাভার</option>
                      <option value="ধানমন্ডি">ধানমন্ডি</option>
                      <option value="গুলশান">গুলশান</option>
                      <option value="মিরপুর">মিরপুর</option>
                      <option value="তেজগাঁও">তেজগাঁও</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* মৌজা নম্বর */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      মৌজা নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={mouza}
                      onChange={(e) => setMouza(e.target.value)}
                      placeholder="মৌজা নম্বর লিখুন"
                      required
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>

                  {/* খতিয়ান নম্বর */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      খতিয়ান নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={khatian}
                      onChange={(e) => setKhatian(e.target.value)}
                      placeholder="খতিয়ান লিখুন"
                      required
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>

                  {/* দাগ নম্বর */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      দাগ নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={dag}
                      onChange={(e) => setDag(e.target.value)}
                      placeholder="দাগ নম্বর লিখুন"
                      required
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons matching Screen 4: [ বাতিল ] [ সংরক্ষণ করুন ] */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Orders List Tab */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-gray-900">নথিভুক্ত আদালতের আদেশসমূহ</h2>
              <span className="text-xs text-gray-500">মোট আদেশ: {orders.length}টি</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">আদেশ আইডি</th>
                    <th className="py-3 px-4 font-bold">মামলা নম্বর</th>
                    <th className="py-3 px-4 font-bold">আদালত</th>
                    <th className="py-3 px-4 font-bold">আদেশের ধরন</th>
                    <th className="py-3 px-4 font-bold">তফসিল ও দাগ</th>
                    <th className="py-3 px-4 font-bold">তারিখ</th>
                    <th className="py-3 px-4 font-bold">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{o.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">{o.caseNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{o.court}</td>
                      <td className="py-3 px-4 font-medium text-red-800">{o.orderType}</td>
                      <td className="py-3 px-4 text-gray-600">{o.parcelInfo}</td>
                      <td className="py-3 px-4 font-sans text-gray-600">{o.date}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          {o.statusLabel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}
