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
        toast.success("Account created successfully! Please log in.");
        router.push("/login");
      } else {
        await login({ name, email, password });
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
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
  );
}

