import { useState } from 'react'
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import Drawer from '../ui/Drawer'

const navSections = [
  { label: 'Overview', items: [{ label: 'Dashboard', icon: 'dashboard', path: '/admin' }] },
  {
    label: 'User Management',
    items: [
      { label: 'Students', icon: 'school', path: '/admin/students' },
      { label: 'Industry', icon: 'business', path: '/admin/industries' },
      { label: 'Academicians', icon: 'person', path: '/admin/academicians' },
      { label: 'Colleges', icon: 'apartment', path: '/admin/colleges' },
      { label: 'Administrators', icon: 'admin_panel_settings', path: '/admin/administrators' },
    ],
  },
  {
    label: 'Verification',
    items: [
      { label: 'Industry Verification', icon: 'verified_user', path: '/admin/verification' },
      { label: 'College Verification', icon: 'domain_verification', path: '/admin/college-verification' },
      { label: 'Documents', icon: 'folder_shared', path: '/admin/documents' },
    ],
  },
  {
    label: 'LMS',
    items: [
      { label: 'Courses', icon: 'menu_book', path: '/admin/courses' },
      { label: 'Categories', icon: 'category', path: '/admin/categories' },
      { label: 'Modules', icon: 'view_module', path: '/admin/modules' },
      { label: 'Lessons', icon: 'play_lesson', path: '/admin/lessons' },
      { label: 'Certificates', icon: 'workspace_premium', path: '/admin/certificates-admin' },
    ],
  },
  {
    label: 'Skills',
    items: [
      { label: 'Skill Library', icon: 'military_tech', path: '/admin/skills' },
      { label: 'Categories', icon: 'label', path: '/admin/skill-categories' },
      { label: 'Career Roles', icon: 'work', path: '/admin/career-roles' },
    ],
  },
  {
    label: 'Assessment',
    items: [
      { label: 'Assessments', icon: 'quiz', path: '/admin/assessments' },
      { label: 'Question Bank', icon: 'help', path: '/admin/question-bank' },
      { label: 'MCQs', icon: 'rule', path: '/admin/mcqs' },
      { label: 'Results', icon: 'bar_chart', path: '/admin/results' },
    ],
  },
  {
    label: 'Opportunities',
    items: [
      { label: 'Internships', icon: 'work', path: '/admin/internships' },
      { label: 'Jobs', icon: 'business_center', path: '/admin/jobs' },
      { label: 'Applications', icon: 'assignment', path: '/admin/applications' },
    ],
  },
  { label: 'Placements', items: [{ label: 'Placements', icon: 'emoji_events', path: '/admin/placements' }] },
  {
    label: 'AI Management',
    items: [
      { label: 'AI Usage', icon: 'smart_toy', path: '/admin/ai-usage' },
      { label: 'AI Logs', icon: 'receipt_long', path: '/admin/ai-logs' },
      { label: 'Prompt Monitoring', icon: 'monitoring', path: '/admin/ai-monitoring' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Analytics', icon: 'analytics', path: '/admin/analytics' },
      { label: 'Reports', icon: 'description', path: '/admin/reports' },
      { label: 'Notifications', icon: 'notifications', path: '/admin/notifications' },
      { label: 'Audit Logs', icon: 'fact_check', path: '/admin/audit-logs' },
      { label: 'System Settings', icon: 'settings', path: '/admin/settings' },
    ],
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

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation()
  const isActive = (p) => pathname === p || (p !== '/admin' && pathname.startsWith(p))
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-900 font-bold text-sm">SB</div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-none">SkillBridge AI</p>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Admin Console</p>
        </div>
        <span className="ml-auto hidden items-center gap-1 rounded-full bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-bold text-white lg:inline-flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavItem key={item.label + item.path} item={item} active={isActive(item.path)} onClick={onNavigate} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/10 p-3">
          <img src="https://i.pravatar.cc/150?img=15" alt="Admin" className="h-9 w-9 rounded-full object-cover border border-white/20 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">Super Admin</p>
            <p className="text-xs text-slate-400 truncate">admin@skillbridge.ai</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-500">© 2026 SkillBridge AI</p>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:hidden">
        <button onClick={() => setDrawerOpen(true)} aria-label="Open navigation" className="rounded-xl border border-white/10 bg-white/10 p-2 text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-slate-900 font-bold text-xs">SB</div>
          <span className="text-sm font-bold text-white">SkillBridge AI</span>
        </div>
        <img src="https://i.pravatar.cc/150?img=15" alt="" className="h-8 w-8 rounded-full border border-white/20" />
      </header>
      <div className="flex">
        <aside className="hidden lg:flex lg:w-[240px] lg:shrink-0 lg:flex-col lg:bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          <SidebarContent />
        </aside>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" size="sm" title="" showCloseButton>
          <div className="-mx-6 -my-5 bg-slate-900 h-full">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </Drawer>
        <main className="flex-1 min-w-0 bg-background">
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
