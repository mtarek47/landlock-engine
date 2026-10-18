import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BarChart3,
  Search,
  Calendar,
  RotateCcw,
  ShieldCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
  Download,
  Building2,
  Users,
  ShieldAlert,
  Settings,
  Bell,
  CheckCircle2,
  Lock,
  Scale,
  Landmark,
  FileCheck
} from 'lucide-react'
import DashboardLayout from '../components/layout/DashboardLayout'
import { DEMO_USERS_MAP } from '../api/mockData'
import { ROLE_BN } from '../components/design-system/constants'

const INITIAL_AUDIT_LOGS = [
  {
    id: 1,
    timestamp: '2024-10-20 14:32',
    user: 'admin1',
    event: 'LOGIN',
    eventColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'সিস্টেম লগইন ও সার্বিক নিরীক্ষণ',
    ip: '103.12.45.67',
  },
  {
    id: 2,
    timestamp: '2024-10-20 13:15',
    user: 'registry_officer1',
    event: 'DECISION',
    eventColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'যাচাই সিদ্ধান্ত প্রদান (গেটের স্থিতি যাচাই)',
    ip: '103.12.45.68',
  },
  {
    id: 3,
    timestamp: '2024-10-20 11:42',
    user: 'court_officer1',
    event: 'ORDER_CREATE',
    eventColor: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'বিজ্ঞ আদালতের দেওয়ানি নিষেধাজ্ঞা খসড়া নিবন্ধন',
    ip: '103.12.45.69',
  },
  {
    id: 4,
    timestamp: '2024-10-20 10:20',
    user: 'bank_officer1',
    event: 'MORTGAGE',
    eventColor: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'আর্থিক প্রতিষ্ঠানের অনুকূলে জমি বন্ধক নিবন্ধন',
    ip: '103.12.45.70',
  },
  {
    id: 5,
    timestamp: '2024-10-19 16:45',
    user: 'order_approver1',
    event: 'ORDER_APPROVE',
    eventColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'বিচারিক ডিজিটাল স্বাক্ষর অনুমোদন ও ল্যান্ডলক সক্রিয়করণ',
    ip: '103.12.45.71',
  },
  {
    id: 6,
    timestamp: '2024-10-19 12:10',
    user: 'citizen_public',
    event: 'PUBLIC_SEARCH',
    eventColor: 'bg-gray-100 text-gray-700 border-gray-200',
    description: 'নাগরিক উন্মুক্ত স্বত্ব ও আইনি ঝুঁকি যাচাই',
    ip: '103.12.45.72',
  },
]

const INTEGRATED_SOURCES = [
  {
    id: 'SRC-01',
    name: 'বাংলাদেশ সুপ্রিম কোর্ট ও জেলা জজ আদালত নেটওয়ার্ক',
    type: 'বিচার বিভাগীয় আদেশ ও রায় ডাটাবেজ',
    status: 'অনলাইন ও সমন্বিত',
    lastSync: '২ মিনিট পূর্বে',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'SRC-02',
    name: 'নিবন্ধন পরিদপ্তর (সাব-রেজিস্ট্রি গেটকিপার নোড)',
    type: 'দলিল নিবন্ধন ও রেজিস্ট্রি ডাটাবেজ',
    status: 'অনলাইন ও সমন্বিত',
    lastSync: 'রিয়েল-টাইম (সরাসরি পুশ)',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'SRC-03',
    name: 'বাংলাদেশ ব্যাংক ও তফসিলি ব্যাংক এপিআই গেটওয়ে',
    type: 'জমি বন্ধকী লিয়েন ও ঋণ দায় তথ্য',
    status: 'অনলাইন ও সমন্বিত',
    lastSync: '৫ মিনিট পূর্বে',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    id: 'SRC-04',
    name: 'ভূমি প্রশাসন ও সহকারী কমিশনার (ভূমি) সার্ভার',
    type: 'ডিজিটাল খতিয়ান, দাগ ও মৌজা নকশা (GIS)',
    status: 'অনলাইন ও সমন্বিত',
    lastSync: '১৫ মিনিট পূর্বে',
    statusColor: 'bg-emerald-100 text-emerald-800',
  },
]

const ROLE_PERMISSIONS_MATRIX = [
  { role: 'SYSTEM_ADMIN', title: 'সিস্টেম প্রশাসক', modules: 'সকল মডিউল (কোর্ট, গেটকিপার, ব্যাংক, অডিট, সেটিংস)' },
  { role: 'COURT_OFFICER', title: 'আদালত কর্মকর্তা', modules: 'কোর্ট অর্ডার পোর্টাল, মামলা ও পার্সেল লিঙ্ক, অডিট লগ' },
  { role: 'ORDER_APPROVER', title: 'অনুমোদনকারী বিচারক', modules: 'বিচারিক অনুমোদন কিউ, ডিজিটাল স্বাক্ষর, মামলা ও পার্সেল' },
  { role: 'REGISTRY_OFFICER', title: 'সাব-রেজিস্ট্রার', modules: 'রেজিস্ট্রি গেটকিপার কনসোল, যাচাই তালিকা, কিউআর সনদ' },
  { role: 'BANK_OFFICER', title: 'ব্যাংক ক্রেডিট কর্মকর্তা', modules: 'ব্যাংক পোর্টাল, বন্ধক নিবন্ধন ও অবমুক্তি, রেজিস্ট্রি চেক' },
  { role: 'LAND_OFFICER', title: 'সহকারী কমিশনার (ভূমি)', modules: 'পার্সেল রেজিস্ট্রি, মৌজা নকশা (GIS), রেজিস্ট্রি চেক' },
  { role: 'AUDITOR', title: 'সিস্টেম অডিটর', modules: 'অপরিবর্তনীয় অডিট ট্রেইল, উৎস ট্র্যাকিং, ব্যবহারকারী নিরীক্ষা' },
  { role: 'CITIZEN', title: 'নাগরিক ব্যবহারকারী', modules: 'উন্মুক্ত জমি অনুসন্ধান, ফলাফল প্রদর্শন, কিউআর সনদপত্র যাচাই' },
]

export default function AuditPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = searchParams.get('tab') || 'logs'

  const [fromDate, setFromDate] = useState('2020-01-01')
  const [toDate, setToDate] = useState('2024-12-31')
  const [eventType, setEventType] = useState('ALL')
  const [activePage, setActivePage] = useState(1)

  const handleTabChange = (tabKey) => {
    if (tabKey === 'logs') {
      setSearchParams({})
    } else {
      setSearchParams({ tab: tabKey })
    }
  }

  const handleResetFilters = () => {
    setFromDate('2020-01-01')
    setToDate('2024-12-31')
    setEventType('ALL')
    setActivePage(1)
  }

  const filteredLogs = INITIAL_AUDIT_LOGS.filter((log) => {
    if (eventType !== 'ALL' && log.event !== eventType) return false
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-6 font-bangla select-text pb-12">
        {/* Breadcrumbs matching Screen 7: হোম › অডিট ট্রেইল */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-govt-green transition-colors">হোম</Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">অডিট ট্রেইল ও সিস্টেম প্রশাসন</span>
        </div>

        {/* Heading & Navigation Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#004D38] flex items-center gap-2">
              <BarChart3 size={24} className="text-[#006A4E]" />
              <span>অডিট ট্রেইল ও প্রশাসন কনসোল</span>
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              যাবতীয় প্রাতিষ্ঠানিক কার্যক্রম, বিচারিক আদেশ ও গেটকিপার সিদ্ধান্তের অপরিবর্তনীয় ক্রিপ্টোগ্রাফিক রেকর্ড
            </p>
          </div>

          {/* Tab Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs bg-white p-1 rounded-xl border border-gray-200 shadow-2xs">
            {[
              { key: 'logs', label: 'অডিট লগ' },
              { key: 'sources', label: 'উৎস ট্র্যাকিং' },
              { key: 'users', label: 'ব্যবহারকারী ব্যবস্থাপনা' },
              { key: 'roles', label: 'রোল ও পারমিশন' },
              { key: 'settings', label: 'সিস্টেম সেটিংস' },
            ].map(({ key, label }) => {
              const isActive = currentTab === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    isActive
                      ? 'bg-[#006A4E] text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* TAB 1: অডিট লগ (DEFAULT) */}
        {currentTab === 'logs' && (
          <div className="space-y-6">
            {/* Filter Bar Card matching Screen 7 */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                {/* তারিখ থেকে */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    তারিখ থেকে
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E] font-sans"
                  />
                </div>

                {/* তারিখ পর্যন্ত */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    তারিখ পর্যন্ত
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E] font-sans"
                  />
                </div>

                {/* ইভেন্ট ধরন */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    ইভেন্ট ধরন
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full text-xs sm:text-sm py-2 px-3 bg-white border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                  >
                    <option value="ALL">সব (All Events)</option>
                    <option value="LOGIN">LOGIN</option>
                    <option value="DECISION">DECISION</option>
                    <option value="ORDER_CREATE">ORDER_CREATE</option>
                    <option value="ORDER_APPROVE">ORDER_APPROVE</option>
                    <option value="MORTGAGE">MORTGAGE</option>
                    <option value="PUBLIC_SEARCH">PUBLIC_SEARCH</option>
                  </select>
                </div>

                {/* খুঁজুন & রিসেট Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="flex-1 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Search size={16} />
                    <span>খুঁজুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    title="ফিল্টার রিসেট"
                    className="p-2.5 border border-gray-300 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Data Table Card matching Screen 7 */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead className="bg-gray-50/80 text-gray-700 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 font-bold">তারিখ ও সময়</th>
                      <th className="py-3 px-4 font-bold">ব্যবহারকারী</th>
                      <th className="py-3 px-4 font-bold">ইভেন্ট</th>
                      <th className="py-3 px-4 font-bold">বিবরণ</th>
                      <th className="py-3 px-4 font-bold">আইপি ঠিকানা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-sans font-semibold text-gray-900">
                          {log.timestamp}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-700">
                          {log.user}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${log.eventColor}`}
                          >
                            {log.event}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-gray-800">
                          {log.description}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600 font-sans">
                          {log.ip}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer note & Pagination matching Screen 7 */}
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                  <ShieldCheck size={16} className="text-emerald-600" />
                  <span>ক্রিপ্টোগ্রাফিক হ্যাশ চেইন দ্বারা সংরক্ষিত অপরিবর্তনীয় অডিট ট্রেইল</span>
                </div>

                <div className="flex items-center gap-1.5 select-none">
                  <button
                    type="button"
                    onClick={() => setActivePage(Math.max(1, activePage - 1))}
                    disabled={activePage === 1}
                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setActivePage(page)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-colors font-sans ${
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
                    onClick={() => setActivePage(Math.min(3, activePage + 1))}
                    disabled={activePage === 3}
                    className="p-1.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: উৎস ট্র্যাকিং (SOURCES) */}
        {currentTab === 'sources' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
                <Building2 size={18} className="text-[#006A4E]" />
                <span>সমন্বিত প্রাতিষ্ঠানিক ডেটা সোর্স নোডসমূহ</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INTEGRATED_SOURCES.map((src) => (
                  <div key={src.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm text-gray-900">{src.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${src.statusColor}`}>
                        {src.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{src.type}</div>
                    <div className="text-[11px] text-gray-400 font-sans pt-1 border-t border-gray-100 flex justify-between">
                      <span>নোড আইডি: <strong className="font-mono text-gray-700">{src.id}</strong></span>
                      <span>সর্বশেষ সিংক: {src.lastSync}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ব্যবহারকারী ব্যবস্থাপনা (USERS) */}
        {currentTab === 'users' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-[#006A4E]" />
                <span>নিবন্ধিত দাপ্তরিক ব্যবহারকারী ও ভূমিকা তালিকা</span>
              </h2>
              <span className="text-xs text-gray-500">মোট একাউন্ট: {Object.keys(DEMO_USERS_MAP).length}টি</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-bold">ইউজারনেম</th>
                    <th className="py-3 px-4 font-bold">নাম ও পদবী</th>
                    <th className="py-3 px-4 font-bold">দাপ্তরিক ভূমিকা</th>
                    <th className="py-3 px-4 font-bold">ইমেইল</th>
                    <th className="py-3 px-4 font-bold">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.values(DEMO_USERS_MAP).map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">{u.username}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">{u.displayName}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-green-50 text-[#006A4E] border border-green-200 font-bold text-[11px]">
                          {ROLE_BN[u.role] || u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                          <CheckCircle2 size={13} />
                          <span>সক্রিয়</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: রোল ও পারমিশন (ROLES) */}
        {currentTab === 'roles' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <ShieldAlert size={18} className="text-[#006A4E]" />
              <span>ভূমিকাভিত্তিক এক্সেস কন্ট্রোল (RBAC) ম্যাট্রিক্স</span>
            </h2>
            <div className="divide-y divide-gray-100 text-xs">
              {ROLE_PERMISSIONS_MATRIX.map((item) => (
                <div key={item.role} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-gray-900">{item.title}</span>
                    <span className="font-mono text-gray-500 ml-2 text-[11px]">({item.role})</span>
                  </div>
                  <div className="text-gray-600 bg-gray-50 px-3 py-1 rounded border border-gray-200 font-medium">
                    {item.modules}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: সিস্টেম সেটিংস (SETTINGS) */}
        {currentTab === 'settings' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2 flex items-center gap-2">
              <Settings size={18} className="text-[#006A4E]" />
              <span>সিস্টেম অখণ্ডতা ও নিরাপত্তা কনফিগারেশন</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="font-bold text-gray-900">ক্রিপ্টোগ্রাফিক হ্যাশ অ্যালগরিদম</div>
                <div className="font-mono text-gray-700 text-sm">SHA-256 HMAC & Ed25519</div>
                <p className="text-gray-500 text-[11px]">সকল বিচারিক ডিজিটাল স্বাক্ষর এবং অডিট ট্রেইল এন্ট্রি এই অ্যালগরিদমে হ্যাশ করা হয়।</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="font-bold text-gray-900">অডিট রেকর্ড সংরক্ষণ নীতিমালা</div>
                <div className="font-mono text-gray-700 text-sm">স্থায়ী ও অপরিবর্তনীয় (Permanent Append-Only)</div>
                <p className="text-gray-500 text-[11px]">আইন অনুযায়ী কোনো কর্মকর্তা বা প্রশাসক অডিট ট্রেইল মুছতে বা সম্পাদনা করতে পারেন না।</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

