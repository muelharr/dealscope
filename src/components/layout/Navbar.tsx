"use client";

import { Bell, Search } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { Logo } from "@/components/layout/Logo";

export default function Navbar() {
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border bg-surface/80 backdrop-blur-md px-6 py-3.5 lg:px-8">
      <div className="flex h-9 items-center justify-between">
        {/* Left Side: Search Bar & Mobile Logo */}
        <div className="flex items-center gap-4">
          <div className="relative w-64 lg:w-96 hidden md:block">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-ink-muted">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search products, brands, or deals..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs bg-secondary/60 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-ink-primary"
            />
          </div>
          {/* Logo visible on mobile */}
          <div className="lg:hidden">
            <Logo href="/" size="sm" />
          </div>
        </div>

        {/* Right Side: Actions (Notifications, Profile Avatar) */}
        <div className="flex items-center gap-4">
          <button
            aria-label="View notifications"
            className="p-2 rounded-full hover:bg-secondary text-ink-muted hover:text-ink-primary transition-all active:scale-98 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-negative border-2 border-surface"></span>
          </button>

          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {user?.username ? user.username.slice(0, 2) : "AU"}
          </div>
        </div>
      </div>
    </header>
  );
}
