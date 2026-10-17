const DECISION_MAP = {
  CLEAR: { label: 'পরিষ্কার (নিষেধাজ্ঞামুক্ত)', className: 'status-clear', icon: '✓' },
  BLOCKED_BY_VALID_ORDER: { label: 'বৈধ আদেশে অবরুদ্ধ', className: 'status-blocked', icon: '✗' },
  REVIEW_REQUIRED: { label: 'পর্যালোচনা প্রয়োজন', className: 'status-review', icon: '!' },
  MORTGAGE_REQUIRES_RELEASE: { label: 'বন্ধক মুক্তি প্রয়োজন', className: 'status-mortgage', icon: '⚠' },
  SYSTEM_UNAVAILABLE: { label: 'সিস্টেম অনুপলব্ধ', className: 'status-unavailable', icon: '?' },
  VERIFIED: { label: 'যাচাইকৃত', className: 'status-clear', icon: '✓' },
  PENDING: { label: 'অপেক্ষমাণ', className: 'status-review', icon: '⏳' },
  ACTIVE: { label: 'সক্রিয়', className: 'status-blocked', icon: '●' },
  APPROVED: { label: 'অনুমোদিত', className: 'status-clear', icon: '✓' },
  DRAFT: { label: 'খসড়া', className: 'status-unavailable', icon: '✎' },
  REJECTED: { label: 'প্রত্যাখ্যাত', className: 'status-blocked', icon: '✗' },
  RELEASED: { label: 'মুক্ত', className: 'status-clear', icon: '✓' },
}

export default function StatusBadge({ decision, className = '' }) {
  if (!decision) return null
  const config = DECISION_MAP[decision] || {
    label: decision,
    className: 'status-unavailable',
    icon: '●',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-sm ${config.className} ${className}`}
    >
      <span aria-hidden="true" className="font-bold">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
