"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DashboardContentProps {
  mainContent: React.ReactNode;
  sidebarContent: React.ReactNode;
  className?: string;
}

export function DashboardContent({
  mainContent,
  sidebarContent,
  className,
}: DashboardContentProps) {
  return (
    <div className={cn("grid grid-cols-12 gap-spacing-6 items-start w-full", className)}>
      {/* Main Content Region */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-spacing-6">
        {mainContent}
      </div>

      {/* Sidebar Region */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-spacing-6">
        {sidebarContent}
      </div>
    </div>
  );
}
