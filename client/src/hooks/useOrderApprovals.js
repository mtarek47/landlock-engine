import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { caseApi, orderApi, institutionApi, parcelApi, restrictionApi } from '../api/client'
import { SEEDED_PARCEL_CATALOG } from '../data/bangladeshGeoData'

const STORAGE_KEY = 'landlock_court_records'

const INITIAL_QUEUE_PAIRS = [
  {
    caseId: 'c2000000-0000-0000-0000-000000000002',
    orderId: 'e2000000-0000-0000-0000-000000000002',
    caseNumber: 'MS-2024-00456',
    orderReference: 'ORD-DH-2024-992',
    urgency: 'URGENT',
    submittingOfficerName: 'Court Clerk Tariq',
    parcelId: 'b2000000-0000-0000-0000-000000000002',
  },
  {
    caseId: '6f779d58-3616-432c-b0f6-891433e09f43',
    orderId: 'c62522e6-f7af-43c0-b867-a71f7fe79fec',
    caseNumber: 'TS-2024-00890',
    orderReference: 'ORD-DH-2024-993',
    urgency: 'PRIORITY',
    submittingOfficerName: 'Court Clerk Tariq',
    parcelId: 'b3000000-0000-0000-0000-000000000003',
  },
  {
    caseId: 'c1000000-0000-0000-0000-000000000001',
    orderId: 'e1000000-0000-0000-0000-000000000001',
    caseNumber: 'OS-2024-00123',
    orderReference: 'ORD-DH-2024-991',
    urgency: 'NORMAL',
    submittingOfficerName: 'Court Clerk Tariq',
    parcelId: 'b1000000-0000-0000-0000-000000000001',
  },
  {
    caseId: '9fb27b04-0fad-4f91-8bab-6835bedcde30',
    orderId: '3e6dd7a8-57fd-4bf5-88bf-215dcd71574b',
    caseNumber: 'OS-2025-TEST01',
    orderReference: 'ORD-DH-2025-TEST01',
    urgency: 'NORMAL',
    submittingOfficerName: 'Court Clerk Tariq',
    parcelId: 'b1000000-0000-0000-0000-000000000001',
  },
]

function getStoredPairs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_QUEUE_PAIRS
    const parsed = JSON.parse(raw)
    const initMap = new Map(INITIAL_QUEUE_PAIRS.map((p) => [p.orderId, p]))
    const merged = parsed.map((item) => {
      const match = initMap.get(item.orderId)
      return {
        ...match,
        ...item,
        parcelId: item.parcelId || match?.parcelId,
      }
    })
    for (const item of INITIAL_QUEUE_PAIRS) {
      if (!merged.some((p) => p.orderId === item.orderId)) {
        merged.push(item)
      }
    }
    return merged
  } catch {
    return INITIAL_QUEUE_PAIRS
  }
}

export function useOrderApprovals() {
  const queryClient = useQueryClient()
  const [pairs] = useState(getStoredPairs)

  // 1. Fetch participating courts/institutions
  const institutionsQuery = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const res = await institutionApi.getAll()
      return res.data?.data || []
    },
    staleTime: 60000,
  })

  // 2. Fetch full queue data for all orders
  const queueQuery = useQuery({
    queryKey: ['order-approvals-queue', pairs],
    queryFn: async () => {
      const results = await Promise.all(
        pairs.map(async (item) => {
          try {
            const [orderRes, caseRes] = await Promise.allSettled([
              orderApi.getById(item.orderId),
              caseApi.getById(item.caseId),
            ])

            const order = orderRes.status === 'fulfilled' ? orderRes.value?.data?.data : null
            const caseFile = caseRes.status === 'fulfilled' ? caseRes.value?.data?.data : null

            if (!order && !caseFile) return null

            const primaryParcelId =
              order?.parcelId ||
              caseFile?.parcelIds?.[0] ||
              item.parcelId ||
              (item.caseNumber === 'MS-2024-00456' || item.orderReference === 'ORD-DH-2024-992'
                ? 'b2000000-0000-0000-0000-000000000002'
                : item.caseNumber === 'TS-2024-00890' || item.orderReference === 'ORD-DH-2024-993'
                ? 'b3000000-0000-0000-0000-000000000003'
                : 'b1000000-0000-0000-0000-000000000001')
            let linkedParcel = null
            let publicStatus = null
            let existingRestrictions = []

            if (primaryParcelId) {
              const catalogMatch = SEEDED_PARCEL_CATALOG.find((p) => p.id === primaryParcelId)
              if (catalogMatch) {
                linkedParcel = catalogMatch
              } else {
                try {
                  const pRes = await parcelApi.getById(primaryParcelId)
                  linkedParcel = pRes.data?.data
                } catch {
                  linkedParcel = { id: primaryParcelId }
                }
              }

              // Check public status and existing restrictions for scope conflict analysis
              try {
                const [statusRes, restrRes] = await Promise.allSettled([
                  parcelApi.publicStatus(primaryParcelId),
                  restrictionApi.getByParcel(primaryParcelId),
                ])
                if (statusRes.status === 'fulfilled') {
                  publicStatus = statusRes.value?.data?.data
                }
                if (restrRes.status === 'fulfilled') {
                  existingRestrictions = restrRes.value?.data?.data || []
                }
              } catch {
                // ignore
              }
            }

            // Derive submitting officer display
            let submittingOfficer = item.submittingOfficerName || 'Court Clerk Tariq'
            if (order?.createdBy === 'a1000000-0000-0000-0000-000000000001') {
              submittingOfficer = 'Court Clerk Tariq (আদালত কর্মকর্তা)'
            } else if (order?.createdBy) {
              submittingOfficer = `কর্মকর্তা আইডি: ${order.createdBy.substring(0, 8)}...`
            }

            // Submission timestamp: order createdAt or orderDate
            const submissionTimestamp = order?.createdAt || `${order?.orderDate || '2024-02-15'}T10:30:00Z`

            // Conflicts analysis
            const conflicts = []
            if (publicStatus?.hasActiveMortgage) {
              conflicts.push({
                type: 'MORTGAGE_LIEN',
                title: 'সক্রিয় ব্যাংক বন্ধক বিদ্যমান',
                severity: 'warning',
                description: 'উক্ত পার্সেলে বাণিজ্যিক ব্যাংকের অনুকূলে সক্রিয় বন্ধক ও দায় রেকর্ড রয়েছে।',
              })
            }
            if (existingRestrictions.length > 0) {
              const otherRestrictions = existingRestrictions.filter((r) => r.courtOrderId !== order?.id)
              if (otherRestrictions.length > 0) {
                conflicts.push({
                  type: 'CONCURRENT_ORDER',
                  title: 'পূর্ববর্তী বিচারিক নিষেধাজ্ঞা কার্যকর',
                  severity: 'high',
                  description: `উক্ত জমিতে ইতোমধ্যে অন্য মোকদ্দমায় (${otherRestrictions[0].sourceReference || 'আদালতের আদেশ'}) নিষেধাজ্ঞা বলবৎ রয়েছে।`,
                })
              }
            }

            return {
              id: order?.id || item.orderId,
              orderId: order?.id || item.orderId,
              caseId: caseFile?.id || item.caseId,
              orderReference: order?.orderReference || item.orderReference || 'N/A',
              caseNumber: caseFile?.caseNumber || item.caseNumber || 'N/A',
              orderType: order?.orderType || 'INJUNCTION',
              caseType: caseFile?.caseType || 'CIVIL_SUIT',
              orderDate: order?.orderDate || '2024-02-15',
              effectiveFrom: order?.effectiveFrom || '2024-02-15',
              effectiveUntil: order?.effectiveUntil || null,
              transactionScope: order?.transactionScope || 'ALL',
              verificationStatus: order?.verificationStatus || 'PENDING',
              approvalStatus: order?.approvalStatus || 'SUBMITTED',
              approvedBy: order?.approvedBy || null,
              approvedAt: order?.approvedAt || null,
              createdBy: order?.createdBy || 'a1000000-0000-0000-0000-000000000001',
              createdAt: order?.createdAt || null,
              sourceDocumentReference: order?.sourceDocumentReference || 'DOC-ORDER.pdf',
              restrictedSummary: caseFile?.restrictedSummary || '',
              caseStatus: caseFile?.caseStatus || 'ACTIVE',
              courtInstitutionId: caseFile?.courtInstitutionId || '10000000-0000-0000-0000-000000000001',
              submittingOfficer,
              submissionTimestamp,
              urgency: item.urgency || 'NORMAL',
              parcelId: primaryParcelId,
              linkedParcel,
              publicStatus,
              conflicts,
              rawOrder: order,
              rawCase: caseFile,
            }
          } catch {
            return null
          }
        })
      )

      return results.filter(Boolean)
    },
    staleTime: 10000,
  })

  // 3. Approve Order Mutation
  const approveMutation = useMutation({
    mutationFn: async ({ orderId, reason }) => {
      const res = await orderApi.approve(orderId, reason)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-approvals-queue'] })
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  // 4. Reject Order Mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ orderId, reason }) => {
      const res = await orderApi.reject(orderId, reason)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-approvals-queue'] })
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  // 5. Return for Correction / Amend Order Mutation
  const returnForCorrectionMutation = useMutation({
    mutationFn: async ({ orderId, instructions }) => {
      // In the backend, amend/reject can record the note or reject with reason
      const res = await orderApi.reject(orderId, `সংশোধনের জন্য ফেরত: ${instructions}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-approvals-queue'] })
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  return {
    orders: queueQuery.data || [],
    isLoading: queueQuery.isLoading,
    isRefetching: queueQuery.isRefetching,
    error: queueQuery.error,
    refetch: queueQuery.refetch,
    institutions: institutionsQuery.data || [],
    institutionsLoading: institutionsQuery.isLoading,

    approveOrder: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,

    rejectOrder: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,

    returnForCorrection: returnForCorrectionMutation.mutateAsync,
    isReturning: returnForCorrectionMutation.isPending,
  }
}
