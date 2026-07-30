"use client";

import Link from "next/link";

interface FooterProps {
  /** "full" shows all links (app pages), "minimal" shows fewer (auth pages) */
  variant?: "full" | "minimal";
}

export default function Footer({ variant = "full" }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-surface/50 z-10">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-sm text-ink-muted">
          © {year} DealScope Intelligence. All rights reserved.
        </p>
        {variant === "full" ? (
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">
              API Status
            </Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">
              Contact Support
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">
              Support
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
}
