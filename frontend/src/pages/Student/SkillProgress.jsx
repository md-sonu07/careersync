import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/common/PageHeader'
import ChartCard from '../../components/common/ChartCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs'
import { ProgressBar } from '../../components/ui/Progress'
import { skillApi } from '../../api/skill.api'
import { toast } from 'react-hot-toast'
import { mockSkills } from '../../utils/mockData'

const categories = ['All', 'Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud', 'AI/ML', 'Soft Skill']

export default function SkillProgress() {
  const [cat, setCat] = useState('All')
  const [skills, setSkills] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const [mySkillsData, historyData] = await Promise.all([
          skillApi.getMySkills().catch(() => {
            if (isMounted) {
              toast.error('Could not load skill data. Please try again.')
            }
            return null
          }),
          skillApi.getMySkillHistory().catch(() => {
            if (isMounted) {
              toast.error('Could not load skill history. Please try again.')
            }
            return null
          }),
        ])

        if (isMounted) {
          if (mySkillsData && mySkillsData.length > 0) {
            setSkills(mySkillsData.map(s => ({
              id: s.id,
              name: s.skill?.name,
              category: s.skill?.category || 'Programming',
              level: s.score,
              levelText: s.level,
              trend: 5,
            })))
          } else {
            setSkills(mockSkills)
          }

          if (historyData && historyData.length > 0) {
            setHistory(historyData.map(h => ({
              date: new Date(h.recorded_at).toLocaleDateString(),
              event: `Score update: ${h.skill_name || 'Skill'} set to ${h.score}% via ${h.source}`,
              delta: `Score: ${h.score}%`,
            })))
          }
        }
      } catch {
        if (isMounted) {
          toast.error('An unexpected error occurred. Please try again.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  const filtered = cat === 'All' ? skills : skills.filter((s) => s.category === cat)

  return (
    <div className="space-y-6">
      <PageHeader title="Skill Progress" subtitle="Detailed trends by category with improvement timeline connected to CareerSync database." />

      <Tabs value={cat} onValueChange={setCat}>
        <TabsList className="flex-wrap h-auto">
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <Card key={s.id} className="!p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{s.name}</p>
                    <p className="text-xs text-muted">{s.category}</p>
                  </div>
                  <span className="rounded-full px-2 py-1 text-xs font-bold bg-green-100 text-green-700">
                    {s.levelText || 'Active'}
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-charcoal tabular-nums">{s.level}%</span>
                  <span className="text-xs text-muted">score</span>
                </div>
                <ProgressBar value={s.level} size="sm" className="mt-2" barClassName={s.level < 50 ? 'bg-danger' : s.level >= 80 ? 'bg-success' : 'bg-primary'} />
                {/* Sparkline placeholder */}
                <div className="mt-3 h-12 rounded-lg bg-background border border-border flex items-end gap-1 p-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex-1 rounded-sm bg-primary/70" style={{ height: `${20 + Math.random() * 60}%`, opacity: 0.5 + i * 0.06 }} />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Category Trend" subtitle="Frontend vs Backend vs DevOps" placeholder height={260} />
        <Card>
          <h3 className="font-bold text-charcoal">Improvement History Log</h3>
          <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {(history.length > 0 ? history : [
              { date: 'Recent', event: 'React skill assessment score recorded', delta: '85%' },
              { date: 'Recent', event: 'Django backend proficiency saved', delta: '80%' },
            ]).map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary mt-1" />
                  <div className="w-px flex-1 bg-border mt-1" />
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
