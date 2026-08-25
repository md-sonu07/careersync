import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import Textarea from '../../components/ui/Textarea'
import PageHeader from '../../components/common/PageHeader'
import AppIcon from '../../components/ui/AppIcon'
import { opportunityApi } from '../../api/opportunity.api'
import { applicationApi } from '../../api/application.api'
import { toast } from 'react-hot-toast'

export default function Recommended() {
  const [matches, setMatches] = useState([])
  const [appliedMap, setAppliedMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [selectedOpp, setSelectedOpp] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isApplyMode, setIsApplyMode] = useState(false)

  const loadMatchesData = async () => {
    try {
      setLoading(true)
      const [data, myApps] = await Promise.all([
        opportunityApi.getOpportunityMatches().catch(() => []),
        applicationApi.getMyApplications().catch(() => []),
      ])

      if (data && Array.isArray(data) && data.length > 0) {
        setMatches(data)
      } else {
        // Recalculate if no matches computed yet
        const recalculated = await opportunityApi.recalculateOpportunityMatches().catch(() => [])
        if (Array.isArray(recalculated) && recalculated.length > 0) {
          setMatches(recalculated)
        }
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
    loadMatchesData()
  }, [])

  const handleApply = async (opp) => {
    if (!opp || !opp.id) return
    try {
      setSubmitting(true)
      await applicationApi.applyForOpportunity(opp.id, {
        cover_letter: coverLetter || 'I am highly interested in applying for this recommended opportunity via CareerSync.',
      })
      setAppliedMap((prev) => ({ ...prev, [opp.id]: true }))
      toast.success(`Application for "${opp.title}" submitted successfully!`)
      setSelectedOpp(null)
      setCoverLetter('')
      setIsApplyMode(false)
    } catch (err) {
      toast.error('Application failed: ' + (err.response?.data?.detail || 'Already applied or error occurred.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenApplyModal = (opp) => {
    setSelectedOpp(opp)
    setCoverLetter('')
    setIsApplyMode(true)
  }

  const handleOpenDetailsModal = (opp) => {
    setSelectedOpp(opp)
    setCoverLetter('')
    setIsApplyMode(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Recommended Opportunities for You"
        subtitle="AI-calculated weighted compatibility matching based on your live skill scores and company requirements."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadMatchesData} disabled={loading}>
              <AppIcon name="refresh" className="text-[16px]" /> Refresh Matches
            </Button>
            <Badge variant="default" icon="auto_awesome">AI Sorted</Badge>
          </div>
        }
      />

      {loading ? (
        <Card className="p-8 text-center text-sm text-muted">
          <AppIcon name="sync" className="animate-spin text-2xl text-primary mx-auto mb-2" />
          Calculating AI Opportunity Matches for your profile...
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {matches.map((m) => {
            const opp = m.opportunity || {}
            const companyName = opp.company?.company_name || 'Hiring Partner'
            const score = m.match_score || 75
            const isApplied = appliedMap[opp.id]

            return (
              <Card key={m.id || opp.id} hover className="!p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-xl font-bold text-primary shrink-0">
                      {companyName[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-charcoal">{opp.title}</h3>
                      <p className="text-xs text-muted">
                        {companyName} • {opp.location || 'India'} • {opp.opportunity_type?.toUpperCase()}
                      </p>
                      <p className="text-xs font-semibold text-charcoal mt-0.5">{opp.stipend_salary}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-bold ${
                        score >= 80 ? 'bg-green-100 text-green-700' : score >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {score}% Match
                    </span>
                    <p className="text-[11px] text-muted mt-1 font-medium">Weighted AI Match</p>
                  </div>
                </div>

                {opp.skill_requirements && opp.skill_requirements.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {opp.skill_requirements.map((req) => (
                      <span key={req.id || req.skill?.id} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-semibold text-primary border border-sage">
                        Required: {req.skill?.name || req.skill_name} (Min {req.minimum_score || 70}%)
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={isApplied ? 'secondary' : 'primary'}
                    disabled={isApplied}
                    onClick={() => handleOpenApplyModal(opp)}
                  >
                    {isApplied ? 'Applied ✓' : 'Apply Now'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenDetailsModal(opp)}>
                    View Details
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Opportunity Details & Application Modal */}
      <Modal open={!!selectedOpp} onClose={() => setSelectedOpp(null)} title={selectedOpp?.title || 'Opportunity Details'} size="lg">
        {selectedOpp && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white text-xl font-bold">
                  {(selectedOpp.company?.company_name || 'C')[0]}
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{selectedOpp.title}</h3>
                  <p className="text-xs text-muted">
                    {selectedOpp.company?.company_name || 'Hiring Partner'} • {selectedOpp.location || 'Remote'} • {selectedOpp.stipend_salary}
                  </p>
                </div>
              </div>
              <Badge variant="default">{selectedOpp.work_mode || selectedOpp.opportunity_type || 'Full Time'}</Badge>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-1">About the Role</h4>
              <p className="text-xs text-charcoal/80 leading-relaxed whitespace-pre-line">{selectedOpp.description || 'No detailed description provided.'}</p>
            </div>

            {selectedOpp.skill_requirements && selectedOpp.skill_requirements.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Required Skill Benchmarks</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOpp.skill_requirements.map((req) => (
                    <span key={req.id || req.skill?.id} className="rounded-full bg-sage px-3 py-1 text-xs font-semibold text-primary border border-sage">
                      {req.skill?.name || req.skill_name} — Minimum Score: {req.minimum_score}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(isApplyMode || !appliedMap[selectedOpp.id]) && (
              <div className="pt-2">
                <Textarea
                  label="Cover Letter (Optional)"
                  placeholder="Introduce yourself and explain why you're a great fit for this opportunity..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedOpp(null)}>Close</Button>
              {!appliedMap[selectedOpp.id] ? (
                <Button onClick={() => handleApply(selectedOpp)} disabled={submitting}>
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
