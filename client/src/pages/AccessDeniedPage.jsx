import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  ShieldAlert,
  ArrowLeft,
  Home,
  Lock,
  LogOut,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { useAuth, getRoleHomeRoute } from '../context/AuthContext'
import PublicLayout from '../components/layout/PublicLayout'
import Button from '../components/design-system/Button'
import { ROLE_BN } from '../components/design-system/constants'
import { ROLE_PROFILES } from '../components/layout/roleNavigation'

export default function AccessDeniedPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  // Get state from navigation if passed
  const attemptedPath = location.state?.attemptedPath || location.search ? new URLSearchParams(location.search).get('attempted') : ''
  const requiredRoles = location.state?.requiredRoles || []

  const currentRoleKey = user?.role || 'CITIZEN'
  const currentRoleProfile = ROLE_PROFILES[currentRoleKey] || {
    titleBn: ROLE_BN[currentRoleKey] || currentRoleKey,
    titleEn: currentRoleKey,
  }

  const handleSwitchAccount = () => {
    logout()
    navigate('/login')
  }

  return (
    <PublicLayout>
      <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 font-bangla select-text">
        <div className="max-w-xl w-full bg-white rounded-xl border-2 border-red-200 shadow-md p-6 sm:p-8 space-y-6 text-center">
          
          {/* Institutional Shield Icon */}
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto border-2 border-red-200">
            <ShieldAlert size={36} aria-hidden="true" />
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <div className="text-xs uppercase tracking-widest font-bold text-red-700 font-sans">
              HTTP 403 • FORBIDDEN ACCESS
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              অননুমোদিত প্রবেশাধিকার (Access Restricted)
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              আপনার বর্তমান দাপ্তরিক পরিচয় বা ভূমিকার অধীনে উক্ত সংরক্ষিত মডিউলে প্রবেশের অনুমতি নেই।
            </p>
          </div>

          {/* Access Details Box */}
          <div className="bg-gray-50 border border-govt-border rounded-lg p-4 text-xs text-left space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-gray-500 font-semibold">আপনার বর্তমান ভূমিকা:</span>
              <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-300 font-bangla">
                {currentRoleProfile.titleBn} ({currentRoleKey})
              </span>
            </div>

            {attemptedPath && (
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-gray-500 font-semibold">অনুরোধকৃত সংরক্ষিত পথ:</span>
                <span className="font-mono text-gray-800 text-[11px] bg-red-50 text-red-800 px-2 py-0.5 rounded border border-red-200">
                  {attemptedPath}
                </span>
              </div>
            )}

            {requiredRoles.length > 0 && (
              <div className="pb-2 border-b border-gray-200 space-y-1">
                <span className="text-gray-500 font-semibold block">প্রয়োজনীয় অনুমোদিত ভূমিকা:</span>
                <div className="flex flex-wrap gap-1 font-mono text-[11px]">
                  {requiredRoles.map((r) => (
                    <span key={r} className="bg-white px-2 py-0.5 rounded border border-gray-300 text-gray-800">
                      {ROLE_BN[r] || r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] text-gray-500 leading-relaxed pt-1">
              <strong>আইনি সুরক্ষাবিধি:</strong> বিচার বিভাগীয় আদেশ, ব্যাংক লিয়েন এবং সাব-রেজিস্ট্রির গোপনীয় গেটকিপার রেকর্ডসমূহ কঠোর নিরাপত্তা প্রটোকল দ্বারা নিয়ন্ত্রিত।
            </div>
          </div>

          {/* Action Directives */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <Button
                  as={Link}
                  to={getRoleHomeRoute(user?.role)}
                  variant="primary"
                  size="md"
                  leftIcon={Home}
                  className="w-full sm:w-auto bg-govt-green hover:bg-govt-green-dark"
                >
                  আমার অনুমোদিত ড্যাশবোর্ড
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  leftIcon={LogOut}
                  onClick={handleSwitchAccount}
                  className="w-full sm:w-auto text-gray-700"
                >
                  অন্য অ্যাকাউন্টে লগইন
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                to="/login"
                variant="primary"
                size="md"
                leftIcon={Lock}
                className="w-full sm:w-auto bg-govt-green hover:bg-govt-green-dark"
              >
                দাপ্তরিক লগইন পেজে যান
              </Button>
            )}

            <Button
              as={Link}
              to="/citizen"
              variant="ghost"
              size="md"
              leftIcon={Shield}
              className="w-full sm:w-auto text-gray-600"
            >
              উন্মুক্ত নাগরিক সেবা
            </Button>
          </div>

        </div>
      </div>
    </PublicLayout>
  )
}
