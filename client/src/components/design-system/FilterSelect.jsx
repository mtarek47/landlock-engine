import { forwardRef } from 'react'
import { Filter, ChevronDown, X } from 'lucide-react'
import { toBengaliNumber } from './constants'

/**
 * FilterSelect Component
 * Standard 44-48px dropdown selector for server/client filtering.
 */
const FilterSelect = forwardRef(function FilterSelect(
  {
    value = '',
    onChange,
    options = [],
    placeholder = 'সকল নির্বাচন করুন',
    label,
    showLabel = false,
    allLabel = 'সকল (All)',
    allValue = '',
    className = '',
    id = 'filter-select',
    disabled = false,
    icon: Icon = Filter,
    ...rest
  },
  ref
) {
  const handleChange = (e) => {
    if (onChange) onChange(e.target.value)
  }

  const handleClear = (e) => {
    e.stopPropagation()
    if (onChange) onChange(allValue)
  }

  const hasValue = value !== '' && value !== allValue

  return (
    <div className={`font-bangla ${className}`}>
      {showLabel ? (
        <label htmlFor={id} className="label text-xs font-bold text-gray-800 mb-1 block">
          {label}
        </label>
      ) : label ? (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      ) : null}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-gray-400 pointer-events-none flex items-center justify-center">
            <Icon size={16} aria-hidden="true" />
          </div>
        )}

        <select
          ref={ref}
          id={id}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full min-h-[44px] h-[44px] sm:h-[46px] ${
            Icon ? 'pl-9' : 'pl-3'
          } pr-9 text-xs sm:text-sm bg-white border border-govt-border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green transition-all appearance-none disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-bangla select-none cursor-pointer shadow-2xs ${
            hasValue ? 'font-semibold text-gray-900 border-govt-green/70 bg-green-50/20' : ''
          }`}
          {...rest}
        >
          {allLabel && <option value={allValue}>{allLabel}</option>}
          {options.map((opt) => {
            const optVal = typeof opt === 'string' ? opt : opt.value
            const optLabel = typeof opt === 'string' ? opt : opt.label
            const count = typeof opt === 'object' && opt.count !== undefined ? opt.count : null
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
                {count !== null ? ` (${toBengaliNumber(count)})` : ''}
              </option>
            )
          })}
        </select>

        {/* Right Arrow / Clear Button */}
        <div className="absolute right-3 flex items-center gap-1">
          {hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
              title="ফিল্টার মুছুন"
              aria-label="ফিল্টার নির্বাচন বাতিল করুন"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className="text-gray-400 pointer-events-none" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
})

export default FilterSelect
