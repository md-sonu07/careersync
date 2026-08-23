import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'

const mockInternships = [
  { id: 1, role: 'Frontend Developer Intern', company: 'TechNova', logo: 'TN', location: 'Bengaluru', duration: '3 months', stipend: '₹15,000/month', skills: ['React', 'TypeScript', 'Tailwind'], match: 91, deadline: '15 Sep 2026', type: 'Remote', applicants: 124 },
  { id: 2, role: 'Data Science Intern', company: 'DataCraft', logo: 'DC', location: 'Hyderabad', duration: '6 months', stipend: '₹20,000/month', skills: ['Python', 'SQL', 'ML'], match: 88, deadline: '20 Sep 2026', type: 'Hybrid', applicants: 89 },
  { id: 3, role: 'UI/UX Design Intern', company: 'PixelForge', logo: 'PF', location: 'Mumbai', duration: '2 months', stipend: '₹12,000/month', skills: ['Figma', 'Prototyping', 'A11y'], match: 84, deadline: '10 Sep 2026', type: 'Onsite', applicants: 156 },
  { id: 4, role: 'Backend Intern — Node.js', company: 'CloudDash', logo: 'CD', location: 'Pune', duration: '4 months', stipend: '₹18,000/month', skills: ['Node.js', 'Postgres', 'REST'], match: 92, deadline: '18 Sep 2026', type: 'Remote', applicants: 67 },
  { id: 5, role: 'Product Analytics Intern', company: 'Insightly', logo: 'IN', location: 'Delhi', duration: '3 months', stipend: '₹16,000/month', skills: ['SQL', 'Mixpanel', 'Sheets'], match: 79, deadline: '25 Sep 2026', type: 'Hybrid', applicants: 203 },
  { id: 6, role: 'AI/ML Research Intern', company: 'Neurabloom', logo: 'NB', location: 'Chennai', duration: '6 months', stipend: '₹25,000/month', skills: ['PyTorch', 'NLP', 'Research'], match: 87, deadline: '30 Sep 2026', type: 'Remote', applicants: 42 },
]

const InternshipCard = ({ item }) => (
  <Card hover className="p-5 flex flex-col">
    <div className="flex items-start justify-between gap-3">
      <div className="flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage border border-border font-bold text-primary text-sm">{item.logo}</div>
        <div>
          <h3 className="font-bold leading-tight text-charcoal">{item.role}</h3>
          <p className="text-sm text-muted">{item.company} • {item.location} • {item.type}</p>
        </div>
      </div>
      <Badge variant={item.match >= 90 ? 'success' : item.match >= 85 ? 'default' : 'muted'}>{item.match}% match</Badge>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
      <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-muted">schedule</span> {item.duration}</div>
      <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2"><span className="material-symbols-outlined text-[16px] text-muted">payments</span> {item.stipend}</div>
    </div>

    <div className="mt-4 flex flex-wrap gap-1.5">
      {item.skills.map((s) => <span key={s} className="rounded-full bg-white border border-border px-2.5 py-1 text-xs text-charcoal/70">{s}</span>)}
    </div>

    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs">
      <span className="text-muted">Deadline: <span className="font-semibold text-charcoal">{item.deadline}</span> • {item.applicants} applicants</span>
      <Link to="#" className="font-semibold text-primary hover:underline">View & Apply →</Link>
    </div>
  </Card>
)

const Internships = () => {
  const [q, setQ] = useState('')
  const [role, setRole] = useState('All')
  const [skill, setSkill] = useState('All')
  const [location, setLocation] = useState('All')
  const [mode, setMode] = useState('All')
  const [duration, setDuration] = useState('All')
  const [stipend, setStipend] = useState('All')
  const [match, setMatch] = useState('All')

  const filtered = useMemo(() => {
    return mockInternships.filter((it) => {
      if (q && !(`${it.role} ${it.company} ${it.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false
      if (role !== 'All' && !it.role.toLowerCase().includes(role.toLowerCase())) return false
      if (skill !== 'All' && !it.skills.includes(skill)) return false
      if (location !== 'All' && it.location !== location) return false
      if (mode !== 'All' && it.type !== mode) return false
      if (duration !== 'All' && it.duration !== duration) return false
      if (stipend !== 'All') {
        const val = parseInt(it.stipend.replace(/[^\d]/g, ''))
        if (stipend === '₹0-15k' && val > 15000) return false
        if (stipend === '₹15k-20k' && (val < 15000 || val > 20000)) return false
        if (stipend === '₹20k+' && val < 20000) return false
      }
      if (match !== 'All') {
        if (match === '90%+' && it.match < 90) return false
        if (match === '85%+' && it.match < 85) return false
        if (match === '80%+' && it.match < 80) return false
      }
      return true
    })
  }, [q, role, skill, location, mode, duration, stipend, match])

  return (
    <div className="bg-background">
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-charcoal">Internships</h1>
          <p className="mt-2 text-sm text-muted max-w-2xl">Discover internships scored by how well you fit. Every card shows match %, skills and deadline — no guesswork.</p>

          <div className="mt-6">
            <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search internships by role, skill or company" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" options={['All', 'Frontend', 'Backend', 'Data Science', 'UI/UX', 'AI/ML']} />
            <Select value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill" options={['All', 'React', 'Python', 'SQL', 'Figma', 'Node.js', 'PyTorch']} />
            <Select value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" options={['All', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai']} />
            <Select value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Work mode" options={['All', 'Remote', 'Hybrid', 'Onsite']} />
            <Select value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration" options={['All', '2 months', '3 months', '4 months', '6 months']} />
            <Select value={stipend} onChange={(e) => setStipend(e.target.value)} placeholder="Stipend" options={['All', '₹0-15k', '₹15k-20k', '₹20k+']} />
            <Select value={match} onChange={(e) => setMatch(e.target.value)} placeholder="Match %" options={['All', '80%+', '85%+', '90%+']} />
            <button onClick={() => { setQ(''); setRole('All'); setSkill('All'); setLocation('All'); setMode('All'); setDuration('All'); setStipend('All'); setMatch('All') }} className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-background">Clear filters</button>
          </div>

          <div className="mt-4 text-xs text-muted">{filtered.length} internships • Sorted by match %</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it) => <InternshipCard key={it.id} item={it} />)}
          </div>
        ) : (
          <Card className="p-10 text-center text-muted">No internships match your filters.</Card>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-primary px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white">Get matched faster</h3>
            <p className="text-sm text-white/70">Complete your profile to increase match % and get priority recommendations.</p>
          </div>
          <Link to="/register"><Button variant="outline" className="bg-white text-primary border-white hover:bg-white/90">Improve my matches</Button></Link>
        </div>
      </section>
    </div>
  )
}

export default Internships
