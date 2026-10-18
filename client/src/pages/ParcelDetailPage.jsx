import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import StatusBadge from '../components/StatusBadge'
import { parcelApi, restrictionApi, mortgageApi } from '../api/client'
import {
  MapPin,
  ArrowLeft,
  Shield,
  FileText,
  Building,
  CheckCircle,
  AlertTriangle,
  ClipboardCheck,
  Calendar,
  Lock,
  Layers,
  Clock,
  UserCheck
} from 'lucide-react'

export default function ParcelDetailPage() {
  const { id } = useParams()
  const [parcel, setParcel] = useState(null)
  const [restrictions, setRestrictions] = useState([])
  const [mortgages, setMortgages] = useState([])
  const [publicStatus, setPublicStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const [parcelRes, restRes, mortRes, pubRes] = await Promise.allSettled([
          parcelApi.getById(id),
          restrictionApi.getByParcel(id),
          mortgageApi.verify(id),
          parcelApi.publicStatus(id),
        ])

        if (parcelRes.status === 'fulfilled') {
          setParcel(parcelRes.value.data?.data)
        } else {
          throw new Error(parcelRes.reason?.response?.data?.message || 'পার্সেল তথ্য খুঁজে পাওয়া যায়নি।')
        }

        if (restRes.status === 'fulfilled') {
          setRestrictions(restRes.value.data?.data || [])
        }

        if (mortRes.status === 'fulfilled') {
          setMortgages(mortRes.value.data?.data || [])
        }

        if (pubRes.status === 'fulfilled') {
          setPublicStatus(pubRes.value.data?.data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'ডেটা লোড করতে ত্রুটি হয়েছে।')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner text="পার্সেলের পূর্ণাঙ্গ আইনি রেকর্ড বিশ্লেষণ করা হচ্ছে..." />
      </Layout>
    )
  }

  if (error || !parcel) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-red-50 border border-red-300 text-red-800 rounded p-6 text-center">
            <AlertTriangle className="mx-auto text-red-600 mb-2" size={32} />
            <h2 className="text-lg font-bold">তথ্য পাওয়া যায়নি</h2>
            <p className="text-sm mt-1">{error || 'উক্ত আইডি বিশিষ্ট কোনো পার্সেল সার্ভারে পাওয়া যায়নি।'}</p>
            <Link to="/parcels" className="btn-primary inline-flex items-center gap-1 mt-4 text-sm">
              <ArrowLeft size={16} /> পার্সেল তালিকায় ফিরে যান
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/parcels" className="hover:text-govt-green flex items-center gap-1">
              <ArrowLeft size={16} />
              <span>পার্সেল তালিকা</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold font-mono text-xs">{parcel.id}</span>
          </div>

          <Link
            to={`/registry?parcelId=${parcel.id}`}
            className="btn-primary text-sm flex items-center gap-2 self-start"
          >
            <ClipboardCheck size={16} />
            <span>এই পার্সেলের ওপর রেজিস্ট্রি যাচাই চালান</span>
          </Link>
        </div>

        {/* Parcel Overview Header */}
        <div className="card shadow-sm border-t-4 border-t-govt-green">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 pb-4 border-b border-govt-border">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  মৌজা: {parcel.mouzaCode} (দাগ নম্বর: {parcel.dagNumber})
                </h1>
                <StatusBadge decision={parcel.verificationStatus} />
              </div>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                ইউনিক পার্সেল আইডি: {parcel.id}
              </p>
            </div>

            {/* Quick Risk Indicator */}
            {publicStatus && (
              <div className="flex items-center gap-2 self-start">
                {publicStatus.hasActiveRestriction ? (
                  <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-300">
                    ⚠ সক্রিয় আদালতি নিষেধাজ্ঞা
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-300">
                    ✓ কোনো আদালতি নিষেধাজ্ঞা নেই
                  </span>
                )}
                {publicStatus.hasActiveMortgage && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-300">
                    ⚠ সক্রিয় ব্যাংক বন্ধক
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Key Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-5 text-sm">
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">প্রশাসনিক বিভাগ ও জেলা</span>
              <span className="font-semibold text-gray-800">{parcel.divisionCode} / {parcel.districtCode}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">উপজেলা / থানা</span>
              <span className="font-semibold text-gray-800">{parcel.upazilaCode}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">জেএল নম্বর (JL No.)</span>
              <span className="font-semibold text-gray-800 font-sans">{parcel.jlNumber}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">খতিয়ান নম্বর ও ধরন</span>
              <span className="font-semibold text-gray-800 font-sans">{parcel.khatianNumber} ({parcel.khatianType})</span>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">রেকর্ডকৃত ভূমির পরিমাণ</span>
              <span className="font-semibold text-gray-800 font-sans">{parcel.recordedArea} {parcel.areaUnit}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">সাব-পার্সেল রেফারেন্স</span>
              <span className="font-semibold text-gray-800 font-sans">{parcel.subParcelReference || 'N/A'}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">রেকর্ড সংস্করণ (Version)</span>
              <span className="font-semibold text-gray-800 font-sans">v{parcel.version}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-govt-border">
              <span className="text-xs text-gray-500 block">সর্বশেষ যাচাইয়ের তারিখ</span>
              <span className="font-semibold text-gray-800 text-xs font-sans">
                {parcel.lastVerifiedAt ? new Date(parcel.lastVerifiedAt).toLocaleString('bn-BD') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Documentation & Gatekeeper Action */}
        <div className="bg-emerald-50/60 border border-emerald-300 rounded-lg p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 pb-2.5">
            <div>
              <div className="text-xs font-bold text-govt-green flex items-center gap-1.5 uppercase tracking-wider">
                <Shield size={15} />
                <span>পার্সেল আইনি বিশ্লেষণ ও ডেমো নির্দেশিকা (Parcel Legal Analysis)</span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                এই পার্সেলটির আইনি স্থিতি ও গেটকিপার সিমুলেশন ফলাফল
              </p>
            </div>
            <Link
              to={`/registry?parcelId=${parcel.id}`}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <ClipboardCheck size={16} />
              <span>এই পার্সেলে গেটকিপার যাচাই করুন</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-700">
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-bold text-gray-800 block mb-1">⚖️ আদালতের নিষেধাজ্ঞা নিয়ম:</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                মামলা দায়ের হলেই কোনো জমি স্বয়ংক্রিয়ভাবে হস্তান্তর নিষিদ্ধ হয় না। বিজ্ঞ আদালত কর্তৃক সুনির্দিষ্ট আদেশে বিক্রয় বা হস্তান্তর স্থগিতাদেশ অনুমোদিত হলে তবেই গেটকিপার এপিআই লেনদেন প্রতিহত করবে।
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="font-bold text-gray-800 block mb-1">🏦 ব্যাংক বন্ধকী লিয়েন নিয়ম:</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                জমিতে সক্রিয় বন্ধক থাকলে তা হস্তান্তরের জন্য ব্যাংক হতে অনুমোদিত দায়মুক্তি সনদ (NOC/Release Deed) প্রয়োজন। অন্যথায় সিস্টেম MORTGAGE_REQUIRES_RELEASE ফেরত দেবে।
              </p>
            </div>
          </div>
        </div>

        {/* Restrictions Section */}
        <div className="card shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-govt-border mb-4">
            <h2 className="text-lg font-bold text-govt-green flex items-center gap-2">
              <Shield size={20} />
              <span>আইনি বিধিনিষেধ ও নিষেধাজ্ঞা ({restrictions.length} টি)</span>
            </h2>
            <span className="text-xs text-gray-500">বিজ্ঞ আদালতের প্রদত্ত সক্রিয় আদেশ</span>
          </div>

          {restrictions.length === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded p-4 text-green-800 text-sm flex items-center gap-2">
              <CheckCircle size={18} />
              <span>এই পার্সেলের ওপর কোনো সক্রিয় বা নথিভুক্ত আইনি নিষেধাজ্ঞা নেই।</span>
            </div>
          ) : (
            <div className="space-y-3">
              {restrictions.map((r) => (
                <div key={r.id} className="p-4 rounded-lg border border-red-200 bg-red-50/60">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="font-bold text-red-900 text-sm flex items-center gap-2">
                      <Lock size={16} />
                      <span>{r.restrictionType}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-red-200 text-red-800 font-mono">
                        {r.status}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-gray-600">
                      রেফারেন্স: {r.sourceReference}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700 mt-2">
                    <div>
                      <span className="text-gray-500 block">স্থগিত লেনদেনের ধরন:</span>
                      <span className="font-bold text-red-700">{r.applicableTransactionTypes}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">নিষেধাজ্ঞার পরিধি:</span>
                      <span className="font-medium">{r.scopeType} ({r.scopeArea} শতাংশ)</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">কার্যকর শুরু:</span>
                      <span className="font-mono">{r.effectiveFrom || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">মেয়াদ উত্তীর্ণ:</span>
                      <span className="font-mono">{r.effectiveUntil || 'অনির্দিষ্টকাল'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mortgages Section */}
        <div className="card shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-govt-border mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Building size={20} />
              <span>ব্যাংক বন্ধক ও আর্থিক দায় লিয়েন ({mortgages.length} টি)</span>
            </h2>
            <span className="text-xs text-gray-500">তফসিলি ব্যাংক ও ঋণদানকারী প্রতিষ্ঠানের রেকর্ড</span>
          </div>

          {mortgages.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 text-gray-600 text-sm flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>এই পার্সেলের ওপর কোনো সক্রিয় বন্ধক বা ব্যাংক লিয়েন নেই।</span>
            </div>
          ) : (
            <div className="space-y-3">
              {mortgages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-lg border ${
                    m.status === 'ACTIVE'
                      ? 'border-amber-200 bg-amber-50/60'
                      : 'border-gray-200 bg-gray-50/70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <span>লিয়েন রেফারেন্স: {m.lenderReference}</span>
                      <StatusBadge decision={m.status} />
                    </div>
                    <div className="text-xs text-gray-500">
                      প্রতিষ্ঠানের আইডি: {m.lenderInstitutionId}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-700 mt-2">
                    <div>
                      <span className="text-gray-500 block">আবদ্ধ আয়তন:</span>
                      <span className="font-medium font-sans">{m.securedArea} শতাংশ (শেয়ার: {m.securedShare})</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">কার্যকর শুরু:</span>
                      <span className="font-mono">{m.effectiveFrom || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">অবমুক্তির রেফারেন্স:</span>
                      <span className="font-medium">{m.releaseReference || 'অব্যাহত (মুক্ত হয়নি)'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">রেকর্ডের তারিখ:</span>
                      <span className="font-sans text-[11px]">{new Date(m.createdAt).toLocaleDateString('bn-BD')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Disclaimer Notice */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-xs text-yellow-900 leading-relaxed">
          <strong>আইনি সতর্কবার্তা:</strong> উপরিউক্ত তথ্যসমূহ ল্যান্ডলক ইঞ্জিনের পরীক্ষামূলক ডেটাবেজে সংরক্ষিত রেকর্ড অনুসারে প্রদর্শিত হয়েছে। কোনো অননুমোদিত তথ্য সংযোজন বা পরিবর্তন ফৌজদারি অপরাধ।
        </div>
      </div>
    </Layout>
  )
}
