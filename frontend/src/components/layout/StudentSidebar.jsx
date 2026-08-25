import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AppIcon from '../ui/AppIcon';

const navSections = [
  {
    label: 'Overview', items: [
      { label: 'Dashboard', icon: 'dashboard', path: '/student' },
      { label: 'Chat with Career AI', icon: 'smart_toy', path: '/student/ai-assistant' },
    ]
  },
  {
    label: 'My Career', items: [
      { label: 'Profile', icon: 'person', path: '/student/profile' },
      { label: 'Career Goal', icon: 'flag', path: '/student/career-goal' },
      { label: 'Skills', icon: 'military_tech', path: '/student/skills' },
      { label: 'Skill Assessment', icon: 'quiz', path: '/student/assessment' },
      { label: 'Skill Gap', icon: 'compare', path: '/student/skill-gap' },
      { label: 'Career Roadmap', icon: 'map', path: '/student/roadmap' },
    ]
  },
  {
    label: 'Learning', items: [
      { label: 'Explore Courses', icon: 'explore', path: '/student/learning' },
      { label: 'My Learning', icon: 'auto_stories', path: '/student/my-learning' },
      { label: 'Assignments', icon: 'assignment', path: '/student/assignments' },
      { label: 'Quizzes', icon: 'help', path: '/student/quizzes' },
      { label: 'AI Practice', icon: 'smart_toy', path: '/student/ai-practice' },
      { label: 'Career AI', icon: 'chat', path: '/student/ai-assistant' },
      { label: 'Certificates', icon: 'workspace_premium', path: '/student/certificates' },
    ]
  },
  {
    label: 'Career Opportunities', items: [
      { label: 'Internships', icon: 'work', path: '/student/internships' },
      { label: 'Jobs', icon: 'business_center', path: '/student/jobs' },
      { label: 'Recommended', icon: 'star', path: '/student/recommended' },
      { label: 'Saved', icon: 'bookmark', path: '/student/saved' },
      { label: 'Applications', icon: 'description', path: '/student/applications' },
    ]
  },
  {
    label: 'My Work', items: [
      { label: 'Projects', icon: 'folder', path: '/student/projects' },
      { label: 'Resume', icon: 'article', path: '/student/resume' },
      { label: 'Portfolio', icon: 'language', path: '/student/portfolio' },
    ]
  },
  {
    label: 'Progress', items: [
      { label: 'Learning Analytics', icon: 'analytics', path: '/student/analytics' },
      { label: 'Skill Progress', icon: 'trending_up', path: '/student/skill-progress' },
      { label: 'Learning Streak', icon: 'local_fire_department', path: '/student/streak' },
    ]
  },
  {
    label: 'Account', items: [
      { label: 'Notifications', icon: 'notifications', path: '/student/notifications' },
      { label: 'Settings', icon: 'settings', path: '/student/settings' },
      { label: 'Help & Support', icon: 'help_center', path: '/student/help' },
    ]
  },
]

function NavItem({ item, active, onClick }) {
  return (
    <NavLink to={item.path} onClick={onClick} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-white text-slate-900 shadow-soft' : 'text-slate-400 hover:bg-white/10 hover:text-white'}`}>
      <AppIcon name={item.icon} className="text-[20px] shrink-0" />
      <span className="truncate">{item.label}</span>
      {item.label === 'Skill Gap' && <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-slate-900 text-white' : 'bg-danger text-white'}`}>!</span>}
    </NavLink>
  )
}

export default function StudentSidebar({ onNavigate }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isActive = (p) => pathname === p || (p !== '/student' && pathname.startsWith(p))
  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'Student')
  const displayEmail = user?.email || 'student@careersync.com'
  const handleLogout = async () => { await logout(); if (onNavigate) onNavigate(); navigate('/login') }
  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
        <button onClick={onNavigate} aria-label="Close navigation" className="rounded-xl border border-white/10 bg-white/10 p-2 text-white">
          <AppIcon name="menu" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-xs">SB</div>
          <span className="text-sm font-bold text-white truncate max-w-[130px]">{displayName}</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-xl border border-white/20 text-rose-400 hover:bg-rose-500/10">
          <AppIcon name="logout" className="text-[20px]" />
        </button>
      </header>
      <div className="hidden lg:flex h-[68px] shrink-0 items-center gap-3 px-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-sm">CS</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-none">CareerSync</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Student Portal</p>
        </div>
        <span className="ml-auto hidden items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white lg:inline-flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>
      </div>
      <div className="flex lg:hidden items-center gap-3 px-5 py-4 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-sm">CS</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-none">CareerSync</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Student Portal</p>
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
            <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
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
