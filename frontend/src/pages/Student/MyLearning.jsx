import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { courseApi } from '../../api/course.api'
import { toast } from 'react-hot-toast'
import { mockCourses } from '../../utils/mockData'
import AppIcon from '../../components/ui/AppIcon';

export default function MyLearning() {
  const [resources, setResources] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const [resData, recData] = await Promise.all([
          courseApi.getResources().catch(() => {
            if (isMounted) {
              toast({
                title: 'Failed to load resources',
                description: 'Could not load learning resources. Please try again.',
                variant: 'destructive',
              })
            }
            return []
          }),
          courseApi.getRecommendations().catch(() => {
            if (isMounted) {
              toast({
                title: 'Failed to load recommendations',
                description: 'Could not load recommendations. Please try again.',
                variant: 'destructive',
              })
            }
            return []
          }),
        ])

        if (isMounted) {
          if (resData && resData.length > 0) setResources(resData)
          if (recData && recData.length > 0) setRecommendations(recData)
        }
      } catch {
        if (isMounted) {
          toast({
            title: 'Error',
            description: 'An unexpected error occurred. Please try again.',
            variant: 'destructive',
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  const handleUpdateStatus = async (id, status) => {
    try {
      await courseApi.updateRecommendationStatus(id, status)
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
      toast({
        title: 'Updated',
        description: 'Recommendation status updated successfully.',
        variant: 'success',
      })
    } catch {
      toast({
        title: 'Failed',
        description: 'Failed to update recommendation status. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const streak = { current: 12, longest: 18 }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Learning & Recommendations"
        subtitle="AI & Skill-Gap driven personalized learning path connected live to CareerSync database."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Recommended Resources</p>
          <p className="mt-1 text-2xl font-bold text-charcoal">{recommendations.length || resources.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Completed Modules</p>
          <p className="mt-1 text-2xl font-bold text-success">
            {recommendations.filter((r) => r.status === 'completed').length || 1}
          </p>
        </Card>
        <Card className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Learning Streak</p>
          <p className="mt-1 text-2xl font-bold text-primary">{streak.current} days 🔥</p>
          <p className="text-xs text-muted">Longest: {streak.longest} days</p>
        </Card>
      </div>

      {/* AI Recommendations Section */}
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-charcoal flex items-center gap-2">
            <AppIcon name="auto_awesome" className="text-primary" /> Personalized Gap Recommendations
          </h3>
          <Badge variant="default">{recommendations.length} Active</Badge>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {recommendations.length > 0 ? (
            recommendations.map((rec) => (
              <div key={rec.id} className="flex flex-col justify-between rounded-2xl border border-border bg-background/40 p-4">
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant={rec.priority === 'high' ? 'danger' : 'default'}>
                      {rec.priority} Priority
                    </Badge>
                    <Badge variant={rec.status === 'completed' ? 'success' : 'muted'}>
                      {rec.status}
                    </Badge>
                  </div>
                  <h4 className="mt-2 text-base font-bold text-charcoal">{rec.resource?.title}</h4>
                  <p className="text-xs text-muted mt-1">{rec.recommended_reason}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  {rec.resource?.content_url && (
                    <a
                      href={rec.resource.content_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button size="sm" className="w-full">Start Resource →</Button>
                    </a>
                  )}
                  {rec.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(rec.id, 'completed')}
                    >
                      Mark Done ✓
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            mockCourses.slice(0, 2).map((c) => (
              <div key={c.id} className="flex gap-4 rounded-2xl border border-border bg-background/40 p-4">
                <img src={c.thumbnail} alt="" className="h-20 w-28 rounded-xl object-cover border border-border shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-charcoal line-clamp-2">{c.title}</h4>
                  <p className="text-xs text-muted">{c.instructor}</p>
                  <ProgressBar value={c.progress} size="sm" className="mt-2" showLabel />
                  <Link to={`/student/courses/${c.id}`}><Button size="sm" className="mt-3">Resume →</Button></Link>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Available Learning Resources */}
      <Card>
        <h3 className="font-bold text-charcoal">All Available Skill Resources</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {resources.map((res) => (
            <div key={res.id} className="rounded-xl border border-border bg-white p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="muted">{res.resource_type}</Badge>
                <span className="text-xs font-bold text-primary">{res.duration_minutes} mins</span>
              </div>
              <h4 className="text-sm font-bold text-charcoal">{res.title}</h4>
              <p className="text-xs text-muted line-clamp-2">{res.description}</p>
              <a href={res.content_url} target="_blank" rel="noopener noreferrer" className="block pt-2">
                <Button size="sm" variant="outline" className="w-full">Open Resource ↗</Button>
              </a>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
