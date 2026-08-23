import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { mockSkillGap } from '../../utils/mockData'

function ComparisonBar({ item }) {
  const pct = Math.min(100, item.yours)
  const reqPct = item.required
  const color = item.status === 'strong' ? 'bg-success' : item.status === 'improve' ? 'bg-warning' : 'bg-danger'
  const badge =
    item.status === 'strong' ? 'bg-success/10 text-success border-success/20' :
    item.status === 'improve' ? 'bg-warning/10 text-warning border-warning/20' :
    'bg-danger/10 text-danger border-danger/20'
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal">{item.skill}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${badge}`}>
          {item.status === 'strong' ? 'Strong' : item.status === 'improve' ? 'Improve' : 'Critical'}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="w-14 text-xs text-muted">You</span>
          <div className="flex-1">
            <ProgressBar value={item.yours} size="sm" barClassName={color} />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums">{item.yours}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-14 text-xs text-muted">Industry</span>
          <div className="flex-1">
            <ProgressBar value={item.required} size="sm" barClassName="bg-charcoal/30" />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums text-muted">{item.required}%</span>
        </div>
      </div>
      {item.status !== 'strong' && (
        <p className="text-xs text-muted">Gap: <span className="font-bold text-danger">{item.required - item.yours}%</span> to reach industry benchmark</p>
      )}
    </div>
  )
}

export default function SkillGap() {
  const strong = mockSkillGap.filter((s) => s.status === 'strong')
  const improve = mockSkillGap.filter((s) => s.status === 'improve')
  const critical = mockSkillGap.filter((s) => s.status === 'critical')

  const gapCard = (list) => list.map((g) => (
    <div key={g.skill} className="rounded-xl border border-border bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-charcoal">{g.skill}</h4>
        <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">Gap {g.required - g.yours}%</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-background border border-border py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Current</p>
          <p className="text-sm font-bold text-charcoal">{g.yours}%</p>
        </div>
        <div className="rounded-lg bg-background border border-border py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Required</p>
          <p className="text-sm font-bold text-charcoal">{g.required}%</p>
        </div>
        <div className="rounded-lg bg-danger/10 border border-danger/20 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-danger">Missing</p>
          <p className="text-sm font-bold text-danger">{g.required - g.yours}%</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Link to="/student/learning" className="flex-1"><Button variant="primary" size="sm" className="w-full">Take Course →</Button></Link>
        <Link to="/student/ai-practice"><Button variant="outline" size="sm">Practice</Button></Link>
      </div>
      <p className="mt-2 text-xs text-muted">Recommended: <span className="font-medium text-primary">{g.skill === 'Docker' ? 'Docker & DevOps Essentials' : g.skill.includes('Testing') ? 'Testing with Jest & RTL' : g.skill.includes('AWS') ? 'Docker & DevOps Essentials' : 'Full Stack Capstone'}</span></p>
    </div>
  ))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Gap Analysis"
        subtitle="Full Stack Developer — see how you compare to industry expectations and close gaps with AI-recommended learning."
        actions={<Badge variant="default">Career Goal — Full Stack Developer</Badge>}
      />

      <Card className="!bg-sage !border-sage">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-charcoal">Your Readiness — 82%</h3>
            <p className="text-sm text-charcoal/70">You’re 3% away from the 85% internship threshold. Focus on Critical Gaps below.</p>
          </div>
          <Link to="/student/roadmap"><Button>View Roadmap →</Button></Link>
        </div>
        <div className="mt-4">
          <ProgressBar value={82} size="lg" barClassName="bg-primary" />
          <div className="mt-1.5 flex justify-between text-xs text-muted"><span>0%</span><span>85% target</span><span>100%</span></div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-charcoal">You vs Industry Benchmark</h3>
        <p className="text-xs text-muted">Green = Strong · Amber = Needs Improvement · Red = Critical Gap</p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockSkillGap.map((item) => (
            <ComparisonBar key={item.skill} item={item} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h3 className="font-bold text-charcoal flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Strong Skills ({strong.length})</h3>
          <p className="text-xs text-muted">At or above industry level — keep sharp with practice.</p>
          <div className="mt-4 space-y-2">
            {strong.map((s) => (
              <div key={s.skill} className="flex items-center justify-between rounded-xl border border-success/20 bg-success/5 px-3 py-2">
                <span className="text-sm font-medium text-charcoal">{s.skill}</span>
                <span className="text-xs font-bold text-success">{s.yours}% ✓</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-charcoal flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-warning" /> Skills to Improve ({improve.length})</h3>
          <p className="text-xs text-muted">Just below benchmark — short courses will close the gap.</p>
          <div className="mt-4 space-y-3">
            {improve.map((s) => (
              <div key={s.skill} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between"><span className="text-sm font-medium text-charcoal">{s.skill}</span><span className="text-xs font-bold text-warning">Gap {s.required - s.yours}%</span></div>
                <ProgressBar value={s.yours} size="sm" barClassName="bg-warning" className="mt-2" />
                <Link to="/student/learning" className="mt-2 inline-flex text-xs font-semibold text-primary hover:underline">Recommended course →</Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="!border-danger/20">
          <h3 className="font-bold text-danger flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-danger" /> Critical Gaps ({critical.length})</h3>
          <p className="text-xs text-muted">Biggest blocker for internships — prioritize these.</p>
          <div className="mt-4 space-y-3">
            {gapCard(critical)}
          </div>
        </Card>
      </div>
    </div>
  )
}
