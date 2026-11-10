import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, AlertCircle, FileText, MapPin, Clock, CheckCircle } from 'lucide-react'
import Header from '../../components/layout/Header'
import GrievanceStatusTimeline from '../../components/grievance/GrievanceStatusTimeline'
import { trackGrievance } from '../../api/grievances'
import toast from 'react-hot-toast'

export default function TrackGrievancePage() {
  const [searchParams] = useSearchParams()
  const [ticketIdInput, setTicketIdInput] = useState('')
  const [grievance, setGrievance] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const qTicket = searchParams.get('ticket')
    if (qTicket) {
      setTicketIdInput(qTicket)
      handleTrack(qTicket)
    }
  }, [searchParams])

  const handleTrack = async (ticketToSearch?: string) => {
    const tId = ticketToSearch || ticketIdInput.trim()
    if (!tId) {
      toast.error('Please enter a ticket ID')
      return
    }

    setIsLoading(true)
    try {
      const data = await trackGrievance(tId)
      setGrievance(data)
    } catch (err: any) {
      console.error('Tracking error:', err)
      toast.error('Ticket not found. Please verify the ID.')
      setGrievance(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
            Real-Time SLA Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ଅଭିଯୋଗର ସ୍ଥିତି ଯାଞ୍ଚ କରନ୍ତୁ
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track your complaint status, assigned officer, and resolution SLA deadline.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleTrack()
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={ticketIdInput}
              onChange={(e) => setTicketIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. GS-ROAD-2026-001001"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 uppercase font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !ticketIdInput.trim()}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xs transition-colors disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Searching...' : 'Track / ଖୋଜନ୍ତୁ'}</span>
            </button>
          </form>
        </div>

        {/* Grievance Details Card */}
        {grievance && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Ticket ID</span>
                <h2 className="text-xl font-black text-slate-900 font-mono tracking-wide">
                  {grievance.ticket_id}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                  {grievance.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  {grievance.status}
                </span>
              </div>
            </div>

            {/* Department & Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-medium">Assigned Department:</span>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">
                  {grievance.dept_assigned || 'Works / Rural Department'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Citizen Mobile:</span>
                <p className="font-semibold text-slate-800 text-sm mt-0.5">
                  {grievance.citizen_phone || 'Confidential'}
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Complaint Description / ବିବରଣୀ
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
                {grievance.description}
              </p>
            </div>

            {/* Photo if present */}
            {grievance.image_url && (
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Uploaded Photo Evidence / ପ୍ରମାଣ ଫଟୋ
                </h4>
                <img
                  src={grievance.image_url}
                  alt="Evidence"
                  className="w-full max-h-60 object-cover rounded-xl border border-slate-200"
                />
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Live Resolution Timeline / ସ୍ଥିତି ବିବରଣୀ
              </h4>
              <GrievanceStatusTimeline
                status={grievance.status}
                createdAt={grievance.created_at}
                slaDeadline={grievance.sla_deadline}
                resolvedAt={grievance.resolved_at}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

