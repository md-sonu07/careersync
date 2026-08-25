import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import AppIcon from '../ui/AppIcon'
import { courseApi } from '../../api/course.api'
import { ModernCourseCard } from '../../pages/Courses/Courses'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    courseApi.getResources({ limit: 3 })
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

  return (
    <section id="courses" className="py-20 bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div className="max-w-2xl w-full">
            <Badge variant="default" className="mb-2">Institutional Learning</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-2">Featured Institutional Courses</h2>
            <p className="text-base text-muted">Curated curriculum designed by top colleges and universities to close skill gaps.</p>
          </div>
          <Link to="/courses">
            <Button variant="secondary" className="hidden sm:flex">
              View All Courses →
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Loading featured courses…</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c) => (
              <ModernCourseCard key={c.id} course={c} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-white border border-border p-8">
            <AppIcon name="menu_book" className="text-4xl text-primary mb-2 mx-auto" />
            <h3 className="text-base font-bold text-charcoal">No Courses Published Yet</h3>
            <p className="text-xs text-muted max-w-sm mx-auto mt-1">
              Institutions can publish courses from their dashboard to feature them here.
            </p>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/courses">
            <Button variant="secondary" className="w-full">
              View All Courses →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Courses
