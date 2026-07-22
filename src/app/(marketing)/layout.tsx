import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Public Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur-md px-spacing-4 py-spacing-3 lg:px-spacing-8">
        <div className="mx-auto max-w-container flex h-10 items-center justify-between">
          <Link href="/" className="flex items-center gap-spacing-2">
            <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="font-sans font-bold text-xl tracking-tight text-ink-primary">
              DealScope
            </span>
          </Link>
          <div className="flex items-center gap-spacing-4">
            <Link 
              href="/pricing" 
              className="text-body-sm font-medium text-ink-muted hover:text-ink-primary transition-all"
            >
              Pricing
            </Link>
            <Link 
              href="/dashboard" 
              className="px-spacing-3 py-1.5 rounded-md text-body-sm font-medium bg-accent text-white hover:bg-accent/90 transition-all active:scale-98"
            >
              Go to App
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Public Footer */}
      <Footer />
    </div>
  );
}
