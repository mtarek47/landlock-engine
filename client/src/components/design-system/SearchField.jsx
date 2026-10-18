import { forwardRef, useState, useEffect } from 'react'
import { Search, X, Loader2 } from 'lucide-react'

/**
 * SearchField Component
 * Standard 44-48px input field with debounced search, clear button, and accessible labels.
 */
const SearchField = forwardRef(function SearchField(
  {
    value = '',
    onChange,
    onSearch,
    placeholder = 'অনুসন্ধান করুন...',
    label = 'অনুসন্ধান',
    showLabel = false,
    debounceMs = 300,
    isLoading = false,
    className = '',
    id = 'search-input',
    disabled = false,
    ...rest
  },
  ref
) {
  const [internalValue, setInternalValue] = useState(value)

  // Sync with external value changes
  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // Debounced search trigger
  useEffect(() => {
    if (debounceMs <= 0) return
    const timer = setTimeout(() => {
      if (internalValue !== value) {
        if (onChange) onChange(internalValue)
        if (onSearch) onSearch(internalValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [internalValue, debounceMs, onChange, onSearch, value])

  const handleChange = (e) => {
    const val = e.target.value
    setInternalValue(val)
    if (debounceMs <= 0) {
      if (onChange) onChange(val)
      if (onSearch) onSearch(val)
    }
  }

  const handleClear = () => {
    setInternalValue('')
    if (onChange) onChange('')
    if (onSearch) onSearch('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (onSearch) onSearch(internalValue)
    }
  }

  return (
    <div className={`w-full font-bangla ${className}`}>
      {showLabel ? (
        <label htmlFor={id} className="label text-xs font-bold text-gray-800 mb-1 block">
          {label}
        </label>
      ) : (
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {/* Left search icon or loading spinner */}
        <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
          {isLoading ? (
            <Loader2 size={18} className="animate-spin text-govt-green" aria-hidden="true" />
          ) : (
            <Search size={18} aria-hidden="true" />
          )}
        </div>

        {/* Input element with standard 44-48px height */}
        <input
          ref={ref}
          id={id}
          type="search"
          role="searchbox"
          value={internalValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full min-h-[44px] h-[44px] sm:h-[46px] pl-10 pr-10 text-xs sm:text-sm bg-white border border-govt-border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-govt-green focus:border-govt-green transition-all disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed font-sans select-text shadow-2xs"
          {...rest}
        />

        {/* Right clear button */}
        {internalValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-govt-green transition-colors cursor-pointer"
            aria-label="অনুসন্ধান টেক্সট মুছুন"
            title="মুছুন"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
})

export default SearchField
