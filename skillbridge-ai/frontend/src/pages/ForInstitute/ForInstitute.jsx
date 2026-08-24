import { Link } from 'react-router-dom'
import SectionHeading from '../../components/common/SectionHeading'
import ChartCard from '../../components/common/ChartCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import AppIcon from '../../components/ui/AppIcon';

const insights = [
  { title: 'Student Analytics', icon: 'analytics', desc: 'Cohort readiness, assessment trends and at-risk flags — live, not end-of-term.', bullets: ['Readiness distribution by department', 'Weekly engagement & streaks', 'Assessment vs project correlation'] },
  { title: 'Industry Demand', icon: 'trending_up', desc: 'Live demand signals by role, skill and location from partner postings.', bullets: ['Top 20 rising skills', 'Salary & stipend bands', 'Demand vs supply gap'] },
  { title: 'Skill-Gap Insights', icon: 'bug_report', desc: 'Where curriculum and market diverge — quantified and prioritized.', bullets: ['Curriculum coverage heatmap', 'Gap severity scoring', 'Cohort-wise gaps'] },
  { title: 'Training Recommendations', icon: 'lightbulb', desc: 'Actionable bridge programs — what to run, for whom, and expected lift.', bullets: ['Suggested workshops & courses', 'Estimated match % lift', 'Resource & timeline plan'] },
]

const ForInstitute = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="default">For Institute</Badge>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
                Turn <span className="text-primary">curriculum</span> into career outcomes
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Give every department a live view of student readiness, industry shifts and what to teach next — backed by data, not anecdotes.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register"><Button size="lg">Request demo</Button></Link>
                <Link to="/how-it-works"><Button variant="outline" size="lg">See methodology</Button></Link>
              </div>
              <div className="mt-6 flex gap-6 text-sm">
                <span className="text-muted"><span className="font-bold text-charcoal">120+</span> partner campuses</span>
                <span className="text-muted"><span className="font-bold text-charcoal">35%</span> avg. placement lift</span>
              </div>
            </div>

            <div className="grid gap-4">
              <ChartCard title="Readiness Distribution — CSE 2026" subtitle="Final year • 240 students • Updated hourly" placeholder height={200}>
                {null}
              </ChartCard>
              {/* override placeholder with mock bars */}
              <div className="rounded-2xl border border-border bg-white shadow-subtle p-6 -mt-2">
                <div className="flex items-end gap-2 h-32">
                  {[
                    { label: '0-40%', h: '30%', c: 'bg-danger/60' },
                    { label: '40-60%', h: '55%', c: 'bg-accent/70' },
                    { label: '60-80%', h: '80%', c: 'bg-primary/60' },
                    { label: '80-100%', h: '65%', c: 'bg-success/70' },
                  ].map((b) => (
                    <div key={b.label} className="flex-1 flex flex-col items-center gap-2">
                      <div className={`w-full rounded-t-lg ${b.c} border border-border`} style={{ height: b.h }} />
                      <span className="text-xs text-muted">{b.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-between text-xs text-muted">
                  <span>Avg. readiness: <span className="font-semibold text-charcoal">68%</span></span>
                  <span className="text-success">↑ 8% vs last term</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insights grid */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading title="Insights that drive action" subtitle="Four interconnected lenses — from student to market to curriculum." />
        <div className="grid gap-6 md:grid-cols-2">
          {insights.map((ins) => (
            <Card key={ins.title} hover className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-primary border border-border">
                <AppIcon name={ins.icon} className="text-[20px]" />
              </div>
              <h3 className="mt-4 font-bold text-charcoal">{ins.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{ins.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {ins.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm text-charcoal/70">
                    <span className="text-success mt-0.5">•</span> {b}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Charts row */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-6 lg:grid-cols-3">
          <ChartCard title="Industry Demand by Skill" subtitle="Postings last 90 days • 420 partners" placeholder height={220} />
          <ChartCard title="Skill Gap Heatmap" subtitle="CSE vs Market • Red = urgent gap" height={220}>
            <div className="grid grid-cols-4 gap-2 h-full content-center">
              {[
                { s: 'React', v: 12, c: 'bg-success/20 border-success/30' },
                { s: 'TS', v: 34, c: 'bg-accent/30 border-accent/30' },
                { s: 'DSA', v: 58, c: 'bg-danger/20 border-danger/30' },
                { s: 'SQL', v: 22, c: 'bg-sage border-border' },
                { s: 'SysDes', v: 67, c: 'bg-danger/30 border-danger/40' },
                { s: 'Testing', v: 41, c: 'bg-accent/20 border-accent/30' },
                { s: 'Comm', v: 18, c: 'bg-success/15 border-success/20' },
                { s: 'Git', v: 9, c: 'bg-success/10 border-success/20' },
              ].map((cell) => (
                <div key={cell.s} className={`rounded-xl border p-3 text-center ${cell.c}`}>
                  <p className="text-xs font-semibold text-charcoal">{cell.s}</p>
                  <p className="text-xs text-muted">{cell.v}% gap</p>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard title="Training Recommendation" subtitle="Suggested bridge program" height={220}>
            <div className="flex h-full flex-col justify-center space-y-3">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Recommended</p>
                <p className="text-sm font-bold text-charcoal mt-1">DSA Intensive — 3 weeks • 40 students</p>
                <p className="text-xs text-muted mt-1">Target: Students at 40-60% readiness with DSA gap &gt;50%</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-sage border border-border p-3 text-center"><p className="text-xs text-muted">Expected lift</p><p className="text-lg font-bold text-primary">+18%</p></div>
                <div className="rounded-xl bg-white border border-border p-3 text-center"><p className="text-xs text-muted">Effort</p><p className="text-sm font-semibold text-charcoal">12 hrs / week</p></div>
              </div>
              <Button size="sm" className="w-full">Schedule program</Button>
            </div>
          </ChartCard>
        </div>

        {/* Visual placeholder note for demand chart - replaced with bars */}
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-white p-6 hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Industry Demand — Preview (mock bars)</p>
          <div className="mt-4 flex items-end gap-3 h-24">
            {[
              { k: 'React', h: 90 },
              { k: 'Python', h: 75 },
              { k: 'SQL', h: 82 },
              { k: 'TS', h: 68 },
              { k: 'AWS', h: 55 },
            ].map((b) => (
              <div key={b.k} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-primary/80 border border-primary/20" style={{ height: `${b.h}%` }} />
                <span className="text-xs text-muted">{b.k}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-charcoal px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Bring live insights to your campus</h3>
            <p className="mt-2 text-white/60 max-w-xl">Free pilot for one department. Department heads and placement cells — get a walkthrough this week.</p>
          </div>
          <Link to="/register">
            <Button size="lg" className="bg-white text-charcoal border-white hover:bg-white/90">Talk to our team</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ForInstitute
