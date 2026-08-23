import { Link } from 'react-router-dom'

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <span className="material-symbols-outlined text-[16px]">chevron_right</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span className="text-charcoal font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumb
