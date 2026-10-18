import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  X,
  Landmark,
  MapPin,
  FileText,
  Calendar,
  Building,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Search,
} from 'lucide-react'
import Button from '../design-system/Button'
import { toBengaliNumber } from '../design-system/constants'

export default function NewMortgageModal({
  isOpen,
  onClose,
  parcels = [],
  onSubmit,
  isSubmitting,
  submitError,
}) {
  const [step, setStep] = useState(1) // 1: Select Parcel, 2: Encumbrance, 3: Documents, 4: Review
  const [parcelSearch, setParcelSearch] = useState('')
  const [selectedParcel, setSelectedParcel] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      parcelId: '',
      lenderReference: '',
      scopeType: 'FULL_PARCEL',
      securedArea: '',
      securedShare: '1.0',
      effectiveFrom: new Date().toISOString().slice(0, 10),
      effectiveUntil: '',
      deedNumber: '',
      issuingBranch: 'প্রধান কার্যালয় / করপোরেট শাখা',
      officerName: 'ক্রেডিট অফিসার আহমেদ',
      hasOriginalDeed: true,
      hasSanctionLetter: true,
      hasMutationRecord: true,
      legalComplianceAgreed: false,
    },
  })

  if (!isOpen) return null

  const watchedValues = watch()

  // Filter parcels for step 1
  const filteredParcels = parcels.filter((p) => {
    if (!parcelSearch.trim()) return true
    const q = parcelSearch.toLowerCase()
    return (
      p.dagNumber?.toString().includes(q) ||
      p.khatianNumber?.toString().includes(q) ||
      p.mouzaCode?.toLowerCase().includes(q) ||
      p.upazilaCode?.toLowerCase().includes(q)
    )
  })

  const handleSelectParcel = (parcel) => {
    setSelectedParcel(parcel)
    setValue('parcelId', parcel.id, { shouldValidate: true })
    if (parcel.recordedArea && !watchedValues.securedArea) {
      setValue('securedArea', parcel.recordedArea.toString())
    }
  }

  const handleFormSubmit = async (data) => {
    if (!data.legalComplianceAgreed) {
      alert('দয়া করে আইনি ঘোষণা ও শর্তাবলিতে সম্মতি প্রদান করুন।')
      return
    }

    try {
      await onSubmit({
        parcelId: data.parcelId,
        lenderReference: data.lenderReference.trim(),
        scopeType: data.scopeType,
        securedArea: data.securedArea,
        securedShare: data.securedShare,
        effectiveFrom: data.effectiveFrom,
        effectiveUntil: data.effectiveUntil || null,
        metadata: {
          deedNumber: data.deedNumber,
          issuingBranch: data.issuingBranch,
          officerName: data.officerName,
          hasOriginalDeed: data.hasOriginalDeed,
        },
      })
      reset()
      setStep(1)
      setSelectedParcel(null)
      onClose()
    } catch {
      // Error is handled by parent via submitError
    }
  }

  const handleModalClose = () => {
    reset()
    setStep(1)
    setSelectedParcel(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto font-bangla"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-mortgage-title"
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          onClick={handleModalClose}
          aria-hidden="true"
        />

        {/* Modal Dialog */}
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all border border-govt-border my-8">
          {/* Header */}
          <div className="bg-govt-green text-white p-4 sm:p-5 flex items-center justify-between border-b border-govt-green-dark">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-lg text-govt-gold">
                <Landmark size={22} aria-hidden="true" />
              </div>
              <div>
                <h3 id="new-mortgage-title" className="text-base sm:text-lg font-bold">
                  নতুন ব্যাংক বন্ধক ও লিয়েন নিবন্ধন
                </h3>
                <p className="text-xs text-green-100">
                  ডেমো কমার্শিয়াল ব্যাংক পিএলসি • প্রাতিষ্ঠানিক ঋণ জামানত ভেরিফিকেশন
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleModalClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold"
              aria-label="বন্ধ করুন"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stepper progress */}
          <div className="bg-govt-paper px-4 py-3 border-b border-govt-border flex items-center justify-between text-xs font-semibold text-gray-700">
            {[
              { num: 1, label: 'পার্সেল নির্বাচন' },
              { num: 2, label: 'বন্ধকের তফসিল' },
              { num: 3, label: 'প্রামাণ্য নথি' },
              { num: 4, label: 'পর্যালোচনা ও দাখিল' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    step === s.num
                      ? 'bg-govt-green text-white'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {s.num}
                </span>
                <span className={`hidden sm:inline ${step === s.num ? 'text-govt-green font-bold' : ''}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="p-4 sm:p-6 space-y-5 text-xs sm:text-sm max-h-[65vh] overflow-y-auto">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 text-rose-900 rounded-md flex items-start gap-2">
                  <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">বন্ধক নিবন্ধন ব্যর্থ হয়েছে:</strong>
                    <span>{submitError.response?.data?.message || submitError.message || 'সার্ভার ত্রুটি'}</span>
                  </div>
                </div>
              )}

              {/* STEP 1: PARCEL SELECTION */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-gray-900 mb-1">
                      বন্ধকীকৃত জমির পার্সেল নির্বাচন করুন <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      সিস্টেমে পূর্বে ভেরিফাইড পার্সেল থেকে নির্দিষ্ট দাগ নম্বরটি বেছে নিন:
                    </p>

                    {/* Search box */}
                    <div className="relative mb-3">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="search"
                        value={parcelSearch}
                        onChange={(e) => setParcelSearch(e.target.value)}
                        placeholder="দাগ নম্বর, খতিয়ান বা মৌজা দিয়ে খুঁজুন..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-govt-green focus:outline-none"
                      />
                    </div>

                    {/* Parcel Cards List */}
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {filteredParcels.map((p) => {
                        const isSelected = selectedParcel?.id === p.id || watchedValues.parcelId === p.id
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSelectParcel(p)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'border-govt-green bg-green-50/80 ring-1 ring-govt-green'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900">
                                  মৌজা: {p.mouzaCode}
                                </span>
                                <span className="text-[11px] text-gray-500">
                                  (জেএল: {toBengaliNumber(p.jlNumber)})
                                </span>
                              </div>
                              <div className="text-xs text-gray-600">
                                উপজেলা: {p.upazilaCode}, জেলা: {p.districtCode}
                              </div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-govt-green">
                                <span>দাগ: {toBengaliNumber(p.dagNumber)}</span>
                                <span>•</span>
                                <span>খতিয়ান: {toBengaliNumber(p.khatianNumber)} ({p.khatianType})</span>
                                <span>•</span>
                                <span>আয়তন: {toBengaliNumber(p.recordedArea)} {p.areaUnit}</span>
                              </div>
                            </div>

                            <div className="shrink-0 pl-2">
                              {isSelected ? (
                                <span className="w-5 h-5 rounded-full bg-govt-green text-white flex items-center justify-center text-xs">
                                  ✓
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400 font-semibold">নির্বাচন</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Selected Parcel Badge */}
                  {selectedParcel && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-950 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
                      <span>
                        নির্বাচিত: <strong>মৌজা {selectedParcel.mouzaCode}</strong>, দাগ নং{' '}
                        <strong>{toBengaliNumber(selectedParcel.dagNumber)}</strong>, খতিয়ান{' '}
                        <strong>{toBengaliNumber(selectedParcel.khatianNumber)}</strong>
                      </span>
                    </div>
                  )}

                  <input type="hidden" {...register('parcelId', { required: 'জমির পার্সেল নির্বাচন আবশ্যক' })} />
                  {errors.parcelId && (
                    <p className="text-xs text-rose-600 font-semibold">{errors.parcelId.message}</p>
                  )}
                </div>
              )}

              {/* STEP 2: ENCUMBRANCE SCHEDULE */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Lender Reference */}
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      ঋণ দলিল / রেফারেন্স নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('lenderReference', {
                        required: 'ঋণ দলিল বা রেফারেন্স নম্বর আবশ্যক',
                        minLength: { value: 3, message: 'রেফারেন্স ন্যূনতম ৩ অক্ষরের হতে হবে' },
                      })}
                      placeholder="যেমন: MORT-DB-2024-001 বা DEED-7890/2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                    />
                    {errors.lenderReference && (
                      <p className="text-xs text-rose-600 mt-1">{errors.lenderReference.message}</p>
                    )}
                  </div>

                  {/* Scope Type */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        বন্ধকীর পরিধি (Scope Type) <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('scopeType')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-govt-green focus:outline-none"
                      >
                        <option value="FULL_PARCEL">সম্পূর্ণ দাগ (Full Parcel)</option>
                        <option value="PORTION">অংশবিশেষ / খণ্ডাংশ (Portion)</option>
                        <option value="SHARE">সুনির্দিষ্ট হিস্যা (Share)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        বন্ধকীকৃত জমির পরিমাণ (শতক) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        {...register('securedArea', {
                          required: 'জমির পরিমাণ আবশ্যক',
                          min: { value: 0.001, message: 'পরিমাণ শূন্যের বেশি হতে হবে' },
                        })}
                        placeholder="যেমন: 10.50"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                      />
                      {errors.securedArea && (
                        <p className="text-xs text-rose-600 mt-1">{errors.securedArea.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Secured Share & Dates */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        হিস্যা (Secured Share)
                      </label>
                      <input
                        type="text"
                        {...register('securedShare')}
                        placeholder="১.০ বা ০.৫০০০"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        কার্যকর শুরুর তারিখ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('effectiveFrom', { required: 'কার্যকর শুরুর তারিখ আবশ্যক' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                      />
                      {errors.effectiveFrom && (
                        <p className="text-xs text-rose-600 mt-1">{errors.effectiveFrom.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        মেয়াদ সমাপ্তি (ঐচ্ছিক)
                      </label>
                      <input
                        type="date"
                        {...register('effectiveUntil')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-sans text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: DOCUMENT METADATA */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        ঋণ মঞ্জুরিপত্র / দলিল নম্বর
                      </label>
                      <input
                        type="text"
                        {...register('deedNumber')}
                        placeholder="যেমন: SANCTION-2024-DB-098"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-gray-800 mb-1">
                        ইস্যুকারী ব্যাংক শাখা
                      </label>
                      <input
                        type="text"
                        {...register('issuingBranch')}
                        placeholder="শাখার নাম"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      দায়িত্বপ্রাপ্ত ক্রেডিট কর্মকর্তা
                    </label>
                    <input
                      type="text"
                      {...register('officerName')}
                      placeholder="কর্মকর্তার নাম ও পদবি"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-govt-green focus:outline-none"
                    />
                  </div>

                  {/* Supporting Documents Checklist */}
                  <div className="p-4 bg-gray-50 border border-govt-border rounded-lg space-y-2.5">
                    <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
                      প্রামাণ্য নথিপত্র চেকলিস্ট (Document Custody Checklist)
                    </h4>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('hasOriginalDeed')}
                        className="rounded text-govt-green focus:ring-govt-green"
                      />
                      <span>মূল মালিকানা দলিল (Original Title Deed) ব্যাংকের লকারে সংরক্ষিত আছে</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('hasSanctionLetter')}
                        className="rounded text-govt-green focus:ring-govt-green"
                      />
                      <span>স্বাক্ষরিত ঋণ মঞ্জুরিপত্র ও রেহান চুক্তিপত্র (Deed of Mortgage) বিদ্যমান</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('hasMutationRecord')}
                        className="rounded text-govt-green focus:ring-govt-green"
                      />
                      <span>হালনাগাদ নামজারি খতিয়ান ও ভূমি উন্নয়ন কর পরিশোধের দাখিলা পরীক্ষিত</span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & DECLARATION */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-govt-paper border border-govt-border rounded-lg space-y-3">
                    <h4 className="font-bold text-gray-900 text-sm border-b border-gray-300 pb-2 flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-govt-green" />
                      <span>বন্ধকী তথ্যের চূড়ান্ত পর্যালোচনা</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 block">ঋণ দলিল নং:</span>
                        <strong className="font-mono text-gray-900">{watchedValues.lenderReference}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">প্রতিষ্ঠান:</span>
                        <strong>ডেমো কমার্শিয়াল ব্যাংক পিএলসি</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">দাগ ও খতিয়ান:</span>
                        <strong>
                          দাগ {toBengaliNumber(selectedParcel?.dagNumber || 'N/A')}, খতিয়ান{' '}
                          {toBengaliNumber(selectedParcel?.khatianNumber || 'N/A')}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">বন্ধকীকৃত জমি:</span>
                        <strong className="font-sans">
                          {toBengaliNumber(watchedValues.securedArea)} শতক ({watchedValues.scopeType})
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">কার্যকর মেয়াদ:</span>
                        <strong className="font-sans">
                          {watchedValues.effectiveFrom} হতে {watchedValues.effectiveUntil || 'চলমান'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">শাখা ও কর্মকর্তা:</span>
                        <strong>{watchedValues.issuingBranch}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Statutory compliance check */}
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-amber-950 font-medium">
                      <input
                        type="checkbox"
                        {...register('legalComplianceAgreed', {
                          required: 'আইনি শর্তাবলিতে সম্মতি প্রদান আবশ্যক',
                        })}
                        className="mt-0.5 rounded text-govt-green focus:ring-govt-green"
                      />
                      <span>
                        আমি শপথপূর্বক প্রত্যয়ন করছি যে, বর্ণিত জমির বিপরীতে ডেমো কমার্শিয়াল ব্যাংক পিএলসি-এর ঋণ মঞ্জুর করা হয়েছে এবং মূল প্রামাণ্য নথিপত্র যথাযথ হেফাজত ও আইনি বিধিমোতাবেক লিয়েন নথিভুক্ত করা হচ্ছে।
                      </span>
                    </label>
                    {errors.legalComplianceAgreed && (
                      <p className="text-xs text-rose-600 font-semibold">{errors.legalComplianceAgreed.message}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-govt-border flex items-center justify-between">
              <div>
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(step - 1)}
                    disabled={isSubmitting}
                  >
                    পূর্ববর্তী ধাপ
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                >
                  বাতিল
                </Button>

                {step < 4 ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (step === 1 && !watchedValues.parcelId) {
                        alert('দয়া করে একটি জমি পার্সেল নির্বাচন করুন।')
                        return
                      }
                      if (step === 2) {
                        if (!watchedValues.lenderReference || !watchedValues.securedArea || !watchedValues.effectiveFrom) {
                          alert('দয়া করে সকল আবশ্যকীয় তথ্য (দলিল নং, পরিমাণ, শুরুর তারিখ) পূরণ করুন।')
                          return
                        }
                      }
                      setStep(step + 1)
                    }}
                  >
                    পরবর্তী ধাপ
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={isSubmitting}
                    leftIcon={ShieldCheck}
                  >
                    {isSubmitting ? 'নিবন্ধন করা হচ্ছে...' : 'চূড়ান্ত বন্ধক নিবন্ধন সম্পন্ন করুন'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
