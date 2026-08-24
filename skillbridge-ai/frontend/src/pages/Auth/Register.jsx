import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { profileApi } from "../../api/profile.api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AppIcon from '../../components/ui/AppIcon';

const ROLE_TABS = [
  { id: "student", label: "Student", icon: "school" },
  { id: "industry", label: "Industry", icon: "business" },
  { id: "Institute", label: "Institute", icon: "apartment" },
];

export default function Register() {
  const navigate = useNavigate();
  const { role: paramRole } = useParams();
  const dispatch = useDispatch();

  const initialRole = paramRole && ["student", "industry", "Institute"].includes(paramRole) ? paramRole : "student";
  const [activeRole, setActiveRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(null);

  // Short forms as requested:
  // Student: name, email, phone, password
  // Industry: companyName, companyEmail, password
  // Institute: name, email, password
  const [studentForm, setStudentForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [industryForm, setIndustryForm] = useState({ companyName: "", companyEmail: "", password: "" });
  const [InstituteForm, setInstituteForm] = useState({ name: "", email: "", password: "" });

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
    if (!studentForm.phone.trim()) e.phone = "Phone number required";
    if (!studentForm.password) e.password = "Password required";
    else if (studentForm.password.length < 6) e.password = "At least 6 chars";
    return e;
  };

  const validateIndustry = () => {
    const e = {};
    if (!industryForm.companyName.trim()) e.companyName = "Company name required";
    if (!industryForm.companyEmail.trim()) e.companyEmail = "Company email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(industryForm.companyEmail)) e.companyEmail = "Invalid email";
    if (!industryForm.password) e.password = "Password required";
    else if (industryForm.password.length < 6) e.password = "At least 6 chars";
    return e;
  };

  const validateInstitute = () => {
    const e = {};
    if (!InstituteForm.name.trim()) e.name = "Full name required";
    if (!InstituteForm.email.trim()) e.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(InstituteForm.email)) e.email = "Invalid email";
    if (!InstituteForm.password) e.password = "Password required";
    else if (InstituteForm.password.length < 6) e.password = "At least 6 chars";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = {};
    if (activeRole === "student") errs = validateStudent();
    else if (activeRole === "industry") errs = validateIndustry();
    else errs = validateInstitute();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
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
      const { first_name, last_name } = splitName(industryForm.companyName);
      registerPayload = {
        email: industryForm.companyEmail,
        first_name,
        last_name,
        role: "industry",
        password: industryForm.password,
        confirm_password: industryForm.password,
      };
    } else {
      const { first_name, last_name } = splitName(InstituteForm.name);
      registerPayload = {
        email: InstituteForm.email,
        first_name,
        last_name,
        role: "Institute",
        password: InstituteForm.password,
        confirm_password: InstituteForm.password,
      };
    }

    try {
      const resultAction = await dispatch(registerUser(registerPayload));
      if (registerUser.fulfilled.match(resultAction)) {
        if (activeRole === "student") {
          try {
            await profileApi.updateStudentProfile({ phone: studentForm.phone });
          } catch {
            // Profile fallback
          }
          setToast({ type: "success", message: "Account created! Redirecting to Student dashboard…" });
          setTimeout(() => navigate("/student/dashboard"), 700);
        } else if (activeRole === "industry") {
          try {
            await profileApi.updateCompanyProfile({ company_name: industryForm.companyName });
          } catch {
            // Profile fallback
          }
          setPending({
            role: "industry",
            title: "Verification Pending",
            desc: "Your company account has been created. You can complete remaining company profile details in your dashboard.",
          });
        } else {
          setPending({
            role: "Institute",
            title: "Account Created",
            desc: "Your Institute account has been created. You can complete your institution profile details in your dashboard.",
          });
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
            <AppIcon name="hourglass_top" className="text-3xl" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-charcoal">{pending.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{pending.desc}</p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={() => navigate("/login")} className="w-full">Go to Login</Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">Back to Home</Button>
          </div>
          <p className="mt-4 text-xs text-muted">
            Demo: also saved locally as {pending.role} — you can still{" "}
            <Link to={pending.role === "industry" ? "/industry/dashboard" : "/Institute/dashboard"} className="text-primary underline">
              view dashboard
            </Link>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full my-auto grid @5xl:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-border bg-surface items-stretch">
        {/* Left — Branding Panel (50% Width, Equal Height, Fixed Top Gap) */}
        <div className="relative hidden @5xl:flex bg-primary text-white flex-col justify-between p-10 xl:p-12 overflow-hidden h-full">
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
                  <AppIcon name="verified" className="text-[18px] block" />
                </div>
                <span>AI-Powered Skill Gap Analysis &amp; Progress Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-white/90">
                <div className="p-1.5 rounded-lg bg-white/15 text-emerald-300 shrink-0">
                  <AppIcon name="auto_stories" className="text-[18px] block" />
                </div>
                <span>Personalized Learning Roadmaps &amp; Industry Courses</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-white/90">
                <div className="p-1.5 rounded-lg bg-white/15 text-emerald-300 shrink-0">
                  <AppIcon name="work" className="text-[18px] block" />
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
        <div className="@5xl:hidden bg-primary text-white px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-white text-primary grid place-items-center font-bold">C</span>
            <span className="font-bold">CareerSync</span>
          </Link>
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
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1.5 rounded-xl mb-6 border border-border/60">
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
                    className={`flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-white text-primary shadow-sm border border-border/40 font-bold"
                        : "text-charcoal/70 hover:text-charcoal hover:bg-white/50"
                    }`}
                  >
                    <AppIcon 
                      name={tab.icon} 
                      className={`text-[18px] ${isActive ? "text-primary" : "text-charcoal/50"}`} 
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-charcoal tracking-tight">
                {activeRole === "student" ? "Create Student Account" : activeRole === "industry" ? "Create Industry/Company Account" : "Create Institute/College Account"}
              </h2>
              <p className="mt-1.5 text-sm text-charcoal/70">
                {activeRole === "student" ? "Get started in 30 seconds — set up full profile later." : activeRole === "industry" ? "Hire verified talent — complete company profile in dashboard." : "Manage college placements — complete profile in dashboard."}{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">Sign in</Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {activeRole === "student" && (
                <>
                  <Input label="Full name" placeholder="Ananya Sharma" autoComplete="name" required value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} error={errors.name} />
                  <Input label="Email address" type="email" placeholder="you@college.edu" autoComplete="email" required value={studentForm.email} onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })} error={errors.email} />
                  <Input label="Phone number" placeholder="+91 98765 43210" autoComplete="tel" required value={studentForm.phone} onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })} error={errors.phone} />
                  <div>
                    <label htmlFor="student-password" className="text-sm font-medium text-charcoal">Password <span className="text-danger ml-1">*</span></label>
                    <div className="relative mt-1.5">
                      <Input id="student-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={studentForm.password} onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })} error={errors.password} wrapperClassName="!gap-0" className="pr-11" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-charcoal hover:bg-background">
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {errors.password && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.password}</p>}
                  </div>
                </>
              )}

              {activeRole === "industry" && (
                <>
                  <Input label="Company name" placeholder="TechNova Pvt Ltd" required value={industryForm.companyName} onChange={(e) => setIndustryForm({ ...industryForm, companyName: e.target.value })} error={errors.companyName} />
                  <Input label="Company email" type="email" placeholder="hr@technova.com" autoComplete="email" required value={industryForm.companyEmail} onChange={(e) => setIndustryForm({ ...industryForm, companyEmail: e.target.value })} error={errors.companyEmail} />
                  <div>
                    <label htmlFor="industry-password" className="text-sm font-medium text-charcoal">Password <span className="text-danger ml-1">*</span></label>
                    <div className="relative mt-1.5">
                      <Input id="industry-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={industryForm.password} onChange={(e) => setIndustryForm({ ...industryForm, password: e.target.value })} error={errors.password} wrapperClassName="!gap-0" className="pr-11" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-charcoal hover:bg-background">
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {errors.password && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.password}</p>}
                  </div>
                </>
              )}

              {activeRole === "Institute" && (
                <>
                  <Input label="Full name" placeholder="Dr. Priya Singh" autoComplete="name" required value={InstituteForm.name} onChange={(e) => setInstituteForm({ ...InstituteForm, name: e.target.value })} error={errors.name} />
                  <Input label="Email address" type="email" placeholder="priya@college.edu" autoComplete="email" required value={InstituteForm.email} onChange={(e) => setInstituteForm({ ...InstituteForm, email: e.target.value })} error={errors.email} />
                  <div>
                    <label htmlFor="Institute-password" className="text-sm font-medium text-charcoal">Password <span className="text-danger ml-1">*</span></label>
                    <div className="relative mt-1.5">
                      <Input id="Institute-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" required value={InstituteForm.password} onChange={(e) => setInstituteForm({ ...InstituteForm, password: e.target.value })} error={errors.password} wrapperClassName="!gap-0" className="pr-11" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-charcoal hover:bg-background">
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                    {errors.password && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.password}</p>}
                  </div>
                </>
              )}

              <label className="flex items-start gap-2.5 text-sm leading-relaxed mt-2">
                <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-border text-primary accent-primary" />
                <span className="text-muted">I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a></span>
              </label>

              <Button type="submit" variant="primary" size="lg" className="w-full rounded-xl mt-2" disabled={loading}>
                {loading ? "Creating account…" : `Create ${activeRole === "student" ? "Student" : activeRole === "industry" ? "Industry" : "Institute"} account`}
              </Button>
              <p className="text-center text-xs text-charcoal/60 mt-4">
                Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link> • Admin? <Link to="/admin/login" className="font-medium text-charcoal hover:text-primary underline decoration-border">Admin login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
