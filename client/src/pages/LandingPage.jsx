import { Link } from 'react-router-dom'
import { Shield, Search, FileCheck, AlertTriangle, ArrowRight, Building, CheckCircle2, Lock, Map, Layers } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-govt-paper font-bangla flex flex-col justify-between">
      <div>
        {/* Top gold stripe */}
        <div className="h-1.5 bg-govt-gold" />

        {/* Header */}
        <header className="bg-govt-green text-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-govt-green font-bold text-lg border-2 border-govt-gold shadow">
                বা
              </div>
              <div>
                <div className="text-xs text-green-200">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
                <div className="font-bold text-xl sm:text-2xl leading-tight">ল্যান্ডলক ইঞ্জিন</div>
                <div className="text-xs text-green-200">ভূমি নিষেধাজ্ঞা ও দলিল বোঝাই রেজিস্ট্রি</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/map"
                className="hidden sm:inline-flex items-center gap-1.5 text-white hover:text-green-100 text-sm font-medium px-3 py-2 rounded transition-colors"
              >
                <Map size={16} />
                <span>মৌজা নকশা (GIS)</span>
              </Link>
              <Link
                to="/citizen"
                className="hidden sm:inline-block text-white hover:text-green-100 text-sm font-medium px-3 py-2 rounded transition-colors"
              >
                নাগরিক অনুসন্ধান
              </Link>
              <Link
                to="/login"
                className="bg-white text-govt-green px-5 py-2 rounded font-semibold hover:bg-green-50 transition-colors shadow-sm flex items-center gap-2 text-sm"
              >
                <Lock size={16} />
                <span>প্রাতিষ্ঠানিক লগইন</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="bg-gradient-to-b from-govt-green to-govt-green-dark text-white pb-20 pt-12 px-4 shadow-inner">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-100 text-sm px-4 py-1.5 rounded-full border border-white/20 mb-6 backdrop-blur-sm">
              <Shield size={16} className="text-govt-gold" />
              <span>ভূমি রেজিস্ট্রেশন নিরাপত্তা ও বিরোধ নিরসন প্ল্যাটফর্ম</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
              নিরাপদ ভূমি লেনদেন নিশ্চিত করুন
            </h1>
            <p className="text-green-100 text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
              ল্যান্ডলক ইঞ্জিন আদালতের নিষেধাজ্ঞা আদেশ, ভূমি বিরোধ এবং ব্যাংকের বন্ধকী তথ্য একটি সমন্বিত ডেটাবেজে রিয়েল-টাইমে সংরক্ষণ করে। সাব-রেজিস্ট্রার ও ব্যাংকের দলিল নিবন্ধনের পূর্বেই স্বয়ংক্রিয় ব্লকিং যাচাইকরণ সম্পন্ন হয়।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/citizen"
                className="w-full sm:w-auto bg-govt-gold text-gray-900 px-7 py-3.5 rounded-lg font-bold text-base hover:bg-yellow-400 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Search size={20} />
                <span>জমির ঝুঁকি অনুসন্ধান করুন</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/map"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-400 px-7 py-3.5 rounded-lg font-bold text-base transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Map size={20} />
                <span>মৌজা নকশা (স্যাটেলাইট)</span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 px-7 py-3.5 rounded-lg font-semibold text-base transition-colors flex items-center justify-center gap-2"
              >
                <Building size={20} />
                <span>প্রাতিষ্ঠানিক প্রবেশ</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-govt-green">মূল সেবাসমূহ ও বৈশিষ্ট্য</h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              ভূমি বিরোধ, প্রতারণামূলক রেজিস্ট্রি এবং জালিয়াতি প্রতিরোধে আধুনিক প্রযুক্তি
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-govt-border p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-50 text-govt-green rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
                <Shield size={32} />
              </div>
              <h3 className="font-bold text-lg text-govt-green mb-2">স্বয়ংক্রিয় নিষেধাজ্ঞা যাচাই</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                বিজ্ঞ আদালতের নিষেধাজ্ঞা, স্থগিতাদেশ বা বণ্টন সংক্রান্ত আদেশ তাৎক্ষণিকভাবে রেজিস্ট্রি অফিসে হস্তান্তরের সময় যাচাই হয়ে লেনদেন প্রতিহত করে।
              </p>
            </div>

            <div className="bg-white rounded-lg border border-govt-border p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
                <Search size={32} />
              </div>
              <h3 className="font-bold text-lg text-blue-800 mb-2">নাগরিক খতিয়ান ও দাগ অনুসন্ধান</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                যেকোনো জমি ক্রয়ের পূর্বে নাগরিকরা সরাসরি মৌজা, আরএস খতিয়ান ও দাগ নম্বর দিয়ে জমির উপর কোনো আইনি বিধিনিষেধ বা ব্যাংকের দায় আছে কি না দেখতে পারেন।
              </p>
            </div>

            <div className="bg-white rounded-lg border border-govt-border p-6 shadow-sm text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <FileCheck size={32} />
              </div>
              <h3 className="font-bold text-lg text-amber-800 mb-2">অডিট ট্রেইল ও স্বচ্ছতা</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                প্রতিটি আদালতের আদেশ সংযোজন, সহকারী কমিশনার (ভূমি) বা সাব-রেজিস্ট্রারের সিদ্ধান্ত অপরিবর্তনীয় অডিট লগে সংরক্ষিত থাকে।
              </p>
            </div>
          </div>
        </section>

        {/* Demo Documentation & Walkthrough Guide */}
        <section className="bg-emerald-50/60 border-b border-govt-border py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <span className="bg-govt-green text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                ডেমো নির্দেশিকা ও ডক্যুমেন্টেশন
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-govt-green mt-3">
                কীভাবে প্রোটোটাইপটি পরীক্ষা করবেন (Demo Walkthrough)
              </h2>
              <p className="text-gray-600 text-sm max-w-2xl mx-auto mt-2">
                সিস্টেমের পূর্ণাঙ্গ সক্ষমতা ও আইনগত ব্লক যাচাইকরণের জন্য নিচের ৪টি ধারাবাহিক ধাপ অনুসরণ করুন
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-lg border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-govt-green text-white font-bold flex items-center justify-center text-sm">
                    ১
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">নাগরিক উন্মুক্ত অনুসন্ধান (Citizen Search)</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  কোনো লগইন ছাড়াই সাধারণ নাগরিক হিসেবে জমির ঝুঁকি দেখুন। প্রাক-নির্ধারিত ডেমো বোতামে ক্লিক করে ধানমন্ডি (দাগ ৫০০১) অনুসন্ধান করলে নিষেধাজ্ঞা এবং মিরপুর (দাগ ৭০০৩) অনুসন্ধান করলে ক্লিয়ার স্ট্যাটাস দেখতে পাবেন।
                </p>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] text-gray-700 font-mono">
                  টেস্ট ডেটা: মৌজা: <span className="font-bold text-govt-green">DHANMONDI-01</span> | দাগ: <span className="font-bold text-govt-green">5001</span> (অবরুদ্ধ)
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-lg border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-govt-green text-white font-bold flex items-center justify-center text-sm">
                    ২
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">আদালত আদেশ ও ৪-আই নীতি (Four-Eyes Approval)</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  <code className="text-govt-green font-semibold">court_officer1</code> হিসেবে মামলা তৈরি ও আদেশ দাখিল করুন। এরপর <code className="text-govt-green font-semibold">order_approver1</code> হিসেবে লগইন করে আদেশ অনুমোদন করুন। তৈরিকারী কর্মকর্তা নিজের আদেশ নিজে অনুমোদন করতে পারবেন না।
                </p>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] text-gray-700 font-mono">
                  ডেমো মামলা: <span className="font-bold">OS-2024-00123</span> (দেওয়ানি চিরস্থায়ী নিষেধাজ্ঞা)
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-lg border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-govt-green text-white font-bold flex items-center justify-center text-sm">
                    ৩
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">সাব-রেজিস্ট্রি গেটকিপার (Registry Gatekeeper)</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  <code className="text-govt-green font-semibold">registry_officer1</code> হিসেবে লগইন করে রেজিস্ট্রেশন যাচাই করুন। ধানমন্ডি দাগ ৫০০১ এ বিক্রয় (SALE) দলিলের জন্য গেটকিপার সরাসরি <strong className="text-red-700">BLOCKED_BY_VALID_ORDER</strong> ফলাফল দেবে।
                </p>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] text-gray-700 font-mono">
                  সিদ্ধান্ত: <span className="font-bold text-red-700">BLOCKED_BY_VALID_ORDER</span> (আদালতের আদেশ নং ORD-DH-2024-991)
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-lg border-2 border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-govt-green text-white font-bold flex items-center justify-center text-sm">
                    ৪
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">অপরিবর্তনীয় অডিট ট্রেইল (Immutable Audit Log)</h3>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">
                  <code className="text-govt-green font-semibold">auditor1</code> বা <code className="text-govt-green font-semibold">admin1</code> হিসেবে লগইন করে অডিট পেজে যান। প্রতিটি অনুমোদন, গেটকিপার চেক এবং বন্ধক এন্ট্রির অপরিবর্তনীয় টাইমস্ট্যাম্প ও কোরিলেশন ট্র্যাক করুন।
                </p>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] text-gray-700 font-mono">
                  নিরাপত্তা: <span className="font-bold text-emerald-800">অপরিবর্তনীয় ও হ্যাস-চেইন সুরক্ষিত অডিট ট্রেইল</span>
                </div>
              </div>
            </div>

            {/* Quick Demo Credentials Table */}
            <div className="bg-white rounded-lg border border-govt-border p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <h4 className="font-bold text-govt-green text-sm flex items-center gap-2">
                  <Building size={16} />
                  <span>ডেমো ইউজার অ্যাকাউন্ট ক্রেডেনশিয়াল (পাসওয়ার্ড সবার জন্য: <code className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">demo123</code>)</span>
                </h4>
                <Link to="/login" className="text-xs text-govt-green hover:underline font-semibold flex items-center gap-1">
                  <span>লগইন পেজে যান</span> <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="font-mono font-bold text-gray-800">court_officer1</div>
                  <div className="text-[11px] text-gray-500">আদালত কর্মকর্তা</div>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="font-mono font-bold text-gray-800">order_approver1</div>
                  <div className="text-[11px] text-gray-500">আদেশ অনুমোদনকারী</div>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="font-mono font-bold text-gray-800">registry_officer1</div>
                  <div className="text-[11px] text-gray-500">রেজিস্ট্রি কর্মকর্তা</div>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-200">
                  <div className="font-mono font-bold text-gray-800">bank_officer1</div>
                  <div className="text-[11px] text-gray-500">ব্যাংক কর্মকর্তা</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stakeholder workflow */}
        <section className="bg-white border-y border-govt-border py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-govt-green mb-8">
              সমন্বিত প্রাতিষ্ঠানিক নেটওয়ার্ক
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-lg bg-gray-50 border border-govt-border">
                <div className="font-bold text-govt-green text-lg mb-1">আদালত</div>
                <div className="text-xs text-gray-500 mb-2">Court of Law</div>
                <p className="text-xs text-gray-600">দেওয়ানি ও অন্যান্য মামলার নিষেধাজ্ঞা নথিভুক্তকরণ</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-govt-border">
                <div className="font-bold text-govt-green text-lg mb-1">ভূমি প্রশাসন</div>
                <div className="text-xs text-gray-500 mb-2">AC Land & Revenue</div>
                <p className="text-xs text-gray-600">খতিয়ান ও দাগের সীমানা ও রেকর্ডের সত্যতা প্রতিপাদন</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-govt-border">
                <div className="font-bold text-govt-green text-lg mb-1">সাব-রেজিস্ট্রি অফিস</div>
                <div className="text-xs text-gray-500 mb-2">Sub-Registry Office</div>
                <p className="text-xs text-gray-600">দলিল নিবন্ধনের পূর্বে গেটকিপার যাচাইকরণ</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 border border-govt-border">
                <div className="font-bold text-govt-green text-lg mb-1">তফসিলি ব্যাংক</div>
                <div className="text-xs text-gray-500 mb-2">Scheduled Banks</div>
                <p className="text-xs text-gray-600">বন্ধকী লিয়েন এন্ট্রি ও দায়মুক্তি যাচাই</p>
              </div>
            </div>
          </div>
        </section>

        {/* Important Warning disclaimer */}
        <section className="max-w-5xl mx-auto px-4 py-10">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-5 flex gap-4 items-start shadow-sm">
            <AlertTriangle className="text-yellow-700 shrink-0 mt-1" size={24} />
            <div className="text-sm text-yellow-900 leading-relaxed">
              <strong className="text-base font-bold block mb-1">গুরুত্বপূর্ণ সতর্কীকরণ ও ঘোষণাপত্র:</strong>
              এটি একটি হ্যাকাথন ও প্রোটোটাইপ প্রদর্শনী ব্যবস্থা। সিস্টেমে প্রদর্শিত সকল জমির দাগ, খতিয়ান, মামলা এবং ব্যক্তির নাম সম্পূর্ণ কাল্পনিক ও পরীক্ষামূলক। এই সিস্টেমের কোনো তথ্য সরকারি প্রত্যয়নপত্র বা আইনগত দলিলের স্থলাভিষিক্ত নয়। প্রকৃত লেনদেনের জন্য সংশ্লিষ্ট সাব-রেজিস্ট্রি এবং ভূমি অফিসে সরাসরি যাচাই আবশ্যক।
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-govt-green text-green-200 text-center py-6 text-sm border-t border-govt-green-dark">
        <div className="max-w-5xl mx-auto px-4">
          <div className="h-0.5 bg-govt-gold mb-4" />
          <p className="font-medium text-white">ল্যান্ডলক ইঞ্জিন — ভূমি শাসন ও নিরাপত্তা প্রোটোটাইপ</p>
          <p className="text-xs text-green-300 mt-1">কপিরাইট © ২০২৬ | গবেষণা ও প্রযুক্তি প্রদর্শনী | গণপ্রজাতন্ত্রী বাংলাদেশ সরকারের প্রতীকী আদল</p>
        </div>
      </footer>
    </div>
  )
}
