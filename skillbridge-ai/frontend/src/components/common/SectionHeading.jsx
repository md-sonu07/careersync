const SectionHeading = ({ title, subtitle, centered = true, light = false }) => {
  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''} mb-12`}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-charcoal'}`}>{title}</h2>
      {subtitle && <p className={`text-lg ${light ? 'text-white/70' : 'text-charcoal/70'}`}>{subtitle}</p>}
    </div>
  )
}

export default SectionHeading
