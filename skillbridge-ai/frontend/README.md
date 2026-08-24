# CareerSync — AI-Powered LMS + Skill Intelligence + Internship & Placement Platform

**Tagline:** Learn Better. Build Skills. Get Industry-Ready.  
**Core loop:** Discover → Assess → Analyze → Learn → Practice → Improve → Match → Apply → Interview → Selected

Production-ready React frontend with centralized design system, role-based portals, and API-ready architecture (Django REST compatible).

---

## Tech Stack
- React 19 + Vite 8 + React Router 7 (`createBrowserRouter`)
- Redux Toolkit + React-Redux (selectors, `createAsyncThunk`)
- Axios (interceptors, 401 auto-logout, `VITE_API_BASE_URL`)
- TailwindCSS v4 (`@theme` tokens + CSS vars)
- Vitest + Testing Library + jsdom

---

## Centralized Design System (`src/index.css:1`)

Single source of truth — change once, updates everywhere:

```css
@theme { --color-primary:#315C4D; --color-accent:#B78343; ... }
:root { --primary:#315C4D; --accent:#B78343; --background:#F7F4EE; --border:#E5E0D7; }
```

Palette matches spec: Background #F7F4EE, Surface #fff, Primary #315C4D, Primary-2 #3E6B5B, Accent #B78343, Sage #DDE8E1, Text #252525, Muted #737373, Success #3E7C59, Danger #B85450. Utilities `.btn-primary`, `.glass-card` use `var(--primary)`. Shadows `shadow-subtle/card`, radii `rounded-2xl`.

---

## Folder Structure

```
src/
├── api/                 # axios.js, endpoints.js, *.api.js, index.js barrel
├── app/store.js         # Redux store
├── features/auth/authSlice.js # slices + asyncThunks + selectors + localStorage safe
├── components/
│   ├── ui/              # Button, Input, Select, Textarea, Tabs, Modal, Drawer, Table, Pagination, Progress, Skeleton, EmptyState, Alert, FileUpload, SearchInput, FilterBar, Card, Badge
│   ├── common/          # PageHeader, StatCard, ChartCard, SectionHeading, Loader
│   ├── layout/          # Layout (public Navbar+Footer), StudentLayout, IndustryLayout, AcademiaLayout, AdminLayout (dark)
│   └── home/            # Hero, Metrics, HowItWorks, Courses, Jobs, Testimonials, CTA
├── pages/
│   ├── Home/Home.jsx
│   ├── About/, HowItWorks/, ForStudents/, ForIndustry/, ForAcademia/
│   ├── Courses/, Internships/, Jobs/, PublicCourseDetail.jsx
│   ├── Auth/            # Login (role radiogroup), Register (tabs Student|Industry|Academia + pending), AdminLogin (dark)
│   ├── Student/         # Dashboard, Skills, Assessment, SkillGap (strongest), Learning, CourseDetail, LessonPlayer, AIPractice, AIAssistant, Roadmap, Internships, InternshipDetail, Jobs, JobDetail, Applications (pipeline stepper), Profile, MyLearning, Projects, Certificates, Notifications, Settings
│   ├── Industry/        # Dashboard, PostInternship/Job (6-step + AI JD assistant), Candidates (ranking + match explanation), Applications (Kanban)
│   ├── Academia/        # Dashboard, IndustryDemand, SkillGaps (critical gaps + actions), Students
│   └── Admin/           # Dashboard, Users, Verification, CourseManagement, SkillManagement, AdminLogin
├── hooks/useAuth.js
├── utils/helpers.js, constants.js, storage.js, mockData.js
├── routes/index.jsx     # 60+ routes (public + student + industry + academia + admin)
├── styles/theme.css
└── index.css
tests/setup.js, src/__tests__/App.test.jsx
```

---

## Routes (Spec §59)

**Public:** `/`, `/about`, `/how-it-works`, `/students`, `/industry`, `/academia`, `/courses`, `/courses/:id`, `/internships`, `/internships/:id`, `/jobs`, `/jobs/:id`, `/login`, `/register`, `/admin/login`

**Student:** `/student`, `/student/dashboard`, `/student/profile`, `/student/skills`, `/student/assessment`, `/student/skill-gap`, `/student/learning`, `/student/courses/:id`, `/student/lesson/:id`, `/student/my-learning`, `/student/ai-practice`, `/student/ai-assistant`, `/student/roadmap`, `/student/internships`, `/student/jobs`, `/student/applications`, `/student/projects`, `/student/certificates`

**Industry:** `/industry`, `/industry/profile`, `/industry/internships`, `/industry/internship/new`, `/industry/jobs`, `/industry/job/new`, `/industry/candidates`, `/industry/applications`, `/industry/analytics`

**Academia:** `/academia`, `/academia/students`, `/academia/industry-demand`, `/academia/skill-gaps`, etc

**Admin:** `/admin`, `/admin/users`, `/admin/skills`, `/admin/courses`, `/admin/verification`, etc

Legacy `/dashboard` → `/student/dashboard`.

---

## Quick Start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # 174 modules, 737kb (gzip 191kb)
npm run test:run     # 2 tests passed
```

Env: copy `.env.example` → `.env` → `VITE_API_BASE_URL=http://127.0.0.1:8000/api`

---

## Conventions

- **API:** never call `axios` directly in components → use `src/api/*.api.js` + `ENDPOINTS` map
- **State:** async via `createAsyncThunk` in `features/*`; selectors co-located
- **Routing:** all routes in `src/routes/index.jsx`; guards via `ProtectedRoute`
- **Components:** white `Card` `rounded-2xl border-border shadow-subtle`, `Badge`, `Button` variants; `Table` + `Pagination`, `ProgressBar/Ring`, `Skeleton`/`EmptyState` for loading/empty
- **Responsive:** Desktop sidebar (240px) + mobile Drawer + bottom nav (lg:hidden); `grid md:grid-cols-*`, `overflow-x-auto` tables, large touch targets
- **AI UX:** AI only where valuable (resume/PDF analysis, MCQ, roadmap, JD extraction, matching explanation) — no badge spam
- **Match UI:** `%` + stacked bars + *Why you match / What you're missing* explanation
- **Verification:** `✓ Verified` badge for companies, `Pending/Under Review/Verified/Rejected` tabs
```
