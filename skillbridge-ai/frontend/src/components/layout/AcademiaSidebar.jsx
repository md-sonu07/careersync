import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const navSections = [
  { label: 'Overview', items: [{ label: 'Dashboard', icon: 'dashboard', path: '/academia' }] },
  {
    label: 'Students', items: [
      { label: 'Student Overview', icon: 'group', path: '/academia/students' },
      { label: 'Performance', icon: 'trending_up', path: '/academia/performance' },
      { label: 'Skill Distribution', icon: 'pie_chart', path: '/academia/skill-distribution' },
    ]
  },
  {
    label: 'Learning', items: [
      { label: 'Courses', icon: 'menu_book', path: '/academia/courses' },
      { label: 'Progress', icon: 'timeline', path: '/academia/progress' },
      { label: 'Assessments', icon: 'quiz', path: '/academia/assessments' },
    ]
  },
  {
    label: 'Industry Intelligence', items: [
      { label: 'Industry Demand', icon: 'show_chart', path: '/academia/industry-demand' },
      { label: 'Skill Gaps', icon: 'compare', path: '/academia/skill-gaps' },
      { label: 'Trending Skills', icon: 'trending_up', path: '/academia/trending-skills' },
      { label: 'Industry Partners', icon: 'handshake', path: '/academia/industry-partners' },
    ]
  },
  {
    label: 'Career', items: [
      { label: 'Internships', icon: 'work', path: '/academia/internships' },
      { label: 'Jobs', icon: 'business_center', path: '/academia/jobs' },
      { label: 'Placements', icon: 'workspace_premium', path: '/academia/placements' },
    ]
  },
  {
    label: 'Training', items: [
      { label: 'Skill Recommendations', icon: 'lightbulb', path: '/academia/training-recommendations' },
      { label: 'Workshops', icon: 'event', path: '/academia/workshops' },
      { label: 'Training Programs', icon: 'school', path: '/academia/training-programs' },
    ]
  },
  {
    label: 'Reports', items: [
      { label: 'Reports', icon: 'description', path: '/academia/reports' },
      { label: 'Analytics', icon: 'analytics', path: '/academia/analytics' },
    ]
  },
  {
    label: 'Account', items: [
      { label: 'Notifications', icon: 'notifications', path: '/academia/notifications' },
      { label: 'Settings', icon: 'settings', path: '/academia/settings' },
    ]
  },
]

function NavItem({ item, active, onClick }) {
  return (
    <NavLink to={item.path} onClick={onClick} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
      <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

export default function AcademiaSidebar({ onNavigate }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isActive = (p) => pathname === p || (p !== '/academia' && pathname.startsWith(p))
  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'Academia Admin')
  const email = user?.email || 'prof.singh@iitb.ac.in'
  const handleLogout = async () => { await logout(); if (onNavigate) onNavigate(); navigate('/login') }
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
        <button onClick={onNavigate} aria-label="Close navigation" className="rounded-xl border border-white/10 bg-white/10 p-2 text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-xs">SB</div>
          <span className="text-sm font-bold text-white truncate max-w-[130px]">{displayName}</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-xl border border-white/20 text-rose-400 hover:bg-rose-500/10">
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </header>
      <div className="hidden lg:flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-sm">CS</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-none">CareerSync</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Academia Portal</p>
        </div>
        <span className="ml-auto hidden items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white lg:inline-flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>
      </div>
      <div className="flex lg:hidden items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-sm">CS</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-none">CareerSync</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Academia Portal</p>
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white font-bold text-sm shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors">
          <span className="material-symbols-outlined text-[16px]">logout</span> Log out
        </button>
        <p className="text-center text-[11px] text-slate-500">© 2026 CareerSync</p>
      </div>
    </div>
  )
}
