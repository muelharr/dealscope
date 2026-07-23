"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ComparisonSectionProps extends React.ComponentProps<"section"> {
  title?: string;
  icon?: React.ReactNode;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export function ComparisonSection({
  title,
  icon,
  headerAction,
  children,
  className,
  ...props
}: ComparisonSectionProps) {
  return (
    <section
      className={cn(
        "bg-card border border-border rounded-xl p-6 relative overflow-hidden shadow-sm",
        className
      )}
      {...props}
    >
      {(title || icon || headerAction) && (
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-border/40">
          <div className="flex items-center gap-2">
            {icon}
            {title && (
              <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-ink-muted">
                {title}
              </h3>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className="w-full">{children}</div>
    </section>
  );
}
