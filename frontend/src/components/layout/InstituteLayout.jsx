import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Drawer from '../ui/Drawer'
import InstituteSidebar from './InstituteSidebar'
import InstituteHeader from './InstituteHeader'
import AppIcon from '../ui/AppIcon';

export default function InstituteLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()
  const isAIAssistant = location.pathname.endsWith('/ai-assistant')

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-[280px] lg:shrink-0 lg:flex-col lg:bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          <InstituteSidebar />
        </aside>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" size="sm" title="" showCloseButton>
          <div className="-mx-6 -my-5 bg-slate-900 h-full">
            <InstituteSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </Drawer>
        <div className={`flex flex-1 flex-col min-w-0 ${isAIAssistant ? 'h-screen overflow-hidden' : ''}`}>
          {!isAIAssistant && <InstituteHeader onMenuClick={() => setDrawerOpen(true)} />}
          <main className={`flex-1 min-w-0 ${isAIAssistant ? 'h-full bg-[#212121] overflow-hidden' : ''}`}>
            <div className={isAIAssistant ? 'h-full w-full' : 'mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-8'}>
              <Outlet context={{ onMenuClick: () => setDrawerOpen(true) }} />
            </div>
            <nav className="fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-border bg-white px-2 py-1.5 lg:hidden">
              {[
                { icon: 'dashboard', label: 'Home', path: '/institute' },
                { icon: 'group', label: 'Students', path: '/institute/students' },
                { icon: 'show_chart', label: 'Demand', path: '/institute/industry-demand' },
                { icon: 'compare', label: 'Gaps', path: '/institute/skill-gaps' },
                { icon: 'analytics', label: 'Analytics', path: '/institute/analytics' },
              ].map((it) => (
                <NavLink key={it.path + it.label} to={it.path} className={({ isActive }) => `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium ${isActive ? 'text-primary' : 'text-muted'}`}>
                  <AppIcon name={it.icon} className="text-[22px]" />
                  {it.label}
                </NavLink>
              ))}
            </nav>
          </main>
        </div>
      </div>
    </div>
  )
}
