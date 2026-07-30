"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  variant?: "full" | "icon";
  isDark?: boolean;
}

/** Unified DealScope mark. Every rendered logo navigates to the public landing page by default. */
export function DealScopeIcon({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative flex items-center justify-center shrink-0 select-none", className)}>
      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
        <path d="M6 14.5L14.5 6H22C23.6569 6 25 7.34315 25 9V16.5C25 17.2956 24.6839 18.0587 24.1213 18.6213L16.6213 26.1213C15.4497 27.2929 13.5503 27.2929 12.3787 26.1213L6.12132 19.864C4.94975 18.6924 4.94975 16.7929 6.12132 15.6213L6 14.5Z" fill="#4F7CFF" fillOpacity="0.12" stroke="#4F7CFF" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="19.5" cy="11.5" r="4.5" stroke="#2563EB" strokeWidth="2.2" fill="none" />
        <path d="M16.5 14.5L12.5 18.5" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="9.5" cy="11.5" r="1.5" fill="#22C55E" />
      </svg>
    </div>
  );
}

export function Logo({ className, size = "md", href = "/", variant = "full" }: LogoProps) {
  const iconSizes = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10", xl: "h-14 w-14" };
  const textSizes = { sm: "text-base", md: "text-lg", lg: "text-xl", xl: "text-3xl" };
  const iconOnly = variant === "icon";

  return (
    <Link
      href={href}
      aria-label="DealScope — Back to home"
      className={cn("group inline-flex items-center gap-2.5 rounded-lg outline-none cursor-pointer select-none transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]", className)}
    >
      <DealScopeIcon className={cn(iconSizes[size], "transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04]")} />
      {!iconOnly && (
        <span className="flex items-baseline font-sans font-extrabold tracking-tight">
          <span className={cn(textSizes[size], "text-ink-primary dark:text-white font-bold")}>Deal</span>
          <span className={cn(textSizes[size], "text-[#4F7CFF] font-extrabold")}>Scope</span>
        </span>
      )}
    </Link>
  );
}
