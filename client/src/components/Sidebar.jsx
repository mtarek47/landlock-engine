import { Link, useLocation } from 'react-router-dom'
import { Home, Search, FileText, ClipboardCheck, Shield, BarChart3, Map } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ALL_MENU = [
  { path: '/dashboard', label: 'ড্যাশবোর্ড', icon: Home, roles: null },
  { path: '/parcels', label: 'জমি খোঁজুন', icon: Search, roles: null },
  { path: '/map', label: 'মৌজা নকশা (GIS)', icon: Map, roles: null },
  { path: '/cases', label: 'মামলা ও আদেশ', icon: FileText, roles: ['COURT_OFFICER', 'ORDER_APPROVER', 'SYSTEM_ADMIN', 'AUDITOR'] },
  { path: '/registry', label: 'রেজিস্ট্রি যাচাই', icon: ClipboardCheck, roles: ['REGISTRY_OFFICER', 'BANK_OFFICER', 'SYSTEM_ADMIN'] },
  { path: '/citizen', label: 'নাগরিক পোর্টাল', icon: Shield, roles: null },
  { path: '/audit', label: 'অডিট লগ', icon: BarChart3, roles: ['AUDITOR', 'SYSTEM_ADMIN'] },
]

export default function Sidebar() {
  const { pathname } = useLocation()
  const { hasRole } = useAuth()

  const visibleMenu = ALL_MENU.filter(m => !m.roles || hasRole(m.roles))

  return (
    <aside className="w-60 bg-white border-r border-govt-border flex flex-col justify-between shrink-0 shadow-sm min-h-[calc(100vh-65px)]" aria-label="প্রধান নেভিগেশন">
      <div className="py-4">
        <div className="px-4 pb-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          মেনু নেভিগেশন
        </div>
        <ul className="space-y-1">
          {visibleMenu.map(({ path, label, icon: Icon }) => {
            const active = pathname === path || (path !== '/dashboard' && pathname.startsWith(path + '/'))
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-govt-green text-white border-r-4 border-govt-gold shadow-sm font-semibold'
                      : 'text-gray-700 hover:bg-green-50 hover:text-govt-green'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon size={18} className={active ? 'text-govt-gold' : 'text-gray-500'} />
                  <span>{label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Disclaimer box at bottom of sidebar */}
      <div className="p-4 border-t border-govt-border">
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 leading-relaxed">
          <strong className="block mb-1">⚠️ সতর্কবার্তা:</strong>
          এটি একটি পরীক্ষামূলক প্রোটোটাইপ। সব তথ্য কাল্পনিক ও ডেমো প্রদর্শনের জন্য সংরক্ষিত।
        </div>
      </div>
    </aside>
  )
}
