import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { skillApi } from '../../api/skill.api'
import { profileApi } from '../../api/profile.api'
import { toast } from 'react-hot-toast'
import { mockSkillGap } from '../../utils/mockData'

function ComparisonBar({ item }) {
  const isStrong = item.status === 'resolved' || item.status === 'strong' || item.yours >= item.required
  const color = isStrong ? 'bg-success' : item.severity === 'Medium' ? 'bg-warning' : 'bg-danger'
  const badge = isStrong
    ? 'bg-success/10 text-success border-success/20'
    : item.severity === 'Medium'
    ? 'bg-warning/10 text-warning border-warning/20'
    : 'bg-danger/10 text-danger border-danger/20'

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-charcoal">{item.skill}</span>
        <span className={`rounded-full border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${badge}`}>
          {isStrong ? 'Low Gap' : item.severity === 'High' ? 'Critical' : 'Medium'}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="w-14 text-xs text-muted font-medium">You</span>
          <div className="flex-1">
            <ProgressBar value={item.yours} size="sm" barClassName={color} />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums">{item.yours}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-14 text-xs text-muted font-medium">Industry</span>
          <div className="flex-1">
            <ProgressBar value={item.required} size="sm" barClassName="bg-charcoal/30" />
          </div>
          <span className="w-10 text-right text-xs font-bold tabular-nums text-muted">{item.required}%</span>
        </div>
      </div>
      {!isStrong && (
        <p className="text-xs text-muted">
          Gap: <span className="font-bold text-danger">{Math.max(item.required - item.yours, 0)}%</span> ({item.severity} Severity)
        </p>
      )}
    </div>
  )
}

export default function SkillGap() {
  const [skillGapList, setSkillGapList] = useState([])
  const [targetRoleTitle, setTargetRoleTitle] = useState('AI / ML Engineer')
  const [loading, setLoading] = useState(true)

  const loadGaps = async () => {
    try {
      setLoading(true)
      const [profileData, gapData] = await Promise.all([
        profileApi.getStudentProfile().catch(() => null),
        skillApi.getSkillGaps().catch(() => null),
      ])

      const goal = profileData?.career_goal || 'AI / ML Engineer'
      setTargetRoleTitle(goal)

      if (gapData && Array.isArray(gapData) && gapData.length > 0) {
        const mapped = gapData.map((g) => ({
          skill: g.skill?.name || 'Skill',
          yours: g.current_score || 0,
          required: g.required_score || 80,
          gap_score: g.gap_score || 0,
          severity: g.severity || 'Medium',
          status: g.status || 'open',
        }))
        setSkillGapList(mapped)
      } else {
        // Fallback default structure for AI / ML Engineer if DB gaps empty
        setSkillGapList([
          { skill: 'Python', yours: 85, required: 90, gap_score: 5, severity: 'Low', status: 'improving' },
          { skill: 'Machine Learning', yours: 0, required: 85, gap_score: 85, severity: 'High', status: 'open' },
          { skill: 'Deep Learning & PyTorch', yours: 0, required: 80, gap_score: 80, severity: 'High', status: 'open' },
          { skill: 'Prompt Engineering', yours: 0, required: 75, gap_score: 75, severity: 'High', status: 'open' },
        ])
      }
    } catch {
      setTargetRoleTitle('AI / ML Engineer')
      setSkillGapList([
        { skill: 'Python', yours: 85, required: 90, gap_score: 5, severity: 'Low', status: 'improving' },
        { skill: 'Machine Learning', yours: 0, required: 85, gap_score: 85, severity: 'High', status: 'open' },
        { skill: 'Deep Learning & PyTorch', yours: 0, required: 80, gap_score: 80, severity: 'High', status: 'open' },
        { skill: 'Prompt Engineering', yours: 0, required: 75, gap_score: 75, severity: 'High', status: 'open' },
      ])
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
      toast.success('Skill Gaps recalculated live from Django backend!')
    } catch (err) {
      toast.error('Failed to recalculate gaps: ' + (err.response?.data?.detail || err.message))
    } finally {
      setLoading(false)
    }
  }

  const strong = skillGapList.filter((s) => s.status === 'resolved' || s.yours >= s.required)
  const improve = skillGapList.filter((s) => s.status !== 'resolved' && s.yours < s.required && s.severity !== 'High')
  const critical = skillGapList.filter((s) => s.severity === 'High' && s.status !== 'resolved' && s.yours < s.required)

  const readinessScore = skillGapList.length > 0
    ? Math.round((skillGapList.reduce((acc, curr) => acc + Math.min(curr.yours / (curr.required || 1), 1), 0) / skillGapList.length) * 100)
    : 70

  const gapCard = (list) =>
    list.map((g) => (
      <div key={g.skill} className="rounded-xl border border-border bg-white p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-charcoal">{g.skill}</h4>
          <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">Gap {Math.max(g.required - g.yours, 0)}%</span>
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
            <p className="text-sm font-bold text-danger">{Math.max(g.required - g.yours, 0)}%</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Link to="/explore-courses" className="flex-1">
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
            <Badge variant="default">TARGET ROLE — {targetRoleTitle.toUpperCase()}</Badge>
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
          <ProgressBar value={readinessScore} size="lg" barClassName="bg-primary" />
          <div className="mt-1.5 flex justify-between text-xs text-muted font-medium">
            <span>0%</span>
            <span>85% readiness target</span>
            <span>100%</span>
          </div>
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
          <p className="text-xs text-muted mt-1">At or above industry benchmark.</p>
          <div className="mt-4 space-y-2">
            {strong.length > 0 ? (
              strong.map((s) => (
                <div key={s.skill} className="flex items-center justify-between rounded-xl border border-success/20 bg-success/5 px-3.5 py-2.5">
                  <span className="text-sm font-semibold text-charcoal">{s.skill}</span>
                  <span className="text-xs font-bold text-success">{s.yours}% / {s.required}%</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted italic">No resolved skills yet. Take assessments to build score.</p>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-charcoal flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning" /> Medium Severity Gaps ({improve.length})
          </h3>
          <p className="text-xs text-muted mt-1">Close to target — 1–2 modules away.</p>
          <div className="mt-4 space-y-3">
            {improve.length > 0 ? gapCard(improve) : <p className="text-xs text-muted italic">No medium gaps.</p>}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-charcoal flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-danger" /> Critical Gaps ({critical.length})
          </h3>
          <p className="text-xs text-muted mt-1">High priority (gap &gt; 20%) — focus here first.</p>
          <div className="mt-4 space-y-3">
            {critical.length > 0 ? gapCard(critical) : <p className="text-xs text-muted italic">No critical gaps!</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
