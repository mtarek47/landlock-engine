import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Shield, Lock, Menu, X, Search, Building2, FileCheck, QrCode, Map } from 'lucide-react'

export default function PublicNavbar() {
  const { pathname, hash } = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: 'হোম', icon: Home },
    { path: '/citizen', label: 'জমি অনুসন্ধান', icon: Search },
    { path: '/map', label: 'মৌজা নকশা (GIS)', icon: Map },
    { path: '/#services', label: 'সেবাসমূহ', icon: Shield },
    { path: '/#faq', label: 'সহায়তা', icon: Building2 },
    { path: '/#contact', label: 'যোগাযোগ', icon: FileCheck },
  ]

  const handleNavClick = (path, e) => {
    if (path.includes('#')) {
      const targetId = path.split('#')[1]
      const element = document.getElementById(targetId)
      if (element && (pathname === '/' || pathname === '')) {
        e.preventDefault()
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMobileMenuOpen(false)
        return
      }
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      aria-label="পাবলিক নেভিগেশন বার"
      className="bg-white border-b border-govt-border z-20 select-none shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isAnchor = path.includes('#')
              const targetHash = isAnchor ? '#' + path.split('#')[1] : ''
              const isActive = isAnchor
                ? pathname === '/' && hash === targetHash
                : pathname === path && !hash

              return (
                <Link
                  key={path}
                  to={path}
                  onClick={(e) => handleNavClick(path, e)}
                  className={`inline-flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-govt-green text-govt-green font-semibold bg-green-50/30'
                      : 'border-transparent text-gray-700 hover:text-govt-green hover:border-green-200 hover:bg-gray-50/50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={14}
                    className={isActive ? 'text-govt-green' : 'text-gray-400'}
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right: Service note */}
          <div className="hidden lg:flex items-center text-xs text-gray-500 py-3 shrink-0">
            <span className="font-inter">Free Public Service • No Account Required</span>
          </div>

          {/* Mobile: label + toggle */}
          <div className="sm:hidden flex items-center justify-between w-full py-2">
            <span className="text-xs font-semibold text-govt-green">পাবলিক সার্ভিস মেনু</span>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-govt-green"
              aria-label="পাবলিক নেভিগেশন ড্রপডাউন"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="sm:hidden pb-2 border-t border-govt-border space-y-0.5 pt-1">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const isAnchor = path.includes('#')
              const targetHash = isAnchor ? '#' + path.split('#')[1] : ''
              const isActive = isAnchor
                ? pathname === '/' && hash === targetHash
                : pathname === path && !hash

              return (
                <Link
                  key={path}
                  to={path}
                  onClick={(e) => handleNavClick(path, e)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm rounded transition-colors ${
                    isActive
                      ? 'bg-govt-green text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-govt-green'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
