import { cn } from '../../utils/helpers'

const ProgressBar = ({ value = 0, max = 100, className, barClassName, showLabel = false, size = 'md', label, ...props }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      {(label || showLabel) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-sm font-medium text-charcoal">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-muted tabular-nums">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-background border border-border', heights[size])}>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          style={{ width: `${percentage}%` }}
          className={cn('h-full rounded-full bg-primary transition-all duration-500 ease-out', barClassName)}
        />
      </div>
    </div>
  )
}

const ProgressRing = ({ value = 0, max = 100, size = 80, strokeWidth = 6, className, showLabel = true, label, ...props }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn('inline-flex flex-col items-center gap-2', className)} {...props}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5E0D7" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#315C4D"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        {showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-charcoal tabular-nums">
            {Math.round(percentage)}%
          </span>
        )}
        <span className="sr-only" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
          {Math.round(percentage)}% progress
        </span>
      </div>
      {label && <span className="text-xs font-medium text-muted text-center">{label}</span>}
    </div>
  )
}

export { ProgressBar, ProgressRing }
export default ProgressBar
