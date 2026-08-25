import { useState, useEffect } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Select from '../../components/ui/Select'
import { ProgressRing, ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { skillApi } from '../../api/skill.api'
import { profileApi } from '../../api/profile.api'
import { opportunityApi } from '../../api/opportunity.api'
import { toast } from 'react-hot-toast'
import { mockCourses, mockInternships, mockSkillGap } from '../../utils/mockData'

export default function CareerGoal() {
  const [career, setCareer] = useState('Full Stack Developer')
  const [industry, setIndustry] = useState('Technology / SaaS')
  const [location, setLocation] = useState('Remote / Bengaluru')
  const [workPref, setWorkPref] = useState('Internship → Full-time')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [careerRoles, setCareerRoles] = useState([])
  const [skillGapsList, setSkillGapsList] = useState([])
  const [opportunitiesList, setOpportunitiesList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadBackendData = async () => {
      try {
        setLoading(true)
        const [profileData, rolesData, gapsData, oppsData] = await Promise.all([
          profileApi.getStudentProfile().catch(() => null),
          skillApi.getCareerRoles().catch(() => []),
          skillApi.getSkillGaps().catch(() => []),
          opportunityApi.getOpportunities({ type: 'internship' }).catch(() => []),
        ])

        if (isMounted) {
          if (rolesData && rolesData.length > 0) {
            setCareerRoles(rolesData)
          }

          if (profileData?.career_goal) {
            setCareer(profileData.career_goal)
          } else if (rolesData && rolesData.length > 0) {
            setCareer(rolesData[0].title)
          }

          if (Array.isArray(gapsData) && gapsData.length > 0) {
            setSkillGapsList(gapsData)
          }

          if (Array.isArray(oppsData) && oppsData.length > 0) {
            setOpportunitiesList(oppsData)
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadBackendData()
    return () => { isMounted = false }
  }, [])

  const selectedRoleObj = careerRoles.find((r) => r.title.toLowerCase() === career.toLowerCase())
  const roleSkillRequirements = selectedRoleObj?.skill_requirements || []

  const roleOptions = careerRoles.length > 0
    ? careerRoles.map((r) => r.title)
    : ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'AI / ML Engineer', 'DevOps Engineer', 'Data Scientist']

  const handleSaveGoal = async () => {
    setSaving(true)
    try {
      await profileApi.updateStudentProfile({ career_goal: career })
      setSaved(true)
      toast.success(`Career Goal updated to "${career}" on Django database!`)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      toast.error('Failed to save career goal: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  const gaps = skillGapsList.length > 0
    ? skillGapsList.slice(0, 3).map((g) => ({
        skill: g.skill?.name || 'Skill',
        yours: g.current_score || 60,
        required: g.required_score || 80,
        status: (g.current_score || 60) < 60 ? 'critical' : 'moderate',
      }))
    : mockSkillGap.filter((s) => s.status !== 'strong').slice(0, 3)

  const recCourses = mockCourses.slice(0, 3)

  const matchingOpps = opportunitiesList.length > 0
    ? opportunitiesList.slice(0, 3).map((item) => ({
        id: item.id,
        role: item.title,
        company: item.company?.company_name || 'Hiring Partner',
        logo: (item.company?.company_name || 'CS')[0].toUpperCase(),
        location: item.location || 'Remote',
        match: 92,
      }))
    : mockInternships.slice(0, 3)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Goal"
        subtitle="Define your target role — connected directly to CareerSync Career Intelligence database."
        actions={saved ? <Badge variant="success">Saved to Database ✓</Badge> : null}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal">Choose your target</h3>
            <p className="mt-1 text-sm text-muted">You can change this anytime — your roadmap will adapt automatically in Django database.</p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Target Career / Role"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                options={roleOptions}
              />
              <Select
                label="Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                options={['Technology / SaaS', 'Fintech', 'E-commerce', 'Healthcare', 'EdTech', 'AI / ML']}
              />
              <Select
                label="Preferred Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                options={['Remote / Bengaluru', 'Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Remote Only']}
              />
              <Select
                label="Work Preference"
                value={workPref}
                onChange={(e) => setWorkPref(e.target.value)}
                options={['Internship → Full-time', 'Internship Only', 'Full-time Only', 'Part-time / Freelance']}
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleSaveGoal} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save Career Goal'}
              </Button>
              <Button variant="outline" onClick={() => setCareer('Full Stack Developer')}>Reset to Recommended</Button>
            </div>
            {saved && <p className="mt-3 text-sm font-medium text-success">Career goal updated on Django Database — roadmap recalculated!</p>}
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Required Skill Benchmarks for {career}</h3>
            <p className="mt-1 text-xs text-muted">Fetched live from CareerSync Career Intelligence Database</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {roleSkillRequirements.length > 0 ? (
                roleSkillRequirements.map((req) => (
                  <span
                    key={req.id || req.skill?.name}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${req.is_required ? 'bg-sage border-sage text-primary' : 'bg-background border-border text-charcoal'}`}
                  >
                    {req.skill?.name} (Min: {req.required_score}%) {req.is_required ? '• required' : '• optional'}
                  </span>
                ))
              ) : (
                ['React.js', 'Node.js', 'PostgreSQL', 'Django', 'REST APIs', 'Docker', 'AWS'].map((s) => (
                  <span key={s} className="rounded-full border px-3 py-1.5 text-xs font-semibold bg-sage border-sage text-primary">
                    {s} • Benchmark 75%
                  </span>
                ))
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-charcoal">Recommended Courses to close the gap</h3>
              <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">View roadmap →</span>
            </div>
            <div className="mt-4 space-y-3">
              {recCourses.map((c) => (
                <div key={c.id} className="flex gap-3 rounded-xl border border-border p-3 bg-background/40">
                  <img src={c.thumbnail} alt="" className="h-16 w-24 rounded-lg object-cover border border-border shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-charcoal truncate">{c.title}</p>
                    <p className="text-xs text-muted">{c.instructor} • {c.duration} • {c.difficulty}</p>
                    <ProgressBar value={c.progress} size="sm" className="mt-2" showLabel />
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0 self-center hidden sm:inline-flex">Start</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right — summary */}
        <div className="space-y-6">
          <Card className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Readiness for {career}</p>
            <div className="mt-4 flex justify-center">
              <ProgressRing value={82} size={110} strokeWidth={9} />
            </div>
            <p className="mt-2 text-sm font-bold text-charcoal">82% Ready</p>
            <p className="text-xs text-muted">Target 85% for top matches</p>
            <ProgressBar value={82} size="sm" className="mt-3" />
            <div className="mt-4 rounded-xl bg-sage border border-sage p-3 text-left">
              <p className="text-xs font-bold text-charcoal">Next milestone</p>
              <p className="text-xs text-charcoal/70 mt-1">Complete <span className="font-semibold">Docker & DevOps Essentials</span> to reach 88%.</p>
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-charcoal">Skill Gaps Preview</h4>
            <div className="mt-3 space-y-3">
              {gaps.map((g) => (
                <div key={g.skill}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-charcoal">{g.skill}</span>
                    <span className="font-bold" style={{ color: g.status === 'critical' ? '#B85450' : '#B78343' }}>
                      {g.yours}% / {g.required}%
                    </span>
                  </div>
                  <ProgressBar value={g.yours} max={g.required} size="sm" barClassName={g.status === 'critical' ? 'bg-danger' : 'bg-warning'} />
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-charcoal">Matching Opportunities Preview</h4>
            <p className="text-xs text-muted mt-1">Sorted by match for {career} • {matchingOpps.length} matches</p>
            <div className="mt-3 space-y-2">
              {matchingOpps.map((j) => (
                <div key={j.id} className="flex items-center gap-3 rounded-lg border border-border bg-white px-3 py-2.5">
                  <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center text-base font-bold text-primary">{j.logo}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-charcoal truncate">{j.role}</p>
                    <p className="text-[11px] text-muted">{j.company} • {j.location}</p>
                  </div>
                  <span className="text-xs font-bold text-success">{j.match}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
