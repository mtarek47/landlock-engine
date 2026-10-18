import { useState } from 'react'
import {
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  FileText,
  Mail,
  Send,
  Printer,
  ShieldAlert,
  ArrowRight,
  Clock,
  Check,
  Scale,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../design-system/ConfirmDialog'
import { toBengaliNumber } from '../design-system/constants'
import { useAuth } from '../../context/AuthContext'

export default function OfficerActionConsole({
  result,
  parcel,
  onRecordAction,
  actionHistory = [],
}) {
  const { user } = useAuth()

  // Dialog State
  const [activeModal, setActiveModal] = useState(null) // 'APPROVE' | 'REJECT' | 'REFER' | 'NOC_NOTICE' | null
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  if (!result) return null

  const decision = result.decision
  const isClear = decision === 'CLEAR'
  const isBlocked = decision === 'BLOCKED_BY_VALID_ORDER' || decision === 'MORTGAGE_REQUIRES_RELEASE'
  const isReviewRequired = decision === 'REVIEW_REQUIRED' || decision === 'UNKNOWN'

  const handleConfirmAction = async (remarks) => {
    setIsSubmitting(true)
    try {
      let actionType = 'UNKNOWN'
      let actionTitle = ''

      if (activeModal === 'APPROVE') {
        actionType = 'DEED_REGISTRATION_APPROVED'
        actionTitle = 'দলিল রেজিস্ট্রি অনুমোদিত ও বালাম বইভুক্ত'
      } else if (activeModal === 'REJECT') {
        actionType = 'REGISTRATION_FORMALLY_REFUSED'
        actionTitle = 'দলিল নিবন্ধন সংবিধিবদ্ধ কারণে অবরুদ্ধ ও প্রত্যাখ্যাত'
      } else if (activeModal === 'REFER') {
        actionType = 'REFERRED_TO_AC_LAND'
        actionTitle = 'সহকারী কমিশনার (ভূমি) এর কাছে রেকর্ড যাচাইয়ের জন্য প্রেরিত'
      } else if (activeModal === 'NOC_NOTICE') {
        actionType = 'BANK_NOC_NOTICE_ISSUED'
        actionTitle = 'ব্যাংক অনাপত্তি সনদ দাখিলের ১৫ দিনের নোটিশ জারি'
      }

      const actionData = {
        actionType,
        actionTitle,
        checkId: result.checkId,
        requestId: result.requestId,
        parcelId: result.parcelId,
        applicationReference: result.applicationReference,
        officerName: user?.displayName || 'সাব-রেজিস্ট্রার',
        officerRole: user?.role || 'REGISTRY_OFFICER',
        remarks: remarks || 'কোনো মন্তব্য প্রদান করা হয়নি।',
        timestamp: new Date().toISOString(),
      }

      if (onRecordAction) {
        onRecordAction(actionData)
      }

      setSuccessMessage(`${actionTitle} সফলভাবে সংরক্ষিত হয়েছে।`)
      setTimeout(() => setSuccessMessage(''), 4000)
    } finally {
      setIsSubmitting(false)
      setActiveModal(null)
    }
  }

  return (
    <div className="card p-5 border border-govt-border bg-white rounded-lg shadow-2xs space-y-4 font-bangla">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-govt-border">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <Scale size={18} className="text-govt-green" />
            <span>সাব-রেজিস্ট্রারের দাপ্তরিক সিদ্ধান্ত ও পদক্ষেপ (Auditable Officer Actions)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            আইনি স্থিতি ও গেটকিপার ফলাফলের আলোকে সংবিধিবদ্ধ প্রশাসনিক পদক্ষেপ গ্রহণ করুন।
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-govt-paper border border-govt-border text-gray-700 self-start sm:self-auto font-sans">
          কর্মকর্তা: {user?.displayName || 'সাব-রেজিস্ট্রার'}
        </span>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 flex items-center gap-2">
          <Check size={16} className="text-emerald-700 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Action Buttons Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Action 1: Approve Registration */}
        <button
          type="button"
          disabled={!isClear}
          onClick={() => setActiveModal('APPROVE')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
            isClear
              ? 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-950 shadow-2xs'
              : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
          }`}
          title={!isClear ? 'আইনি বাধা বা অনিষ্পন্ন দায় থাকায় অনুমোদন নিষ্ক্রিয়' : 'দলিল রেজিস্ট্রি অনুমোদন করুন'}
        >
          <div className="flex items-center justify-between">
            <CheckCircle size={18} className={isClear ? 'text-emerald-700' : 'text-gray-400'} />
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isClear ? 'bg-emerald-200 text-emerald-900' : 'bg-gray-200 text-gray-500'}`}>
              {isClear ? 'অনুমোদনযোগ্য' : 'নিষ্ক্রিয়'}
            </span>
          </div>
          <div>
            <strong className="text-xs block font-bold leading-tight">দলিল রেজিস্ট্রি অনুমোদন</strong>
            <span className="text-[10px] block text-gray-500 mt-0.5">
              সকল বাধা মুক্ত সাপেক্ষে রেজিস্ট্রি অনুমোদন ও বালাম বইভুক্তকরণ
            </span>
          </div>
        </button>

        {/* Action 2: Refuse / Block Registration */}
        <button
          type="button"
          onClick={() => setActiveModal('REJECT')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
            isBlocked
              ? 'bg-red-50 hover:bg-red-100/80 border-red-300 text-red-950 shadow-2xs'
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <AlertOctagon size={18} className={isBlocked ? 'text-red-700' : 'text-gray-500'} />
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isBlocked ? 'bg-red-200 text-red-900' : 'bg-gray-200 text-gray-600'}`}>
              {isBlocked ? 'বাধ্যতামূলক' : 'ঐচ্ছিক'}
            </span>
          </div>
          <div>
            <strong className="text-xs block font-bold leading-tight">নিবন্ধন প্রত্যাখ্যান / অবরুদ্ধ</strong>
            <span className="text-[10px] block text-gray-500 mt-0.5">
              আদালতের আদেশ বা ব্যাংক দায়ের কারণে আনুষ্ঠানিক প্রত্যাখ্যান নোটিশ
            </span>
          </div>
        </button>

        {/* Action 3: Refer to AC Land */}
        <button
          type="button"
          onClick={() => setActiveModal('REFER')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
            isReviewRequired
              ? 'bg-yellow-50 hover:bg-yellow-100/80 border-yellow-400 text-yellow-950 shadow-2xs'
              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <Send size={18} className={isReviewRequired ? 'text-yellow-700' : 'text-gray-500'} />
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isReviewRequired ? 'bg-yellow-200 text-yellow-900' : 'bg-gray-200 text-gray-600'}`}>
              রেকর্ড যাচাই
            </span>
          </div>
          <div>
            <strong className="text-xs block font-bold leading-tight">এসিল্যান্ডে রেকর্ড রেফার</strong>
            <span className="text-[10px] block text-gray-500 mt-0.5">
              সীমানা বিরোধ বা খতিয়ানের অস্পষ্টতায় সহকারী কমিশনারে প্রেরণ
            </span>
          </div>
        </button>

        {/* Action 4: Issue Bank NOC Notice */}
        <button
          type="button"
          disabled={decision !== 'MORTGAGE_REQUIRES_RELEASE'}
          onClick={() => setActiveModal('NOC_NOTICE')}
          className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
            decision === 'MORTGAGE_REQUIRES_RELEASE'
              ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-300 text-amber-950 shadow-2xs'
              : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <Mail size={18} className={decision === 'MORTGAGE_REQUIRES_RELEASE' ? 'text-amber-700' : 'text-gray-400'} />
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${decision === 'MORTGAGE_REQUIRES_RELEASE' ? 'bg-amber-200 text-amber-900' : 'bg-gray-200 text-gray-500'}`}>
              ১৫ দিনের নোটিশ
            </span>
          </div>
          <div>
            <strong className="text-xs block font-bold leading-tight">ব্যাংক NOC দাখিলের নোটিশ</strong>
            <span className="text-[10px] block text-gray-500 mt-0.5">
              বন্ধক লিয়েন অবমুক্তির মূল কপি দাখিলের আনুষ্ঠানিক চিঠি
            </span>
          </div>
        </button>
      </div>

      {/* Action History Log for current session */}
      {actionHistory.length > 0 && (
        <div className="pt-3 border-t border-govt-border space-y-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-gray-500" />
            <span>সাম্প্রতিক দাপ্তরিক অ্যাকশন লগ (Audited Officer Decision Trail):</span>
          </h3>
          <div className="space-y-1.5">
            {actionHistory.slice(0, 3).map((act) => (
              <div
                key={act.id}
                className="p-2.5 bg-gray-50 rounded border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <strong className="text-gray-900 font-bold block">{act.actionTitle}</strong>
                  <span className="text-[11px] text-gray-600 mt-0.5 block">
                    মন্তব্য / রেফারেন্স: {act.remarks}
                  </span>
                </div>
                <div className="text-right text-[10px] text-gray-500 font-sans shrink-0">
                  <div>কর্মকর্তা: {act.officerName}</div>
                  <div>{new Date(act.timestamp).toLocaleTimeString('bn-BD')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      {activeModal === 'APPROVE' && (
        <ConfirmDialog
          isOpen={true}
          variant="success"
          title="দলিল রেজিস্ট্রি অনুমোদন নিশ্চিতকরণ"
          description={`আবেদন নং ${result.applicationReference || 'REG-APP'} এর জন্য কোনো সক্রিয় আইনি প্রতিবন্ধকতা নেই। আপনি কি উক্ত দলিল রেজিস্ট্রি চূড়ান্ত অনুমোদন ও বালাম বইভুক্ত করতে ইচ্ছুক?`}
          confirmText="হ্যাঁ, রেজিস্ট্রি অনুমোদন করুন"
          cancelText="বাতিল"
          requireReason={true}
          reasonLabel="দলিলের বালাম বই ও রেজিস্ট্রি সিরিয়াল নম্বর লিখুন (বাধ্যতামূলক):"
          reasonPlaceholder="যেমন: বালাম নং ১২, দলিল নং ৮০৯১/২০২৫..."
          isLoading={isSubmitting}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {activeModal === 'REJECT' && (
        <ConfirmDialog
          isOpen={true}
          variant="danger"
          title="দলিল নিবন্ধন প্রত্যাখ্যান / অবরুদ্ধকরণ আদেশ"
          description={`আবেদন নং ${result.applicationReference || 'REG-APP'} সংক্রান্ত জমিতে সক্রিয় আইনি প্রতিবন্ধকতা বিদ্যমান। রেজিস্ট্রেশন আইন ১৯০৮ অনুযায়ী কার্যক্রম স্থগিত ঘোষণা করা হচ্ছে।`}
          confirmText="হ্যাঁ, নিবন্ধন অবরুদ্ধ করুন"
          cancelText="ফিরে যান"
          requireReason={true}
          reasonLabel="প্রত্যাখ্যানের সুনির্দিষ্ট আইনি ধারা ও নথি রেফারেন্স উল্লেখ করুন:"
          reasonPlaceholder="যেমন: রেজিস্ট্রেশন আইন ১৯০৮ এর ধারা ২২এ এবং আদালতের আদেশ নং ORD-DH-2024-991..."
          isLoading={isSubmitting}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {activeModal === 'REFER' && (
        <ConfirmDialog
          isOpen={true}
          variant="warning"
          title="সহকারী কমিশনার (ভূমি) এর কাছে রেকর্ড যাচাই রেফারেল"
          description="জরিপ রেকর্ডে অস্পষ্টতা বা বিরোধ থাকায় স্থানীয় ভূমি প্রশাসন সার্কেল অফিসে রেকর্ড পুঙ্খানুপুঙ্খ যাচাইয়ের জন্য রেফার করা হবে।"
          confirmText="এসিল্যান্ডে প্রেরণ করুন"
          cancelText="বাতিল"
          requireReason={true}
          reasonLabel="রেকর্ড সংক্রান্ত নির্দিষ্ট অস্পষ্টতা বা প্রশ্ন উল্লেখ করুন:"
          reasonPlaceholder="যেমন: খতিয়ান ১০১ এর সিএস ও আরএস সীমানা মিলছে না..."
          isLoading={isSubmitting}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {activeModal === 'NOC_NOTICE' && (
        <ConfirmDialog
          isOpen={true}
          variant="warning"
          title="ব্যাংক অনাপত্তি সনদ (NOC) দাখিলের ১৫ দিনের নোটিশ"
          description="আবেদনকারীকে বাণিজ্যিক ব্যাংকের মূল দায়মুক্তি বা অনাপত্তি সনদপত্র আগামী ১৫ কার্যদিবসের মধ্যে দাখিলের আনুষ্ঠানিক নির্দেশনা প্রদান করা হবে।"
          confirmText="নোটিশ জারি করুন"
          cancelText="বাতিল"
          requireReason={true}
          reasonLabel="নোটিশ প্রদানের মন্তব্য বা ডকেট রেফারেন্স লিখুন:"
          reasonPlaceholder="যেমন: ডেমো কমার্শিয়াল ব্যাংক পিএলসি এর লিয়েন রিলিজ আবশ্যক..."
          isLoading={isSubmitting}
          onClose={() => setActiveModal(null)}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  )
}
