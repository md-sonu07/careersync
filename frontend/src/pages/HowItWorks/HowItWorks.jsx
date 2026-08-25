import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../../components/common/SectionHeading'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import AppIcon from '../../components/ui/AppIcon'
import Modal from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/Progress'

const stepsData = [
  {
    n: '01',
    title: 'Build Profile',
    icon: 'person_add',
    shortDesc: 'Create your comprehensive skill profile from education, projects, and interests.',
    desc: 'CareerSync ingests your background — coursework, GitHub, projects, and certifications. Our AI maps your input against standard industry skill taxonomies to establish your initial baseline.',
    bullets: ['Guided onboarding in 4 minutes', 'Resume parse + manual skill add', 'Skill ontology auto-tagging'],
    color: 'bg-primary/10 text-primary border-primary/20',
    outcome: 'Structured Skill Snapshot',
    tools: ['Resume Parser', 'LinkedIn Importer', 'Skill Taxonomy Engine'],
    timeCommitment: '4–8 mins',
    stakeholderViews: {
      students: 'Input course grades, projects & GitHub to auto-generate a verified skill profile.',
      industry: 'Candidates enter standardized skill tags instead of unverified buzzwords on resumes.',
      institute: 'Students build profiles aligned with institutional department curricula.',
    },
  },
  {
    n: '02',
    title: 'Assess Skills',
    icon: 'quiz',
    shortDesc: 'Take adaptive AI assessments testing real applied understanding and problem solving.',
    desc: 'Move beyond multiple choice. Take adaptive, scenario-based evaluations that measure how you apply concepts to real code, architecture, and case studies.',
    bullets: ['Adaptive difficulty calibration', 'Applied code & scenario evaluation', 'Cryptographically verified skill signals'],
    color: 'bg-accent/10 text-accent border-accent/20',
    outcome: 'Verified Capability Score',
    tools: ['Adaptive Question Engine', 'Code Sandbox Evaluation', 'AI Case Evaluator'],
    timeCommitment: '15–20 mins per skill',
    stakeholderViews: {
      students: 'Get objective proof of your skills with real-time score feedback and level badges.',
      industry: 'Filter applicants based on verified assessment scores rather than brand names.',
      institute: 'Benchmark student performance against national and industry standards.',
    },
  },
  {
    n: '03',
    title: 'Discover Gaps',
    icon: 'radar',
    shortDesc: 'Visualize exact skill gaps against target industry role specifications.',
    desc: 'Compare your verified profile with real-time job market requirements. Identify missing prerequisites, proficiency gaps, and priority learning targets.',
    bullets: ['Target Role Fit Score (0–100%)', 'Interactive Skill Gap Heatmap', 'Priority-ranked learning gaps'],
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    outcome: 'Prioritized Learning Roadmap',
    tools: ['Market Demand Scanner', 'Role Alignment Engine', 'Gap Heatmap Visualizer'],
    timeCommitment: 'Instant analysis',
    stakeholderViews: {
      students: 'Know exactly why you missed out on roles and what 2-3 skills will fix it.',
      industry: 'Identify cohort-wide skill gaps before opening entry-level reqs.',
      institute: 'Expose curriculum gaps against real-time industry job postings.',
    },
  },
  {
    n: '04',
    title: 'Learn & Practice',
    icon: 'school',
    shortDesc: 'Follow personalized roadmaps with curated modules, labs, and review projects.',
    desc: 'Close your top skill gaps first. Access bite-sized learning pathways, interactive code labs, and real-world projects reviewed by AI and peer mentors.',
    bullets: ['Curated micro-courses & hands-on labs', 'Portfolio projects with automated feedback', 'Streak tracking & habit building'],
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    outcome: 'Gap Resolution & Proof',
    tools: ['Personalized Course Engine', 'Interactive Code Labs', 'AI Review Assistant'],
    timeCommitment: '2–5 hrs / week',
    stakeholderViews: {
      students: 'Learn only what moves your role-readiness score, saving dozens of wasted hours.',
      industry: 'Sponsor targeted learning tracks to upskill candidates before hiring.',
      institute: 'Integrate CareerSync pathways into elective courses and capstone projects.',
    },
  },
  {
    n: '05',
    title: 'Match & Apply',
    icon: 'work',
    shortDesc: 'Get matched with verified internships and job opportunities with 1-click apply.',
    desc: 'Skip the black hole of traditional job boards. Get surfaced directly to hiring managers where your verified skill fit matches company requirements.',
    bullets: ['Ranked match feed (e.g. 92% match)', 'One-click direct application', 'Real-time pipeline & status tracking'],
    color: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    outcome: 'Interview-Ready Pipeline',
    tools: ['Matching AI Matrix', '1-Click Application Pipeline', 'Recruiter Dashboard'],
    timeCommitment: 'Ongoing connection',
    stakeholderViews: {
      students: 'Apply to roles where your profile is pre-verified to rank in the top 10%.',
      industry: 'Receive pre-qualified candidate shortlist with instant skill verification.',
      institute: 'Track campus placement success rates with real-time analytics.',
    },
  },
]

const simulatorSteps = [
  {
    stepIndex: 0,
    title: 'Profile Created',
    score: 42,
    badge: 'Baseline',
    gapCount: 6,
    matches: 2,
    activeSkill: 'Python Basics',
    insight: 'Profile built! 6 critical skill gaps identified for Full-Stack AI Developer role.',
    logs: ['Imported transcript & resume', 'Parsed 14 candidate tags', 'Baseline score established: 42%'],
  },
  {
    stepIndex: 1,
    title: 'Assessment Complete',
    score: 64,
    badge: 'Verified Level 2',
    gapCount: 4,
    matches: 5,
    activeSkill: 'React & State Management',
    insight: 'Passed React & REST API adaptive test! Verified top 15% proficiency.',
    logs: ['Completed adaptive test (12/12 questions)', 'Scored 88% on React State', 'Score updated to 64%'],
  },
  {
    stepIndex: 2,
    title: 'Gaps Analyzed',
    score: 75,
    badge: 'Target Focused',
    gapCount: 2,
    matches: 9,
    activeSkill: 'System Design & MLOps',
    insight: 'AI recommended 2 high-impact modules to boost your role readiness by +19%.',
    logs: ['Calculated role fit against 420+ job postings', 'Identified primary gap: MLOps', 'Generated 3-week roadmap'],
  },
  {
    stepIndex: 3,
    title: 'Courses & Labs Done',
    score: 89,
    badge: 'Advanced Ready',
    gapCount: 1,
    matches: 16,
    activeSkill: 'Docker & Microservices',
    insight: 'Completed MLOps Hands-on Lab & Capstone project. Skill gap closed!',
    logs: ['Finished MLOps Docker Lab', 'Submitted project for AI code review', 'Score boosted to 89%'],
  },
  {
    stepIndex: 4,
    title: 'Matched & Interviewing',
    score: 96,
    badge: 'Interview Ready',
    gapCount: 0,
    matches: 24,
    activeSkill: 'Full-Stack AI Lead',
    insight: 'Matched with Top 5% priority candidate signal at TechCorp & Innovate Labs!',
    logs: ['Profile pushed to partner recruiters', 'Received 3 interview invitations', 'Match score: 96%'],
  },
]

const rolePerspectives = [
  {
    id: 'students',
    label: 'For Students',
    icon: 'school',
    tagline: 'Stop applying blindly. Know your exact match score before you submit.',
    benefits: [
      { title: 'Clear Learning Path', desc: 'No more wondering what technology stack to learn next. Focus only on high-yield skills.' },
      { title: 'Verified Proof of Skill', desc: 'Replace unverified resume claims with cryptographically verified assessment badges.' },
      { title: 'Direct Employer Visibility', desc: 'Top candidates get surfaced directly to hiring managers without ATS filters.' },
    ],
  },
  {
    id: 'industry',
    label: 'For Employers',
    icon: 'apartment',
    tagline: 'Hire candidates based on verified capability, not resume buzzwords.',
    benefits: [
      { title: 'Zero Resume Noise', desc: 'Receive pre-screened candidate streams with objective assessment scores.' },
      { title: '70% Faster Hiring Cycle', desc: 'Bypass initial phone screens by reviewing verified project & assessment signals.' },
      { title: 'Custom Skill Taxonomies', desc: 'Define your company custom skill benchmarks and let AI auto-match matching talent.' },
    ],
  },
  {
    id: 'institute',
    label: 'For Institutions',
    icon: 'account_balance',
    tagline: 'Align university curriculum with live industry job market demand.',
    benefits: [
      { title: 'Live Placement Analytics', desc: 'Track student readiness scores across departments and graduation cohorts.' },
      { title: 'Curriculum Gap Insights', desc: 'See real-time industry demand vs campus syllabus data to update electives.' },
      { title: 'Bridge Course Integration', desc: 'Embed CareerSync upskilling modules directly into university coursework.' },
    ],
  },
]

const faqs = [
  {
    q: 'How does CareerSync calculate my Skill Gap Score?',
    a: 'CareerSync aggregates your coursework, assessment results, and verified project code, then compares it against live requirements extracted from thousands of industry job postings daily.',
  },
  {
    q: 'Are the assessments timed or proctored?',
    a: 'Assessments are adaptive and scenario-based. They adjust difficulty dynamically based on your answers and evaluate logic, code structure, and problem solving in real time.',
  },
  {
    q: 'How do employers verify my skill credentials?',
    a: 'When you share your profile or apply to a role, employers view your verified badge breakdown, assessment scores, and project reviews directly on CareerSync.',
  },
  {
    q: 'Is CareerSync free for students and universities?',
    a: 'Yes! Core profile building, skill gap analysis, adaptive assessments, and basic job matching are completely free for students.',
  },
]

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState('students')
  const [simIndex, setSimIndex] = useState(0)
  const [selectedStep, setSelectedStep] = useState(null)
  const [openFaq, setOpenFaq] = useState(null)

  const currentSim = simulatorSteps[simIndex]
  const currentRoleData = rolePerspectives.find((r) => r.id === activeRole)

  return (
    <div className="bg-background min-h-screen">
      {/* 1. Hero Section with @2xl, @3xl, @5xl responsive pattern */}
      <section className="bg-surface border-b border-border relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16 @5xl:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <Badge variant="accent" className="mb-3 px-3 py-1 text-xs @2xl:text-sm">
              <AppIcon name="auto_awesome" className="text-[14px] mr-1.5 inline-block" />
              The CareerSync Engine
            </Badge>

            <h1 className="text-3xl @2xl:text-4xl @5xl:text-5xl font-extrabold tracking-tight text-charcoal leading-[1.2]">
              From skill assessment to job placement —{' '}
              <span className="text-primary bg-gradient-to-r from-primary via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                in 5 simple steps
              </span>
            </h1>

            <p className="mt-4 text-base @2xl:text-lg @5xl:text-xl text-charcoal/70 leading-relaxed max-w-2xl">
              CareerSync turns career ambiguity into a continuous flywheel: evaluate where you stand, close high-impact gaps, and connect to roles that fit your verified capabilities.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 @2xl:grid-cols-4 gap-3 @2xl:gap-4 w-full max-w-2xl bg-background border border-border/80 rounded-2xl p-3 @2xl:p-4 text-center shadow-subtle">
              <div>
                <div className="text-xl @2xl:text-2xl font-black text-primary">5 Steps</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Clear Flywheel</div>
              </div>
              <div className="border-l border-border/60">
                <div className="text-xl @2xl:text-2xl font-black text-primary">94%</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Placement Fit</div>
              </div>
              <div className="border-l border-border/60">
                <div className="text-xl @2xl:text-2xl font-black text-primary">4.2x</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Faster Growth</div>
              </div>
              <div className="border-l border-border/60">
                <div className="text-xl @2xl:text-2xl font-black text-primary">100%</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Verified Signals</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button size="lg" icon="arrow_forward" className="shadow-md shadow-primary/15">
                  Try CareerSync Free
                </Button>
              </Link>
              <a href="#interactive-simulator">
                <Button variant="outline" size="lg" icon="play_circle">
                  Test Interactive Demo
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Steps Section with @2xl, @3xl, @5xl responsive grid */}
      <section className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16">
        <SectionHeading
          title="How the 5-Step Process Works"
          subtitle="Click any step to inspect detailed AI workflows, required tools, and sample outcomes."
        />

        <div className="grid grid-cols-1 @2xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-5 gap-4 @5xl:gap-6 mt-8">
          {stepsData.map((s) => (
            <Card
              key={s.n}
              hover
              onClick={() => setSelectedStep(s)}
              className="relative flex flex-col justify-between p-5 @2xl:p-6 cursor-pointer group transition-all duration-300 border border-border/80 hover:border-primary/40 hover:shadow-card bg-surface"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold tracking-widest text-muted">{s.n}</span>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${s.color}`}>
                    <AppIcon name={s.icon} className="text-[22px]" />
                  </span>
                </div>

                <h3 className="text-base @2xl:text-lg font-bold text-charcoal group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs @2xl:text-sm text-charcoal/70 leading-relaxed">
                  {s.shortDesc}
                </p>

                <ul className="mt-4 space-y-2 border-t border-border/60 pt-3">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-[11px] @2xl:text-xs text-charcoal/80">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                <span className="text-primary font-semibold flex items-center gap-1 group-hover:underline">
                  Deep Dive <AppIcon name="arrow_forward" className="text-[14px]" />
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-background border border-border text-charcoal/60 font-medium">
                  {s.timeCommitment}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Live Interactive CareerSync AI Loop Simulator */}
      <section id="interactive-simulator" className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 py-8 @2xl:py-12">
        <Card className="p-6 @2xl:p-8 @5xl:p-10 border border-border shadow-card bg-surface overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <AppIcon name="sync" className="text-[180px] text-primary" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border/70">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Interactive Simulator
              </div>
              <h2 className="text-xl @2xl:text-2xl @5xl:text-3xl font-bold text-charcoal">
                Experience the CareerSync Flywheel
              </h2>
              <p className="text-xs @2xl:text-sm text-charcoal/70 mt-1">
                Click through the 5 steps below to watch a simulated student profile evolve in real time.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon="refresh"
                onClick={() => setSimIndex(0)}
                disabled={simIndex === 0}
              >
                Reset Demo
              </Button>
              <Button
                size="sm"
                icon="play_arrow"
                onClick={() => setSimIndex((prev) => (prev + 1) % simulatorSteps.length)}
              >
                Next Step ({simIndex + 1}/5)
              </Button>
            </div>
          </div>

          {/* Stepper Navigation Bar */}
          <div className="mt-6 grid grid-cols-5 gap-2 @2xl:gap-3">
            {simulatorSteps.map((st, i) => (
              <button
                key={st.title}
                onClick={() => setSimIndex(i)}
                className={`flex flex-col items-center p-2.5 @2xl:p-3 rounded-xl border text-left transition-all duration-200 ${i === simIndex
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-soft'
                    : i < simIndex
                      ? 'border-emerald-300 bg-emerald-50/50 text-charcoal'
                      : 'border-border bg-background/50 text-muted hover:border-border'
                  }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${i === simIndex ? 'bg-primary text-white' : i < simIndex ? 'bg-emerald-600 text-white' : 'bg-border text-charcoal/60'
                    }`}>
                    0{i + 1}
                  </span>
                  {i < simIndex && <AppIcon name="check_circle" className="text-[14px] text-emerald-600" />}
                </div>
                <span className="text-xs font-bold text-charcoal line-clamp-1 hidden @2xl:block">{st.title}</span>
                <span className="text-[10px] text-charcoal/60 line-clamp-1 @2xl:hidden">{st.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Simulator Main Display Grid */}
          <div className="mt-8 grid grid-cols-1 @5xl:grid-cols-12 gap-6 @5xl:gap-8 items-start">
            {/* Left Column: Simulated Dashboard Widget */}
            <div className="@5xl:col-span-7 bg-slate-950 text-slate-100 rounded-2xl p-5 @2xl:p-6 shadow-xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-emerald-400 font-bold">
                    <AppIcon name="account_circle" className="text-[24px]" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Simulated Learner</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      Alex Rivera <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">{currentSim.badge}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Role Readiness</div>
                  <div className="text-2xl font-black text-emerald-400 tracking-tight">{currentSim.score}%</div>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-300">Target Role: Full-Stack AI Developer</span>
                  <span className="text-emerald-400 font-bold">{currentSim.score}% Matched</span>
                </div>
                <ProgressBar value={currentSim.score} size="md" color="bg-emerald-500" />
              </div>

              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-3 gap-3 text-center pt-1">
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Skill Gaps</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">{currentSim.gapCount} Remaining</div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Matching Job Feed</div>
                  <div className="text-lg font-bold text-teal-400 mt-0.5">{currentSim.matches} Roles</div>
                </div>
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800">
                  <div className="text-xs text-slate-400 font-medium">Focus Area</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1 line-clamp-1">{currentSim.activeSkill}</div>
                </div>
              </div>

              {/* Event Log Output */}
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800/80 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>AI Engine Execution Trace</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <ul className="space-y-1.5 font-mono text-xs text-slate-300">
                  {currentSim.logs.map((log, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">›</span>
                      <span>{log}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Key Takeaway Insight */}
            <div className="@5xl:col-span-5 flex flex-col justify-between h-full space-y-6">
              <Card className="p-6 bg-primary/5 border border-primary/20 rounded-2xl">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                  <AppIcon name="lightbulb" className="text-[20px]" />
                  Step {simIndex + 1} AI Insight
                </div>
                <p className="text-sm text-charcoal font-medium leading-relaxed">
                  "{currentSim.insight}"
                </p>
              </Card>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider text-muted">
                  What happens in Step 0{simIndex + 1}?
                </h4>
                <p className="text-xs @2xl:text-sm text-charcoal/70 leading-relaxed">
                  {stepsData[simIndex].desc}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {stepsData[simIndex].tools.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-border text-xs font-semibold text-charcoal shadow-2xs">
                      <AppIcon name="extension" className="text-[12px] text-primary" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted">Step {simIndex + 1} of 5 completed</span>
                <Button
                  size="sm"
                  variant="secondary"
                  icon="arrow_forward"
                  onClick={() => setSimIndex((prev) => (prev + 1) % simulatorSteps.length)}
                >
                  {simIndex === 4 ? 'Replay Simulator' : 'Advance Simulator'}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 4. Role-Based Stakeholder Perspective Switcher */}
      <section className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16">
        <SectionHeading
          title="Tailored Value for Every Stakeholder"
          subtitle="CareerSync creates a win-win ecosystem where students, employers, and institutions speak the same skill language."
        />

        {/* Role Tabs Switcher */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex p-1.5 rounded-2xl bg-surface border border-border shadow-subtle gap-2">
            {rolePerspectives.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs @2xl:text-sm font-bold transition-all duration-200 ${activeRole === r.id
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-charcoal/70 hover:bg-background hover:text-charcoal'
                  }`}
              >
                <AppIcon name={r.icon} className="text-[18px]" />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Role Content Card */}
        <div className="mt-8">
          <Card className="p-6 @2xl:p-8 @5xl:p-10 border border-border bg-surface shadow-subtle">
            <div className="mb-6 max-w-2xl">
              <Badge variant="default" className="mb-2">Perspective</Badge>
              <h3 className="text-xl @2xl:text-2xl font-bold text-charcoal">{currentRoleData.tagline}</h3>
            </div>

            <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6 @5xl:gap-8">
              {currentRoleData.benefits.map((b, idx) => (
                <div key={b.title} className="p-5 rounded-2xl bg-background border border-border/80 flex flex-col justify-between">
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs mb-3">
                      0{idx + 1}
                    </div>
                    <h4 className="text-base font-bold text-charcoal mb-2">{b.title}</h4>
                    <p className="text-xs @2xl:text-sm text-charcoal/70 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stakeholder Step Matrix */}
            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider text-muted mb-4">
                How the 5 steps benefit {currentRoleData.label}:
              </h4>
              <div className="grid grid-cols-1 @2xl:grid-cols-5 gap-3">
                {stepsData.map((s) => (
                  <div key={s.n} className="p-3 rounded-xl bg-surface border border-border/70 text-xs">
                    <div className="font-bold text-primary mb-1 flex items-center gap-1">
                      <span>{s.n}.</span> {s.title}
                    </div>
                    <p className="text-charcoal/70 text-[11px] leading-tight">
                      {s.stakeholderViews[activeRole]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Frequently Asked Questions Accordion Section */}
      <section className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16 border-t border-border/70">
        <SectionHeading
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about how CareerSync transforms career readiness."
        />

        <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-4 @5xl:gap-6 mt-8 max-w-5xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <Card
                key={faq.q}
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="p-5 cursor-pointer border border-border/80 hover:border-primary/40 transition-all bg-surface"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm @2xl:text-base font-bold text-charcoal flex items-center gap-2">
                    <AppIcon name="help_outline" className="text-[18px] text-primary shrink-0" />
                    {faq.q}
                  </h4>
                  <AppIcon
                    name={isOpen ? 'expand_less' : 'expand_more'}
                    className="text-[20px] text-muted shrink-0 transition-transform"
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 pt-3 border-t border-border/60 text-xs @2xl:text-sm text-charcoal/70 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      </section>

      {/* 6. Call to Action Banner with @2xl, @3xl, @5xl responsive styling */}
      <section className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8 pb-16 @2xl:pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-charcoal via-slate-900 to-charcoal p-6 @2xl:p-10 @5xl:p-14 text-white flex flex-col @3xl:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl z-10 text-center @3xl:text-left">
            <Badge variant="accent" className="mb-3 bg-accent text-white border-none">
              Get Started In 4 Minutes
            </Badge>
            <h3 className="text-2xl @2xl:text-3xl @5xl:text-4xl font-extrabold text-white tracking-tight">
              Ready to start your CareerSync loop?
            </h3>
            <p className="mt-3 text-sm @2xl:text-base text-white/80 leading-relaxed">
              Create your free student profile, take your first adaptive skill assessment, and generate an instant AI role-readiness score.
            </p>
          </div>

          <div className="flex flex-col @2xl:flex-row gap-3 z-10 w-full @3xl:w-auto shrink-0">
            <Link to="/register">
              <Button size="lg" className="w-full bg-white text-charcoal border-white hover:bg-slate-100 font-bold shadow-lg">
                Create Free Account
              </Button>
            </Link>
            <Link to="/courses">
              <Button size="lg" variant="outline" className="w-full border-white/40">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Step Detail Modal */}
      {selectedStep && (
        <Modal
          isOpen={!!selectedStep}
          onClose={() => setSelectedStep(null)}
          title={`Step ${selectedStep.n}: ${selectedStep.title}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5 py-2">
            <div className="flex items-center justify-between bg-background p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${selectedStep.color}`}>
                  <AppIcon name={selectedStep.icon} className="text-[24px]" />
                </span>
                <div>
                  <div className="text-xs font-bold text-muted uppercase tracking-wider">Step Objective</div>
                  <div className="text-sm font-bold text-charcoal">{selectedStep.outcome}</div>
                </div>
              </div>
              <Badge variant="default">{selectedStep.timeCommitment}</Badge>
            </div>

            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider text-muted mb-1.5">Description</h4>
              <p className="text-sm text-charcoal/80 leading-relaxed">{selectedStep.desc}</p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider text-muted mb-2">Key Features</h4>
              <ul className="grid grid-cols-1 @2xl:grid-cols-2 gap-2">
                {selectedStep.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 p-2.5 rounded-lg bg-surface border border-border/80 text-xs text-charcoal">
                    <AppIcon name="check_circle" className="text-[16px] text-primary shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider text-muted mb-2">Tools & AI Engines Used</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStep.tools.map((t) => (
                  <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedStep(null)}>
                Close
              </Button>
              <Link to="/register">
                <Button size="sm" icon="arrow_forward">
                  Start Step {selectedStep.n} Now
                </Button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default HowItWorks
