import { cn } from '../../utils/helpers'
import AppIcon from './AppIcon';

const EmptyState = ({
  icon,
  title = 'No results found',
  description,
  action,
  actionLabel,
  onAction,
  className,
  ...props
}) => (
  <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-8 py-12 text-center shadow-subtle', className)} {...props}>
    {icon && (
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border text-muted">
        {typeof icon === 'string' ? <AppIcon name={icon} className="text-[28px]" /> : icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-charcoal">{title}</h3>
    {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>}
    {(action || (actionLabel && onAction)) && (
      <div className="mt-6">
        {action ? (
          action
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            {actionLabel}
          </button>
        )}
      </div>
    )}
  </div>
)

export default EmptyState
