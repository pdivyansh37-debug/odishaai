import React from 'react'
import { CheckCircle2, Clock, AlertTriangle, ArrowUpRight, UserCheck } from 'lucide-react'

interface GrievanceStatusTimelineProps {
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'overdue' | 'escalated'
  createdAt: string
  slaDeadline?: string
  resolvedAt?: string
}

export default function GrievanceStatusTimeline({
  status,
  createdAt,
  slaDeadline,
  resolvedAt,
}: GrievanceStatusTimelineProps) {
  const steps = [
    { key: 'pending', label: 'Complaint Registered / ଅଭିଯୋଗ ଦାଖଲ', icon: Clock },
    { key: 'assigned', label: 'Assigned to Field Officer / ଅଧିକାରୀଙ୍କୁ ପ୍ରଦାନ', icon: UserCheck },
    { key: 'in_progress', label: 'Action in Progress / କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଚାଲୁଅଛି', icon: ArrowUpRight },
    { key: 'resolved', label: 'Resolved / ସମାଧାନ ହୋଇଛି', icon: CheckCircle2 },
  ]

  const getStepIndex = (s: string) => {
    switch (s) {
      case 'pending':
        return 0
      case 'assigned':
        return 1
      case 'in_progress':
        return 2
      case 'resolved':
        return 3
      case 'overdue':
        return 2
      case 'escalated':
        return 2
      default:
        return 0
    }
  }

  const currentIndex = getStepIndex(status)
  const isOverdue = status === 'overdue' || status === 'escalated'

  return (
    <div className="py-4">
      {/* Alert if overdue or escalated */}
      {isOverdue && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>
            {status === 'escalated'
              ? '🚨 Complaint has been escalated to District Collector due to SLA breach.'
              : '⚠️ Complaint is overdue and being prioritized.'}
          </span>
        </div>
      )}

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((step, idx) => {
          const isDone = idx < currentIndex || (idx === 3 && status === 'resolved')
          const isCurrent = idx === currentIndex && status !== 'resolved'
          const Icon = step.icon

          return (
            <div key={step.key} className="relative flex items-start space-x-3">
              {/* Dot / Icon */}
              <div
                className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-xs ${
                  isDone
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                    : 'bg-slate-100 text-slate-400 border border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <div
                  className={`text-sm font-semibold leading-none ${
                    isDone
                      ? 'text-emerald-800'
                      : isCurrent
                      ? 'text-amber-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </div>
                {idx === 0 && (
                  <div className="text-xs text-slate-500 mt-1">
                    Filed on {new Date(createdAt).toLocaleDateString()}
                  </div>
                )}
                {idx === 2 && slaDeadline && (
                  <div className="text-xs text-slate-500 mt-1">
                    SLA Deadline: {new Date(slaDeadline).toLocaleDateString()}
                  </div>
                )}
                {idx === 3 && resolvedAt && (
                  <div className="text-xs text-emerald-600 mt-1 font-medium">
                    Resolved on {new Date(resolvedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

