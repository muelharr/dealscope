import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Floating Glass Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-4">
          <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-surface/70 backdrop-blur-xl px-6 py-3 shadow-lg shadow-black/[0.03]">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M8 36L16 20L24 28L32 12L40 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="40" cy="12" r="4" fill="currentColor"/>
                </svg>
              </div>
              <span className="font-bold text-base text-ink-primary">DealScope</span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-ink-muted hover:text-ink-primary transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-ink-muted hover:text-ink-primary transition-colors">How it Works</Link>
              <Link href="#pricing" className="text-sm font-medium text-ink-muted hover:text-ink-primary transition-colors">Pricing</Link>
              <Link href="#faq" className="text-sm font-medium text-ink-muted hover:text-ink-primary transition-colors">FAQ</Link>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-ink-muted hover:text-ink-primary transition-colors hidden sm:block">
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
