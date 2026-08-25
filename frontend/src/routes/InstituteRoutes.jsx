import InstituteLayout from '../components/layout/InstituteLayout'
import ErrorBoundary from '../components/ui/ErrorBoundary'

import InstituteDashboard from '../pages/Institute/Dashboard'
import IndustryDemand from '../pages/Institute/IndustryDemand'
import InstituteSkillGaps from '../pages/Institute/SkillGaps'
import InstituteStudents from '../pages/Institute/Students'
import Performance from '../pages/Institute/Performance'
import SkillDistribution from '../pages/Institute/SkillDistribution'
import TrendingSkills from '../pages/Institute/TrendingSkills'
import TrainingRecommendations from '../pages/Institute/TrainingRecommendations'
import Workshops from '../pages/Institute/Workshops'
import TrainingPrograms from '../pages/Institute/TrainingPrograms'
import InstitutePlacements from '../pages/Institute/Placements'
import InstituteReports from '../pages/Institute/Reports'
import InstituteAnalytics from '../pages/Institute/Analytics'
import InstituteCourses from '../pages/Institute/Courses'
import InstituteProgress from '../pages/Institute/Progress'
import InstituteAssessments from '../pages/Institute/Assessments'
import IndustryPartners from '../pages/Institute/IndustryPartners'
import InstituteProfile from '../pages/Institute/InstituteProfile'

import ProtectedRoute from './ProtectedRoute'
import AppIcon from '../components/ui/AppIcon';

const Placeholder = ({ title, subtitle }) => (
  <div className="py-16 text-center">
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-primary mb-4">
      <AppIcon name="construction" className="text-2xl" />
    </div>
    <h2 className="text-2xl font-bold text-charcoal">{title || 'Coming soon'}</h2>
    <p className="text-muted mt-2 max-w-md mx-auto">{subtitle || 'This section follows the same design system. Uses centralized tokens.'}</p>
  </div>
)

import AIAssistant from '../pages/Student/AIAssistant'

export const InstituteRoutes = {
  path: '/institute',
  element: <ProtectedRoute allowedRoles={['academician', 'Institute']} />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      element: <InstituteLayout />,
      children: [
        { index: true, element: <InstituteDashboard /> },
        { path: 'dashboard', element: <InstituteDashboard /> },
        { path: 'ai-assistant', element: <AIAssistant /> },
        { path: 'students', element: <InstituteStudents /> },
        { path: 'student/:id', element: <Performance /> },
        { path: 'performance', element: <Performance /> },
        { path: 'skill-distribution', element: <SkillDistribution /> },
        { path: 'skills', element: <SkillDistribution /> },
        { path: 'courses', element: <InstituteCourses /> },
        { path: 'progress', element: <InstituteProgress /> },
        { path: 'assessments', element: <InstituteAssessments /> },
        { path: 'industry-demand', element: <IndustryDemand /> },
        { path: 'skill-gaps', element: <InstituteSkillGaps /> },
        { path: 'trending-skills', element: <TrendingSkills /> },
        { path: 'industry-partners', element: <IndustryPartners /> },
        { path: 'internships', element: <Placeholder title="Institute Internships" /> },
        { path: 'jobs', element: <Placeholder title="Institute Jobs" /> },
        { path: 'placements', element: <InstitutePlacements /> },
        { path: 'training-recommendations', element: <TrainingRecommendations /> },
        { path: 'workshops', element: <Workshops /> },
        { path: 'training-programs', element: <TrainingPrograms /> },
        { path: 'reports', element: <InstituteReports /> },
        { path: 'analytics', element: <InstituteAnalytics /> },
        { path: 'notifications', element: <Placeholder title="Notifications" /> },
        { path: 'settings', element: <InstituteProfile /> },
        { path: 'profile', element: <InstituteProfile /> },
      ],
    },
  ],
}
