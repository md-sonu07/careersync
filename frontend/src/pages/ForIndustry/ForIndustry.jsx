import { Link } from 'react-router-dom'
import SectionHeading from '../../components/common/SectionHeading'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import AppIcon from '../../components/ui/AppIcon';

const steps = [
  { title: 'Post Opportunities', icon: 'post_add', desc: 'Create internships and jobs in minutes. Rich editor with role templates and skill suggestions from live market data.' },
  { title: 'Define Skill Requirements', icon: 'tune', desc: 'Set must-have vs nice-to-have skills with proficiency levels. AI suggests weightings based on successful hires.' },
  { title: 'Discover Candidates', icon: 'search', desc: 'Browse skill-verified candidates ranked by match %. Filter by assessment score, projects and availability.' },
  { title: 'Smart Matching', icon: 'hub', desc: 'Our matching engine explains every score — why a candidate fits and what gap remains, if any.' },
  { title: 'Application Management', icon: 'fact_check', desc: 'Kanban pipeline, collaborative notes, and one-click outreach. From applied to offer without leaving CareerSync.' },
]

const pipelineCols = [
  { name: 'Applied', count: 42, color: 'border-border', items: ['Aarav S. — 91% ', 'Priya M. — 88%'] },
  { name: 'Screening', count: 18, color: 'border-accent', items: ['Kabir L. — 94%'] },
  { name: 'Interview', count: 9, color: 'border-primary', items: ['Neha R. — 89%'] },
  { name: 'Offer', count: 4, color: 'border-success', items: ['Vikram D. — 96%'] },
]

const ForIndustry = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="accent">For Industry</Badge>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
                Hire for <span className="text-primary">verified skill</span>, not keywords
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Post roles, define what truly matters, and meet candidates whose abilities are proven — not just claimed on a resume.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register"><Button size="lg">Post a role</Button></Link>
                <Link to="/internships"><Button variant="outline" size="lg">See talent pool</Button></Link>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[{ v: '3.2x', l: 'Faster shortlist' }, { v: '47%', l: 'Lower mis-hire' }, { v: '4.8/5', l: 'Employer rating' }].map((s) => (
                  <div key={s.l} className="rounded-xl border border-border bg-white p-3 shadow-subtle">
                    <p className="text-lg font-bold text-charcoal">{s.v}</p>
                    <p className="text-xs text-muted">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock pipeline visual */}
            <Card className="p-0 overflow-hidden">
              <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-background">
                <p className="text-sm font-semibold text-charcoal">Hiring Pipeline — Frontend Intern</p>
                <Badge variant="default">12 new</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 p-4 lg:grid-cols-4">
                {pipelineCols.map((col) => (
                  <div key={col.name} className={`rounded-xl border-t-4 bg-background border border-border ${col.color} p-3`}>
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">{col.name}</p>
                      <span className="rounded-full bg-white border border-border px-2 py-0.5 text-xs font-semibold">{col.count}</span>
                    </div>
                    <div className="mt-3 space-y-2">
                      {col.items.map((it) => (
                        <div key={it} className="rounded-lg bg-white border border-border px-2.5 py-2 shadow-soft">
                          <p className="text-xs font-medium text-charcoal">{it}</p>
                          <p className="text-[11px] text-muted">React • TypeScript</p>
                        </div>
                      ))}
                      <button className="w-full rounded-lg border border-dashed border-border py-2 text-xs text-muted hover:bg-white">+ Invite</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border bg-sage/30 px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-muted">Avg. time to shortlist: <span className="font-semibold text-charcoal">2.1 days</span></span>
                <span className="text-xs font-semibold text-primary">View all →</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading title="From posting to pipeline in one flow" subtitle="Everything hiring managers need — without the spreadsheet chaos." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {steps.map((s, i) => (
            <Card key={s.title} hover className="p-6 relative">
              <span className="absolute right-4 top-4 text-4xl font-bold text-border/60">0{i + 1}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <AppIcon name={s.icon} className="text-[20px]" />
              </div>
              <h3 className="mt-4 pr-6 font-semibold text-charcoal leading-tight">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Candidate discovery mock */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="font-bold text-charcoal">Discover candidates who prove it</h3>
            <p className="mt-2 text-sm text-muted">Filter by verified assessments, project evidence and match %. No keyword stuffing — just signal.</p>
            <div className="mt-5 space-y-3">
              {[
                { name: 'Ananya Gupta', role: 'Frontend Developer', match: 94, skills: ['React', 'TS', 'Tailwind'], ver: 'Level 4' },
                { name: 'Rohan Mehta', role: 'Full-Stack Intern', match: 88, skills: ['Node', 'React', 'SQL'], ver: 'Level 3' },
                { name: 'Sara Ali', role: 'UI Engineer', match: 91, skills: ['Figma', 'React', 'A11y'], ver: 'Level 4' },
              ].map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-xl border border-border bg-white p-3 shadow-soft">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-sage border border-border flex items-center justify-center font-bold text-xs text-primary">{c.name.split(' ').map((n) => n[0]).join('')}</div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{c.name}</p>
                      <p className="text-xs text-muted">{c.role} • Verified {c.ver}</p>
                      <div className="mt-1 flex gap-1">{c.skills.map((s) => <span key={s} className="rounded-full bg-background border border-border px-2 py-0.5 text-[11px]">{s}</span>)}</div>
                    </div>
                  </div>
                  <Badge variant="success">{c.match}% match</Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-primary text-white border-primary">
            <h3 className="font-bold">Define requirements with confidence</h3>
            <p className="mt-2 text-sm text-white/70">AI suggests skill weightings from 420+ successful hires and flags unrealistic combos.</p>
            <div className="mt-6 space-y-3">
              {[
                { skill: 'React', level: 'Advanced', w: 'Must-have', pct: 90 },
                { skill: 'TypeScript', level: 'Intermediate', w: 'Must-have', pct: 75 },
                { skill: 'System Design', level: 'Basic', w: 'Nice-to-have', pct: 40 },
              ].map((r) => (
                <div key={r.skill} className="rounded-xl bg-white/10 border border-white/15 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{r.skill} — {r.level}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${r.w === 'Must-have' ? 'bg-white text-primary' : 'bg-white/20 text-white'}`}>{r.w}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div className="h-full bg-white" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-white p-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-charcoal">Estimated qualified pool: 1,240</span>
              <span className="text-xs text-success font-semibold">Healthy</span>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-white border border-border shadow-subtle px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-charcoal">Ready to meet skill-verified talent?</h3>
            <p className="mt-2 text-muted">Post your first role free — get matched candidates within hours.</p>
          </div>
          <Link to="/register">
            <Button size="lg">Create employer account</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ForIndustry
