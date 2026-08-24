import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import FileUpload from '../../components/ui/FileUpload'
import PageHeader from '../../components/common/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import AppIcon from '../../components/ui/AppIcon';

const assignments = [
  { id:'a1', title:'Build a Responsive Portfolio', course:'Complete React Mastery', due:'2026-03-05', status:'In Progress', instructions:'Create a portfolio with 3 sections (Hero, Projects, Contact) using React + Tailwind. Deploy to Vercel.', resources:['Brief.pdf','Figma-Reference.fig'], feedback:null },
  { id:'a2', title:'REST API — Task Manager', course:'Node.js Backend Bootcamp', due:'2026-03-01', status:'Submitted', instructions:'Build CRUD Task API with auth (JWT), validation, pagination. Include Postman collection.', resources:['API-Spec.pdf'], feedback:null },
  { id:'a3', title:'Dockerize MERN App', course:'Docker & DevOps Essentials', due:'2026-02-28', status:'Reviewed', instructions:'Write Dockerfiles for client/server, docker-compose, push images to Docker Hub.', resources:['Starter-Code.zip'], feedback:{ grade:'8.5/10', comment:'Great multi-stage builds! Fix volume mount for hot reload.', reviewedOn:'2026-02-29' } },
  { id:'a4', title:'Jest Unit Tests — Todo App', course:'Testing with Jest & RTL', due:'2026-03-10', status:'In Progress', instructions:'Achieve 80% coverage. Test components, hooks and utils. Provide coverage report.', resources:['Todo-Starter.zip','Coverage-Guide.pdf'], feedback:null },
]

const statusStyles = { 'In Progress':'bg-amber-100 text-amber-800 border-amber-200', Submitted:'bg-blue-100 text-blue-800 border-blue-200', Reviewed:'bg-green-100 text-green-800 border-green-200' }

export default function Assignments() {
  const [tab, setTab] = useState('All')
  const [submitting, setSubmitting] = useState({})

  const filtered = tab==='All' ? assignments : assignments.filter(a=>a.status===tab)

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" subtitle="Submit work, get feedback, and track your course assignments in one place." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {['All','In Progress','Submitted','Reviewed'].map(t=>(
            <TabsTrigger key={t} value={t}>{t} {t==='All' ? `(${assignments.length})` : `(${assignments.filter(a=>a.status===t).length})`}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={tab}>
          <div className="grid grid-cols-1 gap-5">
            {filtered.map(a=>(
              <Card key={a.id} className="!p-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-charcoal">{a.title}</h3>
                      <p className="text-xs text-muted mt-1">{a.course} • <span className={new Date(a.due) < new Date() ? 'text-danger font-semibold' : 'text-muted'}>Due {a.due}</span></p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[a.status]}`}>{a.status}</span>
                  </div>

                  <div className="mt-4 rounded-xl bg-background border border-border p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Instructions</p>
                    <p className="text-sm leading-relaxed text-charcoal/80">{a.instructions}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {a.resources.map(r=>(
                        <a key={r} href="#" className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-3 py-1.5 text-xs font-medium text-charcoal hover:bg-sage">
                          <AppIcon name="download" className="text-[16px]" /> {r}
                        </a>
                      ))}
                    </div>
                  </div>

                  {a.feedback && (
                    <div className="mt-4 rounded-xl bg-green-50 border border-green-200 p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="success">{a.feedback.grade}</Badge>
                        <span className="text-xs text-muted">Reviewed on {a.feedback.reviewedOn}</span>
                      </div>
                      <p className="mt-2 text-sm text-charcoal"><span className="font-semibold">Feedback:</span> {a.feedback.comment}</p>
                    </div>
                  )}

                  {a.status !== 'Reviewed' && (
                    <div className="mt-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Your submission</p>
                      <FileUpload hint="Drop submission (zip/pdf) or click to browse" accept=".zip,.pdf,.rar" maxSizeMB={20} onFiles={()=>setSubmitting(s=>({...s,[a.id]:true}))} />
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" onClick={()=>setSubmitting(s=>({...s,[a.id]: !s[a.id]}))} >{submitting[a.id] ? 'Submitted ✓' : a.status==='Submitted' ? 'Resubmit' : 'Submit Assignment'}</Button>
                        <Button size="sm" variant="outline">Save Draft</Button>
                      </div>
                      {submitting[a.id] && <p className="mt-2 text-xs font-medium text-success">Upload received — instructor will review within 48h.</p>}
                    </div>
                  )}
                </div>
              </Card>
            ))}
            {filtered.length===0 && (
              <Card className="text-center py-12"><p className="text-sm text-muted">No assignments in this tab.</p></Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
