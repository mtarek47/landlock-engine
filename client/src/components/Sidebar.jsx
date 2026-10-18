import { Link, useLocation } from 'react-router-dom'
import { Home, Search, FileText, ClipboardCheck, Shield, BarChart3, Map, User, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ALL_MENU = [
  {
    path: '/dashboard',
    label: 'ড্যাশবোর্ড',
    desc: 'একনজরে কার্যক্রম ও পরিসংখ্যান',
    icon: Home,
    roles: null,
  },
  {
    path: '/parcels',
    label: 'জমি অনুসন্ধান',
    desc: 'মৌজা ও খতিয়ান রেকর্ড তালিকা',
    icon: Search,
    roles: null,
  },
  {
    path: '/map',
    label: 'মৌজা নকশা (GIS)',
    desc: 'স্যাটেলাইট ক্যাডাস্ট্রাল মানচিত্র',
    icon: Map,
    badge: 'লাইভ',
    roles: null,
  },
  {
    path: '/cases',
    label: 'মামলা ও আদেশ',
    desc: 'বিজ্ঞ আদালতের নিষেধাজ্ঞা ফাইল',
    icon: FileText,
    roles: ['COURT_OFFICER', 'ORDER_APPROVER', 'SYSTEM_ADMIN', 'AUDITOR'],
  },
  {
    path: '/registry',
    label: 'রেজিস্ট্রি যাচাই',
    desc: 'গেটের স্বয়ংক্রিয় ব্লকিং সিদ্ধান্ত',
    icon: ClipboardCheck,
    roles: ['REGISTRY_OFFICER', 'BANK_OFFICER', 'SYSTEM_ADMIN'],
  },
  {
    path: '/citizen',
    label: 'নাগরিক পোর্টাল',
    desc: 'সাধারণ ক্রেতার ঝুঁকি যাচাই',
    icon: Shield,
    roles: null,
  },
  {
    path: '/audit',
    label: 'অডিট লগ',
    desc: 'অপরিবর্তনীয় লেনদেন ইতিহাস',
    icon: BarChart3,
    roles: ['AUDITOR', 'SYSTEM_ADMIN'],
  },
]

const ROLE_BN = {
  SYSTEM_ADMIN: 'সিস্টেম প্রশাসক',
  COURT_OFFICER: 'আদালত কর্মকর্তা',
  ORDER_APPROVER: 'আদেশ অনুমোদনকারী',
  LAND_OFFICER: 'ভূমি কর্মকর্তা',
  REGISTRY_OFFICER: 'রেজিস্ট্রি কর্মকর্তা',
  BANK_OFFICER: 'ব্যাংক কর্মকর্তা',
  AUDITOR: 'অডিটর',
  CITIZEN: 'নাগরিক',
}

export default function Sidebar() {
  const { pathname } = useLocation()
  const { user, logout, hasRole } = useAuth()

  const visibleMenu = ALL_MENU.filter((m) => !m.roles || hasRole(m.roles))

  return (
    <aside
      className="w-64 bg-white border-r border-govt-border flex flex-col justify-between shrink-0 shadow-sm min-h-[calc(100vh-65px)] font-bangla select-none"
      aria-label="প্রধান নেভিগেশন"
    >
      <div className="py-3 px-2">
        <div className="px-3 pb-2 mb-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
          <span>মেনু নেভিগেশন</span>
          <span className="text-[10px] bg-green-50 text-govt-green px-1.5 py-0.5 rounded border border-green-200">
            সরকারি প্রোটোটাইপ
          </span>
        </div>

        <ul className="space-y-1">
          {visibleMenu.map(({ path, label, desc, icon: Icon, badge }) => {
            const active =
              pathname === path || (path !== '/dashboard' && pathname.startsWith(path + '/'))
            return (
              <li key={path}>
                <Link
                  to={path}
                  className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    active
                      ? 'bg-govt-green text-white shadow-sm font-semibold'
                      : 'text-gray-700 hover:bg-green-50 hover:text-govt-green'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    size={19}
                    className={`shrink-0 mt-0.5 ${active ? 'text-govt-gold' : 'text-gray-500'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 leading-tight">
                      <span className="font-bold">{label}</span>
                      {badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                            active
                              ? 'bg-govt-gold text-gray-900'
                              : 'bg-green-100 text-govt-green'
                          }`}
                        >
                          {badge}
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[11px] truncate mt-0.5 leading-none ${
                        active ? 'text-green-100 opacity-90' : 'text-gray-400'
                      }`}
                    >
                      {desc}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* User Profile Card & Switch */}
      <div className="p-3 border-t border-govt-border bg-gray-50/70 space-y-2">
        {user ? (
          <div className="p-2.5 rounded-lg bg-white border border-gray-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-govt-green text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.displayName?.charAt(0) || 'উ'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-gray-800 truncate">{user.displayName}</div>
                <div className="text-[10px] text-govt-green font-medium truncate">
                  {ROLE_BN[user.role] || user.role}
                </div>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <Link
                to="/login"
                className="text-gray-500 hover:text-govt-green flex items-center gap-1 font-medium"
              >
                <span>অ্যাকাউন্ট বদলান</span>
                <ChevronRight size={12} />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-red-600 hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <LogOut size={12} />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        ) : (
          <Link
            to="/login"
            className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <User size={14} />
            <span>অফিসিয়াল লগইন করুন</span>
          </Link>
        )}

        {/* Prototype Notice */}
        <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 leading-tight">
          ⚠️ <strong>ডেমো মোড:</strong> সকল খতিয়ান ও দাগ পরীক্ষামূলক।
        </div>
      </div>
    </aside>
  )
}
