import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import Pagination from '../../components/ui/Pagination'
import Button from '../../components/ui/Button'
import AppIcon from '../../components/ui/AppIcon'
import { courseApi } from '../../api/course.api'

// Fallback high-res curated thumbnails for tech topics
const getTopicThumbnail = (title = '', skill = '') => {
  const t = (title + ' ' + skill).toLowerCase()
  if (t.includes('data structure') || t.includes('algorithm') || t.includes('dsa')) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=700&auto=format&fit=crop&q=80'
  }
  if (t.includes('cloud') || t.includes('docker') || t.includes('devops') || t.includes('kubernetes')) {
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&auto=format&fit=crop&q=80'
  }
  if (t.includes('machine learning') || t.includes('ai') || t.includes('pytorch') || t.includes('data science')) {
    return 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=700&auto=format&fit=crop&q=80'
  }
  if (t.includes('python') || t.includes('django')) {
    return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=700&auto=format&fit=crop&q=80'
  }
  if (t.includes('react') || t.includes('frontend') || t.includes('full stack') || t.includes('web')) {
    return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=700&auto=format&fit=crop&q=80'
  }
  return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=700&auto=format&fit=crop&q=80'
}

export const ModernCourseCard = ({ course }) => {
  const navigate = useNavigate()
  const [imgError, setImgError] = useState(false)

  const duration = course.duration_minutes ? `${Math.round(course.duration_minutes / 60)} Hours` : '4 Weeks'
  const tag = course.skill?.name || 'Engineering'
  const institute = course.institution?.name || 'Academic Institution'
  const rating = course.rating || 4.9
  const studentsCount = course.enrolled_count || 0

  const levelColor = {
    beginner: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    intermediate: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    advanced: 'bg-rose-500/10 text-rose-700 border-rose-500/20',
  }[course.level?.toLowerCase()] || 'bg-slate-500/10 text-slate-700 border-slate-500/20'

  const imgSrc = (!imgError && (course.thumbnail_url || getTopicThumbnail(course.title, tag)))

  return (
    <div
      onClick={() => navigate(`/courses/${course.id}`)}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Top Banner Image with Glassmorphism Badges */}
      <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={course.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-primary/90 to-slate-900 text-white p-6 text-center">
            <AppIcon name="menu_book" className="text-4xl text-emerald-400 mb-2 opacity-80" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">{tag}</span>
          </div>
        )}

        {/* Top Floating Glass Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize backdrop-blur-md bg-white/90 shadow-sm border ${levelColor}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {course.level || 'Beginner'}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 backdrop-blur-md bg-white/90 shadow-sm border border-white/40">
            <AppIcon name="verified" className="text-[14px] text-emerald-600" />
            Verified
          </span>
        </div>

        {/* Bottom Overlay Gradient with Metadata */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3.5 pt-8 flex items-center justify-between text-white text-xs font-semibold">
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <AppIcon name="schedule" className="text-[14px] text-emerald-400" />
            {duration}
          </span>
          <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <span className="text-amber-400 font-bold">★</span> {rating}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Skill category tag */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
              {tag}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-charcoal text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Institution & Instructor Byline */}
          <div className="mt-2.5 space-y-0.5">
            <p className="text-xs font-semibold text-charcoal flex items-center gap-1 truncate">
              <AppIcon name="apartment" className="text-primary text-[14px] shrink-0" />
              <span className="truncate">{institute}</span>
            </p>
            {course.instructor_name && (
              <p className="text-[11px] text-muted truncate pl-4">
                by {course.instructor_name}
              </p>
            )}
          </div>

          {/* Description snippet */}
          {course.description && (
            <p className="mt-3 text-xs text-muted line-clamp-2 leading-relaxed bg-background/60 p-2.5 rounded-xl border border-border/50">
              {course.description}
            </p>
          )}
        </div>

        {/* Card Footer Action */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex flex-col">
            {Number(course.price || 0) === 0 || course.is_free ? (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-emerald-600">FREE</span>
                <span className="text-[11px] text-muted line-through">₹1,499</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-charcoal">₹{Number(course.price).toLocaleString()}</span>
                {course.original_price && Number(course.original_price) > Number(course.price) && (
                  <span className="text-[11px] text-muted line-through">₹{Number(course.original_price).toLocaleString()}</span>
                )}
              </div>
            )}
            <span className="text-[10px] text-muted">{studentsCount} students</span>
          </div>

          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/courses/${course.id}`)
            }}
            className="flex items-center gap-1 text-xs shadow-soft group-hover:bg-primary/90"
          >
            {Number(course.price || 0) === 0 || course.is_free ? 'Enroll Free →' : 'View Course →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('All')
  const [page, setPage] = useState(1)
  const perPage = 6

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    courseApi.getResources()
      .then((data) => {
        if (isMounted) {
          const list = Array.isArray(data) ? data : data?.results || []
          setCourses(list)
        }
      })
      .catch(() => {
        if (isMounted) setCourses([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => { isMounted = false }
  }, [])

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (levelFilter !== 'All' && c.level?.toLowerCase() !== levelFilter.toLowerCase()) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchTitle = c.title?.toLowerCase().includes(q)
        const matchSkill = c.skill?.name?.toLowerCase().includes(q)
        const matchInst = c.institution?.name?.toLowerCase().includes(q)
        const matchDesc = c.description?.toLowerCase().includes(q)
        if (!matchTitle && !matchSkill && !matchInst && !matchDesc) return false
      }
      return true
    })
  }, [courses, levelFilter, search])

  const totalPages = Math.ceil(filtered.length / perPage) || 1
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage
    return filtered.slice(start, start + perPage)
  }, [filtered, page])

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="default" className="mb-2">Verified University Curriculum</Badge>
            <h1 className="text-3xl font-extrabold text-charcoal sm:text-4xl">Institutional Courses Directory</h1>
            <p className="mt-1 text-sm text-muted">
              Explore live upskilling courses published directly by academic institutions and industry partners.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted bg-white border border-border px-3.5 py-2 rounded-xl shadow-soft">
              {filtered.length} Available Courses
            </span>
          </div>
        </div>

        {/* Filter bar */}
        <Card className="!p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder="Search by course title, skill, or university…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-charcoal">Difficulty:</span>
              <Select
                value={levelFilter}
                onChange={(e) => {
                  setLevelFilter(e.target.value)
                  setPage(1)
                }}
                className="!py-2 !text-xs !w-40"
              >
                <option value="All">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Course Grid */}
        {loading ? (
          <div className="py-24 text-center text-sm text-muted">
            Loading courses from academic institutions…
          </div>
        ) : paginated.length > 0 ? (
          <>
            <div className="grid grid-cols-1 @xl:grid-cols-2 @2xl:grid-cols-3 gap-6 @3xl:gap-8 ">
              {paginated.map((c) => (
                <ModernCourseCard key={c.id} course={c} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center pt-6">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <Card className="py-20 text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
              <AppIcon name="menu_book" className="text-3xl" />
            </div>
            <h2 className="text-lg font-bold text-charcoal">No Courses Found</h2>
            <p className="text-xs text-muted max-w-md mx-auto mt-1 leading-relaxed">
              No institutional courses match your search criteria. Institutes can publish new courses anytime through their portal.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
