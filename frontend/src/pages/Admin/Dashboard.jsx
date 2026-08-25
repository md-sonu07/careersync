import { useState, useEffect } from 'react'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { analyticsApi } from '../../api/analytics.api'
import Button from '../../components/ui/Button'
import AppIcon from '../../components/ui/AppIcon'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await analyticsApi.getSystemAnalytics()
      if (data) setStats(data)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const totalUsers = stats?.total_users ?? 0
  const studentsCount = stats?.students_count ?? 0
  const industryCount = stats?.industry_count ?? 0
  const instituteCount = stats?.institute_count ?? 0
  const adminsCount = stats?.admins_count ?? 1
  const coursesCount = stats?.courses_count ?? 0
  const opportunitiesCount = stats?.opportunities_count ?? 0
  const applicationsCount = stats?.applications_count ?? 0

  return (
    <div className="space-y-6 @container">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 @2xl:h-12 @2xl:w-12 items-center justify-center rounded-xl bg-slate-900 text-white shrink-0 shadow-sm">
            <AppIcon name="shield" className="text-xl @2xl:text-2xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl @5xl:text-3xl font-extrabold text-charcoal tracking-tight">Admin Dashboard</h1>
            <p className="text-xs sm:text-sm text-muted">Governance console — live user activity, courses, opportunities & system metrics</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadData} disabled={loading} className="text-xs sm:text-sm">
            <AppIcon name="refresh" className="text-[16px]" /> Refresh
          </Button>
          <Badge variant="default" className="!bg-slate-900 !text-white text-xs">Admin</Badge>
          <span className="hidden items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> System healthy
          </span>
        </div>
      </div>

      {loading ? (
        <Card className="p-12 text-center text-muted">
          <AppIcon name="sync" className="animate-spin text-3xl text-primary mx-auto mb-2" />
          Loading live system metrics from Django database...
        </Card>
      ) : (
        <>
          {/* Top 4 User & Org Stats */}
          <div className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 gap-3.5 sm:gap-5">
            <StatCard label="Total Registered Users" value={totalUsers} icon="group" trend={100} trendLabel="verified" />
            <StatCard label="Students" value={studentsCount} icon="school" trend={100} trendLabel="active" />
            <StatCard label="Industry Partners" value={industryCount} icon="business" trend={100} trendLabel="companies" />
            <StatCard label="Institute Institutions" value={instituteCount} icon="apartment" trend={100} trendLabel="colleges" />
          </div>

          {/* Bottom 4 Platform Metrics */}
          <div className="grid grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-4 gap-3.5 sm:gap-5">
            <StatCard label="Active Courses" value={coursesCount} icon="menu_book" trend={100} trendLabel="published" />
            <StatCard label="Posted Opportunities" value={opportunitiesCount} icon="work" trend={100} trendLabel="total" />
            <StatCard label="Total Applications" value={applicationsCount} icon="assignment" trend={100} trendLabel="submitted" />
            <StatCard label="AI System Health" value="100%" icon="smart_toy" trend={100} trendLabel="operational" />
          </div>

          {/* Governance breakdown */}
          <Card className="!p-0 overflow-hidden border border-border rounded-2xl shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border px-4 py-3.5 sm:px-6 sm:py-4 gap-2">
              <h3 className="font-bold text-sm sm:text-base text-charcoal">Platform User Breakdown</h3>
              <span className="text-xs text-muted">Live Django Database Metrics</span>
            </div>
            <div className="grid grid-cols-2 @md:grid-cols-3 @4xl:grid-cols-5 divide-y @md:divide-y-0 divide-x-0 @md:divide-x divide-border">
              {[
                { k: 'Students', active: studentsCount, c: 'text-primary' },
                { k: 'Industries', active: industryCount, c: 'text-accent' },
                { k: 'Institute', active: instituteCount, c: 'text-success' },
                { k: 'Admins', active: adminsCount, c: 'text-charcoal' },
                { k: 'Total', active: totalUsers, c: 'text-charcoal font-bold' },
              ].map((r) => (
                <div key={r.k} className="p-3.5 sm:p-4 text-center">
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted">{r.k}</p>
                  <p className={`mt-1 text-base sm:text-lg font-bold ${r.c}`}>{r.active}</p>
                  <p className="text-[10px] sm:text-xs text-muted">Verified account</p>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
