import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { caseApi, orderApi, institutionApi, parcelApi } from '../api/client'
import { SEEDED_PARCEL_CATALOG } from '../data/bangladeshGeoData'

const STORAGE_KEY = 'landlock_court_records'

const INITIAL_PAIRS = [
  {
    caseId: 'c1000000-0000-0000-0000-000000000001',
    orderId: 'e1000000-0000-0000-0000-000000000001',
    caseNumber: 'OS-2024-00123',
    orderReference: 'ORD-DH-2024-991',
  },
  {
    caseId: 'c2000000-0000-0000-0000-000000000002',
    orderId: 'e2000000-0000-0000-0000-000000000002',
    caseNumber: 'MS-2024-00456',
    orderReference: 'ORD-DH-2024-992',
  },
]

function getStoredPairs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL_PAIRS
    const parsed = JSON.parse(raw)
    // ensure initial pairs are always included
    const existingIds = new Set(parsed.map((p) => p.orderId))
    const merged = [...parsed]
    for (const item of INITIAL_PAIRS) {
      if (!existingIds.has(item.orderId)) {
        merged.push(item)
      }
    }
    return merged
  } catch {
    return INITIAL_PAIRS
  }
}

export function useCourtWorkspace() {
  const queryClient = useQueryClient()
  const [pairs, setPairs] = useState(getStoredPairs)

  const savePairs = useCallback((newPairs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPairs))
      setPairs(newPairs)
    } catch {
      setPairs(newPairs)
    }
  }, [])

  // 1. Fetch Participating Institutions (specifically courts)
  const institutionsQuery = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const res = await institutionApi.getAll()
      return res.data?.data || []
    },
    staleTime: 60000,
  })

  // 2. Fetch live details for all registered cases and orders
  const ordersListQuery = useQuery({
    queryKey: ['court-orders-list', pairs],
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

            // Find linked parcel info
            let linkedParcel = null
            const primaryParcelId = caseFile?.parcelIds?.[0] || item.parcelId
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
            }

            return {
              id: order?.id || item.orderId,
              orderId: order?.id || item.orderId,
              caseId: caseFile?.id || item.caseId,
              orderReference: order?.orderReference || item.orderReference || 'N/A',
              caseNumber: caseFile?.caseNumber || item.caseNumber || 'N/A',
              orderType: order?.orderType || 'INJUNCTION',
              caseType: caseFile?.caseType || 'CIVIL_SUIT',
              orderDate: order?.orderDate || caseFile?.filingDate || 'N/A',
              effectiveFrom: order?.effectiveFrom || 'N/A',
              effectiveUntil: order?.effectiveUntil || null,
              transactionScope: order?.transactionScope || 'ALL',
              verificationStatus: order?.verificationStatus || 'PENDING',
              approvalStatus: order?.approvalStatus || 'DRAFT',
              approvedBy: order?.approvedBy || null,
              approvedAt: order?.approvedAt || null,
              createdBy: order?.createdBy || caseFile?.createdBy || null,
              createdAt: order?.createdAt || caseFile?.createdAt || null,
              sourceDocumentReference: order?.sourceDocumentReference || 'DOC-ORDER.pdf',
              restrictedSummary: caseFile?.restrictedSummary || '',
              caseStatus: caseFile?.caseStatus || 'ACTIVE',
              courtInstitutionId: caseFile?.courtInstitutionId || null,
              linkedParcel,
              parcelIds: caseFile?.parcelIds || (primaryParcelId ? [primaryParcelId] : []),
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

  // 3. Register a new Case & Order (with optional immediate submission)
  const registerOrderMutation = useMutation({
    mutationFn: async ({
      caseNumber,
      caseType,
      filingDate,
      courtInstitutionId,
      restrictedSummary,
      sourceReference,
      selectedParcel,
      orderReference,
      orderType,
      transactionScope,
      orderDate,
      effectiveFrom,
      effectiveUntil,
      sourceDocumentReference,
      submitImmediately = false,
    }) => {
      const initialParcelIds = selectedParcel?.id ? [selectedParcel.id] : []

      // Step A: Create Case
      const casePayload = {
        caseNumber,
        caseType,
        filingDate,
        courtInstitutionId: courtInstitutionId || undefined,
        restrictedSummary,
        sourceReference: sourceReference || `CASE-DOC-${Date.now()}`,
        initialParcelIds,
      }
      const caseRes = await caseApi.create(casePayload)
      const createdCase = caseRes.data?.data

      // Step B: Attach Parcel if specified and not linked
      if (selectedParcel?.id) {
        try {
          await caseApi.addParcel(createdCase.id, {
            parcelId: selectedParcel.id,
            scopeType: selectedParcel.scopeType || 'FULL_PARCEL',
            scopeArea: selectedParcel.scopeArea ? parseFloat(selectedParcel.scopeArea) : undefined,
            scopeShare: selectedParcel.scopeShare || '1.0',
          })
        } catch (e) {
          // If already linked via initialParcelIds, continue
          console.warn('Parcel link note:', e?.message)
        }
      }

      // Step C: Create Court Order
      const orderPayload = {
        caseId: createdCase.id,
        orderReference,
        orderType,
        orderDate,
        effectiveFrom,
        effectiveUntil: effectiveUntil || null,
        transactionScope: transactionScope || 'ALL',
        sourceDocumentReference: sourceDocumentReference || `DOC-${orderReference}.pdf`,
        supersedesOrderId: null,
      }
      const orderRes = await caseApi.addOrder(createdCase.id, orderPayload)
      let createdOrder = orderRes.data?.data

      // Step D: Submit immediately if requested
      if (submitImmediately && createdOrder?.id) {
        const subRes = await orderApi.submit(createdOrder.id)
        createdOrder = subRes.data?.data || createdOrder
      }

      // Step E: Persist to local registry
      const newPair = {
        caseId: createdCase.id,
        orderId: createdOrder.id,
        caseNumber: createdCase.caseNumber,
        orderReference: createdOrder.orderReference,
        parcelId: selectedParcel?.id,
      }
      const updatedPairs = [newPair, ...pairs]
      savePairs(updatedPairs)

      return { case: createdCase, order: createdOrder }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  // 4. Submit Order for approval
  const submitOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await orderApi.submit(orderId)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  // 5. Approve Order (segregation of duty enforced by backend)
  const approveOrderMutation = useMutation({
    mutationFn: async ({ orderId, reason }) => {
      const res = await orderApi.approve(orderId, reason)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  // 6. Reject Order
  const rejectOrderMutation = useMutation({
    mutationFn: async ({ orderId, reason }) => {
      const res = await orderApi.reject(orderId, reason)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  // 7. Release Order
  const releaseOrderMutation = useMutation({
    mutationFn: async ({ orderId, reason }) => {
      const res = await orderApi.release(orderId, reason)
      return res.data?.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['court-orders-list'] })
    },
  })

  return {
    orders: ordersListQuery.data || [],
    isLoading: ordersListQuery.isLoading,
    isRefetching: ordersListQuery.isRefetching,
    error: ordersListQuery.error,
    refetch: ordersListQuery.refetch,
    institutions: institutionsQuery.data || [],
    institutionsLoading: institutionsQuery.isLoading,
    registerOrder: registerOrderMutation.mutateAsync,
    isRegistering: registerOrderMutation.isPending,
    submitOrder: submitOrderMutation.mutateAsync,
    isSubmitting: submitOrderMutation.isPending,
    approveOrder: approveOrderMutation.mutateAsync,
    isApproving: approveOrderMutation.isPending,
    rejectOrder: rejectOrderMutation.mutateAsync,
    isRejecting: rejectOrderMutation.isPending,
    releaseOrder: releaseOrderMutation.mutateAsync,
    isReleasing: releaseOrderMutation.isPending,
  }
}
