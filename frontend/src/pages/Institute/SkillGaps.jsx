import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import AppIcon from '../../components/ui/AppIcon'
import { analyticsApi } from '../../api/analytics.api'

export default function SkillGaps() {
  const [topGaps, setTopGaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    analyticsApi.getAcademicianAnalytics()
      .then((data) => {
        if (isMounted) {
          setTopGaps(data?.top_skill_gaps || [])
        }
      })
      .catch(() => {
        if (isMounted) setTopGaps([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Institutional Skill Gaps</h1>
          <p className="text-sm text-muted mt-1">Aggregated analysis of skills where enrolled students need curriculum focus.</p>
        </div>
        <Badge variant="default">{topGaps.length} Identified Gaps</Badge>
      </div>

      <Card>
        <h3 className="font-bold text-charcoal">Identified Critical Gaps</h3>
        <p className="text-xs text-muted mt-1">Skills ranked by highest count of students below target benchmark</p>

        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted">Analyzing student skill assessments…</div>
          ) : topGaps.length > 0 ? (
            topGaps.map((g) => (
              <div key={g.skill_name} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background hover:bg-background/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger/10 text-danger border border-danger/20 font-bold text-sm">
                    <AppIcon name="priority_high" className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal">{g.skill_name}</p>
                    <p className="text-xs text-muted">Skill improvement needed</p>
                  </div>
                </div>
                <Badge variant="danger">{g.total_students_with_gap} Students with Gap</Badge>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
                <AppIcon name="check_circle" className="text-2xl" />
              </div>
              <p className="text-sm font-semibold text-charcoal">No Institutional Skill Gaps</p>
              <p className="text-xs text-muted max-w-sm mx-auto mt-1">
                Enrolled students have not recorded any critical skill discrepancies against industry benchmarks.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
