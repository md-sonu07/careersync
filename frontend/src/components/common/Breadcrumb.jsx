import { Link } from 'react-router-dom'
import AppIcon from '../ui/AppIcon';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-1">
          {i > 0 && <AppIcon name="chevron_right" className="text-[16px]" />}
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
