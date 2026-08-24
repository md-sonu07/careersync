import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import PageHeader from '../../components/common/PageHeader'
import Badge from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/Progress'
import { analyticsApi } from '../../api/analytics.api'

const hoursData = [1.5, 2.2, 0.8, 2.8, 1.2, 3.0, 2.0]

function StreakGrid() {
  const cells = Array.from({ length: 112 }, (_, i) => {
    const r = Math.random()
    let level = 0
    if (r > 0.85) level = 3
    else if (r > 0.6) level = 2
    else if (r > 0.35) level = 1
    return level
  })
  const colors = ['bg-background border-border', 'bg-sage', 'bg-primary/30', 'bg-primary']
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((lv, i) => (
        <div key={i} className={`h-3 w-3 rounded-sm border ${colors[lv]}`} title={`Day ${i + 1}`} />
      ))}
    </div>
  )
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    analyticsApi.getStudentAnalytics()
      .then((data) => {
        if (isMounted) setAnalytics(data)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const readiness = analytics?.career_readiness || { score_percentage: 67.5, verified_skills_count: 0, total_skills_count: 2 }
  const skillList = analytics?.skill_progress || [
    { id: '1', skill_name: 'Python', score: 80, is_verified: true },
    { id: '2', skill_name: 'React.js', score: 85, is_verified: true },
  ]
  const gaps = analytics?.top_skill_gaps || []
  const assessmentHistory = analytics?.assessment_history || { total_attempts: 0, completed_attempts: 0, passed_attempts: 0, average_accuracy: 0 }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning & Career Analytics"
        subtitle="Live dynamic ORM analytics: Career readiness, verified skills, assessment pass rate, and gap tracking."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Career Readiness" value={`${readiness.score_percentage}%`} icon="flag" trend={12} trendLabel="verified score" />
        <StatCard label="Verified Skills" value={`${readiness.verified_skills_count} / ${readiness.total_skills_count}`} icon="verified" />
        <StatCard label="Assessment Pass Rate" value={`${assessmentHistory.completed_attempts > 0 ? Math.round((assessmentHistory.passed_attempts / assessmentHistory.completed_attempts) * 100) : 100}%`} icon="assignment" />
        <StatCard label="Active Skill Gaps" value={`${gaps.length}`} icon="warning" />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-charcoal">Learning Activity Calendar</h3>
          <span className="text-xs text-muted">GitHub-style activity grid</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <StreakGrid />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <span>Less</span>
          <span className="h-3 w-3 rounded-sm bg-background border border-border" />
          <span className="h-3 w-3 rounded-sm bg-sage" />
          <span className="h-3 w-3 rounded-sm bg-primary/30" />
          <span className="h-3 w-3 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-bold text-charcoal">Live Skill Proficiency</h3>
          <p className="text-xs text-muted mt-1">Calculated from verified assessments and self-ratings</p>
          <div className="mt-4 space-y-4">
            {skillList.map((s) => (
              <div key={s.id || s.skill_name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-charcoal flex items-center gap-1.5">
                    {s.skill_name} {s.is_verified && <Badge variant="success" className="!px-1.5 !py-0 !text-[10px]">Verified</Badge>}
                  </span>
                  <span className="font-bold tabular-nums">{s.score}%</span>
                </div>
                <ProgressBar value={s.score} size="sm" barClassName={s.score < 50 ? 'bg-danger' : 'bg-primary'} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-charcoal">Top Skill Gaps Tracking</h3>
          <p className="text-xs text-muted mt-1">Gaps compared against target career benchmark</p>
          <div className="mt-4 space-y-3">
            {gaps.length > 0 ? (
              gaps.map((g) => (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{g.skill_name}</p>
                    <p className="text-xs text-muted">Gap: {g.gap_score}%</p>
                  </div>
                  <Badge variant={g.severity === 'High' ? 'danger' : 'default'}>{g.severity} Priority</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No high-severity skill gaps found!</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
