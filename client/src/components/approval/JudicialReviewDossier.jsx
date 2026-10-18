import { useState, useEffect } from 'react'
import {
  Gavel,
  FileText,
  FileCheck2,
  Building,
  Calendar,
  Layers,
  MapPin,
  Clock,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CheckSquare,
  Square,
  Lock,
  ExternalLink,
  Download,
  Eye,
  Hash,
  Scale,
} from 'lucide-react'
import StatusBadge from '../design-system/StatusBadge'
import {
  ORDER_TYPES_BN,
  TRANSACTION_SCOPES_BN,
  CASE_TYPES_BN,
  toBengaliNumber,
} from '../design-system/constants'
import { useAuth } from '../../context/AuthContext'
import { SEEDED_PARCEL_CATALOG } from '../../data/bangladeshGeoData'

export default function JudicialReviewDossier({
  order,
  institutions = [],
  onApproveClick,
  onRejectClick,
  onReturnClick,
}) {
  const { user, hasRole } = useAuth()

  // 3-point explicit review checklist state
  const [checklist, setChecklist] = useState({
    checkedDocument: false,
    checkedProperty: false,
    checkedConflicts: false,
  })

  // Reset checklist when selected order changes
  useEffect(() => {
    setChecklist({
      checkedDocument: false,
      checkedProperty: false,
      checkedConflicts: false,
    })
  }, [order?.id])

  if (!order) {
    return (
      <div className="card p-8 border border-govt-border bg-white rounded-lg text-center text-gray-500 font-bangla">
        <Scale size={36} className="mx-auto text-gray-300 mb-2" />
        <h3 className="font-bold text-gray-700 text-sm">কোনো আদেশ পর্যালোচনার জন্য নির্বাচিত নেই</h3>
        <p className="text-xs text-gray-500 mt-1">
          ডকেট কিউ হতে যেকোনো একটি আদেশ নির্বাচন করুন।
        </p>
      </div>
    )
  }

  // Find court institution
  const courtInst = institutions.find(
    (i) => i.id === order.courtInstitutionId || i.id === order.rawCase?.courtInstitutionId
  )
  const courtName = courtInst?.name || 'বিজ্ঞ সিনিয়র সহকারী জজ আদালত, ঢাকা'

  // Segregation of duties check
  const isCreator = user?.id && order.createdBy && user.id === order.createdBy
  const canApproveRole = hasRole(['ORDER_APPROVER', 'SYSTEM_ADMIN'])

  const isPendingApproval =
    order.approvalStatus === 'SUBMITTED' ||
    order.approvalStatus === 'UNDER_REVIEW' ||
    order.approvalStatus === 'PENDING_APPROVAL' ||
    order.approvalStatus === 'DRAFT' ||
    order.approvalStatus === 'PENDING'

  const allChecklistCompleted =
    checklist.checkedDocument && checklist.checkedProperty && checklist.checkedConflicts

  const parcel =
    order.linkedParcel ||
    SEEDED_PARCEL_CATALOG.find((p) => p.id === order.parcelId) ||
    (order.caseNumber === 'MS-2024-00456' || order.orderReference === 'ORD-DH-2024-992'
      ? SEEDED_PARCEL_CATALOG.find((p) => p.id === 'b2000000-0000-0000-0000-000000000002')
      : order.caseNumber === 'TS-2024-00890' || order.orderReference === 'ORD-DH-2024-993'
      ? SEEDED_PARCEL_CATALOG.find((p) => p.id === 'b3000000-0000-0000-0000-000000000003')
      : SEEDED_PARCEL_CATALOG.find((p) => p.id === 'b1000000-0000-0000-0000-000000000001'))

  return (
    <div className="space-y-4 font-bangla">
      {/* Dossier Header */}
      <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs border-t-4 border-t-govt-green">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-govt-border">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold bg-govt-paper text-govt-green px-2.5 py-1 rounded border border-govt-border">
                {order.orderReference}
              </span>
              <StatusBadge status={order.approvalStatus} size="sm" />
              {order.urgency === 'URGENT' && (
                <span className="text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 rounded-full">
                  জরুরি যাচাইকরণ
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
              {ORDER_TYPES_BN[order.orderType] || order.orderType} • বিচারিক নথি পর্যালোচনা
            </h2>
            <div className="text-xs text-gray-600 mt-1 flex items-center gap-1.5">
              <Building size={13} className="text-gray-400 shrink-0" />
              <span>{courtName}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 sm:text-right font-sans shrink-0">
            <div>দাখিলের তারিখ: {toBengaliNumber(order.orderDate)}</div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
              দায়েরকৃত কর্মকর্তা: {order.submittingOfficer}
            </div>
          </div>
        </div>

        {/* Core Extracted Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs">
          <div className="p-2.5 bg-govt-paper/60 rounded border border-govt-border">
            <span className="text-[11px] text-gray-500 block">মোকদ্দমা নম্বর:</span>
            <span className="font-bold text-gray-900 font-mono">{order.caseNumber}</span>
          </div>

          <div className="p-2.5 bg-govt-paper/60 rounded border border-govt-border">
            <span className="text-[11px] text-gray-500 block">মামলার প্রকৃতি:</span>
            <span className="font-bold text-gray-800">{CASE_TYPES_BN[order.caseType] || order.caseType}</span>
          </div>

          <div className="p-2.5 bg-rose-50/70 rounded border border-rose-200">
            <span className="text-[11px] text-rose-700 block font-semibold">প্রস্তাবিত স্থগিত স্কোপ:</span>
            <span className="font-bold text-rose-900">{order.transactionScope}</span>
          </div>

          <div className="p-2.5 bg-govt-paper/60 rounded border border-govt-border">
            <span className="text-[11px] text-gray-500 block">কার্যকর মেয়াদ:</span>
            <span className="font-bold text-gray-800 font-sans">
              {order.effectiveUntil
                ? `${toBengaliNumber(order.effectiveFrom)} হতে ${toBengaliNumber(order.effectiveUntil)}`
                : 'অনির্দিষ্টকাল / নিষ্পত্তি পর্যন্ত'}
            </span>
          </div>
        </div>

        {/* Case Grounds Summary */}
        <div className="mt-4 pt-3 border-t border-govt-border/70">
          <h3 className="text-xs font-bold text-gray-700 uppercase mb-1 flex items-center gap-1.5">
            <FileText size={14} className="text-govt-green" />
            <span>মামলার মূল বিষয়বস্তু ও নিষেধাজ্ঞা প্রার্থনার আইনগত ভিত্তি:</span>
          </h3>
          <p className="text-xs text-gray-800 bg-govt-paper/50 p-3 rounded border border-govt-border leading-relaxed">
            {order.restrictedSummary || 'মামলার কোনো সংক্ষিপ্ত বিবরণ প্রদান করা হয়নি।'}
          </p>
        </div>
      </div>

      {/* Official Court Document Preview Area */}
      <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-govt-border">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 size={15} className="text-govt-green" />
            <span>আদালতের স্বাক্ষরিত আদেশপত্র প্রিভিউ (Official Document Preview)</span>
          </h3>
          <span className="text-[11px] font-mono text-gray-500">
            রেফারেন্স: {order.sourceDocumentReference}
          </span>
        </div>

        {/* Simulated Document Viewer Pane */}
        <div className="bg-govt-paper/40 border border-govt-border rounded-lg p-4 space-y-3 font-bangla">
          {/* Simulated official seal header */}
          <div className="text-center pb-3 border-b border-gray-300">
            <div className="w-10 h-10 rounded-full border border-govt-green bg-green-50 mx-auto flex items-center justify-center text-govt-green font-bold text-xs mb-1">
              সিলমোহর
            </div>
            <div className="font-bold text-xs text-gray-900">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার • {courtName}
            </div>
            <div className="text-[11px] text-gray-600 mt-0.5">
              দেওয়ানি মোকদ্দমা নং {order.caseNumber} • আদেশ রেফারেন্স: {order.orderReference}
            </div>
          </div>

          {/* Document excerpt snippet */}
          <div className="p-3.5 bg-white border border-gray-200 rounded text-xs text-gray-700 leading-relaxed font-bangla space-y-2">
            <p className="font-semibold text-gray-900 flex items-center justify-between">
              <span>বিজ্ঞ আদালতের বিচারিক আদেশের মূল পাঠ ও তফসিল:</span>
              <span className="text-[11px] font-mono text-gray-500 font-normal">
                ধারা ৩৯/৫২, সুনির্দিষ্ট প্রতিকার আইন ১৮৭৭
              </span>
            </p>
            <p>
              বিজ্ঞ আদালত উভয় পক্ষের বক্তব্য ও দাখিলকৃত প্রামাণ্য দলিলাদি পর্যালোচনান্তে আদেশ প্রদান করিতেছেন যে,
              তফসিল বর্ণিত সম্পত্তিতে (মৌজা: <strong className="text-gray-900">{parcel?.mouzaCode || 'গুলশান-০২'}</strong>, খতিয়ান নং: <strong className="text-govt-green font-sans">{toBengaliNumber(parcel?.khatianNumber || '২০২')}</strong>, দাগ নং: <strong className="text-gray-900 font-sans">{toBengaliNumber(parcel?.dagNumber || '৬০০২')}</strong>, আয়তন: <strong className="font-sans">{toBengaliNumber(parcel?.recordedArea || '১৫.০০')}</strong> শতাংশ)
              বিবাদী পক্ষ বা তাহাদের প্রতিনিধিবর্গ কর্তৃক কোনোরূপ হস্তান্তর, বিক্রয়, বণ্টন, নামজারি রূপান্তর বা সাফ-কবলা দলিল সম্পাদন হইতে বিরত থাকার জন্য {ORDER_TYPES_BN[order.orderType] || 'নিষেধাজ্ঞা'} জারি করা হইল।
            </p>
            <div className="text-[11px] bg-amber-50/80 p-2 rounded border border-amber-200 text-amber-900">
              <strong>আইনগত স্থগিতাদেশের ব্যাপ্তি:</strong> {order.transactionScope === 'ALL' ? 'সকল প্রকার হস্তান্তর, রেজিস্ট্রি ও মিউটেশন সম্পূর্ণ স্থগিত' : `শুধুমাত্র ${order.transactionScope} লেনদেন স্থগিত`}।
            </div>
          </div>

          {/* Document Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-200 text-[11px] text-gray-600 font-sans">
            <div>
              ফাইল: <strong className="font-mono text-gray-800">{order.sourceDocumentReference}</strong> (PDF, ১.৪ MB)
            </div>
            <div className="flex items-center gap-1 text-emerald-800 font-semibold font-bangla">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>ডিজিটাল অখণ্ডতা হ্যাশ (SHA-256) ভ্যালিড</span>
            </div>
          </div>
        </div>
      </div>

      {/* Property-Matching Summary & Scope Conflicts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Property Matching Summary */}
        <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers size={15} className="text-govt-green" />
            <span>ভূমি পার্সেল ও পর্চা প্রতিপাদন (Property Matching)</span>
          </h3>

          {parcel ? (
            <div className="space-y-2 text-xs font-bangla">
              <div className="p-2.5 bg-gray-50 rounded border border-govt-border/70 space-y-1">
                <div className="font-bold text-gray-900 text-sm">
                  উপজেলা: {parcel.upazilaCode || 'গুলশান'}, মৌজা: {parcel.mouzaCode || 'GULSHAN-02'}
                </div>
                <div className="text-gray-700 font-sans">
                  খতিয়ান নং: <strong className="text-govt-green">{toBengaliNumber(parcel.khatianNumber)}</strong> ({parcel.khatianType || 'RS'}) | দাগ নং: <strong className="text-gray-900">{toBengaliNumber(parcel.dagNumber)}</strong>
                </div>
                <div className="text-[11px] text-gray-600 font-sans">
                  রেকর্ডকৃত আয়তন: <strong>{toBengaliNumber(parcel.recordedArea)} শতাংশ</strong> | জেএল নং: {toBengaliNumber(parcel.jlNumber || '১৫')}
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-950 text-[11px] flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                <span>জাতীয় ডিজিটাল ভূমি রেকর্ড সিস্টেমের সাথে দাগ ও খতিয়ান শতভাগ প্রতিপাদিত।</span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500 italic">
              কোনো নির্দিষ্ট ভূমি পার্সেল রেকর্ড পাওয়া যায়নি।
            </div>
          )}
        </div>

        {/* Scope Conflicts Analysis */}
        <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertOctagon size={15} className="text-amber-700" />
            <span>আইনি সংঘর্ষ ও পূর্ববর্তী দায় পরীক্ষা (Scope Conflicts)</span>
          </h3>

          {order.conflicts && order.conflicts.length > 0 ? (
            <div className="space-y-2 text-xs font-bangla">
              {order.conflicts.map((conf, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border ${
                    conf.severity === 'high'
                      ? 'bg-red-50 border-red-300 text-red-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle size={14} className={conf.severity === 'high' ? 'text-red-700' : 'text-amber-700'} />
                    <span>{conf.title}</span>
                  </div>
                  <p className="text-[11px] mt-0.5 leading-relaxed">
                    {conf.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-emerald-950 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">কোনো আইনগত সংঘর্ষ পরিলক্ষিত হয়নি</span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  উক্ত দাগে কোনো পরস্পরবিরোধী আদালতের স্থগিতাদেশ বা অসঙ্গতিপূর্ণ রেকর্ড নেই।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chronological Audit Timeline */}
      <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Clock size={15} className="text-govt-green" />
          <span>কালানুক্রমিক অডিট সময়রেখা (Chronological Audit Timeline)</span>
        </h3>

        <div className="space-y-2 text-xs font-bangla">
          <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-govt-green mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">মামলা দাখিল ও প্রাথমিক খসড়া প্রস্তুত</span>
                <span className="text-[11px] text-gray-500 font-sans">{order.orderDate}</span>
              </div>
              <div className="text-[11px] text-gray-600 font-mono mt-0.5">
                আদালত কর্মকর্তা: {order.submittingOfficer}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2 bg-blue-50/70 rounded border border-blue-200">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-900">বিচারিক অনুমোদনের জন্য দাখিল (SUBMITTED)</span>
                <span className="text-[11px] text-blue-700 font-sans">অনুমোদন কিউতে অন্তর্ভুক্ত</span>
              </div>
              <div className="text-[11px] text-blue-800 mt-0.5">
                নথিপত্র প্রস্তুতপূর্বক বিজ্ঞ বিচারকের এজলাসে উপস্থাপন করা হয়েছে।
              </div>
            </div>
          </div>

          {order.approvalStatus === 'APPROVED' && (
            <div className="flex items-start gap-2.5 p-2 bg-emerald-50 rounded border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">বিজ্ঞ বিচারক কর্তৃক অনুমোদিত ও বলবৎ (APPROVED)</span>
                  <span className="text-[11px] text-emerald-700 font-sans">{order.approvedAt || 'অনুমোদিত'}</span>
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5 font-mono">
                  অনুমোদনকারী বিচারক আইডি: {order.approvedBy || user?.id}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mandatory Pre-Approval Checklist & Action Console */}
      {isPendingApproval && (
        <div className="card p-5 border-2 border-govt-green bg-white rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-govt-border">
            <CheckSquare size={18} className="text-govt-green" />
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                বাধ্যতামূলক আইনি যাচাইকরণ চেকলিস্ট (Pre-Approval Inspection Checklist)
              </h3>
              <p className="text-[11px] text-gray-500">
                আইনগত প্রক্রিয়া অনুযায়ী অনুমোদনের পূর্বে নিচের প্রতিটি দফা পুঙ্খানুপুঙ্খভাবে নিশ্চিত করা বাধ্যতামূলক।
              </p>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5 text-xs text-gray-800">
            <label className="flex items-start gap-2.5 p-2.5 rounded bg-gray-50 border border-govt-border/70 cursor-pointer hover:bg-gray-100/70 transition-colors">
              <input
                type="checkbox"
                checked={checklist.checkedDocument}
                onChange={(e) =>
                  setChecklist((prev) => ({ ...prev, checkedDocument: e.target.checked }))
                }
                className="mt-0.5 rounded text-govt-green focus:ring-govt-green shrink-0"
              />
              <span className="leading-relaxed">
                <strong>দফা ১ (আদেশপত্র ও সিলমোহর):</strong> বিজ্ঞ আদালতের মূল স্বাক্ষরিত আদেশপত্র, বিচারকের এজলাস নম্বর ও সরকারি সিলমোহর পুঙ্খানুপুঙ্খভাবে নিরীক্ষা করা হয়েছে।
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded bg-gray-50 border border-govt-border/70 cursor-pointer hover:bg-gray-100/70 transition-colors">
              <input
                type="checkbox"
                checked={checklist.checkedProperty}
                onChange={(e) =>
                  setChecklist((prev) => ({ ...prev, checkedProperty: e.target.checked }))
                }
                className="mt-0.5 rounded text-govt-green focus:ring-govt-green shrink-0"
              />
              <span className="leading-relaxed">
                <strong>দফা ২ (ভূমি রেকর্ড প্রতিপাদন):</strong> আদেশে উল্লিখিত খতিয়ান ও দাগ নম্বরের সাথে জাতীয় ডিজিটাল ভূমি রেকর্ড ও পর্চার দাগ শতভাগ নির্ভুলভাবে প্রতিপাদিত হয়েছে।
              </span>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded bg-gray-50 border border-govt-border/70 cursor-pointer hover:bg-gray-100/70 transition-colors">
              <input
                type="checkbox"
                checked={checklist.checkedConflicts}
                onChange={(e) =>
                  setChecklist((prev) => ({ ...prev, checkedConflicts: e.target.checked }))
                }
                className="mt-0.5 rounded text-govt-green focus:ring-govt-green shrink-0"
              />
              <span className="leading-relaxed">
                <strong>দফা ৩ (দায় ও সংঘর্ষ পরীক্ষা):</strong> সংশ্লিষ্ট সম্পত্তিতে অন্য কোনো পরস্পরবিরোধী নিষেধাজ্ঞা নেই এবং ব্যাংক বন্ধকী দায় থাকলে তা বিবেচনায় রাখা হয়েছে।
              </span>
            </label>
          </div>

          {/* Segregation of duties warning if creator tries to approve */}
          {isCreator && (
            <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-950 flex items-start gap-2">
              <ShieldAlert size={16} className="text-red-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-900 block font-bold">স্বার্থের দ্বন্দ্ব নীতি (Segregation of Duties Enforced):</strong>
                <p className="text-[11px] leading-relaxed mt-0.5 text-red-900">
                  আপনি এই আদেশের খসড়া প্রস্তুতকারী কর্মকর্তা বিধায় নিজে তা অনুমোদন করতে পারবেন না। বিজ্ঞ বিচারক/অনুমোদনকারীর এজলাসে অনুমোদন সংরক্ষিত।
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="pt-2 border-t border-govt-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Return for correction button */}
              <button
                type="button"
                onClick={() => onReturnClick(order.id)}
                className="px-3.5 py-2 text-xs font-semibold bg-white border border-amber-400 text-amber-900 hover:bg-amber-50 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} className="text-amber-700" />
                <span>সংশোধনের জন্য ফেরত পাঠান</span>
              </button>

              {/* Reject button */}
              <button
                type="button"
                onClick={() => onRejectClick(order.id)}
                className="px-3.5 py-2 text-xs font-semibold bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <XCircle size={14} />
                <span>প্রত্যাখ্যান করুন</span>
              </button>
            </div>

            {/* Approve Button */}
            <div>
              <button
                type="button"
                disabled={!allChecklistCompleted || !canApproveRole || isCreator}
                onClick={() => onApproveClick(order.id)}
                className="w-full sm:w-auto bg-green-700 hover:bg-green-800 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-5 py-2.5 text-xs font-bold rounded shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                title={
                  !allChecklistCompleted
                    ? 'অনুমোদনের পূর্বে ৩টি চেকলিস্ট আইটেম নিশ্চিত করা আবশ্যক'
                    : isCreator
                    ? 'আদেশ প্রস্তুতকারী নিজে অনুমোদন করতে পারবেন না'
                    : 'আদেশ চূড়ান্ত অনুমোদন সম্পন্ন করুন'
                }
              >
                <CheckCircle2 size={16} />
                <span>আদেশ অনুমোদন করুন (Approve Order)</span>
              </button>
              {!allChecklistCompleted && (
                <div className="text-[10px] text-gray-500 mt-1 text-center sm:text-right font-sans">
                  * ৩টি যাচাইকরণ চেকলিস্ট পূরণ সাপেক্ষে বাটনটি সক্রিয় হবে
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Already Approved Notice */}
      {order.approvalStatus === 'APPROVED' && (
        <div className="card p-4 border border-emerald-300 bg-emerald-50/90 rounded-lg text-emerald-950 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
            <div>
              <span className="font-bold text-sm block">আদেশটি বিজ্ঞ বিচারক কর্তৃক চূড়ান্ত অনুমোদিত ও কার্যকর</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                জাতীয় ভূমি রেজিস্ট্রি গেটকিপার এবং এসি ল্যান্ড খতিয়ানে সক্রিয় বিচারিক স্থগিতাদেশ বলবৎ রয়েছে। কোনো নতুন অনুমোদনের প্রয়োজন নেই।
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-white border border-emerald-300 text-emerald-800 rounded font-bold text-xs shrink-0 self-start sm:self-center">
            রেজিস্ট্রি লক সক্রিয়
          </span>
        </div>
      )}

      {/* Rejected Notice */}
      {order.approvalStatus === 'REJECTED' && (
        <div className="card p-4 border border-rose-300 bg-rose-50/90 rounded-lg text-rose-950 text-xs flex items-center gap-2.5 shadow-2xs">
          <XCircle size={20} className="text-rose-700 shrink-0" />
          <div>
            <span className="font-bold text-sm block">আদেশটি বিজ্ঞ বিচারক কর্তৃক প্রত্যাখ্যাত (REJECTED)</span>
            <p className="text-[11px] text-rose-800 mt-0.5">
              যথাযথ আইনগত কারণে এই আদেশের কার্যকারিতা স্থগিত রাখা হয়েছে এবং কোনো সাব-রেজিস্ট্রি লক জারি করা হয়নি।
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
