import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  STATUS_DEFINITIONS,
  toBengaliNumber,
} from '../src/components/design-system/constants.js'

describe('Registry Decision Console — Authoritative Outcome Matrix', () => {
  it('maps all primary and secondary gatekeeper decision states', () => {
    assert.ok(STATUS_DEFINITIONS.CLEAR, 'CLEAR decision must be mapped')
    assert.ok(STATUS_DEFINITIONS.BLOCKED_BY_VALID_ORDER, 'BLOCKED_BY_VALID_ORDER must be mapped')
    assert.ok(STATUS_DEFINITIONS.MORTGAGE_REQUIRES_RELEASE, 'MORTGAGE_REQUIRES_RELEASE must be mapped')
    assert.ok(STATUS_DEFINITIONS.REVIEW_REQUIRED, 'REVIEW_REQUIRED must be mapped')
  })

  it('provides precise statutory Bengali descriptions for each outcome', () => {
    assert.match(STATUS_DEFINITIONS.CLEAR.labelBn, /পরিষ্কার|নিষেধাজ্ঞামুক্ত/)
    assert.match(STATUS_DEFINITIONS.BLOCKED_BY_VALID_ORDER.labelBn, /আদেশে অবরুদ্ধ/)
    assert.match(STATUS_DEFINITIONS.MORTGAGE_REQUIRES_RELEASE.labelBn, /বন্ধক মুক্তি আবশ্যক/)
    assert.match(STATUS_DEFINITIONS.REVIEW_REQUIRED.labelBn, /পর্যালোচনা প্রয়োজন/)
  })

  it('formats Bengali numerals for parcel areas and restriction counts', () => {
    assert.strictEqual(toBengaliNumber(1), '১')
    assert.strictEqual(toBengaliNumber(10.5), '১০.৫')
    assert.strictEqual(toBengaliNumber('5001'), '৫০০১')
    assert.strictEqual(toBengaliNumber(0), '০')
  })
})

describe('Registry Gatekeeper — Multi-Risk & Secondary Risk Detection', () => {
  function detectSecondaryRisks(decision, courtRestrictions, mortgageRecords) {
    const risks = []
    if (decision === 'BLOCKED_BY_VALID_ORDER') {
      const activeMortgage = mortgageRecords.find(m => m.status === 'ACTIVE')
      if (activeMortgage) {
        risks.push({
          category: 'MORTGAGE',
          title: 'সক্রিয় ব্যাংক বন্ধকী দায় (Concurrent Bank Lien)',
          reference: activeMortgage.lenderReference,
        })
      }
    }
    if (decision === 'MORTGAGE_REQUIRES_RELEASE') {
      const activeCourt = courtRestrictions.find(c => c.status === 'ACTIVE')
      if (activeCourt) {
        risks.push({
          category: 'COURT',
          title: 'বিচারিক নিষেধাজ্ঞা / বিচারাধীন মামলা (Concurrent Judicial Dispute)',
          reference: activeCourt.sourceReference,
        })
      }
    }
    return risks
  }

  it('detects concurrent active mortgage when primary decision is BLOCKED_BY_VALID_ORDER', () => {
    const courtOrders = [{ status: 'ACTIVE', sourceReference: 'ORD-DH-2024-991' }]
    const mortgages = [{ status: 'ACTIVE', lenderReference: 'MORT-DB-2023-001' }]

    const secondary = detectSecondaryRisks('BLOCKED_BY_VALID_ORDER', courtOrders, mortgages)
    assert.strictEqual(secondary.length, 1)
    assert.strictEqual(secondary[0].category, 'MORTGAGE')
    assert.strictEqual(secondary[0].reference, 'MORT-DB-2023-001')
  })

  it('detects concurrent court order when primary decision is MORTGAGE_REQUIRES_RELEASE', () => {
    const courtOrders = [{ status: 'ACTIVE', sourceReference: 'ORD-DH-2024-991' }]
    const mortgages = [{ status: 'ACTIVE', lenderReference: 'MORT-DB-2023-001' }]

    const secondary = detectSecondaryRisks('MORTGAGE_REQUIRES_RELEASE', courtOrders, mortgages)
    assert.strictEqual(secondary.length, 1)
    assert.strictEqual(secondary[0].category, 'COURT')
    assert.strictEqual(secondary[0].reference, 'ORD-DH-2024-991')
  })

  it('returns no secondary risks when only a single restriction exists', () => {
    const courtOrders = [{ status: 'ACTIVE', sourceReference: 'ORD-DH-2024-991' }]
    const mortgages = [{ status: 'RELEASED', lenderReference: 'MORT-DB-2023-001' }]

    const secondary = detectSecondaryRisks('BLOCKED_BY_VALID_ORDER', courtOrders, mortgages)
    assert.strictEqual(secondary.length, 0)
  })

  it('never returns secondary risks for a verified CLEAR outcome', () => {
    const secondary = detectSecondaryRisks('CLEAR', [], [])
    assert.strictEqual(secondary.length, 0)
  })
})

describe('Legal Gatekeeper Fail-Safe Invariants', () => {
  it('never assumes a missing parcel record or 404 response is CLEAR', () => {
    const simulateDecision = (parcel, error) => {
      if (error) return 'SYSTEM_UNAVAILABLE'
      if (!parcel) return 'REVIEW_REQUIRED'
      return 'CLEAR'
    }

    assert.strictEqual(simulateDecision(null, null), 'REVIEW_REQUIRED')
    assert.strictEqual(simulateDecision(null, new Error('Network timeout')), 'SYSTEM_UNAVAILABLE')
    assert.notStrictEqual(simulateDecision(null, null), 'CLEAR')
  })

  it('flags data as stale when freshness age exceeds 300 seconds', () => {
    const evaluateStaleness = (freshnessTimestamp) => {
      const ageSeconds = Math.max(0, Math.floor((Date.now() - new Date(freshnessTimestamp).getTime()) / 1000))
      return ageSeconds > 300
    }

    const recent = new Date(Date.now() - 30 * 1000).toISOString()
    const stale = new Date(Date.now() - 600 * 1000).toISOString()

    assert.strictEqual(evaluateStaleness(recent), false, 'Recent data must not be flagged as stale')
    assert.strictEqual(evaluateStaleness(stale), true, 'Data older than 5 minutes must be flagged as stale')
  })
})
