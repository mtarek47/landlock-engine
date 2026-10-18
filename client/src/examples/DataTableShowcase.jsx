import { useState, useMemo } from 'react'
import {
  DataTable,
  TableToolbar,
  SearchField,
  FilterSelect,
  DateRangeFilter,
  StatusBadge,
  ConfirmDialog,
  DocumentAttachment,
  AccessibleTooltip,
  Button,
  toBengaliNumber,
} from '../components'
import {
  Scale,
  ClipboardCheck,
  BarChart3,
  FileText,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Plus,
  ShieldAlert,
} from 'lucide-react'

/**
 * ==============================================================================
 * EXAMPLE 1: Court Orders Table & Judicial Filters
 * Demonstrates: Search, Status Filter, Action Column, ConfirmDialog for Consequential Action
 * ==============================================================================
 */
export function CourtOrdersTableExample() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedOrderForAction, setSelectedOrderForAction] = useState(null)
  const [actionType, setActionType] = useState(null) // 'approve' | 'revoke'

  // Demonstrative records conforming to backend Order model
  const rawOrders = useMemo(
    () => [
      {
        id: 'ord-001',
        orderNumber: 'ORD-DH-2024-991',
        caseNumber: 'OS-2024-00123',
        courtName: 'বিজ্ঞ যুগ্ম জেলা জজ ১ম আদালত, ঢাকা',
        injunctionScope: 'হস্তান্তর ও সাফ-কবলা সম্পূর্ণ স্থগিত',
        effectiveFrom: '2024-03-15',
        status: 'ACTIVE',
        dagNumber: '৫০০১',
      },
      {
        id: 'ord-002',
        orderNumber: 'ORD-DH-2024-882',
        caseNumber: 'OS-2024-00155',
        courtName: 'বিজ্ঞ সিনিয়র সহকারী জজ আদালত, ধানমন্ডি',
        injunctionScope: 'সীমানা বিরোধ নিষ্পত্তি না হওয়া পর্যন্ত স্থিতিাবস্থা',
        effectiveFrom: '2024-05-10',
        status: 'PENDING_APPROVAL',
        dagNumber: '৬০১২',
      },
      {
        id: 'ord-003',
        orderNumber: 'ORD-DH-2024-773',
        caseNumber: 'OS-2023-00912',
        courtName: 'বিজ্ঞ জেলা ও দায়রা জজ আদালত, ঢাকা',
        injunctionScope: 'সম্পত্তি বণ্টনের মোকদ্দমা চলাকালীন নিষেধাজ্ঞা',
        effectiveFrom: '2023-11-01',
        status: 'AMENDED',
        dagNumber: '৭০২৩',
      },
      {
        id: 'ord-004',
        orderNumber: 'ORD-DH-2023-551',
        caseNumber: 'OS-2023-00441',
        courtName: 'বিজ্ঞ যুগ্ম জেলা জজ ২য় আদালত, ঢাকা',
        injunctionScope: 'সাময়িক স্থগিতাদেশ (পরবর্তী শুনানির তারিখ পর্যন্ত)',
        effectiveFrom: '2023-08-20',
        status: 'EXPIRED',
        dagNumber: '৫০১১',
      },
      {
        id: 'ord-005',
        orderNumber: 'ORD-DH-2024-102',
        caseNumber: 'OS-2024-00045',
        courtName: 'বিজ্ঞ সহকারী জজ ১ম আদালত, ঢাকা',
        injunctionScope: 'আপস নিষ্পত্তির প্রেক্ষিতে নিষেধাজ্ঞা অবমুক্ত',
        effectiveFrom: '2024-01-12',
        status: 'REVOKED',
        dagNumber: '৮০৩৪',
      },
    ],
    []
  )

  // Filter pipeline
  const filteredOrders = useMemo(() => {
    return rawOrders.filter((order) => {
      const matchSearch =
        !search ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.dagNumber.includes(search)
      const matchStatus = !statusFilter || order.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [rawOrders, search, statusFilter])

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredOrders.slice(start, start + pageSize)
  }, [filteredOrders, page, pageSize])

  const columns = [
    {
      key: 'orderNumber',
      header: 'আদেশ নম্বর',
      sortable: true,
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-gray-900 block">{val}</span>
          <span className="text-[11px] text-gray-500 font-mono">মোকা: {row.caseNumber}</span>
        </div>
      ),
    },
    {
      key: 'courtName',
      header: 'আদালতের নাম',
      render: (val) => <span className="font-medium text-gray-800">{val}</span>,
    },
    {
      key: 'dagNumber',
      header: 'দাগ নম্বর',
      align: 'center',
      render: (val) => <span className="font-sans font-bold text-govt-green">{val}</span>,
    },
    {
      key: 'injunctionScope',
      header: 'নিষেধাজ্ঞার পরিধি ও শর্ত',
      render: (val) => <span className="text-gray-700 line-clamp-1">{val}</span>,
    },
    {
      key: 'status',
      header: 'স্ট্যাটাস',
      align: 'center',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'actions',
      header: 'পদক্ষেপ',
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <AccessibleTooltip content="আদেশের বিস্তারিত ও নথি প্রদর্শন">
            <button
              type="button"
              className="p-1.5 rounded text-gray-500 hover:text-govt-green hover:bg-gray-100 transition-colors"
              aria-label="বিস্তারিত দেখুন"
            >
              <Eye size={15} />
            </button>
          </AccessibleTooltip>

          {row.status === 'PENDING_APPROVAL' && (
            <AccessibleTooltip content="বিচারিক অনুমোদন প্রদান">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForAction(row)
                  setActionType('approve')
                }}
                className="p-1.5 rounded text-emerald-700 hover:bg-emerald-50 transition-colors"
                aria-label="অনুমোদন করুন"
              >
                <CheckCircle size={15} />
              </button>
            </AccessibleTooltip>
          )}

          {row.status === 'ACTIVE' && (
            <AccessibleTooltip content="স্থগিতাদেশ প্রত্যাহার / বাতিল">
              <button
                type="button"
                onClick={() => {
                  setSelectedOrderForAction(row)
                  setActionType('revoke')
                }}
                className="p-1.5 rounded text-rose-700 hover:bg-rose-50 transition-colors"
                aria-label="আদেশ প্রত্যাহার"
              >
                <XCircle size={15} />
              </button>
            </AccessibleTooltip>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4 font-bangla">
      <TableToolbar
        searchSlot={
          <SearchField
            value={search}
            onChange={(val) => {
              setSearch(val)
              setPage(1)
            }}
            placeholder="আদেশ বা মোকা নং দিয়ে খুঁজুন..."
          />
        }
        filtersSlot={
          <FilterSelect
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val)
              setPage(1)
            }}
            allLabel="সকল আদেশ স্ট্যাটাস"
            options={[
              { value: 'ACTIVE', label: 'সক্রিয় (ACTIVE)' },
              { value: 'PENDING_APPROVAL', label: 'অনুমোদন অপেক্ষমাণ (PENDING)' },
              { value: 'AMENDED', label: 'সংশোধিত (AMENDED)' },
              { value: 'EXPIRED', label: 'মেয়াদোত্তীর্ণ (EXPIRED)' },
              { value: 'REVOKED', label: 'প্রত্যাহারকৃত (REVOKED)' },
            ]}
          />
        }
        activeFilters={[
          ...(statusFilter
            ? [{ key: 'status', label: `স্ট্যাটাস: ${statusFilter}`, onRemove: () => setStatusFilter('') }]
            : []),
          ...(search ? [{ key: 'search', label: `অনুসন্ধান: "${search}"`, onRemove: () => setSearch('') }] : []),
        ]}
        onResetFilters={() => {
          setSearch('')
          setStatusFilter('')
          setPage(1)
        }}
        totalRecords={filteredOrders.length}
        actionSlot={
          <Button variant="primary" size="sm" leftIcon={Plus} className="bg-govt-green hover:bg-govt-green-dark">
            নতুন আদেশ নিবন্ধন
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={paginatedOrders}
        pagination={{
          page,
          pageSize,
          totalRecords: filteredOrders.length,
          onPageChange: (p) => setPage(p),
          onPageSizeChange: (s) => {
            setPageSize(s)
            setPage(1)
          },
        }}
      />

      {/* Confirmation Dialog for Judicial Actions */}
      <ConfirmDialog
        isOpen={Boolean(selectedOrderForAction)}
        onClose={() => setSelectedOrderForAction(null)}
        title={
          actionType === 'approve'
            ? 'বিচারিক আদেশ অনুমোদন নিশ্চিতকরণ'
            : 'আদালতের স্থগিতাদেশ প্রত্যাহার / অবমুক্তি নিশ্চিতকরণ'
        }
        description={
          actionType === 'approve'
            ? `আপনি কি নিশ্চিতভাবে আদেশ "${selectedOrderForAction?.orderNumber}" অনুমোদন ও ডিজিটাল স্বাক্ষর প্রদান করতে চান? অনুমোদনের পর সংশ্লিষ্ট পার্সেল অবিলম্বে অবরুদ্ধ হবে।`
            : `আপনি কি নিশ্চিতভাবে আদেশ "${selectedOrderForAction?.orderNumber}" প্রত্যাহার করতে চান? এটি অবমুক্ত করার পর জমিতে নিবন্ধন নিষেধাজ্ঞা উঠে যাবে।`
        }
        confirmText={actionType === 'approve' ? 'হ্যাঁ, আদেশ অনুমোদন করুন' : 'হ্যাঁ, প্রত্যাহার নিশ্চিত করুন'}
        variant={actionType === 'approve' ? 'primary' : 'danger'}
        requireReason={actionType === 'revoke'}
        reasonLabel="আদেশ প্রত্যাহারের বিচারিক কারণ বা রায়ের রেফারেন্স লিখুন (বাধ্যতামূলক):"
        onConfirm={(reason) => {
          setSelectedOrderForAction(null)
        }}
      />
    </div>
  )
}

/**
 * ==============================================================================
 * EXAMPLE 2: Registry Gatekeeper Checks Table
 * Demonstrates: Real-time decision badges, parcel refs, and direct certificate navigation
 * ==============================================================================
 */
export function RegistryChecksTableExample() {
  const [search, setSearch] = useState('')
  const [decisionFilter, setDecisionFilter] = useState('')

  const rawChecks = useMemo(
    () => [
      {
        checkId: 'chk-reg-001',
        parcelId: 'b1000000-0000-0000-0000-000000000001',
        dagNumber: '৫০০১',
        khatianNumber: '১০১',
        mouza: 'ধানমন্ডি-০১',
        decision: 'BLOCKED_BY_VALID_ORDER',
        activeRestrictions: 1,
        activeMortgages: 1,
        checkedAt: '2024-06-15T10:30:00Z',
      },
      {
        checkId: 'chk-reg-002',
        parcelId: 'b2000000-0000-0000-0000-000000000002',
        dagNumber: '৬০০২',
        khatianNumber: '২০২',
        mouza: 'গুলশান-০২',
        decision: 'CLEAR',
        activeRestrictions: 0,
        activeMortgages: 0,
        checkedAt: '2024-06-15T11:15:00Z',
      },
      {
        checkId: 'chk-reg-003',
        parcelId: 'b3000000-0000-0000-0000-000000000003',
        dagNumber: '৭০০৩',
        khatianNumber: '৩০৩',
        mouza: 'মিরপুর-০১',
        decision: 'MORTGAGE_REQUIRES_RELEASE',
        activeRestrictions: 0,
        activeMortgages: 1,
        checkedAt: '2024-06-15T12:00:00Z',
      },
      {
        checkId: 'chk-reg-004',
        parcelId: 'b4000000-0000-0000-0000-000000000004',
        dagNumber: '৮০০৪',
        khatianNumber: '৪০৪',
        mouza: 'উত্তরা-০৩',
        decision: 'REVIEW_REQUIRED',
        activeRestrictions: 0,
        activeMortgages: 0,
        checkedAt: '2024-06-15T14:20:00Z',
      },
    ],
    []
  )

  const filteredChecks = useMemo(() => {
    return rawChecks.filter((c) => {
      const matchSearch =
        !search ||
        c.checkId.toLowerCase().includes(search.toLowerCase()) ||
        c.dagNumber.includes(search) ||
        c.mouza.includes(search)
      const matchDecision = !decisionFilter || c.decision === decisionFilter
      return matchSearch && matchDecision
    })
  }, [rawChecks, search, decisionFilter])

  const columns = [
    {
      key: 'checkId',
      header: 'যাচাই আইডি (Check ID)',
      render: (val) => <span className="font-mono text-gray-900 font-bold">{val}</span>,
    },
    {
      key: 'property',
      header: 'তফসিলভুক্ত জমি',
      render: (_, row) => (
        <div>
          <span className="font-bold text-gray-800">মৌজা: {row.mouza}</span>
          <span className="text-[11px] text-gray-500 block font-sans">
            দাগ নং: {row.dagNumber} | খতিয়ান: {row.khatianNumber}
          </span>
        </div>
      ),
    },
    {
      key: 'decision',
      header: 'গেটকিপার সিদ্ধান্ত',
      align: 'center',
      render: (val) => <StatusBadge decision={val} size="sm" />,
    },
    {
      key: 'restrictions',
      header: 'নিষেধাজ্ঞা / বন্ধক',
      align: 'center',
      render: (_, row) => (
        <div className="font-sans text-xs">
          <span className={row.activeRestrictions > 0 ? 'text-rose-700 font-bold' : 'text-gray-500'}>
            নিষেধাজ্ঞা: {toBengaliNumber(row.activeRestrictions)}
          </span>
          <span className="mx-1 text-gray-300">|</span>
          <span className={row.activeMortgages > 0 ? 'text-amber-700 font-bold' : 'text-gray-500'}>
            বন্ধক: {toBengaliNumber(row.activeMortgages)}
          </span>
        </div>
      ),
    },
    {
      key: 'checkedAt',
      header: 'যাচাই সময়কাল (BST)',
      render: (val) => (
        <span className="text-gray-600 font-sans text-[11px]">
          {new Date(val).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4 font-bangla">
      <TableToolbar
        searchSlot={
          <SearchField
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder="দাগ বা চেক আইডি খুঁজুন..."
          />
        }
        filtersSlot={
          <FilterSelect
            value={decisionFilter}
            onChange={(val) => setDecisionFilter(val)}
            allLabel="সকল গেটকিপার সিদ্ধান্ত"
            options={[
              { value: 'CLEAR', label: 'ক্লিয়ার (CLEAR)' },
              { value: 'BLOCKED_BY_VALID_ORDER', label: 'আদালতের আদেশে অবরুদ্ধ' },
              { value: 'MORTGAGE_REQUIRES_RELEASE', label: 'ব্যাংক বন্ধক বিদ্যমান' },
              { value: 'REVIEW_REQUIRED', label: 'পর্যালোচনা আবশ্যক' },
            ]}
          />
        }
        totalRecords={filteredChecks.length}
      />

      <DataTable columns={columns} data={filteredChecks} />
    </div>
  )
}

/**
 * ==============================================================================
 * EXAMPLE 3: Audit Trail Events Table
 * Demonstrates: Date Range Filtering, Actor IDs, Trace IDs, and Read-Only Immutable Presentation
 * ==============================================================================
 */
export function AuditEventsTableExample() {
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' })

  const rawAuditEvents = useMemo(
    () => [
      {
        id: 'aud-001',
        traceId: 'trc-99a-88b-11',
        timestamp: '2024-06-15T09:12:45Z',
        actor: 'court_officer1',
        role: 'COURT_OFFICER',
        action: 'ORDER_SUBMITTED',
        resource: 'ORD-DH-2024-991',
        result: 'SUCCESS',
      },
      {
        id: 'aud-002',
        traceId: 'trc-77c-22d-33',
        timestamp: '2024-06-15T09:45:10Z',
        actor: 'order_approver1',
        role: 'ORDER_APPROVER',
        action: 'ORDER_APPROVED',
        resource: 'ORD-DH-2024-991',
        result: 'SUCCESS',
      },
      {
        id: 'aud-003',
        traceId: 'trc-44e-55f-66',
        timestamp: '2024-06-15T10:30:12Z',
        actor: 'registry_officer1',
        role: 'REGISTRY_OFFICER',
        action: 'REGISTRY_CHECK',
        resource: 'PARCEL-5001',
        result: 'BLOCKED_GATEKEEPER',
      },
      {
        id: 'aud-004',
        traceId: 'trc-11g-88h-99',
        timestamp: '2024-06-15T11:20:05Z',
        actor: 'bank_officer1',
        role: 'BANK_OFFICER',
        action: 'MORTGAGE_REGISTERED',
        resource: 'MORT-DB-2024-001',
        result: 'SUCCESS',
      },
    ],
    []
  )

  const columns = [
    {
      key: 'timestamp',
      header: 'সময় (BST / UTC+6)',
      render: (val) => (
        <span className="font-mono text-gray-700 text-xs">
          {new Date(val).toLocaleTimeString('bn-BD', { timeZone: 'Asia/Dhaka' })}{' '}
          <span className="text-[10px] text-gray-400 block">{new Date(val).toLocaleDateString('bn-BD')}</span>
        </span>
      ),
    },
    {
      key: 'actor',
      header: 'কর্তা ও ভূমিকা',
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-gray-900 block">{val}</span>
          <span className="text-[10px] font-sans px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
            {row.role}
          </span>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'সম্পন্ন কার্যক্রম',
      render: (val) => <span className="font-mono text-gray-800 text-xs font-semibold">{val}</span>,
    },
    {
      key: 'resource',
      header: 'সম্পর্কিত রিসোর্স',
      render: (val) => <span className="font-mono text-govt-green font-bold text-xs">{val}</span>,
    },
    {
      key: 'result',
      header: 'ফলাফল',
      align: 'center',
      render: (val) => (
        <span
          className={`font-sans text-[11px] font-bold px-2 py-0.5 rounded border ${
            val === 'SUCCESS'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: 'traceId',
      header: 'ট্রেস আইডি (Trace ID)',
      align: 'right',
      render: (val) => <span className="font-mono text-gray-400 text-[11px]">{val}</span>,
    },
  ]

  return (
    <div className="space-y-4 font-bangla">
      <TableToolbar
        searchSlot={
          <SearchField
            value={search}
            onChange={(val) => setSearch(val)}
            placeholder="ট্রেস আইডি বা কর্তা খুঁজুন..."
          />
        }
        filtersSlot={
          <DateRangeFilter
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={(range) => setDateRange(range)}
          />
        }
        totalRecords={rawAuditEvents.length}
      />

      <DataTable columns={columns} data={rawAuditEvents} />
    </div>
  )
}
