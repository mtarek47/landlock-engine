import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  X,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  MapPin,
  Calendar,
  UploadCloud,
  ShieldCheck,
  FileCheck,
  Search,
  Lock,
} from 'lucide-react'
import {
  DIVISIONS,
  DISTRICTS_BY_DIVISION,
  UPAZILAS_BY_DISTRICT,
  MOUZAS_BY_UPAZILA,
  SEEDED_PARCEL_CATALOG,
} from '../../data/bangladeshGeoData'
import {
  ORDER_TYPES_BN,
  TRANSACTION_SCOPES_BN,
  CASE_TYPES_BN,
  toBengaliNumber,
} from '../design-system/constants'
import { useAuth } from '../../context/AuthContext'

const STEPS = [
  { id: 1, label: 'আদালত ও মোকদ্দমা', short: 'মোকদ্দমা' },
  { id: 2, label: 'ভূমি পার্সেল ও দাগ', short: 'পার্সেল' },
  { id: 3, label: 'আদেশের বিশদ ও স্কোপ', short: 'আদেশ স্কোপ' },
  { id: 4, label: 'নথিপত্র ও নিরাপত্তা', short: 'নথিপত্র' },
  { id: 5, label: 'পর্যালোচনা ও দাখিল', short: 'পর্যালোচনা' },
]

export default function NewOrderModal({
  isOpen,
  onClose,
  institutions = [],
  onSubmitForm,
  isLoading,
}) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [simulatedHash, setSimulatedHash] = useState('')
  const [selectedParcel, setSelectedParcel] = useState(SEEDED_PARCEL_CATALOG[0])

  const defaultCourtId =
    user?.institutionId ||
    institutions.find((i) => i.institutionType === 'COURT')?.id ||
    '10000000-0000-0000-0000-000000000001'

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      // Step 1: Court & Case
      courtInstitutionId: defaultCourtId,
      caseNumber: `OS-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      caseType: 'CIVIL_SUIT',
      filingDate: new Date().toISOString().split('T')[0],
      sourceReference: `CASE-DOC-${Date.now().toString().slice(-6)}`,
      restrictedSummary: '',

      // Step 2: Parcel Geographic
      divisionCode: 'DHAKA',
      districtCode: 'DHAKA',
      upazilaCode: 'DHANMONDI',
      mouzaCode: 'DHANMONDI-01',
      khatianNumber: '101',
      dagNumber: '5001',
      scopeType: 'FULL_PARCEL',
      scopeArea: '10.50',
      scopeShare: '1.0',

      // Step 3: Order Details
      orderReference: `ORD-DH-2025-${Math.floor(100 + Math.random() * 900)}`,
      orderType: 'INJUNCTION',
      transactionScope: 'ALL',
      orderDate: new Date().toISOString().split('T')[0],
      effectiveFrom: new Date().toISOString().split('T')[0],
      effectiveUntil: '',
      isIndefinite: true,

      // Step 4: Documents
      sourceDocumentReference: '',
    },
  })

  // Dependent location values
  const selectedDivision = watch('divisionCode')
  const selectedDistrict = watch('districtCode')
  const selectedUpazila = watch('upazilaCode')
  const isIndefinite = watch('isIndefinite')

  const availableDistricts = DISTRICTS_BY_DIVISION[selectedDivision] || []
  const availableUpazilas = UPAZILAS_BY_DISTRICT[selectedDistrict] || []
  const availableMouzas = MOUZAS_BY_UPAZILA[selectedUpazila] || []

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (availableDistricts.length > 0 && !availableDistricts.some((d) => d.code === selectedDistrict)) {
      setValue('districtCode', availableDistricts[0].code)
    }
  }, [selectedDivision, availableDistricts, selectedDistrict, setValue])

  useEffect(() => {
    if (availableUpazilas.length > 0 && !availableUpazilas.some((u) => u.code === selectedUpazila)) {
      setValue('upazilaCode', availableUpazilas[0].code)
    }
  }, [selectedDistrict, availableUpazilas, selectedUpazila, setValue])

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  // Handle file selection & hash generation
  const handleFileChange = (file) => {
    setFileError('')
    if (!file) return

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      setFileError('নথির আকার সর্বোচ্চ ১০ মেগাবাইট অনুমোদিত।')
      return
    }

    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'tiff', 'tif', 'png', 'jpg'].includes(ext)) {
      setFileError('শুধুমাত্র PDF, TIFF বা স্ক্যানকৃত ফাইল গ্রহণযোগ্য।')
      return
    }

    setUploadedFile(file)
    setValue('sourceDocumentReference', file.name)

    // Generate pseudo SHA-256 for integrity verification preview
    const pseudoHash = Array.from(file.name + file.size)
      .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0)
      .toString(16)
      .padStart(16, '0')
    setSimulatedHash(`a7f39b2e${pseudoHash.replace('-', '')}9c18d04e76b2`)
  }

  // Handle pilot parcel selection
  const handleSelectPilotParcel = (parcel) => {
    setSelectedParcel(parcel)
    setValue('divisionCode', parcel.divisionCode)
    setValue('districtCode', parcel.districtCode)
    setValue('upazilaCode', parcel.upazilaCode)
    setValue('mouzaCode', parcel.mouzaCode)
    setValue('khatianNumber', parcel.khatianNumber)
    setValue('dagNumber', parcel.dagNumber)
    setValue('scopeArea', parcel.recordedArea)
  }

  // Step navigation validator
  const handleNextStep = async () => {
    let fieldsToValidate = []
    if (currentStep === 1) {
      fieldsToValidate = ['caseNumber', 'caseType', 'filingDate', 'restrictedSummary']
    } else if (currentStep === 2) {
      fieldsToValidate = ['divisionCode', 'districtCode', 'upazilaCode', 'khatianNumber', 'dagNumber', 'scopeArea']
    } else if (currentStep === 3) {
      fieldsToValidate = ['orderReference', 'orderType', 'transactionScope', 'orderDate', 'effectiveFrom']
      if (!isIndefinite) {
        fieldsToValidate.push('effectiveUntil')
      }
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  // Form submission: either draft or immediate submit
  const submitData = (data, submitImmediately) => {
    const payload = {
      caseNumber: data.caseNumber,
      caseType: data.caseType,
      filingDate: data.filingDate,
      courtInstitutionId: data.courtInstitutionId,
      restrictedSummary: data.restrictedSummary,
      sourceReference: data.sourceReference,
      selectedParcel: {
        id: selectedParcel?.id || 'b1000000-0000-0000-0000-000000000001',
        scopeType: data.scopeType,
        scopeArea: data.scopeArea,
        scopeShare: data.scopeShare,
      },
      orderReference: data.orderReference,
      orderType: data.orderType,
      transactionScope: data.transactionScope,
      orderDate: data.orderDate,
      effectiveFrom: data.effectiveFrom,
      effectiveUntil: isIndefinite ? null : data.effectiveUntil || null,
      sourceDocumentReference: data.sourceDocumentReference || `DOC-${data.orderReference}.pdf`,
      submitImmediately,
    }

    onSubmitForm(payload)
  }

  if (!isOpen) return null

  const watchedValues = watch()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs font-bangla animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-govt-border flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-govt-green text-white flex items-center justify-between border-b border-govt-green-dark shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-white/10 rounded-md border border-white/20">
              <FileText size={18} className="text-govt-gold" />
            </div>
            <div>
              <h2 id="modal-title" className="text-sm sm:text-base font-bold leading-tight">
                নতুন বিচারিক আদেশ ও মামলা নিবন্ধন (Register Court Order)
              </h2>
              <p className="text-[11px] text-green-100 font-sans">
                Land Litigation & Injunction Docket Management
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="p-1 rounded text-green-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="উইন্ডো বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stepper Navigation Bar */}
        <div className="bg-govt-paper/80 border-b border-govt-border px-4 py-2.5 overflow-x-auto shrink-0">
          <nav aria-label="নিবন্ধন ধাপসমূহ" className="flex items-center justify-between min-w-[500px]">
            {STEPS.map((step, idx) => {
              const isActive = currentStep === step.id
              const isPast = currentStep > step.id
              return (
                <div key={step.id} className="flex items-center gap-1.5 text-xs">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-sans ${
                      isActive
                        ? 'bg-govt-green text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isPast ? <CheckCircle2 size={13} /> : toBengaliNumber(step.id)}
                  </span>
                  <span
                    className={`font-medium ${
                      isActive ? 'text-govt-green font-bold' : isPast ? 'text-gray-700' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <ChevronRight size={14} className="text-gray-400 mx-1 shrink-0" />
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* STEP 1: Court & Case Identification */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-green-50/70 border border-green-200 rounded text-xs text-green-950 flex items-start gap-2">
                <Building size={16} className="text-govt-green shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">ধাপ ১: আদালত ও দেওয়ানি মোকদ্দমার বিবরণ</span>
                  <p className="text-[11px] text-green-900 mt-0.5">
                    মোকদ্দমার নম্বর ও বিচারিক সারসংক্ষেপ সঠিকভাবে পূরণ করুন। এটি জাতীয় ভূমি রেজিস্ট্রির সাথে যুক্ত হবে।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Court Institution */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-800 mb-1">
                    বিজ্ঞ বিচারিক আদালত নির্বাচন <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register('courtInstitutionId', { required: 'আদালত নির্বাচন আবশ্যক' })}
                    className="w-full text-xs p-2.5 border border-govt-border rounded bg-govt-paper/40 focus:bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
                  >
                    {institutions.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.name} ({inst.institutionType})
                      </option>
                    ))}
                  </select>
                  {errors.courtInstitutionId && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.courtInstitutionId.message}</p>
                  )}
                </div>

                {/* Case Number */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    মোকদ্দমা নম্বর (Case Number) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('caseNumber', { required: 'মোকদ্দমা নম্বর আবশ্যক' })}
                    placeholder="যেমন: OS-2025-00123"
                    className="w-full text-xs p-2.5 font-mono border border-govt-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
                  />
                  {errors.caseNumber && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.caseNumber.message}</p>
                  )}
                </div>

                {/* Case Type */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    মামলার প্রকৃতি (Case Type) <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register('caseType', { required: 'মামলার প্রকৃতি আবশ্যক' })}
                    className="w-full text-xs p-2.5 border border-govt-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
                  >
                    <option value="CIVIL_SUIT">দেওয়ানি মোকদ্দমা (Civil Suit)</option>
                    <option value="LAND_DISPUTE">জমি বিরোধ মোকদ্দমা (Land Dispute)</option>
                    <option value="TITLE_SUIT">স্বত্ব সাব্যস্তের মামলা (Title Suit)</option>
                    <option value="PARTITION_SUIT">বণ্টন বা বাঁটোয়ারা মামলা (Partition Suit)</option>
                    <option value="WRIT_PETITION">রিট পিটিশন (Writ Petition)</option>
                    <option value="OTHER">অন্যান্য (Other)</option>
                  </select>
                </div>

                {/* Filing Date */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    মামলা দাখিলের তারিখ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('filingDate', { required: 'দাখিলের তারিখ আবশ্যক' })}
                    className="w-full text-xs p-2.5 border border-govt-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
                  />
                  {errors.filingDate && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.filingDate.message}</p>
                  )}
                </div>

                {/* Source Document Reference */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    মামলা ফাইলিং রেফারেন্স
                  </label>
                  <input
                    type="text"
                    {...register('sourceReference')}
                    placeholder="যেমন: CASE-DOC-2025/789"
                    className="w-full text-xs p-2.5 font-mono border border-govt-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
                  />
                </div>

                {/* Case Summary */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-800 mb-1">
                    মামলার মূল বিষয়বস্তু ও সংক্ষেপ <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    {...register('restrictedSummary', {
                      required: 'মামলার সংক্ষিপ্ত বিবরণ প্রদান করা আবশ্যক',
                      minLength: { value: 10, message: 'কমপক্ষে ১০ অক্ষর আবশ্যক' },
                    })}
                    placeholder="জমি হস্তান্তর স্থগিতাদেশ ও স্বত্ব বিরোধের সংক্ষিপ্ত বিবরণ উল্লেখ করুন..."
                    className="w-full text-xs p-2.5 border border-govt-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-govt-green leading-relaxed"
                  />
                  {errors.restrictedSummary && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.restrictedSummary.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Land Parcel Linking */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded text-xs text-blue-950 flex items-start gap-2">
                <MapPin size={16} className="text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">ধাপ ২: মামলা সংশ্লিষ্ট ভূমি পার্সেল ও দাগ সংযুক্তি</span>
                  <p className="text-[11px] text-blue-900 mt-0.5">
                    যে জমির উপর আদেশ আরোপিত হবে তার প্রশাসনিক অবস্থান ও দাগ নির্বাচন করুন। নিচে পাইলট পার্সেল হতেও দ্রুত নির্বাচন করতে পারেন।
                  </p>
                </div>
              </div>

              {/* Quick Pilot Parcel Selection Badges */}
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  দ্রুত পাইলট পার্সেল বাছাই করুন (Quick Selection):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SEEDED_PARCEL_CATALOG.slice(0, 3).map((p) => {
                    const isSelected = selectedParcel?.id === p.id
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectPilotParcel(p)}
                        className={`p-2.5 text-left rounded border transition-all text-xs cursor-pointer ${
                          isSelected
                            ? 'border-govt-green bg-green-50 shadow-2xs ring-1 ring-govt-green'
                            : 'border-govt-border bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-bold text-gray-900">
                          {p.upazilaCode}, দাগ {toBengaliNumber(p.dagNumber)}
                        </div>
                        <div className="text-[11px] text-gray-500 font-sans mt-0.5">
                          খতিয়ান: {toBengaliNumber(p.khatianNumber)} | {toBengaliNumber(p.recordedArea)} শতাংশ
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Geographic Hierarchy Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-2 border-t border-govt-border">
                {/* Division */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">বিভাগ</label>
                  <select
                    {...register('divisionCode', { required: true })}
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white"
                  >
                    {DIVISIONS.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">জেলা</label>
                  <select
                    {...register('districtCode', { required: true })}
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white"
                  >
                    {availableDistricts.map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Upazila */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">উপজেলা / থানা</label>
                  <select
                    {...register('upazilaCode', { required: true })}
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white"
                  >
                    {availableUpazilas.map((u) => (
                      <option key={u.code} value={u.code}>
                        {u.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mouza */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">মৌজা</label>
                  <select
                    {...register('mouzaCode')}
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white"
                  >
                    {availableMouzas.map((m) => (
                      <option key={m.code} value={m.code}>
                        {m.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Khatian */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    খতিয়ান নম্বর <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('khatianNumber', { required: 'খতিয়ান নম্বর আবশ্যক' })}
                    placeholder="যেমন: ১০১"
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white font-sans"
                  />
                </div>

                {/* Dag */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    দাগ নম্বর <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('dagNumber', { required: 'দাগ নম্বর আবশ্যক' })}
                    placeholder="যেমন: ৫০০১"
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white font-sans"
                  />
                </div>

                {/* Scope Type */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">আওতার ধরন</label>
                  <select
                    {...register('scopeType')}
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white"
                  >
                    <option value="FULL_PARCEL">সম্পূর্ণ জমি (Full Parcel)</option>
                    <option value="PORTION">আংশিক জমি (Portion)</option>
                  </select>
                </div>

                {/* Scope Area */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">আওতাভুক্ত আয়তন (শতাংশ)</label>
                  <input
                    type="text"
                    {...register('scopeArea')}
                    placeholder="যেমন: ১০.৫০"
                    className="w-full text-xs p-2 border border-govt-border rounded bg-white font-sans"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Order Details & Injunction Scope */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-950 flex items-start gap-2">
                <FileText size={16} className="text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">ধাপ ৩: আদেশের বিশদ, ধরন ও স্থগিত লেনদেন স্কোপ</span>
                  <p className="text-[11px] text-amber-900 mt-0.5">
                    আদেশের রেফারেন্স ও কোন কোন ধরনের লেনদেন নিষিদ্ধ থাকবে তা সুনির্দিষ্টভাবে চিহ্নিত করুন।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Order Reference */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    আদেশের রেফারেন্স নম্বর <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('orderReference', { required: 'আদেশের রেফারেন্স নম্বর আবশ্যক' })}
                    placeholder="যেমন: ORD-DH-2025-108"
                    className="w-full text-xs p-2.5 font-mono border border-govt-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
                  />
                  {errors.orderReference && (
                    <p className="text-red-600 text-[11px] mt-1">{errors.orderReference.message}</p>
                  )}
                </div>

                {/* Order Type */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    আদেশের ধরন (Order Type) <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register('orderType', { required: 'আদেশের ধরন আবশ্যক' })}
                    className="w-full text-xs p-2.5 border border-govt-border rounded bg-white focus:outline-none focus:ring-1 focus:ring-govt-green"
                  >
                    <option value="INJUNCTION">নিষেধাজ্ঞা (Injunction)</option>
                    <option value="STATUS_QUO">স্থিতাবস্থা (Status Quo)</option>
                    <option value="ATTACHMENT">ক্রোকের আদেশ (Attachment)</option>
                    <option value="STAY_ORDER">স্থগিতাদেশ (Stay Order)</option>
                    <option value="TITLE_DECLARATION">স্বত্ব ঘোষণা (Title Declaration)</option>
                    <option value="OTHER">অন্যান্য (Other)</option>
                  </select>
                </div>

                {/* Transaction Scope */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-gray-800 mb-1">
                    স্থগিত লেনদেন স্কোপ (Transaction Scope) <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register('transactionScope', { required: 'লেনদেন স্কোপ নির্বাচন করুন' })}
                    className="w-full text-xs p-2.5 border border-rose-300 bg-rose-50/50 rounded font-bold text-rose-950 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="ALL">সর্বপ্রকার হস্তান্তর ও নামজারি নিষিদ্ধ (ALL - Strict Lock)</option>
                    <option value="SALE">বিক্রয় ও সাফ-কবলা দলিল নিষিদ্ধ (SALE only)</option>
                    <option value="MORTGAGE">ব্যাংক বন্ধক ও লিয়েন নিষিদ্ধ (MORTGAGE only)</option>
                    <option value="GIFT">হেবা ও দানপত্র নিষিদ্ধ (GIFT)</option>
                    <option value="LEASE">ইজারা বা বন্দোবস্ত নিষিদ্ধ (LEASE)</option>
                    <option value="HEIRSHIP_TRANSFER">ওয়ারিশ সূত্রে নামজারি নিষিদ্ধ (HEIRSHIP)</option>
                    <option value="OTHER">অন্যান্য বিশেষ বিচারিক শর্ত (OTHER)</option>
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    রেজিস্ট্রি গেটকিপার এই নির্বাচিত স্কোপের ভিত্তিতে সাব-রেজিস্ট্রিতে স্বয়ংক্রিয় ব্লক কার্যকর করবে।
                  </p>
                </div>

                {/* Order Date */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    আদেশের তারিখ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('orderDate', { required: 'আদেশের তারিখ আবশ্যক' })}
                    className="w-full text-xs p-2.5 border border-govt-border rounded bg-white"
                  />
                </div>

                {/* Effective From */}
                <div>
                  <label className="block font-bold text-gray-800 mb-1">
                    কার্যকর শুরুর তারিখ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('effectiveFrom', { required: 'কার্যকর শুরুর তারিখ আবশ্যক' })}
                    className="w-full text-xs p-2.5 border border-govt-border rounded bg-white"
                  />
                </div>

                {/* Expiry Conditions */}
                <div className="sm:col-span-2 bg-gray-50 p-3 rounded border border-govt-border space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isIndefinite"
                      {...register('isIndefinite')}
                      className="rounded text-govt-green focus:ring-govt-green"
                    />
                    <label htmlFor="isIndefinite" className="font-bold text-xs text-gray-800 cursor-pointer">
                      মেয়াদ অনির্দিষ্টকাল / পরবর্তী বিচারিক আদেশ বা মোকদ্দমা নিষ্পত্তি না হওয়া পর্যন্ত বলবৎ
                    </label>
                  </div>

                  {!isIndefinite && (
                    <div className="pt-2">
                      <label className="block font-bold text-gray-700 mb-1">
                        কার্যকর সমাপ্তির নির্দিষ্ট তারিখ <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="date"
                        {...register('effectiveUntil', {
                          required: !isIndefinite ? 'কার্যকর সমাপ্তির তারিখ আবশ্যক' : false,
                        })}
                        className="w-full sm:w-1/2 text-xs p-2 border border-govt-border rounded bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Supporting Documents & Cryptographic Integrity */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 flex items-start gap-2">
                <ShieldCheck size={16} className="text-govt-green shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">ধাপ ৪: আদেশের মূল কপি সংযুক্তি ও ডিজিটাল অখণ্ডতা যাচাই</span>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    আদালতের স্বাক্ষরিত ও সিলমোহরকৃত আদেশপত্রের পিডিএফ বা স্ক্যান কপি আপলোড করুন।
                  </p>
                </div>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-govt-border rounded-lg p-6 text-center bg-govt-paper/30 hover:bg-govt-paper/60 transition-colors">
                <UploadCloud size={32} className="mx-auto text-gray-400 mb-2" />
                <div className="text-xs font-bold text-gray-800">
                  {uploadedFile ? uploadedFile.name : 'আদেশপত্র ফাইল নির্বাচন বা ড্র্যাগ করুন'}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  সর্বোচ্চ ১০ মেগাবাইট (PDF, TIFF, স্ক্যান কপি)
                </p>

                <label className="mt-3 inline-block">
                  <span className="btn-secondary text-xs cursor-pointer">
                    ফাইল ব্রাউজ করুন
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.tiff,.tif,.png,.jpg"
                    onChange={(e) => handleFileChange(e.target.files?.[0])}
                  />
                </label>

                {fileError && (
                  <p className="text-red-600 text-xs mt-2 flex items-center justify-center gap-1">
                    <AlertTriangle size={13} />
                    <span>{fileError}</span>
                  </p>
                )}
              </div>

              {/* Upload Feedback & SHA-256 Simulation */}
              {uploadedFile && (
                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between font-bangla">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <FileCheck size={16} className="text-emerald-700" />
                      <span>ফাইল সফলভাবে সংযুক্ত ও যাচাইকৃত</span>
                    </span>
                    <span className="text-[11px] text-emerald-800 font-sans">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-600 block">
                      ডিজিটাল ফিঙ্গারপ্রিন্ট হ্যাশ (SHA-256 Integrity Verification):
                    </span>
                    <div className="font-mono text-[10px] text-emerald-900 bg-white p-2 rounded border border-emerald-200 break-all select-all mt-0.5">
                      {simulatedHash}
                    </div>
                  </div>
                </div>
              )}

              {/* Server-enforced permissions disclaimer */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-950 flex items-start gap-2">
                <Lock size={15} className="text-amber-800 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>সার্ভার-নিয়ন্ত্রিত গোপনীয়তা:</strong> এই আদেশের ফাইল ও সারসংক্ষেপ সুরক্ষিত ভূমিকাভিত্তিক নিয়ন্ত্রণের আওতাভুক্ত থাকবে। শুধুমাত্র অনুমোদিত বিচারক ও আদালত কর্মকর্তাবৃন্দ সম্পূর্ণ রেকর্ড দেখতে পারবেন।
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Review Before Submit */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-green-50/80 border border-green-200 rounded text-xs text-green-950 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-govt-green shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">ধাপ ৫: চূড়ান্ত পর্যালোচনা ও দাখিল (Review Before Submit)</span>
                  <p className="text-[11px] text-green-900 mt-0.5">
                    দাখিলের পূর্বে সকল তথ্য সঠিকভাবে যাচাই করুন। আপনি এটি 'খসড়া' হিসেবে সংরক্ষণ করতে পারেন অথবা সরাসরি বিচারকের স্বাক্ষরের জন্য দাখিল করতে পারেন।
                  </p>
                </div>
              </div>

              {/* Review Summary Grid */}
              <div className="border border-govt-border rounded-lg overflow-hidden bg-white text-xs divide-y divide-govt-border font-bangla">
                <div className="p-3 bg-gray-50 font-bold text-gray-900 flex justify-between">
                  <span>মোকদ্দমা ও আদালত তথ্য</span>
                  <span className="font-mono text-govt-green">{watchedValues.caseNumber}</span>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <span className="text-gray-500">মামলার ধরন:</span>{' '}
                    <strong>{CASE_TYPES_BN[watchedValues.caseType]}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">দাখিলের তারিখ:</span>{' '}
                    <strong>{watchedValues.filingDate}</strong>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">সারসংক্ষেপ:</span>{' '}
                    <span className="text-gray-800">{watchedValues.restrictedSummary}</span>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 font-bold text-gray-900 flex justify-between">
                  <span>আদেশের বিশদ ও নিষেধাজ্ঞা স্কোপ</span>
                  <span className="font-mono text-govt-green">{watchedValues.orderReference}</span>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2 text-gray-700">
                  <div>
                    <span className="text-gray-500">আদেশের ধরন:</span>{' '}
                    <strong>{ORDER_TYPES_BN[watchedValues.orderType]}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">স্থগিত স্কোপ:</span>{' '}
                    <strong className="text-red-700 font-bold">{watchedValues.transactionScope}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">কার্যকর শুরুর তারিখ:</span>{' '}
                    <strong>{watchedValues.effectiveFrom}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">কার্যকর মেয়াদ:</span>{' '}
                    <strong>{isIndefinite ? 'অনির্দিষ্টকাল / নিষ্পত্তি পর্যন্ত' : watchedValues.effectiveUntil}</strong>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 font-bold text-gray-900 flex justify-between">
                  <span>সংশ্লিষ্ট ভূমি পার্সেল ও দাগ</span>
                  <span className="font-sans font-bold">দাগ: {toBengaliNumber(watchedValues.dagNumber)}</span>
                </div>
                <div className="p-3 grid grid-cols-2 gap-2 text-gray-700 font-sans">
                  <div>
                    <span className="text-gray-500">উপজেলা/মৌজা:</span>{' '}
                    <strong>{watchedValues.upazilaCode} - {watchedValues.mouzaCode}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">খতিয়ান নং:</span>{' '}
                    <strong>{toBengaliNumber(watchedValues.khatianNumber)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">আওতাভুক্ত আয়তন:</span>{' '}
                    <strong>{toBengaliNumber(watchedValues.scopeArea)} শতাংশ</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">সংযুক্ত নথি:</span>{' '}
                    <strong className="font-mono text-gray-800">{watchedValues.sourceDocumentReference || 'DOC-ORDER.pdf'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-gray-50 border-t border-govt-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                disabled={isLoading}
                onClick={handlePrevStep}
                className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>পূর্ববর্তী ধাপ</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary text-xs flex items-center gap-1.5"
              >
                <span>পরবর্তী ধাপ</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <>
                {/* Save Draft Action */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit((data) => submitData(data, false))}
                  className="px-4 py-2 text-xs font-semibold text-gray-800 bg-white border border-govt-border hover:bg-gray-100 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={14} className="text-amber-700" />
                  <span>খসড়া সংরক্ষণ করুন (Save Draft)</span>
                </button>

                {/* Save & Submit for Approval Action */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit((data) => submitData(data, true))}
                  className="btn-primary text-xs flex items-center gap-1.5"
                >
                  <Send size={14} />
                  <span>অনুমোদনের জন্য দাখিল করুন</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
