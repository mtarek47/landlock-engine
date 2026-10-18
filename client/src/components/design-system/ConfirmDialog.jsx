import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  X,
  Info,
  Scale,
} from 'lucide-react'
import Button from './Button'

/**
 * ConfirmDialog Component
 * Accessible modal dialog for consequential government actions (approvals, rejections, revocations).
 */
export default function ConfirmDialog({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'কার্যক্রম নিশ্চিতকরণ',
  description = 'আপনি কি নিশ্চিতভাবে এই কার্যক্রমটি সম্পন্ন করতে চান?',
  confirmText = 'হ্যাঁ, নিশ্চিত করুন',
  cancelText = 'বাতিল',
  variant = 'danger', // 'danger' | 'warning' | 'primary' | 'success'
  icon: CustomIcon = null,
  requireReason = false,
  reasonLabel = 'কার্যক্রম গ্রহণের সুনির্দিষ্ট আইনি কারণ লিখুন (বাধ্যতামূলক):',
  reasonPlaceholder = 'আদেশের কারণ বা রেফারেন্স উল্লেখ করুন...',
  isLoading = false,
}) {
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')
  const dialogRef = useRef(null)
  const confirmBtnRef = useRef(null)

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) {
      setReason('')
      setReasonError('')
      return
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    // Focus confirmation button or dialog on open
    setTimeout(() => {
      if (confirmBtnRef.current) {
        confirmBtnRef.current.focus()
      }
    }, 50)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isLoading, onClose])

  if (!isOpen) return null

  const handleConfirmClick = async () => {
    if (requireReason && !reason.trim()) {
      setReasonError('আইনি বিধিমালা মোতাবেক সুনির্দিষ্ট কারণ উল্লেখ করা বাধ্যতামূলক।')
      return
    }

    setReasonError('')
    if (onConfirm) {
      await onConfirm(requireReason ? reason.trim() : undefined)
    }
  }

  // Variant Visual Configurations
  const VARIANT_CONFIGS = {
    danger: {
      icon: AlertOctagon,
      iconBg: 'bg-red-50 text-red-600 border-red-200',
      btnVariant: 'danger',
    },
    warning: {
      icon: AlertTriangle,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      btnVariant: 'warning',
    },
    primary: {
      icon: Scale,
      iconBg: 'bg-green-50 text-govt-green border-green-200',
      btnVariant: 'primary',
    },
    success: {
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      btnVariant: 'primary',
    },
  }

  const config = VARIANT_CONFIGS[variant] || VARIANT_CONFIGS.primary
  const DialogIcon = CustomIcon || config.icon

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none font-bangla animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-desc"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => !isLoading && onClose()}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        ref={dialogRef}
        className="relative bg-white rounded-xl border border-govt-border shadow-xl max-w-lg w-full p-6 space-y-5 z-10 animate-in zoom-in-95 duration-150"
      >
        {/* Header with Icon & Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 ${config.iconBg}`}
            >
              <DialogIcon size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 id="dialog-title" className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                {title}
              </h2>
              <div className="text-[11px] text-gray-500 font-sans uppercase tracking-wider">
                Authoritative Action Confirmation
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-40"
            aria-label="ডায়ালগ বন্ধ করুন"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description Body */}
        <div id="dialog-desc" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {description}
        </div>

        {/* Mandatory Reason Input */}
        {requireReason && (
          <div className="space-y-1.5 pt-1">
            <label htmlFor="dialog-reason-input" className="label text-xs font-bold text-gray-800">
              {reasonLabel} <span className="text-red-600">*</span>
            </label>
            <textarea
              id="dialog-reason-input"
              rows={3}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (reasonError) setReasonError('')
              }}
              placeholder={reasonPlaceholder}
              disabled={isLoading}
              className={`input-field font-sans text-xs sm:text-sm resize-none ${
                reasonError ? 'border-red-400 ring-1 ring-red-400' : ''
              }`}
              autoFocus
            />
            {reasonError && (
              <p className="text-govt-red text-xs mt-1" role="alert">
                {reasonError}
              </p>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto text-gray-700"
          >
            {cancelText}
          </Button>

          <Button
            ref={confirmBtnRef}
            type="button"
            variant={config.btnVariant}
            size="md"
            onClick={handleConfirmClick}
            isLoading={isLoading}
            loadingText="প্রক্রিয়াধীন..."
            className="w-full sm:w-auto shadow-sm"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
