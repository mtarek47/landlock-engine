import { AlertCircle, AlertOctagon, RotateCcw } from 'lucide-react'
import Button from './Button'

export default function ErrorState({
  title = 'একটি সমস্যা দেখা দিয়েছে',
  message = 'অনুরোধটি সম্পন্ন করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।',
  errorCode,
  onRetry,
  retryText = 'পুনরায় চেষ্টা করুন',
  action,
  variant = 'card',
  className = '',
}) {
  if (variant === 'inline') {
    return (
      <div
        role="alert"
        className={`flex items-center gap-2 text-rose-800 bg-red-50/80 border border-red-300 px-3 py-2 rounded text-xs font-bangla ${className}`}
      >
        <AlertCircle size={16} className="shrink-0 text-govt-red" aria-hidden="true" />
        <span className="flex-1">{message}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-govt-red font-semibold hover:underline shrink-0 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-govt-red"
          >
            {retryText}
          </button>
        )}
      </div>
    )
  }

  if (variant === 'banner') {
    return (
      <div
        role="alert"
        className={`bg-red-50 border-l-4 border-l-govt-red border-y border-r border-red-200 p-4 rounded-r-lg font-bangla flex items-start gap-3 shadow-sm ${className}`}
      >
        <AlertOctagon size={22} className="shrink-0 text-govt-red mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-red-950">{title}</h3>
          <p className="text-xs text-red-900 mt-1 leading-relaxed">{message}</p>
          {errorCode && (
            <p className="text-[11px] font-mono text-red-700 mt-1 bg-red-100/60 inline-block px-1.5 py-0.5 rounded">
              কোড: {errorCode}
            </p>
          )}
          {(onRetry || action) && (
            <div className="mt-3 flex items-center gap-2">
              {onRetry && (
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={RotateCcw}
                  onClick={onRetry}
                >
                  {retryText}
                </Button>
              )}
              {action}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default 'card' variant
  return (
    <div
      role="alert"
      className={`card border-l-4 border-l-govt-red p-6 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-4 font-bangla ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 border border-red-200 flex items-center justify-center shrink-0 text-govt-red">
        <AlertCircle size={26} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-red-950">{title}</h2>
        <p className="text-sm text-gray-700 mt-1 leading-relaxed">{message}</p>
        {errorCode && (
          <div className="mt-2 text-xs font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded border border-gray-200 inline-block">
            রেফারেন্স ত্রুটি কোড: {errorCode}
          </div>
        )}
        {(onRetry || action) && (
          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            {onRetry && (
              <Button
                size="sm"
                variant="danger"
                leftIcon={RotateCcw}
                onClick={onRetry}
              >
                {retryText}
              </Button>
            )}
            {action}
          </div>
        )}
      </div>
    </div>
  )
}
