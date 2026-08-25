import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AppIcon from '../ui/AppIcon';
import { useChatContext } from '../../context/ChatContext';

export default function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { toggleChat } = useChatContext()
  const isDashboard = location.pathname.endsWith('/dashboard') || location.pathname === '/'
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'Super Admin')
  const email = user?.email || 'admin@skillbridge.ai'
  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between gap-2 border-b border-border bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 px-3 sm:px-6 shadow-sm">
      {/* Left section: Mobile menu + Title */}
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onMenuClick} aria-label="Open navigation" className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-border bg-white text-charcoal shadow-soft hover:bg-background lg:hidden shrink-0">
          <AppIcon name="menu" />
        </button>

        <span className="hidden items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 xl:inline-flex shrink-0">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> System healthy
        </span>
      </div>

      {/* Center section: Search */}
      <div className="flex flex-1 items-center justify-center px-1 sm:px-3 max-w-[560px]">
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <AppIcon name="search" className="text-[18px] sm:text-[20px]" />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, courses..."
            className="w-full rounded-lg border border-border bg-background pl-9 pr-8 sm:pl-10 sm:pr-[88px] py-2 text-xs sm:text-sm text-charcoal placeholder:text-muted/60 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-colors"
          />
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden items-center gap-1 rounded-lg bg-white border border-border px-2 py-1 text-[11px] font-medium text-muted shadow-sm md:inline-flex">
            ⌘ K
          </span>
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 sm:right-12 top-1/2 -translate-y-1/2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-lg bg-border text-muted hover:text-charcoal">
              <AppIcon name="close" className="text-[14px]" />
            </button>
          )}
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <Link to="/admin/courses" className="hidden items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 shadow-soft md:inline-flex shrink-0">
          <AppIcon name="add" className="text-[16px] sm:text-[18px]" /> New
        </Link>

        <div className="relative shrink-0">
          <button onClick={() => setNotifOpen((v) => !v)} className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-border bg-white text-charcoal hover:bg-background shadow-soft">
            <AppIcon name="notifications" className="text-[18px] sm:text-[20px]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] items-center justify-center rounded-lg bg-danger px-1 text-[10px] sm:text-[11px] font-bold text-white shadow-sm">3</span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-card z-50">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-bold text-charcoal">Notifications</p>
                <span className="rounded-lg bg-primary px-2 py-0.5 text-xs font-bold text-white">3 new</span>
              </div>
              <div className="divide-y divide-border">
                {[
                  { t: 'New industry verification', d: 'TechNova • 2m ago', c: 'verified_user' },
                  { t: 'College pending approval', d: 'IIT Delhi • 1h ago', c: 'apartment' },
                  { t: 'New course submission', d: 'React Mastery • 3h ago', c: 'menu_book' },
                ].map((n) => (
                  <div key={n.t} className="flex gap-3 p-3 hover:bg-background">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <AppIcon name={n.c} className="text-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-medium leading-tight text-charcoal">{n.t}</p>
                      <p className="text-[10px] sm:text-xs text-muted">{n.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/notifications" onClick={() => setNotifOpen(false)} className="block border-t border-border bg-background px-4 py-2.5 text-center text-xs sm:text-sm font-semibold text-primary hover:bg-sage">
                View all →
              </Link>
            </div>
          )}
        </div>

        {isDashboard && (
          <button onClick={toggleChat} className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-border bg-white text-charcoal hover:bg-background shadow-soft shrink-0" title="Chat with AI">
            <img src="/logo.png" alt="Career AI" className="w-5 h-5 object-contain" />
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2.5 rounded-lg border border-border bg-white p-1 sm:py-2 sm:px-2 shadow-soft shrink-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-bold border border-slate-800 shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden text-left xl:block">
            <p className="text-xs sm:text-sm font-semibold leading-none text-charcoal truncate max-w-[120px]">{displayName}</p>
            <p className="text-[10px] sm:text-xs leading-none text-muted mt-0.5 truncate max-w-[120px]">Admin</p>
          </div>
          <button onClick={handleLogout} className="h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-danger inline-flex shrink-0" aria-label="Log out">
            <AppIcon name="logout" className="text-[16px] sm:text-[18px]" />
          </button>
        </div>
      </div>
    </header>
  )
}

export function AdminMobileHeader() { return null }
