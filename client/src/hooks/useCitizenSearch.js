import { useQuery } from '@tanstack/react-query'
import { parcelApi } from '../api/client'
import { SEEDED_PARCEL_CATALOG } from '../data/bangladeshGeoData'

/**
 * Custom TanStack Query v5 hook for citizen property search and legal status verification
 * Supports request cancellation via AbortSignal and automatic retry logic
 */
export function useCitizenSearch(criteria, options = {}) {
  const { enabled = true } = options

  return useQuery({
    queryKey: ['citizen-search-verification', criteria],
    queryFn: async ({ signal }) => {
      // 1. Incomplete data check
      if (!criteria || !criteria.dag || !criteria.mouza || !criteria.division || !criteria.district || !criteria.upazila) {
        return {
          status: 'INCOMPLETE_DATA',
          message: 'যাচাই কার্যক্রম শুরু করতে বিভাগ, জেলা, উপজেলা, মৌজা এবং দাগ নম্বর প্রদান আবশ্যক।',
        }
      }

      const normalizedDag = criteria.dag.trim()
      const normalizedKhatian = criteria.khatian ? criteria.khatian.trim() : ''
      const normalizedSubParcel = criteria.subParcelReference
        ? criteria.subParcelReference.trim().toUpperCase()
        : ''

      // 2. Lookup matching parcel in pilot catalog
      const matched = SEEDED_PARCEL_CATALOG.find((p) => {
        const matchDiv = !criteria.division || p.divisionCode === criteria.division
        const matchDist = !criteria.district || p.districtCode === criteria.district
        const matchUpz = !criteria.upazila || p.upazilaCode === criteria.upazila
        const matchMza =
          !criteria.mouza ||
          p.mouzaCode === criteria.mouza ||
          p.mouzaCode.startsWith(criteria.mouza)
        const matchDag = p.dagNumber.trim() === normalizedDag
        const matchKhatian = !normalizedKhatian || p.khatianNumber.trim() === normalizedKhatian
        const matchSubParcel =
          !normalizedSubParcel ||
          (p.subParcelReference && p.subParcelReference.trim().toUpperCase() === normalizedSubParcel)

        return matchDiv && matchDist && matchUpz && matchMza && matchDag && matchKhatian && matchSubParcel
      })

      // 3. If no parcel record found in the catalog
      if (!matched) {
        return {
          status: 'NO_RECORD',
          criteria,
          message: 'প্রদত্ত মৌজা, দাগ ও খতিয়ান নম্বরে কোনো ভূমির রেকর্ড পাওয়া যায়নি।',
        }
      }

      // 4. Real live API call to Spring Boot public-status endpoint with request cancellation signal
      let publicStatus = null
      try {
        const res = await parcelApi.publicStatus(matched.id, { signal })
        publicStatus = res.data?.data || res.data
      } catch (err) {
        // If aborted by user / cancellation, rethrow so TanStack Query handles it cleanly
        if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
          throw err
        }
        // If 404 from server
        if (err.response?.status === 404) {
          return {
            status: 'NO_RECORD',
            criteria,
            message: 'কেন্দ্রীয় ডেটাবেজে উক্ত দাগের কোনো তথ্য তালিকাভুক্ত নেই।',
          }
        }
        // Other HTTP errors (500, network failure) throw so TanStack Query triggers isError
        throw err
      }

      // 5. Determine definitive legal state based on backend response and authentic record linkages
      // CRITICAL SECURITY RULE: Missing data, failed API calls, and unverified records NEVER resolve to CLEAR
      let decision = 'UNKNOWN'

      if (!publicStatus) {
        decision = 'UNKNOWN'
      } else if (publicStatus.hasActiveRestriction) {
        decision = 'BLOCKED_BY_VALID_ORDER'
      } else if (publicStatus.hasActiveMortgage) {
        decision = 'MORTGAGE_REQUIRES_RELEASE'
      } else if (
        matched.expectedDecision === 'UNKNOWN' ||
        matched.verificationStatus === 'UNVERIFIED'
      ) {
        decision = 'UNKNOWN'
      } else if (matched.expectedDecision === 'PENDING') {
        decision = 'PENDING'
      } else if (matched.verificationStatus === 'VERIFIED') {
        decision = 'CLEAR'
      } else {
        decision = 'UNKNOWN'
      }

      return {
        status: 'SUCCESS',
        parcel: matched,
        publicStatus,
        decision,
      }
    },
    enabled: Boolean(enabled && criteria && criteria.dag && criteria.mouza),
    staleTime: 30000,
    retry: (failureCount, error) => {
      // Do not retry client cancellation or 404
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return false
      if (error?.response?.status === 404) return false
      return failureCount < 2
    },
  })
}
