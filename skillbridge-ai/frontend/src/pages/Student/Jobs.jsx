import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import PageHeader from '../../components/common/PageHeader'
import { opportunityApi } from '../../api/opportunity.api'
import { mockJobs } from '../../utils/mockData'

export default function Jobs() {
  const [query, setQuery] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    opportunityApi.getOpportunities({ type: 'job' })
      .then((data) => {
        if (isMounted && data && data.length > 0) setOpportunities(data)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const filtered = useMemo(() => {
    if (opportunities.length > 0) {
      return opportunities.filter((item) => {
        if (query && !`${item.title} ${item.company?.company_name} ${item.description}`.toLowerCase().includes(query.toLowerCase())) return false
        if (workMode && item.work_mode !== workMode) return false
        return true
      })
    }
    return mockJobs.filter((j) => {
      if (query && !`${j.company} ${j.role} ${j.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [query, workMode, opportunities])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Full-Time Jobs"
        subtitle="Full-time roles for early-career developers connected live to CareerSync hiring partners."
        actions={<Badge variant="default">{filtered.length} roles</Badge>}
      />

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role, company, skills..." wrapperClassName="sm:col-span-2" />
          <Select placeholder="Work Mode" value={workMode} onChange={(e) => setWorkMode(e.target.value)} options={['remote', 'hybrid', 'onsite']} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} hover className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background border border-border text-lg font-bold text-primary shrink-0">
                {item.company?.company_name ? item.company.company_name[0] : '🏢'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-charcoal">{item.title || item.role}</h3>
                <p className="text-xs text-muted">
                  {item.company?.company_name || item.company} • {item.location} • {item.stipend_salary || item.salary}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.skill_requirements && item.skill_requirements.length > 0 ? (
                    item.skill_requirements.map((req) => (
                      <span key={req.id} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">
                        {req.skill?.name} (Min {req.minimum_score}%)
                      </span>
                    ))
                  ) : (
                    (item.skills || ['Python', 'Django']).map((s) => (
                      <span key={s} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">{s}</span>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Badge variant="success">{item.work_mode || 'Full-time'}</Badge>
              <Button size="sm">Apply Now</Button>
              <Button variant="outline" size="sm">Details</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
