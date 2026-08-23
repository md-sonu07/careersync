import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { mockRoadmap } from '../../utils/mockData'

const statusStyles = {
  completed: { dot: 'bg-success border-success', badge: 'bg-success text-white', label: 'Completed', icon: '✓' },
  current: { dot: 'bg-primary border-primary animate-pulse', badge: 'bg-primary text-white', label: 'Current', icon: '●' },
  recommended: { dot: 'bg-white border-warning', badge: 'bg-warning text-white', label: 'Recommended', icon: '◆' },
  locked: { dot: 'bg-white border-border', badge: 'bg-white border border-border text-muted', label: 'Locked', icon: '🔒' },
}

export default function Roadmap() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Roadmap — Full Stack Developer"
        subtitle="Your personalized vertical timeline. Complete steps in order — AI unlocks next steps as you progress."
        actions={<Link to="/student/skill-gap"><Button variant="outline">View Skill Gap</Button></Link>}
      />

      <Card className="!bg-sage !border-sage !p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shrink-0"><span className="material-symbols-outlined">lightbulb</span></div>
          <div>
            <p className="text-sm font-bold text-charcoal">AI Recommended Next Step</p>
            <p className="text-sm text-charcoal/80">Complete <strong>Testing (Jest & RTL)</strong> — it’s your most critical gap (38% → 60%). Finish Docker next to hit 85%+ readiness.</p>
          </div>
        </div>
        <Link to="/student/learning"><Button>Start Now →</Button></Link>
      </Card>

      <Card>
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-border hidden sm:block" aria-hidden />

          <div className="space-y-0">
            {mockRoadmap.map((step, idx) => {
              const style = statusStyles[step.status]
              return (
                <div key={step.id} className="relative flex gap-4 py-4">
                  {/* dot */}
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${style.dot} ${step.status === 'locked' ? 'text-muted' : 'text-white'}`}>
                    {style.icon}
                  </div>

                  <div className={`flex-1 rounded-2xl border p-4 ${step.status === 'locked' ? 'bg-background border-border opacity-70' : step.status === 'current' ? 'bg-primary/[0.04] border-primary/20 shadow-soft' : 'bg-white border-border'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted">STEP {idx + 1}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}>{style.label}</span>
                          <span className="text-xs text-muted">{step.duration}</span>
                        </div>
                        <h3 className="mt-1 text-sm font-bold text-charcoal">{step.title}</h3>
                        <p className="text-xs text-muted">{step.desc}</p>
                        {step.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {step.skills.map((s) => (
                              <span key={s} className="rounded-full bg-sage border border-sage px-2 py-0.5 text-[11px] font-semibold text-primary">{s}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {step.status === 'completed' && <Badge variant="success">Done ✓</Badge>}
                        {step.status === 'current' && <Link to="/student/learning"><Button size="sm">Continue</Button></Link>}
                        {step.status === 'recommended' && <Link to="/student/learning"><Button size="sm" variant="outline">Start</Button></Link>}
                        {step.status === 'locked' && <Button size="sm" variant="ghost" disabled>Locked</Button>}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
