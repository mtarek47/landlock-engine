import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

export default function Breadcrumbs({ items = [], showHome = true, className = '' }) {
  if (!items || items.length === 0) return null

  return (
    <nav
      aria-label="ব্রেডক্রাম্ব নেভিগেশন"
      className={`font-bangla text-xs text-gray-500 mb-2 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 text-gray-500 hover:text-govt-green focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-govt-green rounded p-0.5 transition-colors"
              title="ড্যাশবোর্ড"
            >
              <Home size={13} className="shrink-0" aria-hidden="true" />
              <span className="sr-only">ড্যাশবোর্ড</span>
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isCurrent = item.current || isLast

          return (
            <li key={item.label || index} className="inline-flex items-center gap-1.5">
              <ChevronRight
                size={12}
                className="text-gray-400 shrink-0 select-none"
                aria-hidden="true"
              />
              {isCurrent || !item.href ? (
                <span
                  aria-current={isCurrent ? 'page' : undefined}
                  className="font-semibold text-gray-800 truncate max-w-xs sm:max-w-md"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-gray-600 hover:text-govt-green hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-govt-green rounded p-0.5 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
