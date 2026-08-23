import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import PageHeader from '../../components/common/PageHeader'
import { mockInternships } from '../../utils/mockData'

export default function Internships() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [duration, setDuration] = useState('')

  const filtered = useMemo(() => mockInternships.filter((j) => {
    if (query && !`${j.company} ${j.role} ${j.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false
    if (location && !j.location.toLowerCase().includes(location.toLowerCase())) return false
    if (duration && j.duration !== duration) return false
    return true
  }), [query, location, duration])

  return (
    <div className="space-y-6">
      <PageHeader title="Internships" subtitle="Matched to your Full Stack Developer profile. Apply directly and track in Applications." actions={<Badge variant="default">{filtered.length} openings</Badge>} />

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role, company, skills..." wrapperClassName="sm:col-span-1" />
          <Select placeholder="All locations" value={location} onChange={(e) => setLocation(e.target.value)} options={['Remote', 'Bengaluru', 'Gurugram']} />
          <Select placeholder="Any duration" value={duration} onChange={(e) => setDuration(e.target.value)} options={['3 Months', '4 Months', '6 Months']} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((job) => (
          <Card key={job.id} hover className="flex flex-col">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background border border-border text-xl shrink-0">{job.logo}</div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-charcoal leading-snug">{job.role}</h3>
                <p className="text-xs text-muted">{job.company} • {job.location}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold border ${job.match >= 85 ? 'bg-success/10 text-success border-success/20' : job.match >= 75 ? 'bg-warning/10 text-warning border-warning/20' : 'bg-white border-border text-muted'}`}>{job.match}% Match</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {job.skills.map((s) => (
                <span key={s} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">{s}</span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted">
              <span>{job.stipend}</span><span>•</span><span>{job.duration}</span><span>•</span><span>{job.posted}</span>
            </div>
            <p className="mt-1 text-xs text-muted">{job.applicants} applicants</p>
            <div className="mt-4 flex gap-2">
              <Button className="flex-1" size="sm">Apply Now</Button>
              <Button variant="outline" size="sm">Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
