import { cn } from '../../utils/helpers'

const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className,
  wrapperClassName,
  disabled,
  ...props
}) => (
  <div className={cn('relative flex items-center', wrapperClassName)}>
    <span className="pointer-events-none absolute left-3 flex items-center text-muted">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M12.5 12.5L15.5 15.5M2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5C4.96243 2.5 2.5 4.96243 2.5 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        'w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-9 text-sm text-charcoal placeholder:text-muted/60 shadow-soft transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary [&::-webkit-search-cancel-button]:hidden',
        disabled && 'bg-background cursor-not-allowed opacity-60',
        className
      )}
      {...props}
    />
    {value && (
      <button
        type="button"
        onClick={() => {
          onClear?.()
          // fallback if no onClear: dispatch empty change
          if (!onClear && onChange) onChange({ target: { value: '' } })
        }}
        aria-label="Clear search"
        className="absolute right-2 rounded-lg p-1 text-muted transition-colors hover:bg-background hover:text-charcoal"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    )}
  </div>
)

export default SearchInput
