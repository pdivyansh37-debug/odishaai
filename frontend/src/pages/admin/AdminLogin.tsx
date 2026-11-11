import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { login as apiLogin } from '../../api/auth'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { setOfficer } = useAuthStore()
  const [email, setEmail] = useState('admin@graamseva.gov.in')
  const [password, setPassword] = useState('Admin@123')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await apiLogin(email, password)
      setOfficer(
        {
          id: String(data.officer_id),
          name: data.officer_name,
          email: email,
          department: 'General Administration',
          district: 'Khordha',
          role: (data.role === 'admin' ? 'admin' : 'officer'),
        },
        data.access_token
      )
      toast.success(`Welcome back, ${data.officer_name}!`)
      navigate('/admin/dashboard')
    } catch (err: any) {
      console.error('Login failed:', err)
      // Fallback for offline demo mode
      if (email === 'admin@graamseva.gov.in' && password === 'Admin@123') {
        setOfficer(
          {
            id: '1',
            name: 'Panchayat Nodal Officer',
            email: email,
            department: 'General Administration',
            district: 'Khordha',
            role: 'admin',
          },
          'demo-jwt-token'
        )
        toast.success('Signed in using Demo Mode!')
        navigate('/admin/dashboard')
      } else {
        toast.error('Invalid credentials. Check email and password.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-lg mb-4">
            🏛️
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            GraamSeva AI Officer Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Panchayat & District Governance Console • Odisha
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="mb-6 pb-4 border-b border-slate-700 text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Official Access Only</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Official Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@graamseva.gov.in"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 pt-1">
              Demo credentials pre-filled: <code>admin@graamseva.gov.in</code> / <code>Admin@123</code>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In as Officer</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Citizen Portal
          </button>
        </div>
      </div>
    </div>
  )
}

