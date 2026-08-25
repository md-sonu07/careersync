const testimonials = [
  {
    text: 'CareerSync transformed my job search. The personalized learning path filled exactly the gaps I needed to land a role at a top tech firm.',
    name: 'Alex S.',
    role: 'Software Engineer Intern',
    initials: 'AS',
  },
  {
    text: 'We partner with CareerSync because they provide candidates who are truly industry-ready. The quality of interns is consistently excellent.',
    name: 'Maria J.',
    role: 'Director of Engineering, TechCorp',
    initials: 'MJ',
  },
]

const Testimonials = () => {
  return (
    <section className="py-24 bg-card-bg border-t border-border-light">
      <div className="max-w-7xl mx-auto px-6 @3xl:px-8">
        <h2 className="text-3xl @3xl:text-4xl font-bold text-charcoal mb-12 text-center">Success Stories</h2>
        <div className="grid @3xl:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="border border-border-light p-8 rounded-2xl bg-surface">
              <div className="flex gap-1 text-accent mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[20px] fill-current">
                    star
                  </span>
                ))}
              </div>
              <p className="text-lg text-charcoal italic mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-border-light flex items-center justify-center text-primary font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-charcoal">{t.name}</p>
                  <p className="text-sm text-charcoal/60">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
