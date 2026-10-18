import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Menu, X, Shield, Lock, PhoneCall, Bell, Search, Globe } from 'lucide-react'
import { useAuth, getRoleHomeRoute } from '../../context/AuthContext'
import BrandLogo from '../BrandLogo'
import GovtBrandMark from '../design-system/GovtBrandMark'
import { ROLE_BN } from '../design-system/constants'

export default function GovernmentHeader({
  isSidebarOpen,
  onToggleSidebar,
  showSidebarToggle = false,
  variant = 'authenticated', // 'authenticated' | 'public'
}) {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const effectiveAuth = isAuthenticated && user

  return (
    <header className="bg-govt-green-dark text-white sticky top-0 z-40 select-none shadow-md border-b border-emerald-900" aria-label="সরকারি পোর্টাল হেডার">
      {/* Accessibility Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-govt-gold focus:text-gray-950 focus:font-bold focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        মূল বিষয়বস্তুতে যান (Skip to Main Content)
      </a>

      {/* Main Single-Bar Header matching reference design across all screens - corner-anchored */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* LEFT: Sidebar Toggle (on mobile or auth) + Application Brand */}
          <div className="flex items-center gap-3">
            {showSidebarToggle && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="lg:hidden p-1.5 rounded text-green-200 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold"
                aria-label={isSidebarOpen ? 'মেনু বন্ধ করুন' : 'সাইডবার মেনু খুলুন'}
                aria-expanded={isSidebarOpen}
                aria-controls="dashboard-sidebar"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}

            <Link
              to={effectiveAuth ? getRoleHomeRoute(user?.role) : '/'}
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold rounded p-0.5 transition-all"
            >
              <BrandLogo size="md" className="shrink-0" />
              <div>
                <div className="text-white font-extrabold text-base sm:text-lg tracking-tight leading-none group-hover:text-green-100 transition-colors font-bangla">
                  ল্যান্ডলক ইঞ্জিন
                </div>
                <div className="text-[10px] sm:text-[11px] text-green-100/90 font-bangla font-medium leading-tight mt-0.5 tracking-tight hidden sm:block">
                  স্বয়ংক্রিয় ভূমি নিষেধাজ্ঞা ও দায় রেজিস্ট্রি
                </div>
              </div>
            </Link>
          </div>

          {/* RIGHT: Helpline & Auth Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Helpline - Phone Call */}
            <a
              href="tel:16122"
              className="flex items-center gap-1.5 text-xs text-green-100 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded border border-white/10"
              title="ভূমি সেবা হেল্পলাইন ১৬১২২"
            >
              <PhoneCall size={14} className="text-green-300 shrink-0" aria-hidden="true" />
              <div className="text-left leading-none">
                <span className="text-[9px] text-green-300 font-medium block hidden sm:block">হেল্পলাইন</span>
                <span className="font-bold text-xs font-inter text-white">১৬১২২</span>
              </div>
            </a>

            <div className="h-5 w-px bg-white/20 hidden sm:block" aria-hidden="true" />

            {/* Auth Button */}
            {effectiveAuth ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded transition-colors border border-white/20"
                >
                  <User size={13} className="text-govt-gold" aria-hidden="true" />
                  <span className="font-semibold max-w-[100px] truncate">{user.displayName || user.username}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 bg-black/20 hover:bg-govt-red text-white text-xs px-2.5 py-1.5 rounded transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-gold"
                  title="লগআউট"
                  aria-label="লগআউট"
                >
                  <LogOut size={13} aria-hidden="true" />
                  <span className="hidden sm:inline">প্রস্থান</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-3.5 py-1.5 rounded border border-white/30 hover:border-white transition-all shadow-xs"
              >
                <Lock size={12} aria-hidden="true" />
                <span>লগইন</span>
              </Link>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
