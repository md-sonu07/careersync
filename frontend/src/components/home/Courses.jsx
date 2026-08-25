import { Link } from 'react-router-dom'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import AppIcon from '../ui/AppIcon';

const courses = [
  {
    tag: 'Engineering',
    duration: '12 Weeks',
    title: 'Full Stack Development',
    desc: 'Master modern web technologies from front-end frameworks to scalable back-end architectures.',
    img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
  },
  {
    tag: 'Data Science',
    duration: '10 Weeks',
    title: 'Data Analytics',
    desc: 'Learn to extract meaningful insights from complex datasets using industry-standard tools.',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
  },
  {
    tag: 'Programming',
    duration: '8 Weeks',
    title: 'Python Programming',
    desc: 'Build a strong foundation in Python, covering core concepts, libraries, and practical applications.',
    img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
  },
]

const CourseCard = ({ tag, duration, title, desc, img }) => (
  <Link to="/courses" className="group cursor-pointer rounded-2xl border border-border-light overflow-hidden bg-white shadow-subtle hover:shadow-card transition-all duration-300 block">
    <div className="aspect-video relative overflow-hidden bg-surface">
      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={title} src={img} />
    </div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <Badge>{tag}</Badge>
        <span className="flex items-center gap-1 text-sm font-medium text-charcoal/60">
          <AppIcon name="schedule" className="text-[16px]" /> {duration}
        </span>
      </div>
      <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-charcoal/70 mb-6 line-clamp-2">{desc}</p>
      <div className="flex items-center text-primary font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
        View Course <AppIcon name="arrow_forward" className="text-[18px]" />
      </div>
    </div>
  </Link>
)

const Courses = () => {
  return (
    <section id="courses" className="py-24 bg-card-bg border-y border-border-light">
      <div className="max-w-7xl mx-auto px-6 @3xl:px-8">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10 @3xl:mb-12">
          <div className="max-w-2xl w-full @3xl:w-auto">
            <h2 className="text-3xl @3xl:text-4xl font-bold text-charcoal mb-3 @3xl:mb-4">Premium Courses</h2>
            <p className="text-base @3xl:text-lg text-charcoal/70">Industry-aligned curriculum designed to close your skill gaps.</p>
          </div>
          <Link to="/courses">
            <Button variant="secondary" className="hidden @3xl:flex">
              View All Courses
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 gap-8">
          {courses.map((c) => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>

        <div className="mt-8 text-center @3xl:hidden">
          <Link to="/courses">
            <Button variant="secondary" className="w-full">
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Courses
