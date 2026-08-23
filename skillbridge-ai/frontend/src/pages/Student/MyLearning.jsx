import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { mockCourses } from '../../utils/mockData'

export default function MyLearning() {
  const inProgress = mockCourses.filter((c) => c.progress > 0 && c.progress < 100)
  const completed = mockCourses.filter((c) => c.progress === 100)
  const streak = { current: 12, longest: 18 }

  return (
    <div className="space-y-6">
      <PageHeader title="My Learning" subtitle="Continue where you left off and keep your streak alive." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-charcoal">{inProgress.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Completed</p>
          <p className="mt-1 text-2xl font-bold text-success">{completed.length || 1}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Learning Streak</p>
          <p className="mt-1 text-2xl font-bold text-primary">{streak.current} days 🔥</p>
          <p className="text-xs text-muted">Longest: {streak.longest} days</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-charcoal">Continue Learning</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {inProgress.map((c) => (
            <div key={c.id} className="flex gap-4 rounded-2xl border border-border bg-background/40 p-4">
              <img src={c.thumbnail} alt="" className="h-20 w-28 rounded-xl object-cover border border-border shrink-0" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-charcoal line-clamp-2">{c.title}</h4>
                <p className="text-xs text-muted">{c.instructor}</p>
                <ProgressBar value={c.progress} size="sm" className="mt-2" showLabel />
                <Link to={`/student/courses/${c.id}`}><Button size="sm" className="mt-3">Resume →</Button></Link>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-charcoal">Learning Streak</h3>
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 14 }).map((_, i) => {
            const done = i < 12
            return <div key={i} className={`h-8 flex-1 rounded-lg border ${done ? 'bg-primary border-primary' : 'bg-white border-border'}`} title={done ? 'Completed' : 'Missed'} />
          })}
        </div>
        <p className="mt-2 text-xs text-muted">12-day streak — 2 more days to beat your record!</p>
      </Card>
    </div>
  )
}
