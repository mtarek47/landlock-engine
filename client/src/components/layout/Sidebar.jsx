import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  X,
  ShieldAlert,
  LogOut,
  User,
  Building2,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import BrandLogo from '../BrandLogo'
import { getNavigationForRole, ROLE_PROFILES } from './roleNavigation'

export default function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location
  const { user, logout } = useAuth()

  // Handle ESC key to close mobile sidebar drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleLogout = () => {
    logout()
    if (onClose) onClose()
    navigate('/login')
  }

  const userRole = user?.role || 'CITIZEN'
  const roleProfile = ROLE_PROFILES[userRole] || ROLE_PROFILES.CITIZEN
  const navGroups = getNavigationForRole(userRole)

  const navContent = (
    <div className="flex flex-col justify-between h-full font-bangla select-none bg-govt-green-dark text-white border-r border-emerald-900">
      <div className="py-4 overflow-y-auto flex-1">
        {/* Mobile close button in header of drawer */}
        <div className="lg:hidden px-4 pb-3 mb-2 flex items-center justify-between border-b border-white/15">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo size="sm" className="shrink-0" />
            <span className="text-xs font-bold text-green-200 uppercase tracking-wider truncate">
              দাপ্তরিক নেভিগেশন
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-green-200 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold shrink-0"
            aria-label="সাইডবার বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>

        {/* Desktop Officer Role Card with Compact Emblem */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 pb-3 mb-2 border-b border-white/15">
          <BrandLogo size="sm" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {roleProfile.titleBn}
            </div>
            <div className="text-[10px] text-green-200/80 truncate">
              {roleProfile.agencyBn}
            </div>
          </div>
        </div>

        {/* Navigation List matching Screens 2, 4, 5, 6, 7 */}
        <div className="space-y-1.5 px-3 pt-2">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              <ul className="space-y-1" role="list">
                {group.items.map(({ path, labelBn, labelEn, icon: Icon, badge }) => {
                  const [targetPath, targetSearch] = path.split('?')
                  const isPathMatch =
                    pathname === targetPath ||
                    (targetPath !== '/dashboard' && !targetSearch && pathname.startsWith(targetPath + '/'))
                  const isSearchMatch = targetSearch
                    ? location.search === `?${targetSearch}`
                    : (!location.search || location.search === '')
                  const active = targetSearch
                    ? pathname === targetPath && isSearchMatch
                    : isPathMatch && (!location.search || location.search === '')
                  return (
                    <li key={path}>
                      <Link
                        to={path}
                        onClick={() => onClose && onClose()}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                          active
                            ? 'bg-[#006A4E] text-white font-bold shadow-xs'
                            : 'text-white/85 hover:bg-white/10 hover:text-white'
                        }`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <Icon
                            size={18}
                            className={`shrink-0 ${active ? 'text-white' : 'text-white/80'}`}
                            aria-hidden="true"
                          />
                          <span className="truncate text-xs sm:text-sm font-semibold">{labelBn}</span>
                        </div>

                        {badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-sans font-bold shrink-0 ml-1.5 ${
                              active
                                ? 'bg-govt-gold text-gray-950 font-bold'
                                : 'bg-white/10 text-green-200 border border-white/10'
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Area: User Profile Card & Safe Logout */}
      <div className="p-3 border-t border-white/10 bg-black/20 space-y-2 shrink-0">
        {user ? (
          <div className="flex items-center justify-between gap-2 p-2 bg-white/5 rounded border border-white/10 shadow-2xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-govt-green text-govt-gold flex items-center justify-center shrink-0 border border-white/20">
                <User size={15} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {user.displayName || user.username}
                </div>
                <div className="text-[10px] text-green-200/70 truncate font-mono">
                  {user.email || user.username}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-green-200 hover:text-white hover:bg-govt-red/80 rounded transition-colors shrink-0"
              title="নিরাপদে লগআউট করুন"
              aria-label="লগআউট"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Link
              to="/login"
              className="text-xs text-govt-gold font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>দাপ্তরিক লগইন করুন</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        )}

        {/* GovTech Statutory Compliance Notice */}
        <div className="p-2 bg-black/20 border border-white/10 rounded text-[11px] text-green-200/80 leading-relaxed flex items-start gap-1.5">
          <ShieldAlert size={13} className="text-govt-gold shrink-0 mt-0.5" aria-hidden="true" />
          <span>সকল অনুসন্ধান ও সিদ্ধান্ত সেন্ট্রাল অডিট ট্রেইলে রিয়েল-টাইম সংরক্ষিত।</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop static sidebar */}
      <aside
        id="dashboard-sidebar"
        aria-label="প্রধান সাইডবার নেভিগেশন"
        className="hidden lg:flex flex-col w-64 bg-govt-green-dark border-r border-emerald-900 shrink-0 shadow-sm min-h-[calc(100vh-60px)]"
      >
        {navContent}
      </aside>

      {/* Mobile/Tablet drawer and backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="মোবাইল সাইডবার নেভিগেশন"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity motion-reduce:transition-none"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer sheet */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-govt-green-dark shadow-2xl z-50 animate-in slide-in-from-left duration-200 motion-reduce:animate-none">
            {navContent}
          </div>
        </div>
      )}
    </>
  )
}
