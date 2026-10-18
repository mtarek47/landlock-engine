import { Component } from 'react'
import { AlertOctagon, RotateCcw, Home, ShieldAlert } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('LandLock Engine Runtime Error Boundary caught:', error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-govt-paper flex items-center justify-center p-4 font-bangla text-gray-900">
          <div className="max-w-md w-full bg-white rounded-xl border-2 border-red-300 shadow-md p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-govt-red rounded-full flex items-center justify-center mx-auto border border-red-200">
              <AlertOctagon size={28} />
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-bold text-gray-900">
                অ্যাপ্লিকেশন লোড করতে ত্রুটি দেখা দিয়েছে
              </h1>
              <p className="text-xs text-gray-600 leading-relaxed">
                ল্যান্ডলক ইঞ্জিন ক্লায়েন্ট ইন্টারফেসে একটি অনাকাঙ্ক্ষিত রানিং এরর ঘটেছে। সাদা স্ক্রিন বা ক্র্যাশ প্রতিরোধে সুরক্ষা মোড সক্রিয় হয়েছে।
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-red-50 rounded border border-red-200 text-left text-xs font-mono text-red-900 overflow-x-auto max-h-32">
                <strong>ত্রুটি:</strong> {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2 bg-govt-green hover:bg-govt-green-dark text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>পৃষ্ঠা রিফ্রেশ করুন</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-gray-300"
              >
                <Home size={14} />
                <span>প্রধান পাতা</span>
              </button>
            </div>

            <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
              গণপ্রজাতন্ত্রী বাংলাদেশ সরকার — ল্যান্ডলক ইঞ্জিন পোর্টাল
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
