import { Link } from 'react-router-dom'
import SectionHeading from '../../components/common/SectionHeading'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const steps = [
  {
    n: '01',
    title: 'Build Profile',
    icon: 'person_add',
    desc: 'Create your skill profile from education, projects and interests. Import resume or start guided — we map you to industry skill taxonomies.',
    bullets: ['Guided onboarding in 4 minutes', 'Resume parse + manual add', 'Skill ontology auto-tagging'],
    color: 'bg-sage',
  },
  {
    n: '02',
    title: 'Assess',
    icon: 'quiz',
    desc: 'Take adaptive AI assessments that test applied understanding — code, case and scenario based — not memorization.',
    bullets: ['Adaptive difficulty', 'Instant vs sample evaluation', 'Verified skill signals'],
    color: 'bg-accent-soft',
  },
  {
    n: '03',
    title: 'Discover Gaps',
    icon: 'radar',
    desc: 'See a gap analysis against your target roles. Understand what to learn next, why it matters, and how far you are.',
    bullets: ['Role-fit score (0–100%)', 'Skill gap heatmap', 'Priority-ranked gaps'],
    color: 'bg-sage',
  },
  {
    n: '04',
    title: 'Learn & Practice',
    icon: 'school',
    desc: 'Follow a personalized roadmap: bite-size courses, hands-on labs and practice projects tuned to close your top gaps first.',
    bullets: ['Curated courses & labs', 'Projects with review', 'Streaks & progress tracking'],
    color: 'bg-accent-soft',
  },
  {
    n: '05',
    title: 'Find Opportunities',
    icon: 'work',
    desc: 'Get matched to internships and jobs where your profile shines. Apply in one click and track everything in your pipeline.',
    bullets: ['Match % ranked feed', 'One-click apply', 'Pipeline & deadline tracking'],
    color: 'bg-sage',
  },
]

const loop = ['Assess', 'Gap', 'Learn', 'Practice', 'Improve', 'Match', 'Apply']

const benefits = [
  {
    role: 'For Students',
    icon: 'school',
    points: ['Clarity on what to learn next', 'Faster, focused upskilling', 'Higher interview conversion with verified skills'],
  },
  {
    role: 'For Industry',
    icon: 'apartment',
    points: ['Candidates filtered by real skill signals', 'Shorter time-to-hire', 'Pipeline with skill-fit analytics'],
  },
  {
    role: 'For Institute',
    icon: 'account_balance',
    points: ['Live view of demand vs curriculum', 'Skill-gap cohorts', 'Data to design bridge programs'],
  },
]

const HowItWorks = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="accent">How it works</Badge>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
              From profile to placement — <span className="text-primary">in 5 steps</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              CareerSync turns ambiguity into a clear loop: understand where you are, close what matters, and connect to roles that fit.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <Card key={s.n} hover className="relative flex flex-col p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-widest text-muted">{s.n}</span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg border border-border text-primary ${s.color}`}>
                  <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                </span>
              </div>
              <h3 className="mt-3 text-base font-bold text-charcoal">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.desc}</p>
              <ul className="mt-4 space-y-1.5">
                {s.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-xs text-charcoal/70">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-background border border-border px-3 py-2 text-xs text-muted">
                Outcome: <span className="font-semibold text-charcoal">{s.n === '05' ? 'Interview-ready pipeline' : s.n === '03' ? 'Prioritized roadmap' : 'Verified signal'}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Loop visual */}
        <Card className="mt-10 p-6 md:p-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-charcoal">The CareerSync Loop</h3>
              <p className="text-sm text-muted">Continuous improvement flywheel — every cycle raises your match %</p>
            </div>
            <Badge variant="success">Live feedback loop</Badge>
          </div>

          {/* desktop loop */}
          <div className="mt-8 hidden md:flex items-center justify-between gap-2">
            {loop.map((label, idx) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl border bg-white shadow-subtle ${idx === 0 ? 'border-primary ring-2 ring-primary/10' : 'border-border'}`}>
                  <span className="text-xs font-bold tracking-widest text-muted">{String(idx + 1).padStart(2, '0')}</span>
                  <span className="mt-1 text-sm font-semibold text-charcoal">{label}</span>
                  <span className={`mt-2 h-1.5 w-1.5 rounded-full ${idx % 2 === 0 ? 'bg-primary' : 'bg-accent'}`} />
                </div>
                {idx < loop.length - 1 && (
                  <span className="text-muted shrink-0">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 5l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                )}
              </div>
            ))}
          </div>
          {/* mobile stacked */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:hidden">
            {loop.map((label, idx) => (
              <div key={label} className="flex items-center gap-3 rounded-xl border border-border bg-white p-3 shadow-subtle">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage text-xs font-bold text-primary">{idx + 1}</span>
                <span className="text-sm font-semibold text-charcoal">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage px-3 py-1.5 font-medium text-primary border border-border"><span className="h-2 w-2 rounded-full bg-primary" /> Assess → Understand</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-3 py-1.5">Learn → Close gaps</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-3 py-1.5">Match → Apply with confidence</span>
          </div>
        </Card>
      </section>

      {/* Benefits by role */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <SectionHeading title="Benefits for every stakeholder" subtitle="One platform, three perspectives — aligned around verified skills." />
        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.role} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
                <span className="material-symbols-outlined text-[20px]">{b.icon}</span>
              </div>
              <h4 className="mt-4 font-bold text-charcoal">{b.role}</h4>
              <ul className="mt-3 space-y-2.5">
                {b.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success text-xs">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline">
                Explore for {b.role.replace('For ', '')} →
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-charcoal px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">Ready to start the loop?</h3>
            <p className="mt-2 text-white/70 max-w-xl">Build your profile in minutes and get your first skill-gap report instantly.</p>
          </div>
          <Link to="/register">
            <Button size="lg" className="bg-white text-charcoal border-white hover:bg-white/90">Create account</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HowItWorks
