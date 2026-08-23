import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { ProgressBar } from '../../components/ui/Progress'

const funnelSteps = [
  { label: 'Applications', count: 248, pct: 100, color: 'bg-primary' },
  { label: 'Screening', count: 112, pct: 45, color: 'bg-primary/80' },
  { label: 'Shortlisted', count: 31, pct: 12.5, color: 'bg-accent' },
  { label: 'Interview', count: 18, pct: 7.3, color: 'bg-accent/80' },
  { label: 'Selected', count: 6, pct: 2.4, color: 'bg-success' },
  { label: 'Hired', count: 4, pct: 1.6, color: 'bg-success' },
]

const topSkills = [
  { name: 'React', pct: 82, trend: 'Growing' },
  { name: 'Node.js', pct: 76, trend: 'Growing' },
  { name: 'Python', pct: 68, trend: 'Stable' },
  { name: 'SQL', pct: 61, trend: 'Growing' },
  { name: 'AWS', pct: 54, trend: 'Rising' },
  { name: 'Docker', pct: 47, trend: 'Rising' },
]

const pipelineRows = [
  { role: 'Frontend Intern — React', type: 'Internship', applicants: 84, shortlisted: 12, interviews: 6, status: 'Active', posted: '2 days ago' },
  { role: 'Backend Intern — Node.js', type: 'Internship', applicants: 62, shortlisted: 8, interviews: 4, status: 'Active', posted: '5 days ago' },
  { role: 'Junior Full Stack Developer', type: 'Job', applicants: 102, shortlisted: 11, interviews: 8, status: 'Active', posted: '1 week ago' },
  { role: 'Data Analyst Intern', type: 'Internship', applicants: 48, shortlisted: 5, interviews: 2, status: 'Closing Soon', posted: '1 week ago' },
]

const applicationsOverTime = [32, 48, 28, 56, 42, 68, 52]
const maxApp = Math.max(...applicationsOverTime)

export default function IndustryDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Welcome back, TechNova 👋</h1>
          <p className="mt-1 text-sm text-muted">Recruitment + internship pipeline — where talent meets opportunity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/industry/internships"><Button variant="outline" size="sm" icon="work">Post Internship</Button></Link>
          <Link to="/industry/jobs"><Button variant="primary" size="sm" icon="business_center">Post Job</Button></Link>
        </div>
      </div>

      {/* Summary — §39 now includes Interviews & Hired */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Active Internships" value="12" icon="work" trend={8} trendLabel="vs last month" />
        <StatCard label="Active Jobs" value="6" icon="business_center" trend={3} trendLabel="open roles" />
        <StatCard label="Applications" value="248" icon="assignment" trend={12} trendLabel="this week" />
        <StatCard label="Shortlisted" value="31" icon="star" trend={5} trendLabel="awaiting" />
        <StatCard label="Interviews" value="18" icon="event" trend={4} trendLabel="scheduled" />
        <StatCard label="Selected" value="6" icon="workspace_premium" trend={2} trendLabel="offers" />
        <StatCard label="Hired" value="4" icon="verified" trend={1} trendLabel="joined" className="col-span-2 xl:col-span-1" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Applications over time" subtitle="Last 7 weeks — internships + jobs" className="lg:col-span-2">
          <div className="flex h-full flex-col">
            <div className="flex flex-1 items-end gap-2">
              {applicationsOverTime.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs font-bold text-charcoal">{v}</span>
                  <div className="w-full rounded-t-xl bg-primary transition-all" style={{ height: `${(v / maxApp) * 140}px`, minHeight: 12 }} />
                  <span className="text-[11px] text-muted">W{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span className="h-2 w-2 rounded-full bg-primary" /> Applications
              <span className="ml-auto rounded-full bg-sage px-2 py-0.5 text-[11px] font-bold text-primary">+12% WoW</span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success">↗ 18 interviews</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Candidate funnel" subtitle="Applied → Hired conversion">
          <div className="space-y-3">
            {funnelSteps.map((s) => (
              <div key={s.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">{s.label}</span>
                  <span className="text-sm font-bold tabular-nums text-charcoal">{s.count}</span>
                </div>
                <div className="relative h-7 overflow-hidden rounded-xl border border-border bg-background flex items-center">
                  <div className={`h-full rounded-xl ${s.color} transition-all`} style={{ width: `${Math.max(14, s.pct)}%` }} />
                  <span className="absolute left-2 text-xs font-bold text-white drop-shadow-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>{s.pct}%</span>
                </div>
              </div>
            ))}
            <p className="pt-2 text-xs text-muted">2.4% applied→selected • 66% interview→selected • 12.5 days avg time-to-hire</p>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard title="Top required skills" subtitle="Share of openings requiring skill" className="lg:col-span-4">
          <div className="space-y-4">
            {topSkills.map((s) => (
              <div key={s.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">{s.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="rounded-full bg-sage px-2 py-0.5 text-[10px] font-bold text-primary">{s.trend}</span>
                    <span className="text-xs font-bold tabular-nums text-charcoal">{s.pct}%</span>
                  </span>
                </div>
                <ProgressBar value={s.pct} size="sm" barClassName={s.pct >= 70 ? 'bg-primary' : s.pct >= 55 ? 'bg-accent' : 'bg-muted'} />
              </div>
            ))}
          </div>
        </ChartCard>

        <Card className="lg:col-span-5 !p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-base font-semibold text-charcoal">Hiring pipeline</h3>
              <p className="mt-0.5 text-xs text-muted">Active postings • stage breakdown</p>
            </div>
            <Link to="/industry/applications" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-background/60">
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Role</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-muted">Applicants</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-muted">Interviews</th>
                  <th className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {pipelineRows.map((r) => (
                  <tr key={r.role} className="border-b border-border last:border-0 hover:bg-background/40">
                    <td className="px-6 py-3.5"><p className="text-sm font-semibold text-charcoal">{r.role}</p><p className="text-xs text-muted">{r.posted}</p></td>
                    <td className="px-4 py-3.5"><Badge variant={r.type === 'Job' ? 'accent' : 'default'} className="text-[11px]">{r.type}</Badge></td>
                    <td className="px-4 py-3.5 text-center text-sm font-bold text-charcoal">{r.applicants}</td>
                    <td className="px-4 py-3.5 text-center text-sm font-semibold text-primary">{r.interviews}</td>
                    <td className="px-6 py-3.5"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${r.status === 'Active' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <h3 className="font-bold text-charcoal flex items-center gap-2"><span className="material-symbols-outlined text-primary">insights</span> Hiring Analytics</h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl bg-success/5 border border-success/10 p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-success">Shortlist rate</p>
              <p className="text-2xl font-bold text-success">12.5%</p>
              <p className="text-xs text-muted">+2.1% vs last month</p>
            </div>
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">Selection rate</p>
              <p className="text-2xl font-bold text-primary">2.4%</p>
              <p className="text-xs text-muted">18 interviews → 6 selected</p>
            </div>
            <div className="rounded-xl bg-sage border border-border p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted">Top colleges</p>
              <p className="text-sm font-semibold text-charcoal">DTU, NSUT, BITS • 42% of shortlists</p>
            </div>
            <Link to="/industry/analytics" className="block text-center text-sm font-semibold text-primary hover:underline">View full analytics →</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
