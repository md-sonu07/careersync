import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"><span className="material-symbols-outlined">shield</span></div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal">Admin Dashboard</h1>
            <p className="text-sm text-muted">Governance console — users, courses, opportunities, placements & audit</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="!bg-slate-900 !text-white">Admin</Badge>
          <span className="hidden items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-bold text-success sm:inline-flex"><span className="h-2 w-2 rounded-full bg-success animate-pulse" /> System healthy</span>
        </div>
      </div>

      {/* Top stats — §57 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5">
        <StatCard label="Total Users" value="13.2k" icon="group" trend={7} trendLabel="vs last month" />
        <StatCard label="Students" value="12,480" icon="school" trend={8} trendLabel="+320 week" />
        <StatCard label="Industries / Colleges" value="342 / 48" icon="business" trend={5} trendLabel="verified 142" />
        <StatCard label="Active Courses" value="64" icon="menu_book" trend={4} trendLabel="4 new" />
        <StatCard label="Internships / Jobs" value="128 / 86" icon="work" trend={12} trendLabel="open" className="col-span-2 xl:col-span-1" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Applications" value="8,420" icon="assignment" trend={15} trendLabel="this month" />
        <StatCard label="Placements" value="1,024" icon="workspace_premium" trend={9} trendLabel="placed" />
        <StatCard label="Assessments Taken" value="6.8k" icon="quiz" trend={11} trendLabel="this month" />
        <StatCard label="AI Requests (24h)" value="4.2k" icon="smart_toy" trend={18} trendLabel="↗" />
      </div>

      {/* Governance breakdown */}
      <Card className="!p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-bold text-charcoal">Platform by role</h3>
          <span className="text-xs text-muted">Active vs Pending • last 30 days</span>
        </div>
        <div className="grid grid-cols-2 gap-0 divide-x divide-border lg:grid-cols-5">
          {[
            { k: 'Students', active: '12.1k', pending: '342', c: 'text-primary' },
            { k: 'Industries', active: '318', pending: '24', c: 'text-accent' },
            { k: 'Academia', active: '112', pending: '7', c: 'text-success' },
            { k: 'Admins', active: '12', pending: '0', c: 'text-charcoal' },
            { k: 'Total', active: '12.5k', pending: '373', c: 'text-charcoal font-bold' },
          ].map((r) => (
            <div key={r.k} className="p-4 text-center">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">{r.k}</p>
              <p className={`mt-1 text-lg font-bold ${r.c}`}>{r.active}</p>
              <p className="text-xs text-muted">+{r.pending} pending</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard title="User Growth" subtitle="New registrations — 6 months" className="lg:col-span-6" height={200}>
          <div className="flex h-full items-end gap-2">
            {[210, 340, 380, 420, 510, 620].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-bold text-charcoal">{v}</span>
                <div className="w-full rounded-t-xl bg-slate-900" style={{ height: `${(v / 620) * 130}px` }} />
                <span className="text-[11px] text-muted">M{i + 1}</span>
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Internship & Job Postings" subtitle="Postings per month" className="lg:col-span-6" height={200}>
          <div className="flex h-full items-end gap-2">
            {[
              { i: 22, j: 14 }, { i: 28, j: 18 }, { i: 35, j: 22 }, { i: 30, j: 24 }, { i: 42, j: 28 }, { i: 38, j: 31 },
            ].map((d, idx) => (
              <div key={idx} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full items-end gap-1" style={{ height: 130 }}>
                  <div className="flex-1 rounded-t-lg bg-primary" style={{ height: `${(d.i / 42) * 100}%` }} title={`Internships ${d.i}`} />
                  <div className="flex-1 rounded-t-lg bg-accent" style={{ height: `${(d.j / 42) * 100}%` }} title={`Jobs ${d.j}`} />
                </div>
                <span className="text-[11px] text-muted">M{idx + 1}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-xs text-muted"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Internships</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Jobs</span></div>
        </ChartCard>

        <ChartCard title="Applications" subtitle="Weekly applications" className="lg:col-span-4" height={180}>
          <div className="flex h-full items-end gap-1.5">
            {[280, 420, 380, 560, 480, 640].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] font-bold text-charcoal">{v}</span>
                <div className="w-full rounded-t-lg bg-primary" style={{ height: `${(v / 640) * 110}px` }} />
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Placements" subtitle="Monthly placements" className="lg:col-span-4" height={180}>
          <div className="flex h-full items-end gap-1.5">
            {[12, 18, 22, 28, 24, 32].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[11px] font-bold text-success">{v}</span>
                <div className="w-full rounded-t-lg bg-success" style={{ height: `${(v / 32) * 110}px` }} />
              </div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Skill Demand" subtitle="Top skills by postings" className="lg:col-span-4" height={180}>
          <div className="space-y-2.5">
            {['React 82%', 'Node 76%', 'Python 71%', 'SQL 68%', 'AWS 55%', 'Docker 47%'].map((t) => (
              <div key={t} className="flex items-center gap-2 text-sm"><span className="h-2 w-2 rounded-full bg-primary" />{t}<span className="ml-auto text-xs text-muted">↑</span></div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Course Engagement" subtitle="Avg completion by category" className="lg:col-span-6" height={190} placeholder />
        <Card className="lg:col-span-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-charcoal">Platform Activity (24h)</h3>
            <Badge variant="success">Live</Badge>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-background border border-border p-3"><p className="text-xl font-bold text-charcoal">842</p><p className="text-xs text-muted">Logins</p></div>
            <div className="rounded-xl bg-background border border-border p-3"><p className="text-xl font-bold text-primary">128</p><p className="text-xs text-muted">Enrollments</p></div>
            <div className="rounded-xl bg-background border border-border p-3"><p className="text-xl font-bold text-success">64</p><p className="text-xs text-muted">Applications</p></div>
          </div>
          <div className="mt-4 rounded-xl bg-slate-900 p-4 text-white">
            <p className="text-sm font-bold">Audit: 12 admin actions today</p>
            <p className="text-xs text-slate-300">3 verifications approved • 2 courses published • 1 college suspended • View audit logs →</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-charcoal">Verification Queue</h3>
            <p className="text-xs text-muted">Pending approvals requiring action</p>
          </div>
          <Button size="sm" variant="outline">Review queue →</Button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4"><p className="text-3xl font-bold text-amber-700">7</p><p className="text-xs font-bold uppercase tracking-widest text-amber-700">Pending Companies</p><p className="text-xs text-amber-700">2 expiring docs</p></div>
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4"><p className="text-3xl font-bold text-primary">3</p><p className="text-xs font-bold uppercase tracking-widest text-primary">Pending Colleges</p><p className="text-xs text-primary">Avg wait 1.8d</p></div>
          <div className="rounded-xl bg-success/5 border border-success/20 p-4"><p className="text-3xl font-bold text-success">142</p><p className="text-xs font-bold uppercase tracking-widest text-success">Verified This Month</p><p className="text-xs text-success">+18% MoM</p></div>
        </div>
      </Card>
    </div>
  )
}
