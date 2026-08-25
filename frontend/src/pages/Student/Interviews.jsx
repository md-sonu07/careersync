import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'

const interviews = [
  { id:1, company:'Postman', role:'Frontend Engineer I', date:'2026-03-02', time:'11:00 AM', type:'Video — Google Meet', link:'meet.google.com/abc-defg-hij', status:'Upcoming', instructions:'Bring resume, 2 projects demo. 45 min — DSA + React.' },
  { id:2, company:'Flipkart', role:'Frontend Intern', date:'2026-02-28', time:'03:30 PM', type:'Video — Zoom', link:'zoom.us/j/123456', status:'Upcoming', instructions:'Round 2 — System design basics + JS fundamentals.' },
  { id:3, company:'CRED', role:'React Developer Intern', date:'2026-02-15', time:'10:00 AM', type:'On-site — Gurugram', link:'', status:'Completed', instructions:'Completed — Await feedback. Interviewer: Priya Nair.' },
  { id:4, company:'Zomato', role:'Full Stack Intern', date:'2026-02-10', time:'02:00 PM', type:'Video — Meet', link:'meet.google.com/xyz', status:'Cancelled', instructions:'Cancelled by company — role on hold.' },
]

const pill = { Upcoming:'bg-blue-100 text-blue-700 border-blue-200', Completed:'bg-green-100 text-green-700 border-green-200', Cancelled:'bg-red-100 text-red-700 border-red-200' }

export default function Interviews(){
  const [tab, setTab] = useState('Upcoming')
  const filtered = tab==='All' ? interviews : interviews.filter(i=>i.status===tab)
  const tabs = ['Upcoming','Completed','Cancelled']

  return (
    <div className="space-y-6">
      <PageHeader title="Interviews" subtitle="Upcoming, completed and cancelled interviews — links, timing and instructions." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {tabs.map(t=> <TabsTrigger key={t} value={t}>{t} ({interviews.filter(x=>x.status===t).length})</TabsTrigger>)}
        </TabsList>
        <TabsContent value={tab}>
          <div className="grid grid-cols-1 gap-4">
            {filtered.map(iv=>(
              <Card key={iv.id} className="!p-0 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-charcoal">{iv.role}</h3>
                      <p className="text-sm text-muted">{iv.company} • {iv.type}</p>
                      <p className="mt-1 text-xs font-semibold text-charcoal">📅 {iv.date} • {iv.time}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${pill[iv.status]}`}>{iv.status}</span>
                  </div>

                  {iv.link && (
                    <div className="mt-4 rounded-xl bg-background border border-border p-3 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs font-medium text-charcoal truncate">{iv.link}</span>
                      <Button size="sm" variant="primary">Join Meeting</Button>
                    </div>
                  )}

                  <div className="mt-4 rounded-xl bg-sage/50 border border-sage p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">Instructions</p>
                    <p className="text-sm text-charcoal mt-1">{iv.instructions}</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">Add to Calendar</Button>
                    <Button size="sm" variant="ghost">Reschedule</Button>
                    {iv.status==='Upcoming' && <Button size="sm" variant="ghost" className="text-danger">Cancel</Button>}
                  </div>
                </div>
              </Card>
            ))}
            {filtered.length===0 && <Card className="text-center py-10 text-sm text-muted">No {tab.toLowerCase()} interviews.</Card>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
