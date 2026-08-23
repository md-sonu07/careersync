import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  const location = useLocation()

  const hideFooterPaths = ['/login', '/register', '/admin/login']
  const shouldHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

export default Layout
