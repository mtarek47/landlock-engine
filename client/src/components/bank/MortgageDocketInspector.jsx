import { useState } from 'react'
import {
  X,
  Building,
  Landmark,
  Calendar,
  FileText,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Unlock,
  History,
  FileCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../design-system/StatusBadge'
import Button from '../design-system/Button'
import {
  toBengaliNumber,
  MORTGAGE_SCOPE_TYPES_BN,
} from '../design-system/constants'

export default function MortgageDocketInspector({
  mortgage,
  isOpen,
  onClose,
  onOpenReleaseModal,
}) {
  const [activeTab, setActiveTab] = useState('overview') // overview, parcel, release, audit

  if (!isOpen || !mortgage) return null

  const parcel = mortgage.parcel
  const isReleased = mortgage.status === 'RELEASED'
  const isPendingRelease = mortgage.effectiveUiStatus === 'RELEASE_PENDING'
  const submittedDoc = mortgage.submittedReleaseDoc

  const scopeLabel =
    MORTGAGE_SCOPE_TYPES_BN[mortgage.scopeType] || mortgage.scopeType || 'সম্পূর্ণ দাগ'

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden font-bangla"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mortgage-docket-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl border-l border-govt-border flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-govt-green text-white flex items-start justify-between border-b border-govt-green-dark">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 text-white uppercase font-sans">
                  ব্যাংক লিয়েন ডকেট
                </span>
                {isReleased ? (
                  <StatusBadge status="RELEASED" label="দায়মুক্ত / অবমুক্ত" size="sm" />
                ) : isPendingRelease ? (
                  <StatusBadge status="RELEASE_PENDING" label="অবমুক্তি বিবেচনাধীন" size="sm" />
                ) : (
                  <StatusBadge status="MORTGAGE_REQUIRES_RELEASE" label="সক্রিয় বন্ধক" size="sm" />
                )}
              </div>
              <h2
                id="mortgage-docket-title"
                className="text-lg sm:text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2"
              >
                <Landmark size={20} className="text-govt-gold" aria-hidden="true" />
                <span>{mortgage.lenderReference || 'বন্ধকী নথি'}</span>
              </h2>
              <p className="text-xs text-green-100 flex items-center gap-1.5">
                <Building size={13} aria-hidden="true" />
                <span>প্রতিষ্ঠান: ডেমো কমার্শিয়াল ব্যাংক পিএলসি • আইডি: {mortgage.id?.slice(0, 8)}...</span>
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold"
              aria-label="ডকেট বন্ধ করুন"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-govt-border bg-govt-paper px-4 sm:px-6 text-xs sm:text-sm font-semibold">
            {[
              { id: 'overview', label: 'সারসংক্ষেপ ও দায়', icon: FileText },
              { id: 'parcel', label: 'জমির তফসিল ও ঝুঁকি', icon: MapPin },
              { id: 'release', label: 'অনাপত্তি ও অবমুক্তি', icon: Unlock },
              { id: 'audit', label: 'নিরীক্ষা ও সংস্করণ', icon: History },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 py-3 px-3 sm:px-4 border-b-2 font-medium transition-colors focus-visible:outline-none ${
                  activeTab === id
                    ? 'border-govt-green text-govt-green font-bold bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-sm text-gray-800">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Status banner */}
                {isReleased ? (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs sm:text-sm text-emerald-950 flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">সম্পূর্ণ দায়মুক্ত ঘোষণা করা হয়েছে:</strong>
                      এই বন্ধকের অনুকূলে ব্যাংক অনাপত্তিপত্র (NOC) কার্যকর হওয়ায় সংশ্লিষ্ট জমির হস্তান্তর ও নামজারি বাধা প্রত্যাহার করা হয়েছে।
                    </div>
                  </div>
                ) : isPendingRelease ? (
                  <div className="p-3.5 bg-blue-50 border border-blue-300 rounded-lg text-xs sm:text-sm text-blue-950 flex items-start gap-2.5">
                    <Clock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">অনাপত্তিপত্র দাখিলকৃত (চূড়ান্ত অবমুক্তি অপেক্ষমাণ):</strong>
                      ব্যাংকের ঋণ পরিশোধ সংক্রান্ত প্রামাণ্য নথি দাখিল করা হয়েছে। সিস্টেমে চূড়ান্ত দায়মুক্তির অনুমোদন সম্পন্ন করুন।
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-lg text-xs sm:text-sm text-rose-950 flex items-start gap-2.5">
                    <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">সক্রিয় বন্ধকী দায় বলবৎ:</strong>
                      রেজিস্ট্রি গেটকিপার যাচাইয়ে এই জমি বন্ধকী দায়যুক্ত হিসেবে চিহ্নিত হবে। দায়মুক্তি ব্যতিরেকে সাব-রেজিস্ট্রার দলিল নিবন্ধন করবেন না।
                    </div>
                  </div>
                )}

                {/* Encumbrance breakdown grid */}
                <div className="border border-govt-border rounded-lg p-4 bg-gray-50/70 space-y-3">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                    বন্ধকী দায়ের বিবরণ (Encumbrance Schedule)
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">ঋণ দলিল / রেফারেন্স:</span>
                      <strong className="font-mono text-gray-900">{mortgage.lenderReference || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">আর্থিক প্রতিষ্ঠান:</span>
                      <strong className="text-gray-900">ডেমো কমার্শিয়াল ব্যাংক পিএলসি</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">বন্ধকীর পরিধি (Scope):</span>
                      <strong className="text-gray-900">{scopeLabel}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">বন্ধকীকৃত জমির পরিমাণ:</span>
                      <strong className="text-gray-900 font-sans">
                        {mortgage.securedArea ? `${toBengaliNumber(mortgage.securedArea)} শতক` : 'সম্পূর্ণ অংশ'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">হিস্যা (Secured Share):</span>
                      <strong className="text-gray-900 font-sans">
                        {mortgage.securedShare ? toBengaliNumber(mortgage.securedShare) : '১.০ (পূর্ণ)'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">কার্যকর শুরুর তারিখ:</span>
                      <strong className="font-sans text-gray-900">{mortgage.effectiveFrom || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">মেয়াদ উত্তীর্ণের তারিখ:</span>
                      <strong className="font-sans text-gray-900">{mortgage.effectiveUntil || 'অনির্দিষ্টকাল'}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">নথি তৈরিকারী কর্মকর্তা:</span>
                      <span className="font-mono text-xs text-gray-700">{mortgage.createdBy || 'bank_officer1'}</span>
                    </div>
                  </div>
                </div>

                {/* Quick actions box */}
                <div className="p-4 bg-govt-paper border border-govt-border rounded-lg space-y-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    অনুমোদিত পরবর্তী পদক্ষেপ
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {!isReleased && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          onClose()
                          onOpenReleaseModal(mortgage)
                        }}
                        leftIcon={Unlock}
                        className="bg-emerald-700 hover:bg-emerald-800"
                      >
                        {isPendingRelease ? 'চূড়ান্ত অবমুক্তি বলবৎ করুন' : 'অনাপত্তিপত্র দাখিল ও দায়মুক্তকরণ'}
                      </Button>
                    )}
                    {parcel && (
                      <Button
                        as={Link}
                        to={`/registry?parcelId=${parcel.id}`}
                        variant="outline"
                        size="sm"
                        leftIcon={ExternalLink}
                      >
                        রেজিস্ট্রি গেটকিপারে যাচাই
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PARCEL & CONFLICTS */}
            {activeTab === 'parcel' && (
              <div className="space-y-4">
                {parcel ? (
                  <>
                    <div className="p-4 border border-govt-border rounded-lg bg-gray-50/70 space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                          <MapPin size={16} className="text-govt-green" />
                          <span>সংযুক্ত জমির তফসিল (Land Parcel Details)</span>
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                          যাচাইকৃত পার্সেল
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-500 text-xs block">বিভাগ ও জেলা:</span>
                          <strong>{parcel.divisionCode}, {parcel.districtCode}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">উপজেলা ও থানা:</span>
                          <strong>{parcel.upazilaCode}</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">মৌজা ও জেএল নম্বর:</span>
                          <strong>{parcel.mouzaCode} (জেএল: {toBengaliNumber(parcel.jlNumber)})</strong>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">দাগ নম্বর:</span>
                          <strong className="text-govt-green font-bold font-sans text-base">
                            {toBengaliNumber(parcel.dagNumber)}
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">খতিয়ান নম্বর ও ধরন:</span>
                          <strong className="text-gray-900 font-sans">
                            {toBengaliNumber(parcel.khatianNumber)} ({parcel.khatianType})
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-500 text-xs block">রেকর্ডীয় আয়তন:</span>
                          <strong className="font-sans text-gray-900">
                            {toBengaliNumber(parcel.recordedArea)} {parcel.areaUnit}
                          </strong>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 flex justify-end">
                        <Link
                          to={`/parcels/${parcel.id}`}
                          className="text-xs text-govt-green font-bold hover:underline inline-flex items-center gap-1"
                        >
                          <span>সম্পূর্ণ পার্সেল প্রোফাইল দেখুন</span>
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </div>

                    {/* Check if parcel has court conflicts (e.g. dag 5001 has active court order) */}
                    {parcel.dagNumber === '5001' && (
                      <div className="p-4 bg-rose-50 border-l-4 border-l-govt-red border-y border-r border-rose-200 rounded-r-lg space-y-2">
                        <div className="flex items-center gap-1.5 text-govt-red font-bold text-xs sm:text-sm">
                          <AlertTriangle size={16} />
                          <span>সতর্কতা: জমিতে আদালতের সক্রিয় নিষেধাজ্ঞা বিদ্যমান!</span>
                        </div>
                        <p className="text-xs text-rose-900 leading-relaxed">
                          এই দাগে বিজ্ঞ যুগ্ম জেলা জজ ১ম আদালত কর্তৃক স্থগিতাদেশ (স্মারক: ORD-DH-2024-991) বলবৎ রয়েছে। ব্যাংক বন্ধক ছাড়াও জমিতে দেওয়ানি মোকদ্দমাজনিত আইনি বাধা কার্যকর রয়েছে।
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    পার্সেল তথ্য লোড করা যায়নি বা পার্সেল আইডি অসঙ্গত।
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: RELEASE & NOC TRACKING */}
            {activeTab === 'release' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-govt-border rounded-lg space-y-3">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <FileCheck size={18} className="text-emerald-700" />
                    <span>অনাপত্তিপত্র (NOC) ও দায়মুক্তি ট্র্যাকিং</span>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    বাংলাদেশ ভূমি আইন অনুযায়ী ব্যাংকের বন্ধকী ঋণ পরিশোধ হলে ব্যাংকের ক্ষমতাপ্রাপ্ত কর্মকর্তা অনাপত্তিপত্র (Bank Clearance / NOC) জারি করেন। ল্যান্ডলক ইঞ্জিনের মাধ্যমে এই দায়মুক্তি রিয়েল-টাইমে সাব-রেজিস্ট্রি অফিসে প্রতিবিম্বিত হয়।
                  </p>

                  {/* Distinction between submitted document vs backend verified release */}
                  <div className="space-y-3 pt-2">
                    {/* Stage 1: Mortgage Registered */}
                    <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-md">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        ১
                      </div>
                      <div className="text-xs">
                        <strong className="block font-semibold text-gray-900">বন্ধক নথিভুক্তকরণ</strong>
                        <span className="text-gray-500">
                          তারিখ: {mortgage.effectiveFrom} • রেফারেন্স: {mortgage.lenderReference}
                        </span>
                      </div>
                    </div>

                    {/* Stage 2: Release Document Submitted */}
                    <div className={`flex items-start gap-3 p-3 border rounded-md ${
                      submittedDoc || isReleased ? 'bg-white border-gray-200' : 'bg-gray-50 border-dashed border-gray-300 opacity-60'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        submittedDoc || isReleased ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-500'
                      }`}>
                        ২
                      </div>
                      <div className="text-xs space-y-0.5">
                        <strong className="block font-semibold text-gray-900">অনাপত্তিপত্র ও প্রামাণ্য নথি দাখিল</strong>
                        {submittedDoc ? (
                          <>
                            <div className="text-gray-600">স্মারক নং: <span className="font-mono font-bold text-gray-900">{submittedDoc.releaseReference}</span></div>
                            <div className="text-gray-500">দাখিলকারী: {submittedDoc.submittedBy} ({submittedDoc.submittedAt?.slice(0, 10)})</div>
                          </>
                        ) : isReleased ? (
                          <div className="text-gray-600">রেফারেন্স: <span className="font-mono">{mortgage.releaseReference}</span></div>
                        ) : (
                          <span className="text-gray-400">এখনও কোনো অনাপত্তিপত্র দাখিল করা হয়নি</span>
                        )}
                      </div>
                    </div>

                    {/* Stage 3: Authoritative Backend Release */}
                    <div className={`flex items-start gap-3 p-3 border rounded-md ${
                      isReleased ? 'bg-emerald-50/70 border-emerald-300' : 'bg-gray-50 border-dashed border-gray-300 opacity-60'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isReleased ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        ৩
                      </div>
                      <div className="text-xs space-y-0.5">
                        <strong className="block font-semibold text-gray-900">সিস্টেম-স্বীকৃত চূড়ান্ত দায়মুক্তি (Verified Discharge)</strong>
                        {isReleased ? (
                          <>
                            <div className="text-emerald-900 font-semibold">
                              সার্ভার নিশ্চিতকরণ সম্পন্ন • স্থিতি: RELEASED
                            </div>
                            <div className="text-gray-600 font-mono text-[11px]">
                              ছাড়পত্র স্মারক: {mortgage.releaseReference}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-400">সিস্টেম অবমুক্তি এখনো বলবৎ হয়নি</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!isReleased && (
                  <div className="text-center pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onClose()
                        onOpenReleaseModal(mortgage)
                      }}
                      leftIcon={Unlock}
                      className="bg-emerald-700 hover:bg-emerald-800"
                    >
                      অনাপত্তিপত্র দাখিল বা অবমুক্ত করুন
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: AUDIT */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-govt-border rounded-lg space-y-3 text-xs">
                  <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                    <History size={16} className="text-govt-green" />
                    <span>নথির সংস্করণ ও মেটাডেটা (Audit Metadata)</span>
                  </h3>
                  <div className="space-y-2 font-mono text-gray-700">
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500 font-sans">বন্ধকী আইডি (UUID):</span>
                      <span>{mortgage.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500 font-sans">পার্সেল আইডি (UUID):</span>
                      <span>{mortgage.parcelId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500 font-sans">প্রতিষ্ঠান আইডি:</span>
                      <span>{mortgage.lenderInstitutionId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500 font-sans">নথি সংস্করণ (Version):</span>
                      <span>v{mortgage.version ?? 0}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500 font-sans">সৃষ্টির সময়কাল:</span>
                      <span>{mortgage.createdAt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200">
                      <span className="text-gray-500 font-sans">সর্বশেষ হালনাগাদ:</span>
                      <span>{mortgage.updatedAt || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-govt-paper border border-govt-border rounded-lg text-xs text-gray-600 leading-relaxed">
                  <strong className="text-gray-800 block mb-1">অপরিবর্তনীয় অডিট নিশ্চয়তা:</strong>
                  প্রতিটি বন্ধক নিবন্ধন এবং অবমুক্তির ঘটনা ডাটাবেজে ক্রিপ্টোগ্রাফিক টাইমস্ট্যাম্প ও ইউজার আইডি সহ অডিট টেবিলে স্থায়ীভাবে লিপিবদ্ধ থাকে।
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-between">
            <div className="text-xs text-gray-500">
              দাপ্তরিক গোপনীয়তা সংরক্ষিত • ডেমো ব্যাংক পিএলসি
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              বন্ধ করুন
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
