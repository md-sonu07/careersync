import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-border-light px-6 md:px-8 h-20 flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'bg-background/98 shadow-card backdrop-blur-md' : 'bg-background/90 backdrop-blur-md'
      }`}
    >
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">SkillBridge AI</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <a href="#how-it-works" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          How It Works
        </a>
        <a href="#courses" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          Courses
        </a>
        <a href="#jobs" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          Jobs
        </a>
        <Link to="/#ai-assistant" className="text-sm font-medium text-charcoal hover:text-primary transition-colors">
          Chat with AI
        </Link>
      </div>

      <div className="flex items-center gap-3">
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
    </nav>
  )
}

export default Navbar
