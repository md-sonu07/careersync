import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-primary border-t text-[#F7F4EE] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="text-2xl font-bold tracking-tight">CareerSync</div>
            <p className="text-white/80 text-sm leading-relaxed">
              The intelligent bridge between academic learning and industry excellence. Empowering the next generation of
              professionals through AI-driven skill matching.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <span className="material-symbols-outlined">share</span>
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <span className="material-symbols-outlined">group</span>
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Platform</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-accent transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#courses" className="hover:text-accent transition-colors">
                  Courses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Internships
                </a>
              </li>
              <li>
                <a href="#jobs" className="hover:text-accent transition-colors">
                  Jobs
                </a>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-bold mb-6 text-lg">For Users</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  For Students
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  For Industry
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  For Academia
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  For Admins
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">mail</span> info@careersync.ai
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span> Silicon Valley, CA
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">schedule</span> Support: 24/7
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} CareerSync. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
