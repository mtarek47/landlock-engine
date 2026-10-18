import { Landmark, ShieldCheck, AlertTriangle, Clock } from 'lucide-react'
import { toBengaliNumber } from '../design-system/constants'

export default function MortgageSummaryCards({ metrics, currentFilter, onSelectFilter }) {
  const cards = [
    {
      id: 'ALL',
      title: 'মোট নিবন্ধিত বন্ধক',
      subtitle: 'প্রাতিষ্ঠানিক পোর্টফোলিও',
      count: metrics?.total || 0,
      icon: Landmark,
      color: 'border-l-gray-600 text-gray-700 bg-gray-50',
      activeBorder: 'border-gray-800 ring-2 ring-gray-400',
      textColor: 'text-gray-900',
    },
    {
      id: 'ACTIVE',
      title: 'সক্রিয় বন্ধক ও লিয়েন',
      subtitle: 'জমির হস্তান্তরে বাধা প্রযোজ্য',
      count: metrics?.active || 0,
      icon: Landmark,
      color: 'border-l-rose-600 text-rose-700 bg-rose-50/50',
      activeBorder: 'border-rose-600 ring-2 ring-rose-300',
      textColor: 'text-rose-900',
    },
    {
      id: 'RELEASE_PENDING',
      title: 'অবমুক্তি প্রক্রিয়াধীন',
      subtitle: 'দাখিলকৃত অনাপত্তিপত্র',
      count: metrics?.pendingRelease || 0,
      icon: Clock,
      color: 'border-l-blue-600 text-blue-700 bg-blue-50/50',
      activeBorder: 'border-blue-600 ring-2 ring-blue-300',
      textColor: 'text-blue-900',
    },
    {
      id: 'RELEASED',
      title: 'দায়মুক্ত / অবমুক্ত',
      subtitle: 'অনুমোদিত অনাপত্তি (NOC)',
      count: metrics?.released || 0,
      icon: ShieldCheck,
      color: 'border-l-emerald-600 text-emerald-700 bg-emerald-50/50',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-300',
      textColor: 'text-emerald-900',
    },
    {
      id: 'DISPUTED',
      title: 'বিরোধপূর্ণ বন্ধক',
      subtitle: 'স্বত্ব বা আইনি জটিলতা',
      count: metrics?.disputed || 0,
      icon: AlertTriangle,
      color: 'border-l-amber-600 text-amber-700 bg-amber-50/50',
      activeBorder: 'border-amber-600 ring-2 ring-amber-300',
      textColor: 'text-amber-900',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 font-bangla">
      {cards.map((card) => {
        const Icon = card.icon
        const isSelected = currentFilter === card.id

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter(card.id)}
            className={`card p-4 text-left border-l-4 transition-all duration-150 rounded-lg shadow-xs hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green ${
              card.color
            } ${isSelected ? card.activeBorder : 'border-govt-border hover:border-gray-400'}`}
            aria-pressed={isSelected}
            aria-label={`${card.title}: ${toBengaliNumber(card.count)} টি`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 line-clamp-1">
                {card.title}
              </span>
              <Icon size={18} className="shrink-0 opacity-80" aria-hidden="true" />
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
