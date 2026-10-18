import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout'
import MouzaMapViewer from '../components/MouzaMapViewer'
import {
  Map,
  Layers,
  ShieldAlert,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Search,
  ArrowRight,
  ExternalLink,
  Compass,
  FileText,
  RotateCcw
} from 'lucide-react'
import { PLOT_POLYGONS, MOUZA_LOCATIONS } from '../data/mouzaGeoData'

export default function MouzaMapPage() {
  const [selectedMouza, setSelectedMouza] = useState('DHANMONDI')
  const [activePlotId, setActivePlotId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter plots by mouza and search term
  const filteredPlots = PLOT_POLYGONS.filter((p) => {
    const matchesMouza = p.mouzaCode === selectedMouza || selectedMouza === 'ALL'
    const matchesSearch = searchTerm
      ? p.dagNumber.includes(searchTerm) || p.khatianNumber.includes(searchTerm)
      : true
    return matchesMouza && matchesSearch
  })

  const activePlot = PLOT_POLYGONS.find((p) => p.id === activePlotId)

  return (
    <DashboardLayout>
      <div className="space-y-6 font-bangla select-text pb-12">
        {/* Breadcrumbs matching Design System: হোম › মৌজা নকশা ও জিআইএস রেজিস্ট্রি */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-govt-green transition-colors">
            হোম
          </Link>
          <span>›</span>
          <span className="text-gray-900 font-semibold">
            মৌজা নকশা ও জিআইএস রেজিস্ট্রি
          </span>
        </div>

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#004D38] flex items-center gap-2.5">
              <Map size={24} className="text-[#006A4E]" />
              <span>ডিজিটাল মৌজা নকশা ও জিআইএস রেজিস্ট্রি</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              বিজ্ঞ আদালতের নিষেধাজ্ঞা, ব্যাংক লিয়েন এবং সাব-রেজিস্ট্রারের লেনদেনের অবস্থা ডিজিটাল মৌজা নকশায় সরাসরি প্লট অনুযায়ী প্রদর্শন।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/citizen"
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Search size={14} />
              <span>নাগরিক অনুসন্ধান</span>
            </Link>
            <Link
              to="/registry"
              className="px-4 py-2 bg-[#006A4E] hover:bg-[#004D38] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={14} />
              <span>গেটের স্থিতি যাচাই</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Cards matching system aesthetics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 shrink-0">
              <Layers size={22} />
            </div>
            <div>
              <div className="text-xl font-bold font-sans text-gray-900">৭ টি</div>
              <div className="text-xs text-gray-500 font-medium">মোট পরীক্ষিত দাগ/প্লট</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-red-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-red-100 flex items-center justify-center text-red-600 shrink-0 border border-red-200">
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="text-xl font-bold font-sans text-red-700">১ টি</div>
              <div className="text-xs text-red-600 font-medium">আদালতের আদেশে অবরুদ্ধ</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 border border-amber-200">
              <AlertTriangle size={22} />
            </div>
            <div>
              <div className="text-xl font-bold font-sans text-amber-800">১ টি</div>
              <div className="text-xs text-amber-700 font-medium">খসড়া আদেশ বিবেচনাধীন</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-lg bg-emerald-100 flex items-center justify-center text-[#006A4E] shrink-0 border border-emerald-200">
              <CheckCircle size={22} />
            </div>
            <div>
              <div className="text-xl font-bold font-sans text-[#006A4E]">৫ টি</div>
              <div className="text-xs text-emerald-700 font-medium">নিষ্কণ্টক ও প্রস্তুত</div>
            </div>
          </div>
        </div>

        {/* Interactive Map & Side Directory Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Map Viewer */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-1.5">
              <MouzaMapViewer
                highlightPlotId={activePlotId}
                initialMouza={selectedMouza}
                height="580px"
                onPlotSelect={(plot) => setActivePlotId(plot.id)}
              />
            </div>

            {/* Cadastral Sheet Metadata Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs text-xs text-gray-600 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-[#006A4E] shrink-0" />
                <span>
                  <strong>বাংলাদেশ ভূমি জরিপ মান:</strong> ক্যাডাস্ট্রাল সার্ভে (CS) / রিভিশনাল সার্ভে (RS) মানচিত্র শিট
                </span>
              </div>
              <div className="flex items-center gap-4 text-gray-500 font-sans">
                <span>স্কেল: <strong>১৬ ইঞ্চি = ১ মাইল</strong></span>
                <span>কোঅর্ডিনেট সিস্টেম: <strong>WGS 84 (GPS)</strong></span>
              </div>
            </div>
          </div>

          {/* Side Panel: Plot Directory & Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <MapPin size={16} className="text-[#006A4E]" />
                  <span>মৌজা ও দাগ তালিকা</span>
                </h3>
                <span className="text-xs font-sans text-gray-500 font-semibold">
                  {filteredPlots.length} টি দাগ
                </span>
              </div>

              {/* Mouza Filter Buttons */}
              <div className="flex gap-1.5 flex-wrap">
                {Object.keys(MOUZA_LOCATIONS).map((key) => {
                  const m = MOUZA_LOCATIONS[key]
                  const isCurrent = selectedMouza === m.id
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setSelectedMouza(m.id)
                        setActivePlotId(null)
                      }}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-[#006A4E] text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {m.upazilaBn}
                    </button>
                  )
                })}
              </div>

              {/* Search by Dag or Khatian */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="দাগ বা খতিয়ান দিয়ে ফিল্টার করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006A4E]"
                />
              </div>

              {/* Plots Scrollable List */}
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                {filteredPlots.map((plot) => {
                  const isSelected = activePlotId === plot.id
                  return (
                    <div
                      key={plot.id}
                      onClick={() => setActivePlotId(plot.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-[#006A4E] bg-green-50/60 shadow-sm ring-1 ring-[#006A4E]'
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                            <span>দাগ {plot.dagNumber}</span>
                            <span className="text-[11px] font-normal text-gray-500">
                              (খতিয়ান {plot.khatianNumber})
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            {plot.mouzaNameBn} মৌজা | আয়তন: {plot.areaDecimal} শতাংশ
                          </div>
                        </div>

                        {/* Status badge pill */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            plot.status === 'BLOCKED_BY_VALID_ORDER'
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : plot.status === 'REVIEW_REQUIRED'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {plot.statusLabelBn}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                        {plot.statusDescBn}
                      </p>

                      {/* Detail navigation links */}
                      <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                        <Link
                          to={`/citizen?dag=${plot.dagNumber}&khatian=${plot.khatianNumber}&mouza=${plot.mouzaCode}`}
                          className="text-[#006A4E] font-bold hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>নাগরিক যাচাই</span>
                          <ArrowRight size={11} />
                        </Link>
                        <Link
                          to={`/registry?parcelId=${plot.id}`}
                          className="text-gray-500 hover:text-[#006A4E] font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          গেটে যাচাই
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Selected Plot Detail Card */}
            {activePlot && (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-[#004D38] border-b border-emerald-200 pb-1.5">
                  <span>নির্বাচিত প্লট: দাগ {activePlot.dagNumber}</span>
                  <span className="font-sans text-[11px] text-emerald-800">
                    {activePlot.areaDecimal} শতক
                  </span>
                </div>
                <p className="text-gray-700 text-[11px] leading-relaxed">
                  {activePlot.statusDescBn}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-gray-500">মৌজা: {activePlot.mouzaNameBn}</span>
                  <Link
                    to={`/citizen?dag=${activePlot.dagNumber}&khatian=${activePlot.khatianNumber}`}
                    className="font-bold text-[#006A4E] hover:underline"
                  >
                    পূর্ণাঙ্গ প্রতিবেদন দেখুন →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cadastral Benefits Documentation Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm border-l-4 border-l-[#006A4E] space-y-3">
          <h3 className="font-bold text-base text-[#004D38] flex items-center gap-2">
            <FileText size={18} className="text-[#006A4E]" />
            <span>ল্যান্ডলক ইঞ্জিন জিআইএস ও মৌজা নকশার ভূমিকা</span>
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            বাংলাদেশে বেশিরভাগ ভূমি বিরোধ ও জালিয়াতি সংঘটিত হয় কারণ পুরনো দলিলের দাগ নম্বরের সাথে ভূমির ভৌগোলিক বাস্তবতার সরাসরি ডিজিটাল সংযোগ থাকে না। ল্যান্ডলক ইঞ্জিন মৌজা নকশাকে জিপিএস স্থানাঙ্কের সাথে যুক্ত করে আদালত ও সাব-রেজিস্ট্রারের মধ্যে রিয়েল-টাইম জিওস্পেশিয়াল সমন্বয় নিশ্চিত করে।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700 pt-2">
            <div className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200">
              <strong className="block text-gray-900 mb-1">১. জালিয়াতি ও দ্বৈত নিবন্ধন রোধ</strong>
              একই দাগ একাধিক ব্যক্তির কাছে ভুয়া দলিল করে বিক্রি করার চেষ্টা করলে জিআইএস ম্যাপে ওই প্লটের সক্রিয় স্থিতি ও লিয়েন সাথে সাথে লাল সংকেত দেবে।
            </div>
            <div className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200">
              <strong className="block text-gray-900 mb-1">২. সীমানা বিরোধ পূর্ব-শনাক্তকরণ</strong>
              সংলগ্ন কোনো দাগে আদালতের নিষেধাজ্ঞা বা তদন্ত চলমান থাকলে ক্রেতা জমি কেনার আগেই ভৌগোলিক ঝুঁকির বিষয়ে সচেতন হতে পারেন।
            </div>
            <div className="p-3.5 bg-gray-50/80 rounded-lg border border-gray-200">
              <strong className="block text-gray-900 mb-1">৩. স্মার্ট ভূমি সেবা ও ডিজিটাল বাংলাদেশ</strong>
              কাগজে-কলমে মৌজা নকশা খোঁজার বদলে ডিজিটাল স্ক্রিনে এক ক্লিকে যেকোনো দাগের খতিয়ান, আয়তন ও আদালতের রায় নিরীক্ষণ।
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
