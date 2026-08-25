import { Link } from 'react-router-dom'
import AppIcon from '../ui/AppIcon';

const socialLinks = ['public', 'share', 'group', 'alternate_email']

const platformLinks = [
  { label: 'About Us', href: '#' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Courses', href: '#courses' },
  { label: 'Internships', href: '#' },
  { label: 'Jobs', href: '#jobs' },
]

const userLinks = [
  { label: 'For Students', href: '#' },
  { label: 'For Industry', href: '#' },
  { label: 'For Institute', href: '#' },
  { label: 'For Admins', href: '#' },
]

const contactInfo = [
  { icon: 'mail', text: 'info@careersync.ai' },
  { icon: 'location_on', text: 'Silicon Valley, CA' },
  { icon: 'schedule', text: 'Support: 24/7' },
]

const Footer = () => {
  return (
    <footer className="bg-primary border-t text-[#F7F4EE] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 @3xl:px-8">
        <div className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <div className="text-2xl font-bold tracking-tight">CareerSync</div>
            <p className="text-white/80 text-sm leading-relaxed">
              The intelligent bridge between academic learning and industry excellence. Empowering the next generation of
              professionals through AI-driven skill matching.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((icon) => (
                <a key={icon} href="#" className="hover:text-accent transition-colors">
                  <AppIcon name={icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Platform</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h4 className="font-bold mb-6 text-lg">For Users</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              {userLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-accent transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-6 text-lg">Contact</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/80">
              {contactInfo.map((info) => (
                <li key={info.text} className="flex items-center gap-2">
                  <AppIcon name={info.icon} className="text-[18px]" /> {info.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col @3xl:flex-row justify-between items-center gap-4 text-xs text-white/60">
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
