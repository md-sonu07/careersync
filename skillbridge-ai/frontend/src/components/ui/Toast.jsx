import { useEffect, useState } from 'react'
import { cn } from '../../utils/helpers'

const Toast = ({ message, variant = 'default', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!onClose) return
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  const variants = {
    default: 'bg-charcoal text-white',
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-white',
  }

  if (!message) return null
  return (
    <div className={cn('fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-lg px-4 py-3 shadow-card', variants[variant])}>
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-2 rounded-lg bg-white/20 p-1">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  )
}
export default Toast
