import {
  Gavel,
  Landmark,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  CheckCircle2,
  FileText,
  Calendar,
  Layers,
  Info,
  ExternalLink,
} from 'lucide-react'
import { toBengaliNumber } from '../design-system/constants'
import { Link } from 'react-router-dom'

const REASON_CODES_BN = {
  ACTIVE_COURT_INJUNCTION_OR_BLOCK: 'বিজ্ঞ আদালতের বৈধ স্থগিতাদেশ বা নিষেধাজ্ঞা বলবৎ রয়েছে',
  TRANSFER_PROHIBITED: 'উক্ত লেনদেন ও হস্তান্তরের ওপর আইনি নিষেধাজ্ঞা আরোপিত',
  ACTIVE_MORTGAGE_LIEN: 'আর্থিক প্রতিষ্ঠানের অনুকূলে সক্রিয় বন্ধক ও লিয়েন বিদ্যমান',
  BANK_NOC_REQUIRED: 'বাণিজ্যিক ব্যাংক হতে আনুষ্ঠানিক অনাপত্তি (NOC) বা দায়মুক্তি দাখিল আবশ্যক',
  PARCEL_NOT_FOUND_OR_AMBIGUOUS: 'ভূমি পার্সেল বা দাগের রেকর্ডে অস্পষ্টতা বিদ্যমান; সুনির্দিষ্ট শনাক্তকরণ সম্ভব হয়নি',
  NO_BLOCKING_RESTRICTIONS_FOUND: 'কোনো সক্রিয় আইনি বাধা, স্থগিতাদেশ বা অনিষ্পন্ন বন্ধক পাওয়া যায়নি',
}

export default function RestrictionBreakdownPanel({
  result,
  parcel,
  secondaryRisks = [],
  courtRestrictions = [],
  mortgageRecords = [],
}) {
  if (!result) return null

  // Collect all court restrictions
  const activeCourtRefs = result.restrictionReferences || []
  const hasCourtRestrictions = (result.activeRestrictionCount > 0) || (activeCourtRefs.length > 0) || (courtRestrictions.length > 0)

  // Collect all mortgage references
  const activeMortgageRefs = result.mortgageReferences || []
  const hasMortgages = (result.activeMortgageCount > 0) || (activeMortgageRefs.length > 0) || (mortgageRecords.length > 0)

  const totalRestrictionsCount = (result.activeRestrictionCount || 0) +
    (result.activeMortgageCount || 0) +
    secondaryRisks.length

  return (
    <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs space-y-5 font-bangla">
      <div className="border-b border-govt-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <Layers size={18} className="text-govt-green" />
            <span>আইনি বিধিনিষেধ ও আর্থিক দায়ের পূর্ণাঙ্গ বিবরণী (Multi-Risk Breakdown)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            আইনগত নিরাপত্তা নিশ্চিতে প্রাথমিক বাধার পাশাপাশি সকল গৌণ ঝুঁকি (Secondary Risks) প্রদর্শন করা হচ্ছে।
          </p>
        </div>
        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded font-semibold border border-govt-border self-start sm:self-auto font-sans">
          চিহ্নিত ঝুঁকি ও দায়: {toBengaliNumber(totalRestrictionsCount)} টি
        </span>
      </div>

      {/* Multiple Concurrent Risks Detected Banner */}
      {secondaryRisks.length > 0 && (
        <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded-lg text-amber-950 text-xs space-y-2 shadow-2xs">
          <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
            <AlertTriangle size={18} className="text-amber-700 shrink-0" />
            <span>বহুমাত্রিক আইনি ঝুঁকি সতর্কতা (Multiple Concurrent Restrictions Detected):</span>
          </div>
          <p className="text-xs leading-relaxed text-amber-900">
            উক্ত সম্পত্তিতে বিজ্ঞ আদালতের স্থগিতাদেশের পাশাপাশি বাণিজ্যিক ব্যাংক ও অন্যান্য সংস্থার বিধিনিষেধ বিদ্যমান। কোনো একক কারণে স্থগিতাদেশ কার্যকর থাকলেও পরবর্তী সকল দায় নিষ্পত্তি না করে দলিল সম্পাদন আইনত দণ্ডনীয়।
          </p>
          <div className="space-y-1.5 pt-1">
            {secondaryRisks.map((risk, idx) => (
              <div key={idx} className="bg-white/90 p-2.5 rounded border border-amber-300 text-xs flex items-start gap-2">
                <span className="font-bold text-amber-950 shrink-0">• {risk.title}:</span>
                <span className="text-amber-900 flex-1">{risk.details}</span>
                <span className="font-mono text-[11px] bg-amber-100 px-1.5 py-0.5 rounded text-amber-950 font-bold shrink-0">
                  {risk.reference}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 1: Court Orders & Injunctions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Gavel size={15} className="text-govt-green" />
            <span>১. বিজ্ঞ আদালতের আদেশ ও নিষেধাজ্ঞা (Matching Court Orders)</span>
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded font-bold font-sans ${hasCourtRestrictions ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {toBengaliNumber(result.activeRestrictionCount || (activeCourtRefs.length > 0 ? activeCourtRefs.length : 0))} টি সক্রিয়
          </span>
        </div>

        {hasCourtRestrictions ? (
          <div className="space-y-2.5">
            {(courtRestrictions.length > 0 ? courtRestrictions : activeCourtRefs).map((item, idx) => {
              const ref = typeof item === 'string' ? item : item.sourceReference
              const courtName = item.courtName || parcel?.courtOrder?.courtName || 'প্রথম যুগ্ম জেলা জজ আদালত, ঢাকা'
              const caseNo = item.caseNumber || parcel?.courtOrder?.caseNumber || 'OS-2024-00123'
              const effFrom = item.effectiveFrom || parcel?.courtOrder?.effectiveFrom || '২০২৪-০১-২০'
              const effUntil = item.effectiveUntil || parcel?.courtOrder?.effectiveUntil || '২০২৭-১২-৩১'
              const scopeArea = item.scopeArea || parcel?.recordedArea || '১০.৫০'
              const caseId = item.caseId || 'c1000000-0000-0000-0000-000000000001'

              return (
                <div
                  key={idx}
                  className="p-3.5 bg-red-50/70 border border-red-200 rounded-lg text-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-red-200/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-red-900 bg-white px-2 py-0.5 rounded border border-red-300">
                        {ref}
                      </span>
                      <span className="text-[10px] bg-red-700 text-white px-2 py-0.5 rounded font-bold">
                        সক্রিয় নিষেধাজ্ঞা (Active Injunction)
                      </span>
                    </div>

                    <Link
                      to={`/cases`}
                      className="text-[11px] text-red-900 font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>আদালতি নথি ও ডকেট দেখুন</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-800 font-sans">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block font-bangla">আদালত ও মামলা:</span>
                      <strong className="text-[11px] text-gray-900 font-bangla block mt-0.5">{courtName}</strong>
                      <span className="text-[10px] text-gray-600 font-mono">মামলা নং: {caseNo}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block font-bangla">কার্যকর সময়সীমা:</span>
                      <span className="text-[11px] text-gray-800 font-bangla block mt-0.5">
                        {effFrom} হতে {effUntil}
                      </span>
                      <span className="text-[10px] text-red-700 font-bold font-bangla">
                        স্থগিতাদেশের মেয়াদ বলবৎ
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block font-bangla">প্রযোজ্য দাগের পরিধি:</span>
                      <span className="text-[11px] text-gray-800 font-bangla block mt-0.5">
                        সম্পূর্ণ পার্সেল ({toBengaliNumber(scopeArea)} শতাংশ)
                      </span>
                      <span className="text-[10px] text-gray-600 font-bangla">
                        লেনদেনের আওতা: বিক্রয় ও সাফ-কবলা দলিল (SALE)
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2 font-sans">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span className="font-bangla">
              কোনো সক্রিয় বিচারিক স্থগিতাদেশ, দেওয়ানি মামলার ইনজাংশন বা আদালতের নিষেধাজ্ঞা রেকর্ডভুক্ত নেই।
            </span>
          </div>
        )}
      </div>

      {/* Section 2: Bank Mortgages & Encumbrances */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <Landmark size={15} className="text-govt-green" />
            <span>২. ব্যাংক বন্ধক ও আর্থিক প্রতিষ্ঠানের দায় (Mortgage Encumbrances)</span>
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded font-bold font-sans ${hasMortgages ? 'bg-amber-100 text-amber-900' : 'bg-green-100 text-green-800'}`}>
            {toBengaliNumber(result.activeMortgageCount || (activeMortgageRefs.length > 0 ? activeMortgageRefs.length : 0))} টি সক্রিয়
          </span>
        </div>

        {hasMortgages ? (
          <div className="space-y-2.5">
            {(mortgageRecords.length > 0 ? mortgageRecords : activeMortgageRefs).map((item, idx) => {
              const ref = typeof item === 'string' ? item : item.lenderReference
              const bankName = item.lenderName || parcel?.mortgage?.lenderName || 'ডেমো কমার্শিয়াল ব্যাংক পিএলসি'
              const effDate = item.effectiveFrom || parcel?.mortgage?.issueDate || '২০২৩-০৬-০১'
              const secArea = item.securedArea || parcel?.recordedArea || '১০.৫০'
              const status = item.status || 'ACTIVE'
              const isReleased = status === 'RELEASED'

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs space-y-2.5 ${
                    isReleased ? 'bg-gray-50 border-gray-200 text-gray-700' : 'bg-amber-50/70 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-amber-200/80">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-gray-300">
                        {ref}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        isReleased ? 'bg-green-700 text-white' : 'bg-amber-700 text-white'
                      }`}>
                        {isReleased ? 'দায়মুক্ত (Released)' : 'সক্রিয় ব্যাংক বন্ধক (Active Mortgage)'}
                      </span>
                    </div>

                    <Link
                      to={`/mortgages`}
                      className="text-[11px] text-amber-900 font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>বন্ধকী রেজিস্টার ও অনাপত্তি সনদ দেখুন</span>
                      <ExternalLink size={11} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block font-bangla">ঋণদাতা আর্থিক প্রতিষ্ঠান:</span>
                      <strong className="text-[11px] text-gray-900 font-bangla block mt-0.5">{bankName}</strong>
                      <span className="text-[10px] text-gray-600 font-bangla">হেড অফিস ও করপোরেট শাখা</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block font-bangla">নিবন্ধন তারিখ ও অবস্থা:</span>
                      <span className="text-[11px] text-gray-800 font-bangla block mt-0.5">
                        কার্যকর: {effDate}
                      </span>
                      <span className={`text-[10px] font-bold font-bangla ${isReleased ? 'text-green-700' : 'text-amber-800'}`}>
                        {isReleased ? 'ব্যাংক অনাপত্তি সনদ যাচাইকৃত' : 'মূল অনাপত্তি সনদ দাখিল আবশ্যক'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block font-bangla">বন্ধকীকৃত সম্পত্তির পরিমাণ:</span>
                      <span className="text-[11px] text-gray-800 font-bangla block mt-0.5">
                        সম্পূর্ণ অংশ ({toBengaliNumber(secArea)} শতাংশ)
                      </span>
                      <span className="text-[10px] text-gray-600 font-bangla">
                        দায়মুক্তি রেফারেন্স: {item.releaseReference || 'অনিষ্পন্ন'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center gap-2 font-sans">
            <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
            <span className="font-bangla">
              কোনো তফসিলি ব্যাংক বা আর্থিক প্রতিষ্ঠানের সক্রিয় বন্ধকী লিয়েন রেকর্ডভুক্ত নেই।
            </span>
          </div>
        )}
      </div>

      {/* Section 3: Reason Codes */}
      {result.reasonCodes && result.reasonCodes.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-2">
            কারণ নির্দেশক সিস্টেম কোডসমূহ (Authoritative Reason Codes):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {result.reasonCodes.map((code, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded border border-gray-200 bg-gray-50/70 text-xs flex items-start gap-2"
              >
                <AlertOctagon size={14} className="text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-bangla">
                    {REASON_CODES_BN[code] || code}
                  </strong>
                  <span className="font-mono text-[10px] text-gray-500 block mt-0.5">
                    কোড: {code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
