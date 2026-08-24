import { cn } from '../../utils/helpers'
import AppIcon from '../ui/AppIcon';

const StatCard = ({ icon, label, value, trend, trendLabel, className, ...props }) => {
  const isPositive = trend !== undefined && trend !== null ? trend >= 0 : null

  return (
    <div className={cn('rounded-2xl border border-border bg-white p-6 shadow-subtle', className)} {...props}>
      <div className="flex items-start justify-between">
        <div>
          {label && <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>}
          {value !== undefined && <p className="mt-2 text-2xl font-bold text-charcoal tabular-nums">{value}</p>}
          {trend !== null && trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                  isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                )}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  {isPositive ? (
                    <path d="M6 8L3 5H5V4H7V5H9L6 8Z M6 3V5" fill="currentColor" />
                  ) : (
                    <path d="M6 4L9 7H7V8H5V7H3L6 4Z M6 9V7" fill="currentColor" />
                  )}
                  {/* simple arrow fallback */}
                  <path
                    d={isPositive ? 'M6 2L9 6H7.5V8H4.5V6H3L6 2Z' : 'M6 10L3 6H4.5V4H7.5V6H9L6 10Z'}
                    fill="currentColor"
                  />
                </svg>
                {isPositive ? '+' : ''}
                {trend}%
              </span>
              {trendLabel && <span className="text-xs text-muted">{trendLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/10 text-primary">
            {typeof icon === 'string' ? <AppIcon name={icon} className="text-[22px]" /> : icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
