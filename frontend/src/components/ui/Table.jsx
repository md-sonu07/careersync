import { cn } from '../../utils/helpers'

const Table = ({ children, className, ...props }) => (
  <div className="w-full overflow-x-auto rounded-2xl border border-border bg-white shadow-subtle">
    <table className={cn('w-full text-left text-sm', className)} {...props}>
      {children}
    </table>
  </div>
)

const THead = ({ children, className, ...props }) => (
  <thead className={cn('bg-background border-b border-border', className)} {...props}>
    {children}
  </thead>
)

const TBody = ({ children, className, ...props }) => (
  <tbody className={cn('divide-y divide-border', className)} {...props}>
    {children}
  </tbody>
)

const TR = ({ children, className, ...props }) => (
  <tr className={cn('transition-colors hover:bg-background/60', className)} {...props}>
    {children}
  </tr>
)

const TH = ({ children, className, ...props }) => (
  <th className={cn('px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted', className)} {...props}>
    {children}
  </th>
)

const TD = ({ children, className, ...props }) => (
  <td className={cn('px-4 py-3 text-sm text-charcoal', className)} {...props}>
    {children}
  </td>
)

export { Table, THead, TBody, TR, TH, TD }
export default Table
