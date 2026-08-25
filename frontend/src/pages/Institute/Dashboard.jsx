import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { ProgressBar } from '../../components/ui/Progress'
import { analyticsApi } from '../../api/analytics.api'

export default function InstituteDashboard() {
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
  const topGaps = analytics?.top_skill_gaps || []
  const readiness = analytics?.student_readiness || { job_ready_count: 0, improving_count: 0, needs_focus_count: 0 }
  const placement = analytics?.placement_statistics || { total_applications: 0, shortlisted_applications: 0, selected_applications: 0 }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Institute Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Institutional intelligence connected to live Django ORM aggregate analytics (Privacy Protected).</p>
        </div>
        <Badge icon="apartment" variant="default">CareerSync Academician Portal</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon="group" trend={4} trendLabel="enrolled" />
        <StatCard label="Job Ready (>75%)" value={readiness.job_ready_count} icon="school" trend={6} trendLabel="ready" />
        <StatCard label="Avg Skill Score" value={`${avgScore}%`} icon="military_tech" trend={2} trendLabel="verified" />
        <StatCard label="Total Applications" value={placement.total_applications} icon="work" trend={9} trendLabel="submitted" />
        <StatCard label="Shortlisted" value={placement.shortlisted_applications} icon="verified" trend={5} trendLabel="shortlisted" />
        <StatCard label="Selections" value={placement.selected_applications} icon="workspace_premium" trend={8} trendLabel="hired" className="col-span-2 xl:col-span-1" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard title="Student Readiness Distribution" subtitle="Distribution by skill proficiency" className="lg:col-span-5" height={240}>
          <div className="flex h-full items-end gap-3">
            {[
              { k: 'Job Ready', v: readiness.job_ready_count, c: 'bg-success' },
              { k: 'Improving', v: readiness.improving_count, c: 'bg-primary' },
              { k: 'Needs Focus', v: readiness.needs_focus_count, c: 'bg-amber-600' },
            ].map((b) => (
              <div key={b.k} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-charcoal">{b.v}</span>
                <div className={`w-full rounded-t-xl ${b.c}`} style={{ height: `${Math.min(180, (b.v / Math.max(1, totalStudents)) * 250)}px` }} />
                <span className="text-[11px] font-medium text-muted">{b.k}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <Card className="lg:col-span-7">
          <h3 className="font-bold text-charcoal">Aggregated Top Institutional Skill Gaps</h3>
          <p className="text-xs text-muted mt-1">Skills with highest student gap count</p>
          <div className="mt-4 space-y-3">
            {topGaps.length > 0 ? (
              topGaps.map((g) => (
                <div key={g.skill_name} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                  <span className="text-sm font-bold text-charcoal">{g.skill_name}</span>
                  <Badge variant="danger">{g.total_students_with_gap} Students Need Improvement</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No institutional skill gaps recorded.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
