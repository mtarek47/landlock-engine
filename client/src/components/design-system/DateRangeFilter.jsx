import { useState } from 'react'
import { Calendar, X, Clock } from 'lucide-react'

/**
 * DateRangeFilter Component
 * Provides start-date, end-date selectors, quick presets, and clear button.
 */
export default function DateRangeFilter({
  startDate = '',
  endDate = '',
  onChange,
  onClear,
  label = 'তারিখ পরিসীমা (Date Range)',
  showPresets = true,
  className = '',
}) {
  const PRESETS = [
    {
      label: 'আজ',
      getRange: () => {
        const today = new Date().toISOString().split('T')[0]
        return { start: today, end: today }
      },
    },
    {
      label: 'বিগত ৭ দিন',
      getRange: () => {
        const end = new Date().toISOString().split('T')[0]
        const d = new Date()
        d.setDate(d.getDate() - 7)
        const start = d.toISOString().split('T')[0]
        return { start, end }
      },
    },
    {
      label: 'বিগত ৩০ দিন',
      getRange: () => {
        const end = new Date().toISOString().split('T')[0]
        const d = new Date()
        d.setDate(d.getDate() - 30)
        const start = d.toISOString().split('T')[0]
        return { start, end }
      },
    },
    {
      label: 'চলতি মাস',
      getRange: () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
        const end = now.toISOString().split('T')[0]
        return { start, end }
      },
    },
  ]

  const handleStartChange = (e) => {
    if (onChange) {
      onChange({ startDate: e.target.value, endDate })
    }
  }

  const handleEndChange = (e) => {
    if (onChange) {
      onChange({ startDate, endDate: e.target.value })
    }
  }

  const applyPreset = (preset) => {
    const range = preset.getRange()
    if (onChange) {
      onChange({ startDate: range.start, endDate: range.end })
    }
  }

  const handleClear = () => {
    if (onChange) {
      onChange({ startDate: '', endDate: '' })
    }
    if (onClear) onClear()
  }

  const hasRange = Boolean(startDate || endDate)

  return (
    <div className={`space-y-2 font-bangla ${className}`}>
      {/* Label and Clear */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-gray-700 flex items-center gap-1.5">
          <Calendar size={14} className="text-govt-green" />
          <span>{label}</span>
        </span>
        {hasRange && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[11px] text-gray-500 hover:text-red-700 inline-flex items-center gap-1 font-semibold transition-colors"
          >
            <X size={12} />
            <span>তারিখ মুছুন</span>
          </button>
        )}
      </div>

      {/* Date Inputs (44-48px height) */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="filter-start-date" className="sr-only">শুরুর তারিখ</label>
          <input
            id="filter-start-date"
            type="date"
            value={startDate}
            onChange={handleStartChange}
            className="w-full min-h-[44px] h-[44px] px-3 text-xs bg-white border border-govt-border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green font-sans shadow-2xs"
            title="শুরুর তারিখ"
          />
        </div>
        <div>
          <label htmlFor="filter-end-date" className="sr-only">শেষের তারিখ</label>
          <input
            id="filter-end-date"
            type="date"
            value={endDate}
            onChange={handleEndChange}
            min={startDate || undefined}
            className="w-full min-h-[44px] h-[44px] px-3 text-xs bg-white border border-govt-border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green font-sans shadow-2xs"
            title="শেষের তারিখ"
          />
        </div>
      </div>

      {/* Quick Presets */}
      {showPresets && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-[10px] font-semibold px-2 py-1 rounded bg-gray-100 hover:bg-green-50 hover:text-govt-green text-gray-700 border border-gray-200 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
