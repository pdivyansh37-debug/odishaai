import clsx from 'clsx'
import { GrievanceStatus } from '../../types'

interface BadgeProps {
  status: GrievanceStatus | string
  className?: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'ଅପେକ୍ଷାରତ', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  assigned: { label: 'ନିଯୁକ୍ତ', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_progress: { label: 'ଚାଲୁ ଅଛି', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  resolved: { label: 'ସମାଧାନ', className: 'bg-green-100 text-green-800 border-green-200' },
  overdue: { label: 'ବିଳମ୍ବିତ', className: 'bg-red-100 text-red-800 border-red-200' },
  escalated: { label: 'ଉଚ୍ଚ ସ୍ତରରେ', className: 'bg-orange-100 text-orange-800 border-orange-200' },
}

export default function Badge({ status, className }: BadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
