import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";
import { PageTransition } from "@/components/layout/PageTransition";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <header className="fixed inset-x-0 top-0 z-50 pointer-events-none">
        <div className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 lg:px-12 sm:pt-4">
          <div className="pointer-events-auto flex items-center justify-between rounded-2xl border border-border/60 bg-surface/80 px-4 py-2.5 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-lg sm:px-6 sm:py-3">
            <Logo size="sm" />
            <nav aria-label="Marketing navigation" className="hidden items-center gap-7 md:flex">
              <Link href="#features" className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">How it works</Link>
              <Link href="/pricing" className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">Pricing</Link>
              <Link href="#faq" className="text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:rounded-sm">FAQ</Link>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="hidden rounded-lg px-2 py-1 text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink-primary focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex">Sign in</Link>
              <Link href="/register" className="motion-press rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:px-4">Get started</Link>
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
