"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

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
      <footer className="z-10 w-full border-t border-border bg-surface/50">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-4 text-center sm:px-6 md:flex-row md:text-left lg:px-10">
          <p className="text-sm text-ink-muted">© {year} DealScope Intelligence. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-end">
            <Link href="#" className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-primary">Terms of Service</Link>
            <Link href="#" className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-primary">API Status</Link>
            <Link href="#" className="inline-flex min-h-11 items-center text-sm text-ink-muted transition-colors hover:text-primary">Contact Support</Link>
          </div>
        </div>
      </footer>
    );
  }

  // "full" variant â€” rich marketing footer
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
            <Logo size="sm" />
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

