import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  ClipboardCheck,
  Search,
  RotateCcw,
  Building,
  MapPin,
  FileText,
  Hash,
  AlertTriangle,
  Zap,
} from 'lucide-react'
import {
  DIVISIONS,
  DISTRICTS_BY_DIVISION,
  UPAZILAS_BY_DISTRICT,
  MOUZAS_BY_UPAZILA,
} from '../../data/bangladeshGeoData'
import { toBengaliNumber } from '../design-system/constants'

const TRANSACTION_TYPES = [
  { value: 'SALE', label: 'বিক্রয় ও সাফ-কবলা দলিল (Sale Deed)' },
  { value: 'GIFT', label: 'হেবা বা দানপত্র দলিল (Gift / Heba Deed)' },
  { value: 'MORTGAGE', label: 'ব্যাংক বন্ধকী দলিল (Mortgage Deed)' },
  { value: 'LEASE', label: 'ইজারা বা বন্দোবস্ত চুক্তি (Lease Agreement)' },
  { value: 'HEIRSHIP_TRANSFER', label: 'ওয়ারিশ সূত্রে বণ্টন ও হস্তান্তর (Heirship Deed)' },
  { value: 'OTHER', label: 'অন্যান্য আইনগত হস্তান্তর (Other Transfer)' },
]

const DEMO_PRESETS = [
  {
    title: 'ধানমন্ডি দাগ ৫০০১ - বিক্রয় দলিল (আদালতের নিষেধাজ্ঞায় অবরুদ্ধ)',
    desc: 'দেওয়ানি আদালতের স্থগিতাদেশ ও বাণিজ্যিক ব্যাংকের বন্ধক বলবৎ',
    parcelId: 'b1000000-0000-0000-0000-000000000001',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'DHANMONDI',
    mouzaCode: 'DHANMONDI-01',
    khatianNumber: '101',
    dagNumber: '5001',
    transactionType: 'SALE',
    appRef: 'REG-APP-2025-DH-001',
  },
  {
    title: 'ধানমন্ডি দাগ ৫০০১ - বন্ধক দলিল (ব্যাংক ঋণ ও লিয়েন যাচাই)',
    desc: 'আদালতের আদেশ বিক্রয় স্থগিত করলেও বন্ধকের জন্য ব্যাংক NOC আবশ্যক',
    parcelId: 'b1000000-0000-0000-0000-000000000001',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'DHANMONDI',
    mouzaCode: 'DHANMONDI-01',
    khatianNumber: '101',
    dagNumber: '5001',
    transactionType: 'MORTGAGE',
    appRef: 'REG-APP-2025-DH-002',
  },
  {
    title: 'গুলশান দাগ ৬০০২ - সাফ-কবলা দলিল (পরিষ্কার ও ঝুঁকিমুক্ত CLEAR)',
    desc: 'খসড়া পর্যবেক্ষণ সম্পন্ন — কোনো সক্রিয় নিষেধাজ্ঞা বা ব্যাংক দায় নেই',
    parcelId: 'b2000000-0000-0000-0000-000000000002',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'GULSHAN',
    mouzaCode: 'GULSHAN-02',
    khatianNumber: '202',
    dagNumber: '6002',
    transactionType: 'SALE',
    appRef: 'REG-APP-2025-GL-089',
  },
  {
    title: 'অস্পষ্ট / অস্তিত্বহীন দাগ ৯৯৯৯ (REVIEW_REQUIRED)',
    desc: 'রেকর্ডে অমিল বা অস্পষ্ট জরিপ তথ্য - ম্যানুয়াল যাচাইকরণ প্রয়োজন',
    parcelId: '',
    divisionCode: 'DHAKA',
    districtCode: 'DHAKA',
    upazilaCode: 'DHANMONDI',
    mouzaCode: 'DHANMONDI-01',
    khatianNumber: '999',
    dagNumber: '9999',
    transactionType: 'SALE',
    appRef: 'REG-APP-2025-UN-404',
  },
]

export default function RegistrySearchWorkspace({
  onSearch,
  isChecking,
  initialParcelId = '',
}) {
  const [activeTab, setActiveTab] = useState('application') // 'application' | 'direct_uuid'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      applicationReference: `REG-APP-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      transactionType: 'SALE',
      divisionCode: 'DHAKA',
      districtCode: 'DHAKA',
      upazilaCode: 'DHANMONDI',
      mouzaCode: 'DHANMONDI-01',
      khatianNumber: '101',
      dagNumber: '5001',
      parcelId: initialParcelId,
      requestId: crypto.randomUUID(),
    },
  })

  const selectedDivision = watch('divisionCode')
  const selectedDistrict = watch('districtCode')
  const selectedUpazila = watch('upazilaCode')

  const availableDistricts = DISTRICTS_BY_DIVISION[selectedDivision] || []
  const availableUpazilas = UPAZILAS_BY_DISTRICT[selectedDistrict] || []
  const availableMouzas = MOUZAS_BY_UPAZILA[selectedUpazila] || []

  // Keep dependent dropdowns valid
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

  const regenerateRequestId = () => {
    setValue('requestId', crypto.randomUUID())
  }

  const applyPreset = (preset) => {
    setValue('applicationReference', preset.appRef)
    setValue('transactionType', preset.transactionType)
    setValue('divisionCode', preset.divisionCode)
    setValue('districtCode', preset.districtCode)
    setValue('upazilaCode', preset.upazilaCode)
    setValue('mouzaCode', preset.mouzaCode)
    setValue('khatianNumber', preset.khatianNumber)
    setValue('dagNumber', preset.dagNumber)
    setValue('parcelId', preset.parcelId || '')
    regenerateRequestId()
  }

  const handleFormSubmit = (data) => {
    onSearch(data)
  }

  return (
    <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs space-y-4 font-bangla">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-govt-border">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <ClipboardCheck size={18} className="text-govt-green" />
            <span>দলিল নিবন্ধন আবেদন ও সম্পত্তি অনুসন্ধান (Registry Application Workspace)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সাব-রেজিস্ট্রি কার্যালয়ে দলিল রেজিস্ট্রি বা গেটকিপার অনুমোদনের পূর্বে আইনি স্থিতি যাচাই করুন।
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-govt-paper rounded border border-govt-border text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('application')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green ${
              activeTab === 'application'
                ? 'bg-govt-green text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            তফসিল ও দাগ নম্বর দ্বারা
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('direct_uuid')}
            className={`min-h-[36px] px-3.5 py-1.5 rounded font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green ${
              activeTab === 'direct_uuid'
                ? 'bg-govt-green text-white shadow-2xs'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            সরাসরি পার্সেল UUID
          </button>
        </div>
      </div>

      {/* Quick Pilot Application Presets */}
      <div className="p-3 bg-govt-paper/70 rounded-lg border border-govt-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <Zap size={13} className="text-amber-600" />
            <span>দ্রুত পরীক্ষামূলক ডকেট প্রিসেট (Official Pilot Scenarios):</span>
          </span>
          <span className="text-[10px] text-gray-400 font-sans">1-Click Verification Presets</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="p-2.5 text-left rounded border border-govt-border bg-white hover:border-govt-green hover:bg-green-50/50 transition-all text-xs cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
            >
              <div className="font-bold text-gray-900 group-hover:text-govt-green line-clamp-1">
                {p.title}
              </div>
              <div className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                {p.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Row 1: Application Reference & Deed Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              দলিল খসড়া / আবেদন সিরিয়াল নং (Application Ref) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register('applicationReference', { required: 'আবেদন সিরিয়াল নম্বর আবশ্যক' })}
              placeholder="যেমন: REG-APP-2025-0891"
              className="w-full min-h-[44px] px-3 py-2 font-mono text-xs border border-govt-border rounded-lg bg-white text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green transition-shadow"
            />
            {errors.applicationReference && (
              <p className="text-red-600 text-[11px] mt-1">{errors.applicationReference.message}</p>
            )}
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              প্রস্তাবিত দলিলের ধরন (Transaction Type) <span className="text-red-600">*</span>
            </label>
            <select
              {...register('transactionType', { required: 'দলিলের ধরন নির্বাচন করুন' })}
              className="w-full min-h-[44px] px-3 py-2 text-xs font-semibold border border-govt-border rounded-lg bg-white text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green transition-shadow"
            >
              {TRANSACTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Mode 1: Geographic Hierarchy & Property Identifiers */}
        {activeTab === 'application' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs pt-2 border-t border-govt-border">
            <div>
              <label className="block font-bold text-gray-700 mb-1">বিভাগ</label>
              <select
                {...register('divisionCode')}
                className="w-full min-h-[44px] px-2.5 py-2 text-xs border border-govt-border rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              >
                {DIVISIONS.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">জেলা</label>
              <select
                {...register('districtCode')}
                className="w-full min-h-[44px] px-2.5 py-2 text-xs border border-govt-border rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              >
                {availableDistricts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">উপজেলা / সার্কেল</label>
              <select
                {...register('upazilaCode')}
                className="w-full min-h-[44px] px-2.5 py-2 text-xs border border-govt-border rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              >
                {availableUpazilas.map((u) => (
                  <option key={u.code} value={u.code}>
                    {u.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">মৌজা</label>
              <select
                {...register('mouzaCode')}
                className="w-full min-h-[44px] px-2.5 py-2 text-xs border border-govt-border rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              >
                {availableMouzas.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                খতিয়ান নং <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register('khatianNumber', { required: activeTab === 'application' ? 'খতিয়ান নম্বর আবশ্যক' : false })}
                placeholder="যেমন: ১০১"
                className="w-full min-h-[44px] px-2.5 py-2 text-xs border border-govt-border rounded-lg bg-white font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              />
              {errors.khatianNumber && (
                <p className="text-red-600 text-[10px] mt-0.5">{errors.khatianNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                দাগ নং <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register('dagNumber', { required: activeTab === 'application' ? 'দাগ নম্বর আবশ্যক' : false })}
                placeholder="যেমন: ৫০০১"
                className="w-full min-h-[44px] px-2.5 py-2 text-xs border border-govt-border rounded-lg bg-white font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              />
              {errors.dagNumber && (
                <p className="text-red-600 text-[10px] mt-0.5">{errors.dagNumber.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Tab Mode 2: Direct Parcel UUID */}
        {activeTab === 'direct_uuid' && (
          <div className="pt-2 border-t border-govt-border">
            <label className="block font-bold text-gray-800 text-xs mb-1">
              সরাসরি ভূমি পার্সেল আইডি (Parcel UUID) <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register('parcelId', {
                required: activeTab === 'direct_uuid' ? 'পার্সেল আইডি প্রদান আবশ্যক' : false,
              })}
              placeholder="যেমন: b1000000-0000-0000-0000-000000000001"
              className="w-full min-h-[44px] px-3 py-2 font-mono text-xs border border-govt-border rounded-lg bg-white text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
            />
            {errors.parcelId && (
              <p className="text-red-600 text-[11px] mt-1">{errors.parcelId.message}</p>
            )}
          </div>
        )}

        {/* Idempotency Key Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-600">
          <div className="flex items-center gap-1.5 font-sans">
            <Hash size={13} className="text-gray-400 shrink-0" />
            <span>
              আইডেমপোটেন্সি রিকোয়েস্ট আইডি:{' '}
              <strong className="font-mono text-gray-800">{watch('requestId')}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={regenerateRequestId}
            className="text-govt-green hover:underline flex items-center gap-1 font-semibold cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
          >
            <RotateCcw size={12} />
            <span>নতুন কি তৈরি করুন</span>
          </button>
        </div>

        {/* Submit Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
          <span className="text-xs text-gray-500">
            * প্রতিটি সিদ্ধান্ত বাংলাদেশ ভূমি আইন ও রেজিস্ট্রেশন ম্যানুয়াল অনুযায়ী নিরীক্ষিত হয়।
          </span>

          <button
            type="submit"
            disabled={isChecking}
            className="w-full sm:w-auto min-h-[44px] btn-primary text-xs sm:text-sm px-6 py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>রেজিস্ট্রি গেটকিপার যাচাই হচ্ছে...</span>
              </>
            ) : (
              <>
                <ClipboardCheck size={16} />
                <span>সিদ্ধান্ত যাচাই করুন (Verify Decision)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
