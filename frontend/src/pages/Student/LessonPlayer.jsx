import { useState, useEffect, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import AppIcon from '../../components/ui/AppIcon'
import { courseApi } from '../../api/course.api'
import { getYouTubeVideoId } from '../PublicCourseDetail'
import { toast } from 'react-hot-toast'

export default function LessonPlayer() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [enrollment, setEnrollment] = useState(null)
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const [activeLessonId, setActiveLessonId] = useState(null)
  const [completedLessons, setCompletedLessons] = useState([])
  const [progressPercent, setProgressPercent] = useState(0)
  const [certificateId, setCertificateId] = useState(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [activeTab, setActiveTab] = useState('notes')

  // Load Enrollment / Course Details
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const fetchPlayerData = async () => {
      try {
        // Try fetching as enrollment ID first
        let enrData = null
        try {
          enrData = await courseApi.getEnrollmentDetail(id)
        } catch {
          // If not an enrollment UUID, fetch active enrollments to find match
          const myEnrs = await courseApi.getMyEnrollments()
          enrData = myEnrs.find(e => e.id === id || e.resource?.id === id)
        }

        if (enrData && isMounted) {
          setEnrollment(enrData)
          setCourse(enrData.resource)
          setCompletedLessons(enrData.completed_lessons || [])
          setProgressPercent(enrData.progress_percent || 0)
          setCertificateId(enrData.certificate_id || null)

          // Set active lesson
          const cur = enrData.resource?.curriculum || []
          const allLessons = cur.flatMap(m => m.lessons || [])
          if (allLessons.length > 0) {
            const lastPlayed = enrData.last_played_lesson_id
            const found = allLessons.find(l => l.id === lastPlayed) || allLessons[0]
            setActiveLessonId(found.id)
          }
        } else {
          // Fallback: direct course detail
          const courseData = await courseApi.getCourseDetail(id)
          if (isMounted && courseData) {
            setCourse(courseData)
            const cur = courseData.curriculum || []
            const allLessons = cur.flatMap(m => m.lessons || [])
            if (allLessons.length > 0) setActiveLessonId(allLessons[0].id)
          }
        }
      } catch (err) {
        console.error('Failed to load course player:', err)
        if (isMounted) toast.error('Could not load course player.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchPlayerData()
    return () => { isMounted = false }
  }, [id])

  // Flattened list of all lessons
  const allLessons = useMemo(() => {
    if (!course?.curriculum) return []
    return course.curriculum.flatMap(m => (m.lessons || []).map(l => ({ ...l, moduleTitle: m.title })))
  }, [course])

  // Current active lesson object
  const currentLesson = useMemo(() => {
    if (!allLessons.length) {
      return {
        id: 'default',
        title: course?.title || 'Introduction Lecture',
        video_url: course?.content_url || 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        duration: '25:00',
        moduleTitle: 'Module 1: Overview',
      }
    }
    return allLessons.find(l => l.id === activeLessonId) || allLessons[0]
  }, [allLessons, activeLessonId, course])

  const currentIndex = allLessons.findIndex(l => l.id === currentLesson?.id)
  const isCompleted = completedLessons.includes(currentLesson?.id)

  // Toggle completion of current lesson
  const handleToggleComplete = async () => {
    if (!enrollment?.id || !currentLesson?.id) {
      toast.success('Marked as completed!')
      return
    }

    try {
      setUpdating(true)
      const willComplete = !isCompleted
      const res = await courseApi.updateProgress(enrollment.id, {
        lesson_id: currentLesson.id,
        completed: willComplete,
      })

      setCompletedLessons(res.completed_lessons || [])
      setProgressPercent(res.progress_percent || 0)
      if (res.certificate_id) {
        setCertificateId(res.certificate_id)
        if (res.progress_percent >= 100) {
          setShowCertificate(true)
        }
      }

      if (willComplete) {
        toast.success('Lesson marked complete! 🎉')
      }
    } catch {
      toast.error('Failed to sync progress with backend.')
    } finally {
      setUpdating(false)
    }
  }

  // Navigate to Next Lesson
  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].id)
    }
  }

  // Navigate to Previous Lesson
  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      setActiveLessonId(allLessons[currentIndex - 1].id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
        <p className="text-sm font-semibold text-muted">Loading YouTube video player & playlist…</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="py-20 text-center space-y-4">
        <AppIcon name="error_outline" className="text-4xl text-danger mx-auto" />
        <h3 className="text-lg font-bold text-charcoal">Course Not Found</h3>
        <Link to="/student/my-learning">
          <Button variant="outline">Back to My Learning</Button>
        </Link>
      </div>
    )
  }

  const videoId = getYouTubeVideoId(currentLesson?.video_url || course.content_url || 'https://www.youtube.com/watch?v=bMknfKXIFA8')

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header Bar */}
      <div className="rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-soft flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/student/my-learning')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-slate-50 transition-colors text-charcoal"
            title="Back to My Learning"
          >
            <AppIcon name="arrow_back" className="text-[18px]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                {course.skill?.name || 'Technical'}
              </span>
              <span className="text-xs text-muted">
                Offered by <strong className="text-charcoal font-semibold">{course.institution?.name || 'AKU University'}</strong>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-charcoal leading-tight mt-0.5">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Progress & Certificate Controls */}
        <div className="flex items-center gap-4 border-t border-border pt-3 md:border-t-0 md:pt-0">
          <div className="min-w-[160px]">
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-muted">Progress</span>
              <span className="text-primary font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-muted mt-1">
              {completedLessons.length} of {allLessons.length || 1} completed
            </p>
          </div>

          {progressPercent >= 100 && (
            <Button
              size="sm"
              onClick={() => setShowCertificate(true)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs shadow-soft shrink-0 flex items-center gap-1"
            >
              <AppIcon name="workspace_premium" className="text-[16px]" /> View Certificate
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Video Player (70%) + Right Playlist (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Video Player & Controls */}
        <div className="lg:col-span-8 space-y-4">
          {/* YouTube Video Screen */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-card border border-border">
            {videoId ? (
              <iframe
                key={currentLesson?.id}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={currentLesson?.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white p-6 text-center bg-gradient-to-br from-slate-900 via-primary/80 to-slate-900">
                <AppIcon name="play_circle" className="text-6xl text-emerald-400 mb-3" />
                <p className="text-sm font-semibold">{currentLesson?.title}</p>
                <p className="text-xs text-slate-300 mt-1">Streaming directly from institutional lecture series</p>
              </div>
            )}
          </div>

          {/* Player Controls & Action Bar */}
          <Card className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  {currentLesson?.moduleTitle}
                </span>
                <h2 className="text-lg font-bold text-charcoal mt-0.5">
                  {currentLesson?.title}
                </h2>
                <p className="text-xs text-muted flex items-center gap-1 mt-1">
                  <AppIcon name="schedule" className="text-[14px]" /> {currentLesson?.duration || '15 mins'} • Instructor: {course.instructor_name || 'Faculty Expert'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="sm"
                  variant={isCompleted ? 'secondary' : 'primary'}
                  onClick={handleToggleComplete}
                  disabled={updating}
                  className="text-xs font-bold shadow-soft flex items-center gap-1"
                >
                  <AppIcon name={isCompleted ? 'check_circle' : 'radio_button_unchecked'} className="text-[16px]" />
                  {isCompleted ? 'Completed ✓' : 'Mark as Completed'}
                </Button>
              </div>
            </div>

            {/* Prev / Next Bottom Navigator */}
            <div className="flex items-center justify-between pt-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrevLesson}
                disabled={currentIndex <= 0}
                className="text-xs flex items-center gap-1"
              >
                <AppIcon name="arrow_back" className="text-[14px]" /> Previous
              </Button>

              <span className="text-xs font-semibold text-muted">
                Lesson {currentIndex + 1} of {allLessons.length || 1}
              </span>

              <Button
                size="sm"
                variant="outline"
                onClick={handleNextLesson}
                disabled={currentIndex >= allLessons.length - 1}
                className="text-xs flex items-center gap-1"
              >
                Next <AppIcon name="arrow_forward" className="text-[14px]" />
              </Button>
            </div>
          </Card>

          {/* Lesson Notes & Resources Tabs */}
          <Card className="p-6 space-y-4">
            <div className="flex border-b border-border gap-6">
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'notes' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-charcoal'
                }`}
              >
                Instructor Notes & Code
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'resources' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-charcoal'
                }`}
              >
                Downloadable Resources
              </button>
            </div>

            {activeTab === 'notes' && (
              <div className="space-y-3 text-xs sm:text-sm text-charcoal/90 leading-relaxed">
                <p className="font-semibold text-charcoal">
                  Key Concept Summary for <span className="text-primary">{currentLesson?.title}</span>:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-muted">
                  <li>Follow along with the hands-on coding exercises demonstrated in the lecture.</li>
                  <li>Ensure your local development environment is configured with the latest LTS versions.</li>
                  <li>Complete the practice problem at the end of this module before proceeding.</li>
                </ul>

                <div className="mt-4 rounded-xl bg-slate-900 p-4 text-emerald-300 font-mono text-xs overflow-x-auto">
                  <p className="text-slate-400 mb-2">// Starter command</p>
                  <code>git checkout -b lesson-{currentIndex + 1}</code>
                </div>
              </div>
            )}

            {activeTab === 'resources' && (
              <div className="space-y-2">
                <a
                  href={currentLesson?.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon name="smart_display" className="text-rose-600 text-[20px]" />
                    <div>
                      <p className="text-xs font-bold text-charcoal">Watch on YouTube (HD)</p>
                      <p className="text-[10px] text-muted">Open in external YouTube window</p>
                    </div>
                  </div>
                  <AppIcon name="open_in_new" className="text-muted text-[16px]" />
                </a>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side: Course Playlist Sidebar */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <Card className="p-0 overflow-hidden shadow-card border-border">
            <div className="p-4 bg-slate-50 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-charcoal">Course Playlist</h3>
                <p className="text-[11px] text-muted">{allLessons.length} Total Lessons</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {progressPercent}% Done
              </span>
            </div>

            {/* Modules Accordion List */}
            <div className="max-h-[620px] overflow-y-auto divide-y divide-border/60">
              {course.curriculum && course.curriculum.length > 0 ? (
                course.curriculum.map((module, mIdx) => {
                  const lessons = module.lessons || []

                  return (
                    <div key={mIdx} className="bg-white">
                      <div className="p-3 bg-slate-50/50 border-b border-border/40 font-bold text-xs text-charcoal flex justify-between items-center">
                        <span className="truncate max-w-[200px]">{module.title}</span>
                        <span className="text-[10px] text-muted font-normal">{lessons.length} lessons</span>
                      </div>

                      <div className="divide-y divide-border/30">
                        {lessons.map((lesson) => {
                          const isActive = lesson.id === activeLessonId
                          const isDone = completedLessons.includes(lesson.id)

                          return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLessonId(lesson.id)}
                              className={`w-full p-3.5 flex items-start gap-3 text-left transition-all ${
                                isActive
                                  ? 'bg-primary/10 border-l-4 border-primary text-primary'
                                  : 'hover:bg-slate-50 text-charcoal/80'
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {isDone ? (
                                  <AppIcon name="check_circle" className="text-emerald-600 text-[18px]" />
                                ) : isActive ? (
                                  <AppIcon name="volume_up" className="text-primary text-[18px] animate-pulse" />
                                ) : (
                                  <AppIcon name="play_circle_outline" className="text-slate-400 text-[18px]" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className={`text-xs font-semibold leading-snug line-clamp-2 ${isActive ? 'text-primary font-bold' : ''}`}>
                                  {lesson.title}
                                </p>
                                <span className="text-[10px] text-muted mt-0.5 block">
                                  {lesson.duration || '12:00'}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-6 text-center text-xs text-muted">
                  No modules found.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Verified Certificate Modal */}
      <Modal open={showCertificate} onClose={() => setShowCertificate(false)} title="Verified University Certificate" size="lg">
        <div className="p-4 space-y-6 text-center">
          <div className="border-4 border-double border-emerald-600/60 bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/40 p-8 rounded-2xl shadow-card relative overflow-hidden">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg mb-3">
              <AppIcon name="workspace_premium" className="text-3xl" />
            </div>

            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Certificate of Excellence & Completion
            </p>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal mt-4 font-serif">
              {course.title}
            </h3>

            <p className="text-xs text-muted mt-3 max-w-md mx-auto">
              This is to officially certify that the student has successfully completed all academic lectures, assignments, and curriculum benchmarks endorsed by <strong>{course.institution?.name || 'AKU University'}</strong>.
            </p>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between text-xs text-muted">
              <div>
                <p className="font-mono font-bold text-charcoal">ID: {certificateId || 'CS-AKU-98A1B02C'}</p>
                <p className="text-[10px]">Verified by CareerSync Engine</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-charcoal">{course.instructor_name || 'Dean of Engineering'}</p>
                <p className="text-[10px]">Academic Authority</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setShowCertificate(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()} className="shadow-soft flex items-center gap-1">
              <AppIcon name="print" className="text-[16px]" /> Print / Download PDF
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
