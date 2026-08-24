import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import JobApplicationModal from '../../components/ui/JobApplicationModal'
import AppIcon from '../../components/ui/AppIcon';

const mockJobs = [
  { id: 1, role: 'Frontend Engineer', company: 'TechNova', logo: 'TN', location: 'Bengaluru', salary: '₹8–12 LPA', exp: '0–2 years', type: 'Full-time', mode: 'Remote', skills: ['React', 'TypeScript', 'Testing'], match: 93, posted: '2 days ago', applicants: 312 },
  { id: 2, role: 'Backend Engineer — Node.js', company: 'CloudDash', logo: 'CD', location: 'Pune', salary: '₹10–14 LPA', exp: '1–3 years', type: 'Full-time', mode: 'Hybrid', skills: ['Node.js', 'Postgres', 'AWS'], match: 89, posted: '1 week ago', applicants: 198 },
  { id: 3, role: 'Data Analyst', company: 'Insightly', logo: 'IN', location: 'Hyderabad', salary: '₹6–9 LPA', exp: '0–1 years', type: 'Full-time', mode: 'Onsite', skills: ['SQL', 'Python', 'Tableau'], match: 85, posted: '3 days ago', applicants: 267 },
  { id: 4, role: 'Product Designer — UI/UX', company: 'PixelForge', logo: 'PF', location: 'Mumbai', salary: '₹7–11 LPA', exp: '1–2 years', type: 'Full-time', mode: 'Remote', skills: ['Figma', 'Design Systems', 'Research'], match: 88, posted: '5 days ago', applicants: 144 },
  { id: 5, role: 'ML Engineer', company: 'Neurabloom', logo: 'NB', location: 'Chennai', salary: '₹12–18 LPA', exp: '2–4 years', type: 'Full-time', mode: 'Hybrid', skills: ['PyTorch', 'MLOps', 'Python'], match: 81, posted: '1 day ago', applicants: 87 },
  { id: 6, role: 'Full-Stack Developer', company: 'BuildStack', logo: 'BS', location: 'Delhi', salary: '₹9–13 LPA', exp: '1–3 years', type: 'Contract', mode: 'Remote', skills: ['React', 'Node.js', 'SQL'], match: 90, posted: '4 days ago', applicants: 221 },
]

const JobCard = ({ item, onApply }) => (
  <Card hover className="p-5 flex flex-col justify-between h-full">
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-charcoal text-white font-bold text-sm">{item.logo}</div>
          <div>
            <h3 className="font-bold leading-tight text-charcoal">{item.role}</h3>
            <p className="text-sm text-muted">{item.company} • {item.location} • {item.mode}</p>
          </div>
        </div>
        <Badge variant={item.match >= 90 ? 'success' : 'default'}>{item.match}% match</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2"><AppIcon name="payments" className="text-[16px] text-muted" /> {item.salary}</div>
        <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2"><AppIcon name="work_history" className="text-[16px] text-muted" /> {item.exp}</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="rounded-full bg-sage border border-border px-2.5 py-1 text-xs font-medium text-primary">{item.type}</span>
        <span className="rounded-full bg-white border border-border px-2.5 py-1 text-xs">{item.mode}</span>
        {item.skills.map((s) => <span key={s} className="rounded-full bg-white border border-border px-2.5 py-1 text-xs text-charcoal/70">{s}</span>)}
      </div>
    </div>

    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
      <span className="text-muted">{item.posted} • {item.applicants} applicants</span>
      <button
        onClick={() => onApply(item)}
        className="rounded-lg bg-primary px-3.5 py-1.5 font-semibold text-white hover:bg-primary/90 transition-all shadow-sm active:scale-95 text-xs flex items-center gap-1"
      >
        <span>Apply Job</span>
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
    </div>
  </Card>
)

const Jobs = () => {
  const [q, setQ] = useState('')
  const [exp, setExp] = useState('All')
  const [type, setType] = useState('All')
  const [mode, setMode] = useState('All')
  const [location, setLocation] = useState('All')
  const [salary, setSalary] = useState('All')
  const [match, setMatch] = useState('All')
  const [selectedJobForApply, setSelectedJobForApply] = useState(null)

  const filtered = useMemo(() => {
    return mockJobs.filter((j) => {
      if (q && !(`${j.role} ${j.company} ${j.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false
      if (exp !== 'All' && j.exp !== exp) return false
      if (type !== 'All' && j.type !== type) return false
      if (mode !== 'All' && j.mode !== mode) return false
      if (location !== 'All' && j.location !== location) return false
      if (salary !== 'All') {
        const low = parseInt(j.salary.split('–')[0].replace(/[^\d]/g, ''))
        if (salary === '₹6–9 LPA' && !(low >= 6 && low <= 9)) return false
        if (salary === '₹9–13 LPA' && !(low >= 9 && low <= 13)) return false
        if (salary === '₹13+ LPA' && low < 13) return false
      }
      if (match !== 'All') {
        if (match === '90%+' && j.match < 90) return false
        if (match === '85%+' && j.match < 85) return false
        if (match === '80%+' && j.match < 80) return false
      }
      return true
    })
  }, [q, exp, type, mode, location, salary, match])

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold tracking-tight text-charcoal">Jobs</h1>
          <p className="mt-2 text-sm text-muted max-w-2xl">Full-time and contract roles scored by your skill fit. Apply with verified signals employers trust.</p>

          <div className="mt-6">
            <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs by role, skill or company" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={exp} onChange={(e) => setExp(e.target.value)} placeholder="Experience" options={['All', '0–1 years', '0–2 years', '1–2 years', '1–3 years', '2–4 years']} />
            <Select value={type} onChange={(e) => setType(e.target.value)} placeholder="Job type" options={['All', 'Full-time', 'Contract']} />
            <Select value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Work mode" options={['All', 'Remote', 'Hybrid', 'Onsite']} />
            <Select value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" options={['All', 'Bengaluru', 'Pune', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi']} />
            <Select value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary" options={['All', '₹6–9 LPA', '₹9–13 LPA', '₹13+ LPA']} />
            <Select value={match} onChange={(e) => setMatch(e.target.value)} placeholder="Match %" options={['All', '80%+', '85%+', '90%+']} />
            <div className="flex items-center">
              <button onClick={() => { setQ(''); setExp('All'); setType('All'); setMode('All'); setLocation('All'); setSalary('All'); setMatch('All') }} className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-background">Clear filters</button>
            </div>
          </div>

          <div className="mt-4 text-xs text-muted">{filtered.length} jobs • Ranked by match %</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((j) => (
              <JobCard key={j.id} item={j} onApply={(job) => setSelectedJobForApply(job)} />
            ))}
          </div>
        ) : (
          <Card className="p-10 text-center text-muted">No jobs match your filters.</Card>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-charcoal px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white">Stand out with verified skills</h3>
            <p className="text-sm text-white/60">Candidates with verified assessments get 2.4× more interview invites.</p>
          </div>
          <Link to="/register"><Button size="lg" className="bg-white text-charcoal border-white hover:bg-white/90">Verify my skills</Button></Link>
        </div>
      </section>

      {/* Application Form Modal */}
      <JobApplicationModal
        open={Boolean(selectedJobForApply)}
        onClose={() => setSelectedJobForApply(null)}
        job={selectedJobForApply}
      />
    </div>
  )
}

export default Jobs
