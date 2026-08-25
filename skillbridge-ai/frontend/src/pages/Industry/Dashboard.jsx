import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { analyticsApi } from '../../api/analytics.api'

export default function IndustryDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    analyticsApi.getCompanyAnalytics()
      .then((data) => {
        if (isMounted) setAnalytics(data)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const activeOpp = analytics?.active_opportunities ?? 0
  const totalApps = analytics?.total_applications ?? 0
  const shortlisted = analytics?.shortlisted_candidates ?? 0
  const topCandidates = analytics?.top_matching_candidates || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Recruiter Analytics Dashboard 👋</h1>
          <p className="mt-1 text-sm text-muted">Recruitment + internship pipeline connected live to CareerSync Django ORM Analytics.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/industry/internship/new"><Button variant="outline" size="sm" icon="work">Post Internship</Button></Link>
          <Link to="/industry/job/new"><Button variant="primary" size="sm" icon="business_center">Post Job</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active Opportunities" value={activeOpp} icon="work" trend={8} trendLabel="published" />
        <StatCard label="Total Applications Received" value={totalApps} icon="assignment" trend={12} trendLabel="applications" />
        <StatCard label="Shortlisted Candidates" value={shortlisted} icon="verified" trend={5} trendLabel="shortlisted" />
      </div>

      <Card>
        <h3 className="font-bold text-charcoal">Top Matching Candidates</h3>
        <p className="text-xs text-muted mt-1">Candidates ranked by CareerSync AI Matching Engine</p>
        <div className="mt-4 space-y-3">
          {topCandidates.length > 0 ? (
            topCandidates.map((c) => (
              <div key={c.student_id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                <div>
                  <p className="text-sm font-bold text-charcoal">{c.student_name}</p>
                  <p className="text-xs text-muted">Role: {c.opportunity_title}</p>
                </div>
                <Badge variant="success">{c.match_score}% Weighted Match</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No candidate applications received yet.</p>
          )}
        </div>
      </Card>
    </div>
  )
}
