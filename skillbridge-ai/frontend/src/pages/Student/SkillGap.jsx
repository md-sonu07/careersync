import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { skillApi } from '../../api/skill.api'
import { mockSkillGap } from '../../utils/mockData'

function ComparisonBar({ item }) {
  const color = item.status === 'resolved' || item.status === 'strong' ? 'bg-success' : item.severity === 'Medium' ? 'bg-warning' : 'bg-danger'
  const badge =
    item.status === 'resolved' || item.status === 'strong'
      ? 'bg-success/10 text-success border-success/20'
      : item.severity === 'Medium'
      ? 'bg-warning/10 text-warning border-warning/20'
      : 'bg-danger/10 text-danger border-danger/20'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal">{item.skill}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${badge}`}>
          {item.status === 'resolved' ? 'Resolved' : item.severity === 'High' ? 'Critical' : item.severity === 'Medium' ? 'Improve' : 'Low Gap'}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="w-14 text-xs text-muted">You</span>
          <div className="flex-1">
            <ProgressBar value={item.yours} size="sm" barClassName={color} />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums">{item.yours}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-14 text-xs text-muted">Industry</span>
          <div className="flex-1">
            <ProgressBar value={item.required} size="sm" barClassName="bg-charcoal/30" />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums text-muted">{item.required}%</span>
        </div>
      </div>
      {item.status !== 'resolved' && (
        <p className="text-xs text-muted">
          Gap: <span className="font-bold text-danger">{item.required - item.yours}%</span> ({item.severity} Severity)
        </p>
      )}
    </div>
  )
}

export default function SkillGap() {
  const [skillGapList, setSkillGapList] = useState([])
  const [targetRoleTitle, setTargetRoleTitle] = useState('Full Stack Developer')
  const [loading, setLoading] = useState(true)

  const loadGaps = async () => {
    try {
      setLoading(true)
      const gapData = await skillApi.getSkillGaps().catch(() => null)

      if (gapData && gapData.length > 0) {
        setTargetRoleTitle(gapData[0].career_role_title || 'Full Stack Developer')
        const mapped = gapData.map((g) => ({
          skill: g.skill?.name || 'Skill',
          yours: g.current_score,
          required: g.required_score,
          gap_score: g.gap_score,
          severity: g.severity,
          status: g.status,
        }))
        setSkillGapList(mapped)
      } else {
        setSkillGapList([])
        setTargetRoleTitle('Not set')
      }
    } catch {
      setSkillGapList([])
      setTargetRoleTitle('Not set')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGaps()
  }, [])

  const handleRecalculate = async () => {
    try {
      setLoading(true)
      await skillApi.recalculateSkillGaps()
      await loadGaps()
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  const strong = skillGapList.filter((s) => s.status === 'resolved' || s.yours >= s.required)
  const improve = skillGapList.filter((s) => (s.status !== 'resolved' && s.yours < s.required) && s.severity !== 'High')
  const critical = skillGapList.filter((s) => s.severity === 'High' && s.status !== 'resolved')

  const gapCard = (list) =>
    list.map((g) => (
      <div key={g.skill} className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-charcoal">{g.skill}</h4>
          <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">Gap {g.required - g.yours}%</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-background border border-border py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Current</p>
            <p className="text-sm font-bold text-charcoal">{g.yours}%</p>
          </div>
          <div className="rounded-lg bg-background border border-border py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Required</p>
            <p className="text-sm font-bold text-charcoal">{g.required}%</p>
          </div>
          <div className="rounded-lg bg-danger/10 border border-danger/20 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-danger">Missing</p>
            <p className="text-sm font-bold text-danger">{g.required - g.yours}%</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Link to="/student/learning" className="flex-1">
            <Button variant="primary" size="sm" className="w-full">Take Course →</Button>
          </Link>
          <Link to="/student/ai-practice">
            <Button variant="outline" size="sm">Practice</Button>
          </Link>
        </div>
      </div>
    ))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Gap Analysis"
        subtitle={`Calculated live by CareerSync Skill Gap Engine for ${targetRoleTitle}.`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRecalculate} disabled={loading}>
              {loading ? 'Recalculating...' : 'Recalculate Gaps ↻'}
            </Button>
            <Badge variant="default">Target Role — {targetRoleTitle}</Badge>
          </div>
        }
      />

      <Card className="!bg-sage !border-sage">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold text-charcoal">Skill Readiness Overview</h3>
            <p className="text-sm text-charcoal/70">
              {critical.length} Critical Gaps detected. Complete assessments or courses to resolve gaps.
            </p>
          </div>
          <Link to="/student/roadmap">
            <Button>View Roadmap →</Button>
          </Link>
        </div>
        <div className="mt-4">
          <ProgressBar value={strong.length > 0 ? Math.round((strong.length / skillGapList.length) * 100) : 70} size="lg" barClassName="bg-primary" />
          <div className="mt-1.5 flex justify-between text-xs text-muted"><span>0%</span><span>85% readiness target</span><span>100%</span></div>
        </div>
      </Card>

      <Card>
        <h3 className="font-bold text-charcoal">You vs Target Role Benchmark ({targetRoleTitle})</h3>
        <p className="text-xs text-muted">Green = Resolved / Strong · Amber = Medium Severity · Red = High Severity Gap</p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGapList.map((item) => (
            <ComparisonBar key={item.skill} item={item} />
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <h3 className="font-bold text-charcoal flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" /> Resolved Skills ({strong.length})
          </h3>
          <p className="text-xs text-muted">At or above industry benchmark.</p>
          <div className="mt-4 space-y-2">
            {strong.map((s) => (
              <div key={s.skill} className="flex items-center justify-between rounded-xl border border-success/20 bg-success/5 px-3 py-2">
                <span className="text-sm font-medium text-charcoal">{s.skill}</span>
                <span className="text-xs font-bold text-success">{s.yours}% / {s.required}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-charcoal flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning" /> Medium Severity Gaps ({improve.length})
          </h3>
          <p className="text-xs text-muted">Close to target — 1–2 modules away.</p>
          <div className="mt-4 space-y-3">{gapCard(improve)}</div>
        </Card>

        <Card>
          <h3 className="font-bold text-charcoal flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-danger" /> Critical Gaps ({critical.length})
          </h3>
          <p className="text-xs text-muted">High priority (gap &gt; 20%) — focus here first.</p>
          <div className="mt-4 space-y-3">{gapCard(critical)}</div>
        </Card>
      </div>
    </div>
  )
}
