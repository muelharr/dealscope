"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface WidgetErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export function WidgetError({
  title = "Something went wrong",
  message = "We encountered an error loading this section. Please try again.",
  onRetry,
  showHomeButton = false,
  className,
}: WidgetErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center p-spacing-6 text-center border border-dashed border-red-200 rounded-xl bg-red-50/20 max-w-lg mx-auto my-spacing-6",
        className
      )}
    >
      <AlertCircle className="w-10 h-10 text-red-500 mb-spacing-3 stroke-[1.5]" />
      <h3 className="text-lg font-sans font-bold text-ink-primary mb-spacing-1">
        {title}
      </h3>
      <p className="text-ink-muted text-body-sm mb-spacing-4 max-w-sm">
        {message}
      </p>
      <div className="flex gap-spacing-3">
        {onRetry && (
          <Button onClick={onRetry} variant="default" size="sm" className="h-9 px-4 font-sans font-medium">
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Button asChild variant="outline" size="sm" className="h-9 px-4 font-sans font-medium border-border">
            <Link href="/">Back to Home</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
