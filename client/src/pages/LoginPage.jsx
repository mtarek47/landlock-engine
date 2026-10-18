import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth, getRoleHomeRoute } from '../context/AuthContext'
import {
  Lock,
  User,
  Shield,
  Building2,
  Scale,
  Flag,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import GovtBrandMark from '../components/design-system/GovtBrandMark'
import BrandLogo from '../components/BrandLogo'

const DEMO_ACCOUNTS = [
  { username: 'court_officer1', roleBn: 'আদালত কর্মকর্তা', icon: '🏛️' },
  { username: 'order_approver1', roleBn: 'অনুমোদনকারী বিচারক', icon: '⚖️' },
  { username: 'registry_officer1', roleBn: 'সাব-রেজিস্ট্রার', icon: '📋' },
  { username: 'bank_officer1', roleBn: 'ব্যাংক কর্মকর্তা', icon: '🏦' },
  { username: 'auditor1', roleBn: 'সিস্টেম অডিটর', icon: '📊' },
  { username: 'land_officer1', roleBn: 'সহকারী কমিশনার (ভূমি)', icon: '🗺️' },
  { username: 'admin1', roleBn: 'সিস্টেম প্রশাসক', icon: '👑' },
  { username: 'citizen1', roleBn: 'নাগরিক ব্যবহারকারী', icon: '👤' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [infoNotice, setInfoNotice] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: '',
    }
  })

  const handleSelectDemo = (username) => {
    setValue('username', username)
    setValue('password', 'demo123')
    setError('')
    setInfoNotice('')
  }

  const onSubmit = async ({ username, password }) => {
    setError('')
    setInfoNotice('')
    setLoading(true)
    try {
      const authenticatedUser = await login(username, password)
      const fromPath = location.state?.from?.pathname
      
      // If user came from a specific protected page, redirect back there (if not /login or /access-denied)
      if (fromPath && fromPath !== '/login' && fromPath !== '/access-denied') {
        navigate(fromPath, { replace: true })
      } else {
        const targetRoute = getRoleHomeRoute(authenticatedUser?.role)
        navigate(targetRoute, { replace: true })
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে। ব্যবহারকারী নাম বা পাসওয়ার্ড সঠিক নয়।'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-bangla select-none">
      
      {/* ════════════════════════════════════════════════════════════════
          LEFT COLUMN: Green agricultural background with slogans & checks
          Matching Screen 9
      ════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-6 xl:col-span-7 relative flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden min-h-[400px] lg:min-h-screen">
        {/* Background photo of Bangladesh lush paddy fields */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transform duration-1000"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg')`,
          }}
        />
        {/* Dark Emerald / Forest Green Overlay matching Screen 9 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#003B2B]/90 via-[#004D38]/85 to-[#00261C]/95" />

        {/* Top: Brand & Title */}
        <div className="relative z-10 space-y-4">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            <BrandLogo size="xl" className="shrink-0" />
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-white font-extrabold text-xl sm:text-2xl tracking-tight leading-tight font-bangla group-hover:text-green-100 transition-colors">
                  ল্যান্ডলক ইঞ্জিন
                </span>
                <img
                  src="/govt-bd.png"
                  alt="গণপ্রজাতন্ত্রী বাংলাদেশ সরকার"
                  className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-sm"
                  loading="eager"
                />
              </div>
              <div className="text-xs text-green-200/90 font-bangla tracking-tight mt-0.5">
                স্বয়ংক্রিয় ভূমি নিষেধাজ্ঞা ও দায় রেজিস্ট্রি
              </div>
            </div>
          </Link>

          <div className="pt-8 sm:pt-14">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-md">
              নিরাপদ জমি, নিশ্চিত ভবিষ্যৎ
            </h1>
          </div>
        </div>

        {/* Middle: 4 Key Pillars with Checkmarks matching Screen 9 */}
        <div className="relative z-10 py-8 sm:py-12 space-y-4 max-w-md">
          <div className="flex items-center gap-3.5 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <Shield size={16} />
            </div>
            <span className="text-sm sm:text-base font-semibold text-white">
              দ্রুত ইন্টিগ্রেশন
            </span>
          </div>

          <div className="flex items-center gap-3.5 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <Building2 size={16} />
            </div>
            <span className="text-sm sm:text-base font-semibold text-white">
              সরকারি সেবা
            </span>
          </div>

          <div className="flex items-center gap-3.5 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <Scale size={16} />
            </div>
            <span className="text-sm sm:text-base font-semibold text-white">
              স্বচ্ছতা ও জবাবদিহিতা
            </span>
          </div>

          <div className="flex items-center gap-3.5 bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-400/30">
              <Flag size={16} />
            </div>
            <span className="text-sm sm:text-base font-semibold text-white">
              ডিজিটাল বাংলাদেশ
            </span>
          </div>
        </div>

        {/* Bottom: Statutory Note */}
        <div className="relative z-10 text-[11px] text-green-200/80 font-sans border-t border-white/15 pt-4">
          Government Land Verification & Encumbrance Coordination System &copy; 2026
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          RIGHT COLUMN: Clean White Form matching Screen 9
      ════════════════════════════════════════════════════════════════ */}
      <div className="lg:col-span-6 xl:col-span-5 bg-white flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 select-text">
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* Mobile Top Brand (visible on small screens where hero is scrolled) */}
          <div className="lg:hidden flex items-center justify-between pb-4 border-b border-gray-100">
            <BrandLogo size="sm" showWordmark={true} withLink={true} to="/" variant="dark" />
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              নিরাপদ প্রবেশ
            </span>
          </div>

          {/* Heading matching Screen 9 */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              পোর্টালে লগইন করুন
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              আপনার অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          {/* Active session warning if already logged in */}
          {isAuthenticated && user && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between">
              <div>
                <span className="font-bold">সক্রিয় লগইন:</span> {user.displayName} ({user.role})
              </div>
              <Link to="/dashboard" className="text-[#006A4E] font-bold hover:underline">
                ড্যাশবোর্ড →
              </Link>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-300 text-red-900 rounded-xl text-xs flex items-center gap-2">
              <span className="font-bold">ত্রুটি:</span> {error}
            </div>
          )}

          {/* Form matching Screen 9 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Input 1: ব্যবহারকারীর নাম / ইমেইল */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                ব্যবহারকারীর নাম / ইমেইল <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('username', { required: true })}
                placeholder="username@example.com"
                className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent font-sans"
              />
            </div>

            {/* Input 2: পাসওয়ার্ড with toggle visibility */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                পাসওয়ার্ড <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: true })}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="w-full text-xs sm:text-sm py-2.5 px-3.5 pr-10 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখান'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Row: Remember me checkbox + Forgot password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#006A4E] focus:ring-[#006A4E]"
                />
                <span>আমাকে মনে রাখুন</span>
              </label>

              <button
                type="button"
                onClick={() => setInfoNotice('পাসওয়ার্ড পুনরুদ্ধারের জন্য অনুগ্রহ করে সিস্টেম অ্যাডমিনিস্ট্রেটর বা হেল্পলাইন ১৬১২২-এ যোগাযোগ করুন।')}
                className="text-xs text-[#006A4E] hover:underline font-medium"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            {/* Information Notice Alert */}
            {infoNotice && (
              <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-xs leading-relaxed flex items-start gap-2">
                <span className="font-bold shrink-0">ℹ নোটিশ:</span>
                <span>{infoNotice}</span>
              </div>
            )}

            {/* Full-width dark green Login Button matching Screen 9 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock size={15} />
              <span>{loading ? 'প্রবেশ করা হচ্ছে...' : 'লগইন'}</span>
            </button>

            {/* Bottom link matching Screen 9: অ্যাকাউন্ট নেই? রেজিস্ট্রেশন করুন */}
            <div className="text-center text-xs text-gray-500 pt-2">
              অ্যাকাউন্ট নেই?{' '}
              <button
                type="button"
                onClick={() => setInfoNotice('সরকারি দাপ্তরিক অ্যাকাউন্ট খোলার জন্য বিভাগীয় নোডাল অফিসারের লিখিত অনুমোদন প্রয়োজন। উন্মুক্ত নাগরিক অনুসন্ধানের জন্য কোনো অ্যাকাউন্টের প্রয়োজন নেই।')}
                className="text-[#006A4E] font-bold hover:underline"
              >
                রেজিস্ট্রেশন করুন
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-6 border-t border-gray-100 space-y-2.5">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              দ্রুত পরীক্ষার জন্য ডেমো অ্যাকাউন্ট:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.username}
                  type="button"
                  onClick={() => handleSelectDemo(acc.username)}
                  className="p-2 text-left bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg text-xs transition-colors group"
                >
                  <div className="flex items-center gap-1.5 font-bold text-gray-800 group-hover:text-[#006A4E]">
                    <span>{acc.icon}</span>
                    <span className="truncate">{acc.roleBn}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                    {acc.username}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
