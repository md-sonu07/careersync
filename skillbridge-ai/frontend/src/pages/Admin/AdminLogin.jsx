import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import Button from "../../components/ui/Button";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Admin email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    setToast(null);

    await new Promise((r) => setTimeout(r, 700));

    // Simple mock admin check — any email containing admin passes for demo
    const isAdminLike = /admin/i.test(form.email);
    if (!isAdminLike) {
      setToast({ type: "danger", message: "Access denied. This portal is for administrators only." });
      setLoading(false);
      return;
    }

    const token = `admin-token-${Date.now()}`;
    const user = { email: form.email, role: "admin", name: "Administrator" };
    try {
      dispatch(setCredentials({ user, token }));
    } catch {}
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("auth", JSON.stringify({ user, role: "admin", token }));
    if (form.remember) localStorage.setItem("adminRemember", "true");

    setToast({ type: "success", message: "Authenticated. Redirecting to admin dashboard..." });
    setTimeout(() => navigate("/admin/dashboard"), 600);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      {/* Left — Secure branding (dark slate) */}
      <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between overflow-hidden bg-slate-900 border-r border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" aria-hidden />
        <div className="absolute -top-28 -right-28 w-[28rem] h-[28rem] bg-emerald-900/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-slate-800 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative z-10 p-10 xl:p-12">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-white text-slate-900 grid place-items-center">
              <span className="material-symbols-outlined text-[22px]">shield</span>
            </span>
            <span className="text-white">
              <span className="font-bold tracking-tight">SkillBridge</span>{" "}
              <span className="font-light">Admin</span>
            </span>
          </Link>
          <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Secure access only
          </p>
        </div>

        <div className="relative z-10 px-10 xl:px-12 pb-10">
          <h1 className="text-[2rem] font-bold leading-tight text-white">
            Admin control
            <br />
            <span className="text-slate-400 font-semibold">centre</span>
          </h1>
          <p className="mt-4 text-slate-400 leading-relaxed max-w-md">
            Manage verifications, users, industry partners and platform operations. All actions are
            logged and audited.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <span className="material-symbols-outlined text-slate-300">verified_user</span>
              <p className="mt-2 text-sm font-medium text-white">Verification queue</p>
              <p className="text-xs text-slate-400 mt-1">Approve industry &amp; academician accounts</p>
            </div>
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-4">
              <span className="material-symbols-outlined text-slate-300">monitoring</span>
              <p className="mt-2 text-sm font-medium text-white">Platform analytics</p>
              <p className="text-xs text-slate-400 mt-1">Users, projects, placements</p>
            </div>
          </div>

          <p className="mt-8 text-xs text-slate-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Protected by enterprise-grade encryption • Session timeout 30m
          </p>
        </div>
      </div>

      {/* Mobile top */}
      <div className="lg:hidden bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-white text-slate-900 grid place-items-center">
            <span className="material-symbols-outlined text-[20px]">shield</span>
          </span>
          <span className="font-bold">SkillBridge Admin</span>
        </Link>
        <Link to="/login" className="text-xs font-medium text-slate-300 border border-slate-700 rounded-full px-3 py-1.5">
          User login
        </Link>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-slate-950">
        <div className="w-full max-w-[420px]">
          {toast && (
            <div
              role="alert"
              className={`mb-6 rounded-xl border px-4 py-3 text-sm flex gap-3 items-start ${
                toast.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : toast.type === "danger"
                  ? "bg-red-500/10 border-red-500/20 text-red-300"
                  : "bg-slate-800 border-slate-700 text-slate-200"
              }`}
            >
              <span className="material-symbols-outlined text-[20px] shrink-0">
                {toast.type === "success" ? "check_circle" : toast.type === "danger" ? "gpp_maybe" : "info"}
              </span>
              <span className="leading-relaxed">{toast.message}</span>
              <button onClick={() => setToast(null)} className="ml-auto opacity-60 hover:opacity-100" aria-label="Dismiss">
                ✕
              </button>
            </div>
          )}

          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 grid place-items-center shadow-lg">
                <span className="material-symbols-outlined text-[28px]">shield</span>
              </div>
              <h2 className="mt-4 text-xl font-bold text-white tracking-tight">Admin sign in</h2>
              <p className="mt-1.5 text-sm text-slate-400">Restricted to authorized personnel only</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="admin-email" className="text-sm font-medium text-slate-200">
                  Admin email <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@skillbridge.ai"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "admin-email-error" : undefined}
                    className={`w-full rounded-xl border bg-slate-800 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      errors.email ? "border-red-500/50 focus:ring-red-500/30" : "border-slate-700 focus:ring-white/10 focus:border-slate-600"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p id="admin-email-error" role="alert" className="mt-1.5 text-xs font-medium text-red-400">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="admin-password" className="text-sm font-medium text-slate-200">
                    Password <span className="text-red-400 ml-1">*</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setToast({ type: "info", message: "Contact super-admin to reset credentials." });
                    }}
                    className="text-xs font-medium text-slate-400 hover:text-white underline underline-offset-4 decoration-slate-700"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "admin-password-error" : undefined}
                    className={`w-full rounded-xl border bg-slate-800 pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      errors.password ? "border-red-500/50 focus:ring-red-500/30" : "border-slate-700 focus:ring-white/10 focus:border-slate-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {errors.password && (
                  <p id="admin-password-error" role="alert" className="mt-1.5 text-xs font-medium text-red-400">
                    {errors.password}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-white accent-white"
                />
                <span className="text-sm text-slate-300">Remember this device</span>
              </label>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full rounded-xl bg-white text-slate-900 hover:bg-slate-100 border-0 font-semibold disabled:opacity-60"
              >
                {loading ? "Authenticating…" : "Sign in to dashboard"}
              </Button>

              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-3 flex gap-2.5">
                <span className="material-symbols-outlined text-amber-400 text-[18px] shrink-0 mt-0.5">warning</span>
                <p className="text-xs leading-relaxed text-amber-200/90">
                  This is a secure area. Unauthorized access is monitored and will be reported.
                </p>
              </div>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              Not an admin?{" "}
              <Link to="/login" className="font-medium text-slate-300 hover:text-white underline underline-offset-4 decoration-slate-700">
                Go to user login
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-[11px] tracking-wide text-slate-600">
            © 2026 SkillBridge AI • Admin Portal v1.0 • All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
