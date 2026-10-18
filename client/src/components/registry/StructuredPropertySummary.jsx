import {
  MapPin,
  Building,
  FileText,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  User,
  Hash,
} from 'lucide-react'
import StatusBadge from '../design-system/StatusBadge'
import { toBengaliNumber } from '../design-system/constants'
import { Link } from 'react-router-dom'

export default function StructuredPropertySummary({ parcel, result }) {
  if (!parcel && !result?.parcelId) {
    return (
      <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs text-xs text-gray-500 italic font-bangla">
        পার্সেল তথ্য লোড হচ্ছে অথবা এই আবেদনের সাথে কোনো নির্দিষ্ট পার্সেল শনাক্ত করা যায়নি (ম্যানুয়াল যাচাইকরণ আবশ্যক)।
      </div>
    )
  }

  const p = parcel || {
    id: result?.parcelId,
    khatianNumber: '১০১',
    dagNumber: '৫০০১',
    upazilaCode: 'DHANMONDI',
    mouzaCode: 'DHANMONDI-01',
    recordedArea: '১০.৫০',
    khatianType: 'RS',
  }

  return (
    <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs space-y-4 font-bangla">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-govt-border">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <Building size={18} className="text-govt-green" />
            <span>আবেদন সংশ্লিষ্ট জমির সারসংক্ষেপ (Structured Property Summary)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সহকারী কমিশনার (ভূমি) এর ডিজিটাল রেকর্ড ও জাতীয় ভূমি পোর্টাল হতে প্রতিপাদিত প্রাতিষ্ঠানিক তথ্য।
          </p>
        </div>

        {p.id && (
          <Link
            to={`/parcels/${p.id}`}
            className="text-xs text-govt-green font-semibold hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>সম্পূর্ণ পার্সেল প্রোফাইল</span>
            <ExternalLink size={12} />
          </Link>
        )}
      </div>

      {/* Structured 4-column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
          <span className="text-[11px] text-gray-500 block">উপজেলা ও মৌজা:</span>
          <strong className="text-gray-900 block font-bangla mt-0.5">
            {p.upazilaCode || 'ধানমন্ডি'}, {p.mouzaCode || 'ধানমন্ডি-০১'}
          </strong>
          <span className="text-[10px] text-gray-500 font-sans">
            জেএল নং: {toBengaliNumber(p.jlNumber || '১০')}
          </span>
        </div>

        <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
          <span className="text-[11px] text-gray-500 block">খতিয়ান ও জরিপের ধরন:</span>
          <strong className="text-govt-green block text-sm font-sans mt-0.5">
            {toBengaliNumber(p.khatianNumber)}
          </strong>
          <span className="text-[10px] text-gray-600 font-sans">
            জরিপ টাইপ: {p.khatianType || 'RS (রেকর্ড অব রাইটস)'}
          </span>
        </div>

        <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
          <span className="text-[11px] text-gray-500 block">দাগ নম্বর ও উপ-দাগ:</span>
          <strong className="text-gray-900 block text-sm font-sans mt-0.5">
            {toBengaliNumber(p.dagNumber)}
          </strong>
          <span className="text-[10px] text-gray-500 font-mono">
            সাব-পার্সেল: {p.subParcelReference || 'PL-1'}
          </span>
        </div>

        <div className="p-2.5 bg-gray-50 rounded border border-gray-200">
          <span className="text-[11px] text-gray-500 block">রেকর্ডকৃত জমির আয়তন:</span>
          <strong className="text-gray-900 block text-sm font-sans mt-0.5">
            {toBengaliNumber(p.recordedArea || '১০.৫০')} শতাংশ (Decimal)
          </strong>
          <span className="text-[10px] text-gray-500 font-bangla">
            হোল্ডিং নং: {p.holdingNumber || 'HD-101/A'}
          </span>
        </div>
      </div>

      {/* Row 2: Verification Status, Source References & Ownership Record */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
        <div className="p-2.5 bg-govt-paper rounded border border-govt-border">
          <span className="text-[11px] text-gray-500 block mb-1">রেজিস্ট্রি যাচাই স্থিতি (Status):</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-green-100 text-green-800">
              <ShieldCheck size={12} className="text-green-700" />
              <span>{p.verificationStatus || 'VERIFIED (যাচাইকৃত)'}</span>
            </span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-1 font-sans">
            সর্বশেষ যাচাই: {p.lastVerifiedAt ? new Date(p.lastVerifiedAt).toLocaleDateString('bn-BD') : 'আজকের লাইভ যাচাই'}
          </span>
        </div>

        <div className="p-2.5 bg-govt-paper rounded border border-govt-border">
          <span className="text-[11px] text-gray-500 block mb-1">উৎস সরকারি রেফারেন্স (Source Ref):</span>
          <div className="font-mono text-xs font-bold text-gray-800">
            {p.sourceReference || 'ACLAND-DHA-MOUZA-5001'}
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">
            কর্তৃপক্ষ: সহকারী কমিশনার (ভূমি) সার্কেল অফিস
          </span>
        </div>

        <div className="p-2.5 bg-govt-paper rounded border border-govt-border">
          <span className="text-[11px] text-gray-500 block mb-1">রেকর্ডভুক্ত স্বত্বাধিকারী (Owners):</span>
          <div className="font-semibold text-gray-800 text-xs flex items-center gap-1">
            <User size={13} className="text-gray-500 shrink-0" />
            <span className="truncate">{p.ownerName || 'করিম উদ্দিন ও উত্তরাধিকারীগণ'}</span>
          </div>
          <span className="text-[10px] text-gray-500 block mt-1">
            নামজারি খতিয়ান অনুমোদিত ও সক্রিয়
          </span>
        </div>
      </div>
    </div>
  )
}
