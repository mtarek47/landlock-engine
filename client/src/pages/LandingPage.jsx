import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  Search,
  Lock,
  Building2,
  Users,
  CheckCircle2,
  PhoneCall,
  Menu,
  X,
  Scale,
  FileText,
  Map,
  ClipboardCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Send,
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Award,
} from 'lucide-react'
import GovernmentHeader from '../components/layout/GovernmentHeader'
import GovernmentFooter from '../components/layout/GovernmentFooter'
import { toBengaliNumber } from '../components/design-system/constants'

export default function LandingPage() {
  const navigate = useNavigate()
  const [dag, setDag] = useState('')
  const [khatian, setKhatian] = useState('')
  const [mouza, setMouza] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)

  // FAQ search & accordion state
  const [faqSearch, setFaqSearch] = useState('')
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (dag.trim()) params.append('dag', dag.trim())
    if (khatian.trim()) params.append('khatian', khatian.trim())
    if (mouza.trim()) params.append('mouza', mouza.trim())
    params.append('submitted', 'true')
    navigate(`/citizen?${params.toString()}`)
  }

  const FAQ_ITEMS = [
    {
      q: 'ল্যান্ডলক ইঞ্জিন (LandLock Engine)-এর মূল উদ্দেশ্য কী?',
      tag: 'সিস্টেম পরিচিতি',
      a: 'ল্যান্ডলক ইঞ্জিন হলো বাংলাদেশ সরকারের একটি স্বয়ংক্রিয় বিচারিক ও ভূমি রেজিস্ট্রি সমন্বয় ব্যবস্থা (Automated Injunction & Title Encumbrance Registry)। এর মূল লক্ষ্য হলো বিজ্ঞ আদালত কর্তৃক জারিকৃত স্থগিতাদেশ এবং ব্যাংকের বন্ধকী দায় রিয়েল-টাইমে সাব-রেজিস্ট্রার ও ভূমি অফিসের সাথে সমন্বয় করে বিরোধপূর্ণ জমির অবৈধ সাফ-কবলা দলিল সম্পাদন বা নামজারি স্থায়ীভাবে বন্ধ করা।',
    },
    {
      q: 'এই সিস্টেমে আদালতের স্থগিতাদেশ কীভাবে কার্যকর হয়?',
      tag: 'বিচারিক প্রক্রিয়া',
      a: 'বিজ্ঞ আদালতে দেওয়ানি মোকদ্দমা চলাকালীন যখন বিচারক কোনো খতিয়ান বা দাগের উপর নিষেধাজ্ঞা আদেশ অনুমোদন করেন, সিস্টেম উক্ত পার্সেলে সক্রিয় "COURT_INJUNCTION" স্ট্যাটাস জারি করে। পরবর্তীতে সাব-রেজিস্ট্রি অফিসে জমি বিক্রি বা হস্তান্তরের চেষ্টা করা হলে গেটকিপার স্ক্রিনে তাৎক্ষণিক "BLOCKED_BY_VALID_ORDER" সতর্কবার্তা প্রদর্শনপূর্বক দলিল নিবন্ধন আটকে দেয়।',
    },
    {
      q: 'সাধারণ নাগরিক কীভাবে জমির দায় ও মামলার তথ্য অনুসন্ধান করবেন?',
      tag: 'জমি অনুসন্ধান',
      a: 'যে কোনো নাগরিক হোমপেজের সার্চ বক্সে বা "জমি অনুসন্ধান" পেজে গিয়ে জেলা, উপজেলা, মৌজা এবং দাগ নম্বর ইনপুট দিয়ে কয়েক সেকেন্ডের মধ্যে দেখতে পারবেন জমিটিতে কোনো আদালতের মামলা, স্থগিতাদেশ অথবা ব্যাংকের অপরিশোধিত বন্ধক রয়েছে কি না।',
    },
    {
      q: 'সাব-রেজিস্ট্রি গেটকিপার লক কীভাবে কাজ করে?',
      tag: 'রেজিস্ট্রি গেটকিপার',
      a: 'সাব-রেজিস্ট্রার দলিল নিবন্ধনের পূর্বে সিস্টেমে জমির তথ্য প্রদান করেন। যদি জমির উপর বিজ্ঞ আদালতের সক্রিয় নিষেধাজ্ঞা থাকে, গেটকিপার সিদ্ধান্ত প্রদান করে "BLOCKED"। কোনো বন্ধক থাকলে "MORTGAGE_REQUIRES_RELEASE" এবং সম্পূর্ণ বিরোধমুক্ত হলে "CLEAR" সিদ্ধান্ত প্রদর্শন করে।',
    },
    {
      q: 'ডিজিটাল অনাপত্তি সনদ (Clearance Certificate) কীভাবে সংগ্রহ করা যায়?',
      tag: 'সনদপত্র',
      a: 'যাচাইকৃত বিরোধমুক্ত জমির ক্ষেত্রে সিস্টেম হতে ডিজিটাল স্বাক্ষরিত এবং কিউআর কোড সংবলিত অনাপত্তি সনদপত্র ডাউনলোড করা যায়, যা ব্যাংক ঋণ এবং দলিল রেজিস্ট্রেশনের জন্য প্রামাণ্য হিসেবে ব্যবহারযোগ্য।',
    },
  ]

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return FAQ_ITEMS
    const q = faqSearch.toLowerCase().trim()
    return FAQ_ITEMS.filter(
      (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)
    )
  }, [faqSearch])

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true)
      setTimeout(() => {
        setNewsletterSuccess(false)
        setNewsletterEmail('')
      }, 4000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8F9FA] font-bangla select-none text-gray-900">
      <div>
        {/* ========================================================================= */}
        {/* 1. TOP HEADER (LandLock Engine Institutional Header matching Screen 1) */}
        {/* ========================================================================= */}
        <GovernmentHeader variant="public" />

        {/* ========================================================================= */}
        {/* 2. SECONDARY SUB-NAVBAR (White Bar matching Screen 1 - Corner Aligned) */}
        {/* ========================================================================= */}
        <nav className="bg-white border-b border-gray-200 shadow-2xs sticky top-[57px] z-30">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              {/* Left / Corner: Navigation Menu Links with horizontal scroll on mobile */}
              <div className="flex items-center space-x-5 sm:space-x-7 text-xs sm:text-sm overflow-x-auto no-scrollbar py-1">
                <Link
                  to="/"
                  className="text-[#006A4E] font-bold border-b-2 border-[#006A4E] py-3 inline-flex items-center whitespace-nowrap shrink-0"
                >
                  হোম
                </Link>
                <Link
                  to="/citizen"
                  className="text-gray-700 hover:text-[#006A4E] font-medium transition-colors py-3 whitespace-nowrap shrink-0"
                >
                  জমি অনুসন্ধান
                </Link>
                <Link
                  to="/map"
                  className="text-gray-700 hover:text-[#006A4E] font-medium transition-colors py-3 whitespace-nowrap shrink-0"
                >
                  মৌজা নকশা (GIS)
                </Link>
                <a
                  href="#services"
                  className="text-gray-700 hover:text-[#006A4E] font-medium transition-colors py-3 whitespace-nowrap shrink-0"
                >
                  সেবাসমূহ
                </a>
                <a
                  href="#workflow"
                  className="text-gray-700 hover:text-[#006A4E] font-medium transition-colors py-3 whitespace-nowrap shrink-0"
                >
                  কার্যপ্রণালী
                </a>
                <a
                  href="#support"
                  className="text-gray-700 hover:text-[#006A4E] font-medium transition-colors py-3 whitespace-nowrap shrink-0"
                >
                  সহায়তা
                </a>
                <a
                  href="#contact"
                  className="text-gray-700 hover:text-[#006A4E] font-medium transition-colors py-3 whitespace-nowrap shrink-0"
                >
                  যোগাযোগ
                </a>
              </div>

              {/* Right / Corner: Fast Utility Link for balance on desktop */}
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                <Link
                  to="/verify-certificate"
                  className="inline-flex items-center gap-1.5 text-xs text-[#006A4E] hover:text-[#004137] bg-emerald-50/80 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-full border border-emerald-200 transition-colors"
                >
                  <FileCheck size={14} className="text-[#006A4E]" />
                  <span>অনাপত্তি সনদ যাচাই</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* ========================================================================= */}
        {/* 3. HERO SECTION (Exact Screen 1: Agricultural Field Backdrop + Search Box) */}
        {/* ========================================================================= */}
        <section className="relative min-h-[420px] sm:min-h-[460px] flex items-center justify-center bg-gray-900 overflow-hidden">
          {/* Lush Green Crop Field Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-102 transform duration-700"
            style={{
              backgroundImage: `url('/images/hero-bg.jpg')`,
            }}
          />
          {/* Subtle gradient vignette to keep text crisp and readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/55" />

          {/* Hero Content matching Screen 1 */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 py-12 text-center text-white">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md mb-3 leading-tight text-white">
              জমির নিরাপত্তা নিশ্চিত করুন
            </h1>
            <p className="text-xs sm:text-base text-gray-100 max-w-2xl mx-auto drop-shadow-sm font-medium mb-8 leading-relaxed [text-wrap:balance]">
              ল্যান্ডলক ইঞ্জিন — আদালতের নিষেধাজ্ঞা, আইনি বিরোধ ও ব্যাংক বন্ধক সম্পর্কিত তথ্যের নির্ভরযোগ্য যাচাই সেবা
            </p>

            {/* Floating White Search Card matching Screen 1 */}
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-3 sm:p-4 shadow-xl max-w-4xl mx-auto border border-white/60">
              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center"
              >
                {/* Input 1: দাগ নম্বর */}
                <div className="relative">
                  <input
                    type="text"
                    value={dag}
                    onChange={(e) => setDag(e.target.value)}
                    placeholder="দাগ নম্বর (যেমন: ১২৩৪)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent bg-white shadow-2xs"
                  />
                </div>

                {/* Input 2: খতিয়ান নম্বর */}
                <div className="relative">
                  <input
                    type="text"
                    value={khatian}
                    onChange={(e) => setKhatian(e.target.value)}
                    placeholder="খতিয়ান নম্বর (যেমন: ৫৬৭)"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent bg-white shadow-2xs"
                  />
                </div>

                {/* Input 3: মৌজা নম্বর */}
                <div className="relative">
                  <input
                    type="text"
                    value={mouza}
                    onChange={(e) => setMouza(e.target.value)}
                    placeholder="মৌজা নম্বর বা নাম"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-transparent bg-white shadow-2xs"
                  />
                </div>

                {/* Search Button (Dark Green) */}
                <div>
                  <button
                    type="submit"
                    className="w-full bg-[#006A4E] hover:bg-[#004137] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Search size={16} />
                    <span>অনুসন্ধান করুন</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. 4 FEATURE CARDS DIRECTLY BELOW HERO (Exact Screen 1) */}
        {/* ========================================================================= */}
        <section className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: দ্রুত যাচাই */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center border border-emerald-100">
                <Shield size={26} className="text-[#006A4E]" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                দ্রুত যাচাই
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                কয়েক সেকেন্ডে ফলাফল
              </p>
            </div>

            {/* Card 2: নিরাপদ লেনদেন */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center border border-emerald-100">
                <Lock size={26} className="text-[#006A4E]" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                নিরাপদ লেনদেন
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                আইনি ঝুঁকি এড়িয়ে চলুন
              </p>
            </div>

            {/* Card 3: সরকারি সেবা */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center border border-emerald-100">
                <Building2 size={26} className="text-[#006A4E]" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                সরকারি সেবা
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                একটি প্ল্যাটফর্মেই সব সেবা
              </p>
            </div>

            {/* Card 4: নাগরিকবান্ধব */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center shadow-xs hover:shadow-md transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center border border-emerald-100">
                <Users size={26} className="text-[#006A4E]" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1.5">
                নাগরিকবান্ধব
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed">
                সবার জন্য সহজ ব্যবহার
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. PROCESS WORKFLOW (ল্যান্ডলক ইঞ্জিনের ৫-ধাপের যাচাই ও সমন্বয় প্রক্রিয়া) */}
        {/* ========================================================================= */}
        <section id="workflow" className="bg-white py-14 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="space-y-2 mb-10">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                ল্যান্ডলক ইঞ্জিনের সুরক্ষা ও যাচাই প্রক্রিয়া
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mx-auto">
                আদালত, সাব-রেজিস্ট্রি এবং বাণিজ্যিক ব্যাংকের সমন্বিত সুরক্ষা বলয়
              </p>
            </div>

            <div className="relative">
              {/* Connecting horizontal line for desktop */}
              <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-gray-200 z-0" aria-hidden="true" />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-xl bg-[#F8F9FA] border border-gray-100 shadow-2xs hover:shadow-sm transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#004137] border-2 border-[#006A4E] flex items-center justify-center font-bold text-base shadow-xs font-sans">
                    ১
                  </div>
                  <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <Search size={13} className="text-[#006A4E]" />
                    <span>জমি চিহ্নিতকরণ</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">অনুসন্ধান ও খতিয়ান</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    মৌজা, খতিয়ান ও দাগ নম্বর দিয়ে ডাটাবেজে সঠিক পার্সেল শনাক্ত
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-xl bg-[#F8F9FA] border border-gray-100 shadow-2xs hover:shadow-sm transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#004137] border-2 border-[#006A4E] flex items-center justify-center font-bold text-base shadow-xs font-sans">
                    ২
                  </div>
                  <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <Scale size={13} className="text-[#006A4E]" />
                    <span>বিচারিক ডাটাবেজ</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">আদালতের আদেশ পরীক্ষা</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    বিজ্ঞ আদালতের কোনো সক্রিয় স্থগিতাদেশ বা দেওয়ানি মামলা যাচাই
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-xl bg-[#F8F9FA] border border-gray-100 shadow-2xs hover:shadow-sm transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#004137] border-2 border-[#006A4E] flex items-center justify-center font-bold text-base shadow-xs font-sans">
                    ৩
                  </div>
                  <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <Building2 size={13} className="text-[#006A4E]" />
                    <span>ব্যাংক লিয়েন</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">বন্ধকী ঋণ স্ক্রিনিং</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    আর্থিক প্রতিষ্ঠানের সক্রিয় মর্টগেজ ও অপরিশোধিত দায় পরীক্ষা
                  </p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-xl bg-[#F8F9FA] border border-gray-100 shadow-2xs hover:shadow-sm transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#004137] border-2 border-[#006A4E] flex items-center justify-center font-bold text-base shadow-xs font-sans">
                    ৪
                  </div>
                  <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <ClipboardCheck size={13} className="text-[#006A4E]" />
                    <span>রেজিস্ট্রি গেটকিপার</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">স্বয়ংক্রিয় সিদ্ধান্ত</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    সাব-রেজিস্ট্রিতে তাৎক্ষণিক CLEAR অথবা BLOCKED লক প্রয়োগ
                  </p>
                </div>

                {/* Step 5 */}
                <div className="flex flex-col items-center text-center space-y-2.5 p-4 rounded-xl bg-[#F8F9FA] border border-gray-100 shadow-2xs hover:shadow-sm transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#004137] border-2 border-[#006A4E] flex items-center justify-center font-bold text-base shadow-xs font-sans">
                    ৫
                  </div>
                  <div className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                    <Award size={13} className="text-[#006A4E]" />
                    <span>ডিজিটাল অনাপত্তি</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">সনদ ও সুরক্ষিত দলিল</h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    কিউআর-কোড সংবলিত সনদপত্র গ্রহণ ও নিরাপদ জমি হস্তান্তর
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. INTEGRATED SERVICES GRID (সেবাসমূহ) */}
        {/* ========================================================================= */}
        <section id="services" className="max-w-6xl mx-auto px-4 py-14">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              ল্যান্ডলক ইঞ্জিনের সমন্বিত সেবাসমূহ
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
              জমি সংক্রান্ত যাবতীয় আইনি পরীক্ষা, আদালতের ডকেট ও সাব-রেজিস্ট্রির ডিজিটাল গেটওয়ে
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Service 1 */}
            <Link
              to="/citizen"
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-[#006A4E] hover:shadow-md transition-all text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center group-hover:bg-[#004137] group-hover:text-white transition-colors">
                <Search size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#006A4E] transition-colors">
                অনলাইন জমি ও পর্চা অনুসন্ধান
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                মৌজা, খতিয়ান ও দাগ নম্বর দিয়ে জমির মালিকানা, রেকর্ডকৃত আয়তন এবং সার্বিক স্ট্যাটাস যাচাই
              </p>
            </Link>

            {/* Service 2 */}
            <Link
              to="/cases"
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-[#006A4E] hover:shadow-md transition-all text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center group-hover:bg-[#004137] group-hover:text-white transition-colors">
                <Scale size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#006A4E] transition-colors">
                আদালতের স্থগিতাদেশ ট্র্যাকিং
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                বিজ্ঞ দেওয়ানি আদালতে বিচারাধীন নিষেধাজ্ঞা মোকদ্দমা ও স্বাক্ষরিত আদেশের কপি পর্যবেক্ষণ
              </p>
            </Link>

            {/* Service 3 */}
            <Link
              to="/registry"
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-[#006A4E] hover:shadow-md transition-all text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center group-hover:bg-[#004137] group-hover:text-white transition-colors">
                <ClipboardCheck size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#006A4E] transition-colors">
                সাব-রেজিস্ট্রি গেটকিপার
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                দলিল নিবন্ধনের পূর্বে স্বত্ব ঝুঁকি এবং সক্রিয় নিষেধাজ্ঞা ব্লক রেজোলিউশন যাচাই
              </p>
            </Link>

            {/* Service 4 */}
            <Link
              to="/bank"
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-[#006A4E] hover:shadow-md transition-all text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center group-hover:bg-[#004137] group-hover:text-white transition-colors">
                <Building2 size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#006A4E] transition-colors">
                ব্যাংক বন্ধক ও লিয়েন রেজিস্ট্রি
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                বাণিজ্যিক ব্যাংকের অনুকূলে জমির বন্ধক, ঋণ দায় এবং অবমুক্তি সনদের রিয়েল-টাইম ডাটা
              </p>
            </Link>

            {/* Service 5 */}
            <Link
              to="/map"
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-[#006A4E] hover:shadow-md transition-all text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center group-hover:bg-[#004137] group-hover:text-white transition-colors">
                <Map size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#006A4E] transition-colors">
                মৌজা নকশা ও জিআইএস রেজিস্ট্রি
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                ক্যাডাস্ট্রাল ডিজিটাল মানচিত্রে পার্সেলের অবস্থান ও চারপাশের সীমানা সংক্রান্ত ভূ-তথ্য
              </p>
            </Link>

            {/* Service 6 */}
            <Link
              to="/verify-certificate"
              className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-[#006A4E] hover:shadow-md transition-all text-center flex flex-col items-center space-y-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#006A4E] flex items-center justify-center group-hover:bg-[#004137] group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-[#006A4E] transition-colors">
                ডিজিটাল অনাপত্তি সনদ যাচাই
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                কিউআর কোড বা সনদ নম্বর স্ক্যান করে ইস্যুকৃত সার্টিফিকেটের ডিজিটাল সত্যতা প্রতিপাদন
              </p>
            </Link>
          </div>
        </section>



        {/* ========================================================================= */}
        {/* 8. SUPPORT & CALL CENTER BANNER (সহায়তা ও কল সেন্টার) */}
        {/* ========================================================================= */}
        <section id="support" className="max-w-6xl mx-auto px-4 py-12">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006A4E]">
                <HelpCircle size={15} />
                <span>সার্বক্ষণিক নাগরিক সেবা ও সহায়তা সেল</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#004137]">
                সহায়তা ও সেবা কল সেন্টার
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                যে কোনো জমি সম্পর্কিত অনুসন্ধান, দেওয়ানি স্থগিতাদেশ সংক্রান্ত বিভ্রান্তি বা আইনি যাচাইকরণে সার্বক্ষণিক কল সেন্টার সহায়তা গ্রহণ করুন।
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="tel:16122"
                className="inline-flex items-center gap-2 bg-[#006A4E] hover:bg-[#004137] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                <PhoneCall size={16} />
                <span>১৬১২২ কল করুন</span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. SEARCHABLE FAQ SECTION (প্রায়শই জিজ্ঞাসিত প্রশ্ন) */}
        {/* ========================================================================= */}
        <section id="faq" className="bg-white py-14 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
                ল্যান্ডলক ইঞ্জিনের আওতাধীন সেবা, আদালতের স্থগিতাদেশ ও রেজিস্ট্রি গেটকিপার সম্পর্কে সাধারণ প্রশ্নের উত্তর
              </p>
            </div>

            {/* Search Input for FAQ */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="আপনার প্রশ্ন এখানে খুঁজুন..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:bg-white text-gray-900 placeholder-gray-400 transition-colors shadow-2xs"
              />
            </div>

            {/* Accordion list */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xs text-gray-400 font-mono font-bold">
                          {toBengaliNumber(index + 1)}.
                        </span>
                        <span className="font-bold text-gray-900 text-xs sm:text-sm truncate sm:whitespace-normal">
                          {faq.q}
                        </span>
                        <span className="hidden sm:inline-block text-[10px] bg-emerald-50 text-[#006A4E] font-semibold border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                          {faq.tag}
                        </span>
                      </div>
                      <div className="text-gray-400 shrink-0">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs text-gray-600 border-t border-gray-100 bg-gray-50/40 leading-relaxed font-bangla animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                )
              })}

              {filteredFaqs.length === 0 && (
                <div className="p-8 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  কোনো প্রশ্ন বা উত্তর পাওয়া যায়নি। অনুসন্ধান ফিল্টার পরিবর্তন করুন।
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. PRE-FOOTER (4 Columns matching Screen 1) */}
        {/* ========================================================================= */}
        <section id="contact" className="bg-[#F8F9FA] border-t border-gray-200 py-12 text-xs text-gray-600 font-bangla">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Col 1: সহায়তা ও সাবস্ক্রিপশন */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 text-sm">সহায়তা</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  ল্যান্ডলক ইঞ্জিন সংক্রান্ত বুলেটিন ও আইনি নোটিস সরাসরি ইমেইলে পেতে সাবস্ক্রাইব করুন:
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="email"
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="আপনার ইমেইল ঠিকানা..."
                      className="w-full text-xs px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#006A4E] text-gray-800"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#004137] hover:bg-[#002f27] text-white rounded font-bold text-xs shrink-0 cursor-pointer"
                    >
                      <Send size={13} />
                    </button>
                  </div>
                  {newsletterSuccess && (
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      ✓ সফলভাবে সাবস্ক্রাইব করা হয়েছে!
                    </p>
                  )}
                </form>
                <div className="pt-1 text-[11px] space-y-1 text-gray-600">
                  <div>হেল্পলাইন: <strong>১৬১২২</strong></div>
                  <div>হটলাইন: <strong>০৮০/১৬১২২</strong></div>
                  <div>ইমেইল: <strong>support@landlock.gov.bd</strong></div>
                </div>
              </div>

              {/* Col 2: সেবা-সমূহ */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-gray-900 text-sm">সেবা-সমূহ</h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li>
                    <Link to="/citizen" className="hover:text-[#006A4E] transition-colors">
                      জমি অনুসন্ধান ও পর্চা যাচাই
                    </Link>
                  </li>
                  <li>
                    <Link to="/map" className="hover:text-[#006A4E] transition-colors">
                      মৌজা নকশা ও জিআইএস রেজিস্ট্রি
                    </Link>
                  </li>
                  <li>
                    <Link to="/cases" className="hover:text-[#006A4E] transition-colors">
                      আদালতের মামলা ও স্থগিতাদেশ
                    </Link>
                  </li>
                  <li>
                    <Link to="/registry" className="hover:text-[#006A4E] transition-colors">
                      সাব-রেজিস্ট্রি গেটকিপার চেক
                    </Link>
                  </li>
                  <li>
                    <Link to="/bank" className="hover:text-[#006A4E] transition-colors">
                      ব্যাংক বন্ধক ও লিয়েন রেজিস্ট্রি
                    </Link>
                  </li>
                  <li>
                    <Link to="/verify-certificate" className="hover:text-[#006A4E] transition-colors">
                      ডিজিটাল অনাপত্তি সনদপত্র যাচাই
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: গুরুত্বপূর্ণ লিংক */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-gray-900 text-sm">গুরুত্বপূর্ণ লিংক</h4>
                <ul className="space-y-1.5 text-[11px]">
                  <li>
                    <a href="https://minland.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#006A4E] transition-colors inline-flex items-center gap-1">
                      <span>ভূমি মন্ত্রণালয়</span>
                      <ExternalLink size={10} />
                    </a>
                  </li>
                  <li>
                    <a href="https://supremecourt.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#006A4E] transition-colors inline-flex items-center gap-1">
                      <span>বাংলাদেশ সুপ্রিম কোর্ট</span>
                      <ExternalLink size={10} />
                    </a>
                  </li>
                  <li>
                    <a href="https://lawjusticediv.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#006A4E] transition-colors inline-flex items-center gap-1">
                      <span>আইন ও বিচার বিভাগ</span>
                      <ExternalLink size={10} />
                    </a>
                  </li>
                  <li>
                    <a href="https://bangladesh.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#006A4E] transition-colors inline-flex items-center gap-1">
                      <span>জাতীয় ই-তথ্যকোষ</span>
                      <ExternalLink size={10} />
                    </a>
                  </li>
                  <li>
                    <a href="https://dola.gov.bd" target="_blank" rel="noreferrer" className="hover:text-[#006A4E] transition-colors inline-flex items-center gap-1">
                      <span>ভূমি রেকর্ড ও জরিপ অধিদপ্তর</span>
                      <ExternalLink size={10} />
                    </a>
                  </li>
                </ul>
              </div>

              {/* Col 4: আইন ও বিধিমালা */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-gray-900 text-sm">আইন ও বিধিমালা</h4>
                <ul className="space-y-1.5 text-[11px] text-gray-600">
                  <li>সুনির্দিষ্ট প্রতিকার আইন, ১৮৭৭</li>
                  <li>দেওয়ানি কার্যবিধি আইন, ১৯০৮</li>
                  <li>রেজিস্ট্রেশন আইন, ১৯০৮</li>
                  <li>ভূমি উন্নয়ন কর ও জরিপ অধ্যাদেশ</li>
                  <li>ডিজিটাল তথ্য সুরক্ষা ও এভিডেন্স অ্যাক্ট</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 11. BOTTOM COPYRIGHT FOOTER (Clean Green Footer matching Screen 1) */}
      {/* ========================================================================= */}
      <GovernmentFooter variant="minimal" />


    </div>
  )
}
