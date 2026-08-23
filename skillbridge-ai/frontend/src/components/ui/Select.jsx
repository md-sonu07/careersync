import { cn } from '../../utils/helpers'

const Select = ({
  label,
  id,
  options = [],
  placeholder = 'Select an option',
  error,
  hint,
  required,
  className,
  wrapperClassName,
  children,
  ...props
}) => {
  const selectId = id || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-charcoal">
          {label}
          {required && <span className="text-danger ml-1" aria-hidden>*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          className={cn(
            'w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-charcoal shadow-soft transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border',
            props.disabled && 'bg-background cursor-not-allowed opacity-60',
            className
          )}
          {...props}
        >
          {children ? children : (
            <>
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((opt) => {
                const value = typeof opt === 'string' ? opt : opt.value
                const labelText = typeof opt === 'string' ? opt : opt.label
                const disabled = typeof opt === 'object' ? opt.disabled : false
                return (
                  <option key={value} value={value} disabled={disabled}>
                    {labelText}
                  </option>
                )
              })}
            </>
          )}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {hint && !error && (
        <p id={`${selectId}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${selectId}-error`} role="alert" className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
