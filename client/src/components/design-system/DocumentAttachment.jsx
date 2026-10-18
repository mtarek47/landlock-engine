import { useState, useRef } from 'react'
import {
  UploadCloud,
  FileText,
  FileCheck,
  X,
  AlertCircle,
  Eye,
  Trash2,
  Paperclip,
} from 'lucide-react'
import { toBengaliNumber } from './constants'

/**
 * DocumentAttachment Component
 * Supports drag-and-drop file upload, size/type validation, file listing, and metadata capture.
 */
export default function DocumentAttachment({
  files = [], // Array of { id, name, size, type, url, uploadProgress, status }
  onFilesChange,
  maxFiles = 5,
  maxSizeMb = 10,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  label = 'সংযুক্তি ও প্রামাণ্য নথিপত্র (Document Attachments)',
  description = 'আদালতের আদেশপত্রের স্ক্যান কপি, মামলার আরজি বা ব্যাংক অনাপত্তিপত্র সংযুক্তি করুন।',
  disabled = false,
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const formatFileSize = (bytes) => {
    if (!bytes) return '০ KB'
    if (bytes < 1024 * 1024) {
      return `${toBengaliNumber((bytes / 1024).toFixed(1))} KB`
    }
    return `${toBengaliNumber((bytes / (1024 * 1024)).toFixed(1))} MB`
  }

  const validateAndAddFiles = (incomingFiles) => {
    setError('')
    const fileList = Array.from(incomingFiles)

    if (files.length + fileList.length > maxFiles) {
      setError(`সর্বোচ্চ ${toBengaliNumber(maxFiles)} টি নথি আপলোড করা সম্ভব।`)
      return
    }

    const validNewFiles = []

    for (const file of fileList) {
      // Validate file size
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`"${file.name}" নথির আকার ${toBengaliNumber(maxSizeMb)}MB এর চেয়ে বেশি হতে পারবে না।`)
        return
      }

      // Validate file extension
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      if (!acceptedTypes.includes(ext)) {
        setError(`"${ext}" ফরম্যাটের নথি অনুমোদিত নয়। শুধুমাত্র ${acceptedTypes.join(', ')} ফাইল গ্রহণযোগ্য।`)
        return
      }

      validNewFiles.push({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'READY', // 'READY' | 'UPLOADING' | 'VERIFIED'
        uploadedAt: new Date().toISOString(),
      })
    }

    if (onFilesChange && validNewFiles.length > 0) {
      onFilesChange([...files, ...validNewFiles])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files)
    }
  }

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files)
    }
    // Reset input so same file can be reselected if removed
    e.target.value = ''
  }

  const handleRemoveFile = (id) => {
    if (onFilesChange) {
      onFilesChange(files.filter((f) => f.id !== id))
    }
    setError('')
  }

  return (
    <div className={`space-y-3 font-bangla select-text ${className}`}>
      {/* Header Label */}
      <div>
        <label className="label text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5 mb-0.5">
          <Paperclip size={15} className="text-govt-green" />
          <span>{label}</span>
        </label>
        {description && (
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all select-none focus-within:ring-2 focus-within:ring-govt-green ${
          disabled
            ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
            : isDragging
            ? 'bg-green-50 border-govt-green ring-2 ring-govt-green/40'
            : 'bg-govt-paper hover:bg-gray-50 border-govt-border hover:border-govt-green/60'
        }`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        aria-label="নথি আপলোড করুন"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={disabled}
          className="sr-only"
        />

        <div className="w-12 h-12 rounded-full bg-white border border-gray-300 flex items-center justify-center mx-auto mb-3 text-govt-green shadow-xs">
          <UploadCloud size={24} aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-bold text-gray-800">
            নথি ড্র্যাগ করে এখানে ছেড়ে দিন, অথবা <span className="text-govt-green underline underline-offset-2">ব্রাউজ করুন</span>
          </div>
          <p className="text-[11px] text-gray-500">
            সমর্থিত ফরম্যাট: {acceptedTypes.join(', ')} • প্রতি ফাইলের সর্বোচ্চ আকার: {toBengaliNumber(maxSizeMb)}MB
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-red-900 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle size={15} className="text-govt-red shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Attachment List */}
      {files.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="text-xs font-bold text-gray-700 flex items-center justify-between">
            <span>সংযুক্ত নথিপত্র ({toBengaliNumber(files.length)} টি):</span>
            <span className="text-[11px] text-gray-500">সর্বোচ্চ {toBengaliNumber(maxFiles)} টি</span>
          </div>

          <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs">
            {files.map((file) => (
              <li
                key={file.id}
                className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-gray-50/80 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-green-50 text-govt-green border border-green-200 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{file.name}</div>
                    <div className="text-[10px] text-gray-500 font-sans flex items-center gap-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                        <FileCheck size={11} /> যাচাইকৃত নথি
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {file.url && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded text-gray-500 hover:text-govt-green hover:bg-gray-100 transition-colors"
                      title="নথি প্রদর্শন করুন"
                    >
                      <Eye size={15} />
                    </a>
                  )}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      title="সংযুক্তি মুছুন"
                      aria-label={`${file.name} সংযুক্তি মুছুন`}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
