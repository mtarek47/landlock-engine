import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ParcelSearchPage from './pages/ParcelSearchPage'
import ParcelDetailPage from './pages/ParcelDetailPage'
import CasesPage from './pages/CasesPage'
import RegistryCheckPage from './pages/RegistryCheckPage'
import AuditPage from './pages/AuditPage'
import CitizenSearchPage from './pages/CitizenSearchPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/citizen" element={<CitizenSearchPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parcels"
              element={
                <ProtectedRoute>
                  <ParcelSearchPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/parcels/:id"
              element={
                <ProtectedRoute>
                  <ParcelDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cases"
              element={
                <ProtectedRoute roles={['COURT_OFFICER', 'ORDER_APPROVER', 'SYSTEM_ADMIN', 'AUDITOR']}>
                  <CasesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registry"
              element={
                <ProtectedRoute roles={['REGISTRY_OFFICER', 'BANK_OFFICER', 'SYSTEM_ADMIN']}>
                  <RegistryCheckPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute roles={['AUDITOR', 'SYSTEM_ADMIN']}>
                  <AuditPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
