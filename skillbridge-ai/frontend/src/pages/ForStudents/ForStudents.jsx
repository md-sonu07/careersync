import { Link } from 'react-router-dom'
import SectionHeading from '../../components/common/SectionHeading'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import AppIcon from '../../components/ui/AppIcon';

const features = [
  {
    title: 'Personalized Courses',
    icon: 'auto_stories',
    desc: 'Courses curated not by popularity — by your gaps. We rank and recommend what closes the highest-impact skills first.',
    mock: 'course',
  },
  {
    title: 'AI Assessment',
    icon: 'psychology',
    desc: 'Adaptive tests that adjust to your level and surface true capability. Retake anytime — see growth instantly.',
    mock: 'assess',
  },
  {
    title: 'Skill Roadmap',
    icon: 'route',
    desc: 'A visual roadmap from current level to role-ready, with milestones, streaks and time estimates.',
    mock: 'roadmap',
  },
  {
    title: 'Internship Recommendations',
    icon: 'work_history',
    desc: 'Internships scored by match % — know why you fit and what to improve to increase your chances.',
    mock: 'intern',
  },
]

const ForStudents = () => {
  return (
    <div className="bg-background">
      {/* Hero with mock */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="default">For Students</Badge>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
                Your personal <span className="text-primary">career co-pilot</span>
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted">
                Stop guessing what to learn. CareerSync shows you exactly where you stand, what to learn next, and which opportunities match — all in one place.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register"><Button size="lg">Start free assessment</Button></Link>
                <Link to="/courses"><Button variant="outline" size="lg">Browse courses</Button></Link>
              </div>
              <div className="mt-6 flex items-center gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success"/> Trusted by 120+ campuses</span>
                <span>•</span>
                <span>4.8/5 learner rating</span>
              </div>
            </div>

            {/* Mock screenshots */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 hidden h-40 w-40 rounded-3xl bg-sage/40 lg:block" aria-hidden />
              <Card className="relative p-0 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#FF5F56]" /><span className="h-3 w-3 rounded-full bg-[#FFBD2E]" /><span className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-xs font-medium text-muted">skillbridge.ai — My Roadmap</span>
                  <Badge variant="success">91% Match</Badge>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted">Target Role</p>
                      <p className="font-bold text-charcoal">Frontend Developer</p>
                      <ProgressBar value={68} showLabel label="Role readiness" />
                    </div>
                    <div className="hidden sm:flex flex-col items-center justify-center rounded-xl bg-sage px-5 border border-border">
                      <span className="text-2xl font-bold text-primary">68%</span>
                      <span className="text-xs text-muted">ready</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    {[
                      { skill: 'React & State Management', pct: 82, color: 'bg-primary' },
                      { skill: 'TypeScript & Testing', pct: 54, color: 'bg-accent' },
                      { skill: 'System Design Basics', pct: 38, color: 'bg-charcoal' },
                    ].map((r) => (
                      <div key={r.skill} className="flex items-center justify-between rounded-xl border border-border bg-white px-3 py-2.5">
                        <span className="text-sm text-charcoal">{r.skill}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-background border border-border overflow-hidden hidden sm:block">
                            <div className={`h-full ${r.color}`} style={{ width: `${r.pct}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-muted">{r.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl bg-primary p-3 flex items-center justify-between text-white">
                    <span className="text-sm font-medium">Next up: TypeScript Fundamentals →</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">3h left</span>
                  </div>
                </div>
              </Card>

              {/* floating mini card */}
              <Card className="absolute -bottom-6 -left-4 hidden p-3 shadow-card sm:flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success border border-success/10">
                  <AppIcon name="verified" className="text-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">Assessment verified</p>
                  <p className="text-xs text-muted">React Level 3 • Top 12%</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features with mock cards */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading title="Everything you need to go from learning to earning" subtitle="Four core experiences, deeply integrated — not four separate tools." />
        <div className="grid gap-6 lg:grid-cols-2">
          {features.map((f) => (
            <Card key={f.title} className="p-6 flex flex-col">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                  <AppIcon name={f.icon} className="text-[20px]" />
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{f.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.desc}</p>
                </div>
              </div>

              {/* mock visual */}
              <div className="mt-5 rounded-xl border border-border bg-background p-4">
                {f.mock === 'course' && (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="h-16 w-24 rounded-lg bg-border shrink-0 flex items-center justify-center text-muted text-xs">thumb</div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-charcoal">Advanced React Patterns</p>
                        <p className="text-xs text-muted">By Sarah Kim • 4.8 ★ • 12k students</p>
                        <div className="mt-2 flex gap-1.5"><span className="rounded-full bg-sage px-2 py-1 text-xs font-medium text-primary">React</span><span className="rounded-full bg-white border border-border px-2 py-1 text-xs">Intermediate</span></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted"><span>Recommended because: Gap in State Management</span><span className="font-semibold text-success">+12% match</span></div>
                  </div>
                )}
                {f.mock === 'assess' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs"><span className="font-medium text-charcoal">Question 7 / 12</span><span className="text-muted">Adaptive • Medium</span></div>
                    <p className="text-sm font-medium text-charcoal">Refactor this useEffect to avoid stale closure...</p>
                    <div className="grid gap-2">
                      {['Option A', 'Option B — Correct pattern', 'Option C'].map((o, i) => (
                        <div key={o} className={`rounded-lg border px-3 py-2 text-sm ${i === 1 ? 'border-success bg-success/10 text-success' : 'border-border bg-white text-muted'}`}>{o}</div>
                      ))}
                    </div>
                  </div>
                )}
                {f.mock === 'roadmap' && (
                  <div className="flex items-center gap-2">
                    {['Now', 'Week 2', 'Week 4', 'Ready'].map((step, i) => (
                      <div key={step} className="flex flex-1 items-center gap-2">
                        <div className={`flex h-8 flex-1 items-center justify-center rounded-lg border text-xs font-semibold ${i === 0 ? 'bg-primary text-white border-primary' : i === 3 ? 'bg-accent text-white border-accent' : 'bg-white text-muted border-border'}`}>{step}</div>
                        {i < 3 && <span className="text-muted">→</span>}
                      </div>
                    ))}
                  </div>
                )}
                {f.mock === 'intern' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-xs">ACME</div>
                      <div><p className="text-sm font-semibold text-charcoal">Frontend Intern</p><p className="text-xs text-muted">Bengaluru • 3 mo • ₹12k</p></div>
                    </div>
                    <Badge variant="success">87% Match</Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Career readiness */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <Card className="p-8 grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-charcoal">Career readiness, measured</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">A single readiness score that employers trust — built from assessments, projects and consistency, not self-reported claims.</p>
            <Link to="/register" className="mt-4 inline-flex text-sm font-semibold text-primary">See sample profile →</Link>
          </div>
          <div className="md:col-span-2 grid gap-4 sm:grid-cols-3">
            {[
              { k: 'Profile Strength', v: '86%', sub: 'Complete to boost matches' },
              { k: 'Weekly Streak', v: '12 days', sub: 'Keep learning daily' },
              { k: 'Certificates', v: '4 earned', sub: 'Shareable & verified' },
            ].map((c) => (
              <div key={c.k} className="rounded-xl border border-border bg-background p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{c.k}</p>
                <p className="mt-2 text-2xl font-bold text-charcoal">{c.v}</p>
                <p className="text-xs text-muted">{c.sub}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-8 py-10 text-center md:px-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Start your roadmap today</h3>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">It takes 4 minutes to build your profile and get your first gap report. Free forever for students.</p>
          <Link to="/register" className="mt-6 inline-flex">
            <Button variant="outline" className="bg-white text-primary border-white hover:bg-white/90">Create student account</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default ForStudents
