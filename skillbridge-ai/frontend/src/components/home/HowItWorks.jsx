import SectionHeading from '../common/SectionHeading'
import Card from '../ui/Card'

const steps = [
  { icon: 'person_add', title: '1. Build Your Profile', desc: 'Create a comprehensive profile detailing your academic background and interests.', bg: 'bg-primary/10', color: 'text-primary' },
  { icon: 'psychology', title: '2. Assess Your Skills', desc: 'Take our AI-driven assessments to evaluate your current technical capabilities.', bg: 'bg-accent/10', color: 'text-accent' },
  { icon: 'troubleshoot', title: '3. Discover Gaps', desc: 'Identify exactly what skills you need to land your dream industry role.', bg: 'bg-primary/10', color: 'text-primary' },
  { icon: 'menu_book', title: '4. Learn & Practice', desc: 'Follow personalized AI-curated courses to build the required expertise.', bg: 'bg-accent/10', color: 'text-accent' },
  { icon: 'work', title: '5. Find Opportunities', desc: 'Get intelligently matched with internships and entry-level positions.', bg: 'bg-primary/10', color: 'text-primary' },
]

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <SectionHeading title="How CareerSync Works" subtitle="A seamless journey from academic learning to professional success." />

        <div className="grid md:grid-cols-5 gap-6">
          {steps.map((s) => (
            <Card key={s.title} hover className="text-center">
              <div className={`w-12 h-12 ${s.bg} rounded-xl flex items-center justify-center ${s.color} mx-auto mb-4`}>
                <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-charcoal mb-2">{s.title}</h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
