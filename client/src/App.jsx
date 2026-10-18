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
import BankMortgagePage from './pages/BankMortgagePage'
import AuditPage from './pages/AuditPage'
import CitizenSearchPage from './pages/CitizenSearchPage'
import PublicCertificateVerificationPage from './pages/PublicCertificateVerificationPage'
import OrderApprovalPage from './pages/OrderApprovalPage'
import MouzaMapPage from './pages/MouzaMapPage'
import AccessDeniedPage from './pages/AccessDeniedPage'

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
            {/* Screen 1: ল্যান্ডিং পেজ */}
            <Route path="/" element={<LandingPage />} />

            {/* Screen 9: লগইন পেজ */}
            <Route path="/login" element={<LoginPage />} />

            {/* Screens 2 & 3: নাগরিক জমি অনুসন্ধান ও ফলাফল পেজ */}
            <Route path="/citizen" element={<CitizenSearchPage />} />

            {/* Screen 8: কিউআর সার্টিফিকেট ভেরিফিকেশন */}
            <Route path="/verify-certificate" element={<PublicCertificateVerificationPage />} />
            <Route path="/verify-certificate/:id" element={<PublicCertificateVerificationPage />} />
            <Route path="/verify" element={<PublicCertificateVerificationPage />} />
            <Route path="/certificate" element={<PublicCertificateVerificationPage />} />
            <Route path="/certificate/:id" element={<PublicCertificateVerificationPage />} />

            {/* Authenticated Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Screen 4: কোর্ট অর্ডার পোর্টাল */}
            <Route path="/cases" element={<CasesPage />} />

            {/* Screen 5: রেজিস্ট্রি অফিসার ডিসিশন কনসোল */}
            <Route path="/registry" element={<RegistryCheckPage />} />

            {/* Screen 6: ব্যাংক পোর্টাল (বন্ধক ও মুক্তি ব্যবস্থাপনা) */}
            <Route path="/bank" element={<BankMortgagePage />} />
            <Route path="/mortgages" element={<BankMortgagePage />} />

            {/* Screen 7: অডিট ট্রেইল ও অ্যাডমিন ড্যাশবোর্ড */}
            <Route
              path="/audit"
              element={
                <ProtectedRoute roles={['AUDITOR', 'SYSTEM_ADMIN']}>
                  <AuditPage />
                </ProtectedRoute>
              }
            />

            {/* Additional Protected Workspaces */}
            <Route
              path="/approvals"
              element={
                <ProtectedRoute roles={['ORDER_APPROVER', 'SYSTEM_ADMIN']}>
                  <OrderApprovalPage />
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
            <Route path="/map" element={<MouzaMapPage />} />

            {/* HTTP 403: অননুমোদিত প্রবেশাধিকার পেজ */}
            <Route path="/access-denied" element={<AccessDeniedPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
