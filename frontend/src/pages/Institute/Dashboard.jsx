import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { analyticsApi } from '../../api/analytics.api'
import AppIcon from '../../components/ui/AppIcon'

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
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Institute Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Real-time student proficiency, skill gap analysis, and placement intelligence.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge icon="verified" variant="success">Active Session</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon="group" />
        <StatCard label="Avg Skill Score" value={`${avgScore}%`} icon="military_tech" />
        <StatCard label="Job Ready (>75%)" value={readiness.job_ready_count.toLocaleString()} icon="school" />
        <StatCard label="Selections / Placed" value={placement.selected_applications.toLocaleString()} icon="workspace_premium" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard title="Student Readiness Distribution" subtitle="Distribution across proficiency bands" className="lg:col-span-5" height={240}>
          <div className="flex h-full items-end gap-3 pt-4">
            {[
              { k: 'Job Ready', v: readiness.job_ready_count, c: 'bg-emerald-500' },
              { k: 'Improving', v: readiness.improving_count, c: 'bg-primary' },
              { k: 'Needs Focus', v: readiness.needs_focus_count, c: 'bg-amber-500' },
            ].map((b) => (
              <div key={b.k} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-charcoal">{b.v}</span>
                <div className={`w-full rounded-t-xl ${b.c} transition-all duration-500`} style={{ height: `${totalStudents > 0 ? Math.max(12, (b.v / totalStudents) * 160) : 12}px` }} />
                <span className="text-[11px] font-medium text-muted">{b.k}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <Card className="lg:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-charcoal">Top Institutional Skill Gaps</h3>
              <p className="text-xs text-muted mt-0.5">Skills requiring focused training &amp; improvement</p>
            </div>
            <span className="text-xs font-semibold text-primary">Live Aggregate</span>
          </div>
          <div className="mt-4 space-y-3">
            {topGaps.length > 0 ? (
              topGaps.map((g) => (
                <div key={g.skill_name} className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background hover:bg-background/80 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-danger/10 text-danger flex items-center justify-center font-bold text-xs">
                      <AppIcon name="priority_high" className="text-[18px]" />
                    </div>
                    <span className="text-sm font-bold text-charcoal">{g.skill_name}</span>
                  </div>
                  <Badge variant="danger">{g.total_students_with_gap} Students with Gap</Badge>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
                  <AppIcon name="check_circle" className="text-2xl" />
                </div>
                <p className="text-sm font-semibold text-charcoal">No critical institutional skill gaps</p>
                <p className="text-xs text-muted mt-1">Student assessment data is currently up-to-date.</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
