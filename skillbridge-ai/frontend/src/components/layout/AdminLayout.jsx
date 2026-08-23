import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Drawer from '../ui/Drawer'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-[280px] lg:shrink-0 lg:flex-col lg:bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden">
          <AdminSidebar />
        </aside>
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} side="left" size="sm" title="" showCloseButton>
          <div className="-mx-6 -my-5 bg-slate-900 h-full">
            <AdminSidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </Drawer>
        <div className="flex flex-1 flex-col min-w-0">
          <AdminHeader onMenuClick={() => setDrawerOpen(true)} />
          <main className="flex-1 min-w-0 bg-background">
            <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 pb-20 lg:pb-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
