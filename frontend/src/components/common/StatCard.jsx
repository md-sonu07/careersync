import { cn } from '../../utils/helpers'
import AppIcon from '../ui/AppIcon';

const StatCard = ({ icon, label, value, trend, trendLabel, className, ...props }) => {
  const isPositive = trend !== undefined && trend !== null ? trend >= 0 : null

  return (
    <div className={cn('rounded-2xl border border-border bg-white p-5 shadow-subtle flex flex-col justify-between overflow-hidden min-w-0', className)} {...props}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {label && <p className="text-xs font-semibold uppercase tracking-wider text-muted leading-snug">{label}</p>}
          {value !== undefined && <p className="mt-2 text-2xl font-bold text-charcoal tabular-nums leading-none">{value}</p>}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/10 text-primary shrink-0">
            {typeof icon === 'string' ? <AppIcon name={icon} className="text-[20px]" /> : icon}
          </div>
        )}
      </div>

      {trend !== null && trend !== undefined && (
        <div className="mt-3 pt-2.5 border-t border-border/40 flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold shrink-0',
              isPositive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            )}
          >
            <AppIcon name={isPositive ? 'arrow_upward' : 'arrow_downward'} className="text-[12px]" />
            {isPositive ? '+' : ''}
            {trend}%
          </span>
          {trendLabel && <span className="text-xs text-muted truncate">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}

export default StatCard
