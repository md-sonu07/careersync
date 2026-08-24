import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Drawer from '../ui/Drawer'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close dropdowns & mobile menu on route change
  useEffect(() => {
    setActiveDropdown(null)
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setMobileOpen(false)
    navigate('/login')
  }

  const exploreItems = [
    {
      to: '/courses',
      label: 'Courses',
      desc: 'Industry-aligned learning modules and skill assessments',
      icon: 'auto_stories',
    },
    {
      to: '/internships',
      label: 'Internships',
      desc: 'Hands-on practical experience at top companies',
      icon: 'work_history',
    },
    {
      to: '/jobs',
      label: 'Jobs',
      desc: 'Full-time career opportunities matched to your skill profile',
      icon: 'work',
    },
  ]

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b border-border transition-all duration-300 ${
          scrolled ? 'bg-background/98 shadow-card backdrop-blur-md' : 'bg-background/90 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">CareerSync</span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary font-semibold' : 'text-charcoal'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/about' ? 'text-primary font-semibold' : 'text-charcoal'
              }`}
            >
              About
            </Link>

            <Link
              to="/how-it-works"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/how-it-works' ? 'text-primary font-semibold' : 'text-charcoal'
              }`}
            >
              How It Works
            </Link>

            {/* Explore Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('explore')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'explore' ? null : 'explore')}
                className={`flex items-center gap-1 text-sm font-medium py-2 transition-colors hover:text-primary ${
                  ['/courses', '/internships', '/jobs'].includes(location.pathname) || activeDropdown === 'explore'
                    ? 'text-primary font-semibold'
                    : 'text-charcoal'
                }`}
                aria-expanded={activeDropdown === 'explore'}
              >
                <span>Explore</span>
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform duration-200 ${
                    activeDropdown === 'explore' ? 'rotate-180 text-primary' : 'text-charcoal/60'
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>

              {activeDropdown === 'explore' && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white rounded-2xl shadow-xl border border-border/80 p-2.5 space-y-1">
                    {exploreItems.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-primary/5 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[20px] block">{item.icon}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-charcoal group-hover:text-primary transition-colors">
                            {item.label}
                          </div>
                          <div className="text-xs text-charcoal/60 line-clamp-2 leading-relaxed mt-0.5">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl border border-border hover:bg-background transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined block">menu</span>
            </button>
            <div className="hidden sm:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to="/student/dashboard" className="hidden md:inline text-sm font-medium text-charcoal hover:text-primary">
                    Dashboard
                  </Link>
                  <span className="hidden md:inline text-sm text-charcoal/60 truncate max-w-[150px]">
                    {user?.full_name || user?.name || user?.email}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1">
                    <span className="material-symbols-outlined text-[18px]">logout</span> Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="text-sm font-medium px-4 py-2 rounded-xl text-primary hover:bg-primary/5 transition-colors">
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
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} side="right" size="sm" title="Navigation">
        <div className="flex flex-col gap-4 py-1">
          {/* Main */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">home</span>
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">info</span>
              About
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">alt_route</span>
              How It Works
            </Link>
          </div>

          <hr className="border-border" />

          {/* Explore Section */}
          <div>
            <div className="px-3 text-xs font-semibold text-charcoal/50 uppercase tracking-wider mb-2">Explore</div>
            <div className="space-y-1">
              {exploreItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <hr className="border-border my-1" />

          {/* Auth Actions */}
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link
                to="/student/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-danger/10 text-danger"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span> Log out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-medium border border-border text-charcoal hover:bg-background"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default Navbar
