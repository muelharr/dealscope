"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-surface/70 backdrop-blur-md px-spacing-4 py-spacing-3 lg:px-spacing-8">
      <div className="flex h-10 items-center justify-between">
        {/* Left Side: Mobile Search Trigger / Breadcrumbs Placeholder */}
        <div className="flex items-center gap-spacing-4">
          <div className="relative w-64 lg:w-96 hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-ink-muted">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search products, brands, or deals..."
              disabled
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-body-sm bg-muted border border-border-interactive focus:outline-none cursor-not-allowed opacity-80"
            />
          </div>
          {/* Logo visible only on mobile/tablet */}
          <Link href="/" className="flex items-center gap-spacing-2 lg:hidden">
            <div className="h-7 w-7 rounded-md bg-accent flex items-center justify-center text-white font-bold text-sm">
              D
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-ink-primary">
              DealScope
            </span>
          </Link>
        </div>

        {/* Right Side: Actions (Notifications, Avatar) */}
        <div className="flex items-center gap-spacing-4">
          {/* Notifications Button */}
          <button
            aria-label="View notifications"
            className="p-2 rounded-full hover:bg-accent-subtle text-ink-muted hover:text-ink-primary transition-all active:scale-98"
          >
            <Bell className="h-5 w-5" />
          </button>

          {/* User Profile Avatar */}
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white font-medium text-sm">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
