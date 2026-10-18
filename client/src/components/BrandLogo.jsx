import { Link } from 'react-router-dom'
import { useAuth, getRoleHomeRoute } from '../context/AuthContext'

const SIZE_CLASSES = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10 sm:w-11 sm:h-11',
  lg: 'w-12 h-12 sm:w-14 sm:h-14',
  xl: 'w-16 h-16 sm:w-20 sm:h-20',
  '2xl': 'w-20 h-20 sm:w-24 sm:h-24',
}

/**
 * BrandLogo Component
 * 
 * Reusable official LandLock Engine emblem component using `/landlock-logo.png`.
 * - Maintains 1:1 circular aspect ratio with `object-contain`
 * - Supports compact icon-only mode and full wordmark mode
 * - Supports optional React Router link integration with role-based navigation
 */
export default function BrandLogo({
  size = 'md',
  showWordmark = false,
  variant = 'light', // 'light' (for dark green headers/sidebars) | 'dark' (for white background)
  withLink = false,
  to,
  title = 'ল্যান্ডলক ইঞ্জিন',
  subtitle = 'স্বয়ংক্রিয় ভূমি নিষেধাজ্ঞা ও দায় রেজিস্ট্রি',
  englishSubtitle = 'Automated Injunction & Title Encumbrance Registry',
  className = '',
  imgClassName = '',
}) {
  const { user, isAuthenticated } = useAuth()
  const sizeClass = SIZE_CLASSES[size] || size || SIZE_CLASSES.md

  const targetPath = to || (isAuthenticated && user ? getRoleHomeRoute(user.role) : '/')

  const imageElement = (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${sizeClass} ${className}`}
    >
      <img
        src="/landlock-logo.png"
        alt="ল্যান্ডলক ইঞ্জিন প্রাতিষ্ঠানিক প্রতীক"
        className={`w-full h-full object-contain select-none drop-shadow-xs ${imgClassName}`}
        loading="eager"
      />
    </div>
  )

  const content = showWordmark ? (
    <div className="flex items-center gap-2.5">
      {imageElement}
      <div className="text-left select-none">
        <div
          className={`font-extrabold text-base sm:text-lg tracking-tight leading-none font-bangla transition-colors ${
            variant === 'light' ? 'text-white group-hover:text-green-100' : 'text-gray-900 group-hover:text-[#006A4E]'
          }`}
        >
          {title}
        </div>
        {subtitle && (
          <div
            className={`text-[10px] sm:text-[11px] font-bangla font-medium leading-tight mt-0.5 tracking-tight hidden sm:block ${
              variant === 'light' ? 'text-green-100/90' : 'text-gray-500'
            }`}
          >
            {subtitle}
          </div>
        )}
      </div>

      {/* Govt BD emblem to the right with distance */}
      <div className={`hidden sm:flex items-center pl-2.5 ml-1.5 border-l ${variant === 'light' ? 'border-white/20' : 'border-gray-200'}`}>
        <img
          src="/govt-bd.png"
          alt="গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"
          className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0 drop-shadow-xs"
          loading="eager"
        />
      </div>
    </div>
  ) : (
    imageElement
  )

  if (withLink) {
    return (
      <Link
        to={targetPath}
        className="inline-flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold rounded-lg p-0.5"
        title={`${title} - মূল পৃষ্ঠায় যান`}
      >
        {content}
      </Link>
    )
  }

  return content
}
