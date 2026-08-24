import Card from '../../components/ui/Card'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import AppIcon from '../../components/ui/AppIcon';

const weekBars = [3,5,2,6,4,1,5] // hours
const calendarDays = Array.from({length:42},(_,i)=>{
  const active = Math.random() > 0.35
  const today = i===20
  return { active, today, label: i+1 }
})

export default function Streak(){
  return (
    <div className="space-y-6">
      <PageHeader title="Learning Streak" subtitle="Build consistency — daily activity calendar, current and longest streaks." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Current Streak" value="12 days 🔥" icon="local_fire_department" trend={2} trendLabel="keep going!" />
        <StatCard label="Longest Streak" value="28 days" icon="emoji_events" />
        <StatCard label="This Week" value="18.5 hrs" icon="schedule" trend={6} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-charcoal">Activity Calendar</h3>
            <span className="text-xs text-muted">Last 42 days • Feb 2026</span>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {['M','T','W','T','F','S','S'].map(d=>(
              <div key={d} className="text-center text-xs font-bold text-muted">{d}</div>
            ))}
            {calendarDays.map((d,i)=>(
              <div key={i} className={`flex h-10 items-center justify-center rounded-xl border text-sm font-semibold ${d.active ? 'bg-primary text-white border-primary' : 'bg-white border-border text-muted'} ${d.today ? 'ring-2 ring-primary ring-offset-1' : ''}`}>
                {d.label}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted">
            <span className="h-3 w-3 rounded bg-primary" /> Active
            <span className="h-3 w-3 rounded bg-white border border-border" /> Inactive
            <span className="h-3 w-3 rounded bg-white border-2 border-primary" /> Today
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal">Weekly Activity</h3>
            <p className="text-xs text-muted mt-1">Hours per day</p>
            <div className="mt-4 flex items-end gap-2 h-32">
              {weekBars.map((h,i)=>(
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-lg bg-primary" style={{height: `${h*18}px`}} />
                  <span className="text-xs text-muted">{['M','T','W','T','F','S','S'][i]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="!bg-sage !border-sage">
            <h3 className="font-bold text-charcoal flex items-center gap-2"><AppIcon name="lightbulb" className="text-primary" /> Keep your streak!</h3>
            <p className="text-sm text-charcoal/80 mt-2 leading-relaxed">You’re 2 days away from your longest streak (28). Complete a 15-min quiz today to keep it alive.</p>
            <button className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">Start Quick Quiz →</button>
          </Card>
        </div>
      </div>
    </div>
  )
}
