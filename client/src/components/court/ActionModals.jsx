import { useState, useEffect } from 'react'
import {
  Send,
  CheckCircle2,
  XCircle,
  Unlock,
  AlertTriangle,
  X,
  FileText,
} from 'lucide-react'

export function SubmitOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
  isLoading,
}) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-govt-border overflow-hidden">
        <div className="p-4 bg-blue-50/80 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Send size={18} />
            <h3 id="submit-modal-title">আদেশ অনুমোদনের জন্য দাখিল</h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-gray-700">
          <p>
            আপনি কি নিশ্চিত যে আদেশের খসড়া{' '}
            <strong className="font-mono text-gray-900 font-bold">
              {orderReference}
            </strong>{' '}
            অনুমোদনের জন্য বিজ্ঞ বিচারকের স্বাক্ষরের উদ্দেশ্যে দাখিল করতে চান?
          </p>
          <div className="p-3 bg-gray-50 rounded border border-gray-200 text-[11px] text-gray-600 space-y-1">
            <div className="font-bold text-gray-700">গুরুত্বপূর্ণ তথ্য:</div>
            <div>• দাখিলের পর আদেশটি খসড়া থেকে 'SUBMITTED' স্থিতিতে স্থানান্তরিত হবে।</div>
            <div>• আদেশের প্রস্তুতকারী নিজে এটি অনুমোদন করতে পারবেন না।</div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            {isLoading ? <span>দাখিল হচ্ছে...</span> : <span>হ্যাঁ, দাখিল করুন</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ApproveOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
  isLoading,
}) {
  const [reason, setReason] = useState('বিজ্ঞ বিচারক কর্তৃক যথাযথ পর্যালোচনা সাপেক্ষে আদেশ অনুমোদিত')

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="approve-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-govt-border overflow-hidden">
        <div className="p-4 bg-green-50/80 border-b border-green-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-900 font-bold text-sm">
            <CheckCircle2 size={18} className="text-green-700" />
            <h3 id="approve-modal-title">আদেশ চূড়ান্ত অনুমোদন (Judicial Approval)</h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-gray-700">
          <p>
            আদেশ নম্বর{' '}
            <strong className="font-mono text-gray-900 font-bold">
              {orderReference}
            </strong>{' '}
            অনুমোদনের সাথে সাথে সংশ্লিষ্ট ভূমি পার্সেলে{' '}
            <strong className="text-red-700 font-bold">সক্রিয় নিষেধাজ্ঞা (ACTIVE LOCK)</strong>{' '}
            আরোপিত হবে এবং সাব-রেজিস্ট্রিতে লেনদেন স্বয়ংক্রিয়ভাবে স্থগিত হবে।
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              অনুমোদনের কারণ / বিচারিক পর্যবেক্ষণ:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-govt-border rounded bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-govt-green"
              placeholder="অনুমোদনের আইনি ভিত্তি উল্লেখ করুন..."
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isLoading || !reason.trim()}
            onClick={() => onConfirm(reason)}
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 text-xs font-bold rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? <span>অনুমোদন হচ্ছে...</span> : <span>চূড়ান্ত অনুমোদন সম্পন্ন করুন</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export function RejectOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reject-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-govt-border overflow-hidden">
        <div className="p-4 bg-red-50/80 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
            <XCircle size={18} className="text-red-700" />
            <h3 id="reject-modal-title">আদেশ প্রত্যাখ্যান (Reject Order)</h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-gray-700">
          <p>
            আপনি কি নিশ্চিত যে খসড়া আদেশ{' '}
            <strong className="font-mono text-gray-900 font-bold">
              {orderReference}
            </strong>{' '}
            প্রত্যাখ্যান করতে চান? প্রত্যাখ্যানের কারণ উল্লেখ করা বাধ্যতামূলক।
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              প্রত্যাখ্যানের কারণ / ত্রুটি উল্লেখ করুন <span className="text-red-600">*</span>:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-govt-border rounded bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-govt-green"
              placeholder="উদাহরণ: নথিতে পর্যাপ্ত প্রামাণ্য দলিলের ঘাটতি রয়েছে..."
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isLoading || !reason.trim()}
            onClick={() => onConfirm(reason)}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 text-xs font-bold rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? <span>প্রত্যাখ্যান হচ্ছে...</span> : <span>প্রত্যাখ্যান সম্পন্ন করুন</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ReleaseOrderModal({
  isOpen,
  onClose,
  onConfirm,
  orderReference,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="release-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-govt-border overflow-hidden">
        <div className="p-4 bg-purple-50/80 border-b border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
            <Unlock size={18} className="text-purple-700" />
            <h3 id="release-modal-title">নিষেধাজ্ঞা অবমুক্ত ও নিষ্পত্তি (Release Order)</h3>
          </div>
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-3 text-xs text-gray-700">
          <p>
            আদেশ নম্বর{' '}
            <strong className="font-mono text-gray-900 font-bold">
              {orderReference}
            </strong>{' '}
            অবমুক্ত করার ফলে সংশ্লিষ্ট ভূমি পার্সেলের উপর আরোপিত নিষেধাজ্ঞা প্রত্যাহার করা হবে এবং
            রেজিস্ট্রি গেটকিপার পুনরায় উন্মুক্ত হবে।
          </p>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              অবমুক্তির আদেশ বা রায়ের রেফারেন্স <span className="text-red-600">*</span>:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs p-2.5 border border-govt-border rounded bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-govt-green"
              placeholder="উদাহরণ: মোকদ্দমা নিষ্পত্তি ও প্রত্যাহার আদেশ নং VAC-2025-01"
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-govt-border flex items-center justify-end gap-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded transition-colors"
          >
            বাতিল
          </button>
          <button
            type="button"
            disabled={isLoading || !reason.trim()}
            onClick={() => onConfirm(reason)}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 text-xs font-bold rounded shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? <span>অবমুক্ত হচ্ছে...</span> : <span>নিষেধাজ্ঞা প্রত্যাহার করুন</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
