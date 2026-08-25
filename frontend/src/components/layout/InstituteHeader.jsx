import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AppIcon from '../ui/AppIcon';
import { useChatContext } from '../../context/ChatContext';

export default function InstituteHeader({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toggleChat } = useChatContext()
  const [notifOpen, setNotifOpen] = useState(false)
  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}`.trim() : 'Institute Admin')
  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-border bg-white/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} aria-label="Open navigation" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white text-charcoal shadow-soft hover:bg-background lg:hidden">
          <AppIcon name="menu" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shadow-sm">
            <AppIcon name="apartment" className="text-[20px]" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-charcoal">{displayName}</p>
            <p className="text-xs text-muted">Institutional Dashboard</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={toggleChat} className="inline-flex items-center gap-2 h-9 px-3 rounded-xl border border-border bg-white text-charcoal text-xs font-semibold hover:bg-background shadow-soft transition-colors" title="Chat with AI">
          <img src="/logo.png" alt="AI" className="w-4 h-4" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>

        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-white pl-2 pr-1.5 py-1 shadow-soft">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden text-left sm:block pr-1">
            <p className="text-xs font-bold leading-none text-charcoal truncate max-w-[140px]">{displayName}</p>
            <p className="text-[10px] uppercase font-semibold text-primary mt-0.5">Institute</p>
          </div>
          <span className="hidden h-5 w-px bg-border sm:block" />
          <button onClick={handleLogout} className="h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger flex transition-colors cursor-pointer" title="Log out">
            <AppIcon name="logout" className="text-[18px]" />
          </button>
        </div>
      </div>
    </header>
  )
}
