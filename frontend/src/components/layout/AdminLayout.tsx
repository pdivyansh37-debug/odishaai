import React from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  MapPin,
  FileBarChart,
  LogOut,
  ShieldCheck,
  User,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { officer, token, logout, isAuthenticated } = useAuthStore()

  // Guard: if not authenticated, redirect to login
  React.useEffect(() => {
    if (!token) {
      navigate('/admin/login')
    }
  }, [token, navigate])

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/grievances', label: 'Grievances', icon: ClipboardList },
    { to: '/admin/map', label: 'GIS Heatmap', icon: MapPin },
    { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
  ]

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col justify-between border-r border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-xl font-bold shadow-sm">
              🏛️
            </div>
            <div>
              <div className="font-bold text-base tracking-wide text-white">GraamSeva Admin</div>
              <div className="text-xs text-emerald-400 font-medium">Odisha Governance Portal</div>
            </div>
          </div>

          {/* Officer mini profile */}
          <div className="px-5 py-4 border-b border-slate-800/60 bg-slate-800/30">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
                <User className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold text-white truncate">
                  {officer?.name || 'Panchayat Officer'}
                </div>
                <div className="text-xs text-slate-400 truncate capitalize">
                  {officer?.role || 'Officer'} • {officer?.district || 'Odisha'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = location.pathname.startsWith(item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Bottom controls */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-emerald-400 transition-colors px-2 py-1"
          >
            <span>← Return to Citizen Portal</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

