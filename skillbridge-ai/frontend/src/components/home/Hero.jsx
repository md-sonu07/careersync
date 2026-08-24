import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
            <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            Bridging Academia and Industry
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-charcoal leading-[1.1] tracking-tight">
            Learn the right skills.
            <br />
            <span className="text-primary">Build your career.</span>
            <br />
            Get industry-ready.
          </h1>

          <p className="text-lg text-charcoal/70 max-w-xl leading-relaxed">
            CareerSync combines personalized learning, AI-powered assessment, skill-gap analysis, and intelligent
            internship matching in one platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Link to="/register">
              <Button size="lg" icon="arrow_forward">
                Start Learning
              </Button>
            </Link>
            <Link to="#courses">
              <Button variant="secondary" size="lg">
                Explore Internships
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border-light">
            <div className="flex -space-x-4">
              <img
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
                alt="Student"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCvKbQnlcjdNvaxgt4bUL2Nj9vv4CgwB9sBEtDfwWzs2-TtDs3ebvZ-2XNFWPIomjVz5ip3H-ASrmEnAZTk-uZMFbBNlDX2iYVs3SJBPNS3IRRPQ77NeKMEk2Npp__HtY8uUWCYj2RZdS_GWe-DvNprkZLRJQaVLZ0v25E4IsvEtSXPd4nNr2NjX6F7fl6eGiRlJvWs_9pwOifqdN0CakBPlH5HM6pNqPaK3UVWF2p8D2MvKoalJZZ1AQ"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
                alt="Engineer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDErEigADIMqk-FjNfcHNwhEgHnUT7f8OV24Il9r7FsauGGN8vOR-XyoedpitXRo4VkdMrPEmZe8C2WMFauFuriDfsDFUjGF4vgkcDOVTJ3zvWGxQSha4UN5FoP1C_iB5GlKTU3ciA-CefJWYExMLuDNQHLLAy6rFZZUOivSie2-y7w5Zx42hCA7WqEcVBGE99B9fnkXo6CkR5XquLqpFX3Plya0rhe5F_Kv_k8GE8gsxaijA6hMXp_Jg"
              />
              <img
                className="w-10 h-10 rounded-full border-2 border-background object-cover"
                alt="Data scientist"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjHCrLMzFPTx7hS3ehogbBWTYytSJW84qswNc7_j1UQHxDqZS373LlCUrtVb7haT482QS_q4TGInp0cUqjSp7V3d1JAOAOS-f4h6EtBxAYSMQMyAQe27mpQXQSSze6Ho4NHkXApeGGRWp9XL8O-icp-Wqdgi3yiZAG2lJPbdyGjJjSStYiYxePb9ii7Aj3h6DPQ0oSvDTvQ1Hx72nvjGpW8RcHBHhzUHvc940FaZT7sfyKRBXmMRxJnw"
              />
            </div>
            <span className="text-sm font-semibold text-charcoal">Joined by 10,000+ students</span>
          </div>
        </div>

        <div className="relative mt-8 md:mt-0 flex justify-center">
          <div className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden shadow-card border border-border-light bg-card-bg">
            <img
              className="w-full h-auto object-cover"
              alt="Dashboard"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuATKcj61urnZhLVmyF3Voz5-T3UpHfO3AzIliah8bZQrzfbOIngZohX1uvRvKDCUfSfq4yixvjPB9hMtm0gksb4bUcS3cMxFhh6ZujL4cboMmMGXi61REGbmtaPJlxrZhkAFa9GNyk5aefx6B8j7Ap2-8DcdprtSYh1kFyEcJr_nubUKCg9QZrQLxv5K-hUZYWtnaUDACybzDHNh3cXTUXi_AjdgNsCKbXrrDQCDYOGz7-Cs_FUsuK4hQ"
            />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-sm border border-border-light flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">check_circle</span>
              <div>
                <p className="text-xs text-charcoal/60 font-medium">Skill Matched</p>
                <p className="text-sm font-bold text-charcoal">Data Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
