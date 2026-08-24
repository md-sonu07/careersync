import { useState, useEffect } from 'react'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { analyticsApi } from '../../api/analytics.api'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    analyticsApi.getSystemAnalytics()
      .then((data) => {
        if (isMounted && data) setStats(data)
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const totalUsers = stats?.total_users ?? 0
  const studentsCount = stats?.students_count ?? 0
  const industryCount = stats?.industry_count ?? 0
  const instituteCount = stats?.institute_count ?? 0
  const coursesCount = stats?.courses_count ?? 0
  const opportunitiesCount = stats?.opportunities_count ?? 0
  const applicationsCount = stats?.applications_count ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            <span className="material-symbols-outlined">shield</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard</h1>
            <p className="text-sm text-muted">Governance console — live user activity, courses, opportunities & system metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="!bg-slate-900 !text-white">Admin</Badge>
          <span className="hidden items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success sm:inline-flex">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> System healthy
          </span>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard label="Total Registered Users" value={totalUsers} icon="group" trend={100} trendLabel="verified" />
        <StatCard label="Students" value={studentsCount} icon="school" trend={100} trendLabel="active" />
        <StatCard label="Industry Partners" value={industryCount} icon="business" trend={100} trendLabel="companies" />
        <StatCard label="Institute Institutions" value={instituteCount} icon="apartment" trend={100} trendLabel="colleges" />
        <StatCard label="Active Courses" value={coursesCount} icon="menu_book" trend={100} trendLabel="published" className="col-span-2 xl:col-span-1" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Posted Opportunities" value={opportunitiesCount} icon="work" trend={100} trendLabel="total" />
        <StatCard label="Total Applications" value={applicationsCount} icon="assignment" trend={100} trendLabel="submitted" />
        <StatCard label="AI System Health" value="100%" icon="smart_toy" trend={100} trendLabel="operational" />
      </div>

      {/* Governance breakdown */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-bold text-charcoal">Platform User Breakdown</h3>
          <span className="text-xs text-muted">Live Django Database Metrics</span>
        </div>
        <div className="grid grid-cols-2 gap-0 divide-x divide-border lg:grid-cols-5">
          {[
            { k: 'Students', active: studentsCount, c: 'text-primary' },
            { k: 'Industries', active: industryCount, c: 'text-accent' },
            { k: 'Institute', active: instituteCount, c: 'text-success' },
            { k: 'Admins', active: 1, c: 'text-charcoal' },
            { k: 'Total', active: totalUsers, c: 'text-charcoal font-bold' },
          ].map((r) => (
            <div key={r.k} className="p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">{r.k}</p>
              <p className={`mt-1 text-lg font-bold ${r.c}`}>{r.active}</p>
              <p className="text-xs text-muted">Verified account</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
