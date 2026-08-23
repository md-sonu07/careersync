import { useState } from 'react'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/common/PageHeader'
import ChartCard from '../../components/common/ChartCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import { ProgressBar } from '../../components/ui/Progress'
import { mockSkills } from '../../utils/mockData'

const categories = ['All','Frontend','Backend','DevOps']

const timeline = [
  { date:'2026-02-18', event:'React assessment — 8/10', delta:'+3% React' },
  { date:'2026-02-10', event:'Completed Docker module 1', delta:'+4% Docker' },
  { date:'2026-02-05', event:'Node project reviewed — feedback applied', delta:'+2% Node.js' },
  { date:'2026-01-28', event:'Mock interview — feedback on System Design', delta:'+1% System Design' },
]

export default function SkillProgress(){
  const [cat, setCat] = useState('All')
  const filtered = cat==='All' ? mockSkills : mockSkills.filter(s=>s.category===cat)

  return (
    <div className="space-y-6">
      <PageHeader title="Skill Progress" subtitle="Detailed trends by category with improvement timeline. Track growth over time." />

      <Tabs value={cat} onValueChange={setCat}>
        <TabsList>
          {categories.map(c=> <TabsTrigger key={c} value={c}>{c}</TabsTrigger>)}
        </TabsList>
        {categories.map(c=>(
          <TabsContent key={c} value={c}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(s=>(
                <Card key={s.id} className="!p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-charcoal">{s.name}</p>
                      <p className="text-xs text-muted">{s.category}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-bold ${s.trend>=0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{s.trend>=0?'+':''}{s.trend}%</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-charcoal tabular-nums">{s.level}%</span>
                    <span className="text-xs text-muted">level</span>
                  </div>
                  <ProgressBar value={s.level} size="sm" className="mt-2" barClassName={s.level<50 ? 'bg-danger' : s.level>=80 ? 'bg-success' : 'bg-primary'} />
                  {/* mini sparkline placeholder */}
                  <div className="mt-3 h-12 rounded-lg bg-background border border-border flex items-end gap-1 p-2">
                    {Array.from({length:8}).map((_,i)=>(
                      <div key={i} className="flex-1 rounded-sm bg-primary/70" style={{height: `${20 + Math.random()*60}%`, opacity: 0.5 + i*0.06}} />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Category Trend" subtitle="Mock line chart — Frontend vs Backend vs DevOps" placeholder height={260} />
        <Card>
          <h3 className="font-bold text-charcoal">Improvement Timeline</h3>
          <div className="mt-4 space-y-3">
            {timeline.map((t,i)=>(
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary mt-1" />
                  {i!==timeline.length-1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="pb-4">
                  <p className="text-xs font-bold text-primary">{t.date} • {t.delta}</p>
                  <p className="text-sm text-charcoal mt-1">{t.event}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
