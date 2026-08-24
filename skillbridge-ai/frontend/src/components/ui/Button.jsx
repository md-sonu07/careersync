import { cn } from '../../utils/helpers'
import AppIcon from './AppIcon';

/**
 * Centralized Button - uses :root theme colors (primary/accent)
 * variants: primary | secondary | ghost | outline
 * sizes: sm | md | lg
 */
const Button = ({ children, variant = 'primary', size = 'md', className, icon, ...props }) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'btn-primary', // defined in index.css -> var(--primary)
    secondary: 'btn-secondary',
    ghost: 'text-primary hover:bg-primary/5',
    outline: 'border border-border-light bg-white hover:bg-surface text-charcoal',
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    xl: 'h-12 px-8 text-base',
  }

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
      {icon && <AppIcon name={icon} className="text-[20px]" />}
    </button>
  )
}

export default Button
