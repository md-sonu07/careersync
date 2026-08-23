import Button from '../ui/Button'
import Badge from '../ui/Badge'
import SectionHeading from '../common/SectionHeading'

const courses = [
  {
    tag: 'Engineering',
    duration: '12 Weeks',
    title: 'Full Stack Development',
    desc: 'Master modern web technologies from front-end frameworks to scalable back-end architectures.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFMNWlng07UmrxwoI3_YVq83xs17VsJb9RXVA3LWSB5y4fUi4-i4UIcTcuL_oD_6yyaKye4kt2Fm5RloW4IdI_YYmGOIt2b9HZcctVTvHZ22wFvs7jwa-S3P35guNp3v4aW69jEK9JJkl_KbQRYP-0seepNqCnVK7r6GUmNvup3ubrnyGwM1D7qW4F9sC7KHokWgi6lTB3u4c-wN2g-DcKzHJx7CdcsmA2kbGEJXPN5mKbO414IR8cCw',
  },
  {
    tag: 'Data Science',
    duration: '10 Weeks',
    title: 'Data Analytics',
    desc: 'Learn to extract meaningful insights from complex datasets using industry-standard tools.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABuGMlQlLgSnzcoMNCTgH35B-h-MumhpvTpuK-FWD9ypzvuPj01Bver11-SkP1jVLVQ670sA9gD_TxsqY1q8obtXNYrObATNqpQcUlZlmSceIQmL1GiMLHEyg7KWW8pdZDdzVRuYQNDBcsUMrudt5fSnUwyG5FW77CJwdVb-l-tSzL-P71q23eY_TdJskJ-Xrkop3SxTQVwfDsgBc7Cd-Wx-SeA5djQXDfawDhTxoNhnsJJ3R3mGy_6g',
  },
  {
    tag: 'Programming',
    duration: '8 Weeks',
    title: 'Python Programming',
    desc: 'Build a strong foundation in Python, covering core concepts, libraries, and practical applications.',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXUzxcG4ltWs9nzIKnYXmaReB2tp1mg-ZpPYr2Wfqps-3JHotx8Geo6aQe49slV25-xbuZ42OQE_RDzeqBrM69sxy0OdoBA_YBHy6ixw0n7cLTAqdeSbGew1xpM-6SlCE9-wPUBYeYegec7-fYMf3jHTOwgV0BYj-iq9nrSdvw6mbVGnV9ueZJz00oi8HY36p-yiPfOgWxYVmNcoyK11lNQ90KBroUDYE6OIThUIBIVB7_uk9tuDka4Q',
  },
]

const CourseCard = ({ tag, duration, title, desc, img }) => (
  <div className="group cursor-pointer rounded-2xl border border-border-light overflow-hidden bg-white shadow-subtle hover:shadow-card transition-all duration-300">
    <div className="aspect-video relative overflow-hidden bg-surface">
      <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={title} src={img} />
    </div>
    <div className="p-6">
      <div className="flex justify-between items-center mb-3">
        <Badge>{tag}</Badge>
        <span className="flex items-center gap-1 text-sm font-medium text-charcoal/60">
          <span className="material-symbols-outlined text-[16px]">schedule</span> {duration}
        </span>
      </div>
      <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-charcoal/70 mb-6 line-clamp-2">{desc}</p>
      <div className="flex items-center text-primary font-semibold text-sm gap-1 group-hover:gap-2 transition-all">
        View Course <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </div>
    </div>
  </div>
)

const Courses = () => {
  return (
    <section id="courses" className="py-24 bg-card-bg border-y border-border-light">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Premium Courses</h2>
            <p className="text-lg text-charcoal/70">Industry-aligned curriculum designed to close your skill gaps.</p>
          </div>
          <Button variant="secondary" className="hidden md:flex">
            View All Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((c) => (
            <CourseCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Courses
