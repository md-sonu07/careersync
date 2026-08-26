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

export default function Internships() {
  const { user, isAuthenticated } = useAuth()
  const [internships, setInternships] = useState([])
  const [appliedMap, setAppliedMap] = useState({})
  const [loading, setLoading] = useState(true)

  const [q, setQ] = useState('')
  const [role, setRole] = useState('All')
  const [skill, setSkill] = useState('All')
  const [location, setLocation] = useState('All')
  const [mode, setMode] = useState('All')
  const [stipend, setStipend] = useState('All')
  const [matchFilter, setMatchFilter] = useState('All')

  const [selectedItem, setSelectedItem] = useState(null)
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
        if (matches && Array.isArray(matches) && matches.length > 0) {
          liveData = matches
            .filter((m) => !m.opportunity?.opportunity_type || m.opportunity?.opportunity_type === 'internship')
            .map((m) => {
              const opp = m.opportunity || {}
              const companyName = opp.company?.company_name || 'Hiring Partner'
              const companyLogo = getCompanyLogo(opp.company)
              return {
                id: opp.id || m.id,
                oppId: opp.id,
                role: opp.title || 'Internship',
                company: companyName,
                logo: companyLogo,
                location: opp.location || 'Remote',
                duration: opp.duration || '3 months',
                stipend: opp.stipend_salary || '₹20,000/month',
                skills: opp.skill_requirements && opp.skill_requirements.length > 0
                  ? opp.skill_requirements.map((r) => r.skill?.name || r.skill_name || 'Skill')
                  : ['Python', 'Django', 'REST'],
                match: Math.round(m.match_score || 85),
                deadline: opp.deadline || '30 Sep 2026',
                type: opp.work_mode ? opp.work_mode.charAt(0).toUpperCase() + opp.work_mode.slice(1) : 'Remote',
                applicants: typeof opp.applicants_count === 'number' ? opp.applicants_count : 1,
                publishedDate: opp.created_at ? timeSince(opp.created_at) : '1 day ago',
                raw: opp,
              }
            })
        }
      }

      if (liveData.length === 0) {
        const opps = await opportunityApi.getOpportunities({ type: 'internship' }).catch(() => [])
        if (opps && Array.isArray(opps)) {
          liveData = opps.map((opp) => {
            const companyName = opp.company?.company_name || 'Hiring Partner'
            const companyLogo = getCompanyLogo(opp.company)
            return {
              id: opp.id,
              oppId: opp.id,
              role: opp.title || 'Internship',
              company: companyName,
              logo: companyLogo,
              location: opp.location || 'Remote',
              duration: opp.duration || '3 months',
              stipend: opp.stipend_salary || '₹20,000/month',
              skills: opp.skill_requirements && opp.skill_requirements.length > 0
                ? opp.skill_requirements.map((r) => r.skill?.name || r.skill_name || 'Skill')
                : ['Python', 'Django'],
              match: 80,
              deadline: opp.deadline || '30 Sep 2026',
              type: opp.work_mode ? opp.work_mode.charAt(0).toUpperCase() + opp.work_mode.slice(1) : 'Remote',
              applicants: typeof opp.applicants_count === 'number' ? opp.applicants_count : 1,
              publishedDate: opp.created_at ? timeSince(opp.created_at) : '1 day ago',
              raw: opp,
            }
          })
        }
      }

      setInternships(liveData)

      if (myApps && Array.isArray(myApps)) {
        const map = {}
        myApps.forEach((a) => {
          if (a.opportunity?.id) map[a.opportunity.id] = true
        })
        setAppliedMap(map)
      }
    } catch {
      setInternships([])
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
        cover_letter: coverLetter || 'I am highly interested in applying for this internship via CareerSync.',
      })
      setAppliedMap((prev) => ({ ...prev, [item.oppId]: true }))
      toast.success(`Application for "${item.role}" submitted successfully!`)
      setSelectedItem(null)
      setCoverLetter('')
    } catch (err) {
      toast.error('Application failed: ' + (err.response?.data?.detail || 'Already applied or error occurred.'))
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = useMemo(() => {
    return internships.filter((it) => {
      if (q && !`${it.role} ${it.company} ${it.skills.join(' ')} ${it.location}`.toLowerCase().includes(q.toLowerCase())) return false
      if (role !== 'All' && !it.role.toLowerCase().includes(role.toLowerCase())) return false
      if (skill !== 'All' && !it.skills.some((s) => s.toLowerCase().includes(skill.toLowerCase()))) return false
      if (location !== 'All' && !it.location.toLowerCase().includes(location.toLowerCase())) return false
      if (mode !== 'All' && it.type.toLowerCase() !== mode.toLowerCase()) return false
      if (matchFilter !== 'All') {
        if (matchFilter === '90%+' && it.match < 90) return false
        if (matchFilter === '85%+' && it.match < 85) return false
        if (matchFilter === '80%+' && it.match < 80) return false
      }
      return true
    })
  }, [internships, q, role, skill, location, mode, matchFilter])

  return (
    <div className="bg-background min-h-screen">
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-charcoal">Internship Opportunities</h1>
              <p className="mt-2 text-sm text-muted max-w-2xl">
                {isAuthenticated && user?.role === 'student'
                  ? `AI-calculated weighted internship recommendations tailored for ${user?.first_name || 'your profile'}.`
                  : 'Discover live internships connected directly to CareerSync hiring partners.'}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              <AppIcon name="refresh" className="text-[16px]" /> Refresh
            </Button>
          </div>

          <div className="mt-6">
            <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search internships by role, skill, or company" />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" options={['All', 'Frontend', 'Backend', 'Data Science', 'Full Stack', 'AI/ML']} />
            <Select value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill" options={['All', 'React', 'Python', 'Django', 'SQL', 'Tailwind', 'Docker']} />
            <Select value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" options={['All', 'Remote', 'Bengaluru', 'Hyderabad', 'Mumbai', 'Delhi']} />
            <Select value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Work mode" options={['All', 'Remote', 'Hybrid', 'Onsite']} />
            <Select value={matchFilter} onChange={(e) => setMatchFilter(e.target.value)} placeholder="Match %" options={['All', '80%+', '85%+', '90%+']} />
            <button
              onClick={() => { setQ(''); setRole('All'); setSkill('All'); setLocation('All'); setMode('All'); setMatchFilter('All') }}
              className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-background transition-colors"
            >
              Clear filters
            </button>
          </div>

          <div className="mt-4 text-xs font-bold text-muted">{filtered.length} internships • Sorted by match %</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <Card className="p-12 text-center text-sm text-muted">
            <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
            Loading live internship recommendations...
          </Card>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 @xl:grid-cols-2 @2xl:grid-cols-3 gap-6 @3xl:gap-8">
            {filtered.map((item) => {
              const isApplied = !!appliedMap[item.oppId]

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                >
                  <div>
                    {/* Top Header: Company Logo & Mode Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.logo}
                          alt={item.company}
                          className="h-12 w-12 rounded-xl object-contain border border-border bg-background p-1 shadow-xs shrink-0"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.company)}&background=0D9488&color=ffffff&bold=true`
                          }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-muted uppercase tracking-wider truncate">
                            {item.company}
                          </p>
                          <p className="text-xs text-charcoal/70 flex items-center gap-1 mt-0.5">
                            <AppIcon name="location_on" className="text-[13px] text-muted shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.type}
                        </span>
                        {isAuthenticated && item.match && item.match > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {item.match}% Match
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Role Title */}
                    <h3 className="mt-4 text-base font-bold text-charcoal group-hover:text-primary transition-colors line-clamp-1">
                      {item.role}
                    </h3>

                    {/* Stipend & Duration Metrics */}
                    <div className="mt-3 grid grid-cols-2 gap-2 bg-background/60 p-3 rounded-xl border border-border/60">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Stipend</p>
                        <p className="text-xs font-bold text-primary truncate mt-0.5">{item.stipend}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Duration</p>
                        <p className="text-xs font-bold text-charcoal truncate mt-0.5">{item.duration}</p>
                      </div>
                    </div>

                    {/* Skills required */}
                    <div className="mt-3.5 flex flex-wrap gap-1.5">
                      {item.skills.map((s) => (
                        <span key={s} className="rounded-md bg-slate-50 border border-slate-200/80 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-muted">
                        Deadline: <span className="font-semibold text-charcoal">{item.deadline}</span>
                      </p>
                      <p className="text-[10px] text-muted mt-0.5">
                        {item.applicants} {item.applicants === 1 ? 'applicant' : 'applicants'}
                      </p>
                    </div>

                    {isAuthenticated ? (
                      <Button
                        size="sm"
                        variant={isApplied ? 'secondary' : 'primary'}
                        disabled={isApplied}
                        onClick={() => { setSelectedItem(item); setCoverLetter('') }}
                        className="text-xs font-bold shadow-soft"
                      >
                        {isApplied ? 'Applied ✓' : 'View & Apply →'}
                      </Button>
                    ) : (
                      <Link to="/login">
                        <Button size="sm" variant="primary" className="text-xs font-bold shadow-soft">
                          View & Apply →
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card className="p-12 text-center text-muted">
            <AppIcon name="work_outline" className="text-3xl text-primary mx-auto mb-2" />
            <h4 className="text-base font-bold text-charcoal">No Internships Found</h4>
            <p className="text-xs text-muted mt-1">No active internships match your selected filters right now.</p>
          </Card>
        )}
      </section>

      {/* Internship Application & Detail Modal */}
      <Modal open={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.role || 'Internship Details'} size="lg">
        {selectedItem && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedItem.logo}
                  alt={selectedItem.company}
                  className="h-12 w-12 rounded-xl object-cover border border-primary/20 shrink-0"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedItem.company)}&background=0D9488&color=ffffff&bold=true`
                  }}
                />
                <div>
                  <h3 className="font-bold text-charcoal">{selectedItem.role}</h3>
                  <p className="text-xs text-muted">
                    {selectedItem.company} • {selectedItem.location} • {selectedItem.stipend}
                  </p>
                </div>
              </div>
              <Badge variant="default">{selectedItem.type}</Badge>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Duration & Deadline</h4>
              <p className="text-xs text-charcoal">Duration: <strong>{selectedItem.duration}</strong> | Deadline: <strong>{selectedItem.deadline}</strong></p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedItem.skills.map((s) => (
                  <span key={s} className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-primary border border-sage">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {!appliedMap[selectedItem.oppId] && (
              <div className="pt-2">
                <Textarea
                  label="Cover Letter (Optional)"
                  placeholder="Introduce yourself and explain why you're a great fit for this internship..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedItem(null)}>Close</Button>
              {!appliedMap[selectedItem.oppId] ? (
                <Button onClick={() => handleApply(selectedItem)} disabled={submitting}>
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
