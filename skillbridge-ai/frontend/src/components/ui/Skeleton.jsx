import { cn } from '../../utils/helpers'

const Skeleton = ({ className, ...props }) => (
  <div className={cn('animate-pulse rounded-lg bg-border', className)} aria-hidden {...props} />
)

const SkeletonCard = ({ className, lines = 3, ...props }) => (
  <div className={cn('rounded-2xl border border-border bg-white p-6 shadow-subtle', className)} {...props} aria-hidden>
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-2.5 w-1/4" />
      </div>
    </div>
    <div className="space-y-2.5">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  </div>
)

const SkeletonTable = ({ rows = 5, cols = 4, className, ...props }) => (
  <div className={cn('rounded-2xl border border-border bg-white shadow-subtle overflow-hidden', className)} {...props} aria-hidden>
    <div className="bg-background border-b border-border p-4 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-3 flex-1" />
      ))}
    </div>
    <div className="divide-y divide-border">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
)

export { Skeleton, SkeletonCard, SkeletonTable }
export default Skeleton
