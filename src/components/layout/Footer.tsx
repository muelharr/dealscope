"use client";

import Link from "next/link";

interface FooterProps {
  /** "full" = rich multi-column (marketing), "app" = simple bar (dashboard), "minimal" = auth pages */
  variant?: "full" | "app" | "minimal";
}

export default function Footer({ variant = "full" }: FooterProps) {
  const year = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className="w-full border-t border-[#f1f5f9] bg-white z-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-[#94a3b8]">© {year} DealScope Intelligence.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-[#94a3b8] hover:text-[#0050cb] transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-[#94a3b8] hover:text-[#0050cb] transition-colors">Terms</Link>
            <Link href="#" className="text-sm text-[#94a3b8] hover:text-[#0050cb] transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === "app") {
    return (
      <footer className="w-full border-t border-border bg-surface/50 z-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-sm text-ink-muted">© {year} DealScope Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">API Status</Link>
            <Link href="#" className="text-sm text-ink-muted hover:text-primary transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    );
  }

  // "full" variant — rich marketing footer
  const columns = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "/pricing" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Browser Extension", href: "#" },
        { label: "API Access", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press Kit", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#" },
        { label: "Help Center", href: "#" },
        { label: "System Status", href: "#" },
        { label: "Community", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "Security", href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-[#f1f5f9] bg-white">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#0050cb] flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M8 36L16 20L24 28L32 12L40 24" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="40" cy="12" r="4" fill="currentColor"/>
                </svg>
              </div>
              <span className="font-bold text-base text-[#0f1117]">DealScope</span>
            </Link>
            <p className="mt-4 text-sm text-[#64748b] max-w-xs leading-relaxed">
              Intelligence-driven marketplace analytics for data-driven shopping decisions.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-bold text-[#94a3b8] uppercase tracking-[0.12em] mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#64748b] hover:text-[#0050cb] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#f1f5f9] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#94a3b8]">© {year} DealScope Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {/* Social icons (simple circles as placeholders) */}
            {["X", "GH", "LI"].map((s) => (
              <a key={s} href="#" className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-[10px] font-bold text-[#94a3b8] hover:text-[#64748b] transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
