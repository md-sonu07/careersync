import ChartCard from '../../components/common/ChartCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/Progress'

const skills = [
  { name: 'React', demand: 82, trend: 'Growing', change: '+12%', color: 'bg-primary' },
  { name: 'Node.js', demand: 76, trend: 'Growing', change: '+8%', color: 'bg-primary' },
  { name: 'Python', demand: 71, trend: 'Growing', change: '+9%', color: 'bg-accent' },
  { name: 'SQL', demand: 68, trend: 'Stable', change: '+2%', color: 'bg-accent' },
  { name: 'AWS / Cloud', demand: 64, trend: 'Rising', change: '+15%', color: 'bg-success' },
  { name: 'Docker', demand: 58, trend: 'Rising', change: '+18%', color: 'bg-success' },
  { name: 'TypeScript', demand: 54, trend: 'Growing', change: '+7%', color: 'bg-primary/70' },
  { name: 'Data Analysis', demand: 49, trend: 'Stable', change: '+1%', color: 'bg-muted' },
]

export default function IndustryDemand() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Industry Demand</h1>
        <p className="text-sm text-muted mt-1">Most in-demand skills across industry postings on CareerSync.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title="Most In-Demand Skills" subtitle="Share of postings requiring the skill" className="lg:col-span-2" height={420}>
          <div className="space-y-4">
            {skills.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-charcoal">{s.name}</span>
                  <span className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold border ${s.trend === 'Rising' ? 'bg-success/10 text-success border-success/20' : s.trend === 'Growing' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-background text-muted border-border'}`}>
                      {s.trend} {s.change}
                    </span>
                    <span className="text-sm font-bold tabular-nums text-charcoal">{s.demand}%</span>
                  </span>
                </div>
                <ProgressBar value={s.demand} size="sm" barClassName={s.color} />
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal flex items-center gap-2"><span className="material-symbols-outlined text-primary">trending_up</span> Key Takeaways</h3>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-2 text-sm text-charcoal"><span className="text-success">●</span> Frontend (React, TS) remains #1 demand driver.</li>
              <li className="flex gap-2 text-sm text-charcoal"><span className="text-accent">●</span> Cloud & Docker demand surging +15-18%.</li>
              <li className="flex gap-2 text-sm text-charcoal"><span className="text-primary">●</span> Python + SQL essential for data roles.</li>
            </ul>
            <div className="mt-4 rounded-xl bg-sage border border-border p-3">
              <p className="text-xs font-bold text-primary">Recommendation</p>
              <p className="text-sm text-charcoal mt-1">Prioritize Cloud & DevOps bootcamps to close the widening gap.</p>
            </div>
          </Card>

          <Card className="!p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-border"><h3 className="font-bold text-charcoal">Top Hiring Partners</h3><p className="text-xs text-muted">By postings volume</p></div>
            <div className="divide-y divide-border">
              {[
                { name: 'TechNova', postings: 18, hiring: 'React, Node' },
                { name: 'Flipkart', postings: 12, hiring: 'React, SQL' },
                { name: 'Zomato', postings: 9, hiring: 'Python, AWS' },
                { name: 'Razorpay', postings: 7, hiring: 'Node, Docker' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-3 px-6 py-3">
                  <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center text-xs font-bold text-primary">{p.name[0]}</div>
                  <div className="flex-1"><p className="text-sm font-semibold text-charcoal">{p.name}</p><p className="text-xs text-muted">{p.hiring}</p></div>
                  <Badge variant="default">{p.postings} posts</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ChartCard title="Demand Trend (6 months)" subtitle="Indexed postings volume" height={200} placeholder />
    </div>
  )
}
