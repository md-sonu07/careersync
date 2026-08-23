import { cn } from '../../utils/helpers'

const PageHeader = ({ title, subtitle, actions, breadcrumbs, className, ...props }) => (
  <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)} {...props}>
    <div className="min-w-0">
      {breadcrumbs && <div className="mb-2 text-sm text-muted">{breadcrumbs}</div>}
      {title && <h1 className="text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">{title}</h1>}
      {subtitle && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">{actions}</div>}
  </div>
)

export default PageHeader
