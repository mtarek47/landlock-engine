import {
  FileText,
  Unlock,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Building,
  Calendar,
  AlertCircle,
  FileCheck,
} from 'lucide-react'
import StatusBadge from '../design-system/StatusBadge'
import Button from '../design-system/Button'
import {
  toBengaliNumber,
  MORTGAGE_SCOPE_TYPES_BN,
} from '../design-system/constants'

export default function MortgageRegisterTable({
  mortgages,
  isLoading,
  page,
  pageSize,
  totalPages,
  totalRecords,
  onPageChange,
  onPageSizeChange,
  onInspect,
  onReleaseClick,
  onVerifyRegistry,
  onResetFilters,
}) {
  if (isLoading) {
    return (
      <div className="bg-white border border-govt-border rounded-lg p-6 shadow-xs space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!mortgages || mortgages.length === 0) {
    return (
      <div className="bg-white border border-govt-border rounded-lg p-8 sm:p-12 text-center shadow-xs font-bangla space-y-3">
        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-500 mx-auto flex items-center justify-center">
          <FileText size={24} aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-gray-800">
          কোনো বন্ধকী রেকর্ড পাওয়া যায়নি
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          আপনার অনুসন্ধানের শর্তাবলির সাথে মিল সম্পন্ন কোনো বন্ধকী লিয়েন পাওয়া যায়নি। অনুসন্ধান ফিল্টার পরিবর্তন করুন বা নতুন বন্ধক নিবন্ধন করুন।
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            সকল ফিল্টার মুছুন
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-govt-border rounded-lg shadow-xs overflow-hidden font-bangla">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" role="table">
          <thead>
            <tr className="bg-govt-paper border-b border-govt-border text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
              <th scope="col" className="py-3 px-3 sm:px-4">
                ঋণ দলিল / রেফারেন্স
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                জমির তফসিল ও অবস্থান
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                বন্ধকীর পরিমাণ ও পরিধি
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                কার্যকর মেয়াদ
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                আইনি স্থিতি
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4">
                দায়মুক্তি / অনাপত্তি বিবরণ
              </th>
              <th scope="col" className="py-3 px-3 sm:px-4 text-right">
                কার্যক্রম
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
            {mortgages.map((item) => {
              const parcel = item.parcel
              const isReleased = item.status === 'RELEASED'
              const isPendingRelease = item.effectiveUiStatus === 'RELEASE_PENDING'
              const isActive = item.status === 'ACTIVE' && !isPendingRelease
              const isDisputed = item.status === 'DISPUTED'

              // Scope Label
              const scopeLabel =
                MORTGAGE_SCOPE_TYPES_BN[item.scopeType] || item.scopeType || 'সম্পূর্ণ দাগ'

              return (
                <tr
                  key={item.id}
                  className="hover:bg-green-50/40 transition-colors group"
                >
                  {/* Column 1: Lender Reference */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    <div className="font-bold text-gray-900 font-mono text-xs sm:text-sm">
                      {item.lenderReference || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                      <Building size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">ডেল্টা কমার্শিয়াল ব্যাংক</span>
                    </div>
                    <div className="text-[10px] text-gray-400 font-sans mt-0.5">
                      আইডি: {item.id.slice(0, 8)}...
                    </div>
                  </td>

                  {/* Column 2: Land Parcel Schedule */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    {parcel ? (
                      <div className="space-y-0.5">
                        <div className="font-semibold text-gray-900">
                          {parcel.mouzaCode} (জেএল: {toBengaliNumber(parcel.jlNumber)})
                        </div>
                        <div className="text-xs text-gray-600">
                          উপজেলা: {parcel.upazilaCode}, জেলা: {parcel.districtCode}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-govt-green font-semibold mt-0.5">
                          <span>দাগ নং: <strong className="font-sans">{toBengaliNumber(parcel.dagNumber)}</strong></span>
                          <span>•</span>
                          <span>খতিয়ান: <strong className="font-sans">{toBengaliNumber(parcel.khatianNumber)}</strong> ({parcel.khatianType})</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-400 font-mono">
                        পার্সেল আইডি: {item.parcelId?.slice(0, 8)}...
                      </div>
                    )}
                  </td>

                  {/* Column 3: Encumbrance details */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    <div className="font-semibold text-gray-900">
                      {item.securedArea ? (
                        <>
                          <span className="font-sans font-bold">{toBengaliNumber(item.securedArea)}</span> শতক/শতাংশ
                        </>
                      ) : (
                        'সম্পূর্ণ তফসিল'
                      )}
                    </div>
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      হিস্যা: <span className="font-sans font-medium">{item.securedShare ? toBengaliNumber(item.securedShare) : '১.০ (পূর্ণ)'}</span>
                    </div>
                    <div className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded">
                      {scopeLabel}
                    </div>
                  </td>

                  {/* Column 4: Effective Dates */}
                  <td className="py-3 px-3 sm:px-4 align-top text-xs text-gray-700">
                    <div className="flex items-center gap-1 font-sans">
                      <Calendar size={12} className="text-gray-400 shrink-0" aria-hidden="true" />
                      <span>{item.effectiveFrom || 'N/A'}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 font-sans mt-0.5">
                      হতে {item.effectiveUntil || 'অনির্দিষ্টকাল'}
                    </div>
                  </td>

                  {/* Column 5: Status */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    {isReleased ? (
                      <StatusBadge status="RELEASED" label="দায়মুক্ত / অবমুক্ত" size="sm" />
                    ) : isPendingRelease ? (
                      <StatusBadge status="RELEASE_PENDING" label="অবমুক্তি প্রক্রিয়াধীন" size="sm" />
                    ) : isDisputed ? (
                      <StatusBadge status="DISPUTED" label="বিরোধপূর্ণ বন্ধক" size="sm" />
                    ) : (
                      <StatusBadge status="MORTGAGE_REQUIRES_RELEASE" label="সক্রিয় বন্ধক" size="sm" />
                    )}
                  </td>

                  {/* Column 6: Release Reference / NOC status */}
                  <td className="py-3 px-3 sm:px-4 align-top">
                    {isReleased ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-emerald-800 font-semibold text-xs">
                          <FileCheck size={13} className="text-emerald-600 shrink-0" aria-hidden="true" />
                          <span>যাচাইকৃত অবমুক্তি</span>
                        </div>
                        <div className="font-mono text-[11px] text-gray-700 truncate max-w-[160px]" title={item.releaseReference}>
                          {item.releaseReference || 'Discharge confirmed'}
                        </div>
                      </div>
                    ) : isPendingRelease ? (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-blue-800 font-semibold text-xs">
                          <AlertCircle size={13} className="text-blue-600 shrink-0" aria-hidden="true" />
                          <span>দাখিলকৃত অনাপত্তিপত্র</span>
                        </div>
                        <div className="text-[11px] text-gray-600 font-mono truncate max-w-[160px]" title={item.submittedReleaseDoc?.releaseReference}>
                          স্মারক: {item.submittedReleaseDoc?.releaseReference || 'দাখিলকৃত'}
                        </div>
                        <div className="text-[10px] text-amber-700 font-bangla">
                          সিস্টেমে অবমুক্তকরণ অপেক্ষমাণ
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold inline-block">
                        দায় বলবৎ
                      </span>
                    )}
                  </td>

                  {/* Column 7: Actions */}
                  <td className="py-3 px-3 sm:px-4 align-top text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onInspect(item)}
                        leftIcon={FileText}
                        title="নথি বিবরণ ও ডকেট দেখুন"
                      >
                        ডকেট
                      </Button>

                      {isActive && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onReleaseClick(item)}
                          leftIcon={Unlock}
                          className="text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                          title="অনাপত্তিপত্র দাখিল বা বন্ধক অবমুক্ত করুন"
                        >
                          অবমুক্তি
                        </Button>
                      )}

                      {isPendingRelease && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onReleaseClick(item)}
                          leftIcon={Unlock}
                          className="bg-emerald-700 hover:bg-emerald-800"
                          title="চূড়ান্ত অবমুক্তি অনুমোদন ও বলবৎ করুন"
                        >
                          চূড়ান্ত ছাড়
                        </Button>
                      )}

                      {parcel && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onVerifyRegistry(parcel)}
                          leftIcon={ClipboardCheck}
                          title="রেজিস্ট্রি গেটকিপারে জমি যাচাই করুন"
                          className="text-gray-600 hover:text-govt-green"
                        >
                          যাচাই
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="p-3 sm:p-4 bg-govt-paper border-t border-govt-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <span>প্রতি পৃষ্ঠায়:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="py-1 px-2 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-govt-green"
          >
            <option value={5}>৫</option>
            <option value={10}>১০</option>
            <option value={20}>২০</option>
            <option value={50}>৫০</option>
          </select>
          <span className="text-gray-500">
            (মোট <strong className="font-sans text-gray-900">{toBengaliNumber(totalRecords)}</strong> টি রেকর্ডের মধ্যে{' '}
            <strong className="font-sans text-gray-900">
              {toBengaliNumber(Math.min((page - 1) * pageSize + 1, totalRecords))} -{' '}
              {toBengaliNumber(Math.min(page * pageSize, totalRecords))}
            </strong>)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            leftIcon={ChevronLeft}
          >
            পূর্ববর্তী
          </Button>

          <span className="font-semibold text-gray-700 px-2">
            পৃষ্ঠা <span className="font-sans">{toBengaliNumber(page)}</span> /{' '}
            <span className="font-sans">{toBengaliNumber(totalPages)}</span>
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            rightIcon={ChevronRight}
          >
            পরবর্তী
          </Button>
        </div>
      </div>
    </div>
  )
}
