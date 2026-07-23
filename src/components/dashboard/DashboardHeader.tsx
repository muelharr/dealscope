"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
  userName?: string;
  statusLabel?: string;
  statusType?: "positive" | "warning" | "critical";
  dateText?: string;
  className?: string;
}

export function DashboardHeader({
  userName = "Alex",
  statusLabel = "Markets Stable",
  statusType = "positive",
  dateText = "May 24, 2024",
  className,
}: DashboardHeaderProps) {
  // Map dot indicators to Stitch semantic color values
  const indicatorColor = {
    positive: "bg-positive",
    warning: "bg-caution",
    critical: "bg-negative",
  }[statusType];

  return (
    <div
      className={cn(
        "mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 w-full",
        className
      )}
    >
      {/* Title and description */}
      <div className="space-y-1">
        <h1 className="font-sans font-bold text-headline-lg text-ink-primary tracking-tight leading-tight">
          Good morning, {userName}
        </h1>
        <p className="text-ink-muted text-body-md">
          Here&apos;s your shopping intelligence update for today.
        </p>
      </div>

      {/* Meta indicators: status tag and date */}
      <div className="flex items-center gap-2 text-body-sm font-medium text-ink-muted">
        <span className="flex items-center gap-1">
          <span className={cn("w-2 h-2 rounded-full", indicatorColor)} />
          <span>{statusLabel}</span>
        </span>
        <span className="text-border-interactive select-none">|</span>
        <span>{dateText}</span>
      </div>
    </div>
  );
}
