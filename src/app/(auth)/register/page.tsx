"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ApiClientError } from "@/api/errors";

export default function RegisterPage() {
  const router = useRouter();
  const { login, register, isLoading, isAuthenticated } = useSession();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
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
      // Extract detailed validation messages from backend response
      if (err instanceof ApiClientError && err.validationErrors?.length) {
        err.validationErrors.forEach((ve) => {
          toast.error(ve.message);
        });
      } else {
        const message = err instanceof Error ? err.message : "Failed to register. Please try again.";
        toast.error(message);
      }
    }
  };

  return (
    <Card className="border border-border bg-surface shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-ink-primary">
          Create Account
        </CardTitle>
        <CardDescription className="text-ink-muted">
          Sign up to search and compare products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-body-sm font-medium text-ink-primary" htmlFor="name">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-body-sm font-medium text-ink-primary" htmlFor="email">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-body-sm font-medium text-ink-primary" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-[11px] text-ink-muted">
              Min. 6 characters.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full justify-center bg-accent text-white hover:bg-accent/90"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center text-body-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
