import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface py-spacing-8">
      <div className="mx-auto max-w-container px-spacing-4 lg:px-spacing-8 flex flex-col gap-spacing-4 md:flex-row md:items-center md:justify-between text-body-sm text-ink-muted">
        <div>
          <span>© {new Date().getFullYear()} DealScope. All rights reserved.</span>
        </div>
        <div className="flex flex-wrap gap-spacing-4">
          <Link href="/about" className="hover:text-ink-primary transition-all">About</Link>
          <Link href="/careers" className="hover:text-ink-primary transition-all">Careers</Link>
          <Link href="/contact" className="hover:text-ink-primary transition-all">Contact</Link>
          <Link href="/privacy" className="hover:text-ink-primary transition-all">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-ink-primary transition-all">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
