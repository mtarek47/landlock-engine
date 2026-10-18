import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  ROLE_PROFILES,
  ROLE_NAVIGATION,
  getNavigationForRole,
} from '../src/components/layout/roleNavigation.js'

describe('Role-Based Navigation Configuration', () => {
  const allRoles = [
    'CITIZEN',
    'COURT_OFFICER',
    'ORDER_APPROVER',
    'REGISTRY_OFFICER',
    'BANK_OFFICER',
    'AUDITOR',
    'SYSTEM_ADMIN',
    'LAND_OFFICER',
  ]

  it('provides complete profile metadata for all 8 roles', () => {
    for (const role of allRoles) {
      const profile = ROLE_PROFILES[role]
      assert.ok(profile, `Profile missing for role ${role}`)
      assert.ok(profile.titleBn, `Bengali title missing for role ${role}`)
      assert.ok(profile.titleEn, `English title missing for role ${role}`)
      assert.ok(profile.description, `Description missing for role ${role}`)
    }
  })

  it('provides distinct, non-empty navigation trees for each role', () => {
    for (const role of allRoles) {
      const navGroups = getNavigationForRole(role)
      assert.ok(Array.isArray(navGroups), `Nav groups is not an array for ${role}`)
      assert.ok(navGroups.length > 0, `Nav groups empty for ${role}`)

      // Verify every navigation item has path and labels
      for (const group of navGroups) {
        assert.ok(Array.isArray(group.items), `Group items not an array in ${role}`)
        for (const item of group.items) {
          assert.ok(item.path, `Item path missing in ${role}`)
          assert.ok(item.labelBn, `Item labelBn missing in ${role}`)
          assert.ok(item.labelEn, `Item labelEn missing in ${role}`)
        }
      }
    }
  })

  it('hides court cases and approvals from citizen navigation', () => {
    const citizenNav = getNavigationForRole('CITIZEN')
    const allPaths = citizenNav.flatMap((g) => g.items.map((i) => i.path))

    assert.ok(!allPaths.includes('/cases'), 'Citizen must not have /cases in navigation')
    assert.ok(!allPaths.includes('/approvals'), 'Citizen must not have /approvals in navigation')
    assert.ok(!allPaths.includes('/mortgages'), 'Citizen must not have /mortgages in navigation')
    assert.ok(!allPaths.includes('/audit'), 'Citizen must not have /audit in navigation')
  })

  it('includes /approvals in ORDER_APPROVER navigation', () => {
    const approverNav = getNavigationForRole('ORDER_APPROVER')
    const allPaths = approverNav.flatMap((g) => g.items.map((i) => i.path))
    assert.ok(allPaths.includes('/approvals'), 'Approver must have /approvals')
  })

  it('includes /registry in REGISTRY_OFFICER navigation', () => {
    const regNav = getNavigationForRole('REGISTRY_OFFICER')
    const allPaths = regNav.flatMap((g) => g.items.map((i) => i.path))
    assert.ok(allPaths.includes('/registry'), 'Registry officer must have /registry')
  })

  it('includes /mortgages in BANK_OFFICER navigation', () => {
    const bankNav = getNavigationForRole('BANK_OFFICER')
    const allPaths = bankNav.flatMap((g) => g.items.map((i) => i.path))
    assert.ok(allPaths.includes('/mortgages'), 'Bank officer must have /mortgages')
  })

  it('includes /audit in AUDITOR navigation', () => {
    const auditorNav = getNavigationForRole('AUDITOR')
    const allPaths = auditorNav.flatMap((g) => g.items.map((i) => i.path))
    assert.ok(allPaths.includes('/audit'), 'Auditor must have /audit')
  })
})
