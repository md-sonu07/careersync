import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { ProgressBar } from '../../components/ui/Progress'
import { mockProjects } from '../../utils/mockData'

export default function Projects() {
  return (
    <div className="space-y-6">
      <PageHeader title="Projects" subtitle="Showcase your work — projects boost your readiness and match rate." actions={<Button icon="add">New Project</Button>} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {mockProjects.map((p) => (
          <Card key={p.id} hover className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-charcoal">{p.title}</h3>
              <Badge variant={p.status === 'Completed' ? 'success' : p.status === 'In Progress' ? 'default' : 'muted'}>{p.status}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.skills.map((s) => (
                <span key={s} className="rounded-full bg-sage border border-sage px-2 py-0.5 text-[11px] font-semibold text-primary">{s}</span>
              ))}
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs"><span className="text-muted">Progress</span><span className="font-bold">{p.progress}%</span></div>
              <ProgressBar value={p.progress} size="sm" barClassName={p.status === 'Completed' ? 'bg-success' : 'bg-primary'} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">View</Button>
              <Button size="sm" className="flex-1">Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
