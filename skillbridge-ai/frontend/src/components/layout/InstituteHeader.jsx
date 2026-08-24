import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AppIcon from '../ui/AppIcon';
import { useChatContext } from '../../context/ChatContext';

export default function InstituteHeader({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toggleChat } = useChatContext()
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const displayName = user?.full_name || 'Institute Admin'
  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center gap-3 border-b border-border bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 px-4 sm:px-6 shadow-sm">
      <button onClick={onMenuClick} aria-label="Open navigation" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-charcoal shadow-soft hover:bg-background lg:hidden">
        <AppIcon name="menu" />
      </button>
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <AppIcon name="apartment" className="text-[18px]" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-charcoal">Institute Intelligence</p>
          <p className="text-xs text-muted">1,248 students • 78% placed</p>
        </div>
        <span className="ml-2 hidden items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700 xl:inline-flex">2 gaps critical</span>
      </div>
      <div className="flex flex-1 items-center justify-center px-2 sm:px-4 lg:px-8">
        <div className="relative w-full max-w-[560px]">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <AppIcon name="search" className="text-[20px]" />
          </span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search students, skills, reports…" className="w-full rounded-lg border border-border bg-background pl-10 pr-[88px] py-2.5 text-sm text-charcoal placeholder:text-muted/60 shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-colors" />
          <span className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden items-center gap-1 rounded-lg bg-white border border-border px-2 py-1 text-[11px] font-medium text-muted shadow-sm sm:inline-flex">⌘ K</span>
          {query && <button onClick={() => setQuery('')} className="absolute right-12 top-1/2 -translate-y-1/2 hidden h-6 w-6 items-center justify-center rounded-lg bg-border text-muted hover:text-charcoal sm:inline-flex"><AppIcon name="close" className="text-[16px]" /></button>}
        </div>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="relative">
          <button onClick={() => setNotifOpen((v) => !v)} className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-charcoal hover:bg-background shadow-soft">
            <AppIcon name="notifications" className="text-[20px]" />
            <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-lg bg-danger px-1 text-[11px] font-bold text-white shadow-sm">2</span>
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="text-sm font-bold text-charcoal">Notifications</p>
                <span className="rounded-lg bg-primary px-2 py-0.5 text-xs font-bold text-white">2 new</span>
              </div>
              <div className="divide-y divide-border">
                <div className="flex gap-3 p-3 hover:bg-background"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-700 shrink-0"><AppIcon name="warning" className="text-[18px]" /></span><div><p className="text-sm font-medium text-charcoal">Docker gap critical 44%</p><p className="text-xs text-muted">Needs workshop • 1h ago</p></div></div>
                <div className="flex gap-3 p-3 hover:bg-background"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0"><AppIcon name="trending_up" className="text-[18px]" /></span><div><p className="text-sm font-medium text-charcoal">Placement rate +5%</p><p className="text-xs text-muted">78% current • 2h ago</p></div></div>
              </div>
              <Link to="/institute/notifications" onClick={() => setNotifOpen(false)} className="block border-t border-border bg-background px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-sage">View all →</Link>
            </div>
          )}
        </div>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <button onClick={toggleChat} className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-charcoal hover:bg-background shadow-soft" title="Chat with AI">
          <img src="/logo.png" alt="Career AI" className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-white pl-1.5 pr-1.5 py-1 shadow-soft sm:pr-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-bold shrink-0">{displayName.slice(0, 2).toUpperCase()}</div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-none text-charcoal">{displayName}</p>
            <p className="text-xs leading-none text-muted">Institute</p>
          </div>
          <span className="hidden h-6 w-px bg-border sm:block" />
          <button onClick={handleLogout} className="hidden h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-charcoal sm:inline-flex"><AppIcon name="logout" className="text-[18px]" /></button>
          <button onClick={handleLogout} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-danger sm:hidden"><AppIcon name="logout" className="text-[18px]" /></button>
        </div>
      </div>
    </header>
  )
}
