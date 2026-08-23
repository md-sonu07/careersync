import { useState } from 'react'
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import Drawer from '../ui/Drawer'
import { mockUser } from '../../utils/mockData'

const navSections = [
  { label: 'Overview', items: [{ label: 'Dashboard', icon: 'dashboard', path: '/student' }] },
  {
    label: 'My Career',
    items: [
      { label: 'Profile', icon: 'person', path: '/student/profile' },
      { label: 'Career Goal', icon: 'flag', path: '/student/career-goal' },
      { label: 'Skills', icon: 'military_tech', path: '/student/skills' },
      { label: 'Skill Assessment', icon: 'quiz', path: '/student/assessment' },
      { label: 'Skill Gap', icon: 'compare', path: '/student/skill-gap' },
      { label: 'Career Roadmap', icon: 'map', path: '/student/roadmap' },
    ],
  },
  {
    label: 'Learning',
    items: [
      { label: 'Explore Courses', icon: 'explore', path: '/student/learning' },
      { label: 'My Learning', icon: 'auto_stories', path: '/student/my-learning' },
      { label: 'Assignments', icon: 'assignment', path: '/student/assignments' },
      { label: 'Quizzes', icon: 'help', path: '/student/quizzes' },
      { label: 'AI Practice', icon: 'smart_toy', path: '/student/ai-practice' },
      { label: 'AI Assistant', icon: 'chat', path: '/student/ai-assistant' },
      { label: 'Certificates', icon: 'workspace_premium', path: '/student/certificates' },
    ],
  },
  {
    label: 'Career Opportunities',
    items: [
      { label: 'Internships', icon: 'work', path: '/student/internships' },
      { label: 'Jobs', icon: 'business_center', path: '/student/jobs' },
      { label: 'Recommended', icon: 'star', path: '/student/recommended' },
      { label: 'Saved', icon: 'bookmark', path: '/student/saved' },
      { label: 'Applications', icon: 'description', path: '/student/applications' },
    ],
  },
  {
    label: 'My Work',
    items: [
      { label: 'Projects', icon: 'folder', path: '/student/projects' },
      { label: 'Resume', icon: 'article', path: '/student/resume' },
      { label: 'Portfolio', icon: 'language', path: '/student/portfolio' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { label: 'Learning Analytics', icon: 'analytics', path: '/student/analytics' },
      { label: 'Skill Progress', icon: 'trending_up', path: '/student/skill-progress' },
      { label: 'Learning Streak', icon: 'local_fire_department', path: '/student/streak' },
    ],
  },
  {
    label: 'Account',
    items: [
      { label: 'Notifications', icon: 'notifications', path: '/student/notifications' },
      { label: 'Settings', icon: 'settings', path: '/student/settings' },
      { label: 'Help & Support', icon: 'help_center', path: '/student/help' },
    ],
  },
]

function NavItem({ item, active, onClick }) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active ? 'bg-primary text-white shadow-soft' : 'text-charcoal/70 hover:bg-background hover:text-charcoal'
      }`}
    >
      <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
      <span className="truncate">{item.label}</span>
      {item.label === 'Skill Gap' && <span className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${active ? 'bg-white text-primary' : 'bg-danger text-white'}`}>!</span>}
    </NavLink>
  )
}

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation()
  const isActive = (p) => pathname === p || (p !== '/student' && pathname.startsWith(p))
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm">SB</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-primary leading-none">SkillBridge AI</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">Student Portal</p>
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
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-background border border-border p-3">
          <img src={mockUser.avatar} alt={mockUser.name} className="h-9 w-9 rounded-full object-cover border border-border" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-charcoal truncate">{mockUser.name}</p>
            <p className="text-xs text-muted truncate">{mockUser.branch}</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white border border-border px-2 py-1 text-xs font-bold text-primary shadow-soft">
            <span className="material-symbols-outlined text-[16px] text-orange-500">local_fire_department</span>
            {mockUser.streak}
          </span>
        </div>
        <p className="mt-2 text-center text-[11px] text-muted">© 2026 SkillBridge AI</p>
      </div>
    </div>
  )
}

export default function StudentLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <button onClick={() => setDrawerOpen(true)} aria-label="Open navigation" className="rounded-xl border border-border bg-white p-2 text-charcoal shadow-soft">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-xs">SB</div>
          <span className="text-sm font-bold text-primary">SkillBridge AI</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2 py-1 text-xs font-bold text-primary">
            <span className="material-symbols-outlined text-[14px] text-orange-500">local_fire_department</span>
            {mockUser.streak}
          </span>
          <img src={mockUser.avatar} alt="" className="h-8 w-8 rounded-full border border-border" />
        </div>
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
              { icon: 'dashboard', label: 'Home', path: '/student' },
              { icon: 'school', label: 'Learn', path: '/student/learning' },
              { icon: 'smart_toy', label: 'AI', path: '/student/ai-assistant' },
              { icon: 'work', label: 'Jobs', path: '/student/internships' },
              { icon: 'person', label: 'Profile', path: '/student/profile' },
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
