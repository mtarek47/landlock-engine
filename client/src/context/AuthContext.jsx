import { createContext, useContext, useState, useCallback } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

/**
 * Returns the primary home route for a given role according to LandLock RBAC rules
 * @param {string} role
 * @returns {string} Target path
 */
export const getRoleHomeRoute = (role) => {
  switch (role) {
    case 'COURT_OFFICER':
      return '/cases'
    case 'ORDER_APPROVER':
      return '/approvals'
    case 'REGISTRY_OFFICER':
      return '/registry'
    case 'BANK_OFFICER':
      return '/mortgages'
    case 'AUDITOR':
      return '/audit'
    case 'LAND_OFFICER':
      return '/parcels'
    case 'CITIZEN':
      return '/citizen'
    case 'SYSTEM_ADMIN':
    default:
      return '/dashboard'
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('landlock_user')
      if (stored) return JSON.parse(stored)
    } catch {}
    return null
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('landlock_token') || null
  })

  const login = useCallback(async (username, password) => {
    const res = await authApi.login(username, password)
    const { token: newToken, user: newUser } = res.data.data
    localStorage.setItem('landlock_token', newToken)
    localStorage.setItem('landlock_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('landlock_token')
    localStorage.removeItem('landlock_user')
    setToken(null)
    setUser(null)
  }, [])

  const isAuthenticated = !!token && !!user

  const hasRole = useCallback(
    (roles) => {
      if (!roles) return true
      if (!user) return false
      if (user.role === 'SYSTEM_ADMIN') return true // System Admin has access to all modules
      if (typeof roles === 'string') return user.role === roles
      return roles.includes(user.role)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, hasRole, getRoleHomeRoute }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

