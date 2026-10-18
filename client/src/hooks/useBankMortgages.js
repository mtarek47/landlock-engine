import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mortgageApi, parcelApi } from '../api/client'
import { useAuth } from '../context/AuthContext'

// Known seeded mortgage IDs for institutional baseline
const INITIAL_SEEDED_MORTGAGE_IDS = [
  'e0000001-0000-0000-0000-000000000011',
  'e0000002-0000-0000-0000-000000000022',
]

export function useBankMortgages() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const institutionId = user?.institutionId || '40000000-0000-0000-0000-000000000004'

  // Storage key for institutional mortgage IDs tracked locally
  const storageKey = `landlock_bank_mortgages_${institutionId}`
  const releaseDocStorageKey = `landlock_release_docs_${institutionId}`

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, ACTIVE, RELEASE_PENDING, RELEASED, DISPUTED
  const [scopeFilter, setScopeFilter] = useState('ALL') // ALL, FULL_PARCEL, PORTION, SHARE
  const [upazilaFilter, setUpazilaFilter] = useState('ALL')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Get known tracked mortgage IDs
  const getTrackedIds = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      const parsed = stored ? JSON.parse(stored) : []
      const merged = Array.from(new Set([...INITIAL_SEEDED_MORTGAGE_IDS, ...parsed]))
      return merged
    } catch {
      return INITIAL_SEEDED_MORTGAGE_IDS
    }
  }, [storageKey])

  // Get submitted release documents metadata
  const getSubmittedReleaseDocs = useCallback(() => {
    try {
      const stored = localStorage.getItem(releaseDocStorageKey)
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }, [releaseDocStorageKey])

  // Save mortgage ID to institutional cache
  const addTrackedId = useCallback((newId) => {
    try {
      const existing = getTrackedIds()
      if (!existing.includes(newId)) {
        const updated = [...existing, newId]
        localStorage.setItem(storageKey, JSON.stringify(updated))
      }
    } catch (e) {
      console.warn('Failed to save mortgage ID to local tracking', e)
    }
  }, [getTrackedIds, storageKey])

  // Fetch all parcels for lookup and verification discovery
  const { data: parcelsData, isLoading: parcelsLoading } = useQuery({
    queryKey: ['parcels', 'all'],
    queryFn: async () => {
      try {
        const res = await parcelApi.search({ district: 'Dhaka' })
        return res.data?.data || []
      } catch (err) {
        console.warn('Failed to fetch parcels list:', err)
        return []
      }
    },
    staleTime: 60000,
  })

  // Parcel lookup map by ID
  const parcelMap = useMemo(() => {
    const map = new Map()
    if (parcelsData && Array.isArray(parcelsData)) {
      parcelsData.forEach((p) => {
        map.set(p.id, p)
      })
    }
    return map
  }, [parcelsData])

  // Main query: Fetch mortgages for the institution
  const {
    data: rawMortgages = [],
    isLoading: mortgagesLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['bank-mortgages', institutionId],
    queryFn: async () => {
      const trackedIds = getTrackedIds()
      const mortgageList = []
      const seenIds = new Set()

      // 1. Fetch each individually tracked mortgage via authoritative getById
      for (const id of trackedIds) {
        try {
          const res = await mortgageApi.getById(id)
          if (res.data?.data) {
            mortgageList.push(res.data.data)
            seenIds.add(id)
          }
        } catch (err) {
          // If 403 or 404, record belongs to another institution or does not exist
          console.debug(`Mortgage ${id} skipped:`, err?.response?.status)
        }
      }

      // 2. Cross-verify against parcels to discover any other active mortgages for this institution
      if (parcelsData && parcelsData.length > 0) {
        for (const parcel of parcelsData) {
          try {
            const vRes = await mortgageApi.verify(parcel.id)
            const activeList = vRes.data?.data || []
            for (const m of activeList) {
              if (
                m.lenderInstitutionId === institutionId ||
                !m.lenderInstitutionId ||
                user?.role === 'SYSTEM_ADMIN'
              ) {
                if (!seenIds.has(m.id)) {
                  mortgageList.push(m)
                  seenIds.add(m.id)
                  addTrackedId(m.id)
                }
              }
            }
          } catch {
            // Ignore parcel verify lookup errors
          }
        }
      }

      return mortgageList
    },
    staleTime: 15000,
  })

  // Merge with parcel metadata and submitted release document records
  const enrichedMortgages = useMemo(() => {
    const releaseDocs = getSubmittedReleaseDocs()

    return rawMortgages.map((m) => {
      const parcel = parcelMap.get(m.parcelId) || null
      const submittedDoc = releaseDocs[m.id] || null

      // If a release document has been submitted but not yet verified as RELEASED on backend
      let effectiveUiStatus = m.status
      if (m.status === 'ACTIVE' && submittedDoc) {
        effectiveUiStatus = 'RELEASE_PENDING'
      }

      return {
        ...m,
        parcel,
        submittedReleaseDoc: submittedDoc,
        effectiveUiStatus,
      }
    })
  }, [rawMortgages, parcelMap, getSubmittedReleaseDocs])

  // Filtered and searched records
  const filteredMortgages = useMemo(() => {
    return enrichedMortgages.filter((item) => {
      // Status filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'RELEASE_PENDING') {
          if (item.effectiveUiStatus !== 'RELEASE_PENDING') return false
        } else if (statusFilter === 'ACTIVE') {
          if (item.status !== 'ACTIVE' || item.effectiveUiStatus === 'RELEASE_PENDING') return false
        } else if (statusFilter === 'RELEASED') {
          if (item.status !== 'RELEASED') return false
        } else if (statusFilter === 'DISPUTED') {
          if (item.status !== 'DISPUTED') return false
        }
      }

      // Scope filter
      if (scopeFilter !== 'ALL' && item.scopeType !== scopeFilter) {
        return false
      }

      // Upazila filter
      if (upazilaFilter !== 'ALL' && item.parcel?.upazilaCode !== upazilaFilter) {
        return false
      }

      // Search term (lenderReference, dagNumber, khatianNumber, mouza, borrower/notes)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim()
        const matchesRef = item.lenderReference?.toLowerCase().includes(query)
        const matchesDag = item.parcel?.dagNumber?.toString().includes(query)
        const matchesKhatian = item.parcel?.khatianNumber?.toString().includes(query)
        const matchesMouza = item.parcel?.mouzaCode?.toLowerCase().includes(query)
        const matchesReleaseRef = item.releaseReference?.toLowerCase().includes(query)

        if (!matchesRef && !matchesDag && !matchesKhatian && !matchesMouza && !matchesReleaseRef) {
          return false
        }
      }

      return true
    })
  }, [enrichedMortgages, statusFilter, scopeFilter, upazilaFilter, searchTerm])

  // Metrics summary counts
  const metrics = useMemo(() => {
    const total = enrichedMortgages.length
    const active = enrichedMortgages.filter(
      (m) => m.status === 'ACTIVE' && m.effectiveUiStatus !== 'RELEASE_PENDING'
    ).length
    const pendingRelease = enrichedMortgages.filter(
      (m) => m.effectiveUiStatus === 'RELEASE_PENDING'
    ).length
    const released = enrichedMortgages.filter((m) => m.status === 'RELEASED').length
    const disputed = enrichedMortgages.filter((m) => m.status === 'DISPUTED').length

    return { total, active, pendingRelease, released, disputed }
  }, [enrichedMortgages])

  // Paginated records
  const paginatedMortgages = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredMortgages.slice(startIndex, startIndex + pageSize)
  }, [filteredMortgages, page, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredMortgages.length / pageSize))

  // Mutation: Create a new mortgage
  const createMortgageMutation = useMutation({
    mutationFn: async (formData) => {
      const payload = {
        parcelId: formData.parcelId,
        lenderInstitutionId: formData.lenderInstitutionId || institutionId,
        lenderReference: formData.lenderReference,
        scopeType: formData.scopeType || 'FULL_PARCEL',
        securedArea: formData.securedArea ? parseFloat(formData.securedArea) : null,
        securedShare: formData.securedShare || null,
        effectiveFrom: formData.effectiveFrom,
        effectiveUntil: formData.effectiveUntil || null,
      }
      const res = await mortgageApi.create(payload)
      return res.data?.data
    },
    onSuccess: (newMortgage) => {
      if (newMortgage?.id) {
        addTrackedId(newMortgage.id)
      }
      queryClient.invalidateQueries({ queryKey: ['bank-mortgages'] })
      queryClient.invalidateQueries({ queryKey: ['parcels'] })
    },
  })

  // Mutation: Authoritative Release (Final Bank Discharge / NOC)
  const releaseMortgageMutation = useMutation({
    mutationFn: async ({ id, releaseReference }) => {
      const res = await mortgageApi.release(id, releaseReference)
      return res.data?.data
    },
    onSuccess: (releasedMortgage) => {
      // Remove any pending release doc since it is now verified and released
      try {
        const releaseDocs = getSubmittedReleaseDocs()
        if (releaseDocs[releasedMortgage.id]) {
          delete releaseDocs[releasedMortgage.id]
          localStorage.setItem(releaseDocStorageKey, JSON.stringify(releaseDocs))
        }
      } catch (e) {
        console.warn('Error clearing release doc cache', e)
      }

      queryClient.invalidateQueries({ queryKey: ['bank-mortgages'] })
      queryClient.invalidateQueries({ queryKey: ['parcels'] })
    },
  })

  // Mutation: Record submitted release document (pre-release verification stage)
  const recordReleaseDocMutation = useMutation({
    mutationFn: async ({ mortgageId, docData }) => {
      const releaseDocs = getSubmittedReleaseDocs()
      releaseDocs[mortgageId] = {
        ...docData,
        submittedAt: new Date().toISOString(),
        submittedBy: user?.displayName || user?.username,
        status: 'SUBMITTED_FOR_VERIFICATION',
      }
      localStorage.setItem(releaseDocStorageKey, JSON.stringify(releaseDocs))
      return releaseDocs[mortgageId]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-mortgages'] })
    },
  })

  return {
    mortgages: paginatedMortgages,
    allMortgages: enrichedMortgages,
    totalRecords: filteredMortgages.length,
    metrics,
    parcels: parcelsData || [],
    isLoading: mortgagesLoading || parcelsLoading,
    isFetching,
    isError,
    error,
    refetch,
    // Filters & Pagination
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    scopeFilter,
    setScopeFilter,
    upazilaFilter,
    setUpazilaFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    // Actions
    createMortgage: createMortgageMutation.mutateAsync,
    isCreating: createMortgageMutation.isPending,
    createError: createMortgageMutation.error,
    releaseMortgage: releaseMortgageMutation.mutateAsync,
    isReleasing: releaseMortgageMutation.isPending,
    releaseError: releaseMortgageMutation.error,
    recordReleaseDoc: recordReleaseDocMutation.mutateAsync,
    isRecordingReleaseDoc: recordReleaseDocMutation.isPending,
  }
}
