import {
  FileCheck2,
  Scale,
  Landmark,
  ShieldAlert,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import { toBengaliNumber } from '../design-system/constants'

export default function AuditSummaryMetrics({ metrics, activeAction, onSelectAction }) {
  const cards = [
    {
      id: 'ALL',
      title: 'মোট সংরক্ষিত রেকর্ড',
      subtitle: 'সার্ভার অডিট ট্রেইল ডাটাবেজ',
      count: metrics?.totalRecorded || 0,
      icon: Layers,
      color: 'border-l-gray-700 bg-gray-50/80 text-gray-800',
      activeBorder: 'ring-2 ring-gray-400 border-gray-800',
      textColor: 'text-gray-900',
    },
    {
      id: 'REGISTRY_CHECK',
      title: 'রেজিস্ট্রি গেটকিপার যাচাই',
      subtitle: 'সাব-রেজিস্ট্রি সিদ্ধান্ত লগ',
      count: metrics?.registryChecks || 0,
      icon: FileCheck2,
      color: 'border-l-blue-600 bg-blue-50/50 text-blue-800',
      activeBorder: 'ring-2 ring-blue-300 border-blue-600',
      textColor: 'text-blue-950',
    },
    {
      id: 'APPROVE_ORDER',
      title: 'বিচারিক আদেশ ও নিষেধাজ্ঞা',
      subtitle: 'মামলা, স্থগিতাদেশ ও অনুমোদন',
      count: metrics?.courtOrders || 0,
      icon: Scale,
      color: 'border-l-amber-600 bg-amber-50/50 text-amber-800',
      activeBorder: 'ring-2 ring-amber-300 border-amber-600',
      textColor: 'text-amber-950',
    },
    {
      id: 'REGISTER_MORTGAGE',
      title: 'ব্যাংক বন্ধক ও অবমুক্তি',
      subtitle: 'ঋণ জামানত ও লিয়েন ট্র্যাকিং',
      count: metrics?.mortgageEvents || 0,
      icon: Landmark,
      color: 'border-l-emerald-600 bg-emerald-50/50 text-emerald-800',
      activeBorder: 'ring-2 ring-emerald-300 border-emerald-600',
      textColor: 'text-emerald-950',
    },
    {
      id: 'BLOCKED',
      title: 'ঝুঁকিপূর্ণ / অবরুদ্ধ ঘটনা',
      subtitle: 'নিষেধাজ্ঞায় লেনদেন স্থগিত',
      count: metrics?.blockedDecisions || 0,
      icon: ShieldAlert,
      color: 'border-l-rose-600 bg-rose-50/50 text-rose-800',
      activeBorder: 'ring-2 ring-rose-300 border-rose-600',
      textColor: 'text-rose-950',
      isResultFilter: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 font-bangla">
      {cards.map((card) => {
        const Icon = card.icon
        const isSelected = activeAction === card.id

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectAction(card.id, card.isResultFilter)}
            className={`card p-3.5 sm:p-4 text-left border-l-4 transition-all duration-150 rounded-lg shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green ${
              card.color
            } ${isSelected ? card.activeBorder : 'border-govt-border hover:border-gray-400'}`}
            aria-pressed={isSelected}
            aria-label={`${card.title}: ${toBengaliNumber(card.count)} টি ঘটনা`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-700 line-clamp-1">
                {card.title}
              </span>
              <Icon size={17} className="shrink-0 opacity-80" aria-hidden="true" />
            </div>

            <div className={`text-2xl sm:text-3xl font-bold font-sans ${card.textColor}`}>
              {toBengaliNumber(card.count)}
            </div>

            <div className="text-[11px] text-gray-500 mt-1 line-clamp-1">
              {card.subtitle}
            </div>
          </button>
        )
      })}
    </div>
  )
}
