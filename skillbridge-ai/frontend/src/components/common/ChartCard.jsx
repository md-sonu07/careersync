import { cn } from '../../utils/helpers'

const ChartCard = ({
  title,
  subtitle,
  actions,
  children,
  className,
  contentClassName,
  height = 260,
  placeholder = false,
  ...props
}) => (
  <div className={cn('rounded-2xl border border-border bg-white shadow-subtle overflow-hidden', className)} {...props}>
    {(title || subtitle || actions) && (
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
        <div className="min-w-0">
          {title && <h3 className="text-base font-semibold text-charcoal">{title}</h3>}
          {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    )}
    <div className={cn('p-6', contentClassName)}>
      {children ? (
        <div style={{ height, minHeight: height }} className="w-full">
          {children}
        </div>
      ) : placeholder ? (
        <div
          style={{ height, minHeight: height }}
          className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/50"
          role="img"
          aria-label="Chart placeholder"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-border text-muted mb-3">
            <span className="material-symbols-outlined text-[22px]">bar_chart</span>
          </div>
          <p className="text-sm font-medium text-muted">Chart preview</p>
          <p className="text-xs text-muted/70">Canvas area {height}px</p>
          {/* subtle canvas-style grid */}
          <div
            className="mt-4 h-16 w-3/4 rounded-lg opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(to right, #E5E0D7 1px, transparent 1px), linear-gradient(to bottom, #E5E0D7 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            aria-hidden
          />
        </div>
      ) : (
        <div
          style={{ height, minHeight: height }}
          className="w-full rounded-xl bg-background border border-border flex items-center justify-center"
          aria-label="Chart canvas"
        >
          <canvas
            style={{ width: '100%', height: '100%' }}
            aria-label={title ? `${title} chart` : 'Chart canvas'}
          />
        </div>
      )}
    </div>
  </div>
)

export default ChartCard
