import GovernmentHeader from './GovernmentHeader'
import PublicNavbar from './PublicNavbar'
import GovernmentFooter from './GovernmentFooter'

export default function PublicLayout({
  children,
  showNavbar = true,
  className = '',
}) {
  return (
    <div className="min-h-screen flex flex-col bg-govt-paper font-bangla text-gray-900 selection:bg-govt-green selection:text-white">
      {/* Public Institutional Header */}
      <GovernmentHeader variant="public" />

      {/* Public Secondary Navigation Bar */}
      {showNavbar && <PublicNavbar />}

      {/* Main Public Content */}
      <main id="main-content" tabIndex="-1" className={`flex-1 focus:outline-none ${className}`}>
        {children}
      </main>

      {/* Institutional Footer */}
      <GovernmentFooter />
    </div>
  )
}
