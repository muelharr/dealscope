"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ComparisonHeaderData {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

export interface ComparisonHeaderProps {
  data: ComparisonHeaderData;
  className?: string;
}

export function ComparisonHeader({ data, className }: ComparisonHeaderProps) {
  const { title, breadcrumbs } = data;

  return (
    <header className={cn("mb-8 w-full", className)}>
      {/* Breadcrumbs matching Stitch structure */}
      <nav className="flex items-center gap-2 text-ink-muted font-sans text-[10px] font-bold uppercase tracking-wider mb-4 select-none">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              {crumb.href && !isLast ? (
                <a className="hover:text-primary transition-colors cursor-pointer" href={crumb.href}>
                  {crumb.label}
                </a>
              ) : (
                <span className={cn(isLast ? "text-primary font-bold" : "text-ink-muted")}>
                  {crumb.label}
                </span>
              )}
              {!isLast && <ChevronRight className="size-3 text-ink-muted" />}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Main title */}
      <h1 className="font-sans font-bold text-headline-lg text-ink-primary tracking-tight">
        {title}
      </h1>
    </header>
  );
}
