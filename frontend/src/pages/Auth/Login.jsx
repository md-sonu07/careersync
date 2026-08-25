import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast as hotToast } from 'react-hot-toast';
import { setCredentials, loginUser, logout } from "../../features/auth/authSlice";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import AppIcon from '../../components/ui/AppIcon';

const ROLE_ROUTES = {
  student: "/student/dashboard",
  industry: "/industry/dashboard",
  Institute: "/Institute/dashboard",
  academician: "/Institute/dashboard",
  admin: "/admin/dashboard",
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get("redirect") || searchParams.get("returnUrl");

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      hotToast.error("Please fix the validation errors");
      return;
    }
    setLoading(true);
    setToast(null);

    try {
      const cleanEmail = form.email.trim().toLowerCase();
      const resultAction = await dispatch(loginUser({ email: cleanEmail, password: form.password }));
      if (loginUser.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;
        const user = payload.user;
        const userRole = (user?.role || "student").toLowerCase();

        // Check for admin approval if user is Institute or Industry
        if ((userRole === "academician" || userRole === "institute" || userRole === "industry") && !user?.is_verified) {
          await dispatch(logout());
          const msg = "Your account is pending Admin Approval. Please wait for an administrator to verify your account before signing in.";
          setToast({
            type: "danger",
            message: msg,
          });
          hotToast.error(msg);
          return;
        }

        if (form.rememberMe) localStorage.setItem("rememberMe", "true");

        const welcomeMsg = `Welcome back${user?.first_name ? `, ${user.first_name}` : ""}! Redirecting...`;
        setToast({
          type: "success",
          message: welcomeMsg,
        });
        hotToast.success(welcomeMsg);

        const target = redirectParam || ROLE_ROUTES[userRole] || ROLE_ROUTES.student;
        setTimeout(() => navigate(target), 600);
      } else {
        const errorMsg = resultAction.payload || "Login failed. Please check your credentials.";
        setToast({
          type: "danger",
          message: errorMsg,
        });
        hotToast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = err.message || "An unexpected error occurred during sign in.";
      setToast({
        type: "danger",
        message: errorMsg,
      });
      hotToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  const handleGooglePlaceholder = () => {
    setToast({
      type: "info",
      message: "Google sign-in is coming soon. Please use email login.",
    });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full my-auto grid @5xl:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl border border-border bg-surface items-stretch">
        {/* Left — Branding / Testimonial (50% Width, Equal Height) */}
        <div className="relative hidden @5xl:flex bg-primary text-white flex-col justify-between p-10 xl:p-12 overflow-hidden h-full">
          {/* subtle pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            aria-hidden
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-[28rem] h-[28rem] bg-accent/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-white text-primary grid place-items-center font-bold text-lg">
                C
              </span>
              <span className="text-xl font-bold tracking-tight">
                CareerSync
              </span>
            </Link>
            <p className="mt-2 text-white/70 text-sm font-medium tracking-wide uppercase">
              Bridging Talent &amp; Opportunity
            </p>
          </div>

          <div className="relative z-10 my-auto py-8">
            <h1 className="text-[2.25rem] font-bold leading-tight">
              Where ambition
              <br />
              meets opportunity.
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed text-sm">
              Join thousands of students, mentors and industry partners building
              the future workforce — unified on one intelligent platform.
            </p>

            <div className="mt-8 rounded-2xl bg-white/10 backdrop-blur border border-white/15 p-5">
              <div className="flex gap-1 text-accent-soft" aria-hidden>
                {"★★★★★".split("").map((s, i) => (
                  <span key={i} className="text-sm">
                    ★
                  </span>
                ))}
              </div>
              <blockquote className="mt-3 text-white leading-relaxed text-sm">
                “CareerSync helped me land my first internship within 3 weeks.
                The mentorship and project matching is unmatched.”
              </blockquote>
              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt=""
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div>
                  <p className="text-sm font-semibold">Ananya Sharma</p>
                  <p className="text-xs text-white/60">
                    B.Tech CSE — Placed at TCS
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-xs text-white/70">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
              10k+ Active learners
            </span>
            <span>•</span>
            <span className="font-medium">500+ Industry partners</span>
          </div>
        </div>

        {/* Mobile top brand bar */}
        <div className="@5xl:hidden bg-primary text-white px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-white text-primary grid place-items-center font-bold">
              C
            </span>
            <span className="font-bold">CareerSync</span>
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium underline underline-offset-4 decoration-white/30"
          >
            Sign up
          </Link>
        </div>

        {/* Right — Form card (50% Width, Equal Height) */}
        <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 bg-surface h-full">
          <div className="w-full max-w-md mx-auto">
            {/* Toast / Alert placeholder */}
            {toast && (
              <div
                role="alert"
                aria-live="polite"
                className={`mb-6 rounded-xl border px-4 py-3 text-sm flex gap-3 items-start ${
                  toast.type === "success"
                    ? "bg-success/10 border-success/20 text-success"
                    : toast.type === "danger"
                    ? "bg-danger/10 border-danger/20 text-danger"
                    : "bg-primary/5 border-primary/20 text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {toast.type === "success"
                    ? "check_circle"
                    : toast.type === "danger"
                    ? "error"
                    : "info"}
                </span>
                <span className="leading-relaxed">{toast.message}</span>
                <button
                  onClick={() => setToast(null)}
                  className="ml-auto opacity-60 hover:opacity-100"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-charcoal tracking-tight">
                Welcome back
              </h2>
              <p className="mt-1.5 text-sm text-charcoal/70">
                Sign in to continue your journey.{" "}
                <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4">
                  Create account
                </Link>
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@college.edu"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                error={errors.email}
              />

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="input-password"
                    className="text-sm font-medium text-charcoal"
                  >
                    Password <span className="text-danger ml-1" aria-hidden>*</span>
                  </label>
                  <Link
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setToast({
                        type: "info",
                        message: "Password reset link sent if email exists (mock).",
                      });
                    }}
                    className="text-xs font-medium text-primary hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="input-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange("password")}
                    error={errors.password}
                    wrapperClassName="!gap-0"
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-muted hover:text-charcoal hover:bg-background transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
                    {errors.password}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={handleChange("rememberMe")}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary"
                />
                <span className="text-sm text-charcoal">Remember me</span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-xl"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>

              <div className="relative flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted uppercase tracking-widest font-medium">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full rounded-xl bg-white border-border hover:bg-background gap-3"
                onClick={handleGooglePlaceholder}
              >
                <AppIcon name="google" className="w-[18px] h-[18px]" />
                Continue with Google
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-charcoal/70">
              Don&apos;t have an account?{" "}
              <Link
                to={redirectParam ? `/register?redirect=${encodeURIComponent(redirectParam)}` : "/register"}
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
