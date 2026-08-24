import { Link } from 'react-router-dom'
import Button from '../ui/Button'

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-10 sm:py-14 lg:py-16 bg-surface">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left Side Content - 7 cols on lg */}
        <div className="lg:col-span-7 flex flex-col gap-5 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-xs sm:text-sm self-center lg:self-start transition-all hover:bg-primary/15">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Bridging Academia & Industry with AI
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal leading-[1.2] tracking-tight">
            Learn the right skills.{' '}
            <span className="text-primary bg-gradient-to-r from-primary via-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Build your career.
            </span>{' '}
            Get industry-ready.
          </h1>

          {/* Subtitle / Paragraph */}
          <p className="text-base sm:text-lg text-charcoal/70 leading-relaxed max-w-xl mx-auto lg:mx-0">
            CareerSync combines AI skill gap analysis, personalized roadmaps, real-world industry assessments, and
            intelligent internship matching in one unified platform.
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <Link to="/register">
              <Button size="md" icon="arrow_forward" className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Start Learning Free
              </Button>
            </Link>
            <Link to="/internships">
              <Button variant="outline" size="md" className="border-border hover:bg-background">
                Explore Internships
              </Button>
            </Link>
          </div>

          {/* Social Proof & Trust Badges */}
          <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 mt-2 border-t border-border/70">
            <div className="flex -space-x-3">
              <img
                className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                alt="Student"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              />
              <img
                className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                alt="Engineer"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              />
              <img
                className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                alt="Data scientist"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                <span className="material-symbols-outlined text-[16px] fill-1">star</span>
                <span className="font-bold text-charcoal ml-1 text-xs">4.9/5</span>
              </div>
              <p className="text-xs font-medium text-charcoal/70">Joined by 10,000+ ambitious learners</p>
            </div>
          </div>
        </div>

        {/* Right Side Visual - Crisp Light-Mode Code UI Mockup */}
        <div className="lg:col-span-5 relative mt-4 lg:mt-0 flex justify-center">
          {/* Ambient Soft Glow Aura */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/15 via-emerald-400/10 to-teal-300/15 rounded-3xl blur-2xl opacity-80 -z-10" />

          {/* Browser / SaaS Light Frame Container */}
          <div className="relative z-10 w-full max-w-lg rounded-2xl overflow-hidden shadow-xl border border-border/80 bg-white/95 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:border-primary/30">
            {/* Header Window Bar */}
            <div className="px-4 py-3 bg-slate-50 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] font-mono text-charcoal/60 bg-white px-3 py-1 rounded-md border border-border/60 flex items-center gap-1.5 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                careersync.ai/ai-readiness
              </div>
              <span className="material-symbols-outlined text-[16px] text-charcoal/40">more_horiz</span>
            </div>

            {/* Dashboard Content Widget */}
            <div className="p-5 space-y-4 text-charcoal">
              {/* Header row */}
              <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-charcoal/50">AI Career Target</div>
                    <div className="text-sm font-bold text-charcoal flex items-center gap-2">
                      Full-Stack AI Developer
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold border border-primary/20">Verified</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-charcoal/50 font-medium">Job Readiness</div>
                  <div className="text-xl font-black text-primary tracking-tight">94%</div>
                </div>
              </div>

              {/* Progress Skill Bars */}
              <div className="space-y-3.5 pt-1">
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-charcoal flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">code</span>
                      Python & Machine Learning
                    </span>
                    <span className="text-primary font-bold">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-emerald-500 h-full rounded-full w-[92%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-charcoal flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-primary">web</span>
                      React & Modern Web Architecture
                    </span>
                    <span className="text-primary font-bold">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-emerald-500 h-full rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-charcoal flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-amber-500">cloud_sync</span>
                      System Design & MLOps
                    </span>
                    <span className="text-amber-600 font-bold">74% <span className="text-[10px] font-normal text-amber-600/80">(Gap Identified)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full w-[74%]" />
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-border/80 hover:bg-slate-100/60 transition-colors flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                    <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-charcoal/50">AI Recommendation</div>
                    <div className="text-xs font-bold text-charcoal line-clamp-1">MLOps & Cloud Scalability</div>
                    <div className="text-[10px] text-primary font-bold mt-0.5">+16% Match Boost</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-border/80 hover:bg-slate-100/60 transition-colors flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">work</span>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase text-charcoal/50">Internship Match</div>
                    <div className="text-xs font-bold text-charcoal line-clamp-1">AI Developer @ TechCorp</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Top 5% Candidate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
