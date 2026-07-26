import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-ink-muted">
        <div className="flex items-center gap-4">
          <Logo href="/" size="sm" />
          <span>© {new Date().getFullYear()} DealScope. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-6 font-medium">
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
