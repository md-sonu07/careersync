import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AppIcon from '../ui/AppIcon';

const navSections = [
  {
    label: 'Overview', items: [
      { label: 'Dashboard', icon: 'dashboard', path: '/industry/dashboard' },
      { label: 'Chat with Career AI', icon: 'smart_toy', path: '/industry/ai-assistant' },
    ]
  },
  {
    label: 'Company', items: [
      { label: 'Company Profile', icon: 'business', path: '/industry/profile' },
      { label: 'Verification', icon: 'verified_user', path: '/industry/verification' },
      { label: 'Team', icon: 'group', path: '/industry/team' },
    ]
  },
  {
    label: 'Recruitment', items: [
      { label: 'Internships', icon: 'work', path: '/industry/internships' },
      { label: 'Jobs', icon: 'business_center', path: '/industry/jobs' },
      { label: 'Candidates', icon: 'person_search', path: '/industry/candidates' },
      { label: 'Applications', icon: 'assignment', path: '/industry/applications' },
      { label: 'Shortlists', icon: 'star', path: '/industry/shortlists' },
      { label: 'Interviews', icon: 'event', path: '/industry/interviews' },
    ]
  },
  {
    label: 'Skill Intelligence', items: [
      { label: 'Required Skills', icon: 'military_tech', path: '/industry/skills' },
      { label: 'Candidate Matching', icon: 'hub', path: '/industry/matching' },
      { label: 'Skill Analytics', icon: 'bar_chart', path: '/industry/skill-analytics' },
    ]
  },
  { label: 'Placements', items: [{ label: 'Selected Candidates', icon: 'workspace_premium', path: '/industry/placements' }] },
  { label: 'Insights', items: [{ label: 'Analytics', icon: 'analytics', path: '/industry/analytics' }] },
  {
    label: 'Account', items: [
      { label: 'Notifications', icon: 'notifications', path: '/industry/notifications' },
      { label: 'Settings', icon: 'settings', path: '/industry/settings' },
    ]
  },
]

function NavItem({ item, active, onClick }) {
  return (
    <NavLink to={item.path} onClick={onClick} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
      <AppIcon name={item.icon} className="text-[20px] shrink-0" />
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

export default function IndustrySidebar({ onNavigate }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isActive = (p) => pathname === p || (p !== '/industry' && pathname.startsWith(p))
  const companyName = user?.company_name || user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'TechNova')
  const email = user?.email || 'hr@technova.com'
  const handleLogout = async () => { await logout(); if (onNavigate) onNavigate(); navigate('/login') }
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
        <button onClick={onNavigate} aria-label="Close navigation" className="rounded-xl border border-white/10 bg-white/10 p-2 text-white">
          <AppIcon name="menu" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-xs">SB</div>
          <span className="text-sm font-bold text-white truncate max-w-[130px]">{companyName}</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-xl border border-white/20 text-rose-400 hover:bg-rose-500/10">
          <AppIcon name="logout" className="text-[20px]" />
        </button>
      </header>
      <div className="hidden lg:flex h-[68px] shrink-0 items-center gap-3 px-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-sm">CS</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-none">CareerSync</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Industry Portal</p>
        </div>
        <span className="ml-auto hidden items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white lg:inline-flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>
      </div>
      <div className="flex lg:hidden items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-sm">CS</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-none">CareerSync</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Industry Portal</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">{section.label}</p>
            <div className="space-y-0.5">{section.items.map((item) => (<NavItem key={item.label + item.path} item={item} active={isActive(item.path)} onClick={onNavigate} />))}</div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-900 font-bold text-sm border border-white/20">{companyName.slice(0, 2).toUpperCase()}</div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] border-2 border-slate-900">✓</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-semibold text-white truncate">{companyName} <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[8px]">✓</span></p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors">
          <AppIcon name="logout" className="text-[16px]" /> Log out
        </button>
        <p className="text-center text-[11px] text-slate-500">© 2026 CareerSync</p>
      </div>
    </div>
  )
}
