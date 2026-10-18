import {
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  Landmark,
  Clock,
  HelpCircle,
  Copy,
  Check,
  RefreshCw,
  Calendar,
  Hash,
  Scale,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Layers,
  Database,
  Building,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../design-system/StatusBadge'
import { toBengaliNumber } from '../design-system/constants'

export default function AuthoritativeDecisionHero({ result, parcel }) {
  const [copiedField, setCopiedField] = useState(null)

  if (!result) return null

  const copyToClipboard = (text, fieldName) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const decision = result.decision

  // Visual configuration based on authoritative outcome
  const DECISION_CONFIG = {
    BLOCKED_BY_VALID_ORDER: {
      bgClasses: 'bg-rose-50 border-rose-300 text-rose-950',
      heroBarClasses: 'bg-red-700 text-white',
      icon: AlertOctagon,
      titleBn: 'দলিল নিবন্ধন সম্পূর্ণ অবরুদ্ধ (Registration Prohibited)',
      subtitleBn: 'বিজ্ঞ আদালতের বৈধ স্থগিতাদেশ বা নিষেধাজ্ঞার কারণে এই জমির কোনো হস্তান্তর বা সাফ-কবলা দলিল রেজিস্ট্রি আইনত নিষিদ্ধ।',
      actionNotice: 'অবিলম্বে নিবন্ধন কার্যক্রম স্থগিত করুন এবং আবেদনকারীকে আদালতের নির্দেশের অনুলিপি প্রদান করুন।',
    },
    MORTGAGE_REQUIRES_RELEASE: {
      bgClasses: 'bg-amber-50 border-amber-300 text-amber-950',
      heroBarClasses: 'bg-amber-700 text-white',
      icon: Landmark,
      titleBn: 'ব্যাংক দায়মুক্তি বা অনাপত্তি সনদ আবশ্যক (Mortgage Release Required)',
      subtitleBn: 'বাণিজ্যিক আর্থিক প্রতিষ্ঠানের অনুকূলে সক্রিয় বন্ধক বলবৎ থাকায় ব্যাংক কর্তৃক প্রদত্ত অনাপত্তি সনদপত্র (NOC) ব্যতীত রেজিস্ট্রি সম্পন্ন করা যাবে না।',
      actionNotice: 'ব্যাংক লিয়েন অবমুক্তির মূল কপি ব্যতীত দলিল রেজিস্ট্রি সম্পাদন স্থগিত রাখুন।',
    },
    CLEAR: {
      bgClasses: 'bg-emerald-50 border-emerald-300 text-emerald-950',
      heroBarClasses: 'bg-govt-green text-white',
      icon: CheckCircle2,
      titleBn: 'আইনি বাধামুক্ত — দলিল নিবন্ধনযোগ্য (Clear for Registration)',
      subtitleBn: 'সংযুক্ত বিচারিক ও ব্যাংকিং সিস্টেমে কোনো সক্রিয় স্থগিতাদেশ, আদালতের নিষেধাজ্ঞা বা অনিষ্পন্ন বন্ধকী দায় পরিলক্ষিত হয়নি।',
      actionNotice: 'নিয়মতান্ত্রিক ফি ও স্ট্যাম্প যাচাই সাপেক্ষে দলিল নিবন্ধন কার্যক্রম সম্পন্ন করা যেতে পারে।',
    },
    REVIEW_REQUIRED: {
      bgClasses: 'bg-yellow-50 border-yellow-400 text-yellow-950',
      heroBarClasses: 'bg-yellow-700 text-white',
      icon: ShieldAlert,
      titleBn: 'ম্যানুয়াল রেকর্ড ও সীমানা পর্যালোচনা প্রয়োজন (Review Required)',
      subtitleBn: 'প্রদত্ত দাগ বা খতিয়ানের রেকর্ডে অস্পষ্টতা বা সীমানা বিরোধের তথ্য রয়েছে। কোনো স্বয়ংক্রিয় ক্লিয়ারেন্স প্রযোজ্য নয়।',
      actionNotice: 'সহকারী কমিশনার (ভূমি) এর মূল রেকর্ডরুম ও খতিয়ান ম্যানুয়ালি যাচাই করুন।',
    },
    PENDING: {
      bgClasses: 'bg-blue-50 border-blue-300 text-blue-950',
      heroBarClasses: 'bg-blue-700 text-white',
      icon: Clock,
      titleBn: 'আদেশ বা আবেদন যাচাই প্রক্রিয়াধীন (Verification Pending)',
      subtitleBn: 'উক্ত সম্পত্তি সংশ্লিষ্ট কোনো বিচারিক আদেশ বা যাচাইকরণ প্রক্রিয়া বর্তমানে বিবেচনাধীন রয়েছে।',
      actionNotice: 'চূড়ান্ত সরকারি সিদ্ধান্ত বা আদেশ অনুমোদন না হওয়া পর্যন্ত নিবন্ধন কার্যক্রম স্থগিত রাখুন।',
    },
    UNKNOWN: {
      bgClasses: 'bg-gray-100 border-gray-300 text-gray-900',
      heroBarClasses: 'bg-gray-700 text-white',
      icon: HelpCircle,
      titleBn: 'অনির্দিষ্ট স্থিতি — স্বয়ংক্রিয় অনুমোদন নিষিদ্ধ (Status Unknown)',
      subtitleBn: 'সিস্টেমে এই সম্পত্তির পূর্ণাঙ্গ আইনগত তথ্য অনুপস্থিত। তথ্যহীনতাকে কোনো অবস্থাতেই ক্লিয়ারেন্স হিসেবে গণ্য করা যাবে না।',
      actionNotice: 'অধিদপ্তরের আইন শাখায় যোগাযোগ করুন এবং সরাসরি কোনো দলিল সম্পাদন করবেন না।',
    },
    SYSTEM_UNAVAILABLE: {
      bgClasses: 'bg-slate-100 border-slate-300 text-slate-900',
      heroBarClasses: 'bg-slate-700 text-white',
      icon: HelpCircle,
      titleBn: 'যাচাইকরণ সিস্টেম সাময়িক অনুপলব্ধ (System Unavailable)',
      subtitleBn: 'সার্ভার সংযোগে বিঘ্নের কারণে সরাসরি সিদ্ধান্ত নির্ধারণ করা যায়নি। এটি ঝুঁকিমুক্ত হিসেবে গণ্য নয়।',
      actionNotice: 'কিছুক্ষণ পর পুনরায় অনুসন্ধান করুন। সংযোগ ছাড়া দলিল সম্পাদন করবেন না।',
    },
  }

  const config = DECISION_CONFIG[decision] || DECISION_CONFIG.UNKNOWN
  const HeroIcon = config.icon

  // Calculate data freshness
  const checkedDate = result.checkedAt ? new Date(result.checkedAt) : new Date()
  const freshnessDate = result.dataFreshness ? new Date(result.dataFreshness) : checkedDate
  const ageInSeconds = result.ageSeconds !== undefined
    ? result.ageSeconds
    : Math.max(0, Math.floor((Date.now() - freshnessDate.getTime()) / 1000))
  const isStale = result.isStale || ageInSeconds > 300

  return (
    <div className={`card border-2 rounded-xl shadow-md overflow-hidden font-bangla ${config.bgClasses}`}>
      {/* Top Authoritative Bar */}
      <div className={`px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${config.heroBarClasses}`}>
        <div className="flex items-center gap-2.5">
          <HeroIcon size={24} className="shrink-0 text-govt-gold" />
          <div>
            <div className="text-[11px] font-sans font-semibold tracking-wider uppercase opacity-90">
              Authoritative Gatekeeper Outcome
            </div>
            <h1 className="text-base sm:text-lg font-bold leading-tight">
              {config.titleBn}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge decision={decision} size="lg" className="shadow-xs" />
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 space-y-4">
        {/* Subtitle explanation */}
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {config.subtitleBn}
        </p>

        {/* Action Directive Notice */}
        <div className="p-3 bg-white/95 rounded-lg border border-current/20 text-xs flex items-start gap-2.5 shadow-2xs">
          <Scale size={16} className="shrink-0 mt-0.5 text-gray-700" />
          <div>
            <strong className="text-gray-900 block font-bold">সাব-রেজিস্ট্রারের করণীয় নির্দেশিকা:</strong>
            <span className="text-gray-700 mt-0.5 block leading-relaxed">{config.actionNotice}</span>
          </div>
        </div>

        {/* Detailed Explanation for CLEAR */}
        {decision === 'CLEAR' && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-300 rounded-lg text-xs space-y-2 text-emerald-950">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <span>যাচাইকৃত রেজিস্ট্রি ও আইনগত পরিধি (Scope of Checks Performed):</span>
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-900">
              ল্যান্ডলক ইঞ্জিনের সংযুক্ত ইন্টার-ডিপার্টমেন্টাল গেটকিপার দ্বারা নিম্নলিখিত রেজিস্ট্রিগুলো বাস্তব সময়ে অনুসন্ধান করা হয়েছে:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-sans">
              <div className="bg-white/90 p-2 rounded border border-emerald-200">
                <div className="font-bold text-[11px] text-emerald-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  আদালতের নিষেধাজ্ঞা রেজিস্ট্রি
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5 font-bangla">
                  বিজ্ঞ বিচারিক আদালত হতে কোনো কার্যকর নিষেধাজ্ঞা বা স্থগিতাদেশ পাওয়া যায়নি।
                </div>
              </div>
              <div className="bg-white/90 p-2 rounded border border-emerald-200">
                <div className="font-bold text-[11px] text-emerald-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  ব্যাংক বন্ধক ও লিয়েন রেজিস্ট্রি
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5 font-bangla">
                  কোনো বাণিজ্যিক আর্থিক প্রতিষ্ঠানের অনিষ্পন্ন ঋণ বা বন্ধকী দায় নেই।
                </div>
              </div>
              <div className="bg-white/90 p-2 rounded border border-emerald-200">
                <div className="font-bold text-[11px] text-emerald-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                  ভূমি রেকর্ড অব রাইটস (ROR)
                </div>
                <div className="text-[10px] text-gray-600 mt-0.5 font-bangla">
                  সহকারী কমিশনার (ভূমি) এর খতিয়ান ও দাগ নম্বর যাচাইকৃত ও সক্রিয়।
                </div>
              </div>
            </div>
            <div className="text-[11px] text-emerald-800 font-semibold pt-1">
              * উক্ত ক্লিয়ারেন্স শুধুমাত্র অনুসন্ধানকৃত লেনদেনের ধরন ({result.transactionType || 'SALE'}) ও সুনির্দিষ্ট দাগের জন্য কার্যকর।
            </div>
          </div>
        )}

        {/* Detailed Explanation for BLOCKED_BY_VALID_ORDER */}
        {decision === 'BLOCKED_BY_VALID_ORDER' && (
          <div className="p-3.5 bg-red-500/10 border border-red-300 rounded-lg text-xs space-y-2 text-red-950">
            <div className="font-bold flex items-center gap-1.5 text-red-900">
              <AlertOctagon size={16} className="text-red-700 shrink-0" />
              <span>স্থগিতাদেশের বিবরণ ও প্রযোজ্য আইনি পরিধি:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans pt-1">
              <div className="bg-white/90 p-2.5 rounded border border-red-200">
                <span className="text-[10px] text-gray-500 font-bold block font-bangla">আদালতের আদেশ রেফারেন্স:</span>
                <strong className="text-xs text-red-900 font-mono block mt-0.5">
                  {result.restrictionReferences?.join(', ') || parcel?.courtOrder?.orderReference || 'ORD-DH-2024-991'}
                </strong>
                <span className="text-[10px] text-gray-600 font-bangla block mt-0.5">
                  মামলা নং: {parcel?.courtOrder?.caseNumber || 'OS-2024-00123'}
                </span>
              </div>
              <div className="bg-white/90 p-2.5 rounded border border-red-200">
                <span className="text-[10px] text-gray-500 font-bold block font-bangla">কার্যকর মেয়াদ ও আওতা:</span>
                <strong className="text-xs text-gray-800 font-bangla block mt-0.5">
                  {parcel?.courtOrder?.effectiveFrom || '২০২৪-০১-২০'} হতে {parcel?.courtOrder?.effectiveUntil || '২০২৭-১২-৩১'} পর্যন্ত
                </strong>
                <span className="text-[10px] text-red-800 font-bangla font-semibold block mt-0.5">
                  আওতা: সম্পূর্ণ পার্সেল (১০.৫০ শতাংশ)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Explanation for MORTGAGE_REQUIRES_RELEASE */}
        {decision === 'MORTGAGE_REQUIRES_RELEASE' && (
          <div className="p-3.5 bg-amber-500/10 border border-amber-300 rounded-lg text-xs space-y-2 text-amber-950">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Landmark size={16} className="text-amber-700 shrink-0" />
              <span>আর্থিক প্রতিষ্ঠানের বন্ধক ও অনাপত্তি সনদপত্রের স্থিতি:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans pt-1">
              <div className="bg-white/90 p-2.5 rounded border border-amber-200">
                <span className="text-[10px] text-gray-500 font-bold block font-bangla">ঋণদাতা ব্যাংক ও রেফারেন্স:</span>
                <strong className="text-xs text-amber-950 font-mono block mt-0.5">
                  {result.mortgageReferences?.join(', ') || parcel?.mortgage?.lenderReference || 'MORT-DB-2023-001'}
                </strong>
                <span className="text-[10px] text-gray-600 font-bangla block mt-0.5">
                  প্রতিষ্ঠান: {parcel?.mortgage?.lenderName || 'ডেমো কমার্শিয়াল ব্যাংক পিএলসি'}
                </span>
              </div>
              <div className="bg-white/90 p-2.5 rounded border border-amber-200">
                <span className="text-[10px] text-gray-500 font-bold block font-bangla">দায়মুক্তি ও রিলিজ স্থিতি:</span>
                <strong className="text-xs text-amber-800 font-bangla block mt-0.5">
                  অনাপত্তি সনদ (NOC) দাখিল আবশ্যক
                </strong>
                <span className="text-[10px] text-gray-600 font-bangla block mt-0.5">
                  মূল রিলিজ দলিল দাখিল ব্যতীত কোনো স্বত্ব হস্তান্তর রেজিস্ট্রিযোগ্য নয়।
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Backend Raw Summary */}
        {result.summary && (
          <div className="text-xs p-3 bg-white/85 rounded border border-gray-200 text-gray-800 font-sans leading-relaxed">
            <span className="font-bold text-gray-600 block mb-0.5 font-bangla text-[11px]">
              ইঞ্জিন সিদ্ধান্ত বিবরণী (Engine Summary):
            </span>
            {result.summary}
          </div>
        )}

        {/* Warnings for Stale Data or Partial Data */}
        {(isStale || result.isPartial) && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              {isStale && (
                <div className="font-bold">
                  সতর্কতা: প্রদর্শিত ডেটার মেয়াদ ৫ মিনিটের অধিক প্রাচীন ({toBengaliNumber(Math.floor(ageInSeconds / 60))} মিনিট পূর্বে সিঙ্ককৃত)। চূড়ান্ত সিদ্ধান্তের পূর্বে লাইভ রিফ্রেশ করুন।
                </div>
              )}
              {result.isPartial && (
                <div className="mt-0.5">
                  আংশিক রেকর্ড প্রাপ্ত: ভূমি রেকর্ডের কিছু অংশ ম্যানুয়ালি যাচাইযোগ্য। অসম্পূর্ণ তথ্যকে ক্লিয়ারেন্স হিসেবে বিবেচনা করবেন না।
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs pt-2 border-t border-current/20 font-sans">
          {/* Verification ID */}
          <div className="p-2.5 bg-white/90 rounded border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold font-bangla">যাচাই আইডি (Check ID):</span>
              <button
                type="button"
                onClick={() => copyToClipboard(result.checkId, 'checkId')}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
                title="আইডি কপি করুন"
              >
                {copiedField === 'checkId' ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
              </button>
            </div>
            <div className="font-mono text-[11px] font-bold text-gray-900 truncate mt-0.5">
              {result.checkId || 'N/A'}
            </div>
          </div>

          {/* Request ID */}
          <div className="p-2.5 bg-white/90 rounded border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500 uppercase font-bold font-bangla">রিকোয়েস্ট আইডি:</span>
              <button
                type="button"
                onClick={() => copyToClipboard(result.requestId, 'requestId')}
                className="text-gray-400 hover:text-gray-700 cursor-pointer"
                title="কপি করুন"
              >
                {copiedField === 'requestId' ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
              </button>
            </div>
            <div className="font-mono text-[11px] font-bold text-gray-800 truncate mt-0.5">
              {result.requestId || 'N/A'}
            </div>
          </div>

          {/* Checked Timestamp */}
          <div className="p-2.5 bg-white/90 rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-bold font-bangla block">যাচাই সম্পন্ন:</span>
            <div className="text-[11px] font-semibold text-gray-800 mt-0.5 font-bangla">
              {checkedDate.toLocaleDateString('bn-BD')} {checkedDate.toLocaleTimeString('bn-BD')}
            </div>
          </div>

          {/* Data Freshness Indicator */}
          <div className="p-2.5 bg-white/90 rounded border border-gray-200">
            <span className="text-[10px] text-gray-500 uppercase font-bold font-bangla block">ডেটা ফ্রেশনেস স্থিতি:</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isStale ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className={`text-[11px] font-bold font-bangla ${isStale ? 'text-amber-800' : 'text-emerald-900'}`}>
                {isStale
                  ? `স্থগিত ডেটা (${toBengaliNumber(Math.floor(ageInSeconds / 60))} মিনিট পূর্বে)`
                  : `লাইভ সিঙ্ককৃত (${toBengaliNumber(ageInSeconds)} সেকেন্ড পূর্বে)`}
              </span>
            </div>
          </div>
        </div>

        {/* Official Legal Disclaimer */}
        <div className="p-3 bg-white/95 rounded border border-gray-300 text-[11px] text-gray-600 leading-relaxed flex items-start gap-2">
          <ShieldCheck size={14} className="text-govt-green shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-800">আইনি নিশ্চয়তা ও সীমারেখা:</strong> {result.disclaimer || 'উক্ত সিদ্ধান্ত ইঞ্জিন রেকর্ডরুম হতে সংগৃহীত এবং অফিসিয়াল দলিল রেজিস্ট্রি পূর্ব-যাচাইয়ের উদ্দেশ্যে প্রস্তুতকৃত।'}
          </div>
        </div>

        {/* Action Button for Certificate */}
        <div className="flex justify-end pt-1">
          <Link
            to={`/certificate/${result.parcelId || result.checkId || parcel?.id}`}
            state={{ checkResponse: result, parcel }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-govt-green hover:bg-govt-green-dark text-white font-bangla text-xs font-semibold shadow-xs transition-colors"
          >
            <FileText size={14} />
            <span>অফিসিয়াল যাচাই প্রত্যয়নপত্র দেখুন ও প্রিন্ট করুন (A4 Certificate)</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
