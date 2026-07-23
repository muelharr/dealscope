"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface WishlistGridProps {
  children: React.ReactNode;
  className?: string;
}

export function WishlistGrid({ children, className }: WishlistGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-spacing-6 w-full", className)}>
      {children}
    </div>
  );
}
