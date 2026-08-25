import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { ProgressBar } from '../../components/ui/Progress'
import AppIcon from '../../components/ui/AppIcon'
import { analyticsApi } from '../../api/analytics.api'

export default function IndustryDemand() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    analyticsApi.getIndustryDemandAnalytics()
      .then((res) => {
        if (isMounted) setData(res)
      })
      .catch(() => {
        if (isMounted) setData(null)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const totalDrives = data?.total_active_drives || 0
  const internshipsCount = data?.internships_count || 0
  const jobsCount = data?.jobs_count || 0
  const topSkills = data?.top_demanded_skills || []
  const topCompanies = data?.top_hiring_companies || []
  const workMode = data?.work_mode_distribution || { remote: 0, hybrid: 0, onsite: 0 }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Corporate Industry Demand</h1>
          <p className="mt-1 text-sm text-muted">
            Aggregated skill demands and hiring criteria derived directly from active corporate job postings.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge icon="show_chart" variant="default">Live Market Intel</Badge>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Active Drives" value={totalDrives.toLocaleString()} icon="work" />
        <StatCard label="Internship Openings" value={internshipsCount.toLocaleString()} icon="school" />
        <StatCard label="Full-Time Roles" value={jobsCount.toLocaleString()} icon="workspace_premium" />
        <StatCard label="Active Hiring Partners" value={topCompanies.length.toLocaleString()} icon="business" />
      </div>

      {loading ? (
        <div className="py-24 text-center text-sm text-muted">
          Analyzing corporate hiring requirements &amp; skill benchmarks…
        </div>
      ) : totalDrives > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Column: Most Demanded Skills */}
          <div className="space-y-6 lg:col-span-8">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-charcoal">Most In-Demand Skills</h3>
                  <p className="text-xs text-muted">Ranked by frequency across published opportunities &amp; required benchmarks</p>
                </div>
                <span className="text-xs font-semibold text-primary">Live Database Aggregate</span>
              </div>

              <div className="space-y-4 pt-2">
                {topSkills.length > 0 ? (
                  topSkills.map((s, idx) => (
                    <div key={s.name || idx} className="space-y-1.5 p-3 rounded-xl border border-border bg-background/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-charcoal">{s.name}</span>
                          <span className="text-[11px] font-medium text-muted px-2 py-0.5 rounded-md bg-white border border-border">
                            {s.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-primary">
                            Min {s.avg_benchmark}% Benchmark
                          </span>
                          <Badge variant="default">
                            {s.postings_count} {s.postings_count === 1 ? 'Drive' : 'Drives'} ({s.demand_percentage}%)
                          </Badge>
                        </div>
                      </div>
                      <ProgressBar
                        value={s.demand_percentage}
                        size="sm"
                        barClassName={idx === 0 ? 'bg-emerald-500' : idx <= 2 ? 'bg-primary' : 'bg-blue-600'}
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted py-6 text-center">No skill requirements specified in active postings.</p>
                )}
              </div>
            </Card>

            {/* Work Mode & Placement Opportunity Breakdown */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="!p-4 text-center">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">Remote Positions</p>
                <p className="text-2xl font-bold text-charcoal mt-1">{workMode.remote}</p>
                <p className="text-[11px] text-muted mt-0.5">
                  {totalDrives > 0 ? Math.round((workMode.remote / totalDrives) * 100) : 0}% of all postings
                </p>
              </Card>

              <Card className="!p-4 text-center">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">Hybrid Roles</p>
                <p className="text-2xl font-bold text-primary mt-1">{workMode.hybrid}</p>
                <p className="text-[11px] text-muted mt-0.5">
                  {totalDrives > 0 ? Math.round((workMode.hybrid / totalDrives) * 100) : 0}% of all postings
                </p>
              </Card>

              <Card className="!p-4 text-center">
                <p className="text-xs font-semibold text-muted uppercase tracking-wider">On-Site Work</p>
                <p className="text-2xl font-bold text-charcoal mt-1">{workMode.onsite}</p>
                <p className="text-[11px] text-muted mt-0.5">
                  {totalDrives > 0 ? Math.round((workMode.onsite / totalDrives) * 100) : 0}% of all postings
                </p>
              </Card>
            </div>
          </div>

          {/* Right Column: Hiring Partners & Insights */}
          <div className="space-y-6 lg:col-span-4">
            {/* Real Top Hiring Partners */}
            <Card className="!p-0 overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-bold text-charcoal">Active Hiring Partners</h3>
                <p className="text-xs text-muted">Companies currently hiring talent</p>
              </div>

              <div className="divide-y divide-border">
                {topCompanies.length > 0 ? (
                  topCompanies.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-background/50 transition-colors">
                      <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-charcoal truncate">{c.name}</p>
                        <p className="text-xs text-muted truncate">{c.industry_type}</p>
                      </div>
                      <Badge variant="default" className="shrink-0">{c.active_posts} {c.active_posts === 1 ? 'drive' : 'drives'}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted py-6 text-center">No hiring partners recorded.</p>
                )}
              </div>
            </Card>

            {/* Curriculum Recommendation */}
            <Card>
              <h3 className="font-bold text-charcoal flex items-center gap-2">
                <AppIcon name="lightbulb" className="text-primary text-[20px]" />
                Institutional Action
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {topSkills.length > 0 ? (
                  <>
                    Companies are heavily prioritizing <span className="font-semibold text-charcoal">{topSkills[0]?.name}</span> and <span className="font-semibold text-charcoal">{topSkills[1]?.name || 'modern tools'}</span> with an average <span className="font-semibold text-primary">{topSkills[0]?.avg_benchmark || 70}%+</span> target score.
                  </>
                ) : (
                  "Monitor industry requirements as companies post new internship and placement openings."
                )}
              </p>
              <div className="mt-4 rounded-xl bg-primary/5 border border-primary/20 p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Recommendation</p>
                <p className="text-xs text-charcoal mt-1 leading-relaxed">
                  Focus upcoming departmental lab sessions and assessments around verified industry skill benchmarks.
                </p>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="py-20 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <AppIcon name="show_chart" className="text-3xl" />
          </div>
          <h2 className="text-lg font-bold text-charcoal">No Corporate Drives Recorded Yet</h2>
          <p className="text-xs text-muted max-w-md mx-auto mt-1 leading-relaxed">
            As industry partners publish internship openings and placement job postings, aggregated in-demand skills and hiring company metrics will automatically appear here.
          </p>
        </Card>
      )}
    </div>
  )
}
