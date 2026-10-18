import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { Lock, User, AlertCircle, ArrowLeft, KeyRound, Check } from 'lucide-react'

const DEMO_USERS = [
  { username: 'court_officer1', role: 'আদালত কর্মকর্তা', desc: 'মামলা ও নিষেধাজ্ঞার আদেশ প্রস্তুতকারী' },
  { username: 'order_approver1', role: 'আদেশ অনুমোদনকারী', desc: 'আদালতের আদেশ অনুমোদনকারী বিচারক/কর্মকর্তা' },
  { username: 'registry_officer1', role: 'রেজিস্ট্রি কর্মকর্তা', desc: 'সাব-রেজিস্ট্রার — দলিল নিবন্ধনের পূর্বে যাচাই' },
  { username: 'bank_officer1', role: 'ব্যাংক কর্মকর্তা', desc: 'ঋণ কর্মকর্তা — লিয়েন ও বন্ধক ব্যবস্থাপনা' },
  { username: 'land_officer1', role: 'ভূমি কর্মকর্তা', desc: 'সহকারী কমিশনার (ভূমি) — খতিয়ান ও দাগ রেজিস্ট্রি' },
  { username: 'auditor1', role: 'অডিটর', desc: 'নিরাপত্তা ও লেনদেন নিরীক্ষা কর্মকর্তা' },
  { username: 'admin1', role: 'সিস্টেম প্রশাসক', desc: 'সম্পূর্ণ সিস্টেম ও ব্যবহারকারী নিয়ন্ত্রণ' },
  { username: 'citizen1', role: 'নাগরিক', desc: 'ভূমি ক্রেতা/স্বত্বাধিকারী সাধারণ নাগরিক' },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, user, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      username: '',
      password: '',
    }
  })

  const handleSelectDemo = (username) => {
    setValue('username', username)
    setValue('password', 'demo123')
    setSelectedUser(username)
    setError('')
  }

  const onSubmit = async ({ username, password }) => {
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে। ব্যবহারকারী নাম বা পাসওয়ার্ড সঠিক নয়।'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-govt-paper font-bangla flex flex-col justify-between">
      <div>
        <div className="h-1.5 bg-govt-gold" />
        <header className="bg-govt-green text-white py-4 px-6 shadow-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-govt-green font-bold border-2 border-govt-gold text-sm shadow">
                বা
              </div>
              <div>
                <div className="text-xs text-green-200">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
                <div className="font-bold text-lg">ল্যান্ডলক ইঞ্জিন — প্রাতিষ্ঠানিক প্রবেশদ্বার</div>
              </div>
            </Link>
            <Link
              to="/"
              className="text-white/80 hover:text-white text-xs sm:text-sm flex items-center gap-1 hover:underline"
            >
              <ArrowLeft size={16} />
              <span>মূল পাতায় ফিরে যান</span>
            </Link>
          </div>
        </header>

        <div className="max-w-6xl mx-auto py-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Login Form */}
            <div className="lg:col-span-5 card shadow-md border-t-4 border-t-govt-green">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-50 text-govt-green rounded-full flex items-center justify-center mx-auto mb-3 border border-green-200">
                  <Lock size={28} />
                </div>
                <h1 className="text-2xl font-bold text-govt-green">প্রাতিষ্ঠানিক লগইন</h1>
                <p className="text-gray-500 text-sm mt-1">আপনার অনুমোদিত দাপ্তরিক আইডি দিয়ে প্রবেশ করুন</p>
              </div>

              {isAuthenticated && user && (
                <div className="bg-emerald-50 border border-emerald-300 rounded p-3 mb-4 text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">সক্রিয় সেশন:</span> {user.displayName} ({user.role})
                  </div>
                  <Link to="/dashboard" className="text-govt-green font-bold hover:underline shrink-0 ml-2">
                    ড্যাশবোর্ড →
                  </Link>
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 bg-red-50 border border-red-300 text-red-700 rounded p-3 mb-5 text-sm"
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                <div>
                  <label htmlFor="username" className="label">ব্যবহারকারী নাম (Username)</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="username"
                      type="text"
                      autoComplete="username"
                      className={`input-field pl-10 font-sans ${errors.username ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                      placeholder="যেমন: court_officer1"
                      {...register('username', { required: 'ব্যবহারকারী নাম আবশ্যক' })}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-600 text-xs mt-1" role="alert">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="label">পাসওয়ার্ড (Password)</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className={`input-field pl-10 font-sans ${errors.password ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                      placeholder="আপনার গোপন পাসওয়ার্ড লিখুন"
                      {...register('password', { required: 'পাসওয়ার্ড প্রদান করুন' })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1" role="alert">{errors.password.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>প্রবেশ যাচাই করা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} />
                        <span>সিস্টেমে প্রবেশ করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-govt-border text-center">
                <Link to="/citizen" className="text-govt-green text-sm font-semibold hover:underline">
                  নাগরিকরা সরাসরি অনুসন্ধানের জন্য এখানে ক্লিক করুন →
                </Link>
              </div>
            </div>

            {/* Demo Accounts List */}
            <div className="lg:col-span-7 card shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-govt-border mb-4">
                <div>
                  <h2 className="font-bold text-lg text-govt-green flex items-center gap-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-0.5 rounded border border-yellow-300">
                      ডেমো ক্রেডেনশিয়াল
                    </span>
                    পরীক্ষামূলক ব্যবহারকারী তালিকা
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    যেকোনো অ্যাকাউন্টে ক্লিক করলে ফর্মে স্বয়ংক্রিয়ভাবে ব্যবহারকারী নাম ও পাসওয়ার্ড বসে যাবে।
                  </p>
                </div>
                <div className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-300">
                  Password: demo123
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_USERS.map(({ username, role, desc }) => {
                  const isCurrent = selectedUser === username
                  return (
                    <button
                      key={username}
                      type="button"
                      onClick={() => handleSelectDemo(username)}
                      className={`text-left p-3 rounded-lg border transition-all flex flex-col justify-between ${
                        isCurrent
                          ? 'border-govt-green bg-green-50/80 ring-2 ring-govt-green/40'
                          : 'border-govt-border hover:border-govt-green hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-gray-800 bg-white px-2 py-0.5 rounded border border-gray-200">
                          {username}
                        </span>
                        {isCurrent ? (
                          <span className="text-govt-green flex items-center gap-1 text-xs font-bold">
                            <Check size={14} /> নির্বাচিত
                          </span>
                        ) : null}
                      </div>
                      <div className="text-sm font-semibold text-govt-green">{role}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{desc}</div>
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 p-3.5 bg-yellow-50 border border-yellow-300 rounded text-xs text-yellow-900 leading-relaxed">
                <strong>নির্দেশনা:</strong> বিচারক বা অনুমোদনকারীর ক্ষমতা দেখতে <code>order_approver1</code> বেছে নিন। সাব-রেজিস্ট্রার হিসেবে জমি হস্তান্তরের গেটকিপার চেক করতে <code>registry_officer1</code> ব্যবহার করুন।
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t border-govt-border py-4 text-center text-xs text-gray-500">
        গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রতীকী আদলে তৈরি | ল্যান্ডলক ইঞ্জিন হ্যাকাথন প্রোটোটাইপ
      </footer>
    </div>
  )
}
