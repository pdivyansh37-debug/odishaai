import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  title?: string
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, title, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-sm border border-gray-100 p-6',
        hover && 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {children}
    </div>
  )
}
