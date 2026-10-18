import { useState, useMemo } from 'react'
import Layout from '../components/Layout'
import PageHeader from '../components/design-system/PageHeader'
import LoadingState from '../components/design-system/LoadingState'
import ErrorState from '../components/design-system/ErrorState'
import { useAuth } from '../context/AuthContext'
import { useOrderApprovals } from '../hooks/useOrderApprovals'
import ApprovalQueueFilters from '../components/approval/ApprovalQueueFilters'
import ApprovalQueueTable from '../components/approval/ApprovalQueueTable'
import JudicialReviewDossier from '../components/approval/JudicialReviewDossier'
import {
  ApproveConfirmationModal,
  RejectConfirmationModal,
  ReturnForCorrectionModal,
} from '../components/approval/ApprovalActionModals'
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Building,
} from 'lucide-react'
import { toBengaliNumber } from '../components/design-system/constants'

export default function OrderApprovalPage() {
  const { user } = useAuth()
  const {
    orders,
    isLoading,
    isRefetching,
    error,
    refetch,
    institutions,
    approveOrder,
    isApproving,
    rejectOrder,
    isRejecting,
    returnForCorrection,
    isReturning,
  } = useOrderApprovals()

  // Selected order state
  const [selectedOrderId, setSelectedOrderId] = useState(null)

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [courtFilter, setCourtFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('ALL')
  const [urgencyFilter, setUrgencyFilter] = useState('ALL')
  const [workflowFilter, setWorkflowFilter] = useState('PENDING_ONLY')

  // Modals state
  const [approvingOrderId, setApprovingOrderId] = useState(null)
  const [rejectingOrderId, setRejectingOrderId] = useState(null)
  const [returningOrderId, setReturningOrderId] = useState(null)

  // Feedback banner state
  const [alert, setAlert] = useState({ text: '', type: '' })

  const showAlert = (text, type = 'success') => {
    setAlert({ text, type })
    setTimeout(() => {
      setAlert((prev) => (prev.text === text ? { text: '', type: '' } : prev))
    }, 8000)
  }

  // Filter evaluation
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Workflow state
      if (workflowFilter === 'PENDING_ONLY') {
        if (
          order.approvalStatus !== 'SUBMITTED' &&
          order.approvalStatus !== 'UNDER_REVIEW' &&
          order.approvalStatus !== 'PENDING_APPROVAL' &&
          order.approvalStatus !== 'DRAFT' &&
          order.approvalStatus !== 'PENDING'
        ) {
          return false
        }
      } else if (workflowFilter === 'APPROVED') {
        if (order.approvalStatus !== 'APPROVED' && order.approvalStatus !== 'ACTIVE') {
          return false
        }
      }

      // 2. Court filter
      if (courtFilter !== 'ALL') {
        if (order.courtInstitutionId !== courtFilter) {
          return false
        }
      }

      // 3. Order type filter
      if (typeFilter !== 'ALL') {
        if (order.orderType !== typeFilter) {
          return false
        }
      }

      // 4. Urgency filter
      if (urgencyFilter !== 'ALL') {
        if (order.urgency !== urgencyFilter) {
          return false
        }
      }

      // 5. Date filter
      if (dateFilter !== 'ALL') {
        const orderDateStr = order.orderDate || '2024-02-15'
        const orderDate = new Date(orderDateStr)
        const now = new Date()
        if (dateFilter === 'TODAY') {
          if (orderDate.toDateString() !== now.toDateString()) return false
        } else if (dateFilter === 'LAST_7_DAYS') {
          const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (orderDate < sevenDaysAgo) return false
        } else if (dateFilter === 'LAST_30_DAYS') {
          const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (orderDate < thirtyDaysAgo) return false
        }
      }

      // 6. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchRef = order.orderReference?.toLowerCase().includes(q)
        const matchCase = order.caseNumber?.toLowerCase().includes(q)
        const matchOfficer = order.submittingOfficer?.toLowerCase().includes(q)
        const matchDag = String(order.linkedParcel?.dagNumber || '').includes(q)
        const matchKhatian = String(order.linkedParcel?.khatianNumber || '').includes(q)
        if (!matchRef && !matchCase && !matchOfficer && !matchDag && !matchKhatian) {
          return false
        }
      }

      return true
    })
  }, [orders, workflowFilter, courtFilter, typeFilter, urgencyFilter, dateFilter, searchQuery])

  // Select active order
  const effectiveSelectedOrderId = selectedOrderId || filteredOrders[0]?.id || orders[0]?.id
  const selectedOrder = useMemo(() => {
    return orders.find((o) => o.id === effectiveSelectedOrderId) || filteredOrders[0] || null
  }, [orders, effectiveSelectedOrderId, filteredOrders])

  // Metrics counters
  const metrics = useMemo(() => {
    const total = orders.length
    const pending = orders.filter(
      (o) =>
        o.approvalStatus === 'SUBMITTED' ||
        o.approvalStatus === 'UNDER_REVIEW' ||
        o.approvalStatus === 'PENDING_APPROVAL' ||
        o.approvalStatus === 'DRAFT' ||
        o.approvalStatus === 'PENDING'
    ).length
    const urgent = orders.filter((o) => o.urgency === 'URGENT').length
    const approved = orders.filter(
      (o) => o.approvalStatus === 'APPROVED' || o.approvalStatus === 'ACTIVE'
    ).length
    return { total, pending, urgent, approved }
  }, [orders])

  // Action handlers
  const handleConfirmApprove = async (reason) => {
    if (!approvingOrderId) return
    try {
      const res = await approveOrder({ orderId: approvingOrderId, reason })
      setApprovingOrderId(null)
      showAlert(
        `আদেশ নম্বর '${selectedOrder?.orderReference}' বিজ্ঞ বিচারক কর্তৃক চূড়ান্ত অনুমোদিত হয়েছে এবং জাতীয় ভূমি রেজিস্ট্রিতে সক্রিয় নিষেধাজ্ঞা কার্যকর করা হয়েছে!`,
        'success'
      )
    } catch (err) {
      showAlert(
        err.response?.data?.message ||
          'আদেশ অনুমোদন ব্যর্থ হয়েছে। (লক্ষ্য করুন: স্বার্থের দ্বন্দ্ব নীতি অনুযায়ী আদেশ প্রস্তুতকারী নিজে তা অনুমোদন করতে পারবেন না)',
        'error'
      )
    }
  }

  const handleConfirmReject = async (reason) => {
    if (!rejectingOrderId) return
    try {
      await rejectOrder({ orderId: rejectingOrderId, reason })
      setRejectingOrderId(null)
      showAlert(
        `আদেশ নম্বর '${selectedOrder?.orderReference}' যথাযথ কারণ দর্শিয়ে প্রত্যাখ্যান করা হয়েছে।`,
        'success'
      )
    } catch (err) {
      showAlert(
        err.response?.data?.message || 'আদেশ প্রত্যাখ্যান ব্যর্থ হয়েছে।',
        'error'
      )
    }
  }

  const handleConfirmReturn = async (instructions) => {
    if (!returningOrderId) return
    try {
      await returnForCorrection({ orderId: returningOrderId, instructions })
      setReturningOrderId(null)
      showAlert(
        `আদেশ নম্বর '${selectedOrder?.orderReference}' প্রয়োজনীয় সংশোধনের নির্দেশনাসহ ফেরত পাঠানো হয়েছে।`,
        'success'
      )
    } catch (err) {
      showAlert(
        err.response?.data?.message || 'সংশোধনের জন্য ফেরত পাঠানো ব্যর্থ হয়েছে।',
        'error'
      )
    }
  }

  return (
    <Layout>
      <div className="space-y-6 font-bangla">
        {/* Page Header */}
        <PageHeader
          breadcrumbs={[
            { label: 'হোম', to: '/dashboard' },
            { label: 'বিচারিক আদেশ অনুমোদন' },
          ]}
          title="বিচারিক আদেশ অনুমোদন ও পর্যালোচনা (Order Approval)"
          subtitle="বিজ্ঞ বিচারক ও অনুমোদিত আদেশ অনুমোদনকারীদের বিচারিক পর্যালোচনা ডকেট — স্থগিতাদেশ অনুমোদন, আইনি সংঘর্ষ নিরীক্ষা এবং রেজিস্ট্রি লক কার্যকরীকরণ সেল।"
          badge={
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-govt-green border border-green-200">
              <Scale size={13} className="text-govt-green" />
              <span>বিচারিক অনুমোদন অধিক্ষেত্র</span>
            </span>
          }
          actions={
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-govt-border hover:bg-gray-100 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={isRefetching ? 'animate-spin text-govt-green' : ''} />
              <span>কিউ রিফ্রেশ</span>
            </button>
          }
        />

        {/* Global Feedback Banner */}
        {alert.text && (
          <div
            role="alert"
            className={`p-4 rounded-lg text-xs sm:text-sm border flex items-start justify-between gap-3 animate-in fade-in duration-150 ${
              alert.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {alert.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={18} className="text-red-700 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{alert.text}</div>
            </div>
            <button
              type="button"
              onClick={() => setAlert({ text: '', type: '' })}
              className="text-gray-400 hover:text-gray-700 p-0.5 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="card p-3.5 bg-white border border-govt-border rounded-lg shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>অপেক্ষমাণ আদেশ কিউ</span>
              <Clock size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold font-sans text-blue-900 mt-2">
              {toBengaliNumber(metrics.pending)}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">বিচারকের স্বাক্ষরের অপেক্ষায়</p>
          </div>

          <div className="card p-3.5 bg-white border border-govt-border rounded-lg shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>জরুরি পর্যালোচনা (Urgent)</span>
              <AlertTriangle size={16} className="text-red-600" />
            </div>
            <div className="text-2xl font-bold font-sans text-red-700 mt-2">
              {toBengaliNumber(metrics.urgent)}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">তাৎক্ষণিক সিদ্ধান্ত আবশ্যক</p>
          </div>

          <div className="card p-3.5 bg-white border border-govt-border rounded-lg shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>অনুমোদিত ও বলবৎ</span>
              <CheckCircle2 size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold font-sans text-emerald-800 mt-2">
              {toBengaliNumber(metrics.approved)}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">রেজিস্ট্রিতে লক আরোপিত</p>
          </div>

          <div className="card p-3.5 bg-white border border-govt-border rounded-lg shadow-2xs">
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
              <span>সর্বমোট তালিকাভুক্ত আদেশ</span>
              <Scale size={16} className="text-gray-600" />
            </div>
            <div className="text-2xl font-bold font-sans text-gray-900 mt-2">
              {toBengaliNumber(metrics.total)}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">দেওয়ানি ও বিচারিক ডকেট</p>
          </div>
        </div>

        {/* Filter Controls */}
        <ApprovalQueueFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          courtFilter={courtFilter}
          onCourtChange={setCourtFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          urgencyFilter={urgencyFilter}
          onUrgencyChange={setUrgencyFilter}
          workflowFilter={workflowFilter}
          onWorkflowChange={setWorkflowFilter}
          onReset={() => {
            setSearchQuery('')
            setCourtFilter('ALL')
            setTypeFilter('ALL')
            setDateFilter('ALL')
            setUrgencyFilter('ALL')
            setWorkflowFilter('PENDING_ONLY')
          }}
          institutions={institutions}
          totalCount={orders.length}
          filteredCount={filteredOrders.length}
        />

        {/* Loading / Error / Main Review View */}
        {isLoading ? (
          <LoadingState text="অনুমোদন কিউ ও বিচারিক ডকেটের তথ্য লোড হচ্ছে..." />
        ) : error ? (
          <ErrorState
            title="ডকেট কিউ লোড করতে ব্যর্থ হয়েছে"
            message={error.message || 'সার্ভার সংযোগে সাময়িক বিঘ্ন ঘটেছে।'}
            onRetry={refetch}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Queue Table */}
            <div className="lg:col-span-5 xl:col-span-5">
              <ApprovalQueueTable
                orders={filteredOrders}
                selectedOrderId={effectiveSelectedOrderId}
                onSelectOrder={(id) => setSelectedOrderId(id)}
              />
            </div>

            {/* Right: Detailed Judicial Review Dossier */}
            <div className="lg:col-span-7 xl:col-span-7 sticky top-4">
              <JudicialReviewDossier
                order={selectedOrder}
                institutions={institutions}
                onApproveClick={(orderId) => setApprovingOrderId(orderId)}
                onRejectClick={(orderId) => setRejectingOrderId(orderId)}
                onReturnClick={(orderId) => setReturningOrderId(orderId)}
              />
            </div>
          </div>
        )}

        {/* Consequential Action Modals */}
        <ApproveConfirmationModal
          isOpen={!!approvingOrderId}
          onClose={() => setApprovingOrderId(null)}
          onConfirm={handleConfirmApprove}
          orderReference={selectedOrder?.orderReference}
          caseNumber={selectedOrder?.caseNumber}
          isLoading={isApproving}
        />

        <RejectConfirmationModal
          isOpen={!!rejectingOrderId}
          onClose={() => setRejectingOrderId(null)}
          onConfirm={handleConfirmReject}
          orderReference={selectedOrder?.orderReference}
          caseNumber={selectedOrder?.caseNumber}
          isLoading={isRejecting}
        />

        <ReturnForCorrectionModal
          isOpen={!!returningOrderId}
          onClose={() => setReturningOrderId(null)}
          onConfirm={handleConfirmReturn}
          orderReference={selectedOrder?.orderReference}
          caseNumber={selectedOrder?.caseNumber}
          isLoading={isReturning}
        />
      </div>
    </Layout>
  )
}
