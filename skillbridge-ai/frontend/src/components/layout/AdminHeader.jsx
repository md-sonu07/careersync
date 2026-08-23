import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'Super Admin')
  const email = user?.email || 'admin@skillbridge.ai'
  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center gap-3 border-b border-border bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 px-4 sm:px-6 shadow-sm">
      {/* Mobile menu */}
      <button onClick={onMenuClick} aria-label="Open navigation" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-charcoal shadow-soft hover:bg-background lg:hidden">
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Left — Title + breadcrumb on desktop */}
      <div className="hidden lg:flex items-center gap-3">
        <span className="ml-2 hidden items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-bold text-emerald-700 xl:inline-flex">
          <span className="h-2 w-2 rounded-lg bg-emerald-500 animate-pulse" /> System healthy
        </span>
      </div>

      {/* Center — Search */}
      <div className="flex flex-1 items-center justify-center px-2 sm:px-4 lg:px-8">
        <div className="relative w-full max-w-[560px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, courses, internships, verifications…"
            className="w-full rounded-lg border border-border bg-background pl-10 pr-[88px] py-2.5 text-sm text-charcoal placeholder:text-muted/60 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-colors"
          />
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden items-center gap-1 rounded-lg bg-white border border-border px-2 py-1 text-[11px] font-medium text-muted shadow-sm sm:inline-flex">
            ⌘ K
          </span>
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-12 top-1/2 -translate-y-1/2 hidden h-6 w-6 items-center justify-center rounded-lg bg-border text-muted hover:text-charcoal sm:inline-flex">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link to="/admin/courses" className="hidden items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-slate-800 shadow-soft lg:inline-flex">
          <span className="material-symbols-outlined text-[18px]">add</span> New
        </Link>

        <div className="relative">
          <button onClick={() => setNotifOpen((v) => !v)} className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-charcoal hover:bg-background shadow-soft">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-lg bg-danger px-1 text-[11px] font-bold text-white shadow-sm">3</span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
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
                      <span className="material-symbols-outlined text-[18px]">{n.c}</span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-tight text-charcoal">{n.t}</p>
                      <p className="text-xs text-muted">{n.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/admin/notifications" onClick={() => setNotifOpen(false)} className="block border-t border-border bg-background px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-sage">
                View all →
              </Link>
            </div>
          )}
        </div>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white pl-1.5 pr-1.5 py-2 shadow-soft sm:pr-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-bold border border-slate-800 shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-none text-charcoal">{displayName}</p>
            <p className="text-xs leading-none text-muted">Admin • {email.split('@')[0]}</p>
          </div>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <button onClick={handleLogout} className="hidden h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-charcoal sm:inline-flex" aria-label="Log out">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
          <button onClick={handleLogout} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-danger sm:hidden" aria-label="Log out">
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export function AdminMobileHeader() { return null }
