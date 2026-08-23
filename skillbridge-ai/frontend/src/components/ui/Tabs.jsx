import { createContext, useContext, useState } from 'react'
import { cn } from '../../utils/helpers'

const TabsContext = createContext(null)

const Tabs = ({ defaultValue, value, onValueChange, children, className, ...props }) => {
  const [internal, setInternal] = useState(defaultValue)
  const isControlled = value !== undefined
  const activeValue = isControlled ? value : internal

  const handleChange = (v) => {
    if (!isControlled) setInternal(v)
    onValueChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ activeValue, onValueChange: handleChange }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = ({ children, className, ...props }) => (
  <div
    role="tablist"
    className={cn(
      'inline-flex items-center gap-1 rounded-xl border border-border bg-background p-1',
      'overflow-x-auto scrollbar-thin',
      className
    )}
    {...props}
  >
    {children}
  </div>
)

const TabsTrigger = ({ value, children, className, disabled, ...props }) => {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsTrigger must be used within Tabs')
  const isActive = ctx.activeValue === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      disabled={disabled}
      onClick={() => ctx.onValueChange(value)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed',
        isActive
          ? 'bg-white text-primary shadow-soft border border-border'
          : 'text-muted hover:text-charcoal hover:bg-white/60',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ value, children, className, ...props }) => {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('TabsContent must be used within Tabs')
  const isActive = ctx.activeValue === value
  if (!isActive) return null

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn('mt-4 focus-visible:outline-none', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
export default Tabs
