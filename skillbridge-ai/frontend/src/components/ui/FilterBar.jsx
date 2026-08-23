import { cn } from '../../utils/helpers'

const FilterBar = ({
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearAll,
  searchValue: _searchValue,
  onSearchChange: _onSearchChange,
  className,
  children,
}) => {
  const activeCount = Object.values(activeFilters).filter((v) => v !== '' && v !== undefined && v !== null && (!Array.isArray(v) || v.length > 0)).length

  // Chip for single active value
  const Chip = ({ label, onRemove }) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-charcoal shadow-soft">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label}`} className="rounded-full p-0.5 hover:bg-background transition-colors">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  )

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <div key={f.key} className="relative">
            <select
              value={activeFilters[f.key] ?? ''}
              onChange={(e) => onFilterChange?.(f.key, e.target.value)}
              className="appearance-none rounded-xl border border-border bg-white px-3.5 py-2 pr-8 text-sm text-charcoal shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              aria-label={f.label}
            >
              <option value="">{f.label}: All</option>
              {f.options?.map((opt) => {
                const val = typeof opt === 'string' ? opt : opt.value
                const lab = typeof opt === 'string' ? opt : opt.label
                return (
                  <option key={val} value={val}>
                    {lab}
                  </option>
                )
              })}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-muted">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        ))}
        {children}
        {activeCount > 0 && onClearAll && (
          <button
            onClick={onClearAll}
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors px-2"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(activeFilters).map(([key, val]) => {
            if (!val || val === '' || (Array.isArray(val) && val.length === 0)) return null
            const filter = filters.find((f) => f.key === key)
            const displayLabel = Array.isArray(val) ? val.join(', ') : String(val)
            const optionLabel = filter?.options?.find((o) => (typeof o === 'string' ? o === val : o.value === val))
            const chipLabel = `${filter?.label ?? key}: ${typeof optionLabel === 'object' ? optionLabel.label : optionLabel ?? displayLabel}`
            return <Chip key={key} label={chipLabel} onRemove={() => onFilterChange?.(key, '')} />
          })}
        </div>
      )}
    </div>
  )
}

export default FilterBar
