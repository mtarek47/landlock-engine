import { Gavel, AlertOctagon, Clock, FileEdit, CheckCircle2 } from 'lucide-react'
import { toBengaliNumber } from '../design-system/constants'

export default function OrderSummaryCards({ orders = [] }) {
  const total = orders.length
  const activeCount = orders.filter((o) => o.approvalStatus === 'APPROVED' || o.approvalStatus === 'ACTIVE').length
  const pendingCount = orders.filter((o) => o.approvalStatus === 'SUBMITTED' || o.approvalStatus === 'UNDER_REVIEW' || o.approvalStatus === 'PENDING_APPROVAL').length
  const draftCount = orders.filter((o) => o.approvalStatus === 'DRAFT').length
  const releasedCount = orders.filter((o) => o.approvalStatus === 'RELEASED' || o.approvalStatus === 'EXPIRED').length

  const cards = [
    {
      title: 'মোট আদেশ ও মামলা',
      count: total,
      subtext: 'তালিকাভুক্ত দেওয়ানি ও ভূমি মোকদ্দমা',
      icon: Gavel,
      colorClass: 'text-govt-green',
      bgClass: 'bg-green-50/70 border-green-200',
    },
    {
      title: 'সক্রিয় নিষেধাজ্ঞা',
      count: activeCount,
      subtext: 'রেজিস্ট্রিতে স্বয়ংক্রিয় লক বলবৎ',
      icon: AlertOctagon,
      colorClass: 'text-red-700',
      bgClass: 'bg-red-50/70 border-red-200',
    },
    {
      title: 'অনুমোদনের অপেক্ষায়',
      count: pendingCount,
      subtext: 'বিচারকের স্বাক্ষরের জন্য দাখিলকৃত',
      icon: Clock,
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50/70 border-blue-200',
    },
    {
      title: 'সংরক্ষিত খসড়া',
      count: draftCount,
      subtext: 'প্রস্তুতকৃত অপ্রেরিত আদেশপত্র',
      icon: FileEdit,
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50/70 border-amber-200',
    },
    {
      title: 'দায়মুক্ত / অবমুক্ত',
      count: releasedCount,
      subtext: 'নিষ্পত্তিকৃত বা মেয়াদোত্তীর্ণ আদেশ',
      icon: CheckCircle2,
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50/70 border-emerald-200',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="card p-4 flex flex-col justify-between border border-govt-border bg-white rounded-lg shadow-2xs hover:shadow-xs transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-600 line-clamp-1">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-md border ${card.bgClass}`}>
                <Icon size={16} className={card.colorClass} aria-hidden="true" />
              </div>
            </div>
            <div className="mt-2.5">
              <div className="text-2xl font-bold font-sans text-gray-900 tracking-tight">
                {toBengaliNumber(card.count)}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                {card.subtext}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
