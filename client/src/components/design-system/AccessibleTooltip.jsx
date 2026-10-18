import { useState, useRef, useEffect } from 'react'

/**
 * AccessibleTooltip Component
 * Provides screen-reader accessible, keyboard-focusable and hover-activated tooltip.
 */
export default function AccessibleTooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).substring(2, 9)}`)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  if (!content) return children

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hideTooltip()
      }}
    >
      <div aria-describedby={isVisible ? tooltipId.current : undefined}>
        {children}
      </div>

      {isVisible && (
        <div
          id={tooltipId.current}
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1.5 text-[11px] font-bangla font-medium text-white bg-slate-900 border border-slate-700 rounded shadow-md pointer-events-none whitespace-normal max-w-xs transition-opacity duration-150 ${
            positionClasses[position] || positionClasses.top
          } ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
