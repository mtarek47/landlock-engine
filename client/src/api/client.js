// ==============================================================================
// client.js: Standalone In-Browser Mock & Network API Engine for LandLock
// Provides 100% full-functionality client-side demo without backend dependencies.
// ==============================================================================

import {
  INITIAL_PARCELS,
  INITIAL_RESTRICTIONS,
  INITIAL_MORTGAGES,
  INITIAL_CASES,
  INITIAL_ORDERS,
  INITIAL_AUDIT_EVENTS,
  DEMO_USERS_MAP,
} from './mockData'

const STORAGE_KEYS = {
  PARCELS: 'landlock_mock_parcels',
  RESTRICTIONS: 'landlock_mock_restrictions',
  MORTGAGES: 'landlock_mock_mortgages',
  CASES: 'landlock_mock_cases',
  ORDERS: 'landlock_mock_orders',
  AUDIT: 'landlock_mock_audit_events',
  CHECKS: 'landlock_mock_checks',
  USER: 'landlock_user',
  TOKEN: 'landlock_token',
}

// Helper to get or initialize localStorage
function getStorage(key, initialData) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initialData))
      return JSON.parse(JSON.stringify(initialData))
    }
    const parsed = JSON.parse(raw)
    if (Array.isArray(initialData) && Array.isArray(parsed)) {
      const initMap = new Map(initialData.map((d) => [d.id, d]))
      return parsed.map((item) => {
        const init = initMap.get(item.id)
        if (!init) return item
        return {
          ...init,
          ...item,
          parcelId: item.parcelId || init.parcelId,
          parcelIds: item.parcelIds?.length ? item.parcelIds : init.parcelIds,
          approvalStatus:
            item.id === 'e2000000-0000-0000-0000-000000000002' && item.approvalStatus === 'DRAFT'
              ? 'SUBMITTED'
              : item.approvalStatus || init.approvalStatus,
        }
      })
    }
    return parsed
  } catch (e) {
    console.warn(`[MockEngine] Error accessing localStorage for key ${key}:`, e)
    return JSON.parse(JSON.stringify(initialData))
  }
}

// Helper to save to localStorage
function setStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.warn(`[MockEngine] Error saving to localStorage for key ${key}:`, e)
  }
}

// Current user helper
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER)
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEMO_USERS_MAP.admin1
}

// Add audit log helper
function addAuditEvent({ action, entityType, entityId, reason, changeSummary }) {
  const user = getCurrentUser()
  const events = getStorage(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_EVENTS)
  const newEvent = {
    id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    actorUserId: user?.id || DEMO_USERS_MAP.admin1.id,
    action,
    entityType,
    entityId,
    reason: reason || 'স্বয়ংক্রিয় সিস্টেম কার্যক্রম',
    occurredAt: new Date().toISOString(),
    changeSummary: changeSummary || reason || 'রেকর্ড সংযোজন বা পরিবর্তন সম্পন্ন',
  }
  events.unshift(newEvent)
  setStorage(STORAGE_KEYS.AUDIT, events)
  return newEvent
}

// Simulated network delay helper
const delay = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

// Dummy apiClient object for any code referencing default export
const apiClient = {
  get: () => Promise.resolve({ data: { success: true, data: null } }),
  post: () => Promise.resolve({ data: { success: true, data: null } }),
  interceptors: {
    request: { use: () => {} },
    response: { use: () => {} },
  },
}
export default apiClient

// ------------------------------------------------------------------------------
// Auth APIs
// ------------------------------------------------------------------------------
export const authApi = {
  login: async (username, password) => {
    await delay(100)
    const normalized = (username || '').trim().toLowerCase()
    const user =
      DEMO_USERS_MAP[normalized] ||
      Object.values(DEMO_USERS_MAP).find(
        (u) => u.username.toLowerCase() === normalized
      ) || {
        id: crypto.randomUUID(),
        username: username || 'demo_user',
        displayName: username || 'ডেমো কর্মকর্তা',
        role: 'SYSTEM_ADMIN',
        email: `${username || 'demo'}@landlock.gov.bd`,
        institutionId: '20000000-0000-0000-0000-000000000002',
      }

    const token = `mock-jwt-token-${user.username}`
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)

    return {
      data: {
        success: true,
        message: 'লগইন সফল হয়েছে',
        data: { token, user },
      },
    }
  },

  me: async () => {
    await delay(50)
    const user = getCurrentUser()
    return {
      data: {
        success: true,
        data: user,
      },
    }
  },
}

// ------------------------------------------------------------------------------
// Parcel APIs
// ------------------------------------------------------------------------------
export const parcelApi = {
  search: async (params = {}) => {
    await delay(80)
    const parcels = getStorage(STORAGE_KEYS.PARCELS, INITIAL_PARCELS)
    let filtered = parcels

    if (params.mouza) {
      const q = params.mouza.toLowerCase().trim()
      filtered = filtered.filter(
        (p) =>
          p.mouzaCode?.toLowerCase().includes(q) ||
          p.upazilaCode?.toLowerCase().includes(q)
      )
    }
    if (params.dag) {
      const q = params.dag.trim()
      filtered = filtered.filter((p) => p.dagNumber?.toString().includes(q))
    }
    if (params.khatian) {
      const q = params.khatian.trim()
      filtered = filtered.filter((p) => p.khatianNumber?.toString().includes(q))
    }

    return {
      data: {
        success: true,
        data: filtered,
      },
    }
  },

  getById: async (id) => {
    await delay(60)
    const parcels = getStorage(STORAGE_KEYS.PARCELS, INITIAL_PARCELS)
    const parcel = parcels.find((p) => p.id === id)

    if (!parcel) {
      const err = new Error('পার্সেল খুঁজে পাওয়া যায়নি।')
      err.response = {
        status: 404,
        data: { message: 'পার্সেল তথ্য খুঁজে পাওয়া যায়নি।' },
      }
      throw err
    }

    return {
      data: {
        success: true,
        data: parcel,
      },
    }
  },

  publicStatus: async (id) => {
    await delay(60)
    const restrictions = getStorage(STORAGE_KEYS.RESTRICTIONS, INITIAL_RESTRICTIONS)
    const mortgages = getStorage(STORAGE_KEYS.MORTGAGES, INITIAL_MORTGAGES)

    const hasActiveRestriction = restrictions.some(
      (r) => r.parcelId === id && r.status === 'ACTIVE'
    )
    const hasActiveMortgage = mortgages.some(
      (m) => m.parcelId === id && m.status === 'ACTIVE' && !m.releaseReference
    )

    return {
      data: {
        success: true,
        data: {
          parcelId: id,
          hasActiveRestriction,
          hasActiveMortgage,
          lastChecked: new Date().toISOString(),
          disclaimer:
            'এটি একটি নাগরিক পাবলিক স্ট্যাটাস যাচাই। সরকারি দলিলের বিকল্প নয়।',
        },
      },
    }
  },

  create: async (data) => {
    await delay(100)
    const parcels = getStorage(STORAGE_KEYS.PARCELS, INITIAL_PARCELS)
    const newParcel = {
      id: crypto.randomUUID(),
      verificationStatus: 'VERIFIED',
      createdAt: new Date().toISOString(),
      lastVerifiedAt: new Date().toISOString(),
      ...data,
    }
    parcels.push(newParcel)
    setStorage(STORAGE_KEYS.PARCELS, parcels)

    addAuditEvent({
      action: 'CREATE_PARCEL',
      entityType: 'LandParcel',
      entityId: newParcel.id,
      reason: `নতুন পার্সেল নিবন্ধন: মৌজা ${newParcel.mouzaCode}, দাগ ${newParcel.dagNumber}`,
      changeSummary: `দাগ ${newParcel.dagNumber} সিস্টেমে সফলভাবে সংরক্ষিত`,
    })

    return {
      data: {
        success: true,
        data: newParcel,
      },
    }
  },
}

// ------------------------------------------------------------------------------
// Registry APIs (Gatekeeper Engine)
// ------------------------------------------------------------------------------
export const registryApi = {
  check: async (data) => {
    await delay(120)
    const parcels = getStorage(STORAGE_KEYS.PARCELS, INITIAL_PARCELS)
    const restrictions = getStorage(STORAGE_KEYS.RESTRICTIONS, INITIAL_RESTRICTIONS)
    const mortgages = getStorage(STORAGE_KEYS.MORTGAGES, INITIAL_MORTGAGES)

    const parcel = parcels.find((p) => p.id === data.parcelId)

    let decision = 'CLEAR'
    let reasonCodes = []
    let responseSummary = ''

    if (!parcel) {
      decision = 'REVIEW_REQUIRED'
      reasonCodes = ['PARCEL_NOT_FOUND']
      responseSummary =
        'প্রদত্ত আইডি বা বিবরণীর কোনো পার্সেল রেজিস্ট্রিতে খুঁজে পাওয়া যায়নি। সংশ্লিষ্ট ভূমি অফিসে যোগাযোগ করুন।'
    } else {
      // 1. Check for ACTIVE court injunctions / restrictions
      const activeRest = restrictions.find(
        (r) =>
          r.parcelId === data.parcelId &&
          r.status === 'ACTIVE' &&
          (r.applicableTransactionTypes === 'ALL' ||
            r.applicableTransactionTypes === data.transactionType)
      )

      if (activeRest) {
        decision = 'BLOCKED_BY_VALID_ORDER'
        reasonCodes = ['ACTIVE_COURT_INJUNCTION_OR_BLOCK', 'TRANSFER_PROHIBITED']
        responseSummary = `বিজ্ঞ আদালতের সক্রিয় নিষেধাজ্ঞা (${activeRest.sourceReference || 'স্থগিতাদেশ'}) বলবৎ থাকায় এই লেনদেন রেজিস্ট্রি করা সম্পূর্ণ অবরুদ্ধ।`
      } else {
        // 2. Check for ACTIVE mortgages without release
        const activeMort = mortgages.find(
          (m) =>
            m.parcelId === data.parcelId &&
            m.status === 'ACTIVE' &&
            !m.releaseReference
        )

        if (activeMort) {
          decision = 'MORTGAGE_REQUIRES_RELEASE'
          reasonCodes = ['ACTIVE_MORTGAGE_NO_RELEASE']
          responseSummary = `আর্থিক প্রতিষ্ঠানের (${activeMort.lenderInstitutionId || 'ব্যাংক'}) অনুকূলে সক্রিয় বন্ধক (Mortgage) বিদ্যমান। দায়মুক্তি বা এনওসি ব্যতীত দলিল নিবন্ধন সম্ভব নয়।`
        } else {
          // 3. Clear
          decision = 'CLEAR'
          reasonCodes = []
          responseSummary =
            'জমির উপর কোনো সক্রিয় স্থগিতাদেশ বা অপরিশোধিত বন্ধক পরিলক্ষিত হয়নি। লেনদেন ঝুঁকিহীন।'
        }
      }
    }

    const checkResult = {
      id: crypto.randomUUID(),
      requestId: data.requestId || crypto.randomUUID(),
      requestingInstitutionId:
        getCurrentUser()?.institutionId ||
        '30000000-0000-0000-0000-000000000003',
      parcelId: data.parcelId,
      transactionType: data.transactionType,
      decision,
      reasonCodes,
      dataFreshness: new Date().toISOString(),
      correlationId: crypto.randomUUID(),
      checkedAt: new Date().toISOString(),
      responseSummary,
    }

    const checks = getStorage(STORAGE_KEYS.CHECKS, [])
    checks.unshift(checkResult)
    setStorage(STORAGE_KEYS.CHECKS, checks)

    addAuditEvent({
      action: 'REGISTRY_CHECK',
      entityType: 'RegistryCheck',
      entityId: data.parcelId,
      reason: `রেজিস্ট্রি গেটকিপার যাচাই: সিদ্ধান্ত ${decision} (${data.transactionType})`,
      changeSummary: `দলিল যাচাই সম্পন্ন — ফলাফল: ${decision}`,
    })

    return {
      data: {
        success: true,
        data: checkResult,
      },
    }
  },

  getCheck: async (id) => {
    await delay(50)
    const checks = getStorage(STORAGE_KEYS.CHECKS, [])
    const found = checks.find((c) => c.id === id)
    return {
      data: {
        success: true,
        data: found,
      },
    }
  },
}

// ------------------------------------------------------------------------------
// Case APIs
// ------------------------------------------------------------------------------
export const caseApi = {
  getById: async (id) => {
    await delay(60)
    const cases = getStorage(STORAGE_KEYS.CASES, INITIAL_CASES)
    const caseItem = cases.find((c) => c.id === id) || cases[0]
    return {
      data: {
        success: true,
        data: caseItem,
      },
    }
  },

  create: async (data) => {
    await delay(100)
    const cases = getStorage(STORAGE_KEYS.CASES, INITIAL_CASES)
    const newCase = {
      id: crypto.randomUUID(),
      caseStatus: 'ACTIVE',
      filingDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...data,
    }
    cases.push(newCase)
    setStorage(STORAGE_KEYS.CASES, cases)

    addAuditEvent({
      action: 'CREATE_CASE',
      entityType: 'CaseFile',
      entityId: newCase.id,
      reason: `নতুন মামলা দায়ের: ${newCase.caseNumber}`,
      changeSummary: `মামলা ${newCase.caseNumber} বিচার বিভাগে নথিভুক্ত`,
    })

    return {
      data: {
        success: true,
        data: newCase,
      },
    }
  },

  addParcel: async (id, data) => {
    await delay(60)
    return {
      data: {
        success: true,
        data,
      },
    }
  },

  addOrder: async (id, data) => {
    await delay(80)
    const orders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
    const newOrder = {
      id: crypto.randomUUID(),
      caseId: id,
      approvalStatus: 'DRAFT',
      verificationStatus: 'PENDING',
      orderDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...data,
    }
    orders.push(newOrder)
    setStorage(STORAGE_KEYS.ORDERS, orders)

    addAuditEvent({
      action: 'CREATE_ORDER',
      entityType: 'CourtOrder',
      entityId: newOrder.id,
      reason: `নতুন আদেশের খসড়া প্রণয়ন: ${newOrder.orderReference}`,
      changeSummary: 'আদেশ DRAFT হিসেবে সংরক্ষিত',
    })

    return {
      data: {
        success: true,
        data: newOrder,
      },
    }
  },
}

// ------------------------------------------------------------------------------
// Order APIs
// ------------------------------------------------------------------------------
export const orderApi = {
  getById: async (id) => {
    await delay(60)
    const orders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
    const order = orders.find((o) => o.id === id) || orders[0]
    return {
      data: {
        success: true,
        data: order,
      },
    }
  },

  submit: async (id) => {
    await delay(100)
    const orders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
    const order = orders.find((o) => o.id === id)

    if (order) {
      order.approvalStatus = 'SUBMITTED'
      setStorage(STORAGE_KEYS.ORDERS, orders)

      addAuditEvent({
        action: 'SUBMIT_ORDER',
        entityType: 'CourtOrder',
        entityId: id,
        reason: `আদেশ ${order.orderReference} বিচারিক পর্যালোচনার জন্য দাখিল`,
        changeSummary: 'আদেশের স্থিতি DRAFT হতে SUBMITTED করা হয়েছে',
      })
    }

    return {
      data: {
        success: true,
        data: order,
      },
    }
  },

  approve: async (id, reason) => {
    await delay(120)
    const orders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
    const order = orders.find((o) => o.id === id)

    if (order) {
      order.approvalStatus = 'APPROVED'
      order.approvedAt = new Date().toISOString()
      order.approvedBy =
        getCurrentUser()?.id || DEMO_USERS_MAP.order_approver1.id
      setStorage(STORAGE_KEYS.ORDERS, orders)

      // Ensure active restriction is present/activated for this order
      const restrictions = getStorage(STORAGE_KEYS.RESTRICTIONS, INITIAL_RESTRICTIONS)
      let rest = restrictions.find((r) => r.courtOrderId === order.id)

      if (!rest) {
        // Link to Gulshan parcel if order is e2000000..., else parcel 1
        const parcelId =
          order.id === 'e2000000-0000-0000-0000-000000000002'
            ? 'b2000000-0000-0000-0000-000000000002'
            : 'b1000000-0000-0000-0000-000000000001'

        rest = {
          id: crypto.randomUUID(),
          parcelId,
          caseId: order.caseId,
          courtOrderId: order.id,
          restrictionType: 'COURT_INJUNCTION',
          scopeType: 'FULL_PARCEL',
          scopeArea: 15.0,
          scopeShare: '1.0',
          applicableTransactionTypes: order.transactionScope || 'ALL',
          status: 'ACTIVE',
          effectiveFrom: order.effectiveFrom || '2026-10-18',
          effectiveUntil: order.effectiveUntil || '2028-12-31',
          sourceReference: order.orderReference,
          createdBy: order.createdBy,
          approvedBy: getCurrentUser()?.id,
          createdAt: new Date().toISOString(),
        }
        restrictions.push(rest)
      } else {
        rest.status = 'ACTIVE'
      }
      setStorage(STORAGE_KEYS.RESTRICTIONS, restrictions)

      addAuditEvent({
        action: 'APPROVE_ORDER',
        entityType: 'CourtOrder',
        entityId: id,
        reason:
          reason ||
          `বিজ্ঞ বিচারক কর্তৃক আদেশ ${order.orderReference} স্বাক্ষরিত ও অনুমোদিত`,
        changeSummary:
          'আদেশ APPROVED হয়েছে এবং সংশ্লিষ্ট পার্সেলে সক্রিয় নিষেধাজ্ঞা আরোপিত',
      })
    }

    return {
      data: {
        success: true,
        data: order,
      },
    }
  },

  reject: async (id, reason) => {
    await delay(100)
    const orders = getStorage(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
    const order = orders.find((o) => o.id === id)

    if (order) {
      order.approvalStatus = 'REJECTED'
      setStorage(STORAGE_KEYS.ORDERS, orders)

      addAuditEvent({
        action: 'REJECT_ORDER',
        entityType: 'CourtOrder',
        entityId: id,
        reason: reason || `আদেশ ${order.orderReference} বিচারক কর্তৃক প্রত্যাখ্যাত`,
        changeSummary: 'আদেশের স্থিতি REJECTED করা হয়েছে',
      })
    }

    return {
      data: {
        success: true,
        data: order,
      },
    }
  },
}

// ------------------------------------------------------------------------------
// Restriction APIs
// ------------------------------------------------------------------------------
export const restrictionApi = {
  getByParcel: async (parcelId) => {
    await delay(50)
    const restrictions = getStorage(STORAGE_KEYS.RESTRICTIONS, INITIAL_RESTRICTIONS)
    const list = restrictions.filter((r) => r.parcelId === parcelId)
    return {
      data: {
        success: true,
        data: list,
      },
    }
  },

  getById: async (id) => {
    await delay(50)
    const restrictions = getStorage(STORAGE_KEYS.RESTRICTIONS, INITIAL_RESTRICTIONS)
    const item = restrictions.find((r) => r.id === id)
    return {
      data: {
        success: true,
        data: item,
      },
    }
  },

  create: async (data) => {
    await delay(80)
    const restrictions = getStorage(STORAGE_KEYS.RESTRICTIONS, INITIAL_RESTRICTIONS)
    const newRest = {
      id: crypto.randomUUID(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      ...data,
    }
    restrictions.push(newRest)
    setStorage(STORAGE_KEYS.RESTRICTIONS, restrictions)

    addAuditEvent({
      action: 'CREATE_RESTRICTION',
      entityType: 'Restriction',
      entityId: newRest.id,
      reason: 'নতুন নিষেধাজ্ঞা আরোপিত',
      changeSummary: 'পার্সেলে সক্রিয় নিষেধাজ্ঞা সংযোজন',
    })

    return {
      data: {
        success: true,
        data: newRest,
      },
    }
  },

  release: async (id, reason) => {
    await delay(90)
    const restrictions = getStorage(STORAGE_KEYS.RESTRICTIONS, INITIAL_RESTRICTIONS)
    const rest = restrictions.find((r) => r.id === id)

    if (rest) {
      rest.status = 'RELEASED'
      setStorage(STORAGE_KEYS.RESTRICTIONS, restrictions)

      addAuditEvent({
        action: 'RELEASE_RESTRICTION',
        entityType: 'Restriction',
        entityId: id,
        reason: reason || 'আদালতের নির্দেশে নিষেধাজ্ঞা প্রত্যাহার',
        changeSummary: 'নিষেধাজ্ঞা RELEASED করা হয়েছে',
      })
    }

    return {
      data: {
        success: true,
        data: rest,
      },
    }
  },
}

// ------------------------------------------------------------------------------
// Mortgage APIs
// ------------------------------------------------------------------------------
export const mortgageApi = {
  verify: async (parcelId) => {
    await delay(50)
    const mortgages = getStorage(STORAGE_KEYS.MORTGAGES, INITIAL_MORTGAGES)
    const list = mortgages.filter((m) => m.parcelId === parcelId)
    return {
      data: {
        success: true,
        data: list,
      },
    }
  },

  getById: async (id) => {
    await delay(50)
    const mortgages = getStorage(STORAGE_KEYS.MORTGAGES, INITIAL_MORTGAGES)
    const item = mortgages.find((m) => m.id === id)
    return {
      data: {
        success: true,
        data: item,
      },
    }
  },

  create: async (data) => {
    await delay(80)
    const mortgages = getStorage(STORAGE_KEYS.MORTGAGES, INITIAL_MORTGAGES)
    const newMort = {
      id: crypto.randomUUID(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      ...data,
    }
    mortgages.push(newMort)
    setStorage(STORAGE_KEYS.MORTGAGES, mortgages)

    addAuditEvent({
      action: 'CREATE_MORTGAGE',
      entityType: 'Mortgage',
      entityId: newMort.id,
      reason: `নতুন বন্ধক নিবন্ধন: ${newMort.lenderReference}`,
      changeSummary: 'ব্যাংক লিয়েন / বন্ধক ACTIVE অবস্থায় অন্তর্ভুক্ত',
    })

    return {
      data: {
        success: true,
        data: newMort,
      },
    }
  },

  release: async (id, releaseReference) => {
    await delay(90)
    const mortgages = getStorage(STORAGE_KEYS.MORTGAGES, INITIAL_MORTGAGES)
    const mort = mortgages.find((m) => m.id === id)

    if (mort) {
      mort.status = 'RELEASED'
      mort.releaseReference = releaseReference || `REL-DB-${Date.now()}`
      setStorage(STORAGE_KEYS.MORTGAGES, mortgages)

      addAuditEvent({
        action: 'RELEASE_MORTGAGE',
        entityType: 'Mortgage',
        entityId: id,
        reason: `ব্যাংক দায়মুক্তি ও অনাপত্তিপত্র (NOC) প্রদান: ${mort.releaseReference}`,
        changeSummary: `বন্ধক RELEASED সম্পন্ন (${mort.releaseReference})`,
      })
    }

    return {
      data: {
        success: true,
        data: mort,
      },
    }
  },
}

// ------------------------------------------------------------------------------
// Audit APIs
// ------------------------------------------------------------------------------
export const auditApi = {
  getEvents: async (params = {}) => {
    await delay(70)
    const page = params.page ? parseInt(params.page, 10) : 0
    const size = params.size ? parseInt(params.size, 10) : 20

    const events = getStorage(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_EVENTS)
    const sorted = [...events].sort(
      (a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)
    )

    const start = page * size
    const paginated = sorted.slice(start, start + size)

    return {
      data: {
        success: true,
        data: {
          content: paginated,
          totalPages: Math.max(1, Math.ceil(sorted.length / size)),
          totalElements: sorted.length,
          number: page,
        },
      },
    }
  },

  getByEntity: async (entityType, entityId) => {
    await delay(50)
    const events = getStorage(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_EVENTS)
    const filtered = events.filter(
      (e) => e.entityType === entityType && e.entityId === entityId
    )
    return {
      data: {
        success: true,
        data: filtered,
      },
    }
  },
}

export const institutionApi = {
  getAll: async () => {
    return {
      data: {
        success: true,
        data: [
          { id: 'inst-01', name: 'ঢাকা জেলা জজ আদালত', type: 'COURT' },
          { id: 'inst-02', name: 'সাভার সাব-রেজিস্ট্রি অফিস', type: 'REGISTRY' },
          { id: 'inst-03', name: 'সোনালী ব্যাংক পিএলসি', type: 'BANK' },
        ],
      },
    }
  },
}

// Reset Demo Data Helper
export const resetDemoData = () => {
  localStorage.setItem(
    STORAGE_KEYS.PARCELS,
    JSON.stringify(INITIAL_PARCELS)
  )
  localStorage.setItem(
    STORAGE_KEYS.RESTRICTIONS,
    JSON.stringify(INITIAL_RESTRICTIONS)
  )
  localStorage.setItem(
    STORAGE_KEYS.MORTGAGES,
    JSON.stringify(INITIAL_MORTGAGES)
  )
  localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(INITIAL_CASES))
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS))
  localStorage.setItem(
    STORAGE_KEYS.AUDIT,
    JSON.stringify(INITIAL_AUDIT_EVENTS)
  )
  localStorage.setItem(STORAGE_KEYS.CHECKS, JSON.stringify([]))
  localStorage.setItem(
    STORAGE_KEYS.USER,
    JSON.stringify(DEMO_USERS_MAP.admin1)
  )
  localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-admin1')
  window.location.reload()
}
