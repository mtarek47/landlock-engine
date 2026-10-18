import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Search,
  Shield,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  RotateCcw,
  ExternalLink,
  X,
  Eye,
  Calendar,
  Building2,
  Clock
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

export default function CitizenSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [district, setDistrict] = useState(searchParams.get('district') || 'ঢাকা')
  const [upazila, setUpazila] = useState(searchParams.get('upazila') || 'সাভার')
  const [mouza, setMouza] = useState(searchParams.get('mouza') || '১২৩')
  const [khatian, setKhatian] = useState(searchParams.get('khatian') || '৪৫৬')
  const [dag, setDag] = useState(searchParams.get('dag') || '৭৮৯')

  // Controls whether showing Screen 2 (Search Form) or Screen 3 (Result Page)
  const [hasResult, setHasResult] = useState(
    Boolean(searchParams.get('submitted') || searchParams.get('dag'))
  )
  const [showOrderModal, setShowOrderModal] = useState(false)

  // Demo presets for easy 1-click verification
  const loadBlockedPreset = () => {
    setDistrict('ঢাকা')
    setUpazila('সাভার')
    setMouza('১২৩')
    setKhatian('৪৫৬')
    setDag('৭৮৯')
    setHasResult(true)
  }

  const loadClearPreset = () => {
    setDistrict('ঢাকা')
    setUpazila('মিরপুর')
    setMouza('MIRPUR-03')
    setKhatian('৩০৩')
    setDag('৭০০৩')
    setHasResult(true)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setHasResult(true)
  }

  const handleNewSearch = () => {
    setHasResult(false)
  }

  // Determine if this is the blocked parcel from screenshot 3 (dag 789 or default)
  const isBlocked = dag === '৭৮৯' || dag === '789' || dag === '5001' || !dag || dag === ''

  return (
    <DashboardLayout>
      <div className="space-y-6 font-bangla select-text pb-10">

        {/* ════════════════════════════════════════════════════════════════
            SCREEN 2: নাগরিক জমি অনুসন্ধান পেজ (CITIZEN SEARCH FORM)
        ════════════════════════════════════════════════════════════════ */}
        {!hasResult ? (
          <div className="space-y-6">
            {/* Breadcrumbs matching Screen 2: হোম › জমি অনুসন্ধান */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link to="/" className="hover:text-govt-green transition-colors">হোম</Link>
              <span>›</span>
              <span className="text-gray-900 font-semibold">জমি অনুসন্ধান</span>
            </div>

            {/* Title and Subtitle matching Screen 2 */}
            <div>
              <h1 className="text-2xl font-bold text-[#004D38]">
                জমি অনুসন্ধান
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                দাগ, খতিয়ান ও মৌজা নম্বর দিয়ে জমির উপর কোনো নিষেধাজ্ঞা, আইনি বিরোধ বা ব্যাংক বন্ধক আছে কিনা যাচাই করুন।
              </p>
            </div>

            {/* White Form Card: 'জমির তথ্য দিন' */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                জমির তথ্য দিন
              </h2>

              <form onSubmit={handleSearch} className="space-y-6">
                {/* Row 1: জেলা & উপজেলা */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                      <option value="রংপুর">রংপুর</option>
                      <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                    </select>
                  </div>

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
                      <option value="উত্তরা">উত্তরা</option>
                      <option value="কেরানীগঞ্জ">কেরানীগঞ্জ</option>
                    </select>
                  </div>
                </div>

                {/* Row 2: মৌজা নম্বর, খতিয়ান নম্বর, দাগ নম্বর */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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

                {/* Action button matching Screen 2 */}
                <div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors"
                  >
                    <Search size={16} />
                    <span>অনুসন্ধান করুন</span>
                  </button>
                </div>
              </form>

              {/* Demo Helper Presets */}
              <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-gray-500 font-semibold">ডেমো টেস্ট প্রিসেট:</span>
                <button
                  type="button"
                  onClick={loadBlockedPreset}
                  className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 font-medium transition-colors"
                >
                  🔴 ঢাকা-সাভার (দাগ ৭৮৯ - নিষেধাজ্ঞা আরোপিত)
                </button>
                <button
                  type="button"
                  onClick={loadClearPreset}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100 font-medium transition-colors"
                >
                  🟢 মিরপুর (দাগ ৭০০৩ - দায়মুক্ত ও নিরাপদ)
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ════════════════════════════════════════════════════════════════
             SCREEN 3: অনুসন্ধান ফলাফল পেজ (SEARCH RESULT PAGE)
          ════════════════════════════════════════════════════════════════ */
          <div className="space-y-6">
            {/* Breadcrumbs matching Screen 3: হোম › জমি অনুসন্ধান › ফলাফল */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Link to="/" className="hover:text-govt-green transition-colors">হোম</Link>
                <span>›</span>
                <button
                  onClick={handleNewSearch}
                  className="hover:text-govt-green transition-colors"
                >
                  জমি অনুসন্ধান
                </button>
                <span>›</span>
                <span className="text-gray-900 font-semibold">ফলাফল</span>
              </div>

              {/* Back to search */}
              <button
                type="button"
                onClick={handleNewSearch}
                className="text-xs text-[#006A4E] hover:underline font-bold inline-flex items-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>নতুন অনুসন্ধান</span>
              </button>
            </div>

            {/* Page Heading matching Screen 3 */}
            <h1 className="text-2xl font-bold text-[#004D38]">
              জমির যাচাই ফলাফল
            </h1>

            {/* Top Row matching Screen 3: Two Cards side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Card: জমির তথ্য */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                  জমির তথ্য
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <span className="text-gray-500 block mb-0.5">জেলা</span>
                    <span className="font-bold text-gray-900 text-sm">{district}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">উপজেলা</span>
                    <span className="font-bold text-gray-900 text-sm">{upazila}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">মৌজা নম্বর</span>
                    <span className="font-bold text-gray-900 text-sm font-sans">{mouza}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">খতিয়ান নম্বর</span>
                    <span className="font-bold text-gray-900 text-sm font-sans">{khatian}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-0.5">দাগ নম্বর</span>
                    <span className="font-bold text-gray-900 text-sm font-sans">{dag}</span>
                  </div>
                </div>
              </div>

              {/* Right Card: Alert Box matching Screen 3 */}
              <div className="lg:col-span-5">
                {isBlocked ? (
                  <div className="h-full bg-red-50/90 border border-red-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 border border-red-200">
                        <ShieldAlert size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-red-800">
                            নিষেধাজ্ঞা আরোপিত
                          </h3>
                        </div>
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 bg-red-200/80 text-red-900 rounded mb-2">
                          BLOCKED_BY_VALID_ORDER
                        </span>
                        <p className="text-xs text-red-700 leading-relaxed font-medium">
                          এই জমিতে আদালতের বৈধ নিষেধাজ্ঞা রয়েছে। রেজিস্ট্রি সম্পন্ন করা যাবে না।
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-emerald-50/90 border border-emerald-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                        <CheckCircle2 size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-emerald-800">
                            দায়মুক্ত ও নিরাপদ
                          </h3>
                        </div>
                        <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-200/80 text-emerald-900 rounded mb-2">
                          CLEAR_NO_ENCUMBRANCE
                        </span>
                        <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                          এই জমিতে কোনো সক্রিয় আদালতি নিষেধাজ্ঞা বা বন্ধকী লিয়েন পাওয়া যায়নি।
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Row matching Screen 3: Two Cards side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Card: বিপজ্জনক তথ্য / আইনি তথ্য */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                  বিপজ্জনক তথ্য
                </h2>

                {isBlocked ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">নিষেধাজ্ঞার ধরন</span>
                      <span className="font-bold text-red-800">আদালতের নিষেধাজ্ঞা (Stay Order)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">মামলার নম্বর</span>
                      <span className="font-bold text-gray-800 font-sans">সিভিল মামলা নং: ১২৩/২০২৪</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">আদেশদাতা</span>
                      <span className="font-bold text-gray-800">ঢাকা জেলা জজ আদালত</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">জারির তারিখ</span>
                      <span className="font-bold text-gray-800 font-sans">২০২৪-০৪-১০</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-500">শেষ তারিখ</span>
                      <span className="font-bold text-gray-800 font-sans">২০২৪-১০-১০</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-600 py-4 text-center">
                    <CheckCircle2 size={24} className="mx-auto text-emerald-600 mb-2" />
                    <p className="font-bold text-emerald-800">কোনো আইনি নিষেধাজ্ঞা বা বিচারাধীন মামলা নেই</p>
                    <p className="text-gray-400 text-[11px] mt-1">সর্বশেষ কেন্দ্রীয় ডাটাবেজ সমন্বয় অনুসারে জমিটি সম্পূর্ণ ঝুঁকিমুক্ত।</p>
                  </div>
                )}
              </div>

              {/* Right Card: সম্পর্কিত নথি matching Screen 3 */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
                    সম্পর্কিত নথি
                  </h2>

                  {/* Document Link Box */}
                  <div
                    onClick={() => setShowOrderModal(true)}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={18} className="text-[#006A4E]" />
                      <span className="text-xs font-bold text-gray-800 group-hover:text-[#006A4E]">
                        আদালতের কপি দেখুন
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-[#006A4E]">›</span>
                  </div>
                </div>

                {/* Bottom Timestamp & Certificate Link */}
                <div className="pt-4 border-t border-gray-100 mt-6 space-y-2">
                  <div className="text-[11px] text-gray-500 flex items-center justify-between">
                    <span>সর্বশেষ আপডেট:</span>
                    <span className="font-sans font-semibold text-gray-700">২০২৪-০৩-২০ ১৪:৩০</span>
                  </div>

                  <Link
                    to="/verify"
                    className="text-xs text-[#006A4E] hover:underline font-bold inline-flex items-center gap-1.5 pt-1"
                  >
                    <FileCheck size={14} />
                    <span>ডিজিটাল কিউআর সনদপত্র যাচাই করুন →</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Court Order Document Modal Preview */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-[#006A4E]" />
                <h3 className="font-bold text-base text-gray-900">বিজ্ঞ আদালতের আদেশপত্র</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-3 text-gray-700 leading-relaxed font-mono">
              <div className="text-center font-bold text-gray-900 font-bangla border-b border-gray-200 pb-2">
                ঢাকা জেলা ও দায়রা জজ ১ম আদালত
                <div className="text-[10px] text-gray-500 font-normal">দেওয়ানি মোকদ্দমা নং ১২৩/২০২৪</div>
              </div>
              <p>
                <strong>আদেশের ধরন:</strong> দেওয়ানি কার্যবিধি আদেশ ৩৯ নিয়ম ১ ও ২ মতে অস্থায়ী নিষেধাজ্ঞা (Injunction Order).
              </p>
              <p>
                <strong>তফসিল বর্ণিত সম্পত্তি:</strong> জেলা: ঢাকা, উপজেলা: সাভার, মৌজা: ১২৩, খতিয়ান: ৪৫৬, দাগ নম্বর: ৭৮৯।
              </p>
              <p className="text-red-700 font-bold">
                <strong>নির্দেশনা:</strong> মোকদ্দমা চূড়ান্ত নিষ্পত্তি না হওয়া পর্যন্ত বর্ণিত দাগের সম্পত্তিতে কোনো প্রকার দলিল রেজিস্ট্রি, হস্তান্তর, রূপান্তর বা ব্যাংকে বন্ধক গ্রহণ সম্পূর্ণ নিষিদ্ধ ঘোষণা করা হলো।
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="px-4 py-2 bg-[#006A4E] text-white rounded-lg text-xs font-bold hover:bg-[#004D38]"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
