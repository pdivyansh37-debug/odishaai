import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, MessageSquare, FileText, Search, ShieldAlert } from 'lucide-react'
import LanguageSelector from '../ui/LanguageSelector'
import { useChatStore } from '../../stores/chatStore'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { language, setLanguage } = useChatStore()

  const navLinks = [
    { to: '/', label: 'Home / ମୂଳପୃଷ୍ଠା', icon: null },
    { to: '/chat', label: 'AI Chat / କଥାବାର୍ତ୍ତା', icon: MessageSquare },
    { to: '/schemes', label: 'Schemes / ଯୋଜନା', icon: FileText },
    { to: '/grievance', label: 'File Grievance / ଅଭିଯୋଗ', icon: ShieldAlert },
    { to: '/track', label: 'Track Ticket / ସ୍ଥିତି ଯାଞ୍ଚ', icon: Search },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-none">
                GraamSeva <span className="text-amber-300">AI</span>
              </span>
              <span className="text-xs text-emerald-100 font-medium">
                ଗ୍ରାମ ସେବା AI • Odisha
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive(link.to)
                      ? 'bg-white/20 text-white shadow-sm'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right controls */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSelector value={language} onChange={setLanguage} />
            <Link
              to="/admin/login"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-800 text-emerald-100 border border-emerald-600/60 hover:bg-emerald-900 transition-colors"
            >
              Officer Portal
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center space-x-2 md:hidden">
            <LanguageSelector value={language} onChange={setLanguage} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-800 border-t border-emerald-600 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.to)
                    ? 'bg-white/20 text-white'
                    : 'text-emerald-100 hover:bg-white/10'
                }`}
              >
                {Icon && <Icon className="w-5 h-5 text-amber-300" />}
                <span>{link.label}</span>
              </Link>
            )
          })}
          <div className="pt-2 border-t border-emerald-700">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center py-2 text-sm font-semibold text-emerald-200 hover:text-white"
            >
              🧑‍💼 Panchayat Officer Login
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

