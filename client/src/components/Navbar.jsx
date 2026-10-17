import { LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

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

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="govt-header shadow-md sticky top-0 z-30">
      {/* Gold top stripe - Bangladesh flag inspired */}
      <div className="h-1 bg-govt-gold" />
      <div className="px-4 py-3 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          {/* Govt emblem placeholder */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-govt-green font-bold text-sm border-2 border-govt-gold shadow group-hover:scale-105 transition-transform">
            বা
          </div>
          <div>
            <div className="text-xs text-green-200">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
            <div className="text-white font-bold text-lg leading-tight">ল্যান্ডলক ইঞ্জিন</div>
            <div className="text-xs text-green-200 hidden sm:block">ভূমি নিষেধাজ্ঞা ও দলিল বোঝাই রেজিস্ট্রি (প্রোটোটাইপ)</div>
          </div>
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-white text-sm font-medium flex items-center gap-1.5 justify-end">
                <User size={14} className="text-green-300" />
                <span>{user.displayName}</span>
              </div>
              <div className="text-green-200 text-xs">{ROLE_BN[user.role] || user.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-sm transition-colors border border-white/20"
              aria-label="লগআউট"
            >
              <LogOut size={16} />
              <span>প্রস্থান</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/citizen"
              className="text-white/90 hover:text-white text-sm px-3 py-1.5 rounded hover:bg-white/10 transition-colors"
            >
              নাগরিক পোর্টাল
            </Link>
            <Link
              to="/login"
              className="bg-white text-govt-green font-semibold text-sm px-3.5 py-1.5 rounded hover:bg-green-50 transition-colors shadow-sm"
            >
              প্রবেশ
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
