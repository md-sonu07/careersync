import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import PaymentModal from '../components/ui/PaymentModal'
import { mockCourses } from '../data/coursesData'
import AppIcon from '../components/ui/AppIcon';

const PublicCourseDetail = () => {
  const { id } = useParams()
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('curriculum')

  // Match course by id or fallback to first course
  const course = mockCourses.find((c) => String(c.id) === String(id)) || mockCourses[0]

  return (
    <div className="bg-background min-h-screen pb-16">
      {/* Header Banner */}
      <div className="bg-surface border-b border-border py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted">
            <Link to="/courses" className="hover:text-primary transition-colors">Courses</Link>
            <span>/</span>
            <span className="text-primary">{course.category}</span>
            <span>/</span>
            <span className="text-charcoal truncate max-w-[200px]">{course.title}</span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="muted">{course.category}</Badge>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold border ${
              course.difficulty === 'Advanced'
                ? 'bg-danger/10 text-danger border-danger/20'
                : course.difficulty === 'Intermediate'
                ? 'bg-accent/10 text-accent border-accent/20'
                : 'bg-success/10 text-success border-success/20'
            }`}>
              {course.difficulty}
            </span>
            {course.certificate && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-border px-2.5 py-1 text-xs font-semibold">
                <span className="material-symbols-outlined text-[14px] text-success">verified</span> Verified Certificate
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal tracking-tight max-w-4xl leading-tight">
            {course.title}
          </h1>

          <p className="text-sm md:text-base text-muted max-w-3xl leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted pt-2">
            <div className="flex items-center gap-2">
              <img
                src={course.instructorAvatar}
                alt={course.instructor}
                className="w-7 h-7 rounded-full object-cover border border-border"
              />
              <span>Created by <span className="font-semibold text-charcoal">{course.instructor}</span> ({course.instructorRole})</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <span className="text-amber-500 font-bold">★ {course.rating}</span>
              <span>({course.reviewsCount?.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>
      </div>
        

      {/* Main Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (8 cols): Video, Outcomes, Curriculum, Instructor, Reviews */}
          <div className="lg:col-span-8 space-y-8">
            {/* Video / Thumbnail Banner */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-charcoal group shadow-card">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent flex items-center justify-center">
                <button
                  onClick={() => setIsPaymentOpen(true)}
                  className="w-16 h-16 rounded-full bg-white/90 text-primary shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined text-4xl">play_arrow</span>
                </button>
              </div>
              <span className="absolute bottom-3 left-3 bg-charcoal/80 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                Course Preview • {course.duration}
              </span>
            </div>

            {/* What You'll Learn */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-charcoal mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">auto_awesome</span> What You Will Learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouWillLearn?.map((item, idx) => (
                  <div key={idx} className="flex gap-2 text-xs md:text-sm text-charcoal/80">
                    <span className="material-symbols-outlined text-success text-[18px] shrink-0">check_circle</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills Covered */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted">Skills You Will Master</h4>
              <div className="flex flex-wrap gap-2">
                {course.skills?.map((skill) => (
                  <span key={skill} className="rounded-full bg-sage border border-sage px-3 py-1 text-xs font-semibold text-primary">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="border-b border-border flex gap-6 text-sm font-semibold">
              <button
                onClick={() => setActiveTab('curriculum')}
                className={`pb-3 transition-colors relative ${activeTab === 'curriculum' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-charcoal'}`}
              >
                Course Curriculum ({course.modules?.length || 0} Modules)
              </button>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`pb-3 transition-colors relative ${activeTab === 'instructor' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-charcoal'}`}
              >
                Instructor
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition-colors relative ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-charcoal'}`}
              >
                Reviews ({course.reviews?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`pb-3 transition-colors relative ${activeTab === 'faqs' ? 'text-primary border-b-2 border-primary' : 'text-muted hover:text-charcoal'}`}
              >
                FAQ
              </button>
            </div>

            {/* Tab 1: Curriculum */}
            {activeTab === 'curriculum' && (
              <div className="space-y-4">
                {course.modules?.map((module, idx) => (
                  <Card key={module.id} className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">Module {idx + 1}</span>
                        <h4 className="text-base font-bold text-charcoal mt-0.5">{module.title}</h4>
                      </div>
                      <span className="text-xs font-medium text-muted bg-surface px-2.5 py-1 rounded-full border border-border">
                        {module.lessons} Lessons • {module.duration}
                      </span>
                    </div>
                    {module.topics && (
                      <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-border">
                        {module.topics.map((t) => (
                          <span key={t} className="text-[11px] bg-background border border-border px-2.5 py-1 rounded-md text-charcoal/70">
                            • {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}

            {/* Tab 2: Instructor */}
            {activeTab === 'instructor' && (
              <Card className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructor}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-charcoal">{course.instructor}</h3>
                    <p className="text-xs text-primary font-medium">{course.instructorRole}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted">
                      <span>★ {course.rating} Rating</span>
                      <span>•</span>
                      <span>{course.students?.toLocaleString()} Students</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs md:text-sm leading-relaxed text-muted">
                  {course.instructor} has over 10+ years of engineering leadership in top tier technology companies. Passionate about empowering developers with real-world, production-ready coding practices.
                </p>
              </Card>
            )}

            {/* Tab 3: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {course.reviews?.map((r, idx) => (
                  <Card key={idx} className="p-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-charcoal">{r.name}</span>
                      <span className="text-muted">{r.date}</span>
                    </div>
                    <div className="text-amber-500 text-xs">{'★'.repeat(r.rating)}</div>
                    <p className="text-xs md:text-sm text-charcoal/80">{r.text}</p>
                  </Card>
                ))}
              </div>
            )}

            {/* Tab 4: FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                {course.faqs?.map((f, idx) => (
                  <Card key={idx} className="p-4 space-y-1">
                    <h4 className="font-bold text-xs md:text-sm text-charcoal">Q: {f.q}</h4>
                    <p className="text-xs md:text-sm text-muted">A: {f.a}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (4 cols): Sticky Purchase Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              <Card className="p-6 space-y-5 shadow-card border-border">
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-charcoal">
                      ₹{course.price?.toLocaleString()}
                    </span>
                    {course.originalPrice && (
                      <span className="text-base text-muted line-through">
                        ₹{course.originalPrice?.toLocaleString()}
                      </span>
                    )}
                    {course.discount && (
                      <span className="text-xs font-bold text-danger bg-danger/10 border border-danger/20 px-2 py-0.5 rounded">
                        {course.discount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted mt-1">Special price includes 18% GST • Lifetime access</p>
                </div>

                {/* Primary Buy / Enroll Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => setIsPaymentOpen(true)}
                    className="w-full text-base font-bold py-3"
                    size="lg"
                  >
                    Buy Course — ₹{course.price?.toLocaleString()}
                  </Button>

                  <Button
                    onClick={() => setIsPaymentOpen(true)}
                    variant="outline"
                    className="w-full"
                  >
                    Enroll Now (Payment Gateway)
                  </Button>
                </div>

                {/* Included Features */}
                <div className="border-t border-border pt-4 space-y-3 text-xs text-charcoal/80">
                  <p className="font-bold text-charcoal uppercase tracking-wider text-[11px]">This Course Includes:</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">play_lesson</span>
                    <span>{course.duration} of on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">workspace_premium</span>
                    <span>Verified Completion Certificate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">devices</span>
                    <span>Access on Mobile & Desktop</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">all_inclusive</span>
                    <span>Full Lifetime Access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">quiz</span>
                    <span>Interactive Assignments & Capstone</span>
                  </div>
                </div>

                {/* Guarantee Note */}
                <div className="bg-sage border border-sage rounded-xl p-3 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-primary">
                    <span className="material-symbols-outlined text-[16px]">verified</span> 7-Day Money-Back Guarantee
                  </div>
                  <p className="text-[10px] text-muted">No questions asked refund policy if you’re not satisfied.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        course={course}
      />
    </div>
  )
}

export default PublicCourseDetail
