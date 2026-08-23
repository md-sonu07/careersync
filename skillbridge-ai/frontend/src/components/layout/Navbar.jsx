import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Drawer from '../ui/Drawer'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const [mobileOpen, setMobileOpen] = useState(false)
  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b border-border px-6 md:px-8 h-20 flex justify-between items-center transition-all duration-300 ${
          scrolled ? 'bg-background/98 shadow-card backdrop-blur-md' : 'bg-background/90 backdrop-blur-md'
        }`}
      >
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">SkillBridge AI</span>
      </Link>

      <div className="hidden lg:flex items-center gap-6">
        <Link to="/" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/about" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          About
        </Link>
        <Link to="/how-it-works" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          How It Works
        </Link>
        <Link to="/students" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          For Students
        </Link>
        <Link to="/industry" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          For Industry
        </Link>
        <Link to="/academia" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          For Academia
        </Link>
        <Link to="/courses" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          Courses
        </Link>
        <Link to="/internships" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          Internships
        </Link>
        <Link to="/jobs" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          Jobs
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button className="lg:hidden p-2 rounded-lg border border-border" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hidden md:inline text-sm font-medium text-charcoal hover:text-primary">
                Dashboard
              </Link>
              <span className="hidden md:inline text-sm text-charcoal/60">{user?.name || user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="text-sm font-medium px-4 py-2 rounded-lg text-primary hover:bg-primary/5 transition-colors">
                  Log In
                </button>
              </Link>
              <Link to="/register">
                <Button size="md">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      </nav>

      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="right" size="sm" title="Menu">
        <div className="flex flex-col gap-2">
          {[
            ['/', 'Home'],
            ['/about', 'About'],
            ['/how-it-works', 'How It Works'],
            ['/students', 'For Students'],
            ['/industry', 'For Industry'],
            ['/academia', 'For Academia'],
            ['/courses', 'Courses'],
            ['/internships', 'Internships'],
            ['/jobs', 'Jobs'],
          ].map(([to, label]) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-background">
              {label}
            </Link>
          ))}
          <hr className="my-2 border-border" />
          <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-medium bg-primary text-white text-center">
            Log In
          </Link>
          <Link to="/register" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-medium border border-border text-center">
            Get Started
          </Link>
        </div>
      </Drawer>
    </>
  )
}

export default Navbar
