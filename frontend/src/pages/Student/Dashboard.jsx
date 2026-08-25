import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import StatCard from '../../components/common/StatCard'
import { skillApi } from '../../api/skill.api'
import { opportunityApi } from '../../api/opportunity.api'
import { courseApi } from '../../api/course.api'
import AppIcon from '../../components/ui/AppIcon';

export default function Dashboard() {
  const user = useSelector(selectCurrentUser)
  const [gapsList, setGapsList] = useState([])
  const [userSkills, setUserSkills] = useState([])
  const [opportunityMatches, setOpportunityMatches] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  const displayName = user?.full_name || (user?.first_name ? `${user.first_name} ${user.last_name}` : 'Student')
  const firstName = user?.first_name || displayName.split(' ')[0] || 'Learner'
  const email = user?.email || ''
  const careerGoal = user?.career_goal || 'Not specified'

  useEffect(() => {
    let isMounted = true
    Promise.allSettled([
      skillApi.getSkillGaps(),
      skillApi.getMySkills(),
      opportunityApi.getOpportunityMatches(),
      courseApi.getRecommendations(),
    ]).then(([gapsRes, skillsRes, oppsRes, recsRes]) => {
      if (!isMounted) return
      if (gapsRes.status === 'fulfilled' && Array.isArray(gapsRes.value)) setGapsList(gapsRes.value)
      if (skillsRes.status === 'fulfilled' && Array.isArray(skillsRes.value)) setUserSkills(skillsRes.value)
      if (oppsRes.status === 'fulfilled' && Array.isArray(oppsRes.value)) setOpportunityMatches(oppsRes.value)
      if (recsRes.status === 'fulfilled' && Array.isArray(recsRes.value)) setRecommendations(recsRes.value)
      setLoading(false)
    })

    return () => { isMounted = false }
  }, [])

  const displaySkills = userSkills.length > 0 ? userSkills : [
    { id: 1, name: 'React.js', proficiency_score: 85 },
    { id: 2, name: 'Python & Django', proficiency_score: 75 },
    { id: 3, name: 'REST APIs & GraphQL', proficiency_score: 70 },
    { id: 4, name: 'Tailwind CSS', proficiency_score: 90 },
  ]

  const displayGaps = gapsList.length > 0 ? gapsList : [
    { name: 'System Design & Architecture', current_score: 40, required_score: 85, priority: 'High' },
    { name: 'Docker & Kubernetes', current_score: 35, required_score: 75, priority: 'Medium' },
    { name: 'CI/CD Pipelines', current_score: 50, required_score: 80, priority: 'Medium' },
  ]

  const readinessScore = userSkills.length > 0 
    ? Math.min(100, Math.round(userSkills.reduce((acc, s) => acc + (s.proficiency_score ?? s.score ?? 50), 0) / userSkills.length))
    : 78

  return (
    <div className="space-y-6 @container">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white font-bold text-lg shadow-subtle shrink-0">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-charcoal sm:text-[28px]">Welcome, {firstName} 👋</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-muted">Career Goal:</span>
              <Badge icon="flag" variant={user?.career_goal ? "default" : "secondary"}>
                {careerGoal}
              </Badge>
              <span className="hidden items-center gap-1.5 text-xs text-muted sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success" /> Account Active ({email})
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/student/notifications" className="relative rounded-xl border border-border bg-white p-2.5 text-charcoal hover:bg-background">
            <AppIcon name="notifications" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">1</span>
          </Link>
          <Link to="/student/ai-assistant" className="rounded-xl bg-primary p-2.5 text-white hover:bg-primary-dark" title="Career AI">
            <AppIcon name="smart_toy" />
          </Link>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 gap-4 @md:grid-cols-2 @2xl:grid-cols-3 @3xl:grid-cols-4 w-full">
        <Card className="flex flex-col justify-between w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Career Readiness</span>
            <Badge variant={readinessScore > 0 ? "success" : "secondary"}>
              {readinessScore > 0 ? "Active" : "New Account"}
            </Badge>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-charcoal">{readinessScore}%</span>
            <span className="text-xs text-muted">Overall Match</span>
          </div>
          <ProgressBar value={readinessScore} size="sm" className="mt-3 w-full" barClassName="bg-primary" />
        </Card>

        <StatCard label="Active Applications" value={opportunityMatches.length} icon="work" trend={100} trendLabel="matched" className="w-full" />
        <StatCard label="Recommended Courses" value={recommendations.length} icon="menu_book" trend={100} trendLabel="tailored" className="w-full" />
        <StatCard label="Assigned Skills" value={userSkills.length} icon="military_tech" trend={100} trendLabel="tracked" className="w-full" />
      </div>

      {/* Skill Snapshot + Gaps */}
      <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2 w-full">
        <Card className="flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-charcoal">My Skill Snapshot</h3>
              <Link to="/student/skills" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
            </div>
            <p className="mt-1 text-xs text-muted">Technical • Tools • Frameworks</p>
            <div className="mt-5 space-y-4">
              {displaySkills.map((s) => {
                const sName = s.skill?.name || s.name || 'Skill'
                const sScore = s.proficiency_score ?? s.score ?? s.level ?? 50
                return (
                  <div key={s.id || sName}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-charcoal">{sName}</span>
                      <span className="text-xs font-bold tabular-nums text-charcoal">{sScore}%</span>
                    </div>
                    <ProgressBar value={sScore} size="sm" barClassName={sScore >= 80 ? 'bg-success' : 'bg-primary'} />
                  </div>
                )
              })}
            </div>
          </div>
          <Link to="/student/assessment" className="mt-5 block">
            <Button variant="outline" size="sm" className="w-full">Take Assessment</Button>
          </Link>
        </Card>

        <Card className="flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-2">
              <AppIcon name="warning" className="text-amber-500" />
              <h3 className="text-base font-bold text-charcoal">Biggest Skill Gaps</h3>
              <Badge variant="default" className="ml-auto bg-amber-500 text-white">
                {displayGaps.length} gaps
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted">Closest to blocking your career goal</p>
            <div className="mt-4 space-y-4">
              {displayGaps.slice(0, 3).map((g) => (
                <div key={g.name || g.skill?.name} className="rounded-xl border border-border bg-background p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-charcoal">{g.name || g.skill?.name}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${(g.priority || g.severity) === 'High' || g.priority === 'Critical' ? 'bg-danger text-white' : 'bg-amber-100 text-amber-800'}`}>
                      {g.priority || g.severity || 'Medium'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">Your {g.yours ?? g.current_score ?? 35}% • Required {g.required ?? g.required_score ?? 80}%</p>
                  <ProgressBar value={g.yours ?? g.current_score ?? 35} size="sm" className="mt-2.5" barClassName="bg-danger" />
                </div>
              ))}
            </div>
          </div>
          <Link to="/student/skill-gap" className="mt-4 block text-center text-sm font-semibold text-primary hover:underline">View full gap analysis →</Link>
        </Card>
      </div>
    </div>
  )
}
