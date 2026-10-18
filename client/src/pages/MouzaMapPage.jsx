import { useState } from 'react'
import Layout from '../components/Layout'
import MouzaMapViewer from '../components/MouzaMapViewer'
import { Map, Layers, ShieldAlert, CheckCircle, AlertTriangle, MapPin, Search, ArrowRight, ExternalLink, Compass } from 'lucide-react'
import { PLOT_POLYGONS, MOUZA_LOCATIONS } from '../data/mouzaGeoData'
import { Link } from 'react-router-dom'

export default function MouzaMapPage() {
  const [selectedMouza, setSelectedMouza] = useState('DHANMONDI')
  const [activePlotId, setActivePlotId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter plots by mouza
  const filteredPlots = PLOT_POLYGONS.filter((p) => {
    const matchesMouza = p.mouzaCode === selectedMouza || (selectedMouza === 'ALL')
    const matchesSearch = searchTerm ? p.dagNumber.includes(searchTerm) || p.khatianNumber.includes(searchTerm) : true
    return matchesMouza && matchesSearch
  })

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6 font-bangla">
        {/* Page Header */}
        <div className="bg-white rounded-lg border border-govt-border p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-govt-green animate-pulse" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                জিওস্পেশিয়াল ল্যান্ড ক্যাডাস্ট্রে (GIS Land Cadastre)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-govt-green flex items-center gap-3">
              <Map size={28} className="text-govt-gold" />
              <span>ডিজিটাল মৌজা নকশা ও জিআইএস রেজিস্ট্রি</span>
            </h1>
            <p className="text-gray-600 mt-1 text-sm max-w-2xl">
              বিজ্ঞ আদালতের নিষেধাজ্ঞা, ব্যাংক লিয়েন এবং সাব-রেজিস্ট্রারের লেনদেনের অবস্থা ডিজিটাল মৌজা নকশায় সরাসরি প্লট অনুযায়ী প্রদর্শন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/citizen"
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <Search size={16} />
              <span>নাগরিক অনুসন্ধান</span>
            </Link>
            <Link
              to="/registry"
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <ExternalLink size={16} />
              <span>গেটের স্থিতি যাচাই</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-govt-border shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
              <Layers size={20} />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-gray-900">৭ টি</div>
              <div className="text-xs text-gray-500">মোট পরীক্ষিত দাগ/প্লট</div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
              <ShieldAlert size={20} />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-red-800">১ টি</div>
              <div className="text-xs text-red-600">আদালতের আদেশে অবরুদ্ধ</div>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-amber-700">১ টি</div>
              <div className="text-xs text-amber-600">খসড়া আদেশ বিবেচনাধীন</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-govt-green">
              <CheckCircle size={20} />
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-green-800">৫ টি</div>
              <div className="text-xs text-green-600">নিষ্কণ্টক ও প্রস্তুত</div>
            </div>
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Leaflet Map Viewer */}
          <div className="lg:col-span-8 space-y-4">
            <MouzaMapViewer
              highlightPlotId={activePlotId}
              initialMouza={selectedMouza}
              height="600px"
              onPlotSelect={(plot) => setActivePlotId(plot.id)}
            />

            {/* Cadastral Sheet Information Card */}
            <div className="bg-white rounded-lg border border-govt-border p-4 shadow-sm text-xs text-gray-600 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-govt-green" />
                <span>
                  <strong>বাংলাদেশ ভূমি জরিপ মান:</strong> ক্যাডাস্ট্রাল সার্ভে (CS) / রিভিশনাল সার্ভে (RS) মানচিত্র শিট
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span>স্কেল: <strong>১৬ ইঞ্চি = ১ মাইল (১:৩৯৬০)</strong></span>
                <span>অক্ষাংশ/দ্রাঘিমাংশ: <strong>WGS 84 (GPS স্ট্যান্ডার্ড)</strong></span>
              </div>
            </div>
          </div>

          {/* Side Panel: Plot Directory & Quick Selector */}
          <div className="lg:col-span-4 space-y-4">
            <div className="card shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-govt-border pb-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
                  <MapPin size={16} className="text-govt-green" />
                  <span>মৌজা ও দাগ তালিকা</span>
                </h3>
                <span className="text-xs font-mono text-gray-500">{filteredPlots.length} টি দাগ</span>
              </div>

              {/* Mouza Filter Pills */}
              <div className="flex gap-1.5 mb-3 flex-wrap">
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
                      className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                        isCurrent
                          ? 'bg-govt-green text-white font-bold'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {m.upazilaBn}
                    </button>
                  )
                })}
              </div>

              {/* Search by Dag Number */}
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="দাগ বা খতিয়ান দিয়ে ফিল্টার করুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-8 text-xs font-sans py-1.5"
                />
              </div>

              {/* Plots List */}
              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {filteredPlots.map((plot) => {
                  const isSelected = activePlotId === plot.id
                  return (
                    <div
                      key={plot.id}
                      onClick={() => setActivePlotId(plot.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-govt-green bg-green-50/70 shadow-sm ring-1 ring-govt-green'
                          : 'border-govt-border bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                            <span>দাগ {plot.dagNumber}</span>
                            <span className="text-xs font-normal text-gray-500">
                              (খতিয়ান {plot.khatianNumber})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {plot.mouzaNameBn} মৌজা | আয়তন: {plot.areaDecimal} শতাংশ
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0"
                          style={{
                            backgroundColor: plot.status === 'BLOCKED_BY_VALID_ORDER' ? '#FEE2E2' : plot.status === 'REVIEW_REQUIRED' ? '#FEF3C7' : '#DCFCE7',
                            borderColor: plot.borderColor,
                            color: plot.status === 'BLOCKED_BY_VALID_ORDER' ? '#991B1B' : plot.status === 'REVIEW_REQUIRED' ? '#92400E' : '#166534',
                          }}
                        >
                          {plot.statusLabelBn}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                        {plot.statusDescBn}
                      </p>

                      {plot.id && !plot.id.startsWith('ref-') && (
                        <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                          <Link
                            to={`/parcels/${plot.id}`}
                            className="text-govt-green font-semibold hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>নথি দেখুন</span>
                            <ArrowRight size={12} />
                          </Link>
                          <Link
                            to={`/registry?parcelId=${plot.id}`}
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            গেটে যাচাই
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Cadastral Benefits Documentation Card */}
        <div className="card shadow-sm border-l-4 border-l-govt-green">
          <h3 className="font-bold text-base text-govt-green mb-2 flex items-center gap-2">
            <span>📖 ল্যান্ডলক ইঞ্জিন জিআইএস ও মৌজা নকশার ভূমিকা</span>
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed mb-4">
            বাংলাদেশে বেশিরভাগ ভূমি বিরোধ ও জালিয়াতি সংঘটিত হয় কারণ পুরনো দলিলের দাগ নম্বরের সাথে ভূমির ভৌগোলিক বাস্তবতার সরাসরি ডিজিটাল সংযোগ থাকে না। ল্যান্ডলক ইঞ্জিন মৌজা নকশাকে জিপিএস স্থানাঙ্কের সাথে যুক্ত করে আদালত ও সাব-রেজিস্ট্রারের মধ্যে রিয়েল-টাইম জিওস্পেশিয়াল সমন্বয় নিশ্চিত করে।
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-700">
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <strong className="block text-gray-900 mb-1">১. জালিয়াতি ও দ্বৈত নিবন্ধন রোধ</strong>
              একই দাগ একাধিক ব্যক্তির কাছে ভুয়া দলিল করে বিক্রি করার চেষ্টা করলে জিআইএস ম্যাপে ওই প্লটের সক্রিয় স্থিতি ও লিয়েন সাথে সাথে লাল সংকেত দেবে।
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <strong className="block text-gray-900 mb-1">২. সীমানা বিরোধ পূর্ব-শনাক্তকরণ</strong>
              সংলগ্ন কোনো দাগে আদালতের নিষেধাজ্ঞা বা তদন্ত চলমান থাকলে ক্রেতা জমি কেনার আগেই ভৌগোলিক ঝুঁকির বিষয়ে সচেতন হতে পারেন।
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <strong className="block text-gray-900 mb-1">৩. স্মার্ট ভূমি সেবা ও ডিজিটাল বাংলাদেশ</strong>
              কাগজে-কলমে মৌজা নকশা খোঁজার বদলে ডিজিটাল স্ক্রিনে এক ক্লিকে যেকোনো দাগের খতিয়ান, আয়তন ও আদালতের রায় নিরীক্ষণ।
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
