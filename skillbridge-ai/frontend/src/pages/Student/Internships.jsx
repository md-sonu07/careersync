import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import PageHeader from '../../components/common/PageHeader'
import { opportunityApi } from '../../api/opportunity.api'
import { applicationApi } from '../../api/application.api'
import { toast } from 'react-hot-toast'
import { mockInternships } from '../../utils/mockData'

export default function Internships() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [opportunities, setOpportunities] = useState([])
  const [appliedMap, setAppliedMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    Promise.all([
      opportunityApi.getOpportunities({ type: 'internship' }).catch(() => {
        if (isMounted) {
          toast({
            title: 'Failed to load internships',
            description: 'Could not load internship opportunities. Please try again.',
            variant: 'destructive',
          })
        }
        return []
      }),
      applicationApi.getMyApplications().catch(() => {
        if (isMounted) {
          toast({
            title: 'Failed to load applications',
            description: 'Could not load your applications. Please try again.',
            variant: 'destructive',
          })
        }
        return []
      }),
    ]).then(([opps, myApps]) => {
      if (isMounted) {
        if (opps && opps.length > 0) setOpportunities(opps)
        if (myApps && myApps.length > 0) {
          const map = {}
          myApps.forEach((a) => {
            if (a.opportunity?.id) map[a.opportunity.id] = true
          })
          setAppliedMap(map)
        }
      }
    }).finally(() => {
      if (isMounted) setLoading(false)
    })

    return () => { isMounted = false }
  }, [])

  const handleApply = async (oppId) => {
    try {
      await applicationApi.applyForOpportunity(oppId, {
        cover_letter: 'I am highly interested in applying for this internship opportunity via CareerSync.',
      })
      setAppliedMap((prev) => ({ ...prev, [oppId]: true }))
      toast({
        title: 'Application submitted',
        description: 'Your application has been submitted successfully.',
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Application failed',
        description: 'Failed to submit application. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const filtered = useMemo(() => {
    if (opportunities.length > 0) {
      return opportunities.filter((item) => {
        if (query && !`${item.title} ${item.company?.company_name} ${item.description}`.toLowerCase().includes(query.toLowerCase())) return false
        if (location && !item.location.toLowerCase().includes(location.toLowerCase())) return false
        return true
      })
    }
    return mockInternships.filter((j) => {
      if (query && !`${j.company} ${j.role} ${j.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false
      if (location && !j.location.toLowerCase().includes(location.toLowerCase())) return false
      return true
    })
  }, [query, location, opportunities])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Internship Opportunities"
        subtitle="Live internship postings connected directly to CareerSync hiring partners."
        actions={<Badge variant="default">{filtered.length} openings</Badge>}
      />

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role, company, or skills..." />
          <Select placeholder="All locations" value={location} onChange={(e) => setLocation(e.target.value)} options={['Remote', 'Bengaluru', 'Hybrid']} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((item) => {
          const isApplied = appliedMap[item.id]
          return (
            <Card key={item.id} hover className="flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background border border-border text-lg font-bold text-primary shrink-0">
                    {item.company?.company_name ? item.company.company_name[0] : '🏢'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-charcoal leading-snug">{item.title || item.role}</h3>
                    <p className="text-xs text-muted">{item.company?.company_name || item.company} • {item.location}</p>
                  </div>
                  <Badge variant={isApplied ? 'success' : 'default'}>
                    {isApplied ? 'Applied ✓' : item.work_mode || 'Remote'}
                  </Badge>
                </div>

                <p className="mt-3 text-xs text-muted line-clamp-2">{item.description}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.skill_requirements && item.skill_requirements.length > 0 ? (
                    item.skill_requirements.map((req) => (
                      <span key={req.id} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">
                        {req.skill?.name} (Min {req.minimum_score}%)
                      </span>
                    ))
                  ) : (
                    (item.skills || ['React', 'Python']).map((s) => (
                      <span key={s} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">{s}</span>
                    ))
                  )}
                </div>

                <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                  <span className="font-semibold text-charcoal">{item.stipend_salary || item.stipend}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  className="flex-1"
                  size="sm"
                  variant={isApplied ? 'secondary' : 'primary'}
                  disabled={isApplied}
                  onClick={() => handleApply(item.id)}
                >
                  {isApplied ? 'Applied ✓' : 'Apply Now'}
                </Button>
                <Link to={`/student/internship/${item.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
