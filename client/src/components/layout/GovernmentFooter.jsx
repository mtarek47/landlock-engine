import { Link } from 'react-router-dom'

export default function GovernmentFooter({ variant = 'minimal' }) {
  if (variant === 'minimal') {
    return (
      <footer className="bg-[#004137] text-white py-3 px-6 select-none border-t border-[#003126] font-bangla text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-100">
          <div className="flex items-center gap-3">
            <Link to="/#privacy" className="hover:text-white transition-colors">গোপনীয়তা নীতি</Link>
            <span className="text-emerald-700">|</span>
            <Link to="/#terms" className="hover:text-white transition-colors">ব্যবহারের শর্তাবলী</Link>
            <span className="text-emerald-700">|</span>
            <Link to="/#faq" className="hover:text-white transition-colors">সহায়তা</Link>
          </div>
          <div className="font-bangla font-medium text-emerald-200 text-xs">
            ল্যান্ডলক ইঞ্জিন &copy; ২০২৬ | সর্বস্বত্ব সংরক্ষিত
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="bg-[#004137] text-white py-3 px-6 select-none border-t border-[#003126] font-bangla text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-emerald-100">
        <div className="flex items-center gap-3">
          <Link to="/#privacy" className="hover:text-white transition-colors">গোপনীয়তা নীতি</Link>
          <span className="text-emerald-700">|</span>
          <Link to="/#terms" className="hover:text-white transition-colors">ব্যবহারের শর্তাবলী</Link>
          <span className="text-emerald-700">|</span>
          <Link to="/#faq" className="hover:text-white transition-colors">সহায়তা</Link>
        </div>
        <div className="font-bangla font-medium text-emerald-200 text-xs">
          ল্যান্ডলক ইঞ্জিন &copy; ২০২৬ | সর্বস্বত্ব সংরক্ষিত
        </div>
      </div>
    </footer>
  )
}
