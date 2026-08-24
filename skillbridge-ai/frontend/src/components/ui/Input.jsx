import { cn } from '../../utils/helpers'
import AppIcon from './AppIcon';

const Input = ({
  label,
  id,
  error,
  icon,
  iconPosition = 'left',
  className,
  wrapperClassName,
  required,
  hint,
  ...props
}) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-charcoal">
          {label}
          {required && <span className="text-danger ml-1" aria-hidden>*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && iconPosition === 'left' && (
          <span className="absolute left-3 text-muted pointer-events-none flex items-center text-[18px]">
            {typeof icon === 'string' ? <AppIcon name={icon} className="text-[20px]" /> : icon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          required={required}
          className={cn(
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted/60 shadow-soft transition-colors',
            error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border',
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            props.disabled && 'bg-background cursor-not-allowed opacity-60',
            className
          )}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <span className="absolute right-3 text-muted pointer-events-none flex items-center text-[18px]">
            {typeof icon === 'string' ? <AppIcon name={icon} className="text-[20px]" /> : icon}
          </span>
        )}
      </div>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
