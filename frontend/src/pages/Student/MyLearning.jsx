import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import PageHeader from '../../components/common/PageHeader'
import AppIcon from '../../components/ui/AppIcon'
import { courseApi } from '../../api/course.api'
import { toast } from 'react-hot-toast'

export default function MyLearning() {
  const navigate = useNavigate()
  const [enrollments, setEnrollments] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    Promise.all([
      courseApi.getMyEnrollments().catch(() => []),
      courseApi.getRecommendations().catch(() => []),
    ])
      .then(([enrs, recs]) => {
        if (isMounted) {
          setEnrollments(Array.isArray(enrs) ? enrs : [])
          setRecommendations(Array.isArray(recs) ? recs : [])
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => { isMounted = false }
  }, [])

  const handleUpdateRecStatus = async (id, status) => {
    try {
      await courseApi.updateRecommendationStatus(id, status)
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      toast.success('Recommendation updated!')
    } catch {
      toast.error('Failed to update recommendation status.')
    }
  }

  const completedCount = enrollments.filter(e => e.status === 'completed' || e.progress_percent >= 100).length
  const inProgressCount = enrollments.length - completedCount

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning & Course Dashboard"
        subtitle="Track your active university lecture series, video progress, and verified course certificates."
      />

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Enrolled Courses</p>
          <p className="mt-1 text-3xl font-extrabold text-charcoal">{enrollments.length}</p>
          <p className="text-xs text-muted mt-1">{inProgressCount} in progress</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Completed & Certified</p>
          <p className="mt-1 text-3xl font-extrabold text-emerald-600">{completedCount}</p>
          <p className="text-xs text-emerald-700/80 mt-1">Verified certificates</p>
        </Card>

        <Card className="p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Learning Streak</p>
          <p className="mt-1 text-3xl font-extrabold text-amber-500">12 Days 🔥</p>
          <p className="text-xs text-muted mt-1">Keep up the daily momentum!</p>
        </Card>
      </div>

      {/* 1. Active Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-charcoal flex items-center gap-2">
              <AppIcon name="play_circle" className="text-primary text-[22px]" />
              My Enrolled Courses ({enrollments.length})
            </h3>
            <p className="text-xs text-muted">Pick up right where you left off with your interactive video player.</p>
          </div>

          <Link to="/courses">
            <Button variant="outline" size="sm" className="text-xs font-bold flex items-center gap-1">
              Browse More Courses <AppIcon name="arrow_forward" className="text-[14px]" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Loading your enrolled courses…</div>
        ) : enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => {
              const res = enr.resource || {}
              const progress = enr.progress_percent || 0
              const isDone = enr.status === 'completed' || progress >= 100

              return (
                <div
                  key={enr.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-soft hover:shadow-card transition-all duration-300"
                >
                  <div>
                    {/* Top Thumbnail / Skill Header */}
                    <div className="aspect-video relative rounded-xl overflow-hidden bg-slate-900 mb-3.5 border border-border">
                      <img
                        src={res.thumbnail_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'}
                        alt={res.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 justify-between text-white text-xs font-semibold">
                        <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[11px]">
                          {res.skill?.name || 'Technical'}
                        </span>
                        <span>{Math.round((res.duration_minutes || 60) / 60)} Hours</span>
                      </div>
                    </div>

                    {/* Title & University */}
                    <h4 className="font-bold text-charcoal text-base group-hover:text-primary transition-colors line-clamp-2">
                      {res.title}
                    </h4>
                    <p className="text-xs text-muted mt-1 truncate">
                      {res.institution?.name || 'AKU University'} • {res.instructor_name || 'Faculty Expert'}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 space-y-1.5 bg-background/60 p-3 rounded-xl border border-border/60">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted">Course Completion</span>
                        <span className="text-primary font-bold">{progress}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isDone ? 'bg-emerald-500' : 'bg-primary'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Button */}
                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <AppIcon name="workspace_premium" className="text-[15px]" /> Certified ✓
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">
                        {(enr.completed_lessons || []).length} lessons done
                      </span>
                    )}

                    <Button
                      size="sm"
                      onClick={() => navigate(`/student/learning/${enr.id}`)}
                      className="text-xs font-bold shadow-soft flex items-center gap-1"
                    >
                      <AppIcon name="play_arrow" className="text-[16px]" />
                      {progress > 0 ? 'Resume Video' : 'Start Lecture'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <Card className="py-14 text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <AppIcon name="school" className="text-3xl" />
            </div>
            <h4 className="text-base font-bold text-charcoal">No Enrolled Courses Yet</h4>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Browse our verified institutional curriculum to enroll in free and certified upskilling courses.
            </p>
            <div className="pt-2">
              <Link to="/courses">
                <Button className="font-bold text-xs shadow-soft">
                  Explore Courses Directory →
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* 2. Personalized AI Recommendations */}
      {recommendations.length > 0 && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal flex items-center gap-2">
                <AppIcon name="auto_awesome" className="text-primary" />
                AI Skill Gap Recommendations
              </h3>
              <p className="text-xs text-muted">Recommended based on your recent skill assessments and target career role.</p>
            </div>
            <Badge variant="default">{recommendations.length} Active</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex flex-col justify-between rounded-xl border border-border bg-slate-50/50 p-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant={rec.priority === 'high' ? 'danger' : 'default'}>
                      {rec.priority} Priority
                    </Badge>
                    <span className="text-[11px] font-semibold text-muted uppercase">
                      {rec.skill_name || 'Skill'}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-charcoal">{rec.resource?.title}</h4>
                  <p className="text-xs text-muted mt-1">{rec.reason || 'Curated to fill critical benchmark gaps.'}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link to={`/courses/${rec.resource?.id}`} className="flex-1">
                    <Button size="sm" className="w-full text-xs font-bold">
                      View Course →
                    </Button>
                  </Link>
                  {rec.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateRecStatus(rec.id, 'completed')}
                      className="text-xs"
                    >
                      Mark Done ✓
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
