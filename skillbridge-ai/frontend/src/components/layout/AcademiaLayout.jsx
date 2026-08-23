import { useState } from 'react'
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom'
import Drawer from '../ui/Drawer'
import { useAuth } from '../../hooks/useAuth'

const navSections = [
  { label: 'Overview', items: [{ label: 'Dashboard', icon: 'dashboard', path: '/academia' }] },
  {
    label: 'Students',
    items: [
      { label: 'Student Overview', icon: 'group', path: '/academia/students' },
      { label: 'Performance', icon: 'trending_up', path: '/academia/performance' },
      { label: 'Skill Distribution', icon: 'pie_chart', path: '/academia/skill-distribution' },
    ],
  },
  {
    label: 'Learning',
    items: [
      { label: 'Courses', icon: 'menu_book', path: '/academia/courses' },
      { label: 'Progress', icon: 'timeline', path: '/academia/progress' },
      { label: 'Assessments', icon: 'quiz', path: '/academia/assessments' },
    ],
  },
  {
    label: 'Industry Intelligence',
    items: [
      { label: 'Industry Demand', icon: 'show_chart', path: '/academia/industry-demand' },
      { label: 'Skill Gaps', icon: 'compare', path: '/academia/skill-gaps' },
      { label: 'Trending Skills', icon: 'trending_up', path: '/academia/trending-skills' },
      { label: 'Industry Partners', icon: 'handshake', path: '/academia/industry-partners' },
    ],
  },
  {
    label: 'Career',
    items: [
      { label: 'Internships', icon: 'work', path: '/academia/internships' },
      { label: 'Jobs', icon: 'business_center', path: '/academia/jobs' },
      { label: 'Placements', icon: 'workspace_premium', path: '/academia/placements' },
    ],
  },
  {
    label: 'Training',
    items: [
      { label: 'Skill Recommendations', icon: 'lightbulb', path: '/academia/training-recommendations' },
      { label: 'Workshops', icon: 'event', path: '/academia/workshops' },
      { label: 'Training Programs', icon: 'school', path: '/academia/training-programs' },
    ],
  },
  {
    label: 'Reports',
    items: [
      { label: 'Reports', icon: 'description', path: '/academia/reports' },
      { label: 'Analytics', icon: 'analytics', path: '/academia/analytics' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Notifications', icon: 'notifications', path: '/academia/notifications' },
      { label: 'Settings', icon: 'settings', path: '/academia/settings' },
    ],
  },
]

function NavItem({ item, active, onClick }) {
  return (
    <NavLink to={item.path} onClick={onClick} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-primary text-white shadow-soft' : 'text-charcoal/70 hover:bg-background hover:text-charcoal'}`}>
      <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isActive = (p) => pathname === p || (p !== '/academia' && pathname.startsWith(p))

  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'Academia Admin')
  const email = user?.email || 'prof.singh@iitb.ac.in'

  const handleLogout = async () => {
    await logout()
    if (onNavigate) onNavigate()
    navigate('/login')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm">SB</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary leading-none">SkillBridge AI</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Academia Portal</p>
        </div>
        <span className="ml-auto hidden items-center gap-1 rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold text-primary lg:inline-flex">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> LIVE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-muted">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.label + item.path} item={item} active={isActive(item.path)} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center gap-3 rounded-2xl bg-background border border-border p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold text-sm shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-charcoal truncate">{displayName}</p>
            <p className="text-xs text-muted truncate">{email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-white py-2 text-xs font-semibold text-danger hover:bg-danger/5 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span> Log out
        </button>
        <p className="text-center text-[11px] text-muted">© 2026 SkillBridge AI</p>
      </div>
    </div>
  )
}

export default function AcademiaLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const displayName = user?.full_name || 'Academia Admin'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <button onClick={() => setDrawerOpen(true)} aria-label="Open navigation" className="rounded-xl border border-border bg-white p-2 text-charcoal shadow-soft">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">SB</div>
          <span className="text-sm font-bold text-primary truncate max-w-[130px]">{displayName}</span>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-xl border border-border text-danger hover:bg-danger/5">
          <span className="material-symbols-outlined text-[20px]">logout</span>
        </button>
      </header>
      <div className="flex">
        <aside className="hidden lg:flex lg:w-[240px] lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-white lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          <SidebarContent />
        </aside>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" size="sm" title="" showCloseButton>
          <div className="-mx-6 -my-5">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </Drawer>
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-8">
            <Outlet />
          </div>
          <nav className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-border bg-white px-2 py-1.5 lg:hidden">
            {[
              { icon: 'dashboard', label: 'Home', path: '/academia' },
              { icon: 'group', label: 'Students', path: '/academia/students' },
              { icon: 'show_chart', label: 'Demand', path: '/academia/industry-demand' },
              { icon: 'compare', label: 'Gaps', path: '/academia/skill-gaps' },
              { icon: 'analytics', label: 'Analytics', path: '/academia/analytics' },
            ].map((it) => (
              <NavLink key={it.path + it.label} to={it.path} className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium ${isActive ? 'text-primary' : 'text-muted'}`}>
                <span className="material-symbols-outlined text-[22px]">{it.icon}</span>
                {it.label}
              </NavLink>
            ))}
          </nav>
        </main>
      </div>
    </div>
  )
}
