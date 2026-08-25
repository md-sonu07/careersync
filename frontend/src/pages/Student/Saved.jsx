import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import { mockInternships, mockJobs } from '../../utils/mockData'

export default function Saved(){
  const [tab, setTab] = useState('Internships')
  const [savedInternships, setSavedInternships] = useState(mockInternships.slice(0,2))
  const [savedJobs, setSavedJobs] = useState(mockJobs.slice(0,1))

  const unsaveIntern = (id)=> setSavedInternships(p=>p.filter(x=>x.id!==id))
  const unsaveJob = (id)=> setSavedJobs(p=>p.filter(x=>x.id!==id))

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Opportunities" subtitle="Your bookmarked internships and jobs — unsave or apply anytime." />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="Internships">Internships ({savedInternships.length})</TabsTrigger>
          <TabsTrigger value="Jobs">Jobs ({savedJobs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="Internships">
          {savedInternships.length===0 ? (
            <EmptyState icon="bookmark" title="No saved internships" description="Bookmark internships from Explore to see them here." actionLabel="Explore Internships" onAction={()=>{}} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {savedInternships.map(item=>(
                <Card key={item.id} hover className="flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-lg">{item.logo}</div>
                    <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">{item.match}% Match</span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-charcoal">{item.role}</h3>
                  <p className="text-xs text-muted">{item.company} • {item.location}</p>
                  <p className="text-xs text-muted mt-1">{item.duration} • {item.stipend} • {item.posted}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.skills.map(s=> <span key={s} className="rounded-full bg-sage border border-sage px-2 py-0.5 text-[11px] font-semibold text-primary">{s}</span>)}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1">Apply Now</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={()=>unsaveIntern(item.id)}>Unsave</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="Jobs">
          {savedJobs.length===0 ? (
            <EmptyState icon="work" title="No saved jobs" description="Save jobs you like to compare and apply later." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {savedJobs.map(item=>(
                <Card key={item.id} hover>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-lg">{item.logo}</div>
                    <span className="rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">{item.match}% Match</span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-charcoal">{item.role}</h3>
                  <p className="text-xs text-muted">{item.company} • {item.location}</p>
                  <p className="text-xs text-muted mt-1">{item.salary} • {item.type}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.skills.map(s=> <span key={s} className="rounded-full bg-sage border border-sage px-2 py-0.5 text-[11px] font-semibold text-primary">{s}</span>)}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1">Apply</Button>
                    <Button size="sm" variant="outline" className="flex-1" onClick={()=>unsaveJob(item.id)}>Unsave</Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
