import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import Drawer from '../ui/Drawer'
import Logo from '../ui/Logo'
import { useChatContext } from '../../context/ChatContext'
import AppIcon from '../ui/AppIcon';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleChat } = useChatContext()
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isReturning, setIsReturning] = useState(false)

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('hasVisited')) {
        setIsReturning(true)
      } else if (typeof localStorage !== 'undefined') {
        setTimeout(() => localStorage.setItem('hasVisited', 'true'), 2000)
      }
    } catch (e) {
      // Ignore storage errors in restricted/test environments
    }
  }, [])

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

  const getDashboardPath = (role) => {
    const normalizedRole = (role || '').toLowerCase()
    if (normalizedRole === 'student') return '/student/dashboard'
    if (normalizedRole === 'industry') return '/industry/dashboard'
    if (['academician', 'institute'].includes(normalizedRole)) return '/institute/dashboard'
    if (normalizedRole === 'admin') return '/admin/dashboard'
    return '/student/dashboard'
  }

  const exploreItems = [
    {
      to: '/courses',
      label: 'Courses',
      desc: 'Industry-aligned learning modules',
      icon: 'auto_stories',
    },
    {
      to: '/internships',
      label: 'Internships',
      desc: 'Hands-on practical and experience ',
      icon: 'work_history',
    },
    {
      to: '/jobs',
      label: 'Jobs',
      desc: 'Full-time and contract roles',
      icon: 'work',
    },
  ]

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b border-border transition-all duration-300 ${scrolled ? 'bg-background/98 shadow-card backdrop-blur-md' : 'bg-background/90 backdrop-blur-md'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav Items */}
          <div className="hidden @5xl:flex items-center gap-7">
            <Link
              to="/"
              className={`relative text-sm font-medium transition-colors py-1 hover:text-primary after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-[2px] after:bg-primary after:rounded-full after:transition-transform after:duration-300 ${location.pathname === '/' ? 'text-primary font-bold after:scale-x-100' : 'text-charcoal/80 after:scale-x-0 hover:after:scale-x-100'
                }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`relative text-sm font-medium transition-colors py-1 hover:text-primary after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-[2px] after:bg-primary after:rounded-full after:transition-transform after:duration-300 ${location.pathname === '/about' ? 'text-primary font-bold after:scale-x-100' : 'text-charcoal/80 after:scale-x-0 hover:after:scale-x-100'
                }`}
            >
              About
            </Link>

            <Link
              to="/how-it-works"
              className={`relative text-sm font-medium transition-colors py-1 hover:text-primary after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-[2px] after:bg-primary after:rounded-full after:transition-transform after:duration-300 ${location.pathname === '/how-it-works' ? 'text-primary font-bold after:scale-x-100' : 'text-charcoal/80 after:scale-x-0 hover:after:scale-x-100'
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
                className={`flex items-center gap-1 text-sm font-medium py-2 transition-colors hover:text-primary ${['/courses', '/internships', '/jobs'].includes(location.pathname) || activeDropdown === 'explore'
                  ? 'text-primary font-semibold'
                  : 'text-charcoal'
                  }`}
                aria-expanded={activeDropdown === 'explore'}
              >
                <span>Explore</span>
                <AppIcon
                  name="keyboard_arrow_down"
                  className={`text-[18px] transition-transform duration-200 ${activeDropdown === 'explore' ? 'rotate-180 text-primary' : 'text-charcoal/60'
                    }`}
                />
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
                        <div className="p-2 h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <AppIcon name={item.icon} className="text-[20px] block" />
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
              className="@5xl:hidden p-2 flex justify-center items-center cursor-pointer rounded-lg border border-border hover:bg-background transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <AppIcon name="menu" className="block" />
            </button>
            <div className="hidden @2xl:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardPath(user?.role)} className="hidden @3xl:inline text-sm font-medium text-charcoal hover:text-primary px-3">
                    Dashboard
                  </Link>

                  {/* User Profile Section */}
                  <div className="flex items-center gap-3 pl-3 border-l border-border/80">
                    <div className="flex items-center gap-3">
                      {user?.profile_picture || user?.avatar_url || user?.profile_image ? (
                        <img src={user.profile_picture || user.avatar_url || user.profile_image} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-primary/20 shadow-sm" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary flex items-center justify-center font-bold text-sm border border-primary/30 shadow-sm">
                          {(user?.full_name || user?.name || user?.email || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="hidden @4xl:flex flex-col text-left">
                        <span className="text-sm font-bold text-charcoal leading-tight max-w-[120px] truncate">
                          {user?.full_name || user?.name || 'User'}
                        </span>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-primary truncate max-w-[120px]">
                          {user?.role || 'Student'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="ml-2 w-9 h-9 rounded-xl border border-border flex items-center justify-center text-charcoal/60 hover:text-danger hover:border-danger/30 hover:bg-danger/5 transition-all cursor-pointer"
                      title="Log out"
                    >
                      <AppIcon name="logout" className="text-[18px]" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {isReturning ? (
                    <>
                      <Link to="/register">
                        <button className="text-sm font-medium px-4 py-2.5 rounded-lg text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                          Sign Up
                        </button>
                      </Link>
                      <Link to="/login">
                        <Button size="md">Log In</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login">
                        <button className="text-sm font-medium px-4 py-2.5 rounded-lg text-primary hover:bg-primary/5 transition-colors cursor-pointer">
                          Log In
                        </button>
                      </Link>
                      <Link to="/register">
                        <Button size="md">Get Started</Button>
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* Chat Icon Button - Moved to Far Right */}
              <div className="pl-3 border-l border-border/80">
                <button
                  onClick={toggleChat}
                  className="group flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-emerald-500/10 text-primary border border-primary/20 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
                  title="Chat with AI"
                >
                  <AppIcon name="smart_toy" className="text-[20px] text-primary" />
                </button>
              </div>
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
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary"
            >
              <AppIcon name="home" className="text-[20px] text-primary" />
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary"
            >
              <AppIcon name="info" className="text-[20px] text-primary" />
              About
            </Link>
            <Link
              to="/how-it-works"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary"
            >
              <AppIcon name="alt_route" className="text-[20px] text-primary" />
              How It Works
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false)
                toggleChat()
              }}
              className="flex items-center gap-2.5 px-3 py-2 cursor-pointer rounded-lg text-sm font-medium text-charcoal hover:bg-primary/5 hover:text-primary w-full text-left"
            >
              <AppIcon name="smart_toy" className="text-[20px] text-primary" />
              Chat with AI
            </button>
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
                  <AppIcon name={item.icon} className="text-[20px] text-primary" />
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
                to={getDashboardPath(user?.role)}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-danger/10 text-danger"
              >
                <AppIcon name="logout" className="text-[18px]" /> Log out
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
