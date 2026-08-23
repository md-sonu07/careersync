import { useState } from 'react'
import { NavLink, useLocation, useNavigate, Outlet } from 'react-router-dom'
import Drawer from '../ui/Drawer'
import { useAuth } from '../../hooks/useAuth'

const navSections = [
  { label: 'Overview', items: [{ label: 'Dashboard', icon: 'dashboard', path: '/industry' }] },
  {
    label: 'Company',
    items: [
      { label: 'Company Profile', icon: 'business', path: '/industry/profile' },
      { label: 'Verification', icon: 'verified_user', path: '/industry/verification' },
      { label: 'Team', icon: 'group', path: '/industry/team' },
    ],
  },
  {
    label: 'Recruitment',
    items: [
      { label: 'Internships', icon: 'work', path: '/industry/internships' },
      { label: 'Jobs', icon: 'business_center', path: '/industry/jobs' },
      { label: 'Candidates', icon: 'person_search', path: '/industry/candidates' },
      { label: 'Applications', icon: 'assignment', path: '/industry/applications' },
      { label: 'Shortlists', icon: 'star', path: '/industry/shortlists' },
      { label: 'Interviews', icon: 'event', path: '/industry/interviews' },
    ],
  },
  {
    label: 'Skill Intelligence',
    items: [
      { label: 'Required Skills', icon: 'military_tech', path: '/industry/skills' },
      { label: 'Candidate Matching', icon: 'hub', path: '/industry/matching' },
      { label: 'Skill Analytics', icon: 'bar_chart', path: '/industry/skill-analytics' },
    ],
  },
  { label: 'Placements', items: [{ label: 'Selected Candidates', icon: 'workspace_premium', path: '/industry/placements' }] },
  { label: 'Insights', items: [{ label: 'Analytics', icon: 'analytics', path: '/industry/analytics' }] },
  {
    label: 'Account',
    items: [
      { label: 'Notifications', icon: 'notifications', path: '/industry/notifications' },
      { label: 'Settings', icon: 'settings', path: '/industry/settings' },
    ],
  },
]

function NavItem({ item, active, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-primary text-white shadow-soft' : 'text-charcoal/70 hover:bg-background hover:text-charcoal'}`}
    >
      <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isActive = (p) => pathname === p || (p !== '/industry' && pathname.startsWith(p))

  const companyName = user?.company_name || user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'TechNova')
  const email = user?.email || 'hr@technova.com'

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
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Industry Portal</p>
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
          <div className="relative shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white font-bold text-sm border border-border">
              {companyName.slice(0, 2).toUpperCase()}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-white text-[10px] border-2 border-white">✓</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-sm font-semibold text-charcoal truncate">
              {companyName} <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-success text-white text-[8px]">✓</span>
            </p>
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

export default function IndustryLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const companyName = user?.company_name || user?.full_name || 'TechNova'

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
          <span className="text-sm font-bold text-primary truncate max-w-[130px]">{companyName}</span>
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
              { icon: 'dashboard', label: 'Home', path: '/industry' },
              { icon: 'work', label: 'Posts', path: '/industry/internships' },
              { icon: 'person_search', label: 'Candidates', path: '/industry/candidates' },
              { icon: 'assignment', label: 'Apps', path: '/industry/applications' },
              { icon: 'analytics', label: 'Analytics', path: '/industry/analytics' },
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
