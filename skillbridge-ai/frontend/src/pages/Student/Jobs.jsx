import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import PageHeader from '../../components/common/PageHeader'
import { mockJobs } from '../../utils/mockData'

export default function Jobs() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('')

  const filtered = useMemo(() => mockJobs.filter((j) => {
    if (query && !`${j.company} ${j.role} ${j.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false
    if (type && j.type !== type) return false
    return true
  }), [query, type])

  return (
    <div className="space-y-6">
      <PageHeader title="Jobs" subtitle="Full-time roles for early-career developers. Your match % is based on current skill proficiency." actions={<Badge variant="default">{filtered.length} roles</Badge>} />

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role, company, skills..." wrapperClassName="sm:col-span-2" />
          <Select placeholder="All types" value={type} onChange={(e) => setType(e.target.value)} options={['Full-time', 'Contract', 'Internship']} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((job) => (
          <Card key={job.id} hover className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background border border-border text-xl shrink-0">{job.logo}</div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-charcoal">{job.role}</h3>
              <p className="text-xs text-muted">{job.company} • {job.location} • {job.salary} • {job.posted}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <span key={s} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="rounded-full bg-success/10 border border-success/20 px-3 py-1 text-xs font-bold text-success">{job.match}% Match</span>
              <Button size="sm">Apply</Button>
              <Button variant="outline" size="sm">Save</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
