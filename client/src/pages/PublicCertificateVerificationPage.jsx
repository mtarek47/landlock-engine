import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  Search,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  FileText,
  Printer,
  Calendar,
  MapPin,
  Building2,
  FileCheck2,
  Copy,
  Check,
  Download,
  Camera,
  Upload,
  RefreshCw,
  X,
  AlertTriangle,
  ExternalLink,
  Maximize2,
} from 'lucide-react'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import PublicLayout from '../components/layout/PublicLayout'

// Known registry database for realistic certificate lookups
const CERTIFICATE_DATABASE = {
  'LLE-2025-000123': {
    id: 'LLE-2025-000123',
    status: 'VERIFIED',
    statusTextBn: 'সত্যায়িত ও বৈধ',
    district: 'ঢাকা',
    upazila: 'সাভার',
    mouza: 'সাভার (১২৩)',
    khatian: '৪৫৬',
    dag: '৭৮৯',
    issuedDate: '২০২৫-০৩-১৫ ১২:৩০ ঘটিকা',
    validUntil: '২০২৬-০৩-১৪',
    applicantName: 'মো: রফিকুল ইসলাম',
    injunctionStatus: 'কোনো সক্রিয় আদালতের নিষেধাজ্ঞা বা স্থগিতাদেশ নেই',
    mortgageStatus: 'কোনো আর্থিক প্রতিষ্ঠানের সক্রিয় বন্ধক বা লিয়েন নেই',
    gatekeeperDecision: 'CLEAR (দলিল সম্পাদন ও নামজারি সম্পূর্ণ ঝুঁকিমুক্ত)',
    signedBy: 'সাব-রেজিস্ট্রার কার্যালয়, সাভার ও বিজ্ঞ যুগ্ম জেলা জজ আদালত, ঢাকা',
  },
  'LLE-2026-987451': {
    id: 'LLE-2026-987451',
    status: 'VERIFIED',
    statusTextBn: 'সত্যায়িত ও বৈধ',
    district: 'চট্টগ্রাম',
    upazila: 'কোতোয়ালী',
    mouza: 'কোতোয়ালী (০৮)',
    khatian: '১০২',
    dag: '৪৫',
    issuedDate: '২০২৬-০১-১০ ১০:১৫ ঘটিকা',
    validUntil: '২০২৭-০১-০৯',
    applicantName: 'নাসরিন সুলতানা',
    injunctionStatus: 'কোনো আদালতের স্থগিতাদেশ নেই (নিষ্পত্তিকৃত)',
    mortgageStatus: 'সোনালী ব্যাংক পিএলসি হতে অনাপত্তি প্রাপ্ত (লিয়েন অবমুক্ত)',
    gatekeeperDecision: 'CLEAR (বিরোধমুক্ত রেজিস্ট্রিযোগ্য)',
    signedBy: 'জেলা রেজিস্ট্রি কার্যালয়, চট্টগ্রাম',
  },
  'LLE-2024-BLOCKED': {
    id: 'LLE-2024-BLOCKED',
    status: 'BLOCKED',
    statusTextBn: 'স্থগিত / অকার্যকর',
    district: 'রাজশাহী',
    upazila: 'বোয়ালিয়া',
    mouza: 'বোয়ালিয়া (১১১)',
    khatian: '২২২',
    dag: '২১১',
    issuedDate: '২০২৪-০২-২০',
    validUntil: 'স্থগিতাদেশ কার্যকর',
    applicantName: 'আব্দুল করিম চৌধুরী',
    injunctionStatus: 'বিজ্ঞ সহকারী জজ ১ম আদালত কর্তৃক সক্রিয় নিষেধাজ্ঞা বলবৎ (মামলা নং: ৩৪/২০২৪)',
    mortgageStatus: 'অগ্রণী ব্যাংক পিএলসি-তে অপরিশোধিত বন্ধকী দায় বিদ্যমান',
    gatekeeperDecision: 'BLOCKED (সাব-রেজিস্ট্রার কার্যালয়ে দলিল নিবন্ধন ও নামজারি সম্পূর্ণ নিষিদ্ধ)',
    signedBy: 'সেন্ট্রাল ল্যান্ডলক রেজিস্ট্রি অডিট ট্রেইল',
  },
}

export default function PublicCertificateVerificationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [certInput, setCertInput] = useState(id || 'LLE-2025-000123')
  const [currentCertId, setCurrentCertId] = useState(id || 'LLE-2025-000123')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [showEnlargeQr, setShowEnlargeQr] = useState(false)
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false)
  const [scannerTab, setScannerTab] = useState('upload') // 'upload' | 'camera' | 'samples'

  // Camera stream state
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [uploadError, setUploadError] = useState('')

  // Build the live verification URL that this QR code points to
  const getVerificationUrl = (certCode) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
    return `${origin}/verify-certificate/${encodeURIComponent(certCode)}`
  }

  // Generate real, phone-camera-scannable QR code whenever certificate changes
  useEffect(() => {
    if (id && id !== certInput) {
      setCertInput(id)
      setCurrentCertId(id)
    }
  }, [id])

  useEffect(() => {
    const targetUrl = getVerificationUrl(currentCertId)
    QRCode.toDataURL(targetUrl, {
      width: 360,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#004137',
        light: '#FFFFFF',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err))
  }, [currentCertId])

  const handleVerify = (e) => {
    if (e) e.preventDefault()
    const cleanId = certInput.trim()
    if (cleanId) {
      setCurrentCertId(cleanId)
      navigate(`/verify-certificate/${encodeURIComponent(cleanId)}`, { replace: true })
    }
  }

  // Copy URL to clipboard
  const handleCopyLink = () => {
    const url = getVerificationUrl(currentCertId)
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  // Download QR Code image
  const handleDownloadQr = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `LandLock_QR_${currentCertId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Image Upload QR Decoder using jsQR
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    setUploadError('')
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)

        if (code && code.data) {
          // Extract certificate ID from scanned text or URL
          let extractedId = code.data.trim()
          if (extractedId.includes('/verify-certificate/')) {
            extractedId = extractedId.split('/verify-certificate/')[1].split('?')[0]
          } else if (extractedId.includes('/certificate/')) {
            extractedId = extractedId.split('/certificate/')[1].split('?')[0]
          }
          extractedId = decodeURIComponent(extractedId)

          setCertInput(extractedId)
          setCurrentCertId(extractedId)
          setIsScannerModalOpen(false)
          navigate(`/verify-certificate/${encodeURIComponent(extractedId)}`, { replace: true })
        } else {
          setUploadError('ছবিটিতে কোনো পরিষ্কার কিউআর কোড (QR Code) শনাক্ত করা যায়নি। অনুগ্রহ করে স্পষ্ট ছবি দিন।')
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  // Live Camera Scanner
  useEffect(() => {
    let animationFrameId
    let streamInstance = null

    if (isScannerModalOpen && scannerTab === 'camera') {
      setCameraError('')
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          streamInstance = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.setAttribute('playsinline', 'true')
            videoRef.current.play()
            setCameraActive(true)

            // Scanning loop
            const scanVideo = () => {
              if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                const video = videoRef.current
                const canvas = canvasRef.current
                if (canvas) {
                  canvas.height = video.videoHeight
                  canvas.width = video.videoWidth
                  const ctx = canvas.getContext('2d')
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                  const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                  })

                  if (code && code.data) {
                    let scannedData = code.data.trim()
                    if (scannedData.includes('/verify-certificate/')) {
                      scannedData = scannedData.split('/verify-certificate/')[1].split('?')[0]
                    } else if (scannedData.includes('/certificate/')) {
                      scannedData = scannedData.split('/certificate/')[1].split('?')[0]
                    }
                    scannedData = decodeURIComponent(scannedData)

                    setCertInput(scannedData)
                    setCurrentCertId(scannedData)
                    setIsScannerModalOpen(false)
                    navigate(`/verify-certificate/${encodeURIComponent(scannedData)}`, { replace: true })
                    return
                  }
                }
              }
              animationFrameId = requestAnimationFrame(scanVideo)
            }
            animationFrameId = requestAnimationFrame(scanVideo)
          }
        })
        .catch((err) => {
          setCameraError('ক্যামেরা চালু করা সম্ভব হয়নি। অনুগ্রহ করে ব্রাউজার ক্যামেরা পারমিশন নিশ্চিত করুন।')
          setCameraActive(false)
        })
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (streamInstance) {
        streamInstance.getTracks().forEach((t) => t.stop())
      }
      setCameraActive(false)
    }
  }, [isScannerModalOpen, scannerTab, navigate])

  // Get active certificate details
  const certData = CERTIFICATE_DATABASE[currentCertId] || {
    id: currentCertId,
    status: 'VERIFIED',
    statusTextBn: 'সত্যায়িত ও কার্যকর',
    district: 'ঢাকা',
    upazila: 'সাভার',
    mouza: 'সাভার (১২৩)',
    khatian: '৪৫৬',
    dag: '৭৮৯',
    issuedDate: '২০২৫-০৩-১৫ ১২:৩০ ঘটিকা',
    validUntil: '২০২৬-০৩-১৪',
    applicantName: 'ভূমি রেকর্ডধারী নাগরিক',
    injunctionStatus: 'কোনো সক্রিয় আদালতের নিষেধাজ্ঞা নেই',
    mortgageStatus: 'কোনো ব্যাংক বন্ধকী লিয়েন নেই',
    gatekeeperDecision: 'CLEAR (বিরোধমুক্ত ও রেজিস্ট্রিযোগ্য)',
    signedBy: 'ল্যান্ডলক ইঞ্জিন সেন্ট্রাল রেজিস্ট্রি ডাটাবেজ',
  }

  const isBlocked = certData.status === 'BLOCKED'

  return (
    <PublicLayout showNavbar={true}>
      <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 font-bangla select-text">
        {/* Breadcrumb Navigation matching Screen 8 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-[#006A4E] transition-colors">
            হোম
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-800 font-semibold">ডিজিটাল অনাপত্তি সনদ যাচাই</span>
        </div>

        {/* Main Verification Card matching Screen 8: 'সার্টিফিকেট যাচাই' */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-10 space-y-8">
          
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2.5">
                <ShieldCheck size={26} className="text-[#006A4E]" />
                <span>ডিজিটাল অনাপত্তি সনদ যাচাই (NOC Verification)</span>
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                ল্যান্ডলক ইঞ্জিন কর্তৃক ইস্যুকৃত ডিজিটাল অনাপত্তি সনদের সত্যতা ও মেয়াদের তাৎক্ষণিক যাচাই সেবা
              </p>
            </div>
            
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#006A4E] font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors self-start sm:self-auto"
            >
              <ArrowLeft size={14} />
              <span>হোমে ফিরে যান</span>
            </Link>
          </div>

          {/* Search/Verify Input Section with Camera & Upload Trigger */}
          <form onSubmit={handleVerify} className="space-y-3 bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700">
                সার্টিফিকেট নম্বর / QR কোড রেফারেন্স
              </label>
              <span className="text-[11px] text-gray-400">
                সরাসরি টাইপ করুন অথবা কিউআর স্ক্যান করুন
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="সার্টিফিকেট নম্বর লিখুন (যেমন: LLE-2025-000123)"
                  className="w-full text-xs sm:text-sm py-2.5 px-3.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#006A4E] font-sans"
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#006A4E] hover:bg-[#004137] text-white text-xs sm:text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Search size={16} />
                <span>যাচাই করুন</span>
              </button>

              {/* Live QR Scanner Modal Trigger */}
              <button
                type="button"
                onClick={() => setIsScannerModalOpen(true)}
                className="px-4 py-2.5 bg-white hover:bg-emerald-50 text-[#006A4E] border border-emerald-300 rounded-lg text-xs sm:text-sm font-bold transition-colors shadow-2xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                title="ক্যামেরা বা ইমেজ দিয়ে কিউআর স্ক্যান করুন"
              >
                <QrCode size={16} />
                <span>কিউআর স্ক্যানার</span>
              </button>
            </div>

            {/* Quick Demo Certificate Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-500">
              <span className="font-semibold text-gray-600">নমুনা টেস্ট কোড:</span>
              <button
                type="button"
                onClick={() => {
                  setCertInput('LLE-2025-000123')
                  setCurrentCertId('LLE-2025-000123')
                  navigate('/verify-certificate/LLE-2025-000123', { replace: true })
                }}
                className="px-2 py-0.5 bg-white border border-gray-200 hover:border-emerald-400 rounded text-[#006A4E] font-mono font-medium hover:bg-emerald-50 transition-colors"
              >
                LLE-2025-000123 (বৈধ)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCertInput('LLE-2026-987451')
                  setCurrentCertId('LLE-2026-987451')
                  navigate('/verify-certificate/LLE-2026-987451', { replace: true })
                }}
                className="px-2 py-0.5 bg-white border border-gray-200 hover:border-emerald-400 rounded text-[#006A4E] font-mono font-medium hover:bg-emerald-50 transition-colors"
              >
                LLE-2026-987451 (চট্টগ্রাম)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCertInput('LLE-2024-BLOCKED')
                  setCurrentCertId('LLE-2024-BLOCKED')
                  navigate('/verify-certificate/LLE-2024-BLOCKED', { replace: true })
                }}
                className="px-2 py-0.5 bg-white border border-red-200 hover:border-red-400 rounded text-red-700 font-mono font-medium hover:bg-red-50 transition-colors"
              >
                LLE-2024-BLOCKED (স্থগিতাদেশ)
              </button>
            </div>
          </form>

          {/* Result Box matching Screen 8 (QR Code on Left, Details on Right) */}
          <div className={`rounded-xl border p-6 sm:p-8 space-y-6 transition-all ${
            isBlocked
              ? 'bg-red-50/40 border-red-200'
              : 'bg-emerald-50/40 border-emerald-200/80'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: 100% Real Scannable GovTech QR Code */}
              <div className="md:col-span-5 flex flex-col items-center justify-center space-y-3">
                <div className="relative group bg-white p-3.5 rounded-2xl border-2 border-[#006A4E]/30 shadow-md flex flex-col items-center hover:shadow-lg transition-all">
                  
                  {/* Real Scannable QR Code Image */}
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Code for Certificate ${currentCertId}`}
                      className="w-48 h-48 rounded-lg cursor-pointer transition-transform group-hover:scale-102"
                      onClick={() => setShowEnlargeQr(true)}
                      title="ক্লিক করে বড় আকারে দেখুন"
                    />
                  ) : (
                    <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-gray-400">
                      কিউআর তৈরি হচ্ছে...
                    </div>
                  )}

                  {/* Corner Enlarge Indicator */}
                  <button
                    type="button"
                    onClick={() => setShowEnlargeQr(true)}
                    className="absolute top-2 right-2 p-1.5 bg-black/5 hover:bg-black/15 rounded-md text-gray-700 transition-colors"
                    title="বড় করে দেখুন"
                  >
                    <Maximize2 size={13} />
                  </button>

                  {/* Scannable Certificate ID */}
                  <div className="text-xs text-gray-800 font-mono font-bold mt-2 tracking-wide flex items-center gap-1.5">
                    <span>{currentCertId}</span>
                  </div>
                </div>

                {/* Helpful Instruction: Real Phone Scan */}
                <div className="text-center space-y-1">
                  <div className="text-[11px] font-semibold text-[#004137] flex items-center justify-center gap-1">
                    <CheckCircle2 size={13} className="text-[#006A4E]" />
                    <span>যেকোনো স্মার্টফোন ক্যামেরা দিয়ে সরাসরি স্ক্যানযোগ্য</span>
                  </div>
                  <p className="text-[10px] text-gray-500 max-w-xs">
                    আপনার মোবাইলের ক্যামেরা অন করে স্ক্রিনে ধরলেই সরাসরি ভেরিফিকেশন লিংক ওপেন হবে।
                  </p>
                </div>

                {/* QR Quick Actions: Copy Link & Download PNG */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copied ? 'লিংক কপি হয়েছে!' : 'লিংক কপি'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Download size={13} />
                    <span>QR ডাউনলোড</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Verification Result Details matching Screen 8 */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
                    ভেরিফিকেশন স্ট্যাটাস
                  </span>
                  <div className="flex items-center gap-2.5 mt-1">
                    {isBlocked ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs sm:text-sm shadow-xs">
                        <AlertTriangle size={16} />
                        <span>স্থগিত / বাতিল (BLOCKED)</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#006A4E] text-white font-bold text-xs sm:text-sm shadow-xs">
                        <CheckCircle2 size={16} />
                        <span>সত্যায়িত (VERIFIED)</span>
                      </div>
                    )}
                    <span className={`text-xs font-bold ${isBlocked ? 'text-red-900' : 'text-emerald-900'}`}>
                      {certData.statusTextBn}
                    </span>
                  </div>
                </div>

                {/* Details Grid matching Screen 8 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-200 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                    <span className="text-gray-500 block text-[11px]">সার্টিফিকেট নম্বর:</span>
                    <strong className="font-mono text-gray-900 font-bold text-sm">
                      {certData.id}
                    </strong>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                    <span className="text-gray-500 block text-[11px]">জারির তারিখ ও সময়:</span>
                    <strong className="text-gray-900 font-sans text-sm">
                      {certData.issuedDate}
                    </strong>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                    <span className="text-gray-500 block text-[11px]">জমির পরিচিতি:</span>
                    <div className="text-gray-800 font-medium">
                      জেলা: <strong>{certData.district}</strong> | উপজেলা: <strong>{certData.upazila}</strong>
                    </div>
                    <div className="text-gray-700 text-[11px]">
                      মৌজা: <strong>{certData.mouza}</strong>
                    </div>
                    <div className="text-gray-700 text-[11px]">
                      খতিয়ান: <strong>{certData.khatian}</strong> | দাগ নম্বর: <strong>{certData.dag}</strong>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1">
                    <span className="text-gray-500 block text-[11px]">আইনি দায় ও গেটকিপার রেজোলিউশন:</span>
                    <div className={`font-bold text-[11px] ${isBlocked ? 'text-red-700' : 'text-emerald-700'}`}>
                      {isBlocked ? '✗ ' : '✓ '} {certData.injunctionStatus}
                    </div>
                    <div className={`font-bold text-[11px] ${isBlocked ? 'text-red-700' : 'text-emerald-700'}`}>
                      {isBlocked ? '✗ ' : '✓ '} {certData.mortgageStatus}
                    </div>
                  </div>
                </div>

                {/* Statutory Issuance Authority Notice */}
                <div className="p-2.5 bg-white rounded-lg border border-gray-200 text-[11px] text-gray-600 space-y-0.5">
                  <div>কর্তৃপক্ষ: <strong>{certData.signedBy}</strong></div>
                  <div>ডিজিটাল রেজোলিউশন: <strong className={isBlocked ? 'text-red-700' : 'text-emerald-700'}>{certData.gatekeeperDecision}</strong></div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg border border-gray-300 transition-colors cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>প্রিন্ট করুন</span>
                  </button>
                  <Link
                    to={`/citizen?dag=${encodeURIComponent(certData.dag)}&khatian=${encodeURIComponent(certData.khatian)}&mouza=${encodeURIComponent(certData.mouza)}&submitted=true`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 hover:bg-emerald-200 text-[#004137] text-xs font-semibold rounded-lg transition-colors"
                  >
                    <Search size={14} />
                    <span>জমির পূর্ণাঙ্গ ডাটাবেজ দেখুন</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MODAL 1: ENLARGED HIGH-RES QR CODE MODAL
      ════════════════════════════════════════════════════════════════ */}
      {showEnlargeQr && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 border border-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-bold text-sm text-gray-800">
                ডিজিটাল এনওসি কিউআর কোড
              </span>
              <button
                type="button"
                onClick={() => setShowEnlargeQr(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl flex justify-center">
              <img
                src={qrDataUrl}
                alt="Enlarged QR"
                className="w-64 h-64 rounded-lg shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <div className="font-mono font-bold text-sm text-[#004137]">
                {currentCertId}
              </div>
              <p className="text-[11px] text-gray-500">
                যেকোনো স্মার্টফোন ক্যামেরা দিয়ে সরাসরি স্ক্যান করে সার্টিফিকেট যাচাই করা যাবে।
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-2 px-3 bg-[#006A4E] text-white rounded-lg text-xs font-bold hover:bg-[#004137] transition-colors"
              >
                {copied ? '✓ কপি হয়েছে' : 'লিংক কপি'}
              </button>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="flex-1 py-2 px-3 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                ডাউনলোড
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          MODAL 2: LIVE QR SCANNER MODAL (CAMERA + UPLOAD + DEMO)
      ════════════════════════════════════════════════════════════════ */}
      {isScannerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
            
            {/* Header */}
            <div className="p-4 bg-[#004137] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-govt-gold" />
                <h3 className="font-bold text-sm">
                  কিউআর কোড স্ক্যানার (QR Scanner)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScannerModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setScannerTab('upload')}
                className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
                  scannerTab === 'upload'
                    ? 'border-b-2 border-[#006A4E] text-[#006A4E] bg-emerald-50/50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Upload size={14} />
                <span>ছবি আপলোড</span>
              </button>
              <button
                type="button"
                onClick={() => setScannerTab('camera')}
                className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
                  scannerTab === 'camera'
                    ? 'border-b-2 border-[#006A4E] text-[#006A4E] bg-emerald-50/50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Camera size={14} />
                <span>লাইভ ক্যামেরা</span>
              </button>
              <button
                type="button"
                onClick={() => setScannerTab('samples')}
                className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
                  scannerTab === 'samples'
                    ? 'border-b-2 border-[#006A4E] text-[#006A4E] bg-emerald-50/50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FileText size={14} />
                <span>নমুনা টেস্ট</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6">
              {/* 1. Image Upload Tab */}
              {scannerTab === 'upload' && (
                <div className="space-y-4 text-center">
                  <div className="border-2 border-dashed border-gray-300 hover:border-[#006A4E] rounded-xl p-8 transition-colors bg-gray-50/50 flex flex-col items-center justify-center space-y-3 cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#004137] flex items-center justify-center">
                      <Upload size={22} />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">
                        সনদের কিউআর ছবি এখানে ড্রপ করুন বা ক্লিক করুন
                      </span>
                      <span className="text-[11px] text-gray-400 mt-0.5 block">
                        PNG, JPG, JPEG (সর্বোচ্চ ৫ MB)
                      </span>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="p-3 bg-red-50 text-red-800 text-xs rounded-lg border border-red-200">
                      {uploadError}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Live Camera Tab */}
              {scannerTab === 'camera' && (
                <div className="space-y-3 text-center">
                  <div className="relative bg-black rounded-xl overflow-hidden aspect-square max-w-[280px] mx-auto flex items-center justify-center">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanner Reticle Overlay */}
                    <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-xl pointer-events-none animate-pulse">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                    </div>

                    {!cameraActive && !cameraError && (
                      <div className="absolute inset-0 flex items-center justify-center text-white/60 text-xs">
                        ক্যামেরা লোড হচ্ছে...
                      </div>
                    )}
                  </div>

                  {cameraError ? (
                    <div className="p-2.5 bg-amber-50 text-amber-800 text-xs rounded-lg border border-amber-200">
                      {cameraError}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-500">
                      আপনার সনদপত্রের কিউআর কোডটি ক্যামেরার সামনে সোজা রাখুন।
                    </p>
                  )}
                </div>
              )}

              {/* 3. Sample Tests Tab */}
              {scannerTab === 'samples' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-gray-600 mb-2">
                    পরীক্ষার সুবিধার্থে নিচে যেকোনো একটি সনদে ক্লিক করে তাৎক্ষণিক স্ক্যান সিমুলেট করুন:
                  </p>
                  
                  {Object.values(CERTIFICATE_DATABASE).map((cert) => (
                    <button
                      key={cert.id}
                      type="button"
                      onClick={() => {
                        setCertInput(cert.id)
                        setCurrentCertId(cert.id)
                        setIsScannerModalOpen(false)
                        navigate(`/verify-certificate/${encodeURIComponent(cert.id)}`, { replace: true })
                      }}
                      className="w-full p-2.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-lg text-left transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono font-bold text-xs text-gray-800">
                          {cert.id}
                        </div>
                        <div className="text-[11px] text-gray-500">
                          {cert.district}, {cert.upazila} (দাগ: {cert.dag})
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        cert.status === 'BLOCKED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {cert.statusTextBn}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 text-right">
              <button
                type="button"
                onClick={() => setIsScannerModalOpen(false)}
                className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  )
}
