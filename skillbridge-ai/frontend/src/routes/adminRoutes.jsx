import AdminLayout from '../components/layout/AdminLayout'
import ErrorBoundary from '../components/ui/ErrorBoundary'

import AdminDashboard from '../pages/Admin/Dashboard'
import AdminUsers from '../pages/Admin/Users'
import AdminVerification from '../pages/Admin/Verification'
import AdminCourseMgmt from '../pages/Admin/CourseManagement'
import AdminSkillMgmt from '../pages/Admin/SkillManagement'
import Colleges from '../pages/Admin/Colleges'
import SkillCategories from '../pages/Admin/SkillCategories'
import CareerRoles from '../pages/Admin/CareerRoles'
import Modules from '../pages/Admin/Modules'
import Lessons from '../pages/Admin/Lessons'
import CertificatesAdmin from '../pages/Admin/CertificatesAdmin'
import AdminAssessments from '../pages/Admin/Assessments'
import QuestionBank from '../pages/Admin/QuestionBank'
import Mcqs from '../pages/Admin/Mcqs'
import Results from '../pages/Admin/Results'
import AiUsage from '../pages/Admin/AiUsage'
import AiLogs from '../pages/Admin/AiLogs'
import AiMonitoring from '../pages/Admin/AiMonitoring'
import AdminReports from '../pages/Admin/Reports'
import AuditLogs from '../pages/Admin/AuditLogs'
import Administrators from '../pages/Admin/Administrators'
import Categories from '../pages/Admin/Categories'
import Documents from '../pages/Admin/Documents'

import ProtectedRoute from './ProtectedRoute'

const Placeholder = ({ title, subtitle }) => (
  <div className="py-16 text-center">
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-primary mb-4">
      <span className="material-symbols-outlined text-2xl">construction</span>
    </div>
    <h2 className="text-2xl font-bold text-charcoal">{title || 'Coming soon'}</h2>
    <p className="text-muted mt-2 max-w-md mx-auto">{subtitle || 'This section follows the same design system. Uses centralized tokens.'}</p>
  </div>
)

export const adminRoutes = {
  path: '/admin',
  element: <ProtectedRoute allowedRoles={['admin']} />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: 'dashboard', element: <AdminDashboard /> },
        { path: 'users', element: <AdminUsers /> },
        { path: 'students', element: <AdminUsers /> },
        { path: 'industries', element: <AdminUsers /> },
        { path: 'institutes', element: <AdminUsers /> },
        { path: 'administrators', element: <Administrators /> },
        { path: 'colleges', element: <Colleges /> },
        { path: 'verification', element: <AdminVerification /> },
        { path: 'verifications', element: <AdminVerification /> },
        { path: 'college-verification', element: <AdminVerification /> },
        { path: 'documents', element: <Documents /> },
        { path: 'courses', element: <AdminCourseMgmt /> },
        { path: 'categories', element: <Categories /> },
        { path: 'modules', element: <Modules /> },
        { path: 'lessons', element: <Lessons /> },
        { path: 'certificates', element: <CertificatesAdmin /> },
        { path: 'certificates-admin', element: <CertificatesAdmin /> },
        { path: 'skills', element: <AdminSkillMgmt /> },
        { path: 'skill-library', element: <AdminSkillMgmt /> },
        { path: 'skill-categories', element: <SkillCategories /> },
        { path: 'career-roles', element: <CareerRoles /> },
        { path: 'assessments', element: <AdminAssessments /> },
        { path: 'question-bank', element: <QuestionBank /> },
        { path: 'mcqs', element: <Mcqs /> },
        { path: 'results', element: <Results /> },
        { path: 'internships', element: <Placeholder title="Admin Internships" /> },
        { path: 'jobs', element: <Placeholder title="Admin Jobs" /> },
        { path: 'applications', element: <Placeholder title="Admin Applications" /> },
        { path: 'placements', element: <Placeholder title="Admin Placements" /> },
        { path: 'ai-usage', element: <AiUsage /> },
        { path: 'ai-logs', element: <AiLogs /> },
        { path: 'ai-monitoring', element: <AiMonitoring /> },
        { path: 'analytics', element: <AdminReports /> },
        { path: 'reports', element: <AdminReports /> },
        { path: 'notifications', element: <Placeholder title="Admin Notifications" /> },
        { path: 'audit-logs', element: <AuditLogs /> },
        { path: 'settings', element: <Placeholder title="Admin Settings" /> },
      ],
    },
  ],
}
