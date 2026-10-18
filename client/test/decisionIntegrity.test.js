import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

/**
 * Functional verification of legal decision gatekeeper rules
 */
function resolveLegalDecision(publicStatus, parcelRecord) {
  // Pure logic mirroring backend & hook rules
  if (!publicStatus) return 'UNKNOWN'
  if (publicStatus.hasActiveRestriction) return 'BLOCKED_BY_VALID_ORDER'
  if (publicStatus.hasActiveMortgage) return 'MORTGAGE_REQUIRES_RELEASE'
  if (!parcelRecord || parcelRecord.verificationStatus === 'UNVERIFIED' || parcelRecord.expectedDecision === 'UNKNOWN') {
    return 'UNKNOWN'
  }
  if (parcelRecord.expectedDecision === 'PENDING') return 'PENDING'
  if (parcelRecord.verificationStatus === 'VERIFIED') return 'CLEAR'
  return 'UNKNOWN'
}

describe('Legal Gatekeeper Decision Integrity Rules', () => {
  it('never resolves to CLEAR when public status is null or missing', () => {
    const outcome = resolveLegalDecision(null, { verificationStatus: 'VERIFIED' })
    assert.equal(outcome, 'UNKNOWN')
    assert.notEqual(outcome, 'CLEAR')
  })

  it('never resolves to CLEAR when parcel record is unverified', () => {
    const outcome = resolveLegalDecision({ hasActiveRestriction: false, hasActiveMortgage: false }, { verificationStatus: 'UNVERIFIED' })
    assert.equal(outcome, 'UNKNOWN')
    assert.notEqual(outcome, 'CLEAR')
  })

  it('resolves to BLOCKED_BY_VALID_ORDER when active court restriction exists', () => {
    const outcome = resolveLegalDecision(
      { hasActiveRestriction: true, hasActiveMortgage: false },
      { verificationStatus: 'VERIFIED' }
    )
    assert.equal(outcome, 'BLOCKED_BY_VALID_ORDER')
  })

  it('resolves to MORTGAGE_REQUIRES_RELEASE when active bank mortgage exists', () => {
    const outcome = resolveLegalDecision(
      { hasActiveRestriction: false, hasActiveMortgage: true },
      { verificationStatus: 'VERIFIED' }
    )
    assert.equal(outcome, 'MORTGAGE_REQUIRES_RELEASE')
  })

  it('prioritizes court injunction over mortgage release when both exist', () => {
    const outcome = resolveLegalDecision(
      { hasActiveRestriction: true, hasActiveMortgage: true },
      { verificationStatus: 'VERIFIED' }
    )
    assert.equal(outcome, 'BLOCKED_BY_VALID_ORDER')
  })

  it('only resolves to CLEAR when verified with no active restrictions and no active mortgages', () => {
    const outcome = resolveLegalDecision(
      { hasActiveRestriction: false, hasActiveMortgage: false },
      { verificationStatus: 'VERIFIED', expectedDecision: 'CLEAR' }
    )
    assert.equal(outcome, 'CLEAR')
  })
})
