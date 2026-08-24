import { cn } from '../../utils/helpers'
import AppIcon from './AppIcon';

const Badge = ({ children, variant = 'default', className, icon, ...props }) => {
  const variants = {
    default: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-green-100 text-green-800',
    muted: 'bg-surface text-charcoal/60 border border-border-light',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <AppIcon name={icon} className="text-[14px]" />}
      {children}
    </span>
  )
}

export default Badge
