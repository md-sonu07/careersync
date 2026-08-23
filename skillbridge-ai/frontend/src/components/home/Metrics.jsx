const metrics = [
  { value: '50k+', label: 'Active Students' },
  { value: '200+', label: 'Industry Partners' },
  { value: '500+', label: 'Curated Courses' },
  { value: '92%', label: 'Placement Rate' },
]

const Metrics = () => {
  return (
    <section className="border-y border-border-light bg-card-bg py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border-light">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <span className="text-4xl md:text-5xl font-bold text-primary">{m.value}</span>
              <span className="text-sm font-medium text-charcoal/60">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Metrics
