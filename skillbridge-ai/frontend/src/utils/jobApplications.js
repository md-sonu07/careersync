const STORAGE_KEY = 'careersync_job_applications'

export const initialJobApplications = [
  {
    id: 'app_101',
    jobId: 1,
    jobRole: 'Frontend Engineer',
    company: 'TechNova',
    applicantName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    experience: '1 year',
    skills: 'React, TypeScript, Tailwind CSS',
    portfolioUrl: 'https://github.com/rahulsharma',
    resumeUrl: 'https://ik.imagekit.io/crms/rahul_resume.pdf',
    coverNote: 'I have 1+ years experience building React apps and would love to contribute to TechNova.',
    appliedDate: '2026-02-24',
    match: 93,
    status: 'Shortlisted',
  },
  {
    id: 'app_102',
    jobId: 2,
    jobRole: 'Backend Engineer — Node.js',
    company: 'CloudDash',
    applicantName: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 98123 45678',
    experience: '2 years',
    skills: 'Node.js, Express, Postgres, Docker',
    portfolioUrl: 'https://linkedin.com/in/priyaverma',
    resumeUrl: 'https://ik.imagekit.io/crms/priya_resume.pdf',
    coverNote: 'Experienced backend engineer with expertise in microservices and database optimization.',
    appliedDate: '2026-02-23',
    match: 89,
    status: 'Under Review',
  },
  {
    id: 'app_103',
    jobId: 3,
    jobRole: 'Data Analyst',
    company: 'Insightly',
    applicantName: 'Aman Deep',
    email: 'aman.deep@example.com',
    phone: '+91 97654 32109',
    experience: 'Fresher',
    skills: 'SQL, Python, Pandas, Tableau',
    portfolioUrl: 'https://github.com/amandeep',
    resumeUrl: 'https://ik.imagekit.io/crms/aman_resume.pdf',
    coverNote: 'Passionate about data modeling and extracting actionable insights from large datasets.',
    appliedDate: '2026-02-22',
    match: 85,
    status: 'Pending',
  },
]

export const getJobApplications = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialJobApplications))
      return initialJobApplications
    }
    return JSON.parse(data)
  } catch (err) {
    console.error('Error reading job applications:', err)
    return initialJobApplications
  }
}

export const saveJobApplication = (newApp) => {
  try {
    const existing = getJobApplications()
    const application = {
      id: 'app_' + Date.now(),
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...newApp,
    }
    const updated = [application, ...existing]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return application
  } catch (err) {
    console.error('Error saving job application:', err)
    return null
  }
}

export const updateApplicationStatus = (id, status) => {
  try {
    const existing = getJobApplications()
    const updated = existing.map((app) => (app.id === id ? { ...app, status } : app))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (err) {
    console.error('Error updating application status:', err)
    return []
  }
}

export const deleteJobApplication = (id) => {
  try {
    const existing = getJobApplications()
    const updated = existing.filter((app) => app.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  } catch (err) {
    console.error('Error deleting application:', err)
    return []
  }
}
