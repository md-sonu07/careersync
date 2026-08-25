import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../../components/common/SectionHeading'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import AppIcon from '../../components/ui/AppIcon'

const features = [
  {
    title: 'Personalized Skill Roadmaps',
    icon: 'auto_stories',
    desc: 'Courses curated not by vanity popularity — but strictly by your identified skill gaps. We rank what closes the highest-impact skill gaps first.',
    mock: 'course',
  },
  {
    title: 'Adaptive AI Assessment',
    icon: 'psychology',
    desc: 'Interactive tests that calibrate difficulty in real time to surface true capability. Retake anytime to track score progression.',
    mock: 'assess',
  },
  {
    title: 'Visual Career Roadmap',
    icon: 'route',
    desc: 'A step-by-step visual path from your current baseline to role-ready, complete with milestones, streaks, and realistic time estimates.',
    mock: 'roadmap',
  },
  {
    title: 'Match-Ranked Internships',
    icon: 'work_history',
    desc: 'Internships and jobs scored by match percentage — know why you fit, what skills to polish, and apply with pre-verified credentials.',
    mock: 'intern',
  },
]

const ForStudents = () => {
  const [targetRole, setTargetRole] = useState('Full-Stack AI Developer')
  const [skillProgress, setSkillProgress] = useState(68)

  return (
    <div className="bg-background min-h-screen">
      {/* Hero with @2xl, @3xl, @5xl responsive container patterns */}
      <section className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16 @5xl:py-20">
          <div className="grid grid-cols-1 @5xl:grid-cols-12 gap-8 @5xl:gap-12 items-center">
            {/* Left Content */}
            <div className="@5xl:col-span-6 flex flex-col items-center @5xl:items-start text-center @5xl:text-left space-y-4">
              <Badge variant="default" className="px-3 py-1">For Students & Job Seekers</Badge>
              
              <h1 className="text-3xl @2xl:text-4xl @5xl:text-5xl font-extrabold tracking-tight text-charcoal leading-[1.2]">
                Your personal <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">AI career co-pilot</span>
              </h1>

              <p className="text-base @2xl:text-lg text-charcoal/70 leading-relaxed max-w-xl">
                Stop guessing what to learn. CareerSync reveals where you stand today, recommends what to learn next, and connects you directly to high-match roles.
              </p>

              <div className="flex flex-wrap items-center justify-center @5xl:justify-start gap-3 pt-2">
                <Link to="/register">
                  <Button size="lg" icon="arrow_forward">
                    Start Free Assessment
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg">
                    Browse Courses
                  </Button>
                </Link>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center @5xl:justify-start gap-4 text-xs @2xl:text-sm text-charcoal/70 border-t border-border/70 w-full">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Trusted by 120+ Campuses
                </span>
                <span>•</span>
                <span className="font-medium">4.9/5 Learner Rating</span>
              </div>
            </div>

            {/* Right Interactive Mock Widget */}
            <div className="@5xl:col-span-6 relative">
              <Card className="p-5 @2xl:p-6 shadow-xl border border-border bg-white rounded-2xl">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-2 text-xs font-mono text-charcoal/60">careersync.ai — Student Copilot</span>
                  </div>
                  <Badge variant="success">91% Verified Signal</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-background p-3.5 rounded-xl border border-border">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Target Career Goal</p>
                      <p className="text-base font-bold text-charcoal mt-0.5">{targetRole}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[11px] text-muted font-medium">Role Readiness</div>
                        <div className="text-xl font-black text-primary">{skillProgress}%</div>
                      </div>
                      <button
                        onClick={() => setSkillProgress((prev) => (prev >= 90 ? 68 : prev + 11))}
                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
                      >
                        Simulate Progress
                      </button>
                    </div>
                  </div>

                  <ProgressBar value={skillProgress} size="md" color="bg-primary" showLabel />

                  <div className="grid gap-2">
                    {[
                      { skill: 'React & Front-End Architecture', pct: 88, color: 'bg-primary' },
                      { skill: 'Python & AI Assessment', pct: skillProgress, color: 'bg-emerald-600' },
                      { skill: 'System Design & Docker Labs', pct: 52, color: 'bg-amber-500' },
                    ].map((r) => (
                      <div key={r.skill} className="flex items-center justify-between rounded-xl border border-border/80 bg-white p-3 text-xs">
                        <span className="font-semibold text-charcoal flex items-center gap-1.5">
                          <AppIcon name="check_circle" className="text-[16px] text-primary" />
                          {r.skill}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-charcoal">{r.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-primary text-white p-3 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <AppIcon name="lightbulb" className="text-[16px]" />
                      Next Action: Complete Docker Microservices Lab
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">Est. 45 min</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of features with @2xl, @3xl, @5xl responsive breakpoints */}
      <section className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16">
        <SectionHeading
          title="Everything You Need to Go from Learning to Placement"
          subtitle="Four core experiences, deeply integrated — not four disjointed tools."
        />

        <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-6 @5xl:gap-8 mt-8">
          {features.map((f) => (
            <Card key={f.title} className="p-6 flex flex-col justify-between border border-border/80 bg-surface hover:shadow-card transition-all">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-soft">
                    <AppIcon name={f.icon} className="text-[22px]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-charcoal">{f.title}</h3>
                    <p className="text-xs text-muted mt-0.5">Automated AI Guidance</p>
                  </div>
                </div>
                <p className="text-xs @2xl:text-sm text-charcoal/70 leading-relaxed mb-4">
                  {f.desc}
                </p>
              </div>

              {/* Dynamic Mock Box */}
              <div className="rounded-xl border border-border bg-background p-4 text-xs">
                {f.mock === 'course' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-charcoal">Recommended Pathway</span>
                      <Badge variant="success">96% Fit</Badge>
                    </div>
                    <p className="text-charcoal/70">Mastering State & Asynchronous AI APIs</p>
                    <div className="flex items-center justify-between text-[11px] text-muted border-t border-border/60 pt-2">
                      <span>Reason: High impact on target role</span>
                      <span className="font-bold text-primary">+14% Readiness</span>
                    </div>
                  </div>
                )}
                {f.mock === 'assess' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-muted">
                      <span>Question 5 of 10</span>
                      <span className="text-primary font-bold">Adaptive • Hard</span>
                    </div>
                    <p className="font-semibold text-charcoal">Optimizing React Re-renders with memo() and useMemo...</p>
                    <div className="p-2 rounded bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-medium">
                      ✓ Correct answer selected (+25 pts)
                    </div>
                  </div>
                )}
                {f.mock === 'roadmap' && (
                  <div className="flex items-center justify-between gap-2">
                    {['Baseline', 'Assessment', 'Lab Practice', 'Matched'].map((st, idx) => (
                      <div key={st} className={`flex-1 text-center p-2 rounded-lg border text-[11px] font-bold ${
                        idx === 2 ? 'bg-primary text-white border-primary' : 'bg-white border-border text-charcoal/70'
                      }`}>
                        {st}
                      </div>
                    ))}
                  </div>
                )}
                {f.mock === 'intern' && (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-charcoal">Frontend AI Developer Intern</p>
                      <p className="text-muted text-[11px]">TechCorp Labs • Stipend ₹25,000/mo</p>
                    </div>
                    <Badge variant="success">94% Match</Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 pb-16 @2xl:pb-20">
        <div className="rounded-3xl bg-primary p-8 @2xl:p-12 text-center text-white space-y-4 shadow-xl">
          <h3 className="text-2xl @2xl:text-3xl font-extrabold text-white">Start your AI career roadmap today</h3>
          <p className="max-w-2xl mx-auto text-sm @2xl:text-base text-white/80">
            Build your profile in 4 minutes and receive your first instant skill-gap report. Free forever for students.
          </p>
          <div className="pt-2">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary border-white hover:bg-slate-100 font-bold">
                Create Student Account Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ForStudents
