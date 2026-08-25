import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Modal from '../ui/Modal'
import Textarea from '../ui/Textarea'
import AppIcon from '../ui/AppIcon'
import { opportunityApi } from '../../api/opportunity.api'
import { applicationApi } from '../../api/application.api'
import { useAuth } from '../../hooks/useAuth'
import { getCompanyLogo } from '../../utils/helpers'
import { toast } from 'react-hot-toast'

const Jobs = () => {
  const { user, isAuthenticated } = useAuth()
  const [opportunities, setOpportunities] = useState([])
  const [appliedMap, setAppliedMap] = useState({})
  const [loading, setLoading] = useState(true)

  const [selectedOpp, setSelectedOpp] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchFeaturedOpportunities = async () => {
      try {
        setLoading(true)
        let myApps = []

        // If student is logged in, fetch personalized AI opportunity matches and my applications
        if (isAuthenticated && user?.role === 'student') {
          const [matches, apps] = await Promise.all([
            opportunityApi.getOpportunityMatches().catch(() => []),
            applicationApi.getMyApplications().catch(() => []),
          ])

          myApps = apps || []
          if (isMounted && Array.isArray(matches) && matches.length > 0) {
            const formattedMatches = matches.slice(0, 6).map((m) => {
              const opp = m.opportunity || {}
              const companyName = opp.company?.company_name || 'Hiring Partner'
              const companyLogo = getCompanyLogo(opp.company)
              const score = Math.round(m.match_score || 75)
              return {
                id: opp.id || m.id,
                oppId: opp.id,
                logo: companyLogo,
                logoBg: score >= 80 ? 'bg-primary/10' : 'bg-amber-100',
                logoColor: score >= 80 ? 'text-primary' : 'text-amber-700',
                match: `${score}% Match`,
                title: opp.title || 'Opportunity',
                company: companyName,
                location: opp.location || 'Remote',
                type: opp.opportunity_type ? opp.opportunity_type.toUpperCase() : 'INTERNSHIP',
                mode: opp.work_mode ? opp.work_mode.charAt(0).toUpperCase() + opp.work_mode.slice(1) : 'Hybrid',
                stipend: opp.stipend_salary || '₹20,000/month',
                duration: opp.duration || '3 months',
                deadline: opp.deadline || '30 Sep 2026',
                skills: opp.skill_requirements && opp.skill_requirements.length > 0
                  ? opp.skill_requirements.map((r) => r.skill?.name || r.skill_name || 'Skill')
                  : ['Python', 'Django', 'REST'],
                raw: opp,
              }
            })
            setOpportunities(formattedMatches)
          }
        }

        if (myApps && Array.isArray(myApps)) {
          const map = {}
          myApps.forEach((a) => {
            if (a.opportunity?.id) map[a.opportunity.id] = true
          })
          if (isMounted) setAppliedMap(map)
        }

        // Guest mode fallback
        if (!isAuthenticated || user?.role !== 'student') {
          const liveOpps = await opportunityApi.getOpportunities().catch(() => [])
          if (isMounted && Array.isArray(liveOpps) && liveOpps.length > 0) {
            const formattedOpps = liveOpps.slice(0, 6).map((opp) => {
              const companyName = opp.company?.company_name || 'Hiring Partner'
              const companyLogo = getCompanyLogo(opp.company)
              return {
                id: opp.id,
                oppId: opp.id,
                logo: companyLogo,
                logoBg: 'bg-primary/10',
                logoColor: 'text-primary',
                match: 'Featured',
                title: opp.title || 'Opportunity',
                company: companyName,
                location: opp.location || 'Remote',
                type: opp.opportunity_type ? opp.opportunity_type.toUpperCase() : 'FULL-TIME',
                mode: opp.work_mode ? opp.work_mode.charAt(0).toUpperCase() + opp.work_mode.slice(1) : 'Hybrid',
                stipend: opp.stipend_salary || '₹20,000/month',
                duration: opp.duration || '3 months',
                deadline: opp.deadline || '30 Sep 2026',
                skills: opp.skill_requirements && opp.skill_requirements.length > 0
                  ? opp.skill_requirements.map((r) => r.skill?.name || r.skill_name || 'Skill')
                  : ['Python', 'Django'],
                raw: opp,
              }
            })
            setOpportunities(formattedOpps)
          }
        }
      } catch {
        if (isMounted) setOpportunities([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchFeaturedOpportunities()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, user])

  const handleApplySubmit = async () => {
    if (!selectedOpp) return
    try {
      setSubmitting(true)
      await applicationApi.applyForOpportunity(selectedOpp.oppId, { cover_letter: coverLetter })
      toast.success(`Application submitted for ${selectedOpp.title}!`)
      setAppliedMap((prev) => ({ ...prev, [selectedOpp.oppId]: true }))
      setSelectedOpp(null)
      setCoverLetter('')
    } catch (err) {
      toast.error('Failed to submit application: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-16 bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <AppIcon name="stars" className="text-[16px]" /> Live Recommendations
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
              Featured Opportunities
            </h2>
            <p className="mt-2 text-muted max-w-xl text-sm">
              Discover verified internships & job roles matched directly with your skill profile.
            </p>
          </div>
          <Link
            to={isAuthenticated && user?.role === 'student' ? '/student/recommended' : '/jobs'}
            className="hidden @3xl:inline-flex"
          >
            <Button variant="outline" className="font-bold flex items-center gap-1">
              View All Opportunities <AppIcon name="arrow_forward" className="text-[18px]" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted bg-white rounded-2xl border border-border">
            <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
            Loading live opportunities for you...
          </div>
        ) : opportunities.length > 0 ? (
          <div className="grid @3xl:grid-cols-2 @5xl:grid-cols-3 gap-6">
            {opportunities.map((j) => {
              const isApplied = appliedMap[j.oppId]
              return (
                <div
                  key={j.id}
                  onClick={() => { setSelectedOpp(j); setCoverLetter('') }}
                  className="cursor-pointer text-left h-full"
                >
                  <Card hover className="flex flex-col gap-4 h-full !p-6 justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <img
                          src={j.logo}
                          alt={j.company}
                          className="w-12 h-12 rounded-xl object-cover border border-primary/20 shadow-sm shrink-0"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(j.company)}&background=0D9488&color=ffffff&bold=true`
                          }}
                        />
                        <Badge variant={isApplied ? 'success' : 'success'} icon="bolt" className="whitespace-nowrap shrink-0">
                          {isApplied ? 'Applied ✓' : j.match}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <h3 className="text-lg font-bold text-charcoal leading-snug">{j.title}</h3>
                        <p className="text-sm font-semibold text-charcoal/60 mt-0.5">{j.company}</p>
                        {j.stipend && <p className="text-xs font-bold text-primary mt-1">{j.stipend}</p>}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4 border-t border-border-light">
                      <span className="text-xs font-medium text-charcoal/70 flex items-center gap-1">
                        <AppIcon name="location_on" className="text-[16px]" /> {j.location}
                      </span>
                      <span className="text-xs font-medium text-charcoal/70 flex items-center gap-1">
                        <AppIcon name="work" className="text-[16px]" /> {j.type}
                      </span>
                    </div>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-sm text-muted bg-white rounded-2xl border border-border">
            No live opportunities available right now. Check back soon!
          </div>
        )}

        <div className="mt-8 text-center @3xl:hidden">
          <Link to={isAuthenticated && user?.role === 'student' ? '/student/recommended' : '/jobs'}>
            <Button variant="secondary" className="w-full">
              View All Opportunities
            </Button>
          </Link>
        </div>
      </div>

      {/* Opportunity Detail & Application Modal */}
      <Modal open={!!selectedOpp} onClose={() => setSelectedOpp(null)} title={selectedOpp?.title || 'Opportunity Details'} size="lg">
        {selectedOpp && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedOpp.logo}
                  alt={selectedOpp.company}
                  className="h-12 w-12 rounded-xl object-cover border border-primary/20 shrink-0"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedOpp.company)}&background=0D9488&color=ffffff&bold=true`
                  }}
                />
                <div>
                  <h3 className="font-bold text-charcoal">{selectedOpp.title}</h3>
                  <p className="text-xs text-muted">
                    {selectedOpp.company} • {selectedOpp.location} • {selectedOpp.stipend}
                  </p>
                </div>
              </div>
              <Badge variant="default">{selectedOpp.mode}</Badge>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1 font-semibold">Duration & Deadline</h4>
              <p className="text-xs text-charcoal">Duration: <strong>{selectedOpp.duration}</strong> | Deadline: <strong>{selectedOpp.deadline}</strong></p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 font-semibold">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedOpp.skills.map((s) => (
                  <span key={s} className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-primary border border-sage">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {isAuthenticated && user?.role === 'student' ? (
              !appliedMap[selectedOpp.oppId] ? (
                <div className="pt-2">
                  <Textarea
                    label="Cover Letter (Optional)"
                    placeholder="Introduce yourself and explain why you're a great fit for this opportunity..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={3}
                  />
                </div>
              ) : null
            ) : null}

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedOpp(null)}>Close</Button>
              {isAuthenticated && user?.role === 'student' ? (
                !appliedMap[selectedOpp.oppId] ? (
                  <Button onClick={() => handleApply(selectedOpp)} disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application →'}
                  </Button>
                ) : (
                  <Button variant="secondary" disabled>Already Applied ✓</Button>
                )
              ) : (
                <Link to="/login">
                  <Button variant="primary">Log In to Apply →</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

export default Jobs
