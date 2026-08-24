import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials, registerUser } from "../../features/auth/authSlice";
import { profileApi } from "../../api/profile.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";

const COLLEGE_OPTIONS = ["IIT Bombay", "IIT Delhi", "IIT Madras", "NIT Trichy", "BITS Pilani", "Delhi University", "Anna University", "VIT Vellore", "DTU", "NSUT", "Other"];
const DEGREE_OPTIONS = ["B.Tech", "B.E.", "B.Sc", "BCA", "M.Tech", "MBA", "MCA", "Diploma", "Other"];
const CAREER_GOALS = ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Data Analyst", "Data Scientist", "DevOps Engineer", "Cloud Engineer", "AI/ML Engineer", "Cybersecurity", "Product Manager"];
const INDUSTRY_TYPES = ["Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail", "Consulting", "Other"];
const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];

const ROLE_TABS = [
  { id: "student", label: "Student", icon: "school", desc: "Learn & get hired" },
  { id: "industry", label: "Industry", icon: "business", desc: "Post & hire" },
  { id: "academia", label: "Academia", icon: "apartment", desc: "Manage college" },
];

export default function Register() {
  const navigate = useNavigate();
  const { role: paramRole } = useParams();
  const dispatch = useDispatch();

  const initialRole = paramRole && ["student", "industry", "academia"].includes(paramRole) ? paramRole : "student";
  const [activeRole, setActiveRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [studentForm, setStudentForm] = useState({ name: "", email: "", password: "", phone: "", college: "", degree: "", gradYear: "", careerGoal: "", interests: "" });
  const [industryForm, setIndustryForm] = useState({ companyName: "", companyEmail: "", password: "", website: "", industryType: "", companySize: "", location: "", contactPerson: "", businessInfo: "" });
  const [academiaForm, setAcademiaForm] = useState({ name: "", email: "", password: "", college: "", department: "", designation: "", contact: "" });

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    if (!skills.includes(v)) setSkills((p) => [...p, v]);
    setSkillInput("");
  };

  const splitName = (fullName) => {
    const parts = (fullName || "").trim().split(/\s+/);
    const first_name = parts[0] || "User";
    const last_name = parts.slice(1).join(" ") || "User";
    return { first_name, last_name };
  };

  const validateStudent = () => {
    const e = {};
    if (!studentForm.name.trim()) e.name = "Full name required";
    if (!studentForm.email.trim()) e.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentForm.email)) e.email = "Invalid email";
    if (!studentForm.password) e.password = "Password required";
    else if (studentForm.password.length < 6) e.password = "At least 6 chars";
    if (!studentForm.phone.trim()) e.phone = "Phone required";
    if (!studentForm.college) e.college = "College required";
    if (!studentForm.degree) e.degree = "Degree required";
    if (!studentForm.gradYear) e.gradYear = "Graduation year required";
    if (!studentForm.careerGoal) e.careerGoal = "Career goal required";
    return e;
  };
  const validateIndustry = () => {
    const e = {};
    if (!industryForm.companyName.trim()) e.companyName = "Company name required";
    if (!industryForm.companyEmail.trim()) e.companyEmail = "Company email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(industryForm.companyEmail)) e.companyEmail = "Invalid email";
    if (!industryForm.password) e.password = "Password required";
    else if (industryForm.password.length < 6) e.password = "At least 6 chars";
    if (!industryForm.industryType) e.industryType = "Industry type required";
    if (!industryForm.companySize) e.companySize = "Company size required";
    if (!industryForm.location.trim()) e.location = "Location required";
    if (!industryForm.contactPerson.trim()) e.contactPerson = "Contact person required";
    return e;
  };
  const validateAcademia = () => {
    const e = {};
    if (!academiaForm.name.trim()) e.name = "Name required";
    if (!academiaForm.email.trim()) e.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(academiaForm.email)) e.email = "Invalid email";
    if (!academiaForm.password) e.password = "Password required";
    else if (academiaForm.password.length < 6) e.password = "At least 6 chars";
    if (!academiaForm.college.trim()) e.college = "College required";
    if (!academiaForm.department.trim()) e.department = "Department required";
    if (!academiaForm.designation.trim()) e.designation = "Designation required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (activeRole === "student") errs = validateStudent();
    else if (activeRole === "industry") errs = validateIndustry();
    else errs = validateAcademia();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setToast(null);

    let registerPayload = {};
    if (activeRole === "student") {
      const { first_name, last_name } = splitName(studentForm.name);
      registerPayload = {
        email: studentForm.email,
        first_name,
        last_name,
        role: "student",
        password: studentForm.password,
        confirm_password: studentForm.password,
      };
    } else if (activeRole === "industry") {
      const { first_name, last_name } = splitName(industryForm.contactPerson || industryForm.companyName);
      registerPayload = {
        email: industryForm.companyEmail,
        first_name,
        last_name,
        role: "industry",
        password: industryForm.password,
        confirm_password: industryForm.password,
      };
    } else {
      const { first_name, last_name } = splitName(academiaForm.name);
      registerPayload = {
        email: academiaForm.email,
        first_name,
        last_name,
        role: "academician",
        password: academiaForm.password,
        confirm_password: academiaForm.password,
      };
    }

    try {
      const resultAction = await dispatch(registerUser(registerPayload));
      if (registerUser.fulfilled.match(resultAction)) {
        if (activeRole === "student") {
          try {
            await profileApi.updateStudentProfile({
              phone: studentForm.phone,
              college: studentForm.college,
              degree: studentForm.degree,
              graduation_year: studentForm.gradYear,
              career_goal: studentForm.careerGoal,
              interests: studentForm.interests,
            });
          } catch {
            // Profile update fallback
          }
          setToast({ type: "success", message: "Account created! Redirecting to Student dashboard…" });
          setTimeout(() => navigate("/student/dashboard"), 700);
        } else if (activeRole === "industry") {
          try {
            await profileApi.updateCompanyProfile({
              company_name: industryForm.companyName,
              website: industryForm.website,
              location: industryForm.location,
              industry_type: industryForm.industryType,
              company_size: industryForm.companySize,
              contact_person: industryForm.contactPerson,
              business_info: industryForm.businessInfo,
            });
          } catch {
            // Profile update fallback
          }
          setPending({ role: "industry", title: "Verification Pending", desc: "Your company profile is under review. Our admin team will verify your documents within 24–48 hours. You’ll be notified by email once approved." });
        } else {
          try {
            await profileApi.updateAcademicianProfile({
              college: academiaForm.college,
              department: academiaForm.department,
              designation: academiaForm.designation,
              contact: academiaForm.contact,
            });
          } catch {
            // Profile update fallback
          }
          setPending({ role: "academia", title: "Verification Pending", desc: "Your academician profile is under review. Verification typically takes 24 hours. You’ll receive an email once approved." });
        }
      } else {
        const errorMsg = resultAction.payload || "Registration failed. Please check your details.";
        setToast({ type: "danger", message: errorMsg });
      }
    } catch (err) {
      setToast({ type: "danger", message: err.message || "An unexpected error occurred during registration." });
    } finally {
      setLoading(false);
    }
  };

  if (pending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-surface rounded-2xl border border-border shadow-card p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <span className="material-symbols-outlined text-3xl">hourglass_top</span>
          </div>
          <h2 className="mt-4 text-xl font-bold text-charcoal">{pending.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{pending.desc}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => navigate("/login")} className="w-full">Go to Login</Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">Back to Home</Button>
          </div>
          <p className="mt-4 text-xs text-muted">Demo: also saved locally as {pending.role} — you can still <Link to={pending.role === "industry" ? "/industry/dashboard" : "/academia/dashboard"} className="text-primary underline">view dashboard</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full my-auto grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-border bg-surface items-stretch">
        {/* Left — Branding Panel (50% Width, Equal Height, No Form Scroll) */}
        <div className="relative hidden lg:flex bg-primary text-white flex-col justify-between p-10 xl:p-12 overflow-hidden h-full">
          <div className="absolute inset-0 opacity-[0.07]" aria-hidden style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-accent/20 rounded-full blur-3xl" />

          {/* Top Logo */}
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white text-primary grid place-items-center font-bold text-lg">C</span>
              <span className="text-xl font-bold tracking-tight">CareerSync</span>
            </Link>
            <p className="mt-2 text-white/70 text-sm font-medium tracking-wide uppercase">Bridging Talent &amp; Opportunity</p>
          </div>

          {/* Middle Rich Content (Fixed Top Gap) */}
          <div className="relative z-10 mt-8 mb-auto space-y-6">
            <div>
              <h1 className="text-[2.25rem] font-extrabold leading-tight">Create your<br />future with us.</h1>
              <p className="mt-3 text-white/80 leading-relaxed text-sm max-w-md">
                Whether you&apos;re a student, industry partner or educator — CareerSync connects you to real projects, mentors, and verified career paths.
              </p>
            </div>

            {/* Platform Highlights List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-white/90">
                <div className="p-1.5 rounded-lg bg-white/15 text-emerald-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px] block">verified</span>
                </div>
                <span>AI-Powered Skill Gap Analysis &amp; Progress Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-white/90">
                <div className="p-1.5 rounded-lg bg-white/15 text-emerald-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px] block">auto_stories</span>
                </div>
                <span>Personalized Learning Roadmaps &amp; Industry Courses</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-white/90">
                <div className="p-1.5 rounded-lg bg-white/15 text-emerald-300 shrink-0">
                  <span className="material-symbols-outlined text-[18px] block">work</span>
                </div>
                <span>Direct Verified Internship &amp; Entry-Level Job Matching</span>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 text-center pt-2">
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-bold">10k+</p><p className="text-xs text-white/70 mt-1">Students</p></div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-bold">500+</p><p className="text-xs text-white/70 mt-1">Companies</p></div>
              <div className="rounded-2xl bg-white/10 border border-white/15 p-4"><p className="text-2xl font-bold">1.2k</p><p className="text-xs text-white/70 mt-1">Mentors</p></div>
            </div>

            {/* Testimonial Quote */}
            <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-5">
              <blockquote className="text-white text-sm leading-relaxed">“We hired 12 interns through CareerSync — all pre-vetted and project-ready.”</blockquote>
              <div className="mt-3 flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="" className="w-9 h-9 rounded-full border border-white/20 object-cover" />
                <div><p className="text-sm font-semibold">Rajesh Verma</p><p className="text-xs text-white/60">HR Lead — Infosys</p></div>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-white/70 flex items-center justify-between">
            <span>CareerSync Platform &copy; 2026</span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              Trusted by 50+ Universities
            </span>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-primary text-white px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5"><span className="w-9 h-9 rounded-xl bg-white text-primary grid place-items-center font-bold">C</span><span className="font-bold">CareerSync</span></Link>
          <Link to="/login" className="text-sm font-medium underline underline-offset-4 decoration-white/30">Sign in</Link>
        </div>

        {/* Right Column — Form Panel (50% Width, Full Height, Top Aligned) */}
        <div className="flex flex-col justify-start p-6 sm:p-8 lg:p-10 bg-surface h-full">
          <div className="w-full max-w-lg mx-auto py-2">
            {toast && (
              <div role="alert" className={`mb-6 rounded-xl border px-4 py-3 text-sm flex gap-3 items-start ${toast.type === "success" ? "bg-success/10 border-success/20 text-success" : "bg-primary/5 border-primary/20 text-primary"}`}>
                <span className="material-symbols-outlined text-[20px] shrink-0">{toast.type === "success" ? "check_circle" : "info"}</span>
                <span className="leading-relaxed">{toast.message}</span>
                <button onClick={() => setToast(null)} className="ml-auto opacity-60 hover:opacity-100" aria-label="Dismiss">✕</button>
              </div>
            )}

            {/* Top Role Selector Tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-2xl mb-6 border border-border/60">
              {ROLE_TABS.map((tab) => {
                const isActive = activeRole === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveRole(tab.id);
                      navigate(`/register/${tab.id}`, { replace: true });
                    }}
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-white text-primary shadow-sm border border-border/40 font-bold"
                        : "text-charcoal/70 hover:text-charcoal hover:bg-white/50"
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isActive ? "text-primary" : "text-charcoal/50"}`}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-charcoal tracking-tight">
                {activeRole === "student" ? "Create Student Account" : activeRole === "industry" ? "Create Industry Account" : "Create Academia Account"}
              </h2>
              <p className="mt-1.5 text-sm text-charcoal/70">
                {activeRole === "student" ? "Join as a learner — get skills, assessments & internships." : activeRole === "industry" ? "Hire verified talent — post internships & jobs." : "Manage your college — track skills & placements."}{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">Sign in</Link>
              </p>
            </div>

            {activeRole === "industry" || activeRole === "academia" ? (
              <p className="mb-4 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2.5 text-xs leading-relaxed text-amber-800"><span className="font-bold">Note:</span> {activeRole === "industry" ? "Industry accounts require admin verification (24–48h) before posting." : "Academia accounts are verified against college domain."}</p>
            ) : null}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {activeRole === "student" && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full name" placeholder="Ananya Sharma" autoComplete="name" required value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} error={errors.name} />
                    <Input label="Phone" placeholder="+91 98765 43210" autoComplete="tel" required value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} error={errors.phone} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Email" type="email" placeholder="you@college.edu" autoComplete="email" required value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} error={errors.email} />
                    <div>
                      <label htmlFor="student-password" className="text-sm font-medium text-charcoal">Password <span className="text-danger ml-1">*</span></label>
                      <div className="relative mt-1.5">
                        <Input id="student-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} error={errors.password} wrapperClassName="!gap-0" className="pr-11" />
                        <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-charcoal hover:bg-background"><span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span></button>
                      </div>
                      {errors.password && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.password}</p>}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select label="College / University" required value={studentForm.college} onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })} options={COLLEGE_OPTIONS} placeholder="Select college" error={errors.college} />
                    <Select label="Degree" required value={studentForm.degree} onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })} options={DEGREE_OPTIONS} placeholder="Select degree" error={errors.degree} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select label="Graduation year" required value={studentForm.gradYear} onChange={(e) => setStudentForm({ ...studentForm, gradYear: e.target.value })} options={["2025", "2026", "2027", "2028", "2029"]} placeholder="Year" error={errors.gradYear} />
                    <Select label="Career goal" required value={studentForm.careerGoal} onChange={(e) => setStudentForm({ ...studentForm, careerGoal: e.target.value })} options={CAREER_GOALS} placeholder="Select goal" error={errors.careerGoal} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-charcoal">Skills (add to personalize)</label>
                    <div className="mt-1.5 flex gap-2">
                      <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="e.g. React, Python" className="flex-1 rounded-xl border border-border bg-white px-3.5 py-2.5 text-sm placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                      <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
                    </div>
                    {skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/15 px-3 py-1 text-xs font-medium text-primary">
                            {s}
                            <button type="button" onClick={() => setSkills((p) => p.filter((x) => x !== s))} aria-label={`Remove ${s}`} className="ml-1 hover:text-danger">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Input label="Interests" placeholder="e.g. AI, Web Dev, Data Science (comma separated)" value={studentForm.interests} onChange={(e) => setStudentForm({ ...studentForm, interests: e.target.value })} />
                </>
              )}

              {activeRole === "industry" && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Company name" placeholder="TechNova Pvt Ltd" required value={industryForm.companyName} onChange={(e) => setIndustryForm({ ...industryForm, companyName: e.target.value })} error={errors.companyName} />
                    <Input label="Company email" type="email" placeholder="hr@technova.com" required value={industryForm.companyEmail} onChange={(e) => setIndustryForm({ ...industryForm, companyEmail: e.target.value })} error={errors.companyEmail} />
                  </div>
                  <div>
                    <label htmlFor="industry-password" className="text-sm font-medium text-charcoal">Password <span className="text-danger ml-1">*</span></label>
                    <div className="relative mt-1.5">
                      <Input id="industry-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={industryForm.password} onChange={(e) => setIndustryForm({ ...industryForm, password: e.target.value })} error={errors.password} wrapperClassName="!gap-0" className="pr-11" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-charcoal hover:bg-background"><span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span></button>
                    </div>
                    {errors.password && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.password}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Website" placeholder="https://technova.com" value={industryForm.website} onChange={(e) => setIndustryForm({ ...industryForm, website: e.target.value })} />
                    <Input label="Location" placeholder="Bengaluru, India" required value={industryForm.location} onChange={(e) => setIndustryForm({ ...industryForm, location: e.target.value })} error={errors.location} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Select label="Industry type" required value={industryForm.industryType} onChange={(e) => setIndustryForm({ ...industryForm, industryType: e.target.value })} options={INDUSTRY_TYPES} placeholder="Select type" error={errors.industryType} />
                    <Select label="Company size" required value={industryForm.companySize} onChange={(e) => setIndustryForm({ ...industryForm, companySize: e.target.value })} options={COMPANY_SIZES} placeholder="Select size" error={errors.companySize} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Contact person" placeholder="Rahul Mehta — HR Lead" required value={industryForm.contactPerson} onChange={(e) => setIndustryForm({ ...industryForm, contactPerson: e.target.value })} error={errors.contactPerson} />
                    <Input label="Phone / Business info" placeholder="+91 98xxx xxxxx • GSTIN optional" value={industryForm.businessInfo} onChange={(e) => setIndustryForm({ ...industryForm, businessInfo: e.target.value })} />
                  </div>
                </>
              )}

              {activeRole === "academia" && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full name" placeholder="Dr. Priya Singh" required value={academiaForm.name} onChange={(e) => setAcademiaForm({ ...academiaForm, name: e.target.value })} error={errors.name} />
                    <Input label="Email" type="email" placeholder="priya@college.edu" required value={academiaForm.email} onChange={(e) => setAcademiaForm({ ...academiaForm, email: e.target.value })} error={errors.email} />
                  </div>
                  <div>
                    <label htmlFor="academia-password" className="text-sm font-medium text-charcoal">Password <span className="text-danger ml-1">*</span></label>
                    <div className="relative mt-1.5">
                      <Input id="academia-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={academiaForm.password} onChange={(e) => setAcademiaForm({ ...academiaForm, password: e.target.value })} error={errors.password} wrapperClassName="!gap-0" className="pr-11" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-charcoal hover:bg-background"><span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span></button>
                    </div>
                    {errors.password && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.password}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="College" placeholder="Delhi Technological University" required value={academiaForm.college} onChange={(e) => setAcademiaForm({ ...academiaForm, college: e.target.value })} error={errors.college} />
                    <Input label="Department" placeholder="Computer Science" required value={academiaForm.department} onChange={(e) => setAcademiaForm({ ...academiaForm, department: e.target.value })} error={errors.department} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Designation" placeholder="Assistant Professor" required value={academiaForm.designation} onChange={(e) => setAcademiaForm({ ...academiaForm, designation: e.target.value })} error={errors.designation} />
                    <Input label="Contact details" placeholder="+91 98765 43210" value={academiaForm.contact} onChange={(e) => setAcademiaForm({ ...academiaForm, contact: e.target.value })} />
                  </div>
                </>
              )}

              <label className="flex items-start gap-2.5 text-sm leading-relaxed mt-1">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-border text-primary accent-primary" />
                <span className="text-muted">I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a> {activeRole !== "student" && <span>• I confirm I am authorized to create this {activeRole} account</span>}</span>
              </label>

              <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl mt-1" disabled={loading}>{loading ? "Creating account…" : `Create ${activeRole === "student" ? "Student" : activeRole === "industry" ? "Industry" : "Academia"} account`}</Button>
              <p className="text-center text-xs text-charcoal/60 mt-4">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link> • Admin? <Link to="/admin/login" className="font-medium text-charcoal hover:text-primary underline decoration-border">Admin login</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
