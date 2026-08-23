import AcademiaLayout from '../components/layout/AcademiaLayout'
import ErrorBoundary from '../components/ui/ErrorBoundary'

import AcademiaDashboard from '../pages/Academia/Dashboard'
import IndustryDemand from '../pages/Academia/IndustryDemand'
import AcademiaSkillGaps from '../pages/Academia/SkillGaps'
import AcademiaStudents from '../pages/Academia/Students'
import Performance from '../pages/Academia/Performance'
import SkillDistribution from '../pages/Academia/SkillDistribution'
import TrendingSkills from '../pages/Academia/TrendingSkills'
import TrainingRecommendations from '../pages/Academia/TrainingRecommendations'
import Workshops from '../pages/Academia/Workshops'
import TrainingPrograms from '../pages/Academia/TrainingPrograms'
import AcademiaPlacements from '../pages/Academia/Placements'
import AcademiaReports from '../pages/Academia/Reports'
import AcademiaAnalytics from '../pages/Academia/Analytics'
import AcademiaCourses from '../pages/Academia/Courses'
import AcademiaProgress from '../pages/Academia/Progress'
import AcademiaAssessments from '../pages/Academia/Assessments'
import IndustryPartners from '../pages/Academia/IndustryPartners'

const Placeholder = ({ title, subtitle }) => (
  <div className="py-16 text-center">
    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-primary mb-4">
      <span className="material-symbols-outlined text-2xl">construction</span>
    </div>
    <h2 className="text-2xl font-bold text-charcoal">{title || 'Coming soon'}</h2>
    <p className="text-muted mt-2 max-w-md mx-auto">{subtitle || 'This section follows the same design system. Uses centralized tokens.'}</p>
  </div>
)

export const academiaRoutes = {
  path: '/academia',
  element: <AcademiaLayout />,
  errorElement: <ErrorBoundary />,
  children: [
    { index: true, element: <AcademiaDashboard /> },
    { path: 'dashboard', element: <AcademiaDashboard /> },
    { path: 'students', element: <AcademiaStudents /> },
    { path: 'student/:id', element: <Performance /> },
    { path: 'performance', element: <Performance /> },
    { path: 'skill-distribution', element: <SkillDistribution /> },
    { path: 'skills', element: <SkillDistribution /> },
    { path: 'courses', element: <AcademiaCourses /> },
    { path: 'progress', element: <AcademiaProgress /> },
    { path: 'assessments', element: <AcademiaAssessments /> },
    { path: 'industry-demand', element: <IndustryDemand /> },
    { path: 'skill-gaps', element: <AcademiaSkillGaps /> },
    { path: 'trending-skills', element: <TrendingSkills /> },
    { path: 'industry-partners', element: <IndustryPartners /> },
    { path: 'internships', element: <Placeholder title="Academia Internships" /> },
    { path: 'jobs', element: <Placeholder title="Academia Jobs" /> },
    { path: 'placements', element: <AcademiaPlacements /> },
    { path: 'training-recommendations', element: <TrainingRecommendations /> },
    { path: 'workshops', element: <Workshops /> },
    { path: 'training-programs', element: <TrainingPrograms /> },
    { path: 'reports', element: <AcademiaReports /> },
    { path: 'analytics', element: <AcademiaAnalytics /> },
    { path: 'notifications', element: <Placeholder title="Notifications" /> },
    { path: 'settings', element: <Placeholder title="Academia Settings" /> },
  ],
}
