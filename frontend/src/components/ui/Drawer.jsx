import { useEffect, useRef } from 'react'
import { cn } from '../../utils/helpers'

const Drawer = ({
  open,
  onClose,
  children,
  title,
  description,
  side = 'right',
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className,
}) => {
  const panelRef = useRef(null)

  const sizeMap = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]',
    xl: 'w-[560px]',
  }

  useEffect(() => {
    if (!open) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  // Focus trap: focus panel on open
  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 flex overflow-hidden">
      <div
        onClick={() => closeOnOverlay && onClose?.()}
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        aria-hidden
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'drawer-title' : undefined}
        className={cn(
          'relative flex h-full flex-col bg-white shadow-card transition-transform duration-300 ease-out focus:outline-none',
          'border-border',
          side === 'right' ? 'ml-auto border-l' : 'mr-auto border-r',
          sizeMap[size],
          'max-w-[90vw]',
          className
        )}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
            <div>
              {title && (
                <h2 id="drawer-title" className="text-lg font-semibold text-charcoal">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="rounded-lg p-1.5 cursor-pointer text-muted transition-colors hover:bg-background hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                  <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  )
}

export default Drawer
