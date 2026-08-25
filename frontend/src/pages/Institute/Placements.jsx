import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import AppIcon from '../../components/ui/AppIcon'
import { opportunityApi } from '../../api/opportunity.api'
import { getCompanyLogo } from '../../utils/helpers'

export default function InstitutePlacements() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all') // 'all', 'internship', 'job'
  const [workModeFilter, setWorkModeFilter] = useState('all')

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    opportunityApi.getOpportunities()
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.results || []
          setOpportunities(list)
        }
      })
      .catch(() => {
        if (isMounted) setOpportunities([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const filtered = opportunities.filter((op) => {
    if (typeFilter !== 'all' && op.opportunity_type !== typeFilter) return false
    if (workModeFilter !== 'all' && op.work_mode !== workModeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const titleMatch = op.title?.toLowerCase().includes(q)
      const compMatch = op.company?.company_name?.toLowerCase().includes(q)
      const skillMatch = op.skill_requirements?.some((sr) => sr.skill?.name?.toLowerCase().includes(q))
      if (!titleMatch && !compMatch && !skillMatch) return false
    }
    return true
  })

  const totalInternships = opportunities.filter((o) => o.opportunity_type === 'internship').length
  const totalJobs = opportunities.filter((o) => o.opportunity_type === 'job').length

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Industry Placements &amp; Hiring Drives</h1>
          <p className="mt-1 text-sm text-muted">
            Live requirements and skill benchmarks posted by corporate industry partners.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge icon="work" variant="default">
            {opportunities.length} Active Industry Drives
          </Badge>
        </div>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="!p-4 bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <AppIcon name="business_center" className="text-[22px]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Total Drives</p>
              <p className="text-xl font-bold text-charcoal">{opportunities.length}</p>
            </div>
          </div>
        </Card>

        <Card className="!p-4 bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <AppIcon name="school" className="text-[22px]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Internships</p>
              <p className="text-xl font-bold text-emerald-700">{totalInternships}</p>
            </div>
          </div>
        </Card>

        <Card className="!p-4 bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <AppIcon name="workspace_premium" className="text-[22px]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Full-Time Jobs</p>
              <p className="text-xl font-bold text-blue-700">{totalJobs}</p>
            </div>
          </div>
        </Card>

        <Card className="!p-4 bg-gradient-to-br from-white to-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AppIcon name="bolt" className="text-[22px]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted uppercase tracking-wider">Hiring Status</p>
              <p className="text-sm font-bold text-amber-700 mt-1">Live Applications</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <Card className="!p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Search by company, role title, or required skill (e.g. React, Python)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-background rounded-xl p-1 border border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${typeFilter === 'all' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'}`}
              >
                All Types
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('internship')}
                className={`px-3 py-1.5 rounded-lg transition-all ${typeFilter === 'internship' ? 'bg-white text-emerald-700 shadow-sm' : 'text-muted hover:text-charcoal'}`}
              >
                Internships
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('job')}
                className={`px-3 py-1.5 rounded-lg transition-all ${typeFilter === 'job' ? 'bg-white text-blue-700 shadow-sm' : 'text-muted hover:text-charcoal'}`}
              >
                Full-Time Jobs
              </button>
            </div>

            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold text-charcoal shadow-soft focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Modes (Remote/Hybrid/Onsite)</option>
              <option value="remote">Remote Only</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-Site</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Opportunities List Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-sm text-muted">
            Fetching live industry drives and skill requirements…
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((op) => {
            const companyName = op.company?.company_name || 'Hiring Partner'
            const companyInitial = companyName.charAt(0).toUpperCase()
            const isInternship = op.opportunity_type === 'internship'

            return (
              <Card key={op.id} className="hover:shadow-card transition-all duration-200 border-border/80 p-5 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Company & Title Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={getCompanyLogo(op.company)}
                      alt={companyName}
                      className="h-12 w-12 rounded-xl object-contain border border-border bg-background p-1 shadow-xs shrink-0"
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-charcoal">{op.title}</h2>
                        <Badge variant={isInternship ? 'success' : 'default'} className="capitalize">
                          {op.opportunity_type}
                        </Badge>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium capitalize">
                          {op.work_mode || 'Remote'}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-primary mt-1">
                        {companyName}
                        {op.company?.website && (
                          <a
                            href={op.company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="ml-2 text-xs text-muted font-normal hover:underline inline-flex items-center gap-0.5"
                          >
                            <span>Visit website</span>
                            <AppIcon name="open_in_new" className="text-[12px]" />
                          </a>
                        )}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted mt-2">
                        <span className="flex items-center gap-1">
                          <AppIcon name="location_on" className="text-[14px]" />
                          {op.location || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1">
                          <AppIcon name="payments" className="text-[14px]" />
                          {op.stipend_salary || (isInternship ? 'Stipend provided' : 'Competitive CTC')}
                        </span>
                        <span className="flex items-center gap-1">
                          <AppIcon name="schedule" className="text-[14px]" />
                          Duration: {op.duration || '6 Months'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Meta Info */}
                  <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-border">
                    <div className="text-left lg:text-right">
                      <p className="text-xs text-muted">Application Benchmark</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700 mt-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live for Students
                      </span>
                    </div>
                    {op.deadline && (
                      <p className="text-xs text-muted">
                        Deadline: <span className="font-semibold text-charcoal">{op.deadline}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                {op.description && (
                  <p className="mt-4 text-sm text-charcoal/80 line-clamp-2 leading-relaxed bg-background/50 p-3 rounded-xl border border-border/50">
                    {op.description}
                  </p>
                )}

                {/* Key Skills & Benchmarks Required */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
                    <AppIcon name="military_tech" className="text-primary text-[16px]" />
                    Industry Skill Benchmarks Required:
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    {op.skill_requirements && op.skill_requirements.length > 0 ? (
                      op.skill_requirements.map((sr, i) => (
                        <div
                          key={sr.id || i}
                          className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-1 text-xs shadow-soft"
                        >
                          <span className="font-bold text-charcoal">{sr.skill?.name || 'Skill'}</span>
                          <span className="text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                            Min {sr.minimum_score}%
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted italic">General Eligibility — open to all disciplines</span>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        ) : (
          <Card className="py-16 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
              <AppIcon name="business_center" className="text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-charcoal">No Industry Drives Found</h2>
            <p className="text-xs text-muted max-w-md mx-auto mt-1 leading-relaxed">
              When corporate companies and startups publish internships or job opportunities, their required skills, packages, and criteria will automatically appear here.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
