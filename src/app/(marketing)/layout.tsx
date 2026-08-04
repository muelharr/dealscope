import Link from "next/link";
import { Menu } from "lucide-react";
import Footer from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { PageTransition } from "@/components/layout/PageTransition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-12 sm:pt-4">
          <div className="pointer-events-auto relative flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface/80 px-3 py-2.5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-lg sm:px-6 sm:py-3">
            <Logo size="sm" />
            <nav aria-label="Marketing navigation" className="hidden items-center gap-7 md:flex">
              <Link href="#features" className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">Features</Link>
              <Link href="#how-it-works" className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">How it works</Link>
              <Link href="/pricing" className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">Pricing</Link>
              <Link href="#faq" className="inline-flex min-h-11 items-center text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">FAQ</Link>
            </nav>
            <div className="flex shrink-0 items-center gap-1 sm:gap-3">
              <Link href="/login" className="hidden min-h-11 items-center rounded-lg px-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex">Sign in</Link>
              <Link href="/register" className="motion-press inline-flex min-h-11 items-center rounded-lg bg-primary px-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-4">Get started</Link>
              <details className="group md:hidden">
                <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-secondary hover:text-ink-primary [&::-webkit-details-marker]:hidden">
                  <Menu className="size-5" />
                  <span className="sr-only">Open navigation</span>
                </summary>
                <nav aria-label="Mobile marketing navigation" className="absolute right-0 top-[calc(100%+0.75rem)] flex w-[min(18rem,calc(100vw-2rem))] flex-col rounded-xl border border-border bg-surface p-2 shadow-xl">
                  <Link href="#features" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted hover:bg-secondary hover:text-ink-primary">Features</Link>
                  <Link href="#how-it-works" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted hover:bg-secondary hover:text-ink-primary">How it works</Link>
                  <Link href="/pricing" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted hover:bg-secondary hover:text-ink-primary">Pricing</Link>
                  <Link href="#faq" className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-ink-muted hover:bg-secondary hover:text-ink-primary">FAQ</Link>
                  <Link href="/login" className="mt-1 flex min-h-11 items-center rounded-lg border-t border-border px-3 pt-2 text-sm font-semibold text-primary hover:bg-primary/5">Sign in</Link>
                </nav>
              </details>
            </div>
          </div>
        </div>
      </header>
      <PageTransition className="flex flex-1 flex-col">
        <main className="flex-1">{children}</main>
      </PageTransition>
      <Footer />
    </div>
  );
}
