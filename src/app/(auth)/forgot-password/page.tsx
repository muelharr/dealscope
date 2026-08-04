"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Logo } from "@/components/layout/Logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API response delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success("Recovery link sent to your email!");
    } catch {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] mx-auto motion-enter">
      <div className="flex flex-col items-center mb-8">
        <Logo size="lg" />
        <p className="mt-2 text-sm text-ink-muted">Intelligence-driven market analysis.</p>
      </div>

      <div className="bg-white dark:bg-surface border border-border rounded-xl p-8 md:p-10 shadow-sm">
        {isSubmitted ? (
          <div className="space-y-6 text-center">
            <h2 className="text-xl font-bold text-ink-primary">Check your email</h2>
            <p className="text-sm text-ink-muted leading-relaxed">
              We have sent password recovery instructions to <strong className="text-ink-primary">{email}</strong>.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Did not receive the email? Try again
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-ink-primary">Reset Password</h2>
              <p className="text-xs text-ink-muted">
                Enter your email address and we will send you a recovery link.
              </p>
            </div>

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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-accent-subtle active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending recovery link..." : "Send Recovery Link"}
            </button>
          </form>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-ink-muted">
          Remember your password?{" "}
          <Link href="/login" className="text-primary font-semibold transition-colors hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
