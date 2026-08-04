"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  GitCompare,
  Heart,
  Bell,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/queries/useWishlist";
import { useNotifications } from "@/hooks/useNotifications";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { data: wishlistItems } = useWishlist();
  const { unreadCount } = useNotifications();
  const wishlistCount = wishlistItems?.length ?? 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex min-h-16 border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        const isWishlist = item.href === "/wishlist";
        const isAlerts = item.href === "/alerts";

        const badgeCount = isWishlist ? wishlistCount : isAlerts ? unreadCount : 0;
        const showBadge = badgeCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] transition-all duration-150 active:scale-95",
              isActive
                ? "text-primary font-bold"
                : "text-ink-muted hover:text-ink-primary"
            )}
          >
            <div className="relative">
              <Icon className="h-4 w-4" />
              {showBadge && (
                <span
                  className={cn(
                    "absolute -top-1.5 -right-2 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-1 text-[8px] font-bold text-white select-none",
                    isAlerts ? "bg-red-500" : "bg-primary"
                  )}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </div>
            <span className="font-sans text-[10px] font-medium leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
