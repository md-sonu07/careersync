import { useState, useMemo } from 'react'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchInput from '../../components/ui/SearchInput'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import { ProgressBar } from '../../components/ui/Progress'
import ChartCard from '../../components/common/ChartCard'
import PageHeader from '../../components/common/PageHeader'
import { mockSkills } from '../../utils/mockData'

const categories = ['All', 'Frontend', 'Backend', 'DevOps']

export default function Skills() {
  const [active, setActive] = useState('All')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return mockSkills.filter((s) => {
      if (active !== 'All' && s.category !== active) return false
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [active, query])

  const getTone = (level) => {
    if (level >= 80) return { label: 'Strong', color: 'success', bar: 'bg-success' }
    if (level >= 50) return { label: 'Good', color: 'default', bar: 'bg-primary' }
    if (level >= 35) return { label: 'Needs work', color: 'accent', bar: 'bg-warning' }
    return { label: 'Critical', color: 'danger', bar: 'bg-danger' }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Skills"
        subtitle="Track your proficiency across the Full Stack Developer track. AI updates these after every assessment."
        actions={<Button variant="primary" icon="quiz">Take Assessment</Button>}
      />

      <ChartCard title="Skill Distribution" subtitle="Radar / bar view — placeholder for chart integration (Recharts/Chart.js)" placeholder height={200} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Tabs defaultValue="All" value={active} onValueChange={setActive}>
          <TabsList>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c}>{c}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills..." wrapperClassName="w-full sm:w-72" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((skill) => {
          const tone = getTone(skill.level)
          return (
            <Card key={skill.id} hover className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-charcoal">{skill.name}</h3>
                  <p className="text-xs text-muted">{skill.category}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tone.label === 'Strong' ? 'bg-success/10 text-success' : tone.label === 'Critical' ? 'bg-danger/10 text-danger' : tone.label === 'Needs work' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                  {tone.label}
                </span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted">Proficiency</span>
                  <span className="text-sm font-bold tabular-nums text-charcoal">{skill.level}%</span>
                </div>
                <ProgressBar value={skill.level} barClassName={tone.bar} size="md" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-xs font-medium ${skill.trend >= 0 ? 'text-success' : 'text-danger'}`}>
                  {skill.trend >= 0 ? '↑' : '↓'} {Math.abs(skill.trend)}% this month
                </span>
                <Button variant="outline" size="sm">Improve →</Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <p className="text-sm text-muted">No skills match your filter.</p>
        </Card>
      )}
    </div>
  )
}
