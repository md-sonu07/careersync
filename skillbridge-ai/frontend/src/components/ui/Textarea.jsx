import { cn } from '../../utils/helpers'

const Textarea = ({
  label,
  id,
  error,
  hint,
  required,
  className,
  wrapperClassName,
  rows = 4,
  showCount,
  maxLength,
  value,
  ...props
}) => {
  const textareaId = id || `textarea-${label?.toLowerCase().replace(/\s+/g, '-')}`
  const charCount = typeof value === 'string' ? value.length : 0

  return (
    <div className={cn('flex flex-col gap-1.5', wrapperClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-charcoal">
          {label}
          {required && <span className="text-danger ml-1" aria-hidden>*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        maxLength={maxLength}
        value={value}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
        className={cn(
          'w-full resize-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted/60 shadow-soft transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          error ? 'border-danger focus:ring-danger/20 focus:border-danger' : 'border-border',
          props.disabled && 'bg-background cursor-not-allowed opacity-60',
          className
        )}
        {...props}
      />
      <div className="flex items-center justify-between">
        <div>
          {hint && !error && (
            <p id={`${textareaId}-hint`} className="text-xs text-muted">
              {hint}
            </p>
          )}
          {error && (
            <p id={`${textareaId}-error`} role="alert" className="text-xs font-medium text-danger">
              {error}
            </p>
          )}
        </div>
        {(showCount || maxLength) && (
          <span className="text-xs text-muted tabular-nums">
            {charCount}
            {maxLength ? ` / ${maxLength}` : ''}
          </span>
        )}
      </div>
    </div>
  )
}

export default Textarea
