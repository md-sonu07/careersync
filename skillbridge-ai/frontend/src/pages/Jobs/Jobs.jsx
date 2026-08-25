import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea'
import AppIcon from '../../components/ui/AppIcon'
import { opportunityApi } from '../../api/opportunity.api'
import { applicationApi } from '../../api/application.api'
import { useAuth } from '../../hooks/useAuth'
import { timeSince, getCompanyLogo } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

export default function Jobs() {
  const { user, isAuthenticated } = useAuth()
  const [jobs, setJobs] = useState([])
  const [appliedMap, setAppliedMap] = useState({})
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState('')
  const [exp, setExp] = useState('All')
  const [mode, setMode] = useState('All')
  const [location, setLocation] = useState('All')
  const [matchFilter, setMatchFilter] = useState('All')

  const [selectedJob, setSelectedJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      let liveData = []
      let myApps = []

      if (isAuthenticated && user?.role === 'student') {
        const [matches, apps] = await Promise.all([
          opportunityApi.getOpportunityMatches().catch(() => []),
          applicationApi.getMyApplications().catch(() => []),
        ])

        myApps = apps || []
        if (Array.isArray(matches) && matches.length > 0) {
          liveData = matches
            .filter((m) => m.opportunity?.opportunity_type === 'job')
            .map((m) => {
              const opp = m.opportunity || {}
              const companyName = opp.company?.company_name || 'Hiring Partner'
              const companyLogo = getCompanyLogo(opp.company)
              return {
                id: opp.id || m.id,
                oppId: opp.id,
                role: opp.title || 'Full-Time Job',
                company: companyName,
                logo: companyLogo,
                location: opp.location || 'Remote',
                salary: opp.stipend_salary || '₹8–12 LPA',
                exp: '0–2 years',
                type: 'Full-time',
                mode: opp.work_mode ? opp.work_mode.charAt(0).toUpperCase() + opp.work_mode.slice(1) : 'Hybrid',
                skills: opp.skill_requirements && opp.skill_requirements.length > 0
                  ? opp.skill_requirements.map((r) => r.skill?.name || r.skill_name || 'Skill')
                  : ['React', 'Python', 'Tailwind CSS'],
                match: Math.round(m.match_score || 85),
                posted: opp.created_at ? timeSince(opp.created_at) : 'Just now',
                deadline: opp.deadline || '30 Sep 2026',
                applicants: typeof opp.applicants_count === 'number' ? opp.applicants_count : 1,
                raw: opp,
              }
            })
        }
      }

      if (liveData.length === 0) {
        const opps = await opportunityApi.getOpportunities({ type: 'job' }).catch(() => [])
        if (opps && Array.isArray(opps)) {
          liveData = opps.map((opp) => {
            const companyName = opp.company?.company_name || 'Hiring Partner'
            const companyLogo = getCompanyLogo(opp.company)
            return {
              id: opp.id,
              oppId: opp.id,
              role: opp.title || 'Full-Time Job',
              company: companyName,
              logo: companyLogo,
              location: opp.location || 'Remote',
              salary: opp.stipend_salary || '₹8–12 LPA',
              exp: '0–2 years',
              type: 'Full-time',
              mode: opp.work_mode ? opp.work_mode.charAt(0).toUpperCase() + opp.work_mode.slice(1) : 'Hybrid',
              skills: opp.skill_requirements && opp.skill_requirements.length > 0
                ? opp.skill_requirements.map((r) => r.skill?.name || r.skill_name || 'Skill')
                : ['React', 'Python'],
              match: 80,
              posted: opp.created_at ? timeSince(opp.created_at) : 'Just now',
              deadline: opp.deadline || '30 Sep 2026',
              applicants: typeof opp.applicants_count === 'number' ? opp.applicants_count : 1,
              raw: opp,
            }
          })
        }
      }

      setJobs(liveData)

      if (myApps && Array.isArray(myApps)) {
        const map = {}
        myApps.forEach((a) => {
          if (a.opportunity?.id) map[a.opportunity.id] = true
        })
        setAppliedMap(map)
      }
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [isAuthenticated, user?.role])

  const handleApply = async (item) => {
    if (!item?.oppId) return
    try {
      setSubmitting(true)
      await applicationApi.applyForOpportunity(item.oppId, {
        cover_letter: coverLetter || 'I am excited to apply for this full-time role via CareerSync.',
      })
      setAppliedMap((prev) => ({ ...prev, [item.oppId]: true }))
      toast.success(`Application for "${item.role}" submitted successfully!`)
      setSelectedJob(null)
      setCoverLetter('')
    } catch (err) {
      toast.error('Application failed: ' + (err.response?.data?.detail || 'Already applied or error occurred.'))
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (q && !`${j.role} ${j.company} ${j.skills.join(' ')} ${j.location}`.toLowerCase().includes(q.toLowerCase())) return false
      if (mode !== 'All' && j.mode.toLowerCase() !== mode.toLowerCase()) return false
      if (location !== 'All' && !j.location.toLowerCase().includes(location.toLowerCase())) return false
      if (matchFilter !== 'All') {
        if (matchFilter === '90%+' && j.match < 90) return false
        if (matchFilter === '85%+' && j.match < 85) return false
        if (matchFilter === '80%+' && j.match < 80) return false
      }
      return true
    })
  }, [jobs, q, mode, location, matchFilter])

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-charcoal">Full-Time Jobs</h1>
              <p className="mt-2 text-sm text-muted max-w-2xl">
                {isAuthenticated && user?.role === 'student'
                  ? `AI-calculated weighted job recommendations tailored for ${user?.first_name || 'your profile'}.`
                  : 'Full-time and contract roles connected live to CareerSync hiring partners.'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              <AppIcon name="refresh" className="text-[16px]" /> Refresh
            </Button>
          </div>

          <div className="mt-6">
            <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs by role, skill, or company" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Work mode" options={['All', 'Remote', 'Hybrid', 'Onsite']} />
            <Select value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" options={['All', 'Remote', 'Bengaluru', 'Pune', 'Hyderabad', 'Mumbai']} />
            <Select value={matchFilter} onChange={(e) => setMatchFilter(e.target.value)} placeholder="Match %" options={['All', '80%+', '85%+', '90%+']} />
            <button
              onClick={() => { setQ(''); setMode('All'); setLocation('All'); setMatchFilter('All') }}
              className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-background transition-colors"
            >
              Clear filters
            </button>
          </div>

          <div className="mt-4 text-xs font-bold text-muted">{filtered.length} jobs • Ranked by match %</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <Card className="p-12 text-center text-sm text-muted">
            <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
            Loading live job recommendations...
          </Card>
        ) : filtered.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const isApplied = appliedMap[item.oppId]
              return (
                <Card key={item.id} hover className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex gap-3">
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="h-12 w-12 rounded-xl object-cover border border-primary/20 shadow-sm shrink-0"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.company)}&background=0D9488&color=ffffff&bold=true`
                          }}
                        />
                        <div>
                          <h3 className="font-bold leading-tight text-charcoal">{item.role}</h3>
                          <p className="text-xs text-muted mt-0.5">{item.company} • {item.location} • {item.mode}</p>
                        </div>
                      </div>
                      <Badge variant={isApplied ? 'success' : item.match >= 90 ? 'success' : 'default'} className="shrink-0 whitespace-nowrap">
                        {isApplied ? 'Applied ✓' : `${item.match}% Match`}
                      </Badge>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2 font-semibold">
                        <AppIcon name="payments" className="text-[16px] text-muted" /> {item.salary}
                      </div>
                      <div className="rounded-xl bg-background border border-border px-3 py-2 flex items-center gap-2">
                        <AppIcon name="work_history" className="text-[16px] text-muted" /> {item.exp}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-sage border border-sage px-2.5 py-0.5 text-xs font-semibold text-primary">{item.type}</span>
                      <span className="rounded-full bg-white border border-border px-2.5 py-0.5 text-xs text-charcoal">{item.mode}</span>
                      {item.skills.map((s) => (
                        <span key={s} className="rounded-full bg-white border border-border px-2.5 py-0.5 text-xs text-charcoal/70">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-border pt-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-muted">
                      <span>Posted: <strong className="text-charcoal font-semibold">{item.posted}</strong></span>
                      <span><strong className="text-primary font-bold">{item.applicants}</strong> {item.applicants === 1 ? 'applicant' : 'applicants'}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-muted">Deadline: <strong className="font-semibold text-charcoal">{item.deadline}</strong></span>
                      {isAuthenticated ? (
                        <Button
                          size="sm"
                          variant={isApplied ? 'secondary' : 'primary'}
                          disabled={isApplied}
                          onClick={() => { setSelectedJob(item); setCoverLetter('') }}
                          className="shrink-0 font-bold"
                        >
                          {isApplied ? 'Applied ✓' : 'Apply Job →'}
                        </Button>
                      ) : (
                        <Link to="/login" className="shrink-0">
                          <Button size="sm" variant="primary" className="font-bold">
                            Apply Job →
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center text-muted">
            <AppIcon name="business_center" className="text-3xl text-primary mx-auto mb-2" />
            <h4 className="text-base font-bold text-charcoal">No Jobs Found</h4>
            <p className="text-xs text-muted mt-1">No active job opportunities match your selected filters right now.</p>
          </Card>
        )}
      </section>

      {/* Job Application & Detail Modal */}
      <Modal open={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob?.role || 'Job Details'} size="lg">
        {selectedJob && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedJob.logo}
                  alt={selectedJob.company}
                  className="h-12 w-12 rounded-xl object-cover border border-primary/20 shrink-0"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedJob.company)}&background=0D9488&color=ffffff&bold=true`
                  }}
                />
                <div>
                  <h3 className="font-bold text-charcoal">{selectedJob.role}</h3>
                  <p className="text-xs text-muted">
                    {selectedJob.company} • {selectedJob.location} • {selectedJob.salary}
                  </p>
                </div>
              </div>
              <Badge variant="default">{selectedJob.mode}</Badge>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Posted & Applicants</h4>
              <p className="text-xs text-charcoal">Posted: <strong>{selectedJob.posted}</strong> | Total Applicants: <strong>{selectedJob.applicants}</strong></p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((s) => (
                  <span key={s} className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-primary border border-sage">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {!appliedMap[selectedJob.oppId] && (
              <div className="pt-2">
                <Textarea
                  label="Cover Letter (Optional)"
                  placeholder="Introduce yourself and explain why you're a great fit for this job role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
              {!appliedMap[selectedJob.oppId] ? (
                <Button onClick={() => handleApply(selectedJob)} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application →'}
                </Button>
              ) : (
                <Button variant="secondary" disabled>Already Applied ✓</Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
