import { useState } from 'react'
import {
  Gavel,
  Landmark,
  FileCheck2,
  History,
  ExternalLink,
  ShieldAlert,
  FileText,
  User,
  Calendar,
  Building,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Check,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toBengaliNumber } from '../design-system/constants'

export default function OfficerReviewPanel({ result, parcel, courtRestrictions = [], mortgageRecords = [] }) {
  const [activeTab, setActiveTab] = useState('court') // 'court' | 'mortgage' | 'land' | 'audit'
  const [copiedId, setCopiedId] = useState(null)

  if (!result) return null

  const copyText = (text, id) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const courtOrder = parcel?.courtOrder || courtRestrictions[0] || null
  const mortgage = parcel?.mortgage || mortgageRecords[0] || null

  const tabs = [
    {
      id: 'court',
      label: 'আদালতের আদেশ ও নথি',
      icon: Gavel,
      badge: (result.activeRestrictionCount > 0 || courtRestrictions.length > 0) ? `${toBengaliNumber(result.activeRestrictionCount || courtRestrictions.length)} টি` : null,
      badgeColor: 'bg-red-100 text-red-800',
    },
    {
      id: 'mortgage',
      label: 'ব্যাংক বন্ধক ও অনাপত্তি (NOC)',
      icon: Landmark,
      badge: (result.activeMortgageCount > 0 || mortgageRecords.length > 0) ? `${toBengaliNumber(result.activeMortgageCount || mortgageRecords.length)} টি` : null,
      badgeColor: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'land',
      label: 'ভূমি রেকর্ড ও নামজারি',
      icon: FileCheck2,
      badge: 'প্রতিপাদিত',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      id: 'audit',
      label: 'অডিট লগ ও ট্রেস আইডি',
      icon: History,
      badge: 'লাইভ',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
  ]

  return (
    <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs space-y-4 font-bangla">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-govt-border">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <FileText size={18} className="text-govt-green" />
            <span>সাব-রেজিস্ট্রার পর্যালোচনা ও উৎস রেকর্ড প্যানেল (Officer Source-Record Review)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            দলিল নিবন্ধনের পূর্বে প্রতিটি সংশ্লিষ্ট বিচারিক, ব্যাংকিং ও ভূমি প্রশাসন নথি যাচাই করুন।
          </p>
        </div>

        <span className="text-[11px] text-gray-500 font-sans self-start sm:self-auto bg-gray-50 px-2 py-1 rounded border border-gray-200">
          আবেদন আইডি: <strong className="font-mono text-gray-800">{result.applicationReference || 'REG-APP-2025'}</strong>
        </span>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-govt-paper rounded border border-govt-border text-xs">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-govt-green text-white shadow-2xs'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
              }`}
            >
              <TabIcon size={14} className={isActive ? 'text-govt-gold' : 'text-gray-500'} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${isActive ? 'bg-white/20 text-white' : tab.badgeColor}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content 1: Court Review */}
      {activeTab === 'court' && (
        <div className="space-y-3 pt-1">
          {courtOrder ? (
            <div className="p-4 bg-red-50/50 border border-red-200 rounded-lg text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-red-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-900 block font-bangla">বিচারিক আদালতের তথ্য:</span>
                  <strong className="text-sm text-gray-900 font-bangla">
                    {courtOrder.courtName || 'প্রথম যুগ্ম জেলা জজ আদালত, ঢাকা'}
                  </strong>
                </div>

                <Link
                  to="/cases"
                  className="text-xs text-govt-green font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>আদালতের পূর্ণাঙ্গ মামলা ড্যাশবোর্ডে দেখুন</span>
                  <ExternalLink size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold block font-bangla">মামলা নম্বর ও ধরন:</span>
                  <strong className="text-xs font-mono text-gray-900 block mt-0.5">
                    {courtOrder.caseNumber || 'OS-2024-00123'}
                  </strong>
                  <span className="text-[10px] text-gray-600 font-bangla">
                    ধরন: দেওয়ানি স্বত্ব ও স্থায়ী নিষেধাজ্ঞা মোকদ্দমা
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold block font-bangla">স্থগিতাদেশ রেফারেন্স ও তারিখ:</span>
                  <strong className="text-xs font-mono text-red-800 block mt-0.5">
                    {courtOrder.orderReference || 'ORD-DH-2024-991'}
                  </strong>
                  <span className="text-[10px] text-gray-600 font-bangla">
                    আদেশ প্রদানের তারিখ: {courtOrder.effectiveFrom || '২০২৪-০১-২০'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold block font-bangla">সংযুক্ত আদালতের আদেশনামা:</span>
                  <div className="flex items-center gap-1.5 mt-0.5 text-govt-green font-semibold text-xs">
                    <FileText size={13} />
                    <span className="font-mono text-[11px]">DOC-INJ-DH-991.pdf</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bangla">ডিজিটাল সিলমোহর দ্বারা প্রতিপাদিত</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded border border-red-200 text-gray-800 text-xs leading-relaxed">
                <strong className="text-red-950 block font-bold font-bangla">আদালতের আদেশনামার মূল অংশ:</strong>
                <p className="mt-0.5 text-[11px] text-gray-700">
                  বিজ্ঞ আদালত ধানমন্ডি মৌজার ৫০০১ নং দাগের ওপর কোনো প্রকার হস্তান্তর, সাফ-কবলা দলিল সম্পাদন, হেবা ও রূপান্তর চূড়ান্ত শুনানির পূর্বে আইনত স্থগিত ঘোষণা করিয়াছেন।
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>এই পার্সেল সংশ্লিষ্ট কোনো আদালতের সক্রিয় আদেশ বা নিষেধাজ্ঞা পাওয়া যায়নি।</span>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Mortgage Review */}
      {activeTab === 'mortgage' && (
        <div className="space-y-3 pt-1">
          {mortgage ? (
            <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg text-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-amber-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-900 block font-bangla">আর্থিক প্রতিষ্ঠানের বিবরণ:</span>
                  <strong className="text-sm text-gray-900 font-bangla">
                    {mortgage.lenderName || 'ডেমো কমার্শিয়াল ব্যাংক পিএলসি'}
                  </strong>
                </div>

                <Link
                  to="/mortgages"
                  className="text-xs text-govt-green font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>ব্যাংক বন্ধকী রেজিস্টারে দেখুন</span>
                  <ExternalLink size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold block font-bangla">বন্ধক রেফারেন্স নং:</span>
                  <strong className="text-xs font-mono text-gray-900 block mt-0.5">
                    {mortgage.lenderReference || 'MORT-DB-2023-001'}
                  </strong>
                  <span className="text-[10px] text-gray-600 font-bangla">
                    শাখা: করপোরেট ব্রাঞ্চ, মতিঝিল
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold block font-bangla">দায় স্থিতি (Lien Status):</span>
                  <strong className={`text-xs block mt-0.5 font-bangla ${mortgage.status === 'RELEASED' ? 'text-green-800' : 'text-amber-800'}`}>
                    {mortgage.status === 'RELEASED' ? 'দায়মুক্তি সনদ অনুমোদিত' : 'সক্রিয় ব্যাংক বন্ধক বলবৎ'}
                  </strong>
                  <span className="text-[10px] text-gray-600 font-bangla">
                    কার্যকর তারিখ: {mortgage.effectiveFrom || '২০২৩-০৬-০১'}
                  </span>
                </div>

                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-[10px] text-gray-500 font-bold block font-bangla">অনাপত্তি সনদ (NOC):</span>
                  <strong className="text-xs block mt-0.5 font-mono text-gray-800">
                    {mortgage.releaseReference || 'অনিষ্পন্ন (NOC দাখিল হয়নি)'}
                  </strong>
                  <span className="text-[10px] text-red-600 font-bangla font-semibold">
                    ব্যাংক রিলিজ কপি ছাড়া রেজিস্ট্রি নিষিদ্ধ
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>এই সম্পত্তিতে কোনো ব্যাংক বন্ধকী লিয়েন বা আর্থিক দায় পাওয়া যায়নি।</span>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 3: Land Administration & Mutation */}
      {activeTab === 'land' && (
        <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-lg text-xs space-y-3 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-emerald-200 font-bangla">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-900 block">ভূমি প্রশাসন কর্তৃপক্ষ:</span>
              <strong className="text-sm text-gray-900">
                সহকারী কমিশনার (ভূমি) সার্কেল অফিস, ঢাকা সদর
              </strong>
            </div>

            {parcel?.id && (
              <Link
                to={`/parcels/${parcel.id}`}
                className="text-xs text-govt-green font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
              >
                <span>ডিজিটাল রেকর্ড অব রাইটস (ROR) প্রোফাইল</span>
                <ExternalLink size={12} />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-2.5 rounded border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold block font-bangla">নামজারি ও জমাভাগ স্থিতি:</span>
              <strong className="text-xs text-emerald-800 block mt-0.5 font-bangla">অনুমোদিত ও সক্রিয়</strong>
              <span className="text-[10px] text-gray-600 font-bangla">মিউটেশন কেস নং: MUT-DH-2023-882</span>
            </div>

            <div className="bg-white p-2.5 rounded border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold block font-bangla">ভূমি উন্নয়ন কর (খাজনা):</span>
              <strong className="text-xs text-gray-800 block mt-0.5 font-bangla">১৪৩১ বঙ্গাব্দ পর্যন্ত পরিশোধিত</strong>
              <span className="text-[10px] text-emerald-700 font-semibold font-bangla">দাখিলা রশিদ যাচাইকৃত</span>
            </div>

            <div className="bg-white p-2.5 rounded border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold block font-bangla">মৌজা ম্যাপ ও সীমানা জরিপ:</span>
              <strong className="text-xs text-gray-800 block mt-0.5 font-bangla">ডিজিটাল নকশায় চিহ্নিত</strong>
              <span className="text-[10px] text-gray-500 font-bangla">সার্ভে স্থিতি: কোনো সীমানা বিরোধ নেই</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 4: Audit Logs & Correlation */}
      {activeTab === 'audit' && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-3 font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-gray-200 font-bangla">
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-600 block">সিস্টেম ট্র্যাকিং ও অডিট তথ্য:</span>
              <strong className="text-xs text-gray-900">
                ইন্টার-ডিপার্টমেন্টাল গেটকিপার ভেরিফিকেশন ইঞ্জিন লগ
              </strong>
            </div>

            <Link
              to="/audit"
              className="text-xs text-govt-green font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
            >
              <span>অডিট ট্রেইল এক্সপ্লোরারে দেখুন</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white p-2.5 rounded border border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-bold block font-bangla">কো-রিলেশন আইডি (Correlation ID):</span>
                <button
                  type="button"
                  onClick={() => copyText(result.correlationId, 'corrId')}
                  className="text-gray-400 hover:text-gray-700 cursor-pointer"
                  title="কপি করুন"
                >
                  {copiedId === 'corrId' ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                </button>
              </div>
              <strong className="text-xs font-mono text-gray-900 block mt-0.5 truncate">
                {result.correlationId || 'c855a3d6-dded-4e10-b303-1195239e56b2'}
              </strong>
              <span className="text-[10px] text-gray-500 font-bangla block mt-0.5">
                সিস্টেম ওয়াইড ডিস্ট্রিবিউটেড রিকোয়েস্ট ট্রেস কি
              </span>
            </div>

            <div className="bg-white p-2.5 rounded border border-gray-200">
              <span className="text-[10px] text-gray-500 font-bold block font-bangla">যাচাই সম্পাদনকারী সংস্থা:</span>
              <strong className="text-xs text-gray-800 font-bangla block mt-0.5">
                সাব-রেজিস্ট্রি অফিস ঢাকা সদর (নিবন্ধন অধিদপ্তর)
              </strong>
              <span className="text-[10px] text-gray-500 font-mono block mt-0.5">
                চ্যানেল: SECURE_INTRANET_API (TLS 1.3)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
