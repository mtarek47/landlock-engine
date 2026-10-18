import { useState } from 'react'
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Check,
  ChevronRight,
  Inbox,
  AlertCircle,
} from 'lucide-react'
import LoadingSkeleton from './LoadingSkeleton'
import EmptyState from './EmptyState'
import ErrorState from './ErrorState'
import Pagination from './Pagination'

/**
 * DataTable Component
 * Configurable data table supporting server-side sorting, pagination, row selection,
 * semantic table markup on desktop, and accessible card view on mobile.
 */
export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
  isError = false,
  error = null,
  onRetry = null,
  // Sorting
  sortKey = '',
  sortDirection = 'asc',
  onSort = null,
  // Pagination
  pagination = null, // { page, pageSize, totalRecords, onPageChange, onPageSizeChange }
  // Selection
  selectedRows = [],
  onSelectRow = null,
  onSelectAll = null,
  // Row Click & Keys
  onRowClick = null,
  rowKey = 'id',
  // Custom Empty / Error
  emptyTitle = 'কোনো রেকর্ড বা তথ্য পাওয়া যায়নি',
  emptyDescription = 'বর্তমান ফিল্টার বা অনুসন্ধানের অধীনে কোনো তথ্য বিদ্যমান নেই।',
  emptyAction = null,
  // Mobile Display
  mobileCardRenderer = null,
  className = '',
}) {
  // Helper to extract row key
  const getRowId = (row, index) => {
    if (typeof rowKey === 'function') return rowKey(row, index)
    return row[rowKey] !== undefined ? row[rowKey] : index
  }

  // Helper to extract cell value
  const getCellValue = (row, col) => {
    if (typeof col.accessor === 'function') {
      return col.accessor(row)
    }
    if (typeof col.accessor === 'string') {
      return row[col.accessor]
    }
    return row[col.key]
  }

  const isAllSelected =
    data.length > 0 && data.every((row, idx) => selectedRows.includes(getRowId(row, idx)))
  const isSomeSelected =
    data.length > 0 &&
    data.some((row, idx) => selectedRows.includes(getRowId(row, idx))) &&
    !isAllSelected

  // Handle Header Sort Click
  const handleSortClick = (col) => {
    if (!col.sortable || !onSort) return
    onSort(col.key || col.accessor)
  }

  // 1. Loading State
  if (isLoading) {
    return (
      <div className={`space-y-3 font-bangla ${className}`}>
        <LoadingSkeleton
          type="table"
          rows={pagination?.pageSize ? Math.min(pagination.pageSize, 6) : 6}
          columns={columns.length + (onSelectRow ? 1 : 0)}
        />
      </div>
    )
  }

  // 2. Error State
  if (isError) {
    return (
      <div className={`p-4 font-bangla ${className}`}>
        <ErrorState
          title="ডেটা লোড করতে ব্যর্থ হয়েছে"
          message={
            error?.response?.data?.message ||
            error?.message ||
            'সার্ভার থেকে টেবিলের রেকর্ড সংগ্রহ করার সময় একটি ত্রুটি ঘটেছে।'
          }
          errorCode={error?.response?.data?.code || error?.code}
          onRetry={onRetry}
          retryText="পুনরায় রেকর্ড লোড করুন"
          variant="card"
        />
      </div>
    )
  }

  // 3. Empty State
  if (!data || data.length === 0) {
    return (
      <div className={`font-bangla ${className}`}>
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          icon={Inbox}
          action={emptyAction}
        />
      </div>
    )
  }

  return (
    <div className={`w-full bg-white rounded-xl border border-govt-border shadow-xs overflow-hidden font-bangla ${className}`}>
      
      {/* Desktop Semantic Table (md screens and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-gray-100/90 text-gray-700 border-b border-govt-border select-none">
            <tr>
              {/* Optional Row Selection Header */}
              {onSelectAll && (
                <th scope="col" className="w-10 px-3.5 py-3 text-center">
                  <label className="sr-only">সকল রেকর্ড নির্বাচন করুন</label>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = isSomeSelected
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-govt-green focus:ring-govt-green cursor-pointer"
                  />
                </th>
              )}

              {/* Column Headers */}
              {columns.map((col) => {
                const isSorted = sortKey === (col.key || col.accessor)
                const alignClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left'

                return (
                  <th
                    key={col.key || col.accessor}
                    scope="col"
                    aria-sort={
                      !col.sortable
                        ? undefined
                        : isSorted
                        ? sortDirection === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    className={`px-4 py-3.5 font-bold uppercase tracking-wider text-[11px] text-gray-600 ${alignClass} ${
                      col.sortable ? 'cursor-pointer hover:bg-gray-200/80 transition-colors' : ''
                    } ${col.className || ''}`}
                    style={col.minWidth ? { minWidth: col.minWidth } : undefined}
                    onClick={() => handleSortClick(col)}
                  >
                    <div
                      className={`inline-flex items-center gap-1.5 ${
                        col.align === 'right'
                          ? 'justify-end'
                          : col.align === 'center'
                          ? 'justify-center'
                          : 'justify-start'
                      }`}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-gray-400 shrink-0">
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={13} className="text-govt-green" />
                            ) : (
                              <ArrowDown size={13} className="text-govt-green" />
                            )
                          ) : (
                            <ArrowUpDown size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-gray-800">
            {data.map((row, index) => {
              const rowId = getRowId(row, index)
              const isSelected = selectedRows.includes(rowId)

              return (
                <tr
                  key={rowId}
                  onClick={() => onRowClick && onRowClick(row, index)}
                  className={`transition-colors ${
                    isSelected ? 'bg-green-50/60' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'
                  } ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-green-50/80 focus-visible:bg-green-50 focus-visible:outline-none'
                      : 'hover:bg-gray-50/80'
                  }`}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault()
                      onRowClick(row, index)
                    }
                  }}
                >
                  {/* Selection Checkbox */}
                  {onSelectRow && (
                    <td
                      className="w-10 px-3.5 py-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectRow(rowId, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-govt-green focus:ring-govt-green cursor-pointer"
                        aria-label={`রেকর্ড ${rowId} নির্বাচন করুন`}
                      />
                    </td>
                  )}

                  {/* Data Cells */}
                  {columns.map((col) => {
                    const value = getCellValue(row, col)
                    const alignClass =
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left'

                    return (
                      <td
                        key={col.key || col.accessor}
                        className={`px-4 py-3 leading-relaxed ${alignClass} ${col.className || ''}`}
                      >
                        {col.render ? col.render(value, row, index) : value ?? '—'}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Accessible Card View (Screens < md) */}
      <div className="md:hidden divide-y divide-gray-200">
        {data.map((row, index) => {
          const rowId = getRowId(row, index)
          const isSelected = selectedRows.includes(rowId)

          if (mobileCardRenderer) {
            return (
              <div
                key={rowId}
                onClick={() => onRowClick && onRowClick(row, index)}
                className={`p-4 ${isSelected ? 'bg-green-50/60' : 'bg-white'}`}
              >
                {mobileCardRenderer(row, index, isSelected)}
              </div>
            )
          }

          // Default automatic mobile card rendering
          return (
            <div
              key={rowId}
              onClick={() => onRowClick && onRowClick(row, index)}
              className={`p-4 space-y-2 transition-colors ${
                isSelected ? 'bg-green-50/60' : 'bg-white'
              } ${onRowClick ? 'cursor-pointer active:bg-gray-100' : ''}`}
            >
              {onSelectRow && (
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <label className="text-xs font-semibold text-gray-500 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        onSelectRow(rowId, e.target.checked)
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-govt-green focus:ring-govt-green"
                    />
                    <span>রেকর্ড নির্বাচন</span>
                  </label>
                  {onRowClick && <ChevronRight size={16} className="text-gray-400" />}
                </div>
              )}

              {columns.map((col) => {
                const value = getCellValue(row, col)
                return (
                  <div key={col.key || col.accessor} className="flex justify-between items-start text-xs gap-3">
                    <span className="font-semibold text-gray-500 shrink-0">{col.header}:</span>
                    <span className="text-right text-gray-900 font-medium">
                      {col.render ? col.render(value, row, index) : value ?? '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Embedded Server / Client Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          totalRecords={pagination.totalRecords}
          onPageChange={pagination.onPageChange}
          onPageSizeChange={pagination.onPageSizeChange}
          disabled={isLoading}
        />
      )}
    </div>
  )
}
