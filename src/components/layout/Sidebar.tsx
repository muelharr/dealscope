"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Search,
  Heart,
  Bell,
  Settings,
  Sun,
  Moon,
  Laptop
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/queries/useWishlist";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/alerts", label: "Price Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length ?? 0;

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 border-r border-border bg-surface px-spacing-4 py-spacing-6 lg:flex lg:flex-col lg:justify-between">
      {/* Top Section: Logo & Navigation */}
      <div className="flex flex-col gap-spacing-6">
        <Link href="/" className="flex items-center gap-spacing-2 px-spacing-2">
          <div className="h-8 w-8 rounded-md bg-accent flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-ink-primary">
            DealScope
          </span>
        </Link>

        <nav className="flex flex-col gap-spacing-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const showBadge = item.href === "/wishlist" && wishlistCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-spacing-3 px-spacing-3 py-spacing-2 rounded-md transition-all duration-150 active:scale-98 font-sans text-body-sm font-medium",
                  isActive
                    ? "bg-secondary text-ink-primary"
                    : "text-ink-muted hover:bg-accent-subtle hover:text-ink-primary"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.label}</span>
                {showBadge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-white select-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Profile & Theme Toggle */}
      <div className="flex flex-col gap-spacing-4 border-t border-border pt-spacing-4">
        {/* Theme Selector */}
        <div className="flex items-center justify-between rounded-md bg-secondary p-spacing-1">
          <button
            onClick={() => setTheme("light")}
            aria-label="Light theme"
            className={cn(
              "flex flex-1 items-center justify-center rounded-sm py-1.5 transition-all",
              theme === "light"
                ? "bg-surface shadow-sm text-ink-primary"
                : "text-ink-muted hover:text-ink-primary"
            )}
          >
            <Sun className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark theme"
            className={cn(
              "flex flex-1 items-center justify-center rounded-sm py-1.5 transition-all",
              theme === "dark"
                ? "bg-surface shadow-sm text-ink-primary"
                : "text-ink-muted hover:text-ink-primary"
            )}
          >
            <Moon className="h-4 w-4" />
          </button>
          <button
            onClick={() => setTheme("system")}
            aria-label="System theme"
            className={cn(
              "flex flex-1 items-center justify-center rounded-sm py-1.5 transition-all",
              theme === "system"
                ? "bg-surface shadow-sm text-ink-primary"
                : "text-ink-muted hover:text-ink-primary"
            )}
          >
            <Laptop className="h-4 w-4" />
          </button>
        </div>

        {/* Profile Card Placeholder */}
        <div className="flex items-center gap-spacing-3 px-spacing-2">
          <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-body-sm text-ink-primary leading-tight">
              John Doe
            </span>
            <span className="font-sans text-micro-label text-ink-muted">
              Premium User
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
