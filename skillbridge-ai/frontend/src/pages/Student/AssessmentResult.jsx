import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { ProgressRing, ProgressBar } from '../../components/ui/Progress'
import AppIcon from '../../components/ui/AppIcon';

export default function AssessmentResult(){
  return (
    <div className="space-y-6">
      <PageHeader
        title="Assessment Result"
        subtitle="React — Intermediate • Completed 18 Feb 2026 • 10 questions • Timed 12 min"
        actions={<Link to="/student/assessment"><Button variant="outline" size="sm">Retake Assessment</Button></Link>}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Overall Score</p>
          <div className="mt-4 flex justify-center"><ProgressRing value={78} size={120} strokeWidth={10} /></div>
          <p className="mt-2 text-lg font-bold text-charcoal">78% — Good</p>
          <p className="text-xs text-muted">Top 32% of test takers</p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button size="sm">View Certificate</Button>
            <Button size="sm" variant="outline">Share</Button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-bold text-charcoal">Performance</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label:'Correct', value:'7 / 10', color:'text-success' },
              { label:'Incorrect', value:'2 / 10', color:'text-danger' },
              { label:'Skipped', value:'1 / 10', color:'text-muted' },
              { label:'Time Taken', value:'09:42 / 12:00', color:'text-charcoal' },
              { label:'Accuracy', value:'78%', color:'text-primary' },
              { label:'Avg Speed', value:'58s / Q', color:'text-charcoal' },
            ].map(p=>(
              <div key={p.label} className="rounded-xl bg-background border border-border p-3 text-center">
                <p className="text-xs uppercase tracking-wider font-semibold text-muted">{p.label}</p>
                <p className={`mt-1 text-sm font-bold ${p.color}`}>{p.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-bold text-charcoal">Skill Breakdown</h3>
          <div className="mt-4 space-y-4">
            {[
              { name:'React Hooks', score:90, color:'bg-success' },
              { name:'JS Fundamentals', score:80, color:'bg-primary' },
              { name:'State Management', score:60, color:'bg-warning' },
              { name:'Performance', score:40, color:'bg-danger' },
            ].map(s=>(
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1.5"><span className="font-medium text-charcoal">{s.name}</span><span className="font-bold tabular-nums">{s.score}%</span></div>
                <ProgressBar value={s.score} size="sm" barClassName={s.color} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="!bg-sage !border-sage">
          <h3 className="font-bold text-charcoal flex items-center gap-2"><AppIcon name="auto_awesome" className="text-primary" /> AI Feedback</h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-success">Strengths</p>
              <ul className="mt-1 space-y-1 text-sm text-charcoal">
                <li className="flex gap-2"><span className="text-success">✓</span> Strong on hooks and functional components</li>
                <li className="flex gap-2"><span className="text-success">✓</span> Good understanding of state vs props</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-danger">Weaknesses</p>
              <ul className="mt-1 space-y-1 text-sm text-charcoal">
                <li className="flex gap-2"><span className="text-danger">•</span> Performance — memoization & re-renders (40%)</li>
                <li className="flex gap-2"><span className="text-danger">•</span> Context vs Redux trade-offs</li>
              </ul>
            </div>
            <div className="rounded-xl bg-white border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Next Course</p>
              <p className="text-sm font-semibold text-charcoal mt-1">Complete “React Performance & Testing” — 2h</p>
              <p className="text-xs text-muted mt-1">Will boost this topic from 40% → 75% estimated.</p>
              <Link to="/student/learning"><Button size="sm" className="mt-3 w-full">Go to Course →</Button></Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
