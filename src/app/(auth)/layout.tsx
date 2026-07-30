import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { PageTransition } from "@/components/layout/PageTransition";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-paper font-sans">
      {/* Static radial lighting creates depth without repaint-heavy animated blurs. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_15%_15%,rgba(0,80,203,0.09),transparent_38%),radial-gradient(ellipse_at_85%_85%,rgba(79,124,255,0.08),transparent_35%)]" />
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Logo size="sm" />
        <Link href="/" className="motion-press inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-ink-muted transition-colors duration-200 hover:bg-surface hover:text-ink-primary focus-visible:ring-2 focus-visible:ring-primary">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </header>
      <PageTransition className="relative z-10 flex flex-grow items-center justify-center px-4 py-8 md:px-0">
        {children}
      </PageTransition>
      <Footer variant="minimal" />
    </div>
  );
}
