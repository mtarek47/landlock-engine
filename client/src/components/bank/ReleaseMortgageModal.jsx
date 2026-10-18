import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  X,
  Unlock,
  AlertTriangle,
  Building,
  FileCheck,
  Calendar,
  AlertCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import Button from '../design-system/Button'
import { toBengaliNumber } from '../design-system/constants'

export default function ReleaseMortgageModal({
  isOpen,
  onClose,
  mortgage,
  onAuthoritativeRelease,
  onRecordReleaseDoc,
  isReleasing,
  releaseError,
}) {
  const [releaseMode, setReleaseMode] = useState('DIRECT_RELEASE') // 'DIRECT_RELEASE' or 'SUBMIT_DOC_ONLY'
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      releaseReference: `REL-DB-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      issueDate: new Date().toISOString().slice(0, 10),
      issuingBranch: 'প্রধান শাখা / ঋণ আদায় বিভাগ',
      authorizedOfficer: 'ক্রেডিট অফিসার আহমেদ (শাখা ব্যবস্থাপক অনুমোদিত)',
      settlementReason: 'ঋণের সমুদয় মূল ও সুদ সম্পূর্ণ পরিশোধ সাপেক্ষে লিয়েন অবমুক্তকরণ',
      docType: 'BANK_NOC_CERTIFICATE',
      confirmLegalDischarge: false,
    },
  })

  if (!isOpen || !mortgage) return null

  const parcel = mortgage.parcel
  const watchedValues = watch()

  const handleFormSubmit = async (data) => {
    if (!data.confirmLegalDischarge) {
      alert('দয়া করে দায়মুক্তির আইনি প্রত্যয়নে সম্মতি দিন।')
      return
    }

    if (releaseMode === 'DIRECT_RELEASE') {
      try {
        await onAuthoritativeRelease({
          id: mortgage.id,
          releaseReference: data.releaseReference.trim(),
        })
        reset()
        setShowConfirm(false)
        onClose()
      } catch {
        // error handled by parent
      }
    } else {
      // Record release doc for review
      try {
        await onRecordReleaseDoc({
          mortgageId: mortgage.id,
          docData: {
            releaseReference: data.releaseReference.trim(),
            issueDate: data.issueDate,
            issuingBranch: data.issuingBranch,
            authorizedOfficer: data.authorizedOfficer,
            settlementReason: data.settlementReason,
            docType: data.docType,
          },
        })
        reset()
        setShowConfirm(false)
        onClose()
      } catch {
        // error handled by parent
      }
    }
  }

  const handleModalClose = () => {
    reset()
    setShowConfirm(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto font-bangla"
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-modal-title"
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={handleModalClose}
          aria-hidden="true"
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-xl transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all border border-govt-border my-8">
          {/* Header */}
          <div className="bg-emerald-800 text-white p-4 sm:p-5 flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-lg text-emerald-200">
                <Unlock size={22} aria-hidden="true" />
              </div>
              <div>
                <h3 id="release-modal-title" className="text-base sm:text-lg font-bold">
                  বন্ধক অবমুক্তি ও অনাপত্তিপত্র (NOC) দাখিল
                </h3>
                <p className="text-xs text-emerald-100">
                  ডেমো কমার্শিয়াল ব্যাংক পিএলসি • ঋণ পরিশোধোত্তর দায়মুক্তি ব্যবস্থাপনা
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
              aria-label="বন্ধ করুন"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm max-h-[70vh] overflow-y-auto">
              {releaseError && (
                <div className="p-3 bg-red-50 border border-red-200 text-rose-900 rounded-md flex items-start gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">অবমুক্তি ব্যর্থ হয়েছে:</strong>
                    <span>{releaseError.response?.data?.message || releaseError.message || 'সার্ভার ত্রুটি'}</span>
                  </div>
                </div>
              )}

              {/* Target Mortgage Info Card */}
              <div className="p-3.5 bg-gray-50 border border-govt-border rounded-lg space-y-2">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    অবমুক্তির জন্য চিহ্নিত বন্ধকী নথি
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-900">
                    {mortgage.lenderReference}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block">জমি ও দাগ নম্বর:</span>
                    <strong>
                      {parcel ? `দাগ: ${toBengaliNumber(parcel.dagNumber)} (মৌজা: ${parcel.mouzaCode})` : 'পার্সেল সংযুক্ত'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">বন্ধকীকৃত জমি:</span>
                    <strong className="font-sans">
                      {mortgage.securedArea ? `${toBengaliNumber(mortgage.securedArea)} শতক` : 'সম্পূর্ণ তফসিল'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">কার্যকর শুরু:</span>
                    <span className="font-sans text-gray-700">{mortgage.effectiveFrom}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">বর্তমান আইনি স্থিতি:</span>
                    <span className="font-semibold text-rose-700">সক্রিয় দায়যুক্ত</span>
                  </div>
                </div>
              </div>

              {/* Workflow Mode Selector */}
              <div className="p-3 bg-govt-paper border border-govt-border rounded-lg space-y-2">
                <label className="block font-bold text-gray-800 text-xs uppercase tracking-wider">
                  কার্যক্রমের ধরন নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-colors ${
                      releaseMode === 'DIRECT_RELEASE'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="releaseMode"
                      value="DIRECT_RELEASE"
                      checked={releaseMode === 'DIRECT_RELEASE'}
                      onChange={() => setReleaseMode('DIRECT_RELEASE')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <strong className="block">অবিলম্বে সিস্টেমে অবমুক্তকরণ</strong>
                      <span className="text-[11px] font-normal text-gray-500">
                        সার্ভারে স্ট্যাটাস RELEASED হিসেবে বলবৎ হবে।
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 p-2.5 rounded-md border cursor-pointer transition-colors ${
                      releaseMode === 'SUBMIT_DOC_ONLY'
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold'
                        : 'border-gray-200 bg-white text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="releaseMode"
                      value="SUBMIT_DOC_ONLY"
                      checked={releaseMode === 'SUBMIT_DOC_ONLY'}
                      onChange={() => setReleaseMode('SUBMIT_DOC_ONLY')}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="text-xs">
                      <strong className="block">অনাপত্তিপত্র দাখিল (অপেক্ষমাণ)</strong>
                      <span className="text-[11px] font-normal text-gray-500">
                        দাখিলকৃত নথি হিসেবে রেকর্ড হবে, চূড়ান্ত ছাড় পরে বলবৎ।
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3">
                {/* Release Reference */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    অনাপত্তিপত্র / রিলিজ রেফারেন্স স্মারক নং <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('releaseReference', {
                      required: 'অনাপত্তিপত্র রেফারেন্স স্মারক নং আবশ্যক',
                      minLength: { value: 3, message: 'রেফারেন্স ন্যূনতম ৩ অক্ষরের হতে হবে' },
                    })}
                    placeholder="যেমন: REL-DB-2024-045"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                  {errors.releaseReference && (
                    <p className="text-xs text-rose-600 mt-1">{errors.releaseReference.message}</p>
                  )}
                </div>

                {/* Dates & Authority */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      ইস্যুর তারিখ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      {...register('issueDate', { required: 'তারিখ আবশ্যক' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      ইস্যুকারী ব্যাংক শাখা
                    </label>
                    <input
                      type="text"
                      {...register('issuingBranch')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    অনুমোদনকারী কর্মকর্তার নাম ও পদবি
                  </label>
                  <input
                    type="text"
                    {...register('authorizedOfficer')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    দায়মুক্তির কারণ / নিষ্পত্তি বিবরণ
                  </label>
                  <textarea
                    rows={2}
                    {...register('settlementReason')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Warning Box */}
              <div className="p-3 bg-amber-50 border-l-4 border-l-amber-500 border-y border-r border-amber-200 rounded-r-lg space-y-1.5 text-xs text-amber-950">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle size={15} />
                  <span>আইনি পরিণতির সতর্কবার্তা:</span>
                </div>
                <p className="leading-relaxed">
                  চূড়ান্ত অবমুক্তি সম্পন্নের সাথে সাথে ল্যান্ডলক ইঞ্জিনের ডাটাবেজে এই বন্ধকটিকে চিরতরে দায়মুক্ত ঘোষণা করা হবে। সাব-রেজিস্ট্রি গেটকিপার ও নাগরিক উন্মুক্ত পোর্টালে এই জমির বন্ধকী বাধা তাৎক্ষণিকভাবে প্রত্যাহার হবে।
                </p>
              </div>

              {/* Statutory Checkbox */}
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-900 font-medium">
                  <input
                    type="checkbox"
                    {...register('confirmLegalDischarge', {
                      required: 'আইনি ঘোষণা ও ক্ষমতায়নে সম্মতি প্রদান আবশ্যক',
                    })}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>
                    আমি প্রত্যয়ন করছি যে, ব্যাংকের যথাযথ অনুমোদন সাপেক্ষে ঋণগ্রহীতার সম্পূর্ণ দায় সমন্বিত হওয়ায় এই অনাপত্তিপত্র প্রদান করা হলো এবং জমির উপর ব্যাংকের আর কোনো স্বত্ব বা লিয়েন বলবৎ নেই।
                  </span>
                </label>
                {errors.confirmLegalDischarge && (
                  <p className="text-xs text-rose-600 font-semibold mt-1">
                    {errors.confirmLegalDischarge.message}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-govt-border flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleModalClose}
                disabled={isReleasing}
              >
                বাতিল
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={isReleasing}
                leftIcon={Unlock}
                className="bg-emerald-700 hover:bg-emerald-800"
              >
                {isReleasing
                  ? 'অবমুক্ত করা হচ্ছে...'
                  : releaseMode === 'DIRECT_RELEASE'
                  ? 'চূড়ান্ত দায়মুক্তি কার্যকর করুন'
                  : 'অনাপত্তিপত্র দাখিল সংরক্ষণ করুন'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
