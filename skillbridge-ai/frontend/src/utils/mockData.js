// Central mock data for Student Portal - expanded
export const mockUser = {
  id: 'stu_001',
  name: 'Rahul Sharma',
  firstName: 'Rahul',
  email: 'rahul.sharma@example.com',
  avatar: 'https://i.pravatar.cc/150?img=12',
  role: 'Student',
  college: 'Delhi Technological University',
  branch: 'Computer Science — 3rd Year',
  streak: 12,
  careerGoal: 'Full Stack Developer',
  joinedOn: '2025-08-12',
  location: 'New Delhi, India',
  bio: 'Aspiring full-stack developer passionate about React, Node.js and building impactful products. Currently exploring system design and cloud.',
  phone: '+91 98765 43210',
  linkedin: 'linkedin.com/in/rahulsharma',
  github: 'github.com/rahulsharma',
}

export const mockCareerReadiness = {
  overall: 82,
  streakDays: 12,
  coursesInProgress: 4,
  matchedOpportunities: 8,
}

export const mockSkills = [
  { id: 'js', name: 'JavaScript', category: 'Frontend', level: 86, trend: 4, color: '#315C4D' },
  { id: 'react', name: 'React', category: 'Frontend', level: 82, trend: 3 },
  { id: 'node', name: 'Node.js', category: 'Backend', level: 76, trend: 2 },
  { id: 'mongo', name: 'MongoDB', category: 'Backend', level: 79, trend: 5 },
  { id: 'git', name: 'Git & GitHub', category: 'DevOps', level: 90, trend: 6 },
  { id: 'docker', name: 'Docker', category: 'DevOps', level: 43, trend: -2 },
  { id: 'testing', name: 'Testing (Jest)', category: 'Backend', level: 38, trend: -1 },
  { id: 'css', name: 'CSS / Tailwind', category: 'Frontend', level: 78, trend: 2 },
  { id: 'express', name: 'Express.js', category: 'Backend', level: 72, trend: 3 },
  { id: 'aws', name: 'AWS Basics', category: 'DevOps', level: 32, trend: 0 },
  { id: 'sql', name: 'SQL', category: 'Backend', level: 65, trend: 1 },
  { id: 'ts', name: 'TypeScript', category: 'Frontend', level: 68, trend: 4 },
]

export const mockSkillGap = [
  { skill: 'React', yours: 82, required: 80, status: 'strong' },
  { skill: 'JavaScript', yours: 86, required: 85, status: 'strong' },
  { skill: 'Git & GitHub', yours: 90, required: 70, status: 'strong' },
  { skill: 'Node.js', yours: 76, required: 75, status: 'strong' },
  { skill: 'Express.js', yours: 72, required: 75, status: 'improve' },
  { skill: 'MongoDB', yours: 79, required: 70, status: 'strong' },
  { skill: 'REST APIs', yours: 58, required: 75, status: 'improve' },
  { skill: 'Testing (Jest)', yours: 38, required: 60, status: 'critical' },
  { skill: 'Docker', yours: 43, required: 60, status: 'critical' },
  { skill: 'AWS / Deployment', yours: 32, required: 55, status: 'critical' },
  { skill: 'TypeScript', yours: 68, required: 70, status: 'improve' },
  { skill: 'System Design Basics', yours: 40, required: 60, status: 'critical' },
]

export const mockCourses = [
  {
    id: 'c1',
    title: 'Complete React Mastery 2026',
    instructor: 'Anjali Mehta',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80',
    rating: 4.8,
    students: 12450,
    difficulty: 'Intermediate',
    duration: '18h 30m',
    skills: ['React', 'Hooks', 'Redux'],
    progress: 64,
    certificate: true,
    category: 'Frontend',
    description: 'Master React from fundamentals to advanced patterns including hooks, context, and performance.',
    price: 'Free',
  },
  {
    id: 'c2',
    title: 'Node.js Backend Bootcamp',
    instructor: 'Rohit Verma',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80',
    rating: 4.7,
    students: 8920,
    difficulty: 'Intermediate',
    duration: '22h 10m',
    skills: ['Node.js', 'Express', 'MongoDB'],
    progress: 42,
    certificate: true,
    category: 'Backend',
    description: 'Build scalable backends with Node, Express and MongoDB.',
    price: 'Free',
  },
  {
    id: 'c3',
    title: 'Docker & DevOps Essentials',
    instructor: 'Kiran Patel',
    thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&q=80',
    rating: 4.6,
    students: 6320,
    difficulty: 'Beginner',
    duration: '10h 45m',
    skills: ['Docker', 'CI/CD', 'AWS'],
    progress: 0,
    certificate: true,
    category: 'DevOps',
    description: 'Containerize your apps and deploy with confidence.',
    price: 'Free',
  },
  {
    id: 'c4',
    title: 'Testing with Jest & RTL',
    instructor: 'Sneha Kapoor',
    thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&q=80',
    rating: 4.5,
    students: 4100,
    difficulty: 'Intermediate',
    duration: '8h 20m',
    skills: ['Jest', 'Testing', 'React'],
    progress: 12,
    certificate: true,
    category: 'Backend',
    description: 'Write bulletproof tests for your JavaScript apps.',
    price: 'Free',
  },
  {
    id: 'c5',
    title: 'MongoDB & Data Modeling',
    instructor: 'Arjun Singh',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80',
    rating: 4.7,
    students: 5300,
    difficulty: 'Beginner',
    duration: '12h 00m',
    skills: ['MongoDB', 'Database', 'Aggregation'],
    progress: 88,
    certificate: true,
    category: 'Backend',
    description: 'Design efficient schemas and master aggregation pipelines.',
    price: 'Free',
  },
  {
    id: 'c6',
    title: 'TypeScript for React Devs',
    instructor: 'Priya Nair',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    rating: 4.9,
    students: 7200,
    difficulty: 'Intermediate',
    duration: '9h 15m',
    skills: ['TypeScript', 'React'],
    progress: 0,
    certificate: true,
    category: 'Frontend',
    description: 'Level up your React apps with type safety.',
    price: 'Free',
  },
]

export const mockCourseDetail = {
  id: 'c1',
  title: 'Complete React Mastery 2026',
  description: 'Go from zero to production-ready React developer. Covers hooks, context, performance, testing and deployment. Build 4 real projects.',
  instructor: { name: 'Anjali Mehta', role: 'Senior Frontend Engineer @ Razorpay', avatar: 'https://i.pravatar.cc/150?img=5' },
  rating: 4.8,
  reviewsCount: 3421,
  students: 12450,
  duration: '18h 30m',
  lessons: 64,
  level: 'Intermediate',
  lastUpdated: 'Jan 2026',
  skills: ['React', 'JavaScript', 'Redux', 'Hooks'],
  outcomes: ['Build production React apps', 'Master hooks & context', 'State management with Redux Toolkit', 'Performance optimization'],
  modules: [
    { id: 'm1', title: '01 — Introduction & Setup', duration: '42m', lessons: 5, completed: true },
    { id: 'm2', title: '02 — Components & Props', duration: '1h 18m', lessons: 7, completed: true },
    { id: 'm3', title: '03 — State & Lifecycle', duration: '1h 45m', lessons: 8, completed: true },
    { id: 'm4', title: '04 — Hooks Deep Dive', duration: '2h 10m', lessons: 10, completed: false, current: true },
    { id: 'm5', title: '05 — Routing & Data Fetching', duration: '1h 50m', lessons: 8, completed: false },
    { id: 'm6', title: '06 — Redux Toolkit', duration: '2h 05m', lessons: 9, completed: false },
    { id: 'm7', title: '07 — Testing & Deployment', duration: '1h 20m', lessons: 6, completed: false },
  ],
  reviews: [
    { name: 'Aman K.', rating: 5, text: 'Best React course I have taken. Projects are very practical.', date: '2026-01-18' },
    { name: 'Sara L.', rating: 5, text: 'Anjali explains hooks so clearly. Loved the capstone!', date: '2026-01-10' },
    { name: 'Dev P.', rating: 4, text: 'Great depth, could use more on testing.', date: '2026-01-02' },
  ],
}

export const mockAssessments = [
  { id: 'a1', date: '2026-02-10', skill: 'React', score: '8/10', accuracy: 80, status: 'Completed', difficulty: 'Medium' },
  { id: 'a2', date: '2026-02-05', skill: 'Node.js', score: '6/10', accuracy: 60, status: 'Completed', difficulty: 'Hard' },
  { id: 'a3', date: '2026-01-28', skill: 'JavaScript', score: '9/10', accuracy: 90, status: 'Completed', difficulty: 'Medium' },
  { id: 'a4', date: '2026-01-20', skill: 'MongoDB', score: '7/10', accuracy: 70, status: 'Completed', difficulty: 'Easy' },
  { id: 'a5', date: '2026-01-12', skill: 'Docker', score: '4/10', accuracy: 40, status: 'Completed', difficulty: 'Medium' },
]

export const mockInternships = [
  { id: 'i1', company: 'Flipkart', role: 'Frontend Intern', location: 'Bengaluru (Remote)', stipend: '₹25,000 / month', duration: '3 Months', match: 92, logo: '🛒', skills: ['React', 'JavaScript'], posted: '2 days ago', applicants: 312 },
  { id: 'i2', company: 'Zomato', role: 'Full Stack Intern', location: 'Gurugram', stipend: '₹30,000 / month', duration: '6 Months', match: 86, logo: '🍽️', skills: ['React', 'Node.js', 'MongoDB'], posted: '1 week ago', applicants: 540 },
  { id: 'i3', company: 'CRED', role: 'React Developer Intern', location: 'Remote', stipend: '₹28,000 / month', duration: '3 Months', match: 88, logo: '💳', skills: ['React', 'TypeScript'], posted: '3 days ago', applicants: 210 },
  { id: 'i4', company: 'Swiggy Labs', role: 'Backend Intern — Node.js', location: 'Bengaluru', stipend: '₹22,000 / month', duration: '4 Months', match: 74, logo: '🛵', skills: ['Node.js', 'Express', 'SQL'], posted: '5 days ago', applicants: 180 },
]

export const mockJobs = [
  { id: 'j1', company: 'Razorpay', role: 'Junior Full Stack Developer', location: 'Bengaluru', salary: '₹8-12 LPA', type: 'Full-time', match: 84, logo: '💸', skills: ['React', 'Node.js'], posted: '1 day ago', applicants: 420 },
  { id: 'j2', company: 'Postman', role: 'Frontend Engineer I', location: 'Remote', salary: '₹10-14 LPA', type: 'Full-time', match: 79, logo: '📮', skills: ['React', 'TypeScript'], posted: '4 days ago', applicants: 610 },
  { id: 'j3', company: 'Meesho', role: 'Backend Developer — Fresher', location: 'Bengaluru', salary: '₹7-10 LPA', type: 'Full-time', match: 71, logo: '🛍️', skills: ['Node.js', 'MongoDB'], posted: '1 week ago', applicants: 330 },
]

export const mockApplications = [
  { id: 'ap1', company: 'Flipkart', role: 'Frontend Intern', applied: '2026-02-12', match: 92, status: 'Shortlisted', stage: 2 },
  { id: 'ap2', company: 'CRED', role: 'React Developer Intern', applied: '2026-02-10', match: 88, status: 'Under Review', stage: 1 },
  { id: 'ap3', company: 'Razorpay', role: 'Junior Full Stack Dev', applied: '2026-02-08', match: 84, status: 'Applied', stage: 0 },
  { id: 'ap4', company: 'Postman', role: 'Frontend Engineer I', applied: '2026-01-30', match: 79, status: 'Interview', stage: 3 },
  { id: 'ap5', company: 'Zomato', role: 'Full Stack Intern', applied: '2026-01-22', match: 86, status: 'Selected', stage: 4 },
]

export const mockProjects = [
  { id: 'p1', title: 'CareerSync — Career Portal', desc: 'MERN stack portal with AI skill-gap analysis.', skills: ['React', 'Node.js', 'MongoDB'], status: 'In Progress', progress: 70, link: '#' },
  { id: 'p2', title: 'E-Commerce API', desc: 'REST API with auth, payments, admin panel.', skills: ['Express', 'JWT', 'MongoDB'], status: 'Completed', progress: 100, link: '#' },
  { id: 'p3', title: 'Realtime Chat App', desc: 'Socket.io chat with rooms and typing indicators.', skills: ['React', 'Socket.io'], status: 'Planned', progress: 10, link: '#' },
]

export const mockCertificates = [
  { id: 'cert1', title: 'React Mastery — Completion', issuer: 'CareerSync', date: '2026-02-01', credential: 'CS-2026-REACT-1842', skills: ['React'] },
  { id: 'cert2', title: 'Node.js Backend Bootcamp', issuer: 'CareerSync', date: '2026-01-15', credential: 'CS-2026-NODE-7721', skills: ['Node.js', 'Express'] },
  { id: 'cert3', title: 'Git & GitHub Fundamentals', issuer: 'CareerSync', date: '2025-12-20', credential: 'CS-2025-GIT-4419', skills: ['Git'] },
]

export const mockRoadmap = [
  { id: 'r1', title: 'JavaScript Fundamentals', desc: 'ES6+, async, DOM, closures', status: 'completed', duration: '3 weeks', skills: ['JavaScript'] },
  { id: 'r2', title: 'React & Ecosystem', desc: 'Hooks, Router, Redux Toolkit', status: 'completed', duration: '4 weeks', skills: ['React', 'Redux'] },
  { id: 'r3', title: 'Node.js & Express', desc: 'REST APIs, middleware, auth', status: 'current', duration: '3 weeks', skills: ['Node.js', 'Express'] },
  { id: 'r4', title: 'Database — MongoDB & SQL', desc: 'Modeling, indexing, aggregation', status: 'recommended', duration: '2 weeks', skills: ['MongoDB', 'SQL'] },
  { id: 'r5', title: 'REST API Design', desc: 'Pagination, versioning, docs', status: 'recommended', duration: '1 week', skills: ['REST'] },
  { id: 'r6', title: 'Testing (Jest & RTL)', desc: 'Unit, integration, coverage', status: 'recommended', duration: '2 weeks', skills: ['Jest'] },
  { id: 'r7', title: 'Docker & Deployment', desc: 'Containers, CI/CD, Vercel/AWS', status: 'locked', duration: '2 weeks', skills: ['Docker', 'AWS'] },
  { id: 'r8', title: 'Capstone Projects', desc: 'Build & deploy 2 portfolio projects', status: 'locked', duration: '3 weeks', skills: ['Portfolio'] },
  { id: 'r9', title: 'Internship Ready', desc: 'Apply with 85%+ readiness', status: 'locked', duration: '—', skills: [] },
]

export const mockAIQuestions = [
  {
    id: 1,
    q: 'What is the correct way to update state based on previous state in React?',
    options: ['setCount(count + 1)', 'setCount(prev => prev + 1)', 'count++', 'this.setState({count: count+1})'],
    answer: 1,
    topic: 'React Hooks',
  },
  {
    id: 2,
    q: 'Which HTTP method is idempotent?',
    options: ['POST', 'PATCH', 'PUT', 'CONNECT'],
    answer: 2,
    topic: 'REST APIs',
  },
  {
    id: 3,
    q: 'In MongoDB, which operator is used to add elements to an array if not already present?',
    options: ['$push', '$addToSet', '$pull', '$pop'],
    answer: 1,
    topic: 'MongoDB',
  },
  {
    id: 4,
    q: 'What does Docker image layer caching optimize?',
    options: ['Network latency', 'Build time by reusing unchanged layers', 'CPU usage', 'Disk encryption'],
    answer: 1,
    topic: 'Docker',
  },
  {
    id: 5,
    q: 'Which hook is used for side effects in function components?',
    options: ['useState', 'useEffect', 'useMemo', 'useRef'],
    answer: 1,
    topic: 'React',
  },
]

export const mockChatMessages = [
  { id: 1, role: 'ai', text: 'Hey Rahul! I’m your CareerSync AI Assistant. Ask me anything about your skills, roadmap, or courses 👋', time: '10:30 AM' },
  { id: 2, role: 'user', text: 'What should I focus on to become internship-ready as a Full Stack Developer?', time: '10:31 AM' },
  { id: 3, role: 'ai', text: 'Great question! Based on your profile, you’re strong in JS/React/Node (78–86%) but Docker (43%) and Testing (38%) are your critical gaps. I recommend: 1) Docker & DevOps Essentials (10h), 2) Jest & RTL (8h). Completing these will push your Career Readiness from 82% → 91%. Want a 2-week study plan?', time: '10:31 AM' },
]

export const streakData = [
  { day: 'M', done: true },
  { day: 'T', done: true },
  { day: 'W', done: true },
  { day: 'T', done: true },
  { day: 'F', done: true },
  { day: 'S', done: false },
  { day: 'S', done: true },
]

export const mockNotifications = [
  { id: 1, title: 'New internship match — Flipkart (92%)', time: '2h ago', unread: true },
  { id: 2, title: 'Your React assessment is graded — 8/10', time: '1 day ago', unread: true },
  { id: 3, title: 'Streak alert — 12 days! Keep going 🔥', time: '1 day ago', unread: false },
]
