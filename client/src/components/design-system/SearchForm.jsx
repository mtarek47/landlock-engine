import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { Search, RotateCcw, Zap, ChevronDown, ChevronUp, MapPin, FileText } from 'lucide-react'
import FormField from './FormField'
import Button from './Button'
import {
  DIVISIONS,
  DISTRICTS_BY_DIVISION,
  UPAZILAS_BY_DISTRICT,
  MOUZAS_BY_UPAZILA,
  SEEDED_PARCEL_CATALOG,
} from '../../data/bangladeshGeoData'

/**
 * SearchForm Component
 * Institutional property inquiry form inspired by Bangladesh eFamilyCourt layout and design standards.
 * Features dependent cascading selectors, quick-test pilot presets, and accessible validation.
 */
export default function SearchForm({
  onSearch,
  isLoading = false,
  initialValues = null,
  showPresets = true,
  className = '',
}) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues || {
      division: 'DHAKA',
      district: 'DHAKA',
      upazila: '',
      mouza: '',
      dag: '',
      khatian: '',
      subParcelReference: '',
      khatianType: 'RS',
    },
  })

  const selectedDivision = watch('division')
  const selectedDistrict = watch('district')
  const selectedUpazila = watch('upazila')

  const districts = useMemo(() => {
    return selectedDivision ? DISTRICTS_BY_DIVISION[selectedDivision] || [] : []
  }, [selectedDivision])

  const upazilas = useMemo(() => {
    return selectedDistrict ? UPAZILAS_BY_DISTRICT[selectedDistrict] || [] : []
  }, [selectedDistrict])

  const mouzas = useMemo(() => {
    return selectedUpazila ? MOUZAS_BY_UPAZILA[selectedUpazila] || [] : []
  }, [selectedUpazila])

  const handleDivisionChange = (e) => {
    const val = e.target.value
    setValue('division', val)
    setValue('district', '')
    setValue('upazila', '')
    setValue('mouza', '')
  }

  const handleDistrictChange = (e) => {
    const val = e.target.value
    setValue('district', val)
    setValue('upazila', '')
    setValue('mouza', '')
  }

  const handleUpazilaChange = (e) => {
    const val = e.target.value
    setValue('upazila', val)
    setValue('mouza', '')
  }

  const handleApplyPreset = (parcel) => {
    setValue('division', parcel.divisionCode)
    setValue('district', parcel.districtCode)
    setValue('upazila', parcel.upazilaCode)
    setValue('mouza', parcel.mouzaCode)
    setValue('dag', parcel.dagNumber)
    setValue('khatian', parcel.khatianNumber || '')
    setValue('subParcelReference', parcel.subParcelReference || '')
    setValue('khatianType', parcel.khatianType || 'RS')
  }

  const handleFormSubmit = (data) => {
    if (onSearch) {
      onSearch(data)
    }
  }

  const handleReset = () => {
    reset({
      division: 'DHAKA',
      district: 'DHAKA',
      upazila: '',
      mouza: '',
      dag: '',
      khatian: '',
      subParcelReference: '',
      khatianType: 'RS',
    })
  }

  return (
    <div className={`bg-white border border-govt-border rounded-md shadow-sm font-bangla ${className}`}>
      {/* Institutional Card Header */}
      <div className="bg-govt-paper px-4 py-3 border-b border-govt-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-govt-green" aria-hidden="true" />
          <h2 className="text-sm sm:text-base font-bold text-govt-ink-black">
            ভূমির আইনি ঝুঁকি ও নিষেধাজ্ঞা অনুসন্ধান ফরম
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-govt-green bg-green-50 border border-govt-green/30 px-2 py-0.5 rounded">
          জাতীয় ভূমি ডেটাবেজ অনুসন্ধান
        </span>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 sm:p-6 space-y-4">
        {/* Cascade Dropdowns: Division & District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <FormField
            label="বিভাগ (Division)"
            required
            type="select"
            error={errors.division?.message}
            {...register('division', {
              required: 'বিভাগ নির্বাচন আবশ্যক',
              onChange: handleDivisionChange,
            })}
          >
            <option value="">-- বিভাগ নির্বাচন করুন --</option>
            {DIVISIONS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.nameBn} ({d.nameEn})
              </option>
            ))}
          </FormField>

          <FormField
            label="জেলা (District)"
            required
            type="select"
            disabled={!selectedDivision}
            error={errors.district?.message}
            {...register('district', {
              required: 'জেলা নির্বাচন আবশ্যক',
              onChange: handleDistrictChange,
            })}
          >
            <option value="">-- জেলা নির্বাচন করুন --</option>
            {districts.map((d) => (
              <option key={d.code} value={d.code}>
                {d.nameBn} ({d.nameEn})
              </option>
            ))}
          </FormField>

          <FormField
            label="উপজেলা / সার্কেল (Upazila)"
            required
            type="select"
            disabled={!selectedDistrict}
            error={errors.upazila?.message}
            {...register('upazila', {
              required: 'উপজেলা নির্বাচন আবশ্যক',
              onChange: handleUpazilaChange,
            })}
          >
            <option value="">-- উপজেলা নির্বাচন করুন --</option>
            {upazilas.map((u) => (
              <option key={u.code} value={u.code}>
                {u.nameBn} ({u.nameEn})
              </option>
            ))}
          </FormField>

          <FormField
            label="মৌজা ও জেএল নং (Mouza)"
            required
            type="select"
            disabled={!selectedUpazila}
            error={errors.mouza?.message}
            {...register('mouza', { required: 'মৌজা নির্বাচন আবশ্যক' })}
          >
            <option value="">-- মৌজা নির্বাচন করুন --</option>
            {mouzas.map((m) => (
              <option key={m.code} value={m.code}>
                {m.nameBn} (JL-{m.jlNo})
              </option>
            ))}
          </FormField>
        </div>

        {/* Primary Search Keys: Dag & Khatian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-1">
          <FormField
            label="দাগ নম্বর (Dag No.)"
            required
            placeholder="যেমন: ৫০০১"
            leftIcon={MapPin}
            error={errors.dag?.message}
            {...register('dag', {
              required: 'দাগ নম্বর প্রদান আবশ্যক',
              pattern: {
                value: /^[0-9\u09E6-\u09EFa-zA-Z\-_/]+$/,
                message: 'সঠিক দাগ নম্বর লিখুন',
              },
            })}
          />

          <FormField
            label="খতিয়ান নম্বর (Khatian No.)"
            placeholder="যেমন: ১০১ (ঐচ্ছিক)"
            leftIcon={FileText}
            error={errors.khatian?.message}
            {...register('khatian')}
          />

          <FormField
            label="জরিপ ধরন (Survey Type)"
            type="select"
            {...register('khatianType')}
          >
            <option value="RS">আরএস (RS Survey)</option>
            <option value="BS">বিএস / সিটি (BS / City Survey)</option>
            <option value="CS">সিএস (CS Survey)</option>
            <option value="SA">এসএ (SA Survey)</option>
            <option value="NAMZARI">নামজারি ও জমাভাগ (Mutation)</option>
          </FormField>
        </div>

        {/* Advanced / Optional Fields Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-govt-green hover:text-govt-green-dark inline-flex items-center gap-1 focus-visible:outline-none focus-visible:underline"
          >
            <span>{showAdvanced ? 'অতিরিক্ত ফিল্টার লুকান' : 'অতিরিক্ত ফিল্টার যুক্ত করুন (উপ-দাগ / হোল্ডিং)'}</span>
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-2 p-3 bg-gray-50 border border-gray-200 rounded">
              <FormField
                label="উপ-দাগ বা প্লট রেফারেন্স (Sub-Parcel Ref)"
                placeholder="যেমন: PL-1"
                {...register('subParcelReference')}
              />
              <FormField
                label="হোল্ডিং নম্বর (Holding Number)"
                placeholder="যেমন: HD-101/A"
                {...register('holdingNumber')}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isLoading}
              icon={Search}
            >
              অনুসন্ধান ও আইনি যাচাই
            </Button>

            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={isLoading}
              onClick={handleReset}
              icon={RotateCcw}
            >
              রিসেট
            </Button>
          </div>

          <div className="text-[11px] text-gray-500">
            * চিহ্নিত ক্ষেত্রগুলো পূরণ করা বাধ্যতামূলক
          </div>
        </div>

        {/* Pilot Presets (Quick-Fill for Testing) */}
        {showPresets && (
          <div className="mt-4 pt-3 border-t border-govt-border/60 bg-gray-50/70 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-5 rounded-b-md">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2.5">
              <Zap size={14} className="text-govt-gold shrink-0" aria-hidden="true" />
              <span>পাইলট টেস্ট প্রিসেট (এক ক্লিকে নমুনা ডেটা পূরণ করুন):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SEEDED_PARCEL_CATALOG.map((p) => {
                const badgeColor =
                  p.expectedDecision === 'BLOCKED_BY_VALID_ORDER'
                    ? 'border-red-300 bg-red-50 text-red-800'
                    : p.expectedDecision === 'MORTGAGE_REQUIRES_RELEASE'
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : p.expectedDecision === 'CLEAR'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                    : p.expectedDecision === 'PENDING'
                    ? 'border-blue-300 bg-blue-50 text-blue-800'
                    : 'border-gray-300 bg-gray-50 text-gray-800'

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="text-left text-xs p-2 rounded border border-gray-200 bg-white hover:border-govt-green hover:shadow-xs transition-all flex flex-col justify-between group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-govt-green"
                  >
                    <div className="font-semibold text-govt-ink-black group-hover:text-govt-green flex items-center justify-between">
                      <span>{p.labelBn}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
                      <span>দাগ: {p.dagNumber} • খতিয়ান: {p.khatianNumber}</span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${badgeColor}`}>
                        {p.expectedDecision === 'BLOCKED_BY_VALID_ORDER'
                          ? 'নিষেধাজ্ঞা'
                          : p.expectedDecision === 'MORTGAGE_REQUIRES_RELEASE'
                          ? 'বন্ধকযুক্ত'
                          : p.expectedDecision === 'CLEAR'
                          ? 'ঝুঁকিমুক্ত'
                          : p.expectedDecision === 'PENDING'
                          ? 'বিচারাধীন'
                          : 'অজানা'}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
