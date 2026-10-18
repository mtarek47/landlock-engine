import { test, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  toBengaliNumber,
  ROLE_BN,
  ROLE_EN,
  STATUS_DEFINITIONS,
} from '../src/components/design-system/constants.js'

describe('GovTech Design System Constants & Localization', () => {
  it('converts Arabic numerals to Bengali numerals accurately', () => {
    assert.equal(toBengaliNumber(0), '০')
    assert.equal(toBengaliNumber(123456789), '১২৩৪৫৬৭৮৯')
    assert.equal(toBengaliNumber('5001'), '৫০০১')
    assert.equal(toBengaliNumber('10.50'), '১০.৫০')
    assert.equal(toBengaliNumber(null), '')
  })

  it('defines Bengali localization for all 8 mandatory GovTech roles', () => {
    const requiredRoles = [
      'SYSTEM_ADMIN',
      'COURT_OFFICER',
      'ORDER_APPROVER',
      'LAND_OFFICER',
      'REGISTRY_OFFICER',
      'BANK_OFFICER',
      'AUDITOR',
      'CITIZEN',
    ]

    for (const role of requiredRoles) {
      assert.ok(ROLE_BN[role], `Missing Bengali translation for role: ${role}`)
      assert.ok(ROLE_EN[role], `Missing English translation for role: ${role}`)
    }
  })

  it('defines all authoritative legal decision and order status mappings', () => {
    const criticalStatuses = [
      'CLEAR',
      'BLOCKED_BY_VALID_ORDER',
      'MORTGAGE_REQUIRES_RELEASE',
      'REVIEW_REQUIRED',
      'PENDING_APPROVAL',
      'ACTIVE',
      'AMENDED',
      'EXPIRED',
      'REVOKED',
      'UNKNOWN',
    ]

    for (const key of criticalStatuses) {
      const def = STATUS_DEFINITIONS[key]
      assert.ok(def, `Missing status definition for: ${key}`)
      assert.ok(def.labelBn, `Missing labelBn for status: ${key}`)
      assert.ok(def.variant, `Missing visual variant for status: ${key}`)
    }
  })
})
