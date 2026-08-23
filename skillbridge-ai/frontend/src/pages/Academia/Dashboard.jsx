import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { ProgressBar } from '../../components/ui/Progress'

export default function AcademiaDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal sm:text-3xl">Academia Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Institutional intelligence — students, skills, demand & placements.</p>
        </div>
        <Badge icon="apartment" variant="default">DTU • CSE Dept • 6 semesters</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Students" value="1,248" icon="group" trend={4} trendLabel="this sem" />
        <StatCard label="Active Learners" value="987" icon="school" trend={6} trendLabel="learning" />
        <StatCard label="Assessed" value="935" icon="quiz" trend={3} trendLabel="assessed" />
        <StatCard label="Avg Skill Score" value="67%" icon="military_tech" trend={2} trendLabel="vs 65%" />
        <StatCard label="Internship Participation" value="320" icon="work" trend={9} trendLabel="vs last term" />
        <StatCard label="Placement Rate" value="78%" icon="workspace_premium" trend={5} trendLabel="placed" className="col-span-2 xl:col-span-1" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard title="Skill Distribution" subtitle="Share of students by primary track" className="lg:col-span-5" height={240}>
          <div className="flex h-full items-end gap-3">
            {[
              { k: 'Frontend', v: 34, c: 'bg-primary' },
              { k: 'Backend', v: 28, c: 'bg-accent' },
              { k: 'Data', v: 18, c: 'bg-success' },
              { k: 'Cloud', v: 12, c: 'bg-amber-600' },
              { k: 'AI/ML', v: 8, c: 'bg-charcoal' },
            ].map((b) => (
              <div key={b.k} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-bold text-charcoal">{b.v}%</span>
                <div className={`w-full rounded-t-xl ${b.c}`} style={{ height: `${b.v * 4.5}px` }} />
                <span className="text-[11px] font-medium text-muted">{b.k}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Assessment Performance" subtitle="Avg score by skill — last 30 days" className="lg:col-span-7" height={240}>
          <div className="space-y-3.5">
            {[
              { k: 'JavaScript', v: 78 }, { k: 'React', v: 74 }, { k: 'Node.js', v: 62 }, { k: 'SQL', v: 68 }, { k: 'Python', v: 71 }, { k: 'Docker', v: 41 },
            ].map((r) => (
              <div key={r.k}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-medium text-charcoal">{r.k}</span><span className={`font-bold tabular-nums ${r.v < 55 ? 'text-danger' : 'text-charcoal'}`}>{r.v}%</span></div>
                <ProgressBar value={r.v} size="sm" barClassName={r.v < 55 ? 'bg-danger' : r.v < 70 ? 'bg-accent' : 'bg-primary'} />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <ChartCard title="Learning Progress" subtitle="Avg course completion by dept (CSE/ECE/ME/CE)" className="lg:col-span-6" height={200}>
          <div className="space-y-3">
            {[
              { k: 'CSE', v: 72 }, { k: 'ECE', v: 64 }, { k: 'ME', v: 48 }, { k: 'CE', v: 52 },
            ].map((r) => (
              <div key={r.k}><div className="mb-1 flex justify-between text-sm"><span className="font-medium text-charcoal">{r.k}</span><span className="font-bold">{r.v}%</span></div><ProgressBar value={r.v} size="sm" barClassName="bg-primary" /></div>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Internship Participation" subtitle="Students in internships by dept" className="lg:col-span-3" height={200} placeholder />
        <Card className="lg:col-span-3">
          <h3 className="font-bold text-charcoal">Critical Insights</h3>
          <ul className="mt-3 space-y-2.5">
            {[
              'CSE 82% avg score (+4% MoM) — leads',
              'Docker 41% vs industry 68% — gap 27% needs workshop',
              'Cloud 38% → 320 students need lab',
              'Recommend Python & AWS bootcamps next month',
            ].map((t) => (
              <li key={t} className="flex gap-2 text-sm text-charcoal"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{t}</li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Action: 2 workshops pending</p>
            <p className="text-sm text-amber-900">Docker + Cloud labs recommended by Industry Demand</p>
          </div>
        </Card>
      </div>

      <ChartCard title="Placement Trends" subtitle="Placements vs eligible • last 6 months">
        <div className="flex h-[140px] items-end gap-2">
          {[
            { m: 'Sep', placed: 18, eligible: 42 },
            { m: 'Oct', placed: 24, eligible: 44 },
            { m: 'Nov', placed: 22, eligible: 45 },
            { m: 'Dec', placed: 31, eligible: 46 },
            { m: 'Jan', placed: 28, eligible: 48 },
            { m: 'Feb', placed: 36, eligible: 50 },
          ].map((d) => (
            <div key={d.m} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-bold text-success">{d.placed}</span>
              <div className="flex w-full items-end gap-1" style={{ height: 100 }}>
                <div className="flex-1 rounded-t bg-success" style={{ height: `${(d.placed / 50) * 100}%` }} />
                <div className="flex-1 rounded-t bg-border" style={{ height: `${(d.eligible / 50) * 100}%` }} />
              </div>
              <span className="text-[11px] text-muted">{d.m}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-4 text-xs text-muted"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Placed</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-border" /> Eligible</span><span className="ml-auto font-bold text-primary">78% current rate ↑</span></div>
      </ChartCard>
    </div>
  )
}
