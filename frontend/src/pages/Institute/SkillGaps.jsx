import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import AppIcon from '../../components/ui/AppIcon';

const gaps = [
  { skill: 'Cloud / AWS', demand: 72, proficiency: 31, gap: 41 },
  { skill: 'Docker & DevOps', demand: 58, proficiency: 22, gap: 36 },
  { skill: 'Testing (Jest)', demand: 52, proficiency: 24, gap: 28 },
  { skill: 'SQL / Data Modeling', demand: 68, proficiency: 44, gap: 24 },
  { skill: 'TypeScript', demand: 54, proficiency: 36, gap: 18 },
  { skill: 'Node.js', demand: 76, proficiency: 62, gap: 14 },
  { skill: 'React', demand: 82, proficiency: 71, gap: 11 },
]

const actions = [
  { title: 'Conduct Docker Workshop', desc: '2-day hands-on: containers, compose, CI/CD basics — target 200 students', priority: 'Critical', icon: 'container' },
  { title: 'AWS Cloud Bootcamp', desc: '4-week bootcamp with labs — EC2, S3, deployment pipelines', priority: 'High', icon: 'cloud' },
  { title: 'Testing (Jest) Sprint', desc: 'Weekly RTL + Jest practice — integrate into capstone projects', priority: 'High', icon: 'bug_report' },
  { title: 'SQL & Data Modeling Clinic', desc: 'Weekend clinic — indexing, aggregation, real datasets', priority: 'Medium', icon: 'database' },
]

export default function SkillGaps() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal">Skill Gaps</h1>
        <p className="text-sm text-muted mt-1">Industry Demand vs Student Proficiency — gaps to close this semester</p>
      </div>

      <Card>
        <h3 className="font-bold text-charcoal">Industry Demand vs Student Proficiency</h3>
        <p className="text-xs text-muted mt-1">Side-by-side — longer bar = higher %</p>
        <div className="mt-5 space-y-4">
          {gaps.map((g) => (
            <div key={g.skill} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-charcoal">{g.skill}</span>
                <span className="text-xs font-bold tabular-nums text-danger">Gap {g.gap}%</span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted">Demand</span><span className="font-bold text-charcoal">{g.demand}%</span></div>
                  <div className="h-3 rounded-full bg-background border border-border overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${g.demand}%` }} /></div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted">Proficiency</span><span className="font-bold text-charcoal">{g.proficiency}%</span></div>
                  <div className="h-3 rounded-full bg-background border border-border overflow-hidden"><div className="h-full rounded-full bg-accent" style={{ width: `${g.proficiency}%` }} /></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="!border-danger/20 !bg-danger/[0.04]">
        <h3 className="font-bold text-danger flex items-center gap-2"><AppIcon name="warning" /> Critical Gaps (Gap &gt; 25%)</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {gaps.filter((g) => g.gap > 25).map((g) => (
            <div key={g.skill} className="rounded-xl bg-white border border-border p-3">
              <p className="text-sm font-bold text-charcoal">{g.skill}</p>
              <p className="text-xs text-muted">{g.demand}% demand vs {g.proficiency}% proficiency</p>
              <span className="mt-2 inline-flex rounded-full bg-danger text-white px-2.5 py-0.5 text-xs font-bold">Gap {g.gap}%</span>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h3 className="font-bold text-charcoal mb-3">Recommended College Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {actions.map((a) => (
            <Card key={a.title} className="hover:shadow-card transition-shadow">
              <div className="flex gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 border ${a.priority === 'Critical' ? 'bg-danger/10 text-danger border-danger/20' : a.priority === 'High' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                  <AppIcon name={a.icon} className="text-[22px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-charcoal text-sm">{a.title}</p>
                    <Badge variant={a.priority === 'Critical' ? 'default' : 'muted'} className={`${a.priority === 'Critical' ? '!bg-danger !text-white' : a.priority === 'High' ? '!bg-accent/10 !text-accent !border-accent/20' : ''} text-[11px]`}>{a.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
