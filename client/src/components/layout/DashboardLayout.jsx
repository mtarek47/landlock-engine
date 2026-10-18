import { useState } from 'react'
import GovernmentHeader from './GovernmentHeader'
import Sidebar from './Sidebar'
import GovernmentFooter from './GovernmentFooter'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-govt-paper font-bangla text-gray-900 selection:bg-govt-green selection:text-white">
      {/* Institutional Top Header */}
      <GovernmentHeader
        showSidebarToggle={true}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        variant="authenticated"
      />

      {/* Main layout container with sidebar and content */}
      <div className="flex flex-1 relative">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main
          id="main-content"
          tabIndex="-1"
          className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 focus:outline-none"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Institutional Footer */}
      <GovernmentFooter />
    </div>
  )
}
