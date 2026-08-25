import { cn } from '../../utils/helpers'

const Card = ({ children, className, hover = false, glass = false, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border-light bg-card-bg p-6',
        hover ? 'shadow-subtle hover:shadow-card transition-shadow duration-300' : 'shadow-subtle',
        glass && 'glass-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, className, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
)

export const CardTitle = ({ children, className, ...props }) => (
  <h3 className={cn('text-lg font-bold text-charcoal', className)} {...props}>
    {children}
  </h3>
)

export const CardDescription = ({ children, className, ...props }) => (
  <p className={cn('text-sm text-charcoal/70 leading-relaxed', className)} {...props}>
    {children}
  </p>
)

export default Card
