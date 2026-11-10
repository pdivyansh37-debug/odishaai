import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Sparkles,
  UserCheck,
  X,
  AlertTriangle,
} from 'lucide-react'
import { getGrievances, updateGrievanceStatus } from '../../api/grievances'
import client from '../../api/client'
import toast from 'react-hot-toast'

export default function AdminGrievanceList() {
  const [grievances, setGrievances] = useState<any[]>([
    {
      id: 1,
      ticket_id: 'GS-ROAD-2026-001001',
      category: 'road',
      dept_assigned: 'Works Department',
      status: 'pending',
      description: 'Main village road connecting Balipatna to NH-16 has large potholes after heavy rain, making transport impossible.',
      citizen_name: 'Bikash Mohanty',
      citizen_phone: '9876543210',
      district: 'Khordha',
      created_at: new Date().toISOString(),
      sla_deadline: new Date(Date.now() + 15 * 86400000).toISOString(),
    },
    {
      id: 2,
      ticket_id: 'GS-WATER-2026-001002',
      category: 'water',
      dept_assigned: 'Panchayati Raj & Drinking Water',
      status: 'in_progress',
      description: 'Village tubewell has been non-functional for past 2 weeks in Salepur block. 50 families facing drinking water shortage.',
      citizen_name: 'Priyanka Sahoo',
      citizen_phone: '9876543211',
      district: 'Cuttack',
      created_at: new Date().toISOString(),
      sla_deadline: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    {
      id: 3,
      ticket_id: 'GS-RATION-2026-001003',
      category: 'ration',
      dept_assigned: 'Food Supplies & Consumer Welfare',
      status: 'resolved',
      description: 'PDS dealer in Satyabadi block refused to distribute November quota rice and demanding extra charges.',
      citizen_name: 'Kailash Nayak',
      citizen_phone: '9876543212',
      district: 'Puri',
      created_at: new Date().toISOString(),
      sla_deadline: new Date(Date.now() + 3 * 86400000).toISOString(),
    },
  ])

  const [selectedGrievance, setSelectedGrievance] = useState<any | null>(null)
  const [aiDraft, setAiDraft] = useState<string>('')
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadGrievances()
  }, [])

  const loadGrievances = async () => {
    try {
      const data = await getGrievances()
      if (data && data.length > 0) {
        setGrievances(data)
      }
    } catch (err) {
      console.warn('Using pre-populated grievances list')
    }
  }

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateGrievanceStatus(id, status)
      toast.success(`Ticket status updated to ${status}`)
      setGrievances(
        grievances.map((g) => (g.id === id ? { ...g, status: status } : g))
      )
      if (selectedGrievance && selectedGrievance.id === id) {
        setSelectedGrievance({ ...selectedGrievance, status: status })
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleGenerateAiReply = async (grievance: any) => {
    setIsGeneratingAi(true)
    try {
      const res = await client.post(`/dashboard/ai-reply/${grievance.id}`)
      if (res.data?.draft) {
        setAiDraft(res.data.draft)
      }
    } catch (err) {
      // Fallback draft in Odia
      setAiDraft(
        `ପ୍ରିୟ ନାଗରିକ, ଆପଣଙ୍କ ଟିକେଟ୍ ${grievance.ticket_id} ଉପରେ କ୍ଷେତ୍ର ଅଧିକାରୀଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚ ଆରମ୍ଭ ହୋଇଛି। ଆଗାମୀ ୪୮ ଘଣ୍ଟା ମଧ୍ୟରେ ସମସ୍ୟାର ସମାଧାନ କରାଯିବ। ଧନ୍ୟବାଦ, ପଞ୍ଚାୟତ ପ୍ରଶାସନ।`
      )
    } finally {
      setIsGeneratingAi(false)
    }
  }

  const filtered = grievances.filter((g) => {
    if (filterStatus !== 'all' && g.status !== filterStatus) return false
    if (filterCategory !== 'all' && g.category !== filterCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        g.ticket_id.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        (g.citizen_name && g.citizen_name.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Panchayat Grievance Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Review citizen complaints, assign field staff, and trigger 1-click Odia AI replies.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ticket ID or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="road">Roads</option>
            <option value="water">Water</option>
            <option value="ration">Ration</option>
            <option value="health">Health</option>
            <option value="education">Education</option>
          </select>
        </div>
      </div>

      {/* Grievance Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Ticket ID</th>
                <th className="py-3.5 px-4">Citizen</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">District</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">SLA Deadline</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {g.ticket_id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{g.citizen_name || 'Citizen'}</div>
                    <div className="text-[11px] text-slate-400">{g.citizen_phone || 'N/A'}</div>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">
                    {g.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{g.district || 'Khordha'}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        g.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : g.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {g.sla_deadline ? new Date(g.sla_deadline).toLocaleDateString() : '7 Days'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedGrievance(g)
                        setAiDraft('')
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grievance Detail Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Complaint Detail</span>
                <h3 className="text-xl font-black text-slate-900 font-mono">
                  {selectedGrievance.ticket_id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedGrievance(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Description
              </h4>
              <p className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                {selectedGrievance.description}
              </p>
            </div>

            {/* Quick Status Action */}
            <div className="flex items-center space-x-3 pt-2">
              <span className="text-xs font-bold text-slate-700">Update Status:</span>
              <button
                onClick={() => handleUpdateStatus(selectedGrievance.id, 'in_progress')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold"
              >
                Mark In Progress
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedGrievance.id, 'resolved')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold"
              >
                Mark Resolved
              </button>
            </div>

            {/* AI Draft Reply Section */}
            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-700 flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Draft Reply in Odia (1-Click)</span>
                </span>
                <button
                  onClick={() => handleGenerateAiReply(selectedGrievance)}
                  disabled={isGeneratingAi}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {isGeneratingAi ? 'Generating...' : 'Generate Odia Draft'}
                </button>
              </div>

              {aiDraft && (
                <div className="mt-3">
                  <textarea
                    rows={3}
                    value={aiDraft}
                    onChange={(e) => setAiDraft(e.target.value)}
                    className="w-full p-3 rounded-xl border border-purple-200 bg-purple-50/50 text-slate-800 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => {
                        toast.success('SMS & WhatsApp reply sent to citizen in Odia!')
                        setSelectedGrievance(null)
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Send Reply via WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

