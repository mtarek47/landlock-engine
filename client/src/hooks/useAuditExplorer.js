import { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { auditApi } from '../api/client'

export function useAuditExplorer() {
  const [searchParams, setSearchParams] = useSearchParams()

  // Read URL search params
  const pageParam = parseInt(searchParams.get('page') || '1', 10)
  const page = Math.max(0, pageParam - 1) // 0-indexed for Spring Data
  const size = parseInt(searchParams.get('size') || '20', 10)
  const actionFilter = searchParams.get('action') || 'ALL'
  const entityTypeFilter = searchParams.get('entityType') || 'ALL'
  const actorFilter = searchParams.get('actor') || 'ALL'
  const resultFilter = searchParams.get('result') || 'ALL'
  const traceIdFilter = searchParams.get('traceId') || ''
  const searchFilter = searchParams.get('q') || ''
  const startDateFilter = searchParams.get('startDate') || ''
  const endDateFilter = searchParams.get('endDate') || ''

  // Fetch paginated events from backend via TanStack Query v5
  const {
    data: auditPageData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['audit-events', page, size],
    queryFn: async () => {
      const res = await auditApi.getEvents({ page, size })
      return res.data?.data
    },
    staleTime: 10000,
    keepPreviousData: true,
  })

  const rawEvents = useMemo(() => {
    if (!auditPageData) return []
    if (auditPageData.content && Array.isArray(auditPageData.content)) {
      return auditPageData.content
    }
    if (Array.isArray(auditPageData)) {
      return auditPageData
    }
    return []
  }, [auditPageData])

  const totalElements = auditPageData?.totalElements ?? rawEvents.length
  const totalPages = auditPageData?.totalPages ?? Math.max(1, Math.ceil(totalElements / size))
  const serverPageNumber = auditPageData?.number ?? page

  // Calculate server-derived summary metrics
  const metrics = useMemo(() => {
    let registryChecks = 0
    let courtOrders = 0
    let mortgageEvents = 0
    let parcelEvents = 0
    let blockedDecisions = 0
    let clearDecisions = 0

    rawEvents.forEach((ev) => {
      const act = ev.action || ''
      const reason = ev.reason || ''
      const change = ev.changeSummary || ''

      if (act.includes('REGISTRY_CHECK')) {
        registryChecks++
        if (reason.includes('BLOCKED') || change.includes('BLOCKED')) {
          blockedDecisions++
        } else if (reason.includes('CLEAR') || change.includes('CLEAR')) {
          clearDecisions++
        }
      } else if (act.includes('ORDER') || act.includes('CASE') || act.includes('RESTRICTION')) {
        courtOrders++
      } else if (act.includes('MORTGAGE')) {
        mortgageEvents++
      } else if (act.includes('PARCEL')) {
        parcelEvents++
      }
    })

    return {
      totalRecorded: totalElements,
      pageCount: rawEvents.length,
      registryChecks,
      courtOrders,
      mortgageEvents,
      parcelEvents,
      blockedDecisions,
      clearDecisions,
    }
  }, [rawEvents, totalElements])

  // Filter the current view according to active criteria
  const filteredEvents = useMemo(() => {
    return rawEvents.filter((item) => {
      // Action filter
      if (actionFilter !== 'ALL' && item.action !== actionFilter) {
        return false
      }

      // Entity Type filter
      if (entityTypeFilter !== 'ALL' && item.entityType !== entityTypeFilter) {
        return false
      }

      // Actor User ID filter
      if (actorFilter !== 'ALL' && item.actorUserId !== actorFilter) {
        return false
      }

      // Trace ID / Correlation ID filter
      if (traceIdFilter.trim()) {
        const tid = traceIdFilter.toLowerCase().trim()
        if (!item.correlationId?.toLowerCase().includes(tid)) {
          return false
        }
      }

      // Result filter
      if (resultFilter !== 'ALL') {
        const text = `${item.reason || ''} ${item.changeSummary || ''}`.toUpperCase()
        if (resultFilter === 'BLOCKED_BY_VALID_ORDER' && !text.includes('BLOCKED_BY_VALID_ORDER')) {
          return false
        }
        if (resultFilter === 'CLEAR' && !text.includes('CLEAR')) {
          return false
        }
        if (resultFilter === 'MORTGAGE_REQUIRES_RELEASE' && !text.includes('MORTGAGE_REQUIRES_RELEASE')) {
          return false
        }
        if (resultFilter === 'REVIEW_REQUIRED' && !text.includes('REVIEW_REQUIRED')) {
          return false
        }
      }

      // Date range filter
      if (startDateFilter && item.occurredAt) {
        const itemDate = new Date(item.occurredAt).toISOString().slice(0, 10)
        if (itemDate < startDateFilter) return false
      }
      if (endDateFilter && item.occurredAt) {
        const itemDate = new Date(item.occurredAt).toISOString().slice(0, 10)
        if (itemDate > endDateFilter) return false
      }

      // Free text query (correlationId, entityId, changeSummary, reason)
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim()
        const matchesAction = item.action?.toLowerCase().includes(q)
        const matchesEntity = item.entityType?.toLowerCase().includes(q)
        const matchesEntityId = item.entityId?.toLowerCase().includes(q)
        const matchesTrace = item.correlationId?.toLowerCase().includes(q)
        const matchesReason = item.reason?.toLowerCase().includes(q)
        const matchesSummary = item.changeSummary?.toLowerCase().includes(q)

        if (
          !matchesAction &&
          !matchesEntity &&
          !matchesEntityId &&
          !matchesTrace &&
          !matchesReason &&
          !matchesSummary
        ) {
          return false
        }
      }

      return true
    })
  }, [
    rawEvents,
    actionFilter,
    entityTypeFilter,
    actorFilter,
    traceIdFilter,
    resultFilter,
    startDateFilter,
    endDateFilter,
    searchFilter,
  ])

  // Update a single filter in URL search params
  const setFilter = useCallback(
    (key, value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (!value || value === 'ALL') {
            next.delete(key)
          } else {
            next.set(key, value)
          }
          // Reset to page 1 on filter changes unless changing page
          if (key !== 'page') {
            next.set('page', '1')
          }
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  // Batch update filters
  const setFilters = useCallback(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(updates).forEach(([key, value]) => {
            if (!value || value === 'ALL') {
              next.delete(key)
            } else {
              next.set(key, value)
            }
          })
          if (!updates.page) {
            next.set('page', '1')
          }
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams({ page: '1' }), { replace: true })
  }, [setSearchParams])

  // Page navigation
  const goToPage = useCallback(
    (newPage1Indexed) => {
      setFilter('page', String(newPage1Indexed))
    },
    [setFilter]
  )

  return {
    events: filteredEvents,
    rawEvents,
    totalElements,
    totalPages,
    currentPage: serverPageNumber + 1, // 1-indexed for display
    pageSize: size,
    metrics,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    // Active filters
    filters: {
      action: actionFilter,
      entityType: entityTypeFilter,
      actor: actorFilter,
      result: resultFilter,
      traceId: traceIdFilter,
      q: searchFilter,
      startDate: startDateFilter,
      endDate: endDateFilter,
    },
    // Setters
    setFilter,
    setFilters,
    resetFilters,
    goToPage,
  }
}

// Hook to fetch full historical audit trail for a specific entity
export function useEntityAuditHistory(entityType, entityId) {
  return useQuery({
    queryKey: ['audit-entity-history', entityType, entityId],
    queryFn: async () => {
      if (!entityType || !entityId) return []
      const res = await auditApi.getByEntity(entityType, entityId)
      return res.data?.data || []
    },
    enabled: Boolean(entityType && entityId),
    staleTime: 15000,
  })
}
