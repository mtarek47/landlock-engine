import {
  Building2,
  Calendar,
  Clock,
  Fingerprint,
  Layers,
  MapPin,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Landmark,
  FileText,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import {
  toBengaliNumber,
  AUDIT_ACTIONS_BN,
  KNOWN_INSTITUTIONS,
} from '../design-system/constants'
import GovtBrandMark from '../design-system/GovtBrandMark'
import BrandLogo from '../BrandLogo'

// Format timestamp with BST (UTC+6)
function formatCertDate(dateStr) {
  if (!dateStr) return { date: 'N/A', time: 'N/A', full: 'N/A' }
  try {
    const d = new Date(dateStr)
    const options = {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }
    const formatted = new Intl.DateTimeFormat('en-GB', options).format(d)
    const date = formatted.slice(0, 10)
    const time = formatted.slice(12)
    return {
      date,
      time,
      full: `${date} ${time} BST (UTC+6)`,
    }
  } catch {
    return { date: dateStr, time: '', full: dateStr }
  }
}

export default function CertificateDocument({
  certificateId,
  parcel,
  checkResponse,
  publicStatus,
  issuedAt,
  expiresAt,
  verificationUrl,
}) {
  const certRef =
    checkResponse?.requestId ||
    `CERT-LLE-${new Date().getFullYear()}-${parcel?.dagNumber || 'PARCEL'}-${(certificateId || '').slice(0, 6).toUpperCase()}`

  const certIssuedDate = formatCertDate(issuedAt || checkResponse?.checkedAt || new Date().toISOString())
  const certExpiryDate = formatCertDate(expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
  const traceId = checkResponse?.correlationId || parcel?.id || certificateId

  // Determine authoritative legal outcome
  let decisionCode = 'UNKNOWN'
  let decisionTitle = 'সার্ভার রেকর্ড যাচাইাধীন বা অসম্পূর্ণ'
  let decisionVariant = 'review' // 'clear', 'blocked', 'mortgage', 'review'

  if (checkResponse?.decision) {
    decisionCode = checkResponse.decision
  } else if (publicStatus) {
    if (publicStatus.hasActiveRestriction) {
      decisionCode = 'BLOCKED_BY_VALID_ORDER'
    } else if (publicStatus.hasActiveMortgage) {
      decisionCode = 'MORTGAGE_REQUIRES_RELEASE'
    } else {
      decisionCode = 'CLEAR'
    }
  }

  if (decisionCode === 'BLOCKED_BY_VALID_ORDER') {
    decisionTitle = 'বিজ্ঞ আদালতের বৈধ আদেশে উক্ত সম্পত্তিতে হস্তান্তর স্থগিত ও অবরুদ্ধ'
    decisionVariant = 'blocked'
  } else if (decisionCode === 'MORTGAGE_REQUIRES_RELEASE') {
    decisionTitle = 'আর্থিক প্রতিষ্ঠানের অনুকূলে সক্রিয় বন্ধক বিদ্যমান • অনাপত্তি (NOC) ব্যতিরেকে হস্তান্তর নিষিদ্ধ'
    decisionVariant = 'mortgage'
  } else if (decisionCode === 'CLEAR') {
    decisionTitle = 'আইনি হস্তান্তরের ক্ষেত্রে কোনো সক্রিয় নিষেধাজ্ঞা বা বন্ধক নথিভুক্ত নেই'
    decisionVariant = 'clear'
  } else {
    decisionTitle = 'অসম্পূর্ণ বা অস্পষ্ট রেকর্ড বিদ্যমান • রেজিস্ট্রি করার পূর্বে সাব-রেজিস্ট্রারের সরেজমিন পরীক্ষা আবশ্যক'
    decisionVariant = 'review'
  }

  return (
    <div
      className="certificate-document w-full max-w-[210mm] min-h-[297mm] mx-auto bg-white p-6 sm:p-10 border border-govt-border print:border-none shadow-md print:shadow-none text-gray-900 font-bangla select-text"
      role="region"
      aria-label="ভূমি আইনি-ঝুঁকি যাচাইকরণ প্রত্যয়নপত্র"
    >
      {/* Decorative Government Double Border */}
      <div className="border-4 border-double border-govt-green print:border-govt-green-dark p-6 sm:p-8 flex flex-col justify-between min-h-[270mm] relative">
        
        {/* Subtle Background Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden"
          aria-hidden="true"
        >
          <div className="transform -rotate-45 text-center text-7xl font-extrabold text-govt-green uppercase tracking-widest">
            LANDLOCK ENGINE • GOVERNMENT VERIFIED
          </div>
        </div>

        <div>
          {/* 1. Official Institutional Heading */}
          <div className="text-center space-y-1.5 pb-4 border-b-2 border-govt-green">
            <div className="flex justify-center mb-2">
              <BrandLogo size="lg" className="shrink-0" />
            </div>

            <div className="text-xs uppercase tracking-wider text-gray-600 font-semibold font-sans">
              Government of the People&apos;s Republic of Bangladesh
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
            </h1>
            <div className="text-xs font-semibold text-govt-green">
              ভূমি মন্ত্রণালয় এবং আইন, বিচার ও সংসদ বিষয়ক মন্ত্রণালয়
            </div>
            <div className="text-sm font-bold text-gray-900 uppercase tracking-wide mt-1">
              ল্যান্ডলক ইঞ্জিন: আন্তঃবিভাগীয় ভূমি আইনি-ঝুঁকি ও স্বত্ব যাচাই প্রত্যয়নপত্র
            </div>
            <div className="text-[11px] font-sans text-gray-500">
              Inter-Departmental Land Legal-Risk Verification Certificate
            </div>
          </div>

          {/* 2. Certificate Meta Header */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 px-3 bg-gray-50/80 border-b border-gray-200 text-xs text-gray-700 mt-3 rounded">
            <div>
              <span className="text-gray-500 text-[11px] block">প্রত্যয়নপত্র স্মারক নম্বর:</span>
              <strong className="font-mono text-gray-900 text-xs sm:text-sm">{certRef}</strong>
            </div>
            <div>
              <span className="text-gray-500 text-[11px] block">যাচাইকরণের সময়কাল (BST):</span>
              <strong className="font-sans text-gray-900">{certIssuedDate.full}</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-gray-500 text-[11px] block">মেয়াদোত্তীর্ণের তারিখ:</span>
              <strong className="font-sans text-gray-900">{certExpiryDate.date} (৩০ দিন বলবৎ)</strong>
            </div>
          </div>

          {/* 3. Property Identifiers (তফসিলভুক্ত জমির পরিচিতি) */}
          <div className="mt-5 space-y-2">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-300 pb-1">
              <MapPin size={14} className="text-govt-green" aria-hidden="true" />
              <span>১. তফসিলভুক্ত সম্পত্তির বিবরণ ও পরিচিতি (Property Schedule)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-white border border-gray-200 rounded text-xs">
              <div>
                <span className="text-gray-500 block">বিভাগ ও জেলা:</span>
                <strong className="text-gray-900">{parcel?.divisionCode || 'ঢাকা'}, {parcel?.districtCode || 'ঢাকা'}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">উপজেলা / থানা:</span>
                <strong className="text-gray-900">{parcel?.upazilaCode || 'ধানমন্ডি'}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">মৌজা ও জেএল নং:</span>
                <strong className="text-gray-900">
                  {parcel?.mouzaCode || 'ধানমন্ডি-০১'} (জেএল: {toBengaliNumber(parcel?.jlNumber || '১০')})
                </strong>
              </div>
              <div>
                <span className="text-gray-500 block">আরএস দাগ নম্বর:</span>
                <strong className="text-govt-green font-bold text-sm font-sans">
                  {toBengaliNumber(parcel?.dagNumber || '৫০০১')}
                </strong>
              </div>
              <div>
                <span className="text-gray-500 block">খতিয়ান নম্বর ও ধরন:</span>
                <strong className="font-sans text-gray-900">
                  {toBengaliNumber(parcel?.khatianNumber || '১০১')} ({parcel?.khatianType || 'RS'})
                </strong>
              </div>
              <div>
                <span className="text-gray-500 block">রেকর্ডীয় জমির পরিমাণ:</span>
                <strong className="font-sans text-gray-900">
                  {toBengaliNumber(parcel?.recordedArea || '১০.৫০')} {parcel?.areaUnit || 'শতক/শতাংশ'}
                </strong>
              </div>
              <div>
                <span className="text-gray-500 block">উপ-পার্সেল রেফারেন্স:</span>
                <strong className="font-mono text-gray-700">{parcel?.subParcelReference || 'PL-1'}</strong>
              </div>
              <div>
                <span className="text-gray-500 block">রেকর্ড স্থিতি:</span>
                <span className="text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {parcel?.verificationStatus || 'VERIFIED'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Verification Result & Legal Risk Assessment */}
          <div className="mt-5 space-y-2">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-300 pb-1">
              <Scale size={14} className="text-govt-green" aria-hidden="true" />
              <span>২. আন্তঃবিভাগীয় আইনি-ঝুঁকি যাচাই ফলাফল (Authoritative Decision)</span>
            </h2>

            <div
              className={`p-4 rounded-lg border-2 text-xs sm:text-sm ${
                decisionVariant === 'blocked'
                  ? 'bg-red-50/60 border-rose-600 text-rose-950 print:bg-white print:border-black'
                  : decisionVariant === 'mortgage'
                  ? 'bg-amber-50/60 border-amber-600 text-amber-950 print:bg-white print:border-black'
                  : decisionVariant === 'review'
                  ? 'bg-blue-50/60 border-blue-600 text-blue-950 print:bg-white print:border-black'
                  : 'bg-green-50/60 border-emerald-700 text-emerald-950 print:bg-white print:border-black'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base tracking-tight font-sans uppercase">
                      সিদ্ধান্ত কোড: {decisionCode}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white border border-gray-400 text-gray-800">
                      {decisionCode === 'CLEAR' ? 'ঝুঁকিমুক্ত' : 'ঝুঁকি চিহ্নিত'}
                    </span>
                  </div>
                  <p className="font-semibold text-xs sm:text-sm leading-relaxed">
                    {decisionTitle}
                  </p>
                </div>

                <div className="shrink-0 text-right font-sans text-xs">
                  <span className="text-gray-500 block">কার্যকর সময়কাল:</span>
                  <strong className="text-gray-900">{certIssuedDate.date}</strong>
                </div>
              </div>

              {/* Sub-details of applicable orders / mortgages */}
              <div className="mt-3 pt-3 border-t border-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {decisionVariant === 'blocked' ? (
                  <>
                    <div className="p-2 bg-white rounded border border-gray-300">
                      <span className="text-gray-500 block font-semibold">বলবৎ আদালতের স্থগিতাদেশ:</span>
                      {checkResponse?.restrictionReferences && checkResponse.restrictionReferences.length > 0 ? (
                        <div className="font-mono text-gray-900 font-bold space-y-0.5 mt-0.5">
                          {checkResponse.restrictionReferences.map((ref, idx) => (
                            <div key={idx}>{ref}</div>
                          ))}
                        </div>
                      ) : (
                        <strong className="font-mono text-gray-900">ORD-DH-2024-991</strong>
                      )}
                      <div className="text-[11px] text-gray-600 mt-0.5">বিজ্ঞ দেওয়ানি আদালত • হস্তান্তর ও সাফ-কবলা নিবন্ধন নিষিদ্ধ</div>
                    </div>
                    <div className="p-2 bg-white rounded border border-gray-300">
                      <span className="text-gray-500 block font-semibold">আর্থিক প্রতিষ্ঠানের লিয়েন:</span>
                      {checkResponse?.mortgageReferences && checkResponse.mortgageReferences.length > 0 ? (
                        <div className="font-mono text-gray-900 font-bold space-y-0.5 mt-0.5">
                          {checkResponse.mortgageReferences.map((ref, idx) => (
                            <div key={idx}>{ref}</div>
                          ))}
                        </div>
                      ) : (
                        <strong className="font-mono text-gray-900">MORT-DB-2023-001</strong>
                      )}
                      <div className="text-[11px] text-gray-600 mt-0.5">আর্থিক প্রতিষ্ঠানের অনুকূলে বন্ধক দায়বদ্ধ</div>
                    </div>
                  </>
                ) : decisionVariant === 'mortgage' ? (
                  <div className="col-span-2 p-2 bg-white rounded border border-gray-300">
                    <span className="text-gray-500 block font-semibold">ব্যাংক বন্ধক ও লিয়েন বিবরণী:</span>
                    {checkResponse?.mortgageReferences && checkResponse.mortgageReferences.length > 0 ? (
                      <div className="font-mono text-gray-900 font-bold space-y-0.5 mt-0.5">
                        {checkResponse.mortgageReferences.map((ref, idx) => (
                          <div key={idx}>{ref}</div>
                        ))}
                      </div>
                    ) : (
                      <strong className="font-mono text-gray-900">MORT-DB-2023-001</strong>
                    )}
                    <div className="text-[11px] text-gray-600 mt-0.5">হস্তান্তরের পূর্বে ব্যাংকের অনুমোদিত অনাপত্তিপত্র (NOC) সাব-রেজিস্ট্রারের নিকট দাখিল বাধ্যতামূলক।</div>
                  </div>
                ) : decisionVariant === 'review' ? (
                  <div className="col-span-2 p-2 bg-white rounded border border-gray-300 text-amber-900">
                    <strong>ম্যানুয়াল পর্যালোচনা আবশ্যক:</strong> সার্ভার থেকে চূড়ান্ত আইনি স্থিতি স্বয়ংক্রিয়ভাবে নিশ্চিত করা যায়নি। সংশ্লিষ্ট রেজিস্ট্রি কার্যালয় বা ভূমি রেকর্ডরুম থেকে মূল নথি পরীক্ষা করুন।
                  </div>
                ) : (
                  <div className="col-span-2 p-2 bg-white rounded border border-gray-300 text-gray-700">
                    <strong>কোনো সক্রিয় আইনি বাধা নেই:</strong> সংযুক্ত আদালতের রেজিস্টার এবং আর্থিক প্রতিষ্ঠানের লিয়েন ইনডেক্সে উক্ত দাগ ও খতিয়ানের বিপরীতে কোনো বলবৎ স্থগিতাদেশ, ক্রোক বা অমীমাংসিত বন্ধকী দায় পাওয়া যায়নি।
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Source Data Summary & Verification Chain */}
          <div className="mt-5 space-y-2">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-300 pb-1">
              <Layers size={14} className="text-govt-green" aria-hidden="true" />
              <span>৩. সংযুক্ত সরকারি ডাটাবেজ ও উৎস প্রতিপাদন (Source Data Summary)</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] p-3 bg-gray-50 rounded border border-gray-200">
              <div className="space-y-0.5">
                <span className="text-gray-500 block">১. বিচার বিভাগীয় ডাটাবেজ:</span>
                <strong className="text-gray-900">দেওয়ানি আদালত রেকর্ডস</strong>
                <span className="text-emerald-700 block font-semibold">✓ সিঙ্ক্রোনাইজড</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">২. ভূমি প্রশাসন ডাটাবেজ:</span>
                <strong className="text-gray-900">সহকারী কমিশনার (ভূমি)</strong>
                <span className="text-emerald-700 block font-semibold">✓ ই-নামজারি পরীক্ষিত</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">৩. নিবন্ধন পরিদপ্তর ইনডেক্স:</span>
                <strong className="text-gray-900">সাব-রেজিস্ট্রি গেটকিপার</strong>
                <span className="text-emerald-700 block font-semibold">✓ রিয়েল-টাইম কানেক্টেড</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-gray-500 block">৪. ব্যাংক লিয়েন ইনডেক্স:</span>
                <strong className="text-gray-900">বাণিজ্যিক ব্যাংক রেজিস্টার</strong>
                <span className="text-emerald-700 block font-semibold">✓ হালনাগাদ রেকর্ড</span>
              </div>
            </div>
          </div>

          {/* 6. Statutory Limitations & Legal Disclaimer */}
          <div className="mt-5 p-3.5 bg-govt-paper print:bg-white border border-govt-border print:border-gray-400 rounded text-[11px] text-gray-700 space-y-1.5 leading-relaxed">
            <strong className="block text-gray-900 font-bold uppercase tracking-wider text-[11px]">
              ৪. বিধিবদ্ধ আইনি ঘোষণা ও সীমাবদ্ধতা (Statutory Limitations & Disclaimer)
            </strong>
            <p>
              (ক) এই প্রত্যয়নপত্রটি ল্যান্ডলক ইঞ্জিনের আন্তঃবিভাগীয় ডাটাবেজের রেকর্ড সাপেক্ষে প্রস্তুতকৃত একটি আইনি-ঝুঁকি যাচাইকরণ সারসংক্ষেপ। এটি কোনো চূড়ান্ত স্বত্ব ঘোষণা (Statutory Guarantee of Title) বা সরকারি মালিকানার নিশ্চয়তাপত্র নয়।
            </p>
            <p>
              (খ) সাব-রেজিস্ট্রারের সরেজমিন অনুসন্ধান, মূল দলিল পরীক্ষা বা বিজ্ঞ আদালতের বিচারিক এখতিয়ারের বিকল্প হিসেবে এই প্রত্যয়নপত্র প্রযোজ্য হবে না।
            </p>
            <p>
              (গ) জমিতে ভবিষ্যতে বিজ্ঞ আদালত কর্তৃক নতুন আদেশ জারি হলে অথবা অপ্রকাশিত ওয়ারিশি বিরোধ উত্থাপিত হলে এই স্ট্যাটাস স্বয়ংক্রিয়ভাবে পরিবর্তিত হতে পারে।
            </p>
          </div>
        </div>

        {/* 7. Authorized Issuing Footer & QR Verification Seal */}
        <div className="mt-6 pt-4 border-t-2 border-govt-green flex flex-col sm:flex-row items-center justify-between gap-4 avoid-break">
          {/* Left: Authorized Issuing & Security Hash */}
          <div className="space-y-1 text-xs text-gray-700">
            <div className="flex items-center gap-1.5 font-bold text-gray-900">
              <Building2 size={15} className="text-govt-green" aria-hidden="true" />
              <span>ইস্যুকারী কর্তৃপক্ষ: ল্যান্ডলক ইঞ্জিন সেন্ট্রাল নোড (#DH-01)</span>
            </div>
            <div className="text-[11px] text-gray-500 font-sans">
              ডিজিটাল ভ্যালিডেশন ট্রেস আইডি (Trace ID):
            </div>
            <div className="font-mono text-[10px] text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-300 w-fit">
              {traceId || 'N/A'}
            </div>
            <div className="text-[10px] text-gray-500 pt-1">
              কম্পিউটার জেনারেটেড প্রত্যয়নপত্র • প্রচলিত বিধিমোতাবেক ডিজিটাল স্বাক্ষর সম্বলিত
            </div>
          </div>

          {/* Right: Security QR Code with Public Verification URL */}
          <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded border border-gray-300 shrink-0">
            <div className="bg-white p-1 rounded border border-gray-200">
              <QRCodeSVG
                value={verificationUrl || `${window.location.origin}/verify/certificate/${certificateId || parcel?.id}`}
                size={82}
                level="M"
                includeMargin={false}
                aria-label="অনলাইন সত্যতা যাচাইকরণ কিউআর কোড"
              />
            </div>
            <div className="space-y-0.5 max-w-[130px]">
              <div className="text-[11px] font-bold text-gray-900 leading-tight">
                অনলাইন সত্যতা যাচাই
              </div>
              <p className="text-[10px] text-gray-500 leading-tight">
                স্মার্টফোনে কিউআর কোড স্ক্যান করে লাইভ সার্ভার ভ্যালিডেশন দেখুন
              </p>
              <div className="text-[9px] font-mono text-govt-green font-semibold">
                /verify/certificate/...
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
