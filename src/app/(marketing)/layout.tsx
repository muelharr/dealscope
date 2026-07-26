import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { Logo } from "@/components/layout/Logo";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {/* Public Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md px-6 py-3.5 lg:px-12">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Logo href="/" size="md" />

          <nav className="flex items-center gap-6">
            <Link
              href="/pricing"
              className="text-xs font-bold font-sans uppercase tracking-wider text-ink-muted hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg text-xs font-bold font-sans uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-98"
            >
              Go to App
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
