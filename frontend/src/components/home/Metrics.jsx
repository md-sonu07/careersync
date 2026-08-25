const metrics = [
  { value: '50k+', label: 'Active Students' },
  { value: '200+', label: 'Industry Partners' },
  { value: '500+', label: 'Curated Courses' },
  { value: '92%', label: 'Placement Rate' },
]

const Metrics = () => {
  return (
    <section className="border-y border-border-light bg-card-bg py-12">
      <div className="max-w-7xl mx-auto px-6 @3xl:px-8">
        <div className="grid grid-cols-2 @5xl:grid-cols-4 gap-6 @3xl:gap-8 text-center divide-x divide-border-light">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col gap-1 px-2">
              <span className="text-3xl @3xl:text-5xl font-bold text-primary">{m.value}</span>
              <span className="text-xs @3xl:text-sm font-medium text-charcoal/60">{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Metrics
