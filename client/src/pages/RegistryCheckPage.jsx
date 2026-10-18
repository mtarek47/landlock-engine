import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ClipboardCheck,
  Search,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
  RotateCcw
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'

const INITIAL_ROWS = [
  {
    sl: 1,
    deedNo: 'ঢাকা-১২৩-৪৫৬-৭৮৯',
    district: 'ঢাকা',
    upazila: 'সাভার',
    dag: '৭৮৯',
    khatian: '৪৫৬',
    mouza: '১২৩',
    resultBn: 'নিষেধাজ্ঞা',
    status: 'BLOCKED',
    statusColor: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'bg-red-500',
    caseNo: 'সিভিল মামলা নং: ১২৩/২০২৪',
    court: 'ঢাকা জেলা জজ আদালত',
    reason: 'দেওয়ানি আদালতের বৈধ স্থগিতাদেশ বলবৎ রয়েছে। রেজিস্ট্রি সম্পূর্ণ নিষিদ্ধ।',
    date: '২০২৪-০৪-১০',
  },
  {
    sl: 2,
    deedNo: 'রাজশাহী-১১১-২২২-৩৩৩',
    district: 'রাজশাহী',
    upazila: 'বোয়ালিয়া',
    dag: '৩৩৩',
    khatian: '২২২',
    mouza: '১১১',
    resultBn: 'ব্যাংক বন্ধক',
    status: 'MORTGAGE',
    statusColor: 'bg-orange-50 text-orange-700 border-orange-200',
    dotColor: 'bg-orange-500',
    caseNo: 'সোনালী ব্যাংক পিএলসি',
    court: 'করপোরেট শাখা, রাজশাহী',
    reason: 'আর্থিক প্রতিষ্ঠানের কাছে সক্রিয় বন্ধক বিদ্যমান। অনাপত্তিপত্র (NOC) আবশ্যক।',
    date: '২০২৩-১১-১২',
  },
  {
    sl: 3,
    deedNo: 'খুলনা-৫৫৫-৬৬৬-৭৭৭',
    district: 'খুলনা',
    upazila: 'খালিশপুর',
    dag: '৭৭৭',
    khatian: '৬৬৬',
    mouza: '৫৫৫',
    resultBn: 'নিরাপদ',
    status: 'CLEAR',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
    caseNo: 'কোনো বিরোধ নেই',
    court: 'সাব-রেজিস্ট্রি অফিস, খুলনা',
    reason: 'জমির উপর কোনো আইনি নিষেধাজ্ঞা, আদালতের আদেশ বা ব্যাংক বন্ধক নেই।',
    date: '২০২৪-০৫-০১',
  },
  {
    sl: 4,
    deedNo: 'চট্টগ্রাম-৪৪৪-৯৯৯-০০০',
    district: 'চট্টগ্রাম',
    upazila: 'পাঁচলাইশ',
    dag: '০০০',
    khatian: '৯৯৯',
    mouza: '৪৪৪',
    resultBn: 'অপেক্ষমাণ',
    status: 'PENDING',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    dotColor: 'bg-amber-500',
    caseNo: 'বণ্টন মামলা পর্যালোচনাধীন',
    court: 'সহকারী জজ ১ম আদালত, চট্টগ্রাম',
    reason: 'খসড়া আদেশ বিচারিক অনুমোদনের জন্য অপেক্ষমাণ। চূড়ান্ত সিদ্ধান্ত এখনও প্রদান করা হয়নি।',
    date: '২০২৪-০৩-২২',
  },
  {
    sl: 5,
    deedNo: 'বরিশাল-১২১-২১২-৩৪১',
    district: 'বরিশাল',
    upazila: 'কোতোয়ালী',
    dag: '৩৪১',
    khatian: '২১২',
    mouza: '১২১',
    resultBn: 'নিষেধাজ্ঞা',
    status: 'BLOCKED',
    statusColor: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'bg-red-500',
    caseNo: 'ল্যান্ড ট্রাইব্যুনাল মামলা ৩৪/২০২৩',
    court: 'যুগ্ম জেলা জজ আদালত, বরিশাল',
    reason: 'মালিকানা স্বত্ব বিরোধের প্রেক্ষিতে চিরস্থায়ী নিষেধাজ্ঞার আদেশ জারিকৃত।',
    date: '২০২৩-০৯-১৮',
  },
]

export default function RegistryCheckPage() {
  const [searchParams] = useSearchParams()
  const initialDag = searchParams.get('dag') || (searchParams.get('parcelId') ? '৭৮৯' : '')
  const [filterDag, setFilterDag] = useState(initialDag)
  const [filterKhatian, setFilterKhatian] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [activePage, setActivePage] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleClearFilter = () => {
    setFilterDag('')
    setFilterKhatian('')
    setFilterStatus('ALL')
    setActivePage(1)
  }

  // Filter items based on input
  const filteredRows = INITIAL_ROWS.filter((row) => {
    if (filterDag && !row.deedNo.includes(filterDag) && !row.dag.includes(filterDag)) return false
    if (filterKhatian && !row.deedNo.includes(filterKhatian) && !row.khatian.includes(filterKhatian)) return false
    if (filterStatus !== 'ALL' && row.status !== filterStatus) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6 font-bangla select-text pb-12">
        {/* Breadcrumbs matching Screen 5: হোম › রেজিস্ট্রি › যাচাই তালিকা */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-govt-green transition-colors">হোম</Link>
          <span>›</span>
          <Link to="/registry" className="hover:text-govt-green transition-colors">রেজিস্ট্রি</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">যাচাই তালিকা</span>
        </div>

        {/* Heading matching Screen 5 */}
        <h1 className="text-2xl font-bold text-[#004D38]">
          যাচাই তালিকা
        </h1>

        {/* Filter Bar Card matching Screen 5 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
            {/* Input 1: দাগ নম্বর */}
            <div>
              <input
                type="text"
                value={filterDag}
                onChange={(e) => setFilterDag(e.target.value)}
                placeholder="দাগ নম্বর"
                className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            {/* Input 2: খতিয়ান নম্বর */}
            <div>
              <input
                type="text"
                value={filterKhatian}
                onChange={(e) => setFilterKhatian(e.target.value)}
                placeholder="খতিয়ান নম্বর"
                className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              />
            </div>

            {/* Select: অবস্থা */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
              >
                <option value="ALL">অবস্থা (সব)</option>
                <option value="BLOCKED">নিষেধাজ্ঞা (BLOCKED)</option>
                <option value="MORTGAGE">ব্যাংক বন্ধক (MORTGAGE)</option>
                <option value="CLEAR">নিরাপদ (CLEAR)</option>
                <option value="PENDING">অপেক্ষমাণ (PENDING)</option>
              </select>
            </div>

            {/* Button: খুঁজুন / ফিল্টার রিসেট */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {}}
                className="flex-1 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs sm:text-sm font-bold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Search size={15} />
                <span>খুঁজুন</span>
              </button>
              {(filterDag || filterKhatian || filterStatus !== 'ALL') && (
                <button
                  type="button"
                  onClick={handleClearFilter}
                  title="ফিল্টার রিসেট করুন"
                  className="p-2 border border-gray-300 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <RotateCcw size={15} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Data Table Card matching Screen 5 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              {/* Table Header matching Screen 5 */}
              <thead className="bg-gray-50/80 text-gray-700 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-bold text-center w-14">নং</th>
                  <th className="py-3 px-4 font-bold">দাগ/দলিল নম্বর</th>
                  <th className="py-3 px-4 font-bold">যাচাই ফলাফল</th>
                  <th className="py-3 px-4 font-bold">অবস্থা</th>
                  <th className="py-3 px-4 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>

              {/* Table Body matching Screen 5 */}
              <tbody className="divide-y divide-gray-100 text-gray-800">
                {filteredRows.map((row) => (
                  <tr key={row.sl} className="hover:bg-gray-50/80 transition-colors">
                    {/* নং */}
                    <td className="py-3.5 px-4 font-bold text-center text-gray-600 font-sans">
                      {row.sl}
                    </td>

                    {/* দাগ/দলিল নম্বর */}
                    <td className="py-3.5 px-4 font-semibold text-gray-900 font-sans">
                      {row.deedNo}
                    </td>

                    {/* যাচাই ফলাফল */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 font-bold">
                        <span className={`w-2 h-2 rounded-full ${row.dotColor}`} />
                        <span>{row.resultBn}</span>
                      </span>
                    </td>

                    {/* অবস্থা (BLOCKED / MORTGAGE / CLEAR / PENDING) */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${row.statusColor}`}
                      >
                        {row.status}
                      </span>
                    </td>

                    {/* অ্যাকশন: [ বিস্তারিত ] button */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedRecord(row)}
                        className="inline-flex items-center gap-1 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs font-bold px-3.5 py-1.5 rounded-md shadow-xs transition-colors"
                      >
                        <span>বিস্তারিত</span>
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 text-xs">
                      প্রদত্ত ফিল্টারে কোনো তথ্য খুঁজে পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination matching Screen 5: < [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ] > */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-end gap-1.5 select-none">
            <button
              type="button"
              onClick={() => setActivePage(Math.max(1, activePage - 1))}
              disabled={activePage === 1}
              className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft size={16} />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setActivePage(page)}
                className={`w-8 h-8 rounded text-xs font-bold transition-colors font-sans ${
                  activePage === page
                    ? 'bg-[#006A4E] text-white shadow-xs'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setActivePage(Math.min(5, activePage + 1))}
              disabled={activePage === 5}
              className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Decision Detail Modal on clicking 'বিস্তারিত' */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ClipboardCheck size={20} className="text-[#006A4E]" />
                <h3 className="font-bold text-base text-gray-900">
                  রেজিস্ট্রি গেটকিপার যাচাই ফলাফল
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 block">দাগ/দলিল নম্বর</span>
                  <span className="font-bold text-gray-900 font-sans">{selectedRecord.deedNo}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">তফসিল</span>
                  <span className="font-bold text-gray-900">{selectedRecord.district}, {selectedRecord.upazila}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">খতিয়ান ও দাগ</span>
                  <span className="font-bold text-gray-900 font-sans">খতিয়ান: {selectedRecord.khatian}, দাগ: {selectedRecord.dag}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">গেটিং সিদ্ধান্ত</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${selectedRecord.statusColor}`}>
                    {selectedRecord.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border space-y-1.5 bg-white border-gray-200">
                <div className="font-bold text-gray-900">আইনি ও আর্থিক কারণ:</div>
                <p className="text-gray-600 leading-relaxed">{selectedRecord.reason}</p>
                <div className="text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                  উৎস রেফারেন্স: <span className="font-semibold text-gray-800">{selectedRecord.caseNo}</span> ({selectedRecord.court})
                </div>
              </div>

              {selectedRecord.status === 'BLOCKED' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 font-bold flex items-center gap-2">
                  <ShieldAlert size={18} className="shrink-0 text-red-600" />
                  <span>সাব-রেজিস্ট্রি অফিসারকে দলিল রেজিস্ট্রি করা থেকে বিরত থাকার নির্দেশ প্রদান করা হয়েছে।</span>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 bg-[#006A4E] text-white rounded-lg text-xs font-bold hover:bg-[#004D38]"
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
