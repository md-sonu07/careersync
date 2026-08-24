import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import Pagination from '../../components/ui/Pagination'
import Button from '../../components/ui/Button'
import { mockCourses } from '../../utils/mockData'

const categories = ['All', 'Frontend', 'Backend', 'Data', 'DSA', 'Design']
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
const durations = ['All', '4 weeks', '5 weeks', '6 weeks', '7 weeks', '8 weeks', '10 weeks']

const CourseCard = ({ course }) => (
  <Link to="#" className="group">
    <Card hover className="p-0 overflow-hidden flex flex-col h-full">
      <div className={`h-36 ${course.thumb} border-b border-border flex items-center justify-center relative`}>
        <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">thumbnail</span>
        {course.certificate && <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white border border-border px-2.5 py-1 text-xs font-semibold shadow-soft"><span className="material-symbols-outlined text-[14px] text-success">verified</span> Certificate</span>}
        <span className="absolute bottom-3 left-3 rounded-full bg-charcoal text-white text-xs px-2.5 py-1 font-medium">{course.duration}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="muted" className="text-[11px]">{course.category}</Badge>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${course.difficulty === 'Advanced' ? 'bg-danger/10 text-danger border-danger/20' : course.difficulty === 'Intermediate' ? 'bg-accent/10 text-accent border-accent/20' : 'bg-success/10 text-success border-success/20'}`}>{course.difficulty}</span>
        </div>
        <h3 className="mt-3 font-bold leading-tight text-charcoal group-hover:text-primary line-clamp-2">{course.title}</h3>
        <p className="mt-1 text-sm text-muted">by {course.instructor}</p>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1 font-semibold text-charcoal"><span className="text-accent">★</span> {course.rating}</span>
          <span>•</span>
          <span>{course.students.toLocaleString()} students</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {course.skills.map((s) => (
            <span key={s} className="rounded-full bg-background border border-border px-2.5 py-1 text-xs text-charcoal/70">{s}</span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted">View details →</span>
          <span className="text-xs font-semibold text-primary">Enroll</span>
        </div>
      </div>
    </Card>
  </Link>
)

const Courses = () => {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [level, setLevel] = useState('All')
  const [dur, setDur] = useState('All')
  const [page, setPage] = useState(1)
  const perPage = 6

  const filtered = useMemo(() => {
    return mockCourses.filter((c) => {
      if (cat !== 'All' && c.category !== cat) return false
      if (level !== 'All' && c.level !== level) return false
      if (dur !== 'All' && c.duration !== dur) return false
      if (q && !(`${c.title} ${c.instructor} ${c.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()))) return false
      return true
    })
  }, [q, cat, level, dur])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="bg-background">
      <section className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-charcoal">Course Catalog</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">Curated, gap-driven courses with verified certificates. Filter by level, duration and skill — find what closes your gap fastest.</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="rounded-full bg-white border border-border px-3 py-1.5">{filtered.length} courses</span>
              <span className="rounded-full bg-sage border border-border px-3 py-1.5 text-primary">8 instructors</span>
            </div>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SearchInput value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder="Search courses by title, skill or instructor" />
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Select value={cat} onChange={(e) => { setCat(e.target.value); setPage(1) }} options={categories} placeholder="Category" />
              <Select value={level} onChange={(e) => { setLevel(e.target.value); setPage(1) }} options={levels} placeholder="Level" />
              <Select value={dur} onChange={(e) => { setDur(e.target.value); setPage(1) }} options={durations} placeholder="Duration" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {cat !== 'All' && <button onClick={() => setCat('All')} className="rounded-full bg-primary text-white px-3 py-1.5 text-xs font-medium">Category: {cat} ✕</button>}
            {level !== 'All' && <button onClick={() => setLevel('All')} className="rounded-full bg-primary text-white px-3 py-1.5 text-xs font-medium">Level: {level} ✕</button>}
            {dur !== 'All' && <button onClick={() => setDur('All')} className="rounded-full bg-primary text-white px-3 py-1.5 text-xs font-medium">Duration: {dur} ✕</button>}
            {(cat !== 'All' || level !== 'All' || dur !== 'All' || q) && <button onClick={() => { setCat('All'); setLevel('All'); setDur('All'); setQ(''); setPage(1) }} className="rounded-full bg-white border border-border px-3 py-1.5 text-xs font-medium">Clear all</button>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        {paged.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
        ) : (
          <Card className="p-10 text-center">
            <p className="text-muted">No courses match your filters.</p>
            <button onClick={() => { setQ(''); setCat('All'); setLevel('All'); setDur('All') }} className="mt-3 text-sm font-semibold text-primary">Reset filters</button>
          </Card>
        )}

        <div className="mt-8 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl bg-primary px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white">Not sure where to start?</h3>
            <p className="text-sm text-white/70">Take a 5-minute assessment and get a personalized course roadmap.</p>
          </div>
          <Link to="/register"><Button variant="outline" className="bg-white text-primary border-white hover:bg-white/90">Get my roadmap</Button></Link>
        </div>
      </section>
    </div>
  )
}

export default Courses
