import { cn } from '../../utils/helpers'
import AppIcon from './AppIcon';

const variants = {
  info: 'bg-primary/5 border-primary/20 text-primary',
  success: 'bg-success/10 border-success/20 text-success',
  warning: 'bg-accent/10 border-accent/20 text-charcoal',
  danger: 'bg-danger/10 border-danger/20 text-danger',
}

const iconMap = {
  info: 'info',
  success: 'check_circle',
  warning: 'warning',
  danger: 'error',
}

const Alert = ({ variant = 'info', title, children, icon, onClose, className, ...props }) => (
  <div
    role="alert"
    className={cn('relative flex gap-3 rounded-xl border px-4 py-3 text-sm', variants[variant], className)}
    {...props}
  >
    <span className="shrink-0 mt-0.5">
      {icon ? (
        typeof icon === 'string' ? <AppIcon name={icon} className="text-[20px]" /> : icon
      ) : (
        <span className="material-symbols-outlined text-[20px]">{iconMap[variant]}</span>
      )}
    </span>
    <div className="flex-1">
      {title && <p className="font-semibold leading-none mb-1">{title}</p>}
      {children && <div className={cn('leading-relaxed', variant === 'info' ? 'text-charcoal/80' : 'opacity-90')}>{children}</div>}
    </div>
    {onClose && (
      <button
        onClick={onClose}
        aria-label="Dismiss alert"
        className="shrink-0 rounded-lg p-1 opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    )}
  </div>
)

export default Alert
