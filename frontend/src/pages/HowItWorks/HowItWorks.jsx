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
    title: 'Set Career Goal & Profile',
    icon: 'flag',
    shortDesc: 'Choose your target industry role and build your academic & technical profile.',
    desc: 'Select your target career goal (e.g. Full-Stack Web Developer, Python Backend Engineer, or Cloud DevOps). CareerSync benchmarks your education, university department, and existing skills against live hiring market taxonomies.',
    bullets: ['Target role selection & benchmarking', 'Academic & department alignment', 'Initial technical skill ontology mapping'],
    color: 'bg-primary/10 text-primary border-primary/20',
    outcome: 'Defined Career Goal & Baseline',
    tools: ['Career Goal Selector', 'Skill Ontology Engine', 'Academic Profile Sync'],
    timeCommitment: '3–5 mins',
    stakeholderViews: {
      students: 'Set your dream career role and map your current academic coursework directly to industry expectations.',
      industry: 'Candidates enter standardized target roles and verified technical skills rather than generic resume buzzwords.',
      institute: 'Students build profiles mapped to university departments and academic curriculum benchmarks.',
    },
  },
  {
    n: '02',
    title: 'Take Skill Assessments',
    icon: 'quiz',
    shortDesc: 'Complete adaptive technical assessments to establish verified proficiency scores.',
    desc: 'Take timed, scenario-based evaluations across key engineering competencies like React, Python, Django, Java DSA, Docker, and PostgreSQL. Test your real problem solving with immediate scoring.',
    bullets: ['Adaptive technical MCQs & code tests', 'Instant scoring & accuracy breakdown', 'Verified skill level badges (Beginner to Advanced)'],
    color: 'bg-accent/10 text-accent border-accent/20',
    outcome: 'Verified Proficiency Score (0–100%)',
    tools: ['Assessment Engine', 'Topic-wise Question Banks', 'Automated Score Evaluator'],
    timeCommitment: '15–20 mins per skill',
    stakeholderViews: {
      students: 'Get honest, objective proof of your technical capabilities with instant score breakdowns and percentile feedback.',
      industry: 'Filter candidates by verified assessment scores and problem-solving benchmarks instead of college pedigree.',
      institute: 'Benchmark department-wide student aptitude against state and national university placement standards.',
    },
  },
  {
    n: '03',
    title: 'Analyze Skill Gaps',
    icon: 'troubleshoot',
    shortDesc: 'Visualize exact skill gaps between your current level and target role benchmarks.',
    desc: 'Compare your verified assessment scores with real-time job market requirements. CareerSync calculates your role readiness percentage and highlights the critical 2–3 missing skills needed to get hired.',
    bullets: ['Target Role Fit Score (e.g. 64% Ready)', 'Interactive Skill Gap Heatmap', 'High-priority vs Secondary gap breakdown'],
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    outcome: 'Prioritized Gap Resolution Matrix',
    tools: ['Skill Gap Analysis Engine', 'Role Benchmark Matrix', 'Deficiency Visualizer'],
    timeCommitment: 'Instant analysis',
    stakeholderViews: {
      students: 'Know exactly which skills are keeping you from landing top offers and get a clear roadmap to close them.',
      industry: 'Identify cohort-level skill deficiencies before opening entry-level campus recruitment drives.',
      institute: 'Expose curriculum gaps between classroom syllabus and modern corporate hiring demands.',
    },
  },
  {
    n: '04',
    title: 'Learn via Video LMS',
    icon: 'play_circle',
    shortDesc: 'Watch curated YouTube lectures, complete modules, and earn verified university certificates.',
    desc: 'Access institutional upskilling courses with our dual-screen YouTube LMS (Left Video Stream + Right Playlist Sidebar). Track lesson completion, review instructor code notes, and unlock verifiable university course certificates.',
    bullets: ['Left Video + Right Playlist LMS player', 'Structured modules & progress tracking', 'Verifiable University Certificates (CS-AKU-XXXX)'],
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    outcome: 'Closed Gaps & Verified Certificate',
    tools: ['Interactive Video Player', 'Institutional Curriculum Hub', 'Certificate Generator'],
    timeCommitment: '2–4 hrs / week',
    stakeholderViews: {
      students: 'Learn from focused institutional video lectures and earn verifiable certificates that prove your upskilling.',
      industry: 'Review verified course completion records and hands-on capstone projects completed by applicants.',
      institute: 'Publish official university video courses, track student watch progress, and issue digital certificates.',
    },
  },
  {
    n: '05',
    title: 'AI Match & 1-Click Placement',
    icon: 'work',
    shortDesc: 'Get matched with verified internships and corporate jobs with 1-click direct apply.',
    desc: 'Bypass the traditional resume black hole. CareerSync matches your verified skills and assessment scores directly with openings from top hiring partners (Flipkart, Razorpay, Zomato, Swiggy, and Google).',
    bullets: ['AI Match Fit percentage (e.g. 94% Match)', '1-Click instant application pipeline', 'Live status tracker (Applied, Shortlisted, Interview)'],
    color: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    outcome: 'Pre-Screened Job Placement',
    tools: ['AI Job Matching Engine', '1-Click Application Tracker', 'Placement Management Portal'],
    timeCommitment: 'Instant connection',
    stakeholderViews: {
      students: 'Apply to top internships and full-time roles where your pre-screened assessment scores rank you in the top 10%.',
      industry: 'Receive pre-qualified candidate shortlists with verified assessment results and skill fit metrics.',
      institute: 'Track university campus placement conversion rates and company hiring records in real time.',
    },
  },
]

const simulatorSteps = [
  {
    stepIndex: 0,
    title: 'Goal & Profile Set',
    score: 40,
    badge: 'Baseline Setup',
    gapCount: 5,
    matches: 2,
    activeSkill: 'Target: Full-Stack Web Developer',
    insight: 'Profile initialized! Target role set to Full-Stack Developer. 5 critical technical gaps identified.',
    logs: ['Registered with AKU University department', 'Selected target career: Full-Stack Web Developer', 'Baseline readiness calculated: 40%'],
  },
  {
    stepIndex: 1,
    title: 'Assessment Complete',
    score: 62,
    badge: 'Verified Level 2',
    gapCount: 3,
    matches: 6,
    activeSkill: 'React.js & Python Basics',
    insight: 'Passed React 19 & Python assessments! Scored 84% on Component State & REST fundamentals.',
    logs: ['Completed React assessment (15 questions, 84% score)', 'Completed Python test (12 questions, 78% score)', 'Readiness score updated to 62%'],
  },
  {
    stepIndex: 2,
    title: 'Skill Gaps Analyzed',
    score: 74,
    badge: 'Gap Matrix Active',
    gapCount: 2,
    matches: 11,
    activeSkill: 'Django Backend & Docker',
    insight: 'Skill Gap Matrix prioritized 2 key missing competencies: Django ORM APIs and Docker Containerization.',
    logs: ['Benchmarked against 350+ corporate job requirements', 'Identified primary gap: Django REST Framework', 'Generated recommended course pathway'],
  },
  {
    stepIndex: 3,
    title: 'Course LMS & Certificate',
    score: 88,
    badge: 'Certified Scholar',
    gapCount: 1,
    matches: 18,
    activeSkill: 'Django & Docker Completed',
    insight: 'Finished AKU Video Course series and earned Verified Certificate CS-AKU-98A1B02C!',
    logs: ['Completed all 4 modules on Video LMS Player', 'Unlocked verified University Certificate', 'Readiness score boosted to 88%'],
  },
  {
    stepIndex: 4,
    title: 'Matched & Shortlisted',
    score: 96,
    badge: 'Interview Ready',
    gapCount: 0,
    matches: 26,
    activeSkill: 'Flipkart & Razorpay Match',
    insight: '96% AI Match Fit! Shortlisted for Software Engineer Intern at Flipkart & Razorpay.',
    logs: ['Profile pushed to corporate recruiter portal', '1-Click application submitted to 3 openings', 'Received 2 technical interview calls'],
  },
]

const rolePerspectives = [
  {
    id: 'students',
    label: 'For Students',
    icon: 'school',
    tagline: 'Stop applying blindly. Know your exact skill readiness score before you apply.',
    benefits: [
      { title: 'Goal-Driven Roadmap', desc: 'Select your target career role and focus only on the high-yield technical skills employers demand.' },
      { title: 'Verified Proof of Skill', desc: 'Replace unverified resume claims with objective assessment scores and university course certificates.' },
      { title: 'Direct Corporate Placements', desc: 'Get surfaced directly to top tech recruiters based on pre-screened assessment fit without ATS filters.' },
    ],
  },
  {
    id: 'institute',
    label: 'For Institutions (AKU & Colleges)',
    icon: 'account_balance',
    tagline: 'Empower student cohorts and bridge academic syllabus with live corporate demand.',
    benefits: [
      { title: 'Live Placement Analytics', desc: 'Track department-wise student role readiness, skill scores, and active placement pipeline in real time.' },
      { title: 'Curriculum Gap Insights', desc: 'Compare campus syllabus against corporate hiring requirements to update electives and bridge workshops.' },
      { title: 'Publish University LMS Courses', desc: 'Publish faculty video courses, monitor student watch hours, and issue verified institutional certificates.' },
    ],
  },
  {
    id: 'industry',
    label: 'For Hiring Employers',
    icon: 'apartment',
    tagline: 'Hire pre-assessed, interview-ready campus talent based on verified skill benchmarks.',
    benefits: [
      { title: 'Zero Resume Screening Noise', desc: 'Receive pre-qualified candidate shortlists evaluated on realistic coding and scenario-based assessments.' },
      { title: '70% Faster Hiring Cycle', desc: 'Skip initial phone screens by reviewing verified technical scores and capstone project performance.' },
      { title: 'Custom Skill Benchmarks', desc: 'Define your company skill requirements and let CareerSync auto-match matching university talent.' },
    ],
  },
]

const faqs = [
  {
    q: 'How does CareerSync calculate my Skill Gap Score?',
    a: 'CareerSync compares your verified assessment results against the benchmark requirements of your target career role (e.g. Full-Stack Developer, AI Engineer) to calculate your exact readiness percentage and missing skills.',
  },
  {
    q: 'How does the YouTube Video Course Player work?',
    a: 'Courses feature our dual-screen LMS layout with YouTube streaming on the left and full curriculum playlist on the right. Students watch structured lectures, track completed lessons, and earn a verified university certificate upon 100% completion.',
  },
  {
    q: 'Are course certificates verifiable by employers?',
    a: 'Yes! Every certificate issued upon course completion includes a unique tamper-proof ID (e.g. CS-AKU-98A1B02C) that recruiters and universities can instantly verify on the CareerSync platform.',
  },
  {
    q: 'How does 1-Click Job & Internship application work?',
    a: 'When you apply to jobs on CareerSync, your verified profile, skill assessment scores, and certificates are automatically packaged and delivered directly to recruiter dashboards with your calculated AI Match Fit percentage.',
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
    <div className="@container bg-background min-h-screen">
      {/* 1. Hero Section with @container, @2xl, @3xl, @5xl responsive pattern */}
      <section className="bg-surface border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-0" />

        <div className="px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16 @5xl:py-20 relative z-10">
          <div className="text-center flex flex-col items-center max-w-4xl mx-auto">
            <Badge variant="accent" className="mb-3 px-3 py-1 text-xs @2xl:text-sm">
              <AppIcon name="auto_awesome" className="text-[14px] mr-1.5 inline-block" />
              The CareerSync Ecosystem
            </Badge>

            <h1 className="text-3xl @2xl:text-4xl @5xl:text-5xl font-extrabold tracking-tight text-charcoal leading-[1.2]">
              From skill assessment to corporate placement —{' '}
              <span className="text-primary bg-gradient-to-r from-primary via-emerald-600 to-teal-700 bg-clip-text text-transparent">
                in 5 simple steps
              </span>
            </h1>

            <p className="mt-4 text-base @2xl:text-lg @5xl:text-xl text-charcoal/70 leading-relaxed max-w-3xl">
              CareerSync bridges the college-to-corporate divide: assess technical aptitude, pinpoint exact skill gaps, upskill with certified video courses, and match with verified jobs.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 @2xl:grid-cols-4 gap-3 @2xl:gap-4 w-full bg-background border border-border/80 rounded-2xl p-3 @2xl:p-4 text-center shadow-subtle">
              <div>
                <div className="text-xl @2xl:text-2xl font-black text-primary">5 Steps</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Clear Flywheel</div>
              </div>
              <div className="border-l border-border/60">
                <div className="text-xl @2xl:text-2xl font-black text-primary">Adaptive</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Skill Testing</div>
              </div>
              <div className="border-l border-border/60">
                <div className="text-xl @2xl:text-2xl font-black text-primary">Video LMS</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Verified Certificates</div>
              </div>
              <div className="border-l border-border/60">
                <div className="text-xl @2xl:text-2xl font-black text-primary">1-Click</div>
                <div className="text-[11px] @2xl:text-xs text-charcoal/60 font-medium">Direct Placement</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button size="lg" icon="arrow_forward" className="shadow-md shadow-primary/15">
                  Get Started Free
                </Button>
              </Link>
              <a href="#interactive-simulator">
                <Button variant="outline" size="lg" icon="play_circle">
                  Test Live Simulator
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Steps Section with @2xl, @3xl, @5xl responsive grid */}
      <section className="px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16">
        <SectionHeading
          title="How the 5-Step Process Works"
          subtitle="Click any step to inspect detailed AI workflows, assessment tools, and sample placement outcomes."
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

      {/* 3. Live Interactive CareerSync AI Loop Simulator with @2xl, @3xl, @5xl grid */}
      <section id="interactive-simulator" className="px-4 @2xl:px-6 @5xl:px-8 py-8 @2xl:py-12">
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
                Click through the 5 steps below to watch a simulated student progress from initial setup to corporate placement.
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
                className={`flex flex-col items-center p-2.5 @2xl:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${i === simIndex
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
                    <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Simulated Candidate</div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      Rahul Sharma <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">{currentSim.badge}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 font-medium">Role Readiness</div>
                  <div className="text-2xl font-black text-emerald-400 tracking-tight">{currentSim.score}%</div>
                </div>
              </div>

              {/* Seamless Neon Glow Progress Bar (No Cream Background or Harsh Borders) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Target Role: Full-Stack Web Developer</span>
                  <span className="text-emerald-400 font-bold tracking-wide">{currentSim.score}% Matched</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800/80 overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_14px_rgba(16,185,129,0.6)] transition-all duration-700 ease-out"
                    style={{ width: `${currentSim.score}%` }}
                  />
                </div>
              </div>

              {/* Dynamic Stats Row */}
              <div className="grid grid-cols-3 gap-3 text-center pt-1">
                <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Skill Gaps</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">{currentSim.gapCount} Remaining</div>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Matching Jobs</div>
                  <div className="text-lg font-bold text-teal-400 mt-1">{currentSim.matches} Roles</div>
                </div>
                <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800/60 hover:border-slate-700 transition-all">
                  <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Current Focus</div>
                  <div className="text-xs font-bold text-emerald-300 mt-1 line-clamp-1">{currentSim.activeSkill}</div>
                </div>
              </div>

              {/* Event Log Output */}
              <div className="bg-slate-900 rounded-xl p-4 border border-slate-800/80 space-y-2">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>CareerSync Core Engine Trace</span>
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
                  Step {simIndex + 1} Workflow Insight
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
      <section className="px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16">
        <SectionHeading
          title="Tailored Value for Every Stakeholder"
          subtitle="CareerSync creates a win-win ecosystem uniting students, academic institutions, and corporate employers."
        />

        {/* Role Tabs Switcher */}
        <div className="flex justify-center mt-6">
          <div className="inline-flex p-1.5 rounded-2xl bg-surface border border-border shadow-subtle gap-2">
            {rolePerspectives.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs @2xl:text-sm font-bold transition-all duration-200 cursor-pointer ${activeRole === r.id
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
      <section className="px-4 @2xl:px-6 @5xl:px-8 py-12 @2xl:py-16 border-t border-border/70">
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
      <section className="px-4 @2xl:px-6 @5xl:px-8 pb-16 @2xl:pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-charcoal via-slate-900 to-charcoal p-6 @2xl:p-10 @5xl:p-14 text-white flex flex-col @3xl:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl z-10 text-center @3xl:text-left">
            <Badge variant="accent" className="mb-3 bg-accent text-white border-none">
              Get Started In 4 Minutes
            </Badge>
            <h3 className="text-2xl @2xl:text-3xl @5xl:text-4xl font-extrabold text-white tracking-tight">
              Ready to start your CareerSync journey?
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
              <Button size="lg" variant="outline" className="w-full border-white/40 text-white hover:bg-white/10">
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
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider text-muted mb-2">Tools & Modules Used</h4>
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
