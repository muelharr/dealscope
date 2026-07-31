"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/auth";
import { toast } from "sonner";
import { ApiClientError } from "@/api/errors";
import { Logo } from "@/components/layout/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, isAuthenticated } = useSession();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      await login({ email, password });
      toast.success("Successfully logged in!");
      router.push(callbackUrl);
    } catch (err: unknown) {
      if (err instanceof ApiClientError && err.validationErrors?.length) {
        err.validationErrors.forEach((ve) => toast.error(ve.message));
      } else {
        const message = err instanceof Error ? err.message : "Failed to login. Please try again.";
        toast.error(message);
      }
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto motion-enter">
      <div className="flex flex-col items-center mb-8">
        <Logo size="lg" />
        <p className="mt-2 text-sm text-ink-muted">Intelligence-driven market analysis.</p>
      </div>

      {/* Login Card */}
      <div className="bg-white dark:bg-surface border border-border rounded-xl p-8 md:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 px-4 bg-paper border border-border rounded-lg text-base text-ink-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-ink-muted" htmlFor="password">
                Password
              </label>
              <Link href="#" className="text-xs font-semibold text-primary hover:underline transition-all">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
          </div>

          {/* Remember me */}
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-ink-muted">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-accent-subtle active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      {/* Footer link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-ink-muted">
          New to DealScope?{" "}
          <Link href="/register" scroll={false} className="text-primary font-semibold transition-colors hover:underline focus-visible:rounded-sm">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="text-center text-ink-muted">Loading...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}

