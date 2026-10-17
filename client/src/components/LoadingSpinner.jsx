export default function LoadingSpinner({ text = 'লোড হচ্ছে...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-govt-green border-t-transparent" />
      <p className="text-gray-600 text-sm font-medium">{text}</p>
    </div>
  )
}
