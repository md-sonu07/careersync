import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppIcon from '../ui/AppIcon'
import { toast } from 'react-hot-toast'

export function detectTechStack(text) {
  if (!text || typeof text !== 'string') return null

  const lower = text.lower ? text.lower() : text.toLowerCase()

  // Check if message is a resume analysis or contains skills
  const isResumeContext = /(?:resume|cv|experience|education|skills|projects|profile|developer|engineer|stack)/i.test(lower)
  if (!isResumeContext && !/(?:mern|react|node|java|python|dsa|sql|javascript)/i.test(lower)) {
    return null
  }

  if (/(?:mern|mongodb.*express.*react.*node|node.*react)/i.test(lower)) {
    return 'MERN Stack'
  }
  if (/(?:java\b|spring|hibernate)/i.test(lower)) {
    return 'Java Developer'
  }
  if (/(?:python|django|flask|fastapi)/i.test(lower)) {
    return 'Python Developer'
  }
  if (/(?:react|frontend|javascript|typescript|next\.js)/i.test(lower)) {
    return 'React / Frontend'
  }
  if (/(?:sql|postgres|database|backend)/i.test(lower)) {
    return 'Backend & Database'
  }
  if (/(?:dsa|data structure|algorithm)/i.test(lower)) {
    return 'DSA & Problem Solving'
  }

  return isResumeContext ? 'Software Engineer' : null
}

export function generateRecommendationsForStack(stack) {
  const s = stack || 'Software Engineer'

  let jobs = []
  let internships = []
  let courses = []
  let interviewPrep = []

  if (s.includes('MERN') || s.includes('React')) {
    jobs = [
      {
        id: 'j1',
        title: 'Full Stack MERN Developer',
        company: 'Razorpay',
        location: 'Bengaluru (Remote)',
        salary: '₹12–18 LPA',
        mode: 'Remote',
        skills: ['React', 'Node.js', 'MongoDB', 'Express'],
        applicants: '42 applicants',
      },
      {
        id: 'j2',
        title: 'Senior React / Node.js Engineer',
        company: 'Swiggy',
        location: 'Hyderabad',
        salary: '₹14–22 LPA',
        mode: 'Hybrid',
        skills: ['React', 'TypeScript', 'Node.js', 'Redux'],
        applicants: '28 applicants',
      },
      {
        id: 'j3',
        title: 'Frontend Engineer (MERN)',
        company: 'Paytm',
        location: 'Noida / Remote',
        salary: '₹10–16 LPA',
        mode: 'Remote',
        skills: ['React', 'Next.js', 'Tailwind CSS', 'REST API'],
        applicants: '19 applicants',
      },
      {
        id: 'j4',
        title: 'Backend Node.js Specialist',
        company: 'Zomato',
        location: 'Gurugram',
        salary: '₹15–24 LPA',
        mode: 'On-site',
        skills: ['Node.js', 'MongoDB', 'Redis', 'Microservices'],
        applicants: '35 applicants',
      },
    ]

    internships = [
      {
        id: 'i1',
        title: 'MERN Stack Developer Intern',
        company: 'Cred',
        location: 'Bengaluru',
        stipend: '₹35,000 / month',
        duration: '6 Months',
        skills: ['React', 'Node.js', 'MongoDB'],
      },
      {
        id: 'i2',
        title: 'Frontend React Intern',
        company: 'Flipkart',
        location: 'Remote',
        stipend: '₹30,000 / month',
        duration: '3 Months',
        skills: ['React', 'JavaScript', 'CSS3'],
      },
      {
        id: 'i3',
        title: 'Node.js Backend Intern',
        company: 'PhonePe',
        location: 'Bengaluru',
        stipend: '₹40,000 / month',
        duration: '6 Months',
        skills: ['Node.js', 'Express', 'SQL'],
      },
      {
        id: 'i4',
        title: 'Full-Stack Web Dev Intern',
        company: 'Unacademy',
        location: 'Remote',
        stipend: '₹25,000 / month',
        duration: '4 Months',
        skills: ['React', 'Node.js', 'Git'],
      },
    ]

    courses = [
      {
        id: '1',
        title: 'Advanced React Patterns & Performance',
        instructor: 'Sarah Kim (Staff Engineer @ Razorpay)',
        rating: '4.8 ★',
        price: 'Free with SyncPass',
        skills: ['React', 'Performance', 'Redux Toolkit'],
        category: 'Frontend',
      },
      {
        id: '2',
        title: 'Enterprise Node.js & Microservices Masterclass',
        instructor: 'Daniel Lee (Principal @ Stripe)',
        rating: '4.9 ★',
        price: 'Free with SyncPass',
        skills: ['Node.js', 'MongoDB', 'Docker', 'JWT'],
        category: 'Backend',
      },
      {
        id: '3',
        title: 'Full-Stack MERN Capstone Project Bootcamp',
        instructor: 'Rohan Sharma (Tech Lead @ Swiggy)',
        rating: '4.9 ★',
        price: 'Free with SyncPass',
        skills: ['MERN', 'Tailwind', 'Deployment', 'CI/CD'],
        category: 'Full Stack',
      },
      {
        id: '4',
        title: 'System Design & Scalable Web Architectures',
        instructor: 'Gaurav Sen (Ex-Uber Engineer)',
        rating: '4.9 ★',
        price: 'Free with SyncPass',
        skills: ['System Design', 'Caching', 'Load Balancing'],
        category: 'Architecture',
      },
    ]

    interviewPrep = [
      {
        id: 'ip1',
        title: 'MERN Stack Technical Mock Interview',
        difficulty: 'Intermediate',
        questions: '15 Questions',
        duration: '45 mins',
      },
      {
        id: 'ip2',
        title: 'React Hooks & Virtual DOM System Coding',
        difficulty: 'Advanced',
        questions: '10 Questions',
        duration: '30 mins',
      },
      {
        id: 'ip3',
        title: 'Node.js Event Loop & Async Architecture',
        difficulty: 'Advanced',
        questions: '12 Questions',
        duration: '35 mins',
      },
      {
        id: 'ip4',
        title: 'MongoDB Schema Design & Indexing Quiz',
        difficulty: 'Beginner',
        questions: '20 MCQs',
        duration: '25 mins',
      },
    ]
  } else if (s.includes('Java')) {
    jobs = [
      {
        id: 'jj1',
        title: 'Java Software Engineer',
        company: 'Oracle',
        location: 'Bengaluru',
        salary: '₹14–22 LPA',
        mode: 'Hybrid',
        skills: ['Java', 'Spring Boot', 'Microservices', 'Hibernate'],
        applicants: '54 applicants',
      },
      {
        id: 'jj2',
        title: 'Backend Java / Spring Developer',
        company: 'JPMorgan Chase',
        location: 'Mumbai / Remote',
        salary: '₹16–26 LPA',
        mode: 'Remote',
        skills: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Kafka'],
        applicants: '38 applicants',
      },
      {
        id: 'jj3',
        title: 'Senior Java Systems Architect',
        company: 'SAP Labs',
        location: 'Bengaluru',
        salary: '₹20–35 LPA',
        mode: 'On-site',
        skills: ['Java', 'Spring Cloud', 'Kubernetes', 'Docker'],
        applicants: '22 applicants',
      },
      {
        id: 'jj4',
        title: 'Java Microservices Specialist',
        company: 'Infosys',
        location: 'Pune / Remote',
        salary: '₹10–15 LPA',
        mode: 'Remote',
        skills: ['Java', 'REST APIs', 'Spring Security', 'Maven'],
        applicants: '61 applicants',
      },
    ]

    internships = [
      {
        id: 'ji1',
        title: 'Java Backend Intern',
        company: 'Morgan Stanley',
        location: 'Bengaluru',
        stipend: '₹45,000 / month',
        duration: '6 Months',
        skills: ['Java', 'Spring Boot', 'SQL'],
      },
      {
        id: 'ji2',
        title: 'Java Software Development Intern',
        company: 'Amazon',
        location: 'Hyderabad',
        stipend: '₹50,000 / month',
        duration: '6 Months',
        skills: ['Java', 'Data Structures', 'OOP'],
      },
      {
        id: 'ji3',
        title: 'Backend Java Intern',
        company: 'Barclays',
        location: 'Pune',
        stipend: '₹35,000 / month',
        duration: '3 Months',
        skills: ['Java', 'REST APIs', 'MySQL'],
      },
      {
        id: 'ji4',
        title: 'Java Developer Intern',
        company: 'TCS',
        location: 'Remote',
        stipend: '₹20,000 / month',
        duration: '4 Months',
        skills: ['Java', 'Core Java', 'Git'],
      },
    ]

    courses = [
      {
        id: 'jc1',
        title: 'Mastering Spring Boot & Microservices in Java',
        instructor: 'Vikram Mehta (Principal Architect @ Oracle)',
        rating: '4.9 ★',
        price: 'Free with SyncPass',
        skills: ['Java', 'Spring Boot', 'Spring Security', 'Hibernate'],
        category: 'Backend',
      },
      {
        id: 'jc2',
        title: 'Core Java & Data Structures for Enterprise',
        instructor: 'Neha Gupta (Tech Lead @ Amazon)',
        rating: '4.8 ★',
        price: 'Free with SyncPass',
        skills: ['Java 17', 'Collections', 'Multithreading', 'OOP'],
        category: 'Programming',
      },
      {
        id: 'jc3',
        title: 'Java System Design & Distributed Systems',
        instructor: 'Arjun Nair (Staff Engineer @ Uber)',
        rating: '4.9 ★',
        price: 'Free with SyncPass',
        skills: ['Java', 'Kafka', 'Redis', 'System Design'],
        category: 'Architecture',
      },
    ]

    interviewPrep = [
      {
        id: 'jip1',
        title: 'Java Core & OOP Concepts Interview Prep',
        difficulty: 'Intermediate',
        questions: '20 Questions',
        duration: '40 mins',
      },
      {
        id: 'jip2',
        title: 'Spring Boot & Microservices Technical Assessment',
        difficulty: 'Advanced',
        questions: '15 Questions',
        duration: '45 mins',
      },
      {
        id: 'jip3',
        title: 'Java Multithreading & Memory Management',
        difficulty: 'Advanced',
        questions: '10 Questions',
        duration: '30 mins',
      },
      {
        id: 'jip4',
        title: 'Java Collections Framework Quiz',
        difficulty: 'Beginner',
        questions: '25 MCQs',
        duration: '30 mins',
      },
    ]
  } else {
    // Generic Software Engineer Fallback
    jobs = [
      {
        id: 'gj1',
        title: 'Software Engineer (Full Stack)',
        company: 'Google',
        location: 'Bengaluru / Remote',
        salary: '₹18–28 LPA',
        mode: 'Remote',
        skills: ['Python', 'React', 'Data Structures', 'System Design'],
        applicants: '72 applicants',
      },
      {
        id: 'gj2',
        title: 'Backend Software Engineer',
        company: 'Microsoft',
        location: 'Hyderabad',
        salary: '₹20–32 LPA',
        mode: 'Hybrid',
        skills: ['C++', 'Python', 'Cloud Services', 'SQL'],
        applicants: '48 applicants',
      },
      {
        id: 'gj3',
        title: 'Full-Stack Web Engineer',
        company: 'Atlassian',
        location: 'Bengaluru',
        salary: '₹16–25 LPA',
        mode: 'Remote',
        skills: ['JavaScript', 'TypeScript', 'Node.js', 'React'],
        applicants: '33 applicants',
      },
      {
        id: 'gj4',
        title: 'Associate Software Developer',
        company: 'Thoughtworks',
        location: 'Pune',
        salary: '₹12–18 LPA',
        mode: 'On-site',
        skills: ['Java', 'Python', 'Clean Code', 'Agile'],
        applicants: '29 applicants',
      },
    ]

    internships = [
      {
        id: 'gi1',
        title: 'Software Engineering Intern',
        company: 'Intuit',
        location: 'Bengaluru',
        stipend: '₹40,000 / month',
        duration: '6 Months',
        skills: ['Python', 'JavaScript', 'Algorithms'],
      },
      {
        id: 'gi2',
        title: 'Backend Engineering Intern',
        company: 'Uber',
        location: 'Hyderabad',
        stipend: '₹50,000 / month',
        duration: '6 Months',
        skills: ['Java', 'Golang', 'SQL'],
      },
      {
        id: 'gi3',
        title: 'Web Developer Intern',
        company: 'Postman',
        location: 'Remote',
        stipend: '₹35,000 / month',
        duration: '3 Months',
        skills: ['React', 'API Design', 'Node.js'],
      },
      {
        id: 'gi4',
        title: 'Software Developer Intern',
        company: 'Salesforce',
        location: 'Bengaluru',
        stipend: '₹45,000 / month',
        duration: '6 Months',
        skills: ['Java', 'Python', 'Git'],
      },
    ]

    courses = [
      {
        id: 'gc1',
        title: 'Data Structures & Algorithms Masterclass',
        instructor: 'Kunal Kushwaha (Tech Lead @ Microsoft)',
        rating: '4.9 ★',
        price: 'Free with SyncPass',
        skills: ['DSA', 'Arrays', 'Trees', 'Dynamic Programming'],
        category: 'Algorithms',
      },
      {
        id: 'gc2',
        title: 'Modern Full-Stack Web Development',
        instructor: 'Anuj Kumar (Senior Engineer @ Google)',
        rating: '4.8 ★',
        price: 'Free with SyncPass',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
        category: 'Web Dev',
      },
      {
        id: 'gc3',
        title: 'System Design & Scalable Architecture',
        instructor: 'Gaurav Sen (Ex-Uber Engineer)',
        rating: '4.9 ★',
        price: 'Free with SyncPass',
        skills: ['System Design', 'Caching', 'Load Balancing'],
        category: 'Architecture',
      },
    ]

    interviewPrep = [
      {
        id: 'gip1',
        title: 'Full-Stack Software Engineer Mock Interview',
        difficulty: 'Intermediate',
        questions: '15 Questions',
        duration: '45 mins',
      },
      {
        id: 'gip2',
        title: 'Data Structures & Algorithms Coding Challenge',
        difficulty: 'Advanced',
        questions: '10 Problems',
        duration: '60 mins',
      },
      {
        id: 'gip3',
        title: 'System Design & API Architecture Assessment',
        difficulty: 'Advanced',
        questions: '8 Questions',
        duration: '40 mins',
      },
      {
        id: 'gip4',
        title: 'Technical Competency & CS Fundamentals Quiz',
        difficulty: 'Beginner',
        questions: '20 MCQs',
        duration: '25 mins',
      },
    ]
  }

  return { jobs, internships, courses, interviewPrep }
}

export function detectInitialTab(text) {
  if (!text || typeof text !== 'string') return 'jobs'
  const lower = text.toLowerCase()
  if (lower.includes('internship') || lower.includes('intern')) {
    return 'internships'
  }
  if (lower.includes('course') || lower.includes('learn') || lower.includes('study')) {
    return 'courses'
  }
  if (lower.includes('interview') || lower.includes('mcq') || lower.includes('quiz') || lower.includes('practice') || lower.includes('question')) {
    return 'interview'
  }
  return 'jobs'
}

export default function ResumeRecommendationsWidget({ stack, content = '', theme = 'dark' }) {
  const navigate = useNavigate()
  const initialTab = detectInitialTab(content)
  const [activeTab, setActiveTab] = useState(initialTab)

  const detectedStack = stack || 'Software Engineer'
  const recs = generateRecommendationsForStack(detectedStack)

  const linkedInSearchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    detectedStack + ' jobs'
  )}&location=India`

  return (
    <div className="my-5 font-sans text-left space-y-4">
      {/* Resume Matched Header Banner */}
      <div
        className={`p-4 rounded-2xl border shadow-sm flex flex-wrap items-center justify-between gap-3 ${
          theme === 'dark' ? 'bg-[#222222] border-[#333333] text-white' : 'bg-primary/5 border-primary/20 text-charcoal'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold shrink-0">
            <AppIcon name="verified" className="text-[20px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm leading-tight">Career Matching Matched</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                {detectedStack}
              </span>
            </div>
            <p className="text-[11px] text-muted mt-0.5">
              Live matching opportunities, courses, and interview sets based on your resume
            </p>
          </div>
        </div>

        {/* LinkedIn Search Link Button */}
        <a
          href={linkedInSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-md bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <AppIcon name="launch" className="text-[14px]" />
          <span>LinkedIn Jobs ({detectedStack})</span>
        </a>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2 border-b border-border/40 pb-2.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'bg-primary text-white shadow-xs'
              : theme === 'dark'
              ? 'text-gray-300 hover:text-white hover:bg-[#2c2c2c]'
              : 'text-muted hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <AppIcon name="work" className="text-[16px] shrink-0" />
          <span className="whitespace-nowrap">Latest Jobs ({recs.jobs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('internships')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
            activeTab === 'internships'
              ? 'bg-primary text-white shadow-xs'
              : theme === 'dark'
              ? 'text-gray-300 hover:text-white hover:bg-[#2c2c2c]'
              : 'text-muted hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <AppIcon name="school" className="text-[16px] shrink-0" />
          <span className="whitespace-nowrap">Internships ({recs.internships.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-primary text-white shadow-xs'
              : theme === 'dark'
              ? 'text-gray-300 hover:text-white hover:bg-[#2c2c2c]'
              : 'text-muted hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <AppIcon name="menu_book" className="text-[16px] shrink-0" />
          <span className="whitespace-nowrap">Career Courses ({recs.courses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2 ${
            activeTab === 'interview'
              ? 'bg-primary text-white shadow-xs'
              : theme === 'dark'
              ? 'text-gray-300 hover:text-white hover:bg-[#2c2c2c]'
              : 'text-muted hover:text-charcoal hover:bg-gray-100'
          }`}
        >
          <AppIcon name="quiz" className="text-[16px] shrink-0" />
          <span className="whitespace-nowrap">Interview Preparation ({recs.interviewPrep.length})</span>
        </button>
      </div>

      {/* Tab Content Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-200">
        {activeTab === 'jobs' &&
          recs.jobs.map((j) => (
            <div
              key={j.id}
              className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                theme === 'dark' ? 'bg-[#1c1c1c] border-[#2c2c2c]' : 'bg-white border-border/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h5 className={`font-bold text-sm leading-snug ${theme === 'dark' ? 'text-white' : 'text-charcoal'}`}>
                      {j.title}
                    </h5>
                    <p className="text-xs text-muted font-medium mt-0.5">{j.company}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20 shrink-0">
                    {j.mode}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-3">
                  <span className="font-semibold text-emerald-500">{j.salary}</span>
                  <span>•</span>
                  <span>{j.location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {j.skills.map((sk) => (
                    <span
                      key={sk}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        theme === 'dark'
                          ? 'bg-[#2a2a2a] text-gray-300 border-[#383838]'
                          : 'bg-gray-100 text-charcoal border-gray-200'
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                <span className="text-[11px] text-muted">{j.applicants}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/jobs')
                    toast.success(`Redirecting to Jobs matching ${j.title}...`)
                  }}
                  className="px-3 py-1 rounded-md bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
                >
                  Apply Now →
                </button>
              </div>
            </div>
          ))}

        {activeTab === 'internships' &&
          recs.internships.map((inItem) => (
            <div
              key={inItem.id}
              className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                theme === 'dark' ? 'bg-[#1c1c1c] border-[#2c2c2c]' : 'bg-white border-border/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h5 className={`font-bold text-sm leading-snug ${theme === 'dark' ? 'text-white' : 'text-charcoal'}`}>
                      {inItem.title}
                    </h5>
                    <p className="text-xs text-muted font-medium mt-0.5">{inItem.company}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                    {inItem.duration}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-3">
                  <span className="font-bold text-emerald-500">{inItem.stipend}</span>
                  <span>•</span>
                  <span>{inItem.location}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {inItem.skills.map((sk) => (
                    <span
                      key={sk}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        theme === 'dark'
                          ? 'bg-[#2a2a2a] text-gray-300 border-[#383838]'
                          : 'bg-gray-100 text-charcoal border-gray-200'
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                <span className="text-[11px] text-muted">Stipend Guaranteed</span>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/internships')
                    toast.success(`Redirecting to Internships matching ${inItem.title}...`)
                  }}
                  className="px-3 py-1 rounded-md bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-2xs cursor-pointer"
                >
                  Apply Internship →
                </button>
              </div>
            </div>
          ))}

        {activeTab === 'courses' &&
          recs.courses.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                theme === 'dark' ? 'bg-[#1c1c1c] border-[#2c2c2c]' : 'bg-white border-border/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/20">
                    {c.category}
                  </span>
                  <span className="text-xs font-extrabold text-amber-500">{c.rating}</span>
                </div>

                <h5 className={`font-bold text-sm leading-snug mb-1 ${theme === 'dark' ? 'text-white' : 'text-charcoal'}`}>
                  {c.title}
                </h5>
                <p className="text-xs text-muted font-medium mb-3">by {c.instructor}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {c.skills.map((sk) => (
                    <span
                      key={sk}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        theme === 'dark'
                          ? 'bg-[#2a2a2a] text-gray-300 border-[#383838]'
                          : 'bg-gray-100 text-charcoal border-gray-200'
                      }`}
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-border/30 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500">{c.price}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/courses`)
                  }}
                  className="px-3 py-1 rounded-md bg-primary text-white font-bold text-xs hover:bg-primary/90 transition-colors shadow-2xs cursor-pointer"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}

        {activeTab === 'interview' &&
          recs.interviewPrep.map((ip) => (
            <div
              key={ip.id}
              className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                theme === 'dark' ? 'bg-[#1c1c1c] border-[#2c2c2c]' : 'bg-white border-border/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${
                      ip.difficulty === 'Advanced'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : ip.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}
                  >
                    {ip.difficulty}
                  </span>
                  <span className="text-xs text-muted font-medium">{ip.duration}</span>
                </div>

                <h5 className={`font-bold text-sm leading-snug mb-1 ${theme === 'dark' ? 'text-white' : 'text-charcoal'}`}>
                  {ip.title}
                </h5>
                <p className="text-xs text-muted font-medium mb-3">{ip.questions}</p>
              </div>

              <div className="pt-2 border-t border-border/30 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const evt = new CustomEvent('careersync:chat:send', {
                      detail: { text: `Generate MCQs for ${ip.title}` },
                    })
                    window.dispatchEvent(evt)
                    toast.success(`Starting ${ip.title}...`)
                  }}
                  className="px-3 py-1 rounded-md bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                >
                  <AppIcon name="play_arrow" className="text-[14px]" />
                  <span>Start Practice</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
