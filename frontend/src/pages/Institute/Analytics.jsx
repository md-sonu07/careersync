import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import AppIcon from '../../components/ui/AppIcon'
import { analyticsApi } from '../../api/analytics.api'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

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
  const placement = analytics?.placement_statistics || { total_applications: 0, shortlisted_applications: 0, selected_applications: 0 }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Institutional Analytics</h1>
          <p className="mt-1 text-sm text-muted">Comprehensive aggregated performance metrics and career readiness breakdown.</p>
        </div>
        <Badge icon="analytics" variant="default">Verified Aggregates</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Cohort" value={totalStudents.toLocaleString()} icon="group" />
        <StatCard label="Avg Competency" value={`${avgScore}%`} icon="military_tech" />
        <StatCard label="Applications Submitted" value={placement.total_applications.toLocaleString()} icon="work" />
        <StatCard label="Placement Offers" value={placement.selected_applications.toLocaleString()} icon="workspace_premium" />
      </div>

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
              <span className="text-sm font-medium text-charcoal">Total Applied</span>
              <span className="text-sm font-bold text-charcoal">{placement.total_applications}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
              <span className="text-sm font-medium text-charcoal">Shortlisted &amp; Interviews</span>
              <span className="text-sm font-bold text-primary">{placement.shortlisted_applications}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-emerald-50/50">
              <span className="text-sm font-bold text-emerald-800">Final Selections / Offers</span>
              <span className="text-sm font-bold text-emerald-700">{placement.selected_applications}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
