"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, CheckCheck, Sparkles, AlertCircle, Info, Settings, Menu } from "lucide-react";
import { useCurrentUser } from "@/auth";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/services/notification.service";
import { cn } from "@/lib/utils";

function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  const { notifications, unreadCount, isConnected, markRead, markAllRead } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "PRICE_ALERT": return <Sparkles className="h-4 w-4 text-emerald-500" />;
      case "SYSTEM": return <Info className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="absolute right-0 top-12 w-80 sm:w-96 rounded-xl border border-border bg-surface shadow-xl z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
      <div className="flex items-center justify-between border-b border-border p-3.5 bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold text-ink-primary">Notifications</span>
          <span className={cn("flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border", isConnected ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20")}>
            <span className={cn("h-1.5 w-1.5 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500")} />
            {isConnected ? "Live" : "Polling 30s"}
          </span>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllRead()} className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
            <CheckCheck className="h-3 w-3" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink-muted">No notifications yet.</div>
        ) : (
          notifications.slice(0, 15).map((item: NotificationItem) => (
            <div key={item.id} onClick={() => { if (!item.isRead) markRead(item.id); }} className={cn("flex items-start gap-3 p-3.5 text-xs transition-colors cursor-pointer hover:bg-muted/40", !item.isRead && "bg-primary/5 font-medium")}>
              <div className="mt-0.5 shrink-0 p-1.5 rounded-lg bg-surface border border-border">{getNotificationIcon(item.type)}</div>
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-sans font-bold text-ink-primary truncate">{item.title}</p>
                  {!item.isRead && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="font-sans text-ink-muted text-[11px] line-clamp-2 leading-relaxed">{item.message}</p>
                <p className="font-mono text-[10px] text-ink-muted/70">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const user = useCurrentUser();
  const { unreadCount } = useNotifications();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6 lg:px-8 max-w-[1280px] mx-auto">
        {/* Left Side: Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative w-64 lg:w-96">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-ink-muted">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search products, brands, or deals..."
              className="w-full pl-9 pr-4 py-1.5 rounded-full text-xs bg-secondary/60 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-ink-primary"
            />
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            aria-label="View notifications"
            className="p-2 rounded-full hover:bg-secondary text-ink-muted hover:text-ink-primary transition-all active:scale-98 relative focus:outline-none"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white shadow-sm animate-in zoom-in-50">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>
          
          <Link
            href="/settings"
            aria-label="Account Settings"
            className="p-2 rounded-full hover:bg-secondary text-ink-muted hover:text-ink-primary transition-all active:scale-98"
          >
            <Settings className="h-4 w-4" />
          </Link>

          <Link
            href="/settings"
            aria-label="Account profile"
            className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-secondary transition-all"
          >
            <div className="h-7 w-7 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-xs uppercase shrink-0">
              {user?.username ? user.username.slice(0, 2) : "AU"}
            </div>
            <span className="font-bold text-xs text-ink-primary leading-tight hidden sm:block">
              {user?.username || "Admin User"}
            </span>
          </Link>

          {/* Mobile hamburger menu (placeholder for future use) */}
          <button className="lg:hidden p-2 rounded-full hover:bg-secondary text-ink-muted hover:text-ink-primary transition-all active:scale-98">
            <Menu className="h-5 w-5"/>
          </button>

          <NotificationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
        </div>
      </div>
    </header>
  );
}
