import Hero from '../../components/home/Hero'
import Metrics from '../../components/home/Metrics'
import HowItWorks from '../../components/home/HowItWorks'
import Courses from '../../components/home/Courses'
import Jobs from '../../components/home/Jobs'
import Testimonials from '../../components/home/Testimonials'
import CTA from '../../components/home/CTA'

const Home = () => {
  return (
    <div className="flex flex-col">
      <Hero />
      <Metrics />
      <HowItWorks />
      <Jobs />
      <Courses />
      <Testimonials />
      <CTA />
    </div>
  )
}

export default Home
