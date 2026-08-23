import { cn } from '../../utils/helpers'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className,
  siblingCount = 1,
  showPrevNext = true,
}) => {
  const pages = getPageNumbers(currentPage, totalPages, siblingCount)

  const goTo = (p) => {
    if (p < 1 || p > totalPages || p === currentPage) return
    onPageChange?.(p)
  }

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      {showPrevNext && (
        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-sm text-charcoal transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            aria-label={`Go to page ${p}`}
            aria-current={p === currentPage ? 'page' : undefined}
            className={cn(
              'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors',
              p === currentPage
                ? 'border-primary bg-primary text-white shadow-soft'
                : 'border-border bg-white text-charcoal hover:bg-background'
            )}
          >
            {p}
          </button>
        )
      )}

      {showPrevNext && (
        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-sm text-charcoal transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </nav>
  )
}

function getPageNumbers(current, total, siblingCount) {
  const pages = []
  const left = Math.max(1, current - siblingCount)
  const right = Math.min(total, current + siblingCount)

  if (left > 1) {
    pages.push(1)
    if (left > 2) pages.push('...')
  }
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total) {
    if (right < total - 1) pages.push('...')
    pages.push(total)
  }
  return pages
}

export default Pagination
