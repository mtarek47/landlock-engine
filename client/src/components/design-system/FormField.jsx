import { forwardRef } from 'react'

/**
 * FormField Component
 * Reusable accessible form input wrapper inspired by official Bangladesh e-services.
 * Supports text, number, select, and textarea controls with consistent 42-44px touch targets.
 */
const FormField = forwardRef(function FormField(
  {
    label,
    required = false,
    error,
    hint,
    type = 'text',
    className = '',
    inputClassName = '',
    children,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    id,
    name,
    ...props
  },
  ref
) {
  const fieldId = id || name || `field-${Math.random().toString(36).substring(2, 9)}`
  const errorId = error ? `${fieldId}-error` : undefined
  const hintId = hint ? `${fieldId}-hint` : undefined

  const baseInputClasses = `w-full rounded border text-sm transition-all text-govt-ink-black placeholder:text-gray-400 placeholder:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green focus-visible:border-govt-green ${
    error
      ? 'border-govt-red bg-red-50/30 text-red-950 focus-visible:ring-govt-red'
      : 'border-govt-border bg-white hover:border-gray-400'
  }`

  return (
    <div className={`space-y-1.5 font-bangla ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="block text-xs sm:text-sm font-semibold text-govt-ink-black select-none"
        >
          <span>{label}</span>
          {required && (
            <span className="text-govt-red ml-1 font-bold" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            <LeftIcon size={16} aria-hidden="true" />
          </div>
        )}

        {type === 'select' ? (
          <select
            ref={ref}
            id={fieldId}
            name={name}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            className={`min-h-[42px] px-3 py-2 cursor-pointer ${LeftIcon ? 'pl-9' : ''} ${RightIcon ? 'pr-9' : ''} ${baseInputClasses} ${inputClassName}`}
            {...props}
          >
            {children}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            ref={ref}
            id={fieldId}
            name={name}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            className={`p-3 min-h-[96px] ${LeftIcon ? 'pl-9' : ''} ${RightIcon ? 'pr-9' : ''} ${baseInputClasses} ${inputClassName}`}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            id={fieldId}
            name={name}
            type={type}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            className={`min-h-[42px] px-3 py-2 ${LeftIcon ? 'pl-9' : ''} ${RightIcon ? 'pr-9' : ''} ${baseInputClasses} ${inputClassName}`}
            {...props}
          />
        )}

        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
            <RightIcon size={16} aria-hidden="true" />
          </div>
        )}
      </div>

      {hint && !error && (
        <p id={hintId} className="text-[11px] text-gray-500 leading-tight">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-[11px] font-medium text-govt-red leading-tight flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-govt-red" />
          <span>{typeof error === 'string' ? error : error.message}</span>
        </p>
      )}
    </div>
  )
})

export default FormField
