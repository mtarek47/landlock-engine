import { Loader2 } from 'lucide-react'

const SPINNER_SIZES = {
  sm: 18,
  md: 28,
  lg: 38,
}

export default function LoadingState({
  text = 'তথ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...',
  message,
  subtext,
  size = 'md',
  variant = 'card',
  className = '',
}) {
  const displayText = message || text
  const spinnerSize = SPINNER_SIZES[size] || SPINNER_SIZES.md

  if (variant === 'skeleton') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label={displayText}
        className={`w-full space-y-3 p-4 bg-white rounded-lg border border-govt-border ${className}`}
      >
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse motion-reduce:animate-none" />
        <div className="h-8 bg-gray-100 rounded w-full animate-pulse motion-reduce:animate-none" />
        <div className="grid grid-cols-3 gap-3">
          <div className="h-16 bg-gray-100 rounded animate-pulse motion-reduce:animate-none" />
          <div className="h-16 bg-gray-100 rounded animate-pulse motion-reduce:animate-none" />
          <div className="h-16 bg-gray-100 rounded animate-pulse motion-reduce:animate-none" />
        </div>
        <span className="sr-only">{displayText}</span>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={`inline-flex items-center gap-2 text-govt-green text-sm font-bangla ${className}`}
      >
        <Loader2
          size={spinnerSize}
          className="animate-spin motion-reduce:animate-none shrink-0 text-govt-green"
          aria-hidden="true"
        />
        <span>{displayText}</span>
      </div>
    )
  }

  if (variant === 'fullscreen') {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="fixed inset-0 z-50 bg-govt-paper/80 backdrop-blur-sm flex flex-col items-center justify-center p-4"
      >
        <div className="bg-white border border-govt-border rounded-lg shadow-sm p-8 max-w-sm w-full text-center flex flex-col items-center">
          <Loader2
            size={40}
            className="animate-spin motion-reduce:animate-none text-govt-green mb-3"
            aria-hidden="true"
          />
          <h2 className="text-base font-bold text-gray-900 font-bangla">{displayText}</h2>
          {subtext && <p className="text-xs text-gray-500 mt-1 font-bangla">{subtext}</p>}
        </div>
      </div>
    )
  }

  // Default 'card' variant
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={`flex flex-col items-center justify-center py-10 px-4 bg-white rounded-lg border border-govt-border shadow-sm text-center ${className}`}
    >
      <Loader2
        size={spinnerSize}
        className="animate-spin motion-reduce:animate-none text-govt-green mb-3"
        aria-hidden="true"
      />
      <p className="text-gray-800 text-sm font-medium font-bangla">{displayText}</p>
      {subtext && (
        <p className="text-gray-500 text-xs mt-1 font-bangla max-w-md">{subtext}</p>
      )}
    </div>
  )
}
