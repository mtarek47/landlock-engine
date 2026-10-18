import { isValidElement } from 'react'
import { SearchX } from 'lucide-react'

export default function EmptyState({
  title = 'কোনো রেকর্ড বা তথ্য পাওয়া যায়নি',
  description = 'অনুসন্ধানের মানদণ্ড পরিবর্তন করে অথবা ফিল্টার পুনরায় পরীক্ষা করে চেষ্টা করুন।',
  icon: Icon = SearchX,
  action,
  className = '',
}) {
  return (
    <div
      className={`card text-center py-12 px-6 flex flex-col items-center justify-center font-bangla ${className}`}
      role="region"
      aria-label="খালি রেকর্ডের বিবরণ"
    >
      <div className="w-14 h-14 rounded-full bg-govt-paper border border-govt-border flex items-center justify-center text-gray-500 mb-4 shadow-sm">
        {isValidElement(Icon) ? Icon : <Icon size={28} aria-hidden="true" />}
      </div>
      <h3 className="text-base font-bold text-gray-800">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
