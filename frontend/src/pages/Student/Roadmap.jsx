import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/common/PageHeader'
import AppIcon from '../../components/ui/AppIcon'
import { profileApi } from '../../api/profile.api'
import { skillApi } from '../../api/skill.api'

const statusStyles = {
  completed: { dot: 'bg-success border-success', badge: 'bg-success text-white', label: 'Completed', icon: '✓' },
  current: { dot: 'bg-primary border-primary animate-pulse', badge: 'bg-primary text-white', label: 'Current', icon: '●' },
  recommended: { dot: 'bg-white border-warning text-warning', badge: 'bg-warning text-white', label: 'Recommended', icon: '◆' },
  locked: { dot: 'bg-white border-border text-muted', badge: 'bg-white border border-border text-muted', label: 'Locked', icon: '🔒' },
}

const ROADMAP_TEMPLATES = {
  'Full Stack Developer': [
    { id: 'step-1', title: 'JavaScript & Web Fundamentals', desc: 'HTML5, CSS3, ES6+, Async & DOM Manipulation', skills: ['JavaScript', 'HTML5 & CSS3', 'Tailwind CSS'], duration: '3 weeks' },
    { id: 'step-2', title: 'Frontend Framework & State', desc: 'React.js, Hooks, Component Architecture, Redux Toolkit', skills: ['React.js', 'Tailwind CSS'], duration: '4 weeks' },
    { id: 'step-3', title: 'Backend APIs & Frameworks', desc: 'Django REST Framework, Node.js, Authentication & Middleware', skills: ['Python', 'Django', 'REST APIs'], duration: '4 weeks' },
    { id: 'step-4', title: 'Databases & Query Optimization', desc: 'PostgreSQL, Relational Schemas, Indexing & ORM', skills: ['PostgreSQL', 'SQL'], duration: '3 weeks' },
    { id: 'step-5', title: 'DevOps, Containers & Cloud', desc: 'Docker Containerization, AWS Deployment & CI/CD Pipelines', skills: ['Docker', 'AWS', 'DevOps'], duration: '4 weeks' },
  ],
  'AI / ML Engineer': [
    { id: 'step-1', title: 'Python Programming & Data Analysis', desc: 'Python Data Structures, NumPy, Pandas, Vector Operations', skills: ['Python', 'NumPy', 'Pandas'], duration: '3 weeks' },
    { id: 'step-2', title: 'Classical Machine Learning', desc: 'Supervised/Unsupervised Algorithms, Scikit-learn, Model Evaluation', skills: ['Machine Learning', 'Python'], duration: '4 weeks' },
    { id: 'step-3', title: 'Deep Learning & Neural Networks', desc: 'PyTorch Framework, CNNs, RNNs, Transformers', skills: ['Deep Learning & PyTorch', 'TensorFlow'], duration: '5 weeks' },
    { id: 'step-4', title: 'MLOps & Model Deployment', desc: 'FastAPI Model Serving, Docker Containers, ML Pipelines', skills: ['FastAPI', 'Docker', 'MLOps'], duration: '4 weeks' },
    { id: 'step-5', title: 'LLMs & Generative AI', desc: 'Prompt Engineering, LangChain, RAG Systems, Vector DBs', skills: ['Prompt Engineering', 'LangChain'], duration: '4 weeks' },
  ],
  'Backend Developer': [
    { id: 'step-1', title: 'Core Backend Languages & OOP', desc: 'Python, Java or Node.js object-oriented architecture', skills: ['Python', 'Node.js', 'C++'], duration: '3 weeks' },
    { id: 'step-2', title: 'Web Frameworks & Microservices', desc: 'Django, FastAPI, Express.js & Microservices design', skills: ['Django', 'REST APIs', 'FastAPI'], duration: '4 weeks' },
    { id: 'step-3', title: 'Database Design & Caching', desc: 'PostgreSQL relational schemas, Redis caching layer', skills: ['PostgreSQL', 'Redis'], duration: '3 weeks' },
    { id: 'step-4', title: 'System Architecture & Queues', desc: 'Celery background workers, RabbitMQ/Kafka, System Design', skills: ['Celery', 'System Design'], duration: '4 weeks' },
    { id: 'step-5', title: 'Cloud Infrastructure & Docker', desc: 'Docker containers, Kubernetes, AWS Cloud Architecture', skills: ['Docker', 'AWS', 'Kubernetes'], duration: '4 weeks' },
  ],
}

export default function Roadmap() {
  const [careerGoal, setCareerGoal] = useState('Full Stack Developer')
  const [userSkills, setUserSkills] = useState([])
  const [skillGaps, setSkillGaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const loadRoadmapData = async () => {
      try {
        setLoading(true)
        const [profileData, gapsData] = await Promise.all([
          profileApi.getStudentProfile().catch(() => null),
          skillApi.getSkillGaps().catch(() => []),
        ])

        if (isMounted) {
          if (profileData?.career_goal) {
            setCareerGoal(profileData.career_goal)
          }

          if (profileData?.skills) {
            setUserSkills(profileData.skills)
          }

          if (Array.isArray(gapsData)) {
            setSkillGaps(gapsData)
          }
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadRoadmapData()
    return () => { isMounted = false }
  }, [])

  // Get base steps template or fallback
  const baseTemplate = ROADMAP_TEMPLATES[careerGoal] || ROADMAP_TEMPLATES['Full Stack Developer']

  // Dynamically calculate status for each roadmap step based on student skills
  const studentSkillNames = userSkills.map((s) => (s.skill?.name || '').toLowerCase())

  let foundCurrent = false
  const dynamicRoadmap = baseTemplate.map((step) => {
    // Check how many skills in this step the student has added/completed
    const stepSkills = step.skills.map((s) => s.toLowerCase())
    const matchingSkills = stepSkills.filter((sk) => studentSkillNames.includes(sk))
    const isFullyCompleted = matchingSkills.length > 0 && matchingSkills.length >= Math.ceil(stepSkills.length / 2)

    let status = 'locked'
    if (isFullyCompleted) {
      status = 'completed'
    } else if (!foundCurrent) {
      status = 'current'
      foundCurrent = true
    } else {
      status = 'recommended'
    }

    return {
      ...step,
      status,
    }
  })

  // Identify next recommended milestone skill gap
  const criticalGap = skillGaps.find((g) => g.severity === 'High' && g.status !== 'resolved')
  const nextSkillToLearn = criticalGap?.skill?.name || (dynamicRoadmap.find((s) => s.status === 'current')?.skills?.[0]) || 'Docker & DevOps'

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Career Roadmap — ${careerGoal}`}
        subtitle={`Your personalized vertical timeline for ${careerGoal}. Connected live to your Django database skills.`}
        actions={
          <Link to="/student/skill-gap">
            <Button variant="outline">View Skill Gap</Button>
          </Link>
        }
      />

      {/* AI Recommendation Banner */}
      <Card className="!bg-sage !border-sage !p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shrink-0">
            <AppIcon name="lightbulb" />
          </div>
          <div>
            <p className="text-sm font-bold text-charcoal">AI Recommended Next Step</p>
            <p className="text-sm text-charcoal/80">
              Target Role: <strong>{careerGoal}</strong>. Complete <strong>{nextSkillToLearn}</strong> — it is your most critical gap to reach 85%+ readiness target.
            </p>
          </div>
        </div>
        <Link to="/explore-courses">
          <Button>Start Now →</Button>
        </Link>
      </Card>

      <Card>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] top-2 bottom-2 w-0.5 bg-border hidden sm:block" aria-hidden />

          <div className="space-y-0">
            {dynamicRoadmap.map((step, idx) => {
              const style = statusStyles[step.status] || statusStyles.locked
              return (
                <div key={step.id} className="relative flex gap-4 py-4">
                  {/* Dot icon */}
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${style.dot} ${step.status === 'locked' ? 'text-muted' : 'text-white'}`}>
                    {style.icon}
                  </div>

                  <div className={`flex-1 rounded-2xl border p-4 ${step.status === 'locked' ? 'bg-background border-border opacity-70' : step.status === 'current' ? 'bg-primary/[0.04] border-primary/20 shadow-soft' : 'bg-white border-border'}`}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted">STEP {idx + 1}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${style.badge}`}>{style.label}</span>
                          <span className="text-xs text-muted">{step.duration}</span>
                        </div>
                        <h3 className="mt-1 text-sm font-bold text-charcoal">{step.title}</h3>
                        <p className="text-xs text-muted">{step.desc}</p>
                        {step.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {step.skills.map((s) => {
                              const isOwned = studentSkillNames.includes(s.toLowerCase())
                              return (
                                <span
                                  key={s}
                                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${isOwned ? 'bg-success/15 border-success/30 text-success' : 'bg-sage border-sage text-primary'}`}
                                >
                                  {s} {isOwned ? '✓' : ''}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {step.status === 'completed' && <Badge variant="success">Completed ✓</Badge>}
                        {step.status === 'current' && (
                          <Link to="/explore-courses">
                            <Button size="sm">Continue</Button>
                          </Link>
                        )}
                        {step.status === 'recommended' && (
                          <Link to="/explore-courses">
                            <Button size="sm" variant="outline">Start</Button>
                          </Link>
                        )}
                        {step.status === 'locked' && (
                          <Button size="sm" variant="ghost" disabled>Locked</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}
