import { useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Printer,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Share2,
} from 'lucide-react'
import { parcelApi, registryApi } from '../api/client'
import CertificateDocument from '../components/certificate/CertificateDocument'
import Button from '../components/design-system/Button'
import PublicLayout from '../components/layout/PublicLayout'

export default function CertificatePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [copied, setCopied] = useState(false)

  // Location state might pass pre-fetched check response or parcel
  const stateCheckResponse = location.state?.checkResponse || null
  const stateParcel = location.state?.parcel || null

  // Fetch parcel details
  const {
    data: parcelData,
    isLoading: parcelLoading,
    isError: parcelError,
  } = useQuery({
    queryKey: ['certificate-parcel', id],
    queryFn: async () => {
      // If state passed parcel, use it
      if (stateParcel) return stateParcel

      // Try fetching as parcel ID
      try {
        const res = await parcelApi.getById(id)
        return res.data?.data
      } catch (err) {
        // If not found as parcel ID or 401, check public status
        try {
          const pubRes = await parcelApi.publicStatus(id)
          return { id, isPublicOnly: true, publicStatus: pubRes.data?.data }
        } catch {
          // Might be check ID
          return null
        }
      }
    },
    staleTime: 60000,
  })

  // Fetch check response if ID is a check ID or we have a checkResponse
  const {
    data: checkData,
    isLoading: checkLoading,
  } = useQuery({
    queryKey: ['certificate-check', id],
    queryFn: async () => {
      if (stateCheckResponse) return stateCheckResponse
      try {
        const res = await registryApi.getCheck(id)
        return res.data?.data
      } catch {
        return null
      }
    },
    staleTime: 60000,
  })

  // Public status fetch for live check
  const targetParcelId = parcelData?.id || checkData?.parcelId || id
  const { data: publicStatusData } = useQuery({
    queryKey: ['certificate-public-status', targetParcelId],
    queryFn: async () => {
      if (!targetParcelId) return null
      try {
        const res = await parcelApi.publicStatus(targetParcelId)
        return res.data?.data
      } catch {
        return null
      }
    },
    enabled: Boolean(targetParcelId),
    staleTime: 30000,
  })

  const parcel = parcelData || stateParcel || null
  const checkResponse = checkData || stateCheckResponse || null
  const publicStatus = publicStatusData || null

  const verificationUrl = `${window.location.origin}/verify/certificate/${targetParcelId}`

  const handlePrint = () => {
    window.print()
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (parcelLoading || checkLoading) {
    return (
      <PublicLayout showNavbar={false}>
        <div className="min-h-[60vh] bg-govt-paper flex items-center justify-center p-6 font-bangla">
          <div className="bg-white p-8 rounded-xl border border-govt-border shadow-sm text-center space-y-4 max-w-sm w-full">
            <div className="w-10 h-10 border-[3px] border-govt-green border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="font-bold text-gray-800 text-base">প্রত্যয়নপত্র প্রস্তুত হচ্ছে...</h2>
            <p className="text-xs text-gray-500">
              আন্তঃবিভাগীয় সার্ভার থেকে প্রামাণ্য নথির বিবরণ ও ডিজিটাল স্বাক্ষর যাচাই করা হচ্ছে।
            </p>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout showNavbar={false}>
      <div className="bg-govt-paper text-gray-900 font-bangla py-6 px-3 sm:px-6 min-h-[calc(100vh-140px)]">
        {/* Floating Action Toolbar (Hidden on print) */}
        <div className="floating-toolbar no-print max-w-[210mm] mx-auto mb-6 bg-white p-3 sm:p-4 rounded-xl border border-govt-border shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-4 z-40">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              leftIcon={ArrowLeft}
              className="text-gray-700"
            >
              পিছনে ফিরুন
            </Button>

            <span className="hidden sm:inline-block h-4 w-px bg-gray-300 mx-1" />

            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-gray-800">অফিসিয়াল প্রিন্টভিউ</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? Check : Share2}
              className="text-gray-700"
              title="অনলাইন যাচাইকরণ লিংক কপি করুন"
            >
              {copied ? 'লিংক কপি হয়েছে!' : 'যাচাইকরণ লিংক'}
            </Button>

            <Button
              as={Link}
              to={`/verify/certificate/${targetParcelId}`}
              variant="outline"
              size="sm"
              leftIcon={ExternalLink}
              className="text-gray-700 hidden sm:inline-flex"
              title="পাবলিক যাচাই পেজ দেখুন"
            >
              পাবলিক যাচাই
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={Printer}
              className="bg-govt-green hover:bg-govt-green-dark shadow-sm"
            >
              প্রিন্ট / পিডিএফ ডাউনলোড
            </Button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <CertificateDocument
          certificateId={id}
          parcel={parcel}
          checkResponse={checkResponse}
          publicStatus={publicStatus}
          issuedAt={checkResponse?.checkedAt || publicStatus?.lastChecked || new Date().toISOString()}
          verificationUrl={verificationUrl}
        />

        {/* Screen-only footer note */}
        <div className="no-print max-w-[210mm] mx-auto mt-6 text-center text-xs text-gray-500 space-y-1">
          <p>
            প্রিন্ট করার সময় ব্রাউজারের প্রিন্ট ডায়ালগে <strong>A4 Portrait</strong> এবং <strong>Background graphics</strong> সক্রিয় রাখুন।
          </p>
          <p className="text-[11px] text-gray-400">
            ল্যান্ডলক ইঞ্জিন • গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
