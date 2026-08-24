# 🚀 CareerSync — Complete Manual Testing & QA Guide (Hinglish Version)

Is guide se aapki team ya koi bhi tester easily **CareerSync** platform ko step-by-step test kar sakta hai. Isme bataya gaya hai ki **Student**, **Company (Recruiter)**, aur **Institute (Academician)** kya-kya kar sakte hain.

---

## 📌 1. Platform Login Links & URLs

| Service / Portal | URL Link | Description |
| :--- | :--- | :--- |
| **Frontend Web Portal** | [`http://localhost:5173/`](http://localhost:5173/) | Main Website (Students, Industry & Institute ke liye) |
| **Backend REST API** | [`http://127.0.0.1:8000/api/`](http://127.0.0.1:8000/api/) | Django REST API Base Root |
| **Swagger Interactive Docs** | [`http://127.0.0.1:8000/swagger/`](http://127.0.0.1:8000/swagger/) | API Testing UI with Authorization |
| **ReDoc Clean Docs** | [`http://127.0.0.1:8000/redoc/`](http://127.0.0.1:8000/redoc/) | Clean API Reference Page |
| **Django Admin Panel** | [`http://127.0.0.1:8000/admin/`](http://127.0.0.1:8000/admin/) | Database Admin Panel |

---

## 🔑 2. Testing Credentials (Login ID & Passwords)

Testing karne ke liye niche diye gaye pre-seeded accounts use karein:

### 👤 1. Student Account (Rahul Verma / Sharma)
- **Email**: `rahul.verma@college.edu` (ya `student@skillbridge.ai`)
- **Password**: `Password123!`
- **Role**: `student`
- **Career Goal**: Full Stack Developer

### 🏢 2. Company / Recruiter Accounts (Industry Partners)
| Company Name | HR Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Flipkart** | `hr@flipkart.com` | `Password123!` | `industry` |
| **CRED** | `careers@cred.club` | `Password123!` | `industry` |
| **Razorpay** | `jobs@razorpay.com` | `Password123!` | `industry` |
| **Postman** | `hiring@postman.com` | `Password123!` | `industry` |

### 🎓 3. Academician / Institute Account
- **Email**: `Institute@skillbridge.ai` (ya `prof@university.edu`)
- **Password**: `Password123!`
- **Role**: `academician`

---

## 🧪 3. Step-by-Step Role-Wise Testing Scenarios

---

### 🎓 ROLE 1: Student kya-kya kar sakta hai?

Student user ka main goal hai apne Skills assess karna, Gap analyze karna, Courses padhna, aur Matching Internships/Jobs par Apply karna.

#### Step A1: Student Login
1. Browser me [`http://localhost:5173/login`](http://localhost:5173/login) kholein.
2. Email: `rahul.verma@college.edu` aur Password: `Password123!` daalein.
3. **Login** button par click karein.
4. **Expected Outcome**: Student Dashboard ([`http://localhost:5173/student/dashboard`](http://localhost:5173/student/dashboard)) open ho jayega.

#### Step A2: Apne Skills & Calculated Level dekhna
1. Left Sidebar me **My Skills** par jayein ([`http://localhost:5173/student/skills`](http://localhost:5173/student/skills)).
2. Yahan Python, React, JavaScript ka current score aur level badge dekhein (*Beginner*, *Intermediate*, *Advanced*, *Expert*).
3. **Expected Outcome**: Scores ke base par Level badge aur Verified badge (`Verified ✓`) dikhega.

#### Step A3: Live Skill Assessment MCQ Test dena (Phase 6 & 7)
1. **Assessments** page par jayein ([`http://localhost:5173/student/assessments`](http://localhost:5173/student/assessments)).
2. **Python Foundations Assessment** chunen aur **Start Assessment** par click karein.
3. Modal me MCQ questions ke answers tick karein aur **Submit Quiz** par click karein.
4. **Expected Outcome**:
   - Backend turant Score % evaluate karke aapko result dikhayega.
   - Agar Score >= 60% aaya, to Skill Verified badge milega aur `StudentSkill` table update ho jayegi.

#### Step A4: Skill Gap Engine Analysis (Phase 8)
1. **Skill Gap Analysis** page par jayein ([`http://localhost:5173/student/skill-gap`](http://localhost:5173/student/skill-gap)).
2. Yahan aapka target role (*Full Stack Developer*) ke benchmarks ke sath comparison dikhega.
3. Gap Severity badges dikhenge (*High Priority*, *Medium*, *Low*).
4. **Recalculate Gaps ↻** button par click karke check karein.
5. **Expected Outcome**: Live formula $\max(\text{Required} - \text{Current}, 0)$ se gap instantly calculate hoke dikhega.

#### Step A5: Gap-Driven Learning Recommendations (Phase 9)
1. **My Learning** page par jayein ([`http://localhost:5173/student/my-learning`](http://localhost:5173/student/my-learning)).
2. Phase 9 Engine dwara generated personalized courses dekhein.
3. Reason badge dekhein (e.g., *"Recommended because Python has 90% gap"*).
4. Course par **Mark Done ✓** click karein.
5. **Expected Outcome**: Status backend me `pending` se `completed` update ho jayega.

#### Step A6: Internship/Job Match % dekhna aur Apply karna (Phase 10, 11 & 12)
1. **Internships** page par jayein ([`http://localhost:5173/student/internships`](http://localhost:5173/student/internships)).
2. Hiring partners (*Flipkart*, *CRED*, *Postman*) ki postings dekhein.
3. **Frontend Engineering Intern @ Flipkart** par **Apply Now** click karein.
4. **Expected Outcome**:
   - Application DB me save ho jayegi aur button **"Applied ✓"** me badal jayega.
   - Wapas Apply karne par duplicate prevention alert aayega ("Already applied").

#### Step A7: Application Pipeline Stepper & Audit Log tracking (Phase 12)
1. **My Applications** page par jayein ([`http://localhost:5173/student/applications`](http://localhost:5173/student/applications)).
2. Real-time pipeline stepper dekhein (*Applied* -> *Under Review* -> *Shortlisted* -> *Interview* -> *Selected*).

#### Step A8: Learning & Career Analytics (Phase 13)
1. **Analytics** page par jayein ([`http://localhost:5173/student/analytics`](http://localhost:5173/student/analytics)).
2. Career Readiness %, Verified Skills ratio, aur Assessment Pass Rate dekhein.

---

### 🏢 ROLE 2: Company / Recruiter kya-kya kar sakta hai?

Company Recruiter ka main goal hai Job/Internship post karna, Candidates ki Match Score dekhna, aur Status update karna.

#### Step B1: Recruiter Login
1. [`http://localhost:5173/login`](http://localhost:5173/login) par jayein.
2. Email: `hr@flipkart.com` aur Password: `Password123!` daalein.
3. **Login** click karein.
4. **Expected Outcome**: Recruiter Dashboard ([`http://localhost:5173/industry/dashboard`](http://localhost:5173/industry/dashboard)) open hoga.

#### Step B2: Aayi hui Applications aur Match Score dekhna
1. **Applications** tab par jayein ([`http://localhost:5173/industry/applications`](http://localhost:5173/industry/applications)).
2. Students dwara submit ki gayi applications aur unka AI Match Score % dekhein.

#### Step B3: Student ka Application Status Shortlist karna
1. Candidate (Rahul Verma) ki application select karein.
2. Status ko `applied` se badal kar `shortlisted` karein.
3. Remark likhein: *"Strong React & Python skill profile."* aur **Update Status** click karein.
4. **Expected Outcome**: Status shortlisted ho jayega aur `ApplicationStatusHistory` audit log me timestamp save hoga.

#### Step B4: Recruiter Authorization & Security Check
1. Log out karke CRED Recruiter (`careers@cred.club` / `Password123!`) se login karein.
2. Swagger API se Flipkart ki opportunity edit karne ki koshish karein.
3. **Expected Outcome**: Backend `403 Forbidden` (`IsCompanyOwner` permission) se access block kar dega.

---

### 🎓 ROLE 3: Institute / Academician kya-kya kar sakta hai?

Institute / Academician ka main goal hai College ke sabhi Students ka Skill Level, Readiness, aur Top Skill Gaps ka aggregate overview dekhna.

#### Step C1: Academician Login
1. [`http://localhost:5173/login`](http://localhost:5173/login) par jayein.
2. Email: `Institute@skillbridge.ai` aur Password: `Password123!` daalein.
3. **Login** click karein.

#### Step C2: Institutional Analytics Overview (Phase 13)
1. **Institute Dashboard** ([`http://localhost:5173/institute/dashboard`](http://localhost:5173/institute/dashboard)) open karein.
2. **Student Readiness Distribution** dekhein:
   - **Job Ready** (Skills Score >= 75%)
   - **Improving** (Skills Score 50-74%)
   - **Needs Focus** (Skills Score < 50%)
3. **Top Institutional Skill Gaps** dekhein ki college ke sabse zyada bache kis skill me weak hain (e.g., Docker, Python).
4. **Placement Statistics** dekhein (Total Applications, Shortlisted count, Selected count).
5. **Expected Outcome**: Sabhi metrics live Django ORM database query se real-time compute honge without exposing individual student passwords or private data.

---

## 🛠 4. Swagger API Documentation se Testing Kaise Karein?

1. Browser me [`http://127.0.0.1:8000/swagger/`](http://127.0.0.1:8000/swagger/) kholein.
2. Top-right me **Authorize** 🔓 button par click karein.
3. Apka JWT access token is format me enter karein:
   ```text
   Bearer <your_access_token>
   ```
4. Endpoints test karein:
   - `POST /api/auth/login/` -> Token lena
   - `GET /api/skills/gaps/` -> Skill Gaps dekhna
   - `GET /api/courses/recommendations/` -> Course recommendations
   - `GET /api/opportunities/matches/` -> AI Weighted Match Scores
   - `GET /api/applications/my/` -> Student Applications
   - `GET /api/analytics/student/` -> Live Analytics

---

## ✅ 5. Testing Sign-Off Checklist for QA Team

| # | Module / Feature | Testing Goal | Status |
| :--- | :--- | :--- | :---: |
| 1 | **Rebranding** | Har page par CareerSync logo & text dikhna chahiye | ✅ PASS |
| 2 | **User Auth (Phases 1-3)** | Multi-role registration & JWT Login works | ✅ PASS |
| 3 | **Skills & Levels (Phase 4-5)** | Beginner/Intermediate/Advanced/Expert level calculation | ✅ PASS |
| 4 | **Assessments (Phase 6-7)** | MCQ quiz, hidden correct answers, score update | ✅ PASS |
| 5 | **Skill Gap Engine (Phase 8)** | Benchmark gap formula & severity rules | ✅ PASS |
| 6 | **Learning Recs (Phase 9)** | Gap matching to courses & status complete | ✅ PASS |
| 7 | **Opportunities (Phase 10)** | Postings with minimum skill score criteria | ✅ PASS |
| 8 | **Matching Engine (Phase 11)**| Weighted Match Score % calculation | ✅ PASS |
| 9 | **Applications (Phase 12)** | 1-click apply, duplicate block, recruiter status update | ✅ PASS |
| 10 | **Analytics (Phase 13)** | Dynamic ORM queries for Student, Recruiter & Institute | ✅ PASS |
| 11 | **Swagger API Docs** | `/swagger/` & `/redoc/` HTTP 200 OK | ✅ PASS |

---

> **Note**: Kisi bhi error ya bug reporting ke liye, screenshot aur Django server trace logs ke saath team me share karein! Happy Testing! 🎉
