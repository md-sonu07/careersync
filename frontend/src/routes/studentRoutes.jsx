import StudentLayout from '../components/layout/StudentLayout'
import ErrorBoundary from '../components/ui/ErrorBoundary'

import StudentDashboard from '../pages/Student/Dashboard'
import Skills from '../pages/Student/Skills'
import Assessment from '../pages/Student/Assessment'
import SkillGap from '../pages/Student/SkillGap'
import Learning from '../pages/Student/Learning'
import CourseDetail from '../pages/Student/CourseDetail'
import AIPractice from '../pages/Student/AIPractice'
import AIAssistant from '../pages/Student/AIAssistant'
import Roadmap from '../pages/Student/Roadmap'
import StudentInternships from '../pages/Student/Internships'
import StudentInternshipDetail from '../pages/Student/InternshipDetail'
import StudentJobs from '../pages/Student/Jobs'
import StudentJobDetail from '../pages/Student/JobDetail'
import LessonPlayer from '../pages/Student/LessonPlayer'
import Applications from '../pages/Student/Applications'
import Profile from '../pages/Student/Profile'
import MyLearning from '../pages/Student/MyLearning'
import Projects from '../pages/Student/Projects'
import Certificates from '../pages/Student/Certificates'
import StudentNotifications from '../pages/Student/Notifications'
import StudentSettings from '../pages/Student/Settings'
import CareerGoal from '../pages/Student/CareerGoal'
import Assignments from '../pages/Student/Assignments'
import Quizzes from '../pages/Student/Quizzes'
import ResumeAnalyzer from '../pages/Student/ResumeAnalyzer'
import PDFAnalyzer from '../pages/Student/PDFAnalyzer'
import Analytics from '../pages/Student/Analytics'
import SkillProgress from '../pages/Student/SkillProgress'
import Streak from '../pages/Student/Streak'
import Saved from '../pages/Student/Saved'
import Recommended from '../pages/Student/Recommended'
import Interviews from '../pages/Student/Interviews'
import ApplicationDetail from '../pages/Student/ApplicationDetail'
import AssessmentResult from '../pages/Student/AssessmentResult'
import Portfolio from '../pages/Student/Portfolio'
import Help from '../pages/Student/Help'
import ProtectedRoute from './ProtectedRoute'

export const studentRoutes = {
  path: '/student',
  element: <ProtectedRoute allowedRoles={['student']} />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      element: <StudentLayout />,
      children: [
        { index: true, element: <StudentDashboard /> },
        { path: 'dashboard', element: <StudentDashboard /> },
    { path: 'profile', element: <Profile /> },
    { path: 'career-goal', element: <CareerGoal /> },
    { path: 'skills', element: <Skills /> },
    { path: 'assessment', element: <Assessment /> },
    { path: 'assessment-result', element: <AssessmentResult /> },
    { path: 'assessment/result', element: <AssessmentResult /> },
    { path: 'skill-gap', element: <SkillGap /> },
    { path: 'roadmap', element: <Roadmap /> },
    { path: 'learning', element: <MyLearning /> },
    { path: 'learning/:id', element: <LessonPlayer /> },
    { path: 'courses', element: <Learning /> },
    { path: 'courses/:id', element: <CourseDetail /> },
    { path: 'course/:id', element: <LessonPlayer /> },
    { path: 'lesson/:id', element: <LessonPlayer /> },
    { path: 'my-learning', element: <MyLearning /> },
    { path: 'assignments', element: <Assignments /> },
    { path: 'quizzes', element: <Quizzes /> },
    { path: 'ai-practice', element: <AIPractice /> },
    { path: 'ai-assistant', element: <AIAssistant /> },
    { path: 'resume', element: <ResumeAnalyzer /> },
    { path: 'resume-analyzer', element: <ResumeAnalyzer /> },
    { path: 'pdf-analyzer', element: <PDFAnalyzer /> },
    { path: 'portfolio', element: <Portfolio /> },
    { path: 'analytics', element: <Analytics /> },
    { path: 'skill-progress', element: <SkillProgress /> },
    { path: 'streak', element: <Streak /> },
    { path: 'internships', element: <StudentInternships /> },
    { path: 'internship/:id', element: <StudentInternshipDetail /> },
    { path: 'jobs', element: <StudentJobs /> },
    { path: 'job/:id', element: <StudentJobDetail /> },
    { path: 'recommended', element: <Recommended /> },
    { path: 'saved', element: <Saved /> },
    { path: 'applications', element: <Applications /> },
    { path: 'applications/:id', element: <ApplicationDetail /> },
    { path: 'application/:id', element: <ApplicationDetail /> },
    { path: 'interviews', element: <Interviews /> },
    { path: 'projects', element: <Projects /> },
    { path: 'certificates', element: <Certificates /> },
    { path: 'help', element: <Help /> },
        { path: 'notifications', element: <StudentNotifications /> },
        { path: 'settings', element: <StudentSettings /> },
      ],
    },
  ],
}
