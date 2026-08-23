import Card from '../../components/ui/Card'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import PageHeader from '../../components/common/PageHeader'
import { ProgressBar } from '../../components/ui/Progress'

const hoursData = [1.5,2.2,0.8,2.8,1.2,3.0,2.0]
const skillProgress = [
  { name:'JavaScript', val:86 },
  { name:'React', val:82 },
  { name:'Node.js', val:76 },
  { name:'MongoDB', val:79 },
  { name:'Docker', val:43 },
]

function StreakGrid(){
  const cells = Array.from({length:112},(_,i)=>{
    const r = Math.random()
    let level=0
    if(r>0.85) level=3
    else if(r>0.6) level=2
    else if(r>0.35) level=1
    return level
  })
  const colors = ['bg-background border-border','bg-sage','bg-primary/30','bg-primary']
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((lv,i)=>(
        <div key={i} className={`h-3 w-3 rounded-sm border ${colors[lv]}`} title={`Day ${i+1}`} />
      ))}
    </div>
  )
}

export default function Analytics(){
  return (
    <div className="space-y-6">
      <PageHeader title="Learning Analytics" subtitle="Track streaks, hours, and skill growth — GitHub-style calendar, weekly activity and charts." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total Hours" value="48.5h" icon="schedule" trend={12} trendLabel="this month" />
        <StatCard label="Weekly Avg" value="6.9h" icon="bar_chart" trend={4} trendLabel="vs last week" />
        <StatCard label="Current Streak" value="12 days 🔥" icon="local_fire_department" trend={8} />
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-charcoal">Streak Calendar</h3>
          <span className="text-xs text-muted">112 days • GitHub-style grid</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <StreakGrid />
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted"><span>Less</span><span className="h-3 w-3 rounded-sm bg-background border border-border" /><span className="h-3 w-3 rounded-sm bg-sage" /><span className="h-3 w-3 rounded-sm bg-primary/30" /><span className="h-3 w-3 rounded-sm bg-primary" /><span>More</span></div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Weekly Activity" subtitle="Hours per day — last 7 days" height={200}>
          <div className="flex h-full items-end gap-2">
            {hoursData.map((h,i)=>(
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-primary transition-all" style={{height: `${h*48}px`}} />
                <span className="text-xs text-muted">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Monthly Activity" subtitle="Hours per week — last 4 weeks" placeholder height={200} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-bold text-charcoal">Skill Progress (Line preview)</h3>
          <p className="text-xs text-muted mt-1">Latest levels with mini trend</p>
          <div className="mt-4 space-y-4">
            {skillProgress.map(s=>(
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium text-charcoal">{s.name}</span><span className="font-bold tabular-nums">{s.val}%</span></div>
                <ProgressBar value={s.val} size="sm" barClassName={s.val<50 ? 'bg-danger' : 'bg-primary'} />
              </div>
            ))}
          </div>
        </Card>

        <ChartCard title="Skill Progress Trend" subtitle="Mock line chart placeholder" placeholder height={240} />
      </div>
    </div>
  )
}
