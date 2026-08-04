"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Heart,
  Bell,
  Clock,
  BarChart3,
  Sun,
  Moon,
  Laptop,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/Logo";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { useCurrentUser, useSession } from "@/auth/hooks";
import { useRouter } from "next/navigation";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeProModal } from "@/components/shared/UpgradeProModal";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/search", label: "History", icon: Clock },
  { href: "/compare", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const user = useCurrentUser();
  const { logout } = useSession();
  const { isPro } = useSubscription();
  const router = useRouter();
  const { data: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length ?? 0;
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore logout errors
    }
    router.push('/login');
  };

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 border-r border-border bg-surface px-4 py-6 lg:flex lg:flex-col lg:justify-between">
      {/* Top Section: Logo & Navigation */}
      <div className="flex flex-col gap-6">
        {/* Brand — shared logo always returns to the public landing page. */}
        <div className="px-2">
          <Logo size="sm" />
          <span className="mt-1 block text-[9px] font-bold uppercase tracking-wider text-ink-muted">Shopping Intelligence</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const showBadge = item.href === "/wishlist" && wishlistCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 active:scale-98 font-sans text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-ink-muted hover:bg-secondary hover:text-ink-primary"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-ink-muted")} />
                <span>{item.label}</span>
                {showBadge && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground select-none">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Upgrade to Pro CTA — Free users only */}
        {!isPro && (
          <div className="mx-1 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <p className="text-xs font-bold text-primary">Upgrade to Pro</p>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Unlock real-time inventory tracking and AI insights.
            </p>
            <button
              id="sidebar-upgrade-now"
              type="button"
              onClick={() => setUpgradeOpen(true)}
              className="flex items-center justify-center w-full h-8 bg-primary text-white text-xs font-bold rounded-lg hover:bg-accent-subtle active:scale-[0.98] transition-all uppercase tracking-wider"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3">
        {/* Theme Selector */}
        <div className="flex items-center justify-between rounded-lg bg-secondary p-1">
          <button
            onClick={() => setTheme("light")}
            aria-label="Light theme"
            className={cn(
              "flex flex-1 items-center justify-center rounded-md py-1.5 transition-all text-xs font-medium",
              theme === "light"
                ? "bg-surface shadow-sm text-ink-primary"
                : "text-ink-muted hover:text-ink-primary"
            )}
          >
            <Sun className="h-3.5 w-3.5 mr-1" />
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            aria-label="Dark theme"
            className={cn(
              "flex flex-1 items-center justify-center rounded-md py-1.5 transition-all text-xs font-medium",
              theme === "dark"
                ? "bg-surface shadow-sm text-ink-primary"
                : "text-ink-muted hover:text-ink-primary"
            )}
          >
            <Moon className="h-3.5 w-3.5 mr-1" />
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            aria-label="System theme"
            className={cn(
              "flex flex-1 items-center justify-center rounded-md py-1.5 transition-all text-xs font-medium",
              theme === "system"
                ? "bg-surface shadow-sm text-ink-primary"
                : "text-ink-muted hover:text-ink-primary"
            )}
          >
            <Laptop className="h-3.5 w-3.5 mr-1" />
            Auto
          </button>
        </div>

        {/* Separator */}
        <div className="border-t border-border" />

        {/* Help & Logout links */}
        <div className="flex flex-col gap-0.5">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted hover:bg-secondary hover:text-ink-primary transition-all"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-ink-muted hover:bg-red-500/10 hover:text-red-500 transition-all w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg border border-border/50 bg-secondary/50">
          <div className="h-8 w-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
            {user?.username ? user.username.slice(0, 2) : "AU"}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-bold text-xs text-ink-primary leading-tight truncate">
              {user?.username || "Admin User"}
            </span>
            <span className="text-[11px] text-ink-muted truncate">
              {user?.email || "admin@dealscope.com"}
            </span>
          </div>
        </div>
      </div>

      <UpgradeProModal open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </aside>
  );
}

