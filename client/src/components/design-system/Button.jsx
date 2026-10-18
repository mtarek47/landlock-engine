import { forwardRef, isValidElement } from 'react'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary:
    'bg-govt-green text-white hover:bg-govt-green-dark active:bg-govt-green-dark/95 border border-transparent shadow-sm focus-visible:ring-govt-green',
  secondary:
    'bg-white text-govt-green border border-govt-green hover:bg-green-50 active:bg-green-100 shadow-sm focus-visible:ring-govt-green',
  danger:
    'bg-govt-red text-white hover:bg-red-700 active:bg-red-800 border border-transparent shadow-sm focus-visible:ring-govt-red',
  outline:
    'bg-white text-gray-700 border border-govt-border hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100 shadow-sm focus-visible:ring-gray-400',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-govt-green active:bg-gray-200 border border-transparent focus-visible:ring-gray-400',
  gold:
    'bg-govt-gold text-gray-950 font-semibold hover:bg-yellow-400 active:bg-yellow-500 border border-transparent shadow-sm focus-visible:ring-yellow-500',
}

const SIZES = {
  sm: 'px-2.5 py-1.5 text-xs gap-1.5 rounded',
  md: 'px-4 py-2 text-sm gap-2 rounded',
  lg: 'px-5 py-2.5 text-base gap-2.5 rounded-md',
}

const ICON_SIZES = {
  sm: 14,
  md: 16,
  lg: 18,
}

function renderIcon(Icon, size) {
  if (!Icon) return null
  if (isValidElement(Icon)) return Icon
  const IconComponent = Icon
  return <IconComponent size={size} aria-hidden="true" />
}

export const Button = forwardRef(function Button(
  {
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingText,
    disabled = false,
    leftIcon,
    rightIcon,
    icon,
    fullWidth = false,
    className = '',
    as: Component = 'button',
    ...props
  },
  ref
) {
  const isButton = Component === 'button'
  const isDisabled = disabled || isLoading

  const baseClasses =
    'inline-flex items-center justify-center font-bangla font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'

  const variantClasses = VARIANTS[variant] || VARIANTS.primary
  const sizeClasses = SIZES[size] || SIZES.md
  const widthClasses = fullWidth ? 'w-full' : ''
  const iconSize = ICON_SIZES[size] || 16

  const computedClassName = `${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`.trim()

  return (
    <Component
      ref={ref}
      {...(isButton ? { type, disabled: isDisabled } : {})}
      aria-busy={isLoading ? 'true' : undefined}
      aria-disabled={isDisabled ? 'true' : undefined}
      className={computedClassName}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2
            size={iconSize}
            className="animate-spin motion-reduce:animate-none shrink-0"
            aria-hidden="true"
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {(leftIcon || icon) && (
            <span className="shrink-0 flex items-center" aria-hidden="true">
              {renderIcon(leftIcon || icon, iconSize)}
            </span>
          )}
          {children && <span>{children}</span>}
          {rightIcon && (
            <span className="shrink-0 flex items-center" aria-hidden="true">
              {renderIcon(rightIcon, iconSize)}
            </span>
          )}
        </>
      )}
    </Component>
  )
})

export default Button
