"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/auth";
import { toast } from "sonner";
import { ApiClientError } from "@/api/errors";
import { Zap, Brain } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const { login, register, isLoading, isAuthenticated } = useSession();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agreedTerms, setAgreedTerms] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Password strength calculation
  const getPasswordStrength = (val: string) => {
    let score = 0;
    if (val.length > 5) score++;
    if (val.length > 8) score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = ["bg-border", "bg-negative", "bg-caution", "bg-positive", "bg-positive"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!agreedTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      if (register) {
        await register({ name, email, password });
      } else {
        await login({ name, email, password });
      }
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof ApiClientError && err.validationErrors?.length) {
        err.validationErrors.forEach((ve) => toast.error(ve.message));
      } else {
        const message = err instanceof Error ? err.message : "Failed to register. Please try again.";
        toast.error(message);
      }
    }
  };

  return (
    <div className="max-w-[1280px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 lg:px-0">
      {/* Left column: Brand hero (desktop only) */}
      <div className="hidden lg:flex lg:col-span-6 flex-col justify-center pr-10 space-y-8">
        <Logo size="lg" />

        <h1 className="text-5xl font-bold text-ink-primary leading-tight tracking-tight">
          Smart intelligence for the{" "}
          <span className="text-primary">savvy shopper</span>.
        </h1>

        <p className="text-lg text-ink-muted max-w-md">
          Join thousands of users utilizing AI-driven market analysis to secure the best prices across every marketplace.
        </p>

        {/* Feature highlight cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/80 dark:bg-surface/80 backdrop-blur-sm border border-border/50 p-4 rounded-xl space-y-2">
            <Zap className="h-5 w-5 text-positive" />
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Real-time Data</p>
            <p className="text-sm font-semibold text-ink-primary">Live marketplace tracking</p>
          </div>
          <div className="bg-white/80 dark:bg-surface/80 backdrop-blur-sm border border-border/50 p-4 rounded-xl space-y-2">
            <Brain className="h-5 w-5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">AI Advisor</p>
            <p className="text-sm font-semibold text-ink-primary">Smart purchase timing</p>
          </div>
        </div>
      </div>

      {/* Right column: Registration form */}
      <div className="lg:col-span-6 flex items-center justify-center">
        <div className="bg-white dark:bg-surface border border-border rounded-xl shadow-sm w-full max-w-md p-8 md:p-10 space-y-8">
          {/* Form header */}
          <div className="text-center lg:text-left space-y-2">
            {/* Mobile-only logo */}
            <div className="lg:hidden flex justify-center mb-6"><Logo size="lg" variant="icon" /></div>
            <h2 className="text-2xl font-bold text-ink-primary">Get Started</h2>
            <p className="text-ink-muted">Create your intelligence profile in seconds.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted ml-1" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-11 px-4 bg-paper border border-border rounded-lg text-base text-ink-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted ml-1" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 bg-paper border border-border rounded-lg text-base text-ink-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted ml-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-11 px-4 pr-12 bg-paper border border-border rounded-lg text-base text-ink-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>

              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColors[strength] : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    Password Strength: {strengthLabels[strength] || ""}
                  </p>
                </div>
              )}
            </div>

            {/* Terms & Privacy */}
            <div className="flex items-start gap-3 py-2">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  required
                  className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                />
              </div>
              <label htmlFor="terms" className="text-sm text-ink-muted">
                I agree to the{" "}
                <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit */}
            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary text-white font-semibold rounded-lg hover:bg-accent-subtle active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating account..." : "Create Free Account"}
                {!isLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                )}
              </button>

              {/* No credit card badge */}
              <div className="flex items-center justify-center gap-2 text-positive bg-positive/5 py-2 px-3 rounded-lg border border-positive/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span className="text-[11px] font-bold uppercase tracking-wider">No credit card required</span>
              </div>
            </div>
          </form>

          {/* OR CONTINUE WITH */}
          <div className="space-y-4">
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center">
                <span className="bg-white dark:bg-surface px-3 text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 h-11 border border-border rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <span className="text-sm font-medium">Google</span>
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center gap-2 h-11 border border-border rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.01-.09-.02-.19-.02-.29 0-1.02.48-2.14 1.19-2.95.73-.82 1.99-1.52 2.98-1.55.02.06.04.13.05.2zM20.61 17.15c-.62 1.4-1.35 2.69-2.42 3.83-1.15 1.21-2.33 1.98-4.02 1.98-1.52 0-2.54-.9-4.14-.9-1.63 0-2.76.93-4.16.93-1.54 0-2.81-.84-3.93-2.08C.63 19.3-.3 16.67-.3 14.14c0-3.91 2.53-5.97 5.03-5.97 1.48 0 2.77 1.01 3.73 1.01.96 0 2.43-1.24 4.25-1.05.72.03 2.77.3 4.08 2.23-3.03 1.85-2.49 5.65.82 6.79z" fill="currentColor" className="text-ink-primary"/></svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-ink-muted">
              Already have an account?{" "}
              <Link href="/login" scroll={false} className="text-primary font-semibold transition-colors hover:underline focus-visible:rounded-sm">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

