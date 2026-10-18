/**
 * LoadingSkeleton Component
 * Configurable skeleton placeholders for tables, cards, and text lines.
 */
export default function LoadingSkeleton({
  type = 'table',
  rows = 5,
  columns = 4,
  className = '',
  height = 'h-4',
  width = 'w-full',
}) {
  if (type === 'table') {
    return (
      <div
        className={`w-full bg-white rounded-lg border border-govt-border overflow-hidden select-none ${className}`}
        role="status"
        aria-live="polite"
        aria-label="ডেটা লোড হচ্ছে..."
      >
        {/* Table Header Skeleton */}
        <div className="bg-gray-100 p-3.5 border-b border-gray-200 flex items-center gap-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="h-4 bg-gray-300/80 rounded animate-pulse"
              style={{ width: `${Math.max(15, 100 / columns - 5)}%` }}
            />
          ))}
        </div>

        {/* Table Rows Skeleton */}
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="p-3.5 flex items-center gap-4">
              {Array.from({ length: columns }).map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="h-4 bg-gray-200/90 rounded animate-pulse"
                  style={{
                    width: `${colIdx === 0 ? 30 : Math.max(15, 80 / columns)}%`,
                    animationDelay: `${(rowIdx * 0.1).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <span className="sr-only">টেবিল ডেটা লোড হচ্ছে...</span>
      </div>
    )
  }

  if (type === 'card') {
    return (
      <div
        className={`bg-white rounded-lg border border-govt-border p-5 space-y-4 select-none ${className}`}
        role="status"
        aria-live="polite"
        aria-label="কার্ড লোড হচ্ছে..."
      >
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-300 rounded w-1/3 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-3.5 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>
        <div className="pt-2 border-t border-gray-100 flex gap-2">
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
        <span className="sr-only">কার্ড তথ্য লোড হচ্ছে...</span>
      </div>
    )
  }

  if (type === 'text') {
    return (
      <div
        className={`space-y-2 select-none ${className}`}
        role="status"
        aria-live="polite"
        aria-label="টেক্সট লোড হচ্ছে..."
      >
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className={`bg-gray-200 rounded animate-pulse ${height}`}
            style={{
              width: idx === rows - 1 ? '70%' : width,
              animationDelay: `${(idx * 0.1).toFixed(2)}s`,
            }}
          />
        ))}
        <span className="sr-only">টেক্সট লোড হচ্ছে...</span>
      </div>
    )
  }

  // Custom single block
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse select-none ${height} ${width} ${className}`}
      role="status"
      aria-live="polite"
      aria-label="উপাদান লোড হচ্ছে..."
    >
      <span className="sr-only">লোড হচ্ছে...</span>
    </div>
  )
}
