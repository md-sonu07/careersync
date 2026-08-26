import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import StatCard from '../../components/common/StatCard'
import AppIcon from '../../components/ui/AppIcon'
import { analyticsApi } from '../../api/analytics.api'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all') // 'all', 'selected', 'shortlisted', 'applied', 'rejected'
  const [search, setSearch] = useState('')

  useEffect(() => {
    let isMounted = true
    analyticsApi.getAcademicianAnalytics()
      .then((data) => {
        if (isMounted) setAnalytics(data)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const totalStudents = analytics?.total_students ?? 0
  const avgScore = analytics?.average_student_skill_score ?? 0
  const readiness = analytics?.student_readiness || { job_ready_count: 0, improving_count: 0, needs_focus_count: 0 }
  const placement = analytics?.placement_statistics || {
    total_applications: 0,
    shortlisted_applications: 0,
    selected_applications: 0,
    rejected_applications: 0,
    under_review_applications: 0
  }
  const applicationsList = analytics?.student_applications || []

  const filteredApplications = applicationsList.filter((app) => {
    // Status Filter
    if (statusFilter === 'selected' && app.status !== 'selected') return false
    if (statusFilter === 'shortlisted' && !['shortlisted', 'interview'].includes(app.status)) return false
    if (statusFilter === 'applied' && !['applied', 'under_review'].includes(app.status)) return false
    if (statusFilter === 'rejected' && app.status !== 'rejected') return false

    // Search Filter
    if (search.trim()) {
      const q = search.toLowerCase()
      const nameMatch = app.student_name?.toLowerCase().includes(q)
      const emailMatch = app.student_email?.toLowerCase().includes(q)
      const titleMatch = app.opportunity_title?.toLowerCase().includes(q)
      const compMatch = app.company_name?.toLowerCase().includes(q)
      if (!nameMatch && !emailMatch && !titleMatch && !compMatch) return false
    }
    return true
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'selected':
        return <Badge variant="success"><AppIcon name="check_circle" className="text-[12px] mr-1" /> Selected / Offer</Badge>
      case 'shortlisted':
      case 'interview':
        return <Badge variant="primary"><AppIcon name="star" className="text-[12px] mr-1" /> Shortlisted / Interview</Badge>
      case 'rejected':
        return <Badge variant="danger"><AppIcon name="close" className="text-[12px] mr-1" /> Rejected</Badge>

      case 'applied':
      case 'under_review':
      default:
        return <Badge variant="default"><AppIcon name="hourglass_top" className="text-[12px] mr-1" /> Applied / Review</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Institutional Analytics &amp; Student Placement Records</h1>
          <p className="mt-1 text-sm text-muted">Comprehensive aggregated performance metrics and live student application records.</p>
        </div>
        <Badge icon="analytics" variant="default">Verified Aggregates</Badge>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Cohort" value={totalStudents.toLocaleString()} icon="group" />
        <StatCard label="Avg Competency" value={`${avgScore}%`} icon="military_tech" />
        <StatCard label="Applications Submitted" value={placement.total_applications.toLocaleString()} icon="work" />
        <StatCard label="Selected (Offers)" value={placement.selected_applications.toLocaleString()} icon="workspace_premium" />
        <StatCard label="Rejected" value={(placement.rejected_applications || 0).toLocaleString()} icon="close" />
      </div>

      {/* Breakdown Overview Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-charcoal">Readiness Breakdown</h3>
              <p className="text-xs text-muted">Proficiency distribution across enrolled students</p>
            </div>
            <AppIcon name="pie_chart" className="text-primary text-[20px]" />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-charcoal">Job Ready (&gt;75% Score)</span>
                <span className="text-emerald-600 font-bold">{readiness.job_ready_count} Students ({totalStudents > 0 ? Math.round((readiness.job_ready_count / totalStudents) * 100) : 0}%)</span>
              </div>
              <div className="h-3 rounded-full bg-background border border-border overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${totalStudents > 0 ? (readiness.job_ready_count / totalStudents) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-charcoal">Developing &amp; Improving (50-75%)</span>
                <span className="text-primary font-bold">{readiness.improving_count} Students ({totalStudents > 0 ? Math.round((readiness.improving_count / totalStudents) * 100) : 0}%)</span>
              </div>
              <div className="h-3 rounded-full bg-background border border-border overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${totalStudents > 0 ? (readiness.improving_count / totalStudents) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-charcoal">Needs Curriculum Focus (&lt;50%)</span>
                <span className="text-amber-600 font-bold">{readiness.needs_focus_count} Students ({totalStudents > 0 ? Math.round((readiness.needs_focus_count / totalStudents) * 100) : 0}%)</span>
              </div>
              <div className="h-3 rounded-full bg-background border border-border overflow-hidden">
                <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${totalStudents > 0 ? (readiness.needs_focus_count / totalStudents) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-charcoal">Placement Pipeline Efficiency</h3>
              <p className="text-xs text-muted">Conversion funnel from applications to verified hiring</p>
            </div>
            <AppIcon name="trending_up" className="text-primary text-[20px]" />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
              <span className="text-sm font-medium text-charcoal">Total Applications</span>
              <span className="text-sm font-bold text-charcoal">{placement.total_applications}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
              <span className="text-sm font-medium text-charcoal">Shortlisted &amp; Interviews</span>
              <span className="text-sm font-bold text-primary">{placement.shortlisted_applications}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-200 bg-emerald-50/60">
              <span className="text-sm font-bold text-emerald-800">Final Selections / Offers</span>
              <span className="text-sm font-bold text-emerald-700">{placement.selected_applications}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50/50">
              <span className="text-sm font-semibold text-rose-700">Not Selected / Rejected</span>
              <span className="text-sm font-bold text-rose-600">{placement.rejected_applications || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* STUDENT JOB APPLICATIONS & SELECTION RECORDS TABLE SECTION */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-charcoal">Student Applications &amp; Placement Directory</h2>
            <p className="text-xs text-muted">Live record of students from your institute who applied for corporate drives.</p>
          </div>
          <Badge variant="default">{filteredApplications.length} Records Found</Badge>
        </div>

        {/* Filter Controls & Search */}
        <Card className="!p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search student name, email, company, or job role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-background rounded-xl p-1 border border-border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'all' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'}`}
              >
                All ({applicationsList.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('selected')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'selected' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:bg-white/50'}`}
              >
                Selected ({placement.selected_applications})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('shortlisted')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'shortlisted' ? 'bg-primary text-white shadow-sm' : 'text-primary hover:bg-white/50'}`}
              >
                Shortlisted ({placement.shortlisted_applications})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('applied')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'applied' ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-charcoal'}`}
              >
                Applied ({placement.under_review_applications || 0})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg transition-all ${statusFilter === 'rejected' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 hover:bg-white/50'}`}
              >
                Rejected ({placement.rejected_applications || 0})
              </button>
            </div>
          </div>
        </Card>

        {/* Applications Table Card */}
        <Card className="!p-0 overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-sm text-muted">Loading student application records…</div>
          ) : filteredApplications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-background/80">
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Student Profile</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Applied Opportunity</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Company</th>
                    <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Applied Date</th>
                    <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-muted">Selection Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-background/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                            {app.student_name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-charcoal leading-tight">{app.student_name}</p>
                            <p className="text-xs text-muted">{app.student_email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-charcoal leading-tight">{app.opportunity_title}</p>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
                          {app.opportunity_type}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <AppIcon name="business" className="text-muted text-[16px]" />
                          <span className="text-sm font-medium text-charcoal">{app.company_name}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs font-medium text-muted">
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                <AppIcon name="assignment" className="text-2xl" />
              </div>
              <h3 className="text-base font-bold text-charcoal">No Application Records Found</h3>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                {search ? 'Try adjusting your search query or filter options.' : 'No students matching this filter status have applied for opportunities yet.'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
