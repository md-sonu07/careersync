import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section className="py-24 bg-primary text-white text-center">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl @3xl:text-5xl font-bold mb-6 tracking-tight">
          Build skills that industry values.
          <br />
          Join CareerSync.
        </h2>
        <p className="text-xl text-white/80 mb-8">Take the first step towards a guaranteed internship and a successful career.</p>
        <Link to="/register">
          <button className="bg-white text-primary text-lg font-bold px-8 py-3 rounded-lg hover:bg-surface transition-colors shadow-lg">
            Get Started Now
          </button>
        </Link>
      </div>
    </section>
  )
}

export default CTA
