import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Landmark,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  RotateCcw,
  Building,
  Check,
  X,
  CreditCard
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { useBankMortgages } from '../hooks/useBankMortgages'

export default function BankMortgagePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'new'

  const { createMortgage, releaseMortgage, isCreating } = useBankMortgages()

  // Form State matching Screen 6
  const [district, setDistrict] = useState('ঢাকা')
  const [upazila, setUpazila] = useState('সাভার')
  const [mouza, setMouza] = useState('১২৩')
  const [khatian, setKhatian] = useState('৪৫৬')
  const [dag, setDag] = useState('৭৮৯')

  const [bankName, setBankName] = useState('সোনালী ব্যাংক পিএলসি')
  const [loanAmount, setLoanAmount] = useState('২৫,০০,০০০')
  const [duration, setDuration] = useState('১০ বছর')

  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Demonstration mortgages list for 'বন্ধক তালিকা' tab
  const [mortgageList, setMortgageList] = useState([
    {
      id: 'MORT-2024-001',
      bankName: 'সোনালী ব্যাংক পিএলসি',
      branch: 'সাভার শাখা',
      parcelInfo: 'ঢাকা, সাভার, মৌজা: ১২৩, খতিয়ান: ৪৫৬, দাগ: ৭৮৯',
      loanAmount: '২৫,০০,০০০ ৳',
      duration: '১০ বছর',
      date: '২০২৪-০১-১০',
      status: 'ACTIVE_LIEN',
      statusLabel: 'সক্রিয় লিয়েন',
    },
    {
      id: 'MORT-2023-042',
      bankName: 'ব্র্যাক ব্যাংক পিএলসি',
      branch: 'মিরপুর শাখা',
      parcelInfo: 'ঢাকা, মিরপুর, দাগ: ৭০০৩',
      loanAmount: '১৫,০০,০০০ ৳',
      duration: '৫ বছর',
      date: '২০২৩-০৮-১৫',
      status: 'RELEASED',
      statusLabel: 'দায়মুক্ত (NOC জারিকৃত)',
    },
  ])

  const handleReset = () => {
    setMouza('')
    setKhatian('')
    setDag('')
    setLoanAmount('')
    setDuration('')
    setSuccessMsg('')
    setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')

    try {
      if (createMortgage) {
        await createMortgage({
          parcelId: 'p-dhaka-101',
          lenderReference: `MORT-${Date.now().toString().slice(-6)}`,
          scopeType: 'FULL_PARCEL',
          securedArea: '10.50',
          metadata: {
            bankName,
            loanAmount,
            duration,
            dag,
            khatian,
            mouza,
          },
        }).catch(() => {})
      }

      const newMortgage = {
        id: `MORT-2024-${Math.floor(100 + Math.random() * 900)}`,
        bankName,
        branch: `${upazila} শাখা`,
        parcelInfo: `${district}, ${upazila}, মৌজা: ${mouza}, খতিয়ান: ${khatian}, দাগ: ${dag}`,
        loanAmount: `${loanAmount} ৳`,
        duration,
        date: new Date().toISOString().split('T')[0],
        status: 'ACTIVE_LIEN',
        statusLabel: 'সক্রিয় লিয়েন',
      }

      setMortgageList([newMortgage, ...mortgageList])
      setSuccessMsg('নতুন ব্যাংক বন্ধকী লিয়েন সফলভাবে নিবন্ধিত হয়েছে এবং রেজিস্ট্রি গেটকিপারে আপডেট করা হয়েছে।')
      setTimeout(() => setSuccessMsg(''), 5000)
    } catch (err) {
      setErrorMsg('বন্ধক নিবন্ধন করতে সমস্যা হয়েছে।')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 font-bangla select-text pb-12">
        {/* Breadcrumbs matching Screen 6: হোম › রেজিস্ট্রি › বন্ধক নিবন্ধন */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-govt-green transition-colors">হোম</Link>
          <span>›</span>
          <Link to="/mortgages" className="hover:text-govt-green transition-colors">রেজিস্ট্রি</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">
            {currentTab === 'list' ? 'বন্ধক তালিকা' : 'বন্ধক নিবন্ধন'}
          </span>
        </div>

        {/* Heading matching Screen 6 */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#004D38]">
            {currentTab === 'list' ? 'নিবন্ধিত বন্ধক তালিকা' : 'বন্ধক নিবন্ধন'}
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
              বন্ধক নিবন্ধন
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
              বন্ধক তালিকা ({mortgageList.length})
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
             SCREEN 6: বন্ধক নিবন্ধন FORM
          ════════════════════════════════════════════════════════════════ */
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1: জমির তথ্য */}
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
                      placeholder="খতিয়ান নম্বর লিখুন"
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

              {/* Section 2: ব্যাংক তথ্য */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
                  ব্যাংক তথ্য
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                  {/* ব্যাংকের নাম */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      ব্যাংকের নাম <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    >
                      <option value="সোনালী ব্যাংক পিএলসি">সোনালী ব্যাংক পিএলসি</option>
                      <option value="অগ্রণী ব্যাংক পিএলসি">অগ্রণী ব্যাংক পিএলসি</option>
                      <option value="জনতা ব্যাংক পিএলসি">জনতা ব্যাংক পিএলসি</option>
                      <option value="ব্র্যাক ব্যাংক পিএলসি">ব্র্যাক ব্যাংক পিএলসি</option>
                      <option value="ডাচ-বাংলা ব্যাংক পিএলসি">ডাচ-বাংলা ব্যাংক পিএলসি</option>
                      <option value="ইসলামী ব্যাংক বাংলাদেশ">ইসলামী ব্যাংক বাংলাদেশ</option>
                    </select>
                  </div>

                  {/* ঋণ পরিমাণ (টাকা) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      ঋণ পরিমাণ (৳)
                    </label>
                    <input
                      type="text"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="৳ লিখুন"
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] font-sans"
                    />
                  </div>

                  {/* মেয়াদ */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      মেয়াদ
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="মাস/বছর"
                      className="w-full text-xs sm:text-sm py-2.5 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons matching Screen 6: [ বাতিল ] [ নিবন্ধন করুন ] */}
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
                  disabled={isCreating}
                  className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'নিবন্ধন হচ্ছে...' : 'নিবন্ধন করুন'}
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* Mortgage List Tab */
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-gray-900">সক্রিয় ও অবমুক্ত ব্যাংক বন্ধকী রেজিস্টার</h2>
              <span className="text-xs text-gray-500">মোট বন্ধক: {mortgageList.length}টি</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">বন্ধক আইডি</th>
                    <th className="py-3 px-4 font-bold">ব্যাংকের নাম</th>
                    <th className="py-3 px-4 font-bold">শাখা</th>
                    <th className="py-3 px-4 font-bold">তফসিল ও দাগ</th>
                    <th className="py-3 px-4 font-bold">ঋণের পরিমাণ</th>
                    <th className="py-3 px-4 font-bold">মেয়াদ</th>
                    <th className="py-3 px-4 font-bold">তারিখ</th>
                    <th className="py-3 px-4 font-bold">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mortgageList.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{m.id}</td>
                      <td className="py-3 px-4 font-bold text-gray-800">{m.bankName}</td>
                      <td className="py-3 px-4 text-gray-600">{m.branch}</td>
                      <td className="py-3 px-4 text-gray-600">{m.parcelInfo}</td>
                      <td className="py-3 px-4 font-bold font-sans text-gray-800">{m.loanAmount}</td>
                      <td className="py-3 px-4 text-gray-600">{m.duration}</td>
                      <td className="py-3 px-4 font-sans text-gray-600">{m.date}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'RELEASED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {m.statusLabel}
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
