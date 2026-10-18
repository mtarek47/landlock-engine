import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, hasRole } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !hasRole(roles)) {
    return (
      <Navigate
        to="/access-denied"
        state={{
          attemptedPath: location.pathname,
          requiredRoles: Array.isArray(roles) ? roles : [roles],
        }}
        replace
      />
    )
  }

  return children
}

