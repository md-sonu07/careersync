import IndustryLayout from '../components/layout/IndustryLayout'
import ErrorBoundary from '../components/ui/ErrorBoundary'

import IndustryDashboard from '../pages/Industry/Dashboard'
import PostInternship from '../pages/Industry/PostInternship'
import PostJob from '../pages/Industry/PostJob'
import Candidates from '../pages/Industry/Candidates'
import IndustryApplications from '../pages/Industry/Applications'
import CompanyProfile from '../pages/Industry/CompanyProfile'
import IndustryVerification from '../pages/Industry/Verification'
import Team from '../pages/Industry/Team'
import SkillRequirements from '../pages/Industry/SkillRequirements'
import CandidateDetail from '../pages/Industry/CandidateDetail'
import IndustryInterviews from '../pages/Industry/Interviews'
import HiringAnalytics from '../pages/Industry/HiringAnalytics'
import Matching from '../pages/Industry/Matching'
import IndustryPlacements from '../pages/Industry/Placements'

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

export const industryRoutes = {
  path: '/industry',
  element: <ProtectedRoute allowedRoles={['industry']} />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      element: <IndustryLayout />,
      children: [
        { index: true, element: <IndustryDashboard /> },
        { path: 'dashboard', element: <IndustryDashboard /> },
        { path: 'profile', element: <CompanyProfile /> },
        { path: 'verification', element: <IndustryVerification /> },
        { path: 'team', element: <Team /> },
        { path: 'skills', element: <SkillRequirements /> },
        { path: 'internships', element: <IndustryApplications /> },
        { path: 'internship/new', element: <PostInternship /> },
        { path: 'jobs', element: <IndustryApplications /> },
        { path: 'job/new', element: <PostJob /> },
        { path: 'candidates', element: <Candidates /> },
        { path: 'candidate/:id', element: <CandidateDetail /> },
        { path: 'candidates/:id', element: <CandidateDetail /> },
        { path: 'applications', element: <IndustryApplications /> },
        { path: 'shortlists', element: <Placeholder title="Shortlists" /> },
        { path: 'interviews', element: <IndustryInterviews /> },
        { path: 'placements', element: <IndustryPlacements /> },
        { path: 'matching', element: <Matching /> },
        { path: 'skill-analytics', element: <HiringAnalytics /> },
        { path: 'analytics', element: <HiringAnalytics /> },
        { path: 'notifications', element: <Placeholder title="Notifications" /> },
        { path: 'settings', element: <Placeholder title="Industry Settings" /> },
      ],
    },
  ],
}
