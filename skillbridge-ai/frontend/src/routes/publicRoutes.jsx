import Layout from '../components/layout/Layout'
import ErrorBoundary from '../components/ui/ErrorBoundary'

import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import HowItWorksPage from '../pages/HowItWorks/HowItWorks'
import ForStudents from '../pages/ForStudents/ForStudents'
import ForIndustry from '../pages/ForIndustry/ForIndustry'
import ForAcademia from '../pages/ForAcademia/ForAcademia'
import PublicCourses from '../pages/Courses/Courses'
import PublicInternships from '../pages/Internships/Internships'
import PublicJobs from '../pages/Jobs/Jobs'
import PublicCourseDetail from '../pages/PublicCourseDetail'
import Companies from '../pages/Companies/Companies'
import CompanyDetail from '../pages/Companies/CompanyDetail'
import Contact from '../pages/Contact/Contact'

import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'

import StudentInternshipDetail from '../pages/Student/InternshipDetail'
import StudentJobDetail from '../pages/Student/JobDetail'

export const publicRoutes = {
  path: '/',
  element: <Layout />,
  errorElement: <ErrorBoundary />,
  children: [
    { index: true, element: <Home /> },
    { path: 'about', element: <About /> },
    { path: 'how-it-works', element: <HowItWorksPage /> },
    { path: 'students', element: <ForStudents /> },
    { path: 'industry', element: <ForIndustry /> },
    { path: 'academia', element: <ForAcademia /> },
    { path: 'courses', element: <PublicCourses /> },
    { path: 'courses/:id', element: <PublicCourseDetail /> },
    { path: 'internships', element: <PublicInternships /> },
    { path: 'internships/:id', element: <StudentInternshipDetail /> },
    { path: 'jobs', element: <PublicJobs /> },
    { path: 'jobs/:id', element: <StudentJobDetail /> },
    { path: 'companies', element: <Companies /> },
    { path: 'companies/:id', element: <CompanyDetail /> },
    { path: 'contact', element: <Contact /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register /> },
    { path: 'register/:role', element: <Register /> },
    { path: '*', element: <div className="text-center py-20">404 — Page not found</div> },
  ],
}
