import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar, ProgressRing } from '../../components/ui/Progress'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { mockUser, mockSkills, mockCourses, mockInternships, streakData } from '../../utils/mockData'

const gapSkills = [
  { name: 'Docker', yours: 42, required: 65, gap: 23, priority: 'Critical' },
  { name: 'Testing', yours: 38, required: 60, gap: 22, priority: 'Critical' },
  { name: 'AWS Basics', yours: 32, required: 55, gap: 23, priority: 'High' },
  { name: 'System Design', yours: 40, required: 60, gap: 20, priority: 'High' },
]

const recommendedCourses = [
  { id: 'c3', title: 'Docker & DevOps Essentials', skill: 'Docker', difficulty: 'Beginner', duration: '10h 45m', rating: 4.6, reason: 'Recommended because Docker is one of your biggest skill gaps.' },
  { id: 'c4', title: 'Testing with Jest & RTL', skill: 'Testing', difficulty: 'Intermediate', duration: '8h 20m', rating: 4.5, reason: 'Fill your testing gap — critical for Full Stack roles.' },
  { id: 'c6', title: 'TypeScript for React Devs', skill: 'TypeScript', difficulty: 'Intermediate', duration: '9h 15m', rating: 4.9, reason: 'TypeScript required in 70% of matching jobs.' },
]

const recentActivity = [
  { id: 1, text: 'Completed React quiz — scored 8/10', time: '2h ago', icon: 'quiz', color: 'bg-success' },
  { id: 2, text: 'Finished lesson: Hooks Deep Dive', time: '5h ago', icon: 'play_circle', color: 'bg-primary' },
  { id: 3, text: 'Improved Docker score +6% (assessment)', time: '1 day ago', icon: 'trending_up', color: 'bg-accent' },
  { id: 4, text: 'Applied to Flipkart — Frontend Intern', time: '1 day ago', icon: 'assignment', color: 'bg-primary' },
  { id: 5, text: 'Earned certificate: Git & GitHub', time: '2 days ago', icon: 'workspace_premium', color: 'bg-success' },
  { id: 6, text: 'Started Docker & DevOps Essentials', time: '3 days ago', icon: 'school', color: 'bg-charcoal' },
]

export default function Dashboard() {
  const topSkills = mockSkills.filter((s) => ['Git & GitHub', 'JavaScript', 'React', 'MongoDB', 'Node.js'].includes(s.name))

  return (
    <div className="space-y-6">
      {/* Header — §3 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <img src={mockUser.avatar} alt="" className="h-12 w-12 rounded-full border-2 border-white shadow-subtle" />
          <div>
            <h1 className="text-2xl font-bold text-charcoal sm:text-[28px]">Good evening, {mockUser.firstName} 👋</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Career Goal:</span>
              <Badge icon="flag" variant="default">{mockUser.careerGoal}</Badge>
              <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Profile 87% complete
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/student/notifications" className="relative rounded-xl border border-border bg-white p-2.5 text-charcoal hover:bg-background">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">3</span>
          </Link>
          <Link to="/student/ai-assistant" className="rounded-xl bg-primary p-2.5 text-white hover:bg-primary-dark" title="AI Assistant">
            <span className="material-symbols-outlined">smart_toy</span>
          </Link>
          <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-sage text-primary sm:flex">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">87% Complete</p>
            <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-border">
              <div className="h-full bg-primary" style={{ width: '87%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Summary §3 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="flex flex-col items-center text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Career Readiness</p>
          <div className="mt-3">
            <ProgressRing value={82} size={96} strokeWidth={8} />
          </div>
          <p className="mt-2 flex items-center justify-center gap-1 text-xs font-bold text-success">
            <span className="material-symbols-outlined text-[14px]">trending_up</span> +8% this month
          </p>
          <ProgressBar value={82} size="sm" className="mt-2 w-full" barClassName="bg-primary" />
          <p className="mt-1 text-[11px] text-muted">Target 85% for top internships</p>
        </Card>
        <StatCard label="Learning Streak" value="12 Days" icon="local_fire_department" trend={2} trendLabel="this week" />
        <StatCard label="Courses in Progress" value="4" icon="menu_book" trend={1} trendLabel="active" />
        <StatCard label="Internship Matches" value="8" icon="work" trend={3} trendLabel="new matches" />
      </div>

      {/* Skill Snapshot + Gaps + AI Insight */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-charcoal">My Skill Snapshot</h3>
            <Link to="/student/skills" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <p className="mt-1 text-xs text-muted">Technical • Tools • Frameworks</p>
          <div className="mt-5 space-y-4">
            {topSkills.map((s) => (
              <div key={s.id}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">{s.name}</span>
                  <span className="text-xs font-bold tabular-nums text-charcoal">{s.level}%</span>
                </div>
                <ProgressBar value={s.level} size="sm" barClassName={s.level >= 80 ? 'bg-success' : 'bg-primary'} />
              </div>
            ))}
          </div>
          <Link to="/student/assessment" className="mt-5 block">
            <Button variant="outline" size="sm" className="w-full">Take Assessment</Button>
          </Link>
        </Card>

        <Card className="lg:col-span-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-danger">warning</span>
            <h3 className="text-base font-bold text-charcoal">Biggest Skill Gaps</h3>
            <Badge variant="default" className="ml-auto !bg-danger !text-white">4 critical</Badge>
          </div>
          <p className="mt-1 text-xs text-muted">Closest to blocking your goal</p>
          <div className="mt-4 space-y-4">
            {gapSkills.slice(0, 3).map((g) => (
              <div key={g.name} className="rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-charcoal">{g.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${g.priority === 'Critical' ? 'bg-danger text-white' : 'bg-amber-100 text-amber-800'}`}>{g.priority}</span>
                </div>
                <p className="mt-1 text-xs text-muted">Your {g.yours}% • Required {g.required}% • Gap {g.gap}%</p>
                <ProgressBar value={g.yours} size="sm" className="mt-2.5" barClassName="bg-danger" />
                <Button size="sm" variant="secondary" className="mt-3 w-full">Improve Skill</Button>
              </div>
            ))}
          </div>
          <Link to="/student/skill-gap" className="mt-4 block text-center text-sm font-semibold text-primary hover:underline">View full gap analysis →</Link>
        </Card>

        <Card className="lg:col-span-4 !bg-sage !border-sage">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-border text-primary shrink-0">
              <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-charcoal">AI Career Insight</h3>
              <p className="text-xs text-muted">Powered by SkillBridge AI</p>
            </div>
            <Badge variant="success" className="!bg-white !text-primary border border-border">82% READY</Badge>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
            Your frontend is <strong>strong</strong>. Improving <strong>testing & Docker</strong> can increase your match rate by <strong>~22%</strong>.
          </p>
          <div className="mt-3 rounded-xl bg-white border border-border p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Recommended next</p>
            <p className="mt-1 text-sm font-semibold text-charcoal">Docker for Developers • 10h • Beginner</p>
            <p className="text-xs text-muted">Expected impact: +12% readiness → 94% match unlock</p>
          </div>
          <Link to="/student/roadmap" className="mt-4 block">
            <Button className="w-full">View Recommended Path →</Button>
          </Link>
        </Card>
      </div>

      {/* Continue Learning §7 */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-charcoal">Continue Learning</h3>
            <p className="text-sm text-muted">Pick up where you left off</p>
          </div>
          <Link to="/student/my-learning" className="text-sm font-semibold text-primary hover:underline">Go to My Learning →</Link>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockCourses.filter((c) => c.progress > 0 && c.progress < 100).slice(0, 3).map((c) => (
            <div key={c.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white hover:shadow-card transition-all">
              <div className="relative h-32 overflow-hidden bg-background">
                <img src={c.thumbnail} alt="" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-white">{c.progress}%</span>
                <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-charcoal border border-border">{c.difficulty}</span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-sm font-bold leading-tight text-charcoal">{c.title}</p>
                <p className="mt-1 text-xs text-muted">{c.instructor}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <span className="material-symbols-outlined text-[14px]">play_circle</span> Next: {c.id === 'c1' ? 'Hooks Deep Dive • 10m left' : c.duration} 
                </p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-muted"><span>Progress</span><span className="font-bold text-charcoal">{c.progress}%</span></div>
                  <ProgressBar value={c.progress} size="sm" className="mt-1" barClassName="bg-primary" />
                  <p className="mt-1 text-xs text-muted">~{Math.round((100 - c.progress) * 0.4)}m left • {c.lessons ?? 24} lessons</p>
                </div>
                <Link to={`/student/course/${c.id}`} className="mt-4">
                  <Button size="sm" className="w-full">Continue Learning</Button>
                </Link>
              </div>
            </div>
          ))}
          {mockCourses.filter((c) => c.progress > 0 && c.progress < 100).length === 0 && (
            <p className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">No courses in progress — explore courses to start.</p>
          )}
        </div>
      </Card>

      {/* Recommended For You §8 + Top Internship Matches §9 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-charcoal">Recommended For You</h3>
              <p className="text-xs text-muted">AI-powered • based on your gaps</p>
            </div>
            <Badge variant="default">AI</Badge>
          </div>
          <div className="mt-4 space-y-4">
            {recommendedCourses.map((rc) => (
              <div key={rc.id} className="rounded-2xl border border-border p-4 hover:bg-background">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-sm shrink-0">{rc.skill[0]}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-charcoal leading-tight">{rc.title}</p>
                    <p className="mt-0.5 flex flex-wrap gap-2 text-xs text-muted">
                      <span>{rc.skill}</span> <span>•</span> <span>{rc.difficulty}</span> <span>•</span> <span>{rc.duration}</span> <span>•</span> <span>★ {rc.rating}</span>
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-muted"><span className="font-semibold text-charcoal">Why recommended:</span> {rc.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/student/learning" className="mt-4 block text-center text-sm font-semibold text-primary hover:underline">Browse all courses →</Link>
        </Card>

        <Card className="!p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h3 className="font-bold text-charcoal">Top Internship Matches</h3>
              <p className="text-xs text-muted">Verified companies • personalized match</p>
            </div>
            <Link to="/student/internships" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
          </div>
          <div className="space-y-0 divide-y divide-border">
            {mockInternships.slice(0, 3).map((job) => (
              <div key={job.id} className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-lg shrink-0">{job.logo}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-charcoal">{job.company}</p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-bold text-success"><span className="material-symbols-outlined text-[12px]">verified</span> Verified</span>
                      <span className="ml-auto rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white">{job.match}% Match</span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-charcoal">{job.role}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {job.skills.map((s) => <span key={s} className="rounded-full bg-sage px-2 py-0.5 text-[11px] font-medium text-primary">{s} ✓</span>)}
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-700">Docker ⚠ gap</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{job.location}</span>
                      <span>•</span><span>{job.duration || '3 Months'}</span>
                      <span>•</span><span>{job.stipend || '₹25k/month'}</span>
                      <span>•</span><span className="text-danger">Apply by Jan 15</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link to={`/student/internship/${job.id}`} className="flex-1"><Button size="sm" variant="outline" className="w-full">View Details</Button></Link>
                      <Link to={`/student/internship/${job.id}`} className="flex-1"><Button size="sm" className="w-full">Apply</Button></Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom: Recent Activity §10 + Streak/Chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-charcoal">Recent Activity</h3>
            <Link to="/student/notifications" className="text-sm font-semibold text-primary">View all</Link>
          </div>
          <div className="relative mt-5 pl-6">
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
            <div className="space-y-5">
              {recentActivity.map((a) => (
                <div key={a.id} className="relative flex gap-3">
                  <div className={`absolute -left-[21px] flex h-6 w-6 items-center justify-center rounded-full ${a.color} text-white`}>
                    <span className="material-symbols-outlined text-[14px]">{a.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-charcoal">{a.text}</p>
                    <p className="text-xs text-muted">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-charcoal flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500">local_fire_department</span> Learning Streak
            </h3>
            <div className="mt-4 flex items-center justify-between">
              {streakData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold ${d.done ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted'}`}>
                    {d.done ? '✓' : '—'}
                  </div>
                  <span className="text-[11px] font-medium text-muted">{d.day}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-center text-xs font-bold text-primary">12 days — longest 28 🔥</p>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div className="h-full w-[60%] bg-gradient-to-r from-accent to-primary" />
            </div>
            <p className="mt-1 text-center text-xs text-muted">3.2h this week • 18h total</p>
          </Card>
          <ChartCard title="Weekly Learning Activity" subtitle="Hours — last 7 days" height={160} placeholder />
        </div>
      </div>
    </div>
  )
}
