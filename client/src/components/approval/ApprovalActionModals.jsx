import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  X,
  AlertTriangle,
  Scale,
  FileText,
} from 'lucide-react'

export function ApproveConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
  caseNumber,
  parcelDescription,
  isLoading,
}) {
  const [reason, setReason] = useState(
    'বিজ্ঞ বিচারক কর্তৃক নথিপত্র, দাগ-খতিয়ান ও আইনগত অধিক্ষেত্র পর্যালোচনান্তে আদেশটি অনুমোদিত ও বলবৎ করা হলো।'
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approve-modal-title"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-govt-border overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-green-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-govt-gold" />
            <h3 id="approve-modal-title" className="font-bold text-sm">
              বিচারিক আদেশ চূড়ান্ত অনুমোদন (Judicial Endorsement)
            </h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-green-100 hover:text-white p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-gray-800">
          <div className="p-3 bg-green-50 border border-green-200 rounded text-green-950 space-y-1">
            <div className="font-bold">আইনগত ফলাফল ও কার্যকারিতা:</div>
            <p className="text-[11px] leading-relaxed">
              আদেশ <strong className="font-mono text-gray-950 font-bold">{orderReference}</strong> (মোকদ্দমা: {caseNumber}) অনুমোদনের সাথে সাথে সংশ্লিষ্ট ভূমি পার্সেলে{' '}
              <strong className="text-red-700 font-bold">সক্রিয় নিষেধাজ্ঞা লক (ACTIVE COURT INJUNCTION)</strong> জারি হবে। সাব-রেজিস্ট্রি গেটকিপারে সকল দলিল রেজিস্ট্রি স্বয়ংক্রিয়ভাবে অবরুদ্ধ থাকবে।
            </p>
          </div>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              বিচারিক অনুমোদনের আইনি ভিত্তি ও পর্যবেক্ষণ:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-govt-border rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-govt-green leading-relaxed"
              placeholder="অনুমোদনের আইনি পর্যবেক্ষণ লিখুন..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isLoading || !reason.trim()}
            onClick={() => onConfirm(reason)}
            className="bg-green-700 hover:bg-green-800 disabled:bg-gray-300 text-white px-5 py-2 text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? <span>অনুমোদন হচ্ছে...</span> : <span>চূড়ান্ত আদেশ কার্যকর করুন</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export function RejectConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
  caseNumber,
  isLoading,
}) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-govt-border overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-red-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle size={18} className="text-white" />
            <h3 id="reject-modal-title" className="font-bold text-sm">
              বিচারিক আদেশ প্রত্যাখ্যান (Reject Order)
            </h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-red-100 hover:text-white p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-gray-800">
          <p>
            আপনি আদেশ <strong className="font-mono text-gray-900 font-bold">{orderReference}</strong> (মোকদ্দমা নং {caseNumber}) প্রত্যাখ্যান করতে চলেছেন।
            প্রত্যাখ্যানের যথাযথ আইনি কারণ লিপিবদ্ধ করা বাধ্যতামূলক।
          </p>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              প্রত্যাখ্যানের সুনির্দিষ্ট কারণ দর্শান <span className="text-red-600">*</span>:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-red-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-red-500 leading-relaxed"
              placeholder="উদাহরণ: আদেশে উল্লিখিত তফসিল ও বাস্তব দাগের সীমানায় মৌলিক অসঙ্গতি বিদ্যমান..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isLoading || !reason.trim()}
            onClick={() => onConfirm(reason)}
            className="bg-red-700 hover:bg-red-800 disabled:bg-gray-300 text-white px-5 py-2 text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? <span>প্রত্যাখ্যান হচ্ছে...</span> : <span>প্রত্যাখ্যান নিশ্চিত করুন</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ReturnForCorrectionModal({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
  caseNumber,
  isLoading,
}) {
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="return-modal-title"
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full border border-govt-border overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-amber-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw size={18} className="text-govt-gold" />
            <h3 id="return-modal-title" className="font-bold text-sm">
              সংশোধনের জন্য ফেরত প্রেরণ (Return for Correction)
            </h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-amber-100 hover:text-white p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 text-xs text-gray-800">
          <p>
            আদেশ নম্বর <strong className="font-mono text-gray-900 font-bold">{orderReference}</strong> সংশোধন বা পরিমার্জনের নির্দেশনাসহ সংশ্লিষ্ট আদালত কর্মকর্তার নিকট ফেরত পাঠানো হবে।
          </p>

          <div>
            <label className="block font-bold text-gray-800 mb-1">
              সংশোধনের সুনির্দিষ্ট নির্দেশনা <span className="text-red-600">*</span>:
            </label>
            <textarea
              rows={3}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full text-xs p-2.5 border border-amber-300 rounded bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
              placeholder="উদাহরণ: মৌজা জেএল নম্বর এবং স্ক্যান কপির রেজোলিউশন সংশোধন করে পুনরায় দাখিল করুন..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isLoading || !instructions.trim()}
            onClick={() => onConfirm(instructions)}
            className="bg-amber-700 hover:bg-amber-800 disabled:bg-gray-300 text-white px-5 py-2 text-xs font-bold rounded shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isLoading ? <span>প্রেরণ হচ্ছে...</span> : <span>নির্দেশনাসহ ফেরত পাঠান</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
