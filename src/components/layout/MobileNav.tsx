"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Heart,
  Bell,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/queries/useWishlist";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { data: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems?.length ?? 0;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-14 border-t border-border bg-surface/90 backdrop-blur-md lg:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            const showBadge = item.href === "/wishlist" && wishlistCount > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] transition-all duration-150 active:scale-95",
                  isActive
                    ? "text-accent"
                    : "text-ink-muted hover:text-ink-primary"
                )}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" />
                  {showBadge && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[8px] font-bold text-white select-none">
                      {wishlistCount}
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
