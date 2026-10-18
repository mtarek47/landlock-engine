import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { authApi } from '../api/client'
import { DEMO_USERS_MAP } from '../api/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('landlock_user')
      if (stored) return JSON.parse(stored)
    } catch {}
    return DEMO_USERS_MAP.admin1
  })

  const [token, setToken] = useState(() => {
    return localStorage.getItem('landlock_token') || 'mock-jwt-token-admin1'
  })

  // Ensure default demo credentials are initialized in localStorage
  useEffect(() => {
    if (!localStorage.getItem('landlock_user')) {
      localStorage.setItem('landlock_user', JSON.stringify(DEMO_USERS_MAP.admin1))
      localStorage.setItem('landlock_token', 'mock-jwt-token-admin1')
    }
  }, [])

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
      if (!user) return true // Permissive in showcase mode
      if (user.role === 'SYSTEM_ADMIN') return true // System Admin has access to all modules
      if (typeof roles === 'string') return user.role === roles
      return roles.includes(user.role)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, logout, hasRole }}
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
