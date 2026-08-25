import { useState, useEffect, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea'
import PageHeader from '../../components/common/PageHeader'
import AppIcon from '../../components/ui/AppIcon'
import { opportunityApi } from '../../api/opportunity.api'
import { applicationApi } from '../../api/application.api'
import { toast } from 'react-hot-toast'

export default function Jobs() {
  const [query, setQuery] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [opportunities, setOpportunities] = useState([])
  const [appliedMap, setAppliedMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [opps, myApps] = await Promise.all([
        opportunityApi.getOpportunities({ type: 'job' }).catch(() => []),
        applicationApi.getMyApplications().catch(() => []),
      ])

      if (opps && Array.isArray(opps)) {
        setOpportunities(opps)
      }

      if (myApps && Array.isArray(myApps)) {
        const map = {}
        myApps.forEach((a) => {
          if (a.opportunity?.id) map[a.opportunity.id] = true
        })
        setAppliedMap(map)
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApply = async (job) => {
    try {
      setSubmitting(true)
      await applicationApi.applyForOpportunity(job.id, {
        cover_letter: coverLetter || 'I am excited to apply for this full-time role via CareerSync.',
      })
      setAppliedMap((prev) => ({ ...prev, [job.id]: true }))
      toast.success(`Application for "${job.title}" submitted successfully!`)
      setSelectedJob(null)
      setCoverLetter('')
    } catch (err) {
      toast.error('Application failed: ' + (err.response?.data?.detail || 'Already applied or network error.'))
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = useMemo(() => {
    return opportunities.filter((item) => {
      const matchSearch = query
        ? `${item.title} ${item.company?.company_name} ${item.description} ${item.location}`.toLowerCase().includes(query.toLowerCase())
        : true
      const matchMode = workMode ? (item.work_mode || '').toLowerCase() === workMode.toLowerCase() : true
      return matchSearch && matchMode
    })
  }, [query, workMode, opportunities])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Full-Time Jobs"
        subtitle="Full-time roles for early-career developers connected live to CareerSync hiring partners."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              <AppIcon name="refresh" className="text-[16px]" /> Refresh
            </Button>
            <Badge variant="default">{filtered.length} ROLES</Badge>
          </div>
        }
      />

      <Card>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search role, company, skills..." wrapperClassName="sm:col-span-2" />
          <Select placeholder="All Work Modes" value={workMode} onChange={(e) => setWorkMode(e.target.value)} options={['remote', 'hybrid', 'onsite']} />
        </div>
      </Card>

      {loading ? (
        <Card className="p-8 text-center text-sm text-muted">
          <AppIcon name="sync" className="animate-spin text-2xl text-primary mx-auto mb-2" />
          Loading full-time job opportunities...
        </Card>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => {
            const isApplied = appliedMap[item.id]
            const companyName = item.company?.company_name || 'Hiring Partner'
            return (
              <Card key={item.id} hover className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-lg font-bold text-primary shrink-0">
                    {companyName[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-charcoal">{item.title}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {companyName} • {item.location || 'India'} • {item.stipend_salary || 'Competitive LPA'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.skill_requirements && item.skill_requirements.length > 0 ? (
                        item.skill_requirements.map((req) => (
                          <span key={req.id || req.skill?.id} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">
                            {req.skill?.name || req.skill_name} (Min {req.minimum_score || 70}%)
                          </span>
                        ))
                      ) : (
                        <span className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">Full Stack</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge variant={isApplied ? 'success' : 'default'}>
                    {isApplied ? 'Applied ✓' : (item.work_mode || 'Full-time').toUpperCase()}
                  </Badge>
                  <Button
                    size="sm"
                    variant={isApplied ? 'secondary' : 'primary'}
                    disabled={isApplied}
                    onClick={() => { setSelectedJob(item); setCoverLetter('') }}
                  >
                    {isApplied ? 'Applied ✓' : 'Apply Now'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedJob(item)}>
                    Details
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-primary text-2xl font-bold">
            <AppIcon name="business_center" />
          </div>
          <h4 className="text-base font-bold text-charcoal">No Jobs Found</h4>
          <p className="text-xs text-muted max-w-md mx-auto">
            No active full-time job postings match your search filters right now. Try resetting your search query or work mode filter.
          </p>
        </Card>
      )}

      {/* Job Detail & Application Modal */}
      <Modal open={!!selectedJob} onClose={() => setSelectedJob(null)} title={selectedJob?.title || 'Job Opportunity'} size="lg">
        {selectedJob && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white text-xl font-bold">
                {(selectedJob.company?.company_name || 'C')[0]}
              </div>
              <div>
                <h3 className="font-bold text-charcoal">{selectedJob.title}</h3>
                <p className="text-xs text-muted">
                  {selectedJob.company?.company_name || 'Hiring Partner'} • {selectedJob.location || 'Remote'} • {selectedJob.stipend_salary}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Role Description</h4>
              <p className="text-xs text-charcoal/80 leading-relaxed whitespace-pre-line">{selectedJob.description || 'No description provided.'}</p>
            </div>

            {selectedJob.skill_requirements && selectedJob.skill_requirements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Required Skill Benchmarks</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skill_requirements.map((req) => (
                    <span key={req.id || req.skill?.id} className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-primary border border-sage">
                      {req.skill?.name || req.skill_name} — Minimum Score: {req.minimum_score}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!appliedMap[selectedJob.id] && (
              <div className="pt-2">
                <Textarea
                  label="Cover Letter (Optional)"
                  placeholder="Introduce yourself and share why you are a great fit for this job role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedJob(null)}>Close</Button>
              {!appliedMap[selectedJob.id] ? (
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
