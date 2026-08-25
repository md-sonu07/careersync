import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import PaymentModal from '../components/ui/PaymentModal'
import AppIcon from '../components/ui/AppIcon'
import { courseApi } from '../api/course.api'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'

// Helper to extract YouTube video ID
export const getYouTubeVideoId = (url = '') => {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

// 90-Second Restricted Teaser Component
const RestrictedTeaserPlayer = ({ videoId, course, onClose, onBuyClick }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const MAX_SECONDS = 90

  useEffect(() => {
    let interval = null
    if (isPlaying && !isExpired) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev >= MAX_SECONDS - 1) {
            setIsExpired(true)
            setIsPlaying(false)
            return MAX_SECONDS
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isExpired])

  const handleReplay = () => {
    setSecondsElapsed(0)
    setIsExpired(false)
    setIsPlaying(true)
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const progressPercent = Math.min(100, (secondsElapsed / MAX_SECONDS) * 100)

  return (
    <div className="space-y-4">
      {/* Video Container / Paywall Overlay */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-border shadow-2xl">
        {!isExpired && videoId ? (
          <>
            {/* Embedded YouTube without native seek bar */}
            <iframe
              key={secondsElapsed === 0 ? 'fresh' : 'playing'}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0&iv_load_policy=3&start=0&end=90`}
              title={course.title}
              className="w-full h-full border-0 pointer-events-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />

            {/* Custom Floating Top Badge */}
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 pointer-events-none z-10">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              Free 90s Teaser (Seeking Disabled)
            </div>

            {/* Custom 90s Bottom Progress Bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 z-10 space-y-1.5">
              <div className="flex items-center justify-between text-white text-[11px] font-semibold">
                <span>{formatTime(secondsElapsed)}</span>
                <span className="text-amber-300">Teaser Limit: 1:30</span>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          /* Locked Paywall Screen when 90s Ends */
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-primary/95 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-lg">
              <AppIcon name="lock" className="text-4xl" />
            </div>

            <div className="space-y-1 max-w-md">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Sample Preview Expired</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Unlock the Complete {course.title}
              </h3>
              <p className="text-xs text-slate-300">
                Enroll now to get unlimited lifetime access to all 5+ hours of video lectures, source code, and your Verified University Certificate!
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={onBuyClick}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold shadow-xl flex items-center gap-2"
              >
                <AppIcon name="shopping_cart" className="text-[18px]" />
                Buy Full Course — ₹{Number(course.price || 499).toLocaleString()}
              </Button>
              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-lg font-bold text-sm bg-white/15 hover:bg-white/25 text-white border border-white/40 backdrop-blur-md transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <AppIcon name="replay" className="text-[18px]" />
                Replay Teaser ↺
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Information Card */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-charcoal flex items-center gap-1.5">
            <AppIcon name="security" className="text-emerald-700 text-[16px]" />
            Strict 90-Second Sample Preview
          </p>
          <p className="text-[11px] text-muted mt-0.5">
            Seeking into full lectures is protected. All chapters unlock inside the Student LMS player immediately after purchase.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" onClick={onBuyClick} className="font-bold shadow-soft">
            Buy Course — ₹{Number(course.price || 499).toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  )
}

const PublicCourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('curriculum')
  const [openModules, setOpenModules] = useState({ 0: true })
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    courseApi.getCourseDetail(id)
      .then((data) => {
        if (isMounted) setCourse(data)
      })
      .catch(() => {
        if (isMounted) setCourse(null)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [id])

  const toggleModule = (idx) => {
    setOpenModules(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  // Handle Free 1-Click Enrollment
  const handleFreeEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${id}?action=enroll`)}`)
      return
    }

    if (user?.role !== 'student') {
      toast.error('Please login with a Student account to enroll.')
      return
    }

    try {
      setEnrolling(true)
      const res = await courseApi.enrollCourse(course.id, {
        payment_method: 'FREE_PASS',
        amount: 0.00,
      })
      toast.success(res.message || 'Enrolled successfully!')
      const enrId = res.enrollment?.id
      if (enrId) {
        navigate(`/student/learning/${enrId}`)
      } else {
        navigate('/student/my-learning')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Enrollment failed. Please try again.')
    } finally {
      setEnrolling(false)
    }
  }

  // Handle Paid Enrollment Button Click
  const handlePaidBuyClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${id}?action=buy`)}`)
      return
    }
    if (user?.role !== 'student') {
      toast.error('Please login with a Student account to purchase courses.')
      return
    }
    setIsPaymentOpen(true)
  }

  // Auto-open payment modal or trigger enrollment if student redirected back from login
  useEffect(() => {
    if (!loading && course && isAuthenticated && user?.role === 'student' && !course.is_enrolled) {
      const params = new URLSearchParams(location.search)
      const action = params.get('action')
      if (action === 'buy' && !course.is_free && Number(course.price) > 0) {
        setIsPaymentOpen(true)
      } else if (action === 'enroll' && (course.is_free || Number(course.price) === 0)) {
        handleFreeEnroll()
      }
    }
  }, [loading, course, isAuthenticated, location.search])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
        <p className="text-sm font-semibold text-muted">Loading live course curriculum & details…</p>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-danger/10 text-danger flex items-center justify-center mb-4">
          <AppIcon name="error_outline" className="text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal">Course Not Found</h2>
        <p className="text-sm text-muted mt-2 max-w-md">
          The course you are looking for is either inactive or does not exist.
        </p>
        <Link to="/courses" className="mt-6">
          <Button>Back to Courses Directory</Button>
        </Link>
      </div>
    )
  }

  const tag = course.skill?.name || 'Technical'
  const institute = course.institution?.name || 'Academic Institution'
  const duration = course.duration_minutes ? `${Math.round(course.duration_minutes / 60)} Hours` : '4 Weeks'
  const isFree = course.is_free || Number(course.price) === 0
  const isEnrolled = course.is_enrolled
  const priceNum = Number(course.price || 0)
  const origPriceNum = Number(course.original_price || 0)
  const discountPercent = (origPriceNum > priceNum && priceNum > 0) ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100) : 0

  const previewVideoId = getYouTubeVideoId(previewVideoUrl || course.content_url)

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-surface border-b border-border py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <Link to="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-primary">{tag}</span>
            <span>/</span>
            <span className="text-charcoal truncate max-w-[240px]">{course.title}</span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-md">
              {tag}
            </span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize border ${
              course.level === 'advanced'
                ? 'bg-danger/10 text-danger border-danger/20'
                : course.level === 'intermediate'
                ? 'bg-amber-500/10 text-amber-700 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
            }`}>
              {course.level || 'Beginner'}
            </span>
            {course.certificate_included && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-border px-2.5 py-0.5 text-xs font-semibold text-slate-700 shadow-xs">
                <AppIcon name="verified" className="text-[14px] text-emerald-600" /> Verified Certificate
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-charcoal tracking-tight max-w-4xl leading-tight">
            {course.title}
          </h1>

          <p className="text-sm md:text-base text-muted max-w-3xl leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                <AppIcon name="school" className="text-[16px]" />
              </div>
              <span>Offered by <span className="font-bold text-charcoal">{institute}</span></span>
            </div>
            {course.instructor_name && (
              <>
                <span>•</span>
                <span>Instructor: <span className="font-semibold text-charcoal">{course.instructor_name}</span></span>
              </>
            )}
            <span>•</span>
            <div className="flex items-center gap-1 font-semibold text-charcoal">
              <span className="text-amber-500">★</span> {course.rating || 4.9}
              <span className="text-muted font-normal">({course.enrolled_count || 0} enrolled)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Video Player / Curriculum / What you will learn */}
          <div className="lg:col-span-8 space-y-8">
            {/* Course Trailer Poster & Teaser Trigger (Udemy/Coursera Paywall Style) */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-slate-950 shadow-card group">
              <img
                src={course.thumbnail_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&auto=format&fit=crop&q=80'}
                alt={course.title}
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />

              {/* Center Play Trailer Button */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40 flex flex-col items-center justify-center p-6 text-center text-white">
                <button
                  onClick={() => setPreviewVideoUrl(course.content_url || 'https://www.youtube.com/watch?v=bMknfKXIFA8')}
                  className="group/btn flex items-center gap-3 bg-white/95 text-slate-900 px-6 py-3 rounded-2xl font-bold shadow-2xl hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
                    <AppIcon name="play_arrow" className="text-2xl" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wider font-extrabold text-primary">Preview This Course</p>
                    <p className="text-sm font-bold text-slate-900">Watch 90s Teaser</p>
                  </div>
                </button>

                <p className="text-xs text-slate-300 mt-4 flex items-center gap-1.5 font-medium bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
                  <AppIcon name="lock" className="text-[14px] text-amber-400" />
                  {isEnrolled
                    ? 'You are enrolled! Full interactive player unlocked.'
                    : `Full ${duration} of HD video lectures unlocked upon enrollment.`
                  }
                </p>
              </div>
            </div>

            {/* What You'll Learn (Dynamic from DB) */}
            {course.what_you_will_learn && course.what_you_will_learn.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                  <AppIcon name="auto_awesome" className="text-primary text-[20px]" />
                  What You Will Learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {course.what_you_will_learn.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-charcoal/90">
                      <AppIcon name="check_circle" className="text-emerald-600 text-[18px] shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Tabs for Curriculum, FAQs, Overview */}
            <div className="space-y-4">
              <div className="flex border-b border-border gap-6">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`pb-3 text-sm font-bold transition-all relative ${
                    activeTab === 'curriculum'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted hover:text-charcoal'
                  }`}
                >
                  Course Curriculum & Lectures
                </button>
                {course.faqs && course.faqs.length > 0 && (
                  <button
                    onClick={() => setActiveTab('faqs')}
                    className={`pb-3 text-sm font-bold transition-all relative ${
                      activeTab === 'faqs'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted hover:text-charcoal'
                    }`}
                  >
                    Frequently Asked Questions ({course.faqs.length})
                  </button>
                )}
              </div>

              {/* Tab Content 1: Dynamic Curriculum with Locked Paywalls */}
              {activeTab === 'curriculum' && (
                <div className="space-y-3">
                  {course.curriculum && course.curriculum.length > 0 ? (
                    course.curriculum.map((module, mIdx) => {
                      const isOpen = !!openModules[mIdx]
                      const lessons = module.lessons || []

                      return (
                        <div key={mIdx} className="rounded-xl border border-border bg-white overflow-hidden shadow-soft">
                          <button
                            onClick={() => toggleModule(mIdx)}
                            className="w-full p-4 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/80 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <AppIcon
                                name={isOpen ? 'expand_more' : 'chevron_right'}
                                className="text-muted text-xl transition-transform"
                              />
                              <div>
                                <h4 className="font-bold text-sm text-charcoal">{module.title}</h4>
                                <p className="text-[11px] text-muted">
                                  {lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} • {module.duration || '45 mins'}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-primary">
                              {isOpen ? 'Collapse' : 'Expand'}
                            </span>
                          </button>

                          {isOpen && (
                            <div className="divide-y divide-border/60 bg-white">
                              {lessons.map((lesson, lIdx) => (
                                <div
                                  key={lesson.id || lIdx}
                                  className="p-3.5 pl-11 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <AppIcon name={lesson.is_preview ? 'play_circle' : 'lock'} className={`text-[18px] shrink-0 ${lesson.is_preview ? 'text-primary' : 'text-slate-400'}`} />
                                    <div>
                                      <p className="text-xs font-medium text-charcoal">{lesson.title}</p>
                                      <p className="text-[10px] text-muted">{lesson.duration || '10:00'}</p>
                                    </div>
                                  </div>

                                  {lesson.is_preview ? (
                                    <button
                                      onClick={() => setPreviewVideoUrl(lesson.video_url)}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md hover:bg-emerald-100 transition-colors cursor-pointer"
                                    >
                                      <AppIcon name="visibility" className="text-[13px]" /> 90s Teaser
                                    </button>
                                  ) : (
                                    <span className="text-[11px] text-muted flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                                      <AppIcon name="lock" className="text-[13px]" /> Full Course
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <Card className="p-8 text-center text-muted text-xs">
                      Comprehensive video curriculum and hands-on modules are published inside the student player upon enrollment.
                    </Card>
                  )}
                </div>
              )}

              {/* Tab Content 2: FAQs */}
              {activeTab === 'faqs' && (
                <div className="space-y-3">
                  {course.faqs?.map((f, idx) => (
                    <Card key={idx} className="p-4 space-y-1">
                      <h4 className="font-bold text-xs md:text-sm text-charcoal flex items-center gap-2">
                        <AppIcon name="help_outline" className="text-primary text-[16px]" />
                        {f.q}
                      </h4>
                      <p className="text-xs md:text-sm text-muted pl-6">{f.a}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Sticky Enrollment & Pricing Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <Card className="p-6 space-y-5 shadow-card border-border bg-white rounded-2xl">
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-2">
                    {isFree ? (
                      <span className="text-3xl font-extrabold text-emerald-600">
                        FREE <span className="text-sm font-semibold text-muted line-through">₹{origPriceNum > 0 ? origPriceNum : 1999}</span>
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-extrabold text-charcoal">
                          ₹{priceNum.toLocaleString()}
                        </span>
                        {origPriceNum > 0 && (
                          <span className="text-base text-muted line-through">
                            ₹{origPriceNum.toLocaleString()}
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-muted mt-1">
                    {isFree ? '100% Free Institutional Pass • Lifetime Access' : 'Includes 18% GST • Lifetime Video & Code Access'}
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="space-y-2">
                  {isEnrolled ? (
                    <Button
                      onClick={() => navigate(course.enrollment_id ? `/student/learning/${course.enrollment_id}` : '/student/my-learning')}
                      className="w-full text-sm font-bold py-3 shadow-soft bg-emerald-600 hover:bg-emerald-700"
                      size="lg"
                    >
                      <AppIcon name="play_arrow" className="mr-1" />
                      Resume Course (My Learning)
                    </Button>
                  ) : isFree ? (
                    <Button
                      onClick={handleFreeEnroll}
                      disabled={enrolling}
                      className="w-full text-sm font-bold py-3 shadow-soft"
                      size="lg"
                    >
                      {enrolling ? 'Enrolling...' : 'Enroll for Free (1-Click) →'}
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePaidBuyClick}
                      className="w-full text-sm font-bold py-3 shadow-soft"
                      size="lg"
                    >
                      Buy Course — ₹{priceNum.toLocaleString()}
                    </Button>
                  )}

                  {!isAuthenticated && (
                    <p className="text-[11px] text-center text-muted mt-1">
                      You will be asked to sign in or register before starting.
                    </p>
                  )}
                </div>

                {/* Included Features */}
                <div className="border-t border-border pt-4 space-y-3 text-xs text-charcoal/80">
                  <p className="font-bold text-charcoal uppercase tracking-wider text-[11px]">This Course Includes:</p>
                  <div className="flex items-center gap-2">
                    <AppIcon name="schedule" className="text-primary text-[18px]" />
                    <span>{duration} of HD video lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppIcon name="verified" className="text-emerald-600 text-[18px]" />
                    <span>Verified University Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppIcon name="devices" className="text-primary text-[18px]" />
                    <span>Access on Mobile & Desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppIcon name="all_inclusive" className="text-primary text-[18px]" />
                    <span>Full Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppIcon name="assignment" className="text-primary text-[18px]" />
                    <span>Hands-on Code & Capstone Project</span>
                  </div>
                </div>

                {/* Guarantee Banner */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700">
                    <AppIcon name="verified_user" className="text-[16px]" /> Certified Curriculum
                  </div>
                  <p className="text-[10px] text-muted">Endorsed by University Training & Placement Cells.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Restricted 90s Teaser Modal */}
      <Modal
        open={!!previewVideoUrl}
        onClose={() => setPreviewVideoUrl(null)}
        title={`${course.title} — Official 90s Teaser`}
        size="lg"
      >
        <RestrictedTeaserPlayer
          videoId={previewVideoId}
          course={course}
          onClose={() => setPreviewVideoUrl(null)}
          onBuyClick={() => {
            setPreviewVideoUrl(null)
            if (isFree) handleFreeEnroll()
            else handlePaidBuyClick()
          }}
        />
      </Modal>

      {/* Payment Gateway Modal */}
      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        course={course}
        onPaymentSuccess={(enrId) => {
          setIsPaymentOpen(false)
          if (enrId) {
            navigate(`/student/learning/${enrId}`)
          } else {
            navigate('/student/my-learning')
          }
        }}
      />
    </div>
  )
}

export default PublicCourseDetail
