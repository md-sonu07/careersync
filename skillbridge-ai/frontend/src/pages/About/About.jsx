import { Link } from 'react-router-dom'
import SectionHeading from '../../components/common/SectionHeading'
import StatCard from '../../components/common/StatCard'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const stats = [
  { label: 'Active Learners', value: '50,000+', trend: 12, trendLabel: 'vs last year', icon: 'group' },
  { label: 'Industry Partners', value: '420+', trend: 8, trendLabel: 'hiring partners', icon: 'handshake' },
  { label: 'Courses & Paths', value: '1,200+', trend: 15, trendLabel: 'curated', icon: 'menu_book' },
  { label: 'Avg. Skill Match', value: '91%', trend: 4, trendLabel: 'placement rate', icon: 'verified' },
]

const timeline = [
  { year: '2022', title: 'The Idea', desc: 'Identified the growing skill-gap between academia and industry. Started researching AI-driven assessment models.' },
  { year: '2023', title: 'CareerSync MVP', desc: 'Launched early access with 3 universities and 20 hiring partners. First 1,000 skill profiles created.' },
  { year: '2024', title: 'AI Matching Engine', desc: 'Introduced adaptive assessments and gap-based roadmaps. 15k learners placed in internships.' },
  { year: '2026', title: 'Ecosystem Scale', desc: 'Tri-sided platform for students, industry and academia — analytics, pipelines and verified certificates.' },
]

const values = [
  { icon: 'lightbulb', title: 'Learner First', desc: 'Every feature starts from a student outcome — clarity, confidence and career readiness.' },
  { icon: 'shield', title: 'Trust & Transparency', desc: 'Verified skills, explainable AI matches and fair opportunity access for all.' },
  { icon: 'diversity_3', title: 'Bridge, Not Gatekeep', desc: 'We connect classrooms to careers with open standards and shared insights.' },
]

const team = [
  { name: 'Dr. Ayesha Khan', role: 'Co-founder & CEO', initials: 'AK' },
  { name: 'Marcus Chen', role: 'Co-founder & CTO', initials: 'MC' },
  { name: 'Sofia Reyes', role: 'Head of Industry Partnerships', initials: 'SR' },
  { name: 'Arjun Patel', role: 'Head of Learning Design', initials: 'AP' },
]

const About = () => {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="default" className="mb-4">About CareerSync</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
              Bridging <span className="text-primary">education</span> to opportunity with AI
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted">
              CareerSync is an education SaaS that aligns what students learn, what institutions teach, and what industry actually needs — through adaptive assessments, skill roadmaps and intelligent matching.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/register">
                <Button size="lg">Join CareerSync</Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="outline" size="lg">How it works</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} trend={s.trend} trendLabel={s.trendLabel} icon={s.icon} />
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-8">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
              <span className="material-symbols-outlined">flag</span>
            </div>
            <h3 className="text-xl font-bold text-charcoal">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Empower every learner with a clear, personalized path from current skills to career-ready capabilities. We make skill gaps visible — and closable — through curated learning, deliberate practice and real opportunities.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-charcoal/80">
              <li className="flex gap-2"><span className="text-success">✓</span> Personalized roadmaps grounded in industry demand</li>
              <li className="flex gap-2"><span className="text-success">✓</span> Assessments that measure applied skill, not recall</li>
              <li className="flex gap-2"><span className="text-success">✓</span> Equitable access to internships and jobs</li>
            </ul>
          </Card>
          <Card className="p-8 bg-primary text-white border-primary">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 border border-white/20">
              <span className="material-symbols-outlined text-white">visibility</span>
            </div>
            <h3 className="text-xl font-bold">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              A world where education is continuously tuned to opportunity — where institutions plan with live market signals and industry hires with confidence in verified skills.
            </p>
            <div className="mt-6 rounded-xl bg-white/10 p-4 border border-white/15">
              <p className="text-sm font-semibold text-white">2026 North Star</p>
              <p className="mt-1 text-sm text-white/70">1 million learners with verified skill profiles and a 95% role-readiness signal across partner programs.</p>
            </div>
          </Card>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <SectionHeading title="What drives us" subtitle="Principles we design, assess and match by — every day." />
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <Card key={v.title} hover className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-primary border border-border">
                <span className="material-symbols-outlined text-[20px]">{v.icon}</span>
              </div>
              <h4 className="mt-4 font-semibold text-charcoal">{v.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading title="Our journey" subtitle="From research to ecosystem — built with students, educators and employers." />
        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border md:left-1/2 md:-translate-x-px" aria-hidden />
          <div className="space-y-6">
            {timeline.map((t, i) => (
              <div key={t.year} className={`relative flex gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-xs font-bold border-4 border-background shadow-soft">
                  {t.year.slice(-2)}
                </div>
                <Card className="ml-12 flex-1 p-6 md:ml-0">
                  <Badge variant="muted" className="mb-2">{t.year}</Badge>
                  <h4 className="font-semibold text-charcoal">{t.title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{t.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <SectionHeading title="Built by educators, engineers and employers" subtitle="A small senior team with advisors from universities and hiring partners." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <Card key={m.name} hover className="p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sage border border-border text-primary font-bold text-xl">
                {m.initials}
              </div>
              <h4 className="mt-4 font-semibold text-charcoal">{m.name}</h4>
              <p className="text-sm text-muted">{m.role}</p>
              <div className="mt-4 flex justify-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted text-xs">in</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted text-xs">𝕏</span>
              </div>
            </Card>
          ))}
        </div>
        <Card className="mt-8 border-dashed bg-background/50 p-6 text-center">
          <p className="text-sm text-muted">Want to join the mission? We are hiring across product, AI and partnerships.</p>
          <Link to="/register" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">Explore roles →</Link>
        </Card>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-primary px-8 py-10 text-center md:px-12 md:py-14">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Start your bridge to opportunity</h3>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">Create your skill profile, discover gaps, and get matched to the right courses and roles.</p>
          <Link to="/register" className="mt-6 inline-flex">
            <Button variant="outline" className="bg-white text-primary border-white hover:bg-white/90">Get started free</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About
