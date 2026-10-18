import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { Search, FileText, ClipboardCheck, Shield, BarChart3, ArrowRight, CheckCircle, AlertTriangle, Building, MapPin, Map, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'

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

function QuickAction({ to, icon: Icon, title, desc, color = 'green' }) {
  const colors = {
    green: 'border-govt-green bg-green-50/70 text-govt-green hover:bg-green-100/80',
    blue: 'border-blue-500 bg-blue-50/70 text-blue-700 hover:bg-blue-100/80',
    yellow: 'border-amber-500 bg-amber-50/70 text-amber-800 hover:bg-amber-100/80',
    purple: 'border-purple-500 bg-purple-50/70 text-purple-800 hover:bg-purple-100/80',
  }
  return (
    <Link
      to={to}
      className={`card border-l-4 flex items-start gap-4 hover:shadow-md transition-all p-5 ${colors[color]}`}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm border border-current shrink-0">
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-base leading-tight text-gray-900">{title}</div>
        <div className="text-xs text-gray-600 mt-1 leading-normal">{desc}</div>
      </div>
      <ArrowRight size={18} className="mt-1 opacity-60 shrink-0" />
    </Link>
  )
}

export default function DashboardPage() {
  const { user, hasRole } = useAuth()

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg border border-govt-border p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-500">অনলাইন অধিবেশন</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-govt-green">
              স্বাগতম, {user?.displayName || 'ব্যবহারকারী'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              পদবি: <span className="font-semibold text-govt-green">{ROLE_BN[user?.role] || user?.role}</span> | ইউজার আইডি: <span className="font-mono text-gray-700">{user?.username}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/citizen"
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Shield size={16} />
              <span>পাবলিক পোর্টাল</span>
            </Link>
            <Link
              to="/parcels"
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Search size={16} />
              <span>জমি অনুসন্ধান</span>
            </Link>
          </div>
        </div>

        {/* Demo Environment Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-500 rounded p-4 text-sm text-amber-900 flex items-start gap-3 shadow-sm">
          <AlertTriangle size={20} className="shrink-0 text-amber-600 mt-0.5" />
          <div className="leading-relaxed">
            <strong>ডেমো ও পরীক্ষামূলক পরিবেশ:</strong> এই সিস্টেমে সংরক্ষিত সকল খতিয়ান, দাগ, আদালতের আদেশ এবং ব্যাংক লিয়েনের তথ্য সম্পূর্ণ কাল্পনিক। এটি হ্যাকাথন ও আর্কিটেকচার মূল্যায়নের জন্য প্রস্তুতকৃত।
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>দ্রুত কার্যক্রম ও সার্ভিস ডিরেক্টরি</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickAction
              to="/map"
              icon={Map}
              title="মৌজা নকশা ও জিআইএস রেজিস্ট্রি"
              desc="মানচিত্রে দাগ অনুযায়ী সরাসরি আদালতের নিষেধাজ্ঞা ও ব্যাংক লিয়েন পরীক্ষণ"
              color="blue"
            />
            <QuickAction
              to="/approvals"
              icon={Scale}
              title="বিচারিক আদেশ অনুমোদন"
              desc="আদালতের খসড়া নিষেধাজ্ঞা ও স্থগিতাদেশ পর্যালোচনান্তে ডিজিটাল স্বাক্ষর"
              color="yellow"
            />
            <QuickAction
              to="/parcels"
              icon={Search}
              title="জমি ও খতিয়ান অনুসন্ধান"
              desc="মৌজা, দাগ এবং আরএস খতিয়ান নম্বর দিয়ে জমির আইনি অবস্থা যাচাই করুন"
              color="green"
            />
            <QuickAction
              to="/citizen"
              icon={Shield}
              title="নাগরিক যাচাই পোর্টাল"
              desc="লগইন ব্যতীত যেকোনো নাগরিকের জন্য জমির ঝুঁকি ও নিষেধাজ্ঞা স্ট্যাটাস"
              color="blue"
            />
            <QuickAction
              to="/verify"
              icon={Shield}
              title="কিউআর সনদপত্র যাচাই"
              desc="অফিসিয়াল কিউআর কোড স্ক্যান বা সার্টিফিকেট নম্বর দিয়ে সত্যতা নিশ্চিত করুন"
              color="green"
            />
            <QuickAction
              to="/cases"
              icon={FileText}
              title="কোর্ট অর্ডার পোর্টাল"
              desc="আদালতের দেওয়ানি মোকদ্দমা ও নিষেধাজ্ঞার নতুন আদেশ নিবন্ধন"
              color="yellow"
            />
            <QuickAction
              to="/registry"
              icon={ClipboardCheck}
              title="রেজিস্ট্রি গেটকিপার কনসোল"
              desc="দলিল নিবন্ধনের পূর্বে আদালতের স্থগিতাদেশ ও লিয়েন যাচাই তালিকা"
              color="green"
            />
            <QuickAction
              to="/mortgages"
              icon={Building}
              title="ব্যাংক বন্ধক ও লিয়েন পোর্টাল"
              desc="ব্যাংকের ঋণ জামানত হিসেবে জমি বন্ধক নিবন্ধন ও অবমুক্তি ব্যবস্থাপনা"
              color="yellow"
            />
            <QuickAction
              to="/audit"
              icon={BarChart3}
              title="সিস্টেম অডিট ট্রেইল ও লগ"
              desc="যাবতীয় প্রাতিষ্ঠানিক কার্যক্রম ও অনুমোদনের অপরিবর্তনীয় লগ পরীক্ষা"
              color="purple"
            />
          </div>
        </div>

        {/* Demo Parcels Preview */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 border-b border-govt-border pb-3">
            <div>
              <h3 className="font-bold text-lg text-govt-green flex items-center gap-2">
                <MapPin size={20} />
                <span>পরীক্ষামূলক নিবন্ধিত পার্সেলসমূহ (Dhaka District)</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">নিচের টেস্ট পার্সেলগুলোতে ক্লিক করে বিস্তারিত আইনি স্থিতি দেখতে পারেন</p>
            </div>
            <Link to="/parcels" className="text-sm text-govt-green font-semibold hover:underline">
              সব দেখুন →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
                    আদেশে অবরুদ্ধ
                  </span>
                  <span className="text-xs font-mono text-gray-500">দাগ: ৫০০১</span>
                </div>
                <div className="font-bold text-gray-900">ধানমন্ডি-০১ (দাগ ৫০০১)</div>
                <div className="text-xs text-gray-600 mt-1">
                  খতিয়ান: ১০১ (RS) | আয়তন: ১০.৫ শতাংশ
                </div>
                <p className="text-xs text-red-700 mt-2">
                  বিজ্ঞ আদালতের আদেশ অনুযায়ী বিক্রয় স্থগিত এবং ব্যাংকের সক্রিয় বন্ধক বিদ্যমান।
                </p>
              </div>
              <Link
                to="/parcels/b1000000-0000-0000-0000-000000000001"
                className="mt-3 text-xs font-semibold text-red-800 hover:underline flex items-center gap-1"
              >
                <span>বিস্তারিত দেখুন</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="p-4 rounded-lg border border-yellow-200 bg-yellow-50/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 border border-yellow-200">
                    খসড়া আদেশ বিবেচনাধীন
                  </span>
                  <span className="text-xs font-mono text-gray-500">দাগ: ৬০০২</span>
                </div>
                <div className="font-bold text-gray-900">গুলশান-০২ (দাগ ৬০০২)</div>
                <div className="text-xs text-gray-600 mt-1">
                  খতিয়ান: ২০২ (RS) | আয়তন: ১৫.০ শতাংশ
                </div>
                <p className="text-xs text-yellow-800 mt-2">
                  মামলা MS-2024-00456 দায়েরকৃত, আদেশের খসড়া বিচারকের স্বাক্ষরের অপেক্ষায়।
                </p>
              </div>
              <Link
                to="/parcels/b2000000-0000-0000-0000-000000000002"
                className="mt-3 text-xs font-semibold text-yellow-900 hover:underline flex items-center gap-1"
              >
                <span>বিস্তারিত দেখুন</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="p-4 rounded-lg border border-green-200 bg-green-50/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-200">
                    লেনদেনের জন্য পরিষ্কার
                  </span>
                  <span className="text-xs font-mono text-gray-500">দাগ: ৭০০৩</span>
                </div>
                <div className="font-bold text-gray-900">মিরপুর-০৩ (দাগ ৭০০৩)</div>
                <div className="text-xs text-gray-600 mt-1">
                  খতিয়ান: ৩০৩ (RS) | আয়তন: ৮.২৫ শতাংশ
                </div>
                <p className="text-xs text-green-700 mt-2">
                  কোনো সক্রিয় নিষেধাজ্ঞা নেই, পূর্ববর্তী বন্ধক সফলভাবে অবমুক্ত করা হয়েছে।
                </p>
              </div>
              <Link
                to="/parcels/b3000000-0000-0000-0000-000000000003"
                className="mt-3 text-xs font-semibold text-govt-green hover:underline flex items-center gap-1"
              >
                <span>বিস্তারিত দেখুন</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Scenario Step-by-Step Guide */}
        <div className="card">
          <h3 className="font-bold text-lg text-govt-green mb-4 flex items-center gap-2">
            <span>📋 ডেমো পরীক্ষামূলক দৃশ্যকল্প ও কার্যপদ্ধতি (Scenario Walkthrough)</span>
          </h3>
          <div className="space-y-3">
            {[
              {
                step: '১',
                title: 'আদালতের মামলা ও খসড়া আদেশ প্রস্তুতকরণ',
                desc: 'court_officer1 হিসেবে লগইন করে মামলা ও পার্সেল লিংক দেখুন বা নতুন আদেশ ড্রাফট করুন।',
              },
              {
                step: '২',
                title: 'বিচারক/অনুমোদনকারীর স্বাক্ষর ও অনুমোদন',
                desc: 'order_approver1 হিসেবে লগইন করে ড্রাফট করা আদালতের আদেশ পর্যালোচনা করে অনুমোদন করুন। আদেশ অনুমোদনের সাথে সাথে পার্সেলে নিষেধাজ্ঞা সক্রিয় হয়।',
              },
              {
                step: '৩',
                title: 'সাব-রেজিস্ট্রি অফিসে গেটকিপার যাচাইকরণ',
                desc: 'registry_officer1 হিসেবে লগইন করে রেজিস্ট্রি যাচাই ফর্মে পার্সেল আইডি b1000000-0000-0000-0000-000000000001 এবং SALE নির্বাচন করুন — ল্যান্ডলক ইঞ্জিন সাথে সাথে "বৈধ আদেশে অবরুদ্ধ" রায় দেবে।',
              },
              {
                step: '৪',
                title: 'নাগরিক অনুসন্ধান ও সতর্কবার্তা',
                desc: 'citizen1 বা সাধারণ নাগরিক হিসেবে নাগরিক পোর্টালে একই দাগ অনুসন্ধান করে জেনে নিন জমিটি ক্রয়ের উপযুক্ত কি না।',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-govt-border">
                <span className="w-7 h-7 bg-govt-green text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                  {step}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">{title}</h4>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
