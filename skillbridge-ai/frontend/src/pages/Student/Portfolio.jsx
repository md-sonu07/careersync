import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { ProgressBar } from '../../components/ui/Progress'
import { mockProjects } from '../../utils/mockData'

const extended = [
  ...mockProjects,
  { id:'p4', title:'SkillGap Visualizer', desc:'Interactive radar chart for skill vs required with export to PDF.', skills:['React','Chart.js'], status:'Completed', progress:100, link:'#' },
  { id:'p5', title:'AI Quiz Generator', desc:'Generate MCQs from any PDF using LLM — deployed on Vercel.', skills:['Node.js','OpenAI'], status:'In Progress', progress:55, link:'#' },
  { id:'p6', title:'Streak Calendar Widget', desc:'GitHub-style contribution graph for learning streaks.', skills:['React','Tailwind'], status:'Planned', progress:15, link:'#' },
]

export default function Portfolio(){
  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        subtitle="Your public showcase — a grid view of projects. Curate your best work for recruiters."
        actions={<><Button variant="outline" size="sm">Preview Public Page</Button><Button size="sm" icon="add">New Project</Button></>}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {extended.map(p=>(
          <Card key={p.id} hover className="flex flex-col overflow-hidden !p-0">
            <div className={`h-2 w-full ${p.status==='Completed' ? 'bg-success' : p.status==='In Progress' ? 'bg-primary' : 'bg-border'}`} />
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-charcoal leading-tight">{p.title}</h3>
                <Badge variant={p.status==='Completed' ? 'success' : p.status==='In Progress' ? 'default' : 'muted'}>{p.status}</Badge>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.map(s=> <span key={s} className="rounded-full bg-sage border border-sage px-2 py-0.5 text-[11px] font-semibold text-primary">{s}</span>)}
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs"><span className="text-muted">Progress</span><span className="font-bold">{p.progress}%</span></div>
                <ProgressBar value={p.progress} size="sm" barClassName={p.status==='Completed' ? 'bg-success' : 'bg-primary'} />
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">View</Button>
                <Button size="sm" className="flex-1">Edit</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
