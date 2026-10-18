import {
  CheckCircle2,
  CheckCheck,
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  XCircle,
  Clock,
  RefreshCw,
  Landmark,
  FileEdit,
  HelpCircle,
  Unlock,
} from 'lucide-react'
import { STATUS_DEFINITIONS } from './constants'

const BADGE_VARIANTS = {
  success: {
    badgeClasses: 'bg-green-50 text-emerald-900 border-green-300',
    iconColor: 'text-emerald-700',
    dotColor: 'bg-emerald-600',
  },
  danger: {
    badgeClasses: 'bg-red-50 text-rose-900 border-red-300',
    iconColor: 'text-rose-700',
    dotColor: 'bg-rose-600',
  },
  warning: {
    badgeClasses: 'bg-amber-50 text-amber-950 border-amber-300',
    iconColor: 'text-amber-700',
    dotColor: 'bg-amber-600',
  },
  info: {
    badgeClasses: 'bg-blue-50 text-blue-900 border-blue-300',
    iconColor: 'text-blue-700',
    dotColor: 'bg-blue-600',
  },
  neutral: {
    badgeClasses: 'bg-slate-100 text-slate-800 border-slate-300',
    iconColor: 'text-slate-600',
    dotColor: 'bg-slate-500',
  },
}

const BADGE_ICONS = {
  CLEAR: CheckCircle2,
  VERIFIED: CheckCircle2,
  APPROVED: CheckCheck,
  RELEASED: Unlock,
  BLOCKED_BY_VALID_ORDER: ShieldAlert,
  ACTIVE: AlertOctagon,
  REJECTED: XCircle,
  REVIEW_REQUIRED: AlertTriangle,
  PENDING: Clock,
  IN_PROGRESS: RefreshCw,
  MORTGAGE_REQUIRES_RELEASE: Landmark,
  DRAFT: FileEdit,
  SUBMITTED: Clock,
  UNDER_REVIEW: RefreshCw,
  PENDING_APPROVAL: Clock,
  AMENDED: FileEdit,
  EXPIRED: Clock,
  SUSPENDED: AlertTriangle,
  REVOKED: XCircle,
  DISPUTED: AlertTriangle,
  RELEASE_PENDING: Clock,
  RELEASE_REQUESTED: Clock,
  SYSTEM_UNAVAILABLE: HelpCircle,
  UNKNOWN: HelpCircle,
}

const BADGE_SIZES = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
}

const ICON_SIZES = {
  sm: 12,
  md: 14,
  lg: 16,
}

export default function StatusBadge({
  status,
  decision,
  label,
  size = 'md',
  showIcon = true,
  className = '',
}) {
  const code = status || decision
  if (!code) return null

  const definition = STATUS_DEFINITIONS[code] || {
    key: code,
    labelBn: label || code,
    variant: 'neutral',
  }

  const variantStyle = BADGE_VARIANTS[definition.variant] || BADGE_VARIANTS.neutral
  const IconComponent = BADGE_ICONS[code] || HelpCircle
  const sizeClasses = BADGE_SIZES[size] || BADGE_SIZES.md
  const iconSize = ICON_SIZES[size] || 14
  const displayLabel = label || definition.labelBn

  return (
    <span
      role="status"
      aria-label={`স্থিতি: ${displayLabel}`}
      className={`inline-flex items-center font-bangla font-semibold border rounded-full shrink-0 shadow-xs select-none transition-colors ${variantStyle.badgeClasses} ${sizeClasses} ${className}`}
    >
      {showIcon && (
        <IconComponent
          size={iconSize}
          className={`shrink-0 ${variantStyle.iconColor}`}
          aria-hidden="true"
        />
      )}
      <span>{displayLabel}</span>
    </span>
  )
}
