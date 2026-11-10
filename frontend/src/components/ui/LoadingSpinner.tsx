import clsx from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string
}

export default function LoadingSpinner({
  size = 'md',
  className,
  color = 'border-primary',
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={clsx(
        'rounded-full border-t-transparent animate-spin',
        sizes[size],
        color,
        className
      )}
      style={{ borderTopColor: 'transparent' }}
    />
  )
}
