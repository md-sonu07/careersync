import { Link, useParams } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { ProgressBar } from '../../components/ui/Progress'
import PageHeader from '../../components/common/PageHeader'
import { mockCourseDetail, mockCourses } from '../../utils/mockData'

export default function CourseDetail() {
  const { id } = useParams()
  const course = mockCourses.find((c) => c.id === id) || mockCourses[0]
  const detail = mockCourseDetail

  return (
    <div className="space-y-6">
      <Link to="/student/learning" className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-primary">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Back to Learning
      </Link>

      {/* Header */}
      <Card className="overflow-hidden !p-0">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          <div className="relative lg:col-span-3">
            <img src={course.thumbnail} alt={course.title} className="h-64 w-full object-cover lg:h-full lg:min-h-[360px]" />
            <div className="absolute inset-0 flex items-center justify-center bg-charcoal/20">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 border border-white shadow-card">
                <span className="material-symbols-outlined text-primary text-[28px]">play_arrow</span>
              </div>
            </div>
          </div>
          <div className="p-6 lg:col-span-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">{course.difficulty}</Badge>
              <Badge variant="muted">{course.duration} • {detail.lessons} lessons</Badge>
            </div>
            <h1 className="mt-3 text-xl font-bold leading-tight text-charcoal sm:text-2xl">{detail.title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted">{detail.description}</p>

            <div className="mt-4 flex items-center gap-3">
              <img src={detail.instructor.avatar} alt="" className="h-10 w-10 rounded-full border border-border" />
              <div>
                <p className="text-sm font-semibold text-charcoal">{detail.instructor.name}</p>
                <p className="text-xs text-muted">{detail.instructor.role}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-1"><span className="material-symbols-outlined text-[16px] text-amber-500">star</span> {detail.rating} ({detail.reviewsCount})</span>
              <span>• {detail.students.toLocaleString()} students</span>
              <span>• Updated {detail.lastUpdated}</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {detail.skills.map((s) => (
                <span key={s} className="rounded-full bg-sage px-2.5 py-1 text-xs font-semibold text-primary border border-sage">{s}</span>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-1.5 flex justify-between text-xs"><span className="font-medium text-muted">Your progress</span><span className="font-bold text-charcoal">{course.progress}%</span></div>
              <ProgressBar value={course.progress} size="md" />
              <Button className="mt-4 w-full" size="lg">{course.progress > 0 ? 'Continue Learning →' : 'Enroll Now — Free'}</Button>
              <p className="mt-2 text-center text-xs text-muted">Certificate on completion • Lifetime access</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Modules */}
        <Card className="lg:col-span-2">
          <h3 className="font-bold text-charcoal">Course Content — {detail.modules.length} modules</h3>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border overflow-hidden">
            {detail.modules.map((m) => (
              <div key={m.id} className={`flex items-center gap-3 px-4 py-3 ${m.current ? 'bg-sage/50' : 'bg-white'}`}>
                <div className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold shrink-0 ${m.completed ? 'bg-success border-success text-white' : m.current ? 'bg-primary border-primary text-white' : 'bg-white border-border text-muted'}`}>
                  {m.completed ? '✓' : m.current ? '▶' : '○'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${m.current ? 'text-primary' : 'text-charcoal'}`}>{m.title}</p>
                  <p className="text-xs text-muted">{m.lessons} lessons • {m.duration}</p>
                </div>
                {m.current && <Badge variant="default">Current</Badge>}
              </div>
            ))}
          </div>

          <h3 className="mt-8 font-bold text-charcoal">What you’ll learn</h3>
          <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {detail.outcomes.map((o, i) => (
              <li key={i} className="flex gap-2 text-sm text-charcoal/80"><span className="text-success">✓</span> {o}</li>
            ))}
          </ul>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-charcoal">Certificate</h3>
            <div className="mt-3 rounded-xl border border-border bg-background p-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white border border-border text-primary"><span className="material-symbols-outlined">workspace_premium</span></div>
              <p className="mt-2 text-sm font-semibold text-charcoal">Earn a verified certificate</p>
              <p className="text-xs text-muted">Share on LinkedIn after 100% completion</p>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold text-charcoal">Reviews ({detail.reviewsCount})</h3>
            <div className="mt-4 space-y-4">
              {detail.reviews.map((r, i) => (
                <div key={i} className="border-b border-border pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-charcoal">{r.name}</span>
                    <span className="text-amber-500 text-xs">{'★'.repeat(r.rating)}</span>
                    <span className="text-xs text-muted">{r.date}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{r.text}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
