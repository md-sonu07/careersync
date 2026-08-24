import SectionHeading from '../common/SectionHeading'
import Card from '../ui/Card'
import AppIcon from '../ui/AppIcon';

const steps = [
  {
    icon: 'person_add',
    title: '1. Build Your Profile',
    desc: 'Create a comprehensive profile detailing your academic background, skills, and career interests.',
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
  {
    icon: 'psychology',
    title: '2. Assess Your Skills',
    desc: 'Take our AI-driven assessments to evaluate your current technical strengths and capabilities.',
    bg: 'bg-accent/10',
    color: 'text-accent',
  },
  {
    icon: 'troubleshoot',
    title: '3. Discover Gaps',
    desc: 'Identify exactly what skills and competencies you need to land your target industry role.',
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
  {
    icon: 'menu_book',
    title: '4. Learn & Practice',
    desc: 'Follow personalized, AI-curated courses and practical projects to build required expertise.',
    bg: 'bg-accent/10',
    color: 'text-accent',
  },
  {
    icon: 'work',
    title: '5. Find Opportunities',
    desc: 'Get intelligently matched with top verified internships and high-growth job opportunities.',
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 @2xl:py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 @2xl:px-6 @5xl:px-8">
        <SectionHeading title="How CareerSync Works" subtitle="A seamless journey from academic learning to professional success." />

        <div className="grid grid-cols-1 @2xl:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-5 gap-3.5 @5xl:gap-4">
          {steps.map((s) => (
            <Card key={s.title} hover className="text-center p-3.5 @2xl:p-4 @5xl:p-4 flex flex-col justify-between h-full">
              <div>
                <div className={`w-11 h-11 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mx-auto mb-3.5`}>
                  <AppIcon name={s.icon} className="text-[22px]" />
                </div>
                <h3 className="text-xs @2xl:text-sm @5xl:text-[14px] font-bold text-charcoal mb-2 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  {s.title}
                </h3>
                <p className="text-xs text-charcoal/70 leading-relaxed min-h-[3.75rem] flex items-center justify-center">
                  {s.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
