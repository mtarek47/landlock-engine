import { useState } from 'react'
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Calendar,
  Eye,
  ShieldAlert,
} from 'lucide-react'
import StatusBadge from '../design-system/StatusBadge'
import EmptyState from '../design-system/EmptyState'
import {
  ORDER_TYPES_BN,
  TRANSACTION_SCOPES_BN,
  CASE_TYPES_BN,
  toBengaliNumber,
} from '../design-system/constants'

export default function OrderTable({
  orders = [],
  selectedOrderId,
  onSelectOrder,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  if (!orders || orders.length === 0) {
    return (
      <div className="card border border-govt-border bg-white rounded-lg p-6">
        <EmptyState
          title="কোনো আদেশ পাওয়া যায়নি"
          description="অনুসন্ধানের মানদণ্ড অনুযায়ী কোনো বিচারিক আদেশ বা দেওয়ানি মামলা তালিকায় নেই।"
          variant="search"
        />
      </div>
    )
  }

  // Pagination calculations
  const totalPages = Math.ceil(orders.length / pageSize)
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const paginatedOrders = orders.slice(startIndex, startIndex + pageSize)

  return (
    <div className="card border border-govt-border bg-white rounded-lg shadow-2xs overflow-hidden">
      {/* Table Title Bar */}
      <div className="p-4 bg-gray-50/70 border-b border-govt-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-govt-green" aria-hidden="true" />
          <h2 className="text-sm font-bold text-gray-900">
            বিচারিক আদেশ ও মোকদ্দমা তালিকা (Court Dockets)
          </h2>
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono font-semibold">
            {toBengaliNumber(orders.length)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>প্রতি পৃষ্ঠায়:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
            aria-label="প্রতি পৃষ্ঠায় আদেশের সংখ্যা"
            className="py-1 px-2 border border-govt-border rounded bg-white text-gray-800 text-xs focus:outline-none focus:ring-1 focus:ring-govt-green"
          >
            <option value={5}>৫টি</option>
            <option value={10}>১০টি</option>
            <option value={20}>২০টি</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100/80 text-gray-700 border-b border-govt-border font-semibold uppercase tracking-wider text-[11px]">
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">
                মোকদ্দমা নং ও ধরন
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">
                আদেশের রেফারেন্স
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">
                সংশ্লিষ্ট ভূমি পার্সেল
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">
                আদেশের ধরন
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">
                স্থগিত লেনদেন স্কোপ
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap">
                কার্যকর মেয়াদ
              </th>
              <th scope="col" className="py-3 px-3.5 whitespace-nowrap text-center">
                স্থিতি
              </th>
              <th scope="col" className="py-3 px-3.5 text-right whitespace-nowrap">
                পদক্ষেপ
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-govt-border/70 font-bangla">
            {paginatedOrders.map((order) => {
              const isSelected = selectedOrderId === order.id
              const parcel = order.linkedParcel

              return (
                <tr
                  key={order.id}
                  onClick={() => onSelectOrder(order.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-green-50/80 hover:bg-green-50 font-medium'
                      : 'hover:bg-gray-50/90'
                  }`}
                >
                  {/* Case Number & Type */}
                  <td className="py-3 px-3.5 align-top">
                    <div className="font-mono font-bold text-gray-900 text-xs">
                      {order.caseNumber}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {CASE_TYPES_BN[order.caseType] || order.caseType}
                    </div>
                  </td>

                  {/* Order Reference */}
                  <td className="py-3 px-3.5 align-top">
                    <div className="font-mono font-bold text-govt-green text-xs">
                      {order.orderReference}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                      <Calendar size={11} className="text-gray-400" />
                      <span>{order.orderDate}</span>
                    </div>
                  </td>

                  {/* Linked Parcel */}
                  <td className="py-3 px-3.5 align-top">
                    {parcel ? (
                      <div>
                        <div className="font-semibold text-gray-800 text-xs flex items-center gap-1">
                          <MapPin size={12} className="text-govt-green shrink-0" />
                          <span>
                            {parcel.upazilaCode || 'ঢাকা'}, খতিয়ান:{' '}
                            <span className="font-sans font-bold">
                              {toBengaliNumber(parcel.khatianNumber)}
                            </span>
                          </span>
                        </div>
                        <div className="text-[11px] text-gray-600 mt-0.5 font-sans">
                          দাগ: {toBengaliNumber(parcel.dagNumber)} | {toBengaliNumber(parcel.recordedArea)} শতাংশ
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">সংযুক্ত নেই</span>
                    )}
                  </td>

                  {/* Order Type */}
                  <td className="py-3 px-3.5 align-top text-gray-800 font-medium text-xs">
                    {ORDER_TYPES_BN[order.orderType] || order.orderType}
                  </td>

                  {/* Transaction Scope */}
                  <td className="py-3 px-3.5 align-top">
                    <span className="font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                      {order.transactionScope}
                    </span>
                  </td>

                  {/* Effective Dates */}
                  <td className="py-3 px-3.5 align-top text-gray-700 text-xs font-sans">
                    <div>শুরু: {toBengaliNumber(order.effectiveFrom)}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      মেয়াদ:{' '}
                      {order.effectiveUntil
                        ? toBengaliNumber(order.effectiveUntil)
                        : 'অনির্দিষ্টকাল / নিষ্পত্তি পর্যন্ত'}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3.5 align-top text-center whitespace-nowrap">
                    <StatusBadge
                      status={order.approvalStatus}
                      size="sm"
                    />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 align-top text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectOrder(order.id)
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-govt-green text-white border-govt-green shadow-2xs'
                          : 'bg-white text-gray-700 border-govt-border hover:bg-gray-100'
                      }`}
                      aria-label={`${order.orderReference} নথির বিস্তারিত দেখুন`}
                    >
                      <Eye size={13} />
                      <span>পর্যালোচনা</span>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 bg-gray-50/80 border-t border-govt-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-600 font-bangla">
        <div>
          প্রদর্শন:{' '}
          <strong className="text-gray-900 font-bold font-sans">
            {toBengaliNumber(startIndex + 1)}
          </strong>{' '}
          হতে{' '}
          <strong className="text-gray-900 font-bold font-sans">
            {toBengaliNumber(Math.min(startIndex + pageSize, orders.length))}
          </strong>
          , সর্বমোট{' '}
          <strong className="text-gray-900 font-bold font-sans">
            {toBengaliNumber(orders.length)}
          </strong>{' '}
          টি
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safeCurrentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded border border-govt-border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="পূর্ববর্তী পৃষ্ঠা"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs px-2 text-gray-700 font-semibold font-sans">
            পৃষ্ঠা {toBengaliNumber(safeCurrentPage)} / {toBengaliNumber(totalPages)}
          </span>

          <button
            type="button"
            disabled={safeCurrentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded border border-govt-border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
            aria-label="পরবর্তী পৃষ্ঠা"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
