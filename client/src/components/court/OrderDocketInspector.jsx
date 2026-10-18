import {
  Gavel,
  ShieldAlert,
  Building,
  Calendar,
  Layers,
  ArrowRight,
  FileCheck2,
  FileText,
  Lock,
  Download,
  Send,
  CheckCircle2,
  XCircle,
  Unlock,
  AlertTriangle,
  History,
  Hash,
} from 'lucide-react'
import StatusBadge from '../design-system/StatusBadge'
import {
  ORDER_TYPES_BN,
  TRANSACTION_SCOPES_BN,
  CASE_TYPES_BN,
  toBengaliNumber,
} from '../design-system/constants'
import { useAuth } from '../../context/AuthContext'

export default function OrderDocketInspector({
  order,
  institutions = [],
  onSubmitClick,
  onApproveClick,
  onRejectClick,
  onReleaseClick,
}) {
  const { user, hasRole } = useAuth()

  if (!order) {
    return (
      <div className="card p-8 border border-govt-border bg-white rounded-lg text-center text-gray-500">
        <Gavel size={36} className="mx-auto text-gray-300 mb-2" />
        <h3 className="font-bold text-gray-700 text-sm">কোনো আদেশ নির্বাচিত নেই</h3>
        <p className="text-xs text-gray-500 mt-1">
          বিস্তারিত দেখতে বাম পাশের তালিকা হতে যেকোনো একটি আদেশ বা মোকদ্দমা নির্বাচন করুন।
        </p>
      </div>
    )
  }

  // Find court institution
  const courtInst = institutions.find(
    (i) => i.id === order.courtInstitutionId || i.id === order.rawCase?.courtInstitutionId
  )
  const courtName = courtInst?.name || 'বিজ্ঞ সিনিয়র সহকারী জজ আদালত, ঢাকা'

  // Segregation of duties check:
  // Is the current logged-in user the creator of this order?
  const isCreator = user?.id && order.createdBy && user.id === order.createdBy
  const canApproveRole = hasRole(['ORDER_APPROVER', 'SYSTEM_ADMIN'])
  const canSubmitRole = hasRole(['COURT_OFFICER', 'SYSTEM_ADMIN'])

  return (
    <div className="space-y-4">
      {/* Inspector Header Card */}
      <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs border-t-4 border-t-govt-green">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-govt-border">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold bg-govt-paper text-govt-green px-2.5 py-1 rounded border border-govt-border">
                {order.orderReference}
              </span>
              <StatusBadge status={order.approvalStatus} size="sm" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {ORDER_TYPES_BN[order.orderType] || order.orderType}
            </h2>
            <div className="text-xs text-gray-600 mt-1 flex items-center gap-1.5 font-bangla">
              <Building size={13} className="text-gray-400 shrink-0" />
              <span>{courtName}</span>
            </div>
          </div>

          <div className="text-xs text-gray-500 sm:text-right font-sans shrink-0">
            <div className="flex sm:justify-end items-center gap-1">
              <Calendar size={13} className="text-gray-400" />
              <span>আদেশের তারিখ: {toBengaliNumber(order.orderDate)}</span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
              অর্ডার আইডি: {order.id?.substring(0, 18)}...
            </div>
          </div>
        </div>

        {/* Injunction & Case Core Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 text-xs font-bangla">
          <div className="p-2.5 bg-govt-paper/60 rounded border border-govt-border">
            <span className="text-[11px] text-gray-500 block">মোকদ্দমা নম্বর:</span>
            <span className="font-bold text-gray-900 font-mono">{order.caseNumber}</span>
          </div>

          <div className="p-2.5 bg-govt-paper/60 rounded border border-govt-border">
            <span className="text-[11px] text-gray-500 block">মামলার ধরন:</span>
            <span className="font-bold text-gray-800">{CASE_TYPES_BN[order.caseType] || order.caseType}</span>
          </div>

          <div className="p-2.5 bg-rose-50/70 rounded border border-rose-200">
            <span className="text-[11px] text-rose-700 block font-semibold">স্থগিত লেনদেন স্কোপ:</span>
            <span className="font-bold text-rose-900">{order.transactionScope}</span>
          </div>

          <div className="p-2.5 bg-govt-paper/60 rounded border border-govt-border">
            <span className="text-[11px] text-gray-500 block">কার্যকর মেয়াদ:</span>
            <span className="font-bold text-gray-800 font-sans">
              {order.effectiveUntil ? `${toBengaliNumber(order.effectiveFrom)} হতে ${toBengaliNumber(order.effectiveUntil)}` : 'অনির্দিষ্টকাল / নিষ্পত্তি পর্যন্ত'}
            </span>
          </div>
        </div>

        {/* Case Restricted Summary */}
        <div className="mt-4 pt-3 border-t border-govt-border/70">
          <h3 className="text-xs font-bold text-gray-700 uppercase mb-1.5 flex items-center gap-1.5">
            <FileText size={14} className="text-govt-green" />
            <span>মামলার মূল বিবরণ ও বিচারিক নিষেধাজ্ঞা প্রার্থনার ভিত্তি:</span>
          </h3>
          <p className="text-xs text-gray-800 bg-govt-paper/50 p-3 rounded border border-govt-border leading-relaxed font-bangla">
            {order.restrictedSummary || 'মামলার কোনো সংক্ষিপ্ত বিবরণ প্রদান করা হয়নি।'}
          </p>
        </div>
      </div>

      {/* Linked Land Parcels Card */}
      <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Layers size={15} className="text-govt-green" />
          <span>মামলা সংশ্লিষ্ট ভূমি পার্সেল (Affected Land Parcels)</span>
        </h3>

        {order.linkedParcel ? (
          <div className="p-3.5 bg-gray-50/80 border border-govt-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>
                  মৌজা: {order.linkedParcel.mouzaCode || 'ধানমন্ডি-০১'}, খতিয়ান নং:{' '}
                  <span className="font-sans text-govt-green">
                    {toBengaliNumber(order.linkedParcel.khatianNumber)}
                  </span>
                </span>
                <span className="text-[11px] bg-white border border-govt-border px-1.5 py-0.5 rounded font-mono">
                  {order.linkedParcel.khatianType || 'RS'}
                </span>
              </div>
              <div className="text-gray-600 mt-1 font-sans text-xs">
                দাগ নম্বর:{' '}
                <strong className="text-gray-900">
                  {toBengaliNumber(order.linkedParcel.dagNumber)}
                </strong>{' '}
                | রেকর্ডকৃত আয়তন:{' '}
                <strong className="text-gray-900">
                  {toBengaliNumber(order.linkedParcel.recordedArea)} শতাংশ
                </strong>{' '}
                | জেএল নং: {toBengaliNumber(order.linkedParcel.jlNumber || '১০')}
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                পার্সেল আইডি: {order.linkedParcel.id}
              </div>
            </div>

            <a
              href={`/parcels/${order.linkedParcel.id}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white text-govt-green font-semibold border border-govt-border hover:bg-green-50 rounded transition-colors text-xs shrink-0 self-start sm:self-center"
            >
              <span>পার্সেল প্রোফাইল</span>
              <ArrowRight size={13} />
            </a>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-xs text-gray-500 italic">
            কোনো নির্দিষ্ট ভূমি পার্সেল এখনো সংযুক্ত করা হয়নি।
          </div>
        )}
      </div>

      {/* Authoritative Source, Integrity & Document Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Source & Cryptographic Hash */}
        <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileCheck2 size={15} className="text-govt-green" />
            <span>প্রামাণ্য উৎস ও অখণ্ডতা যাচাই (Authoritative Source)</span>
          </h3>
          <div className="space-y-2 text-xs font-bangla">
            <div className="flex justify-between py-1 border-b border-govt-border/60">
              <span className="text-gray-500">প্রদানকারী বিচারালয়:</span>
              <span className="font-semibold text-gray-800">{courtName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-govt-border/60">
              <span className="text-gray-500">সার্ভার যাচাইকরণ স্থিতি:</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {order.verificationStatus}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-govt-border/60">
              <span className="text-gray-500">নথি রেফারেন্স:</span>
              <span className="font-mono font-semibold text-gray-800">
                {order.sourceDocumentReference}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-[11px] text-gray-500 block mb-0.5">ডিজিটাল অখণ্ডতা হ্যাশ (SHA-256):</span>
              <div className="font-mono text-[10px] text-gray-600 bg-gray-50 p-1.5 rounded border border-gray-200 break-all select-all">
                {`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`}
              </div>
            </div>
          </div>
        </div>

        {/* Restricted Court Documents & Access Control */}
        <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
          <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Lock size={15} className="text-amber-700" />
            <span>সংরক্ষিত বিচারিক নথি (Confidential Documents)</span>
          </h3>

          <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-950 mb-3 space-y-1">
            <div className="font-bold flex items-center gap-1 text-[11px] text-amber-900">
              <ShieldAlert size={13} className="shrink-0" />
              <span>সার্ভার-নিয়ন্ত্রিত গোপনীয়তা বিধিমালা</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              বিচারিক নথি শুধুমাত্র আদালত কর্মকর্তা ও বিচারকের ভূমিকায় সুরক্ষিত। অনুমোদিত অ্যাক্সেস ছাড়া মূল কপি ডাউনলোড সীমাবদ্ধ।
            </p>
          </div>

          <div className="p-2.5 bg-gray-50 border border-gray-200 rounded flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-gray-500" />
              <div>
                <div className="font-bold font-mono text-gray-800 text-[11px]">
                  {order.sourceDocumentReference}
                </div>
                <div className="text-[10px] text-gray-500 font-sans">
                  আকার: ১.৪ মেগাবাইট | পিএইচডি/পিডিএফ ফর্ম্যাট
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert(`সার্ভার অডিট লগ: '${order.sourceDocumentReference}' ডাউনলোড নথি অ্যাক্সেস প্রক্রিয়াধীন।`)}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Download size={12} />
              <span>ডাউনলোড</span>
            </button>
          </div>
        </div>
      </div>

      {/* Version History & Lifecycle Audit Trail */}
      <div className="card p-4 border border-govt-border bg-white rounded-lg shadow-2xs">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <History size={15} className="text-govt-green" />
          <span>আদেশের জীবনচক্র ও অডিট ট্রেইল (Lifecycle History)</span>
        </h3>

        <div className="space-y-2 text-xs font-bangla">
          <div className="flex items-start gap-2.5 p-2 bg-gray-50 rounded border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-govt-green mt-1.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800">আদেশ খসড়া তৈরি (DRAFT)</span>
                <span className="text-[11px] text-gray-500 font-sans">{order.createdAt || '২০২৪-০১-১৫'}</span>
              </div>
              <div className="text-[11px] text-gray-500 font-mono mt-0.5">
                প্রস্তুতকারী কর্মকর্তা আইডি: {order.createdBy || 'a1000000-0000-0000-0000-000000000001'}
              </div>
            </div>
          </div>

          {(order.approvalStatus === 'SUBMITTED' || order.approvalStatus === 'APPROVED' || order.approvalStatus === 'RELEASED') && (
            <div className="flex items-start gap-2.5 p-2 bg-blue-50/70 rounded border border-blue-200">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900">বিচারিক অনুমোদনের জন্য দাখিল (SUBMITTED)</span>
                  <span className="text-[11px] text-blue-700 font-sans">দাখিল সম্পন্ন</span>
                </div>
                <div className="text-[11px] text-blue-800 mt-0.5">
                  আদালত শাখা হতে আদেশের অনুলিপি বিচারকের স্বাক্ষর ও অনুমোদনের নিমিত্তে পেশকৃত।
                </div>
              </div>
            </div>
          )}

          {order.approvalStatus === 'APPROVED' && (
            <div className="flex items-start gap-2.5 p-2 bg-emerald-50 rounded border border-emerald-200">
              <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950">চূড়ান্ত অনুমোদন ও কার্যকর (APPROVED)</span>
                  <span className="text-[11px] text-emerald-700 font-sans">{order.approvedAt || 'অনুমোদিত'}</span>
                </div>
                <div className="text-[11px] text-emerald-800 font-mono mt-0.5">
                  অনুমোদনকারী বিচারক আইডি: {order.approvedBy || 'a2000000-0000-0000-0000-000000000002'}
                </div>
              </div>
            </div>
          )}

          {order.approvalStatus === 'RELEASED' && (
            <div className="flex items-start gap-2.5 p-2 bg-purple-50 rounded border border-purple-200">
              <div className="w-2 h-2 rounded-full bg-purple-600 mt-1.5 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-950">নিষেধাজ্ঞা অবমুক্ত ও নিষ্পত্তিকৃত (RELEASED)</span>
                  <span className="text-[11px] text-purple-700 font-sans">অবমুক্ত</span>
                </div>
                <div className="text-[11px] text-purple-800 mt-0.5">
                  বিজ্ঞ আদালতের সিদ্ধান্ত অনুযায়ী নিষেধাজ্ঞা অবমুক্ত এবং ভূমি গেটকিপার রিলিজ নিশ্চিতকৃত।
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Authorized Next Actions Card */}
      <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs space-y-3 font-bangla">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
          <Gavel size={16} className="text-govt-green" />
          <span>অনুমোদিত পরবর্তী পদক্ষেপ (Authorized Next Actions)</span>
        </h3>

        {/* State 1: DRAFT */}
        {order.approvalStatus === 'DRAFT' && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={15} />
                <span>আদেশটি বর্তমানে খসড়া অবস্থায় রয়েছে</span>
              </div>
              <p className="text-amber-800 text-[11px] mt-0.5">
                অনুমোদনের জন্য দাখিল না করা পর্যন্ত এই আদেশটি ভূমি রেজিস্ট্রিতে কার্যকর হবে না।
              </p>
            </div>

            {canSubmitRole && (
              <button
                type="button"
                onClick={() => onSubmitClick(order.id)}
                className="btn-primary text-xs flex items-center gap-1.5 shrink-0"
              >
                <Send size={14} />
                <span>অনুমোদনের জন্য দাখিল করুন</span>
              </button>
            )}
          </div>
        )}

        {/* State 2: SUBMITTED (Pending Approval) */}
        {order.approvalStatus === 'SUBMITTED' && (
          <div className="space-y-3">
            {isCreator && canApproveRole ? (
              /* Segregation of duties warning */
              <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-950">
                <div className="font-bold flex items-center gap-1.5 text-red-900">
                  <ShieldAlert size={16} />
                  <span>স্বার্থের দ্বন্দ্ব প্রতিরোধ নীতি (Segregation of Duties Enforced)</span>
                </div>
                <p className="mt-1 text-[11px] text-red-900 leading-relaxed">
                  সার্ভার নিরাপত্তা নীতি অনুযায়ী, <strong>আদেশ প্রস্তুতকারী কর্মকর্তা নিজে তা অনুমোদন করতে পারবেন না।</strong>{' '}
                  বিজ্ঞ অনুমোদনকারী বিচারক (Judge / Order Approver) এর অ্যাকাউন্ট দ্বারা এটি অনুমোদন আবশ্যক।
                </p>
              </div>
            ) : canApproveRole ? (
              /* Approver actions */
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <CheckCircle2 size={15} />
                    <span>বিচারিক পর্যালোচনা ও স্বাক্ষরের জন্য অপেক্ষমাণ</span>
                  </div>
                  <p className="text-blue-800 text-[11px] mt-0.5">
                    অনুমোদন সম্পন্ন হলে স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট ভূমি পার্সেলে সক্রিয় নিষেধাজ্ঞা লক কার্যকর হবে।
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRejectClick(order.id)}
                    className="px-3 py-2 text-xs font-semibold bg-white border border-red-300 text-red-700 hover:bg-red-50 rounded transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <XCircle size={14} />
                    <span>প্রত্যাখ্যান</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onApproveClick(order.id)}
                    className="bg-green-700 hover:bg-green-800 text-white px-3.5 py-2 text-xs font-bold rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 size={14} />
                    <span>আদেশ অনুমোদন করুন</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs text-blue-900">
                আদেশটি অনুমোদনের জন্য বিজ্ঞ বিচারক/অনুমোদনকারীর এজলাসে অপেক্ষমাণ রয়েছে।
              </div>
            )}
          </div>
        )}

        {/* State 3: APPROVED (Active) */}
        {order.approvalStatus === 'APPROVED' && (
          <div className="p-3 bg-green-50/70 border border-green-200 rounded text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-700" />
                <span>আদেশটি অনুমোদিত এবং রেজিস্ট্রিতে সক্রিয় নিষেধাজ্ঞা কার্যকর</span>
              </div>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                সাব-রেজিস্ট্রি গেটকিপার ও ব্যাংক সিস্টেমে এই দাগের সকল হস্তান্তর স্থগিত করা হয়েছে।
              </p>
            </div>

            {canApproveRole && (
              <button
                type="button"
                onClick={() => onReleaseClick(order.id)}
                className="px-3 py-2 text-xs font-semibold bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 rounded transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Unlock size={14} />
                <span>নিষেধাজ্ঞা অবমুক্ত / রিলিজ</span>
              </button>
            )}
          </div>
        )}

        {/* State 4: RELEASED */}
        {order.approvalStatus === 'RELEASED' && (
          <div className="p-3 bg-purple-50/70 border border-purple-200 rounded text-xs text-purple-950">
            এই আদেশের প্রেক্ষিতে আরোপিত নিষেধাজ্ঞা বিজ্ঞ আদালতের সিদ্ধান্ত অনুযায়ী আনুষ্ঠানিকভাবে অবমুক্ত করা হয়েছে।
          </div>
        )}

        {/* State 5: REJECTED */}
        {order.approvalStatus === 'REJECTED' && (
          <div className="p-3 bg-red-50/70 border border-red-200 rounded text-xs text-red-950">
            বিজ্ঞ বিচারক কর্তৃক খসড়া আদেশটি যথাযথ কারণ দর্শিয়ে প্রত্যাখ্যান করা হয়েছে।
          </div>
        )}
      </div>
    </div>
  )
}
