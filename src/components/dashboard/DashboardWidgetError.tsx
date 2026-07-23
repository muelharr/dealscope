'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DashboardWidgetErrorProps {
  onRetry: () => void;
  className?: string;
}

export function DashboardWidgetError({ onRetry, className }: DashboardWidgetErrorProps) {
  return (
    <div
      role="alert"
      className={`p-4 text-center text-red-600 border border-red-200 border-dashed rounded-lg bg-red-50/50 flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <AlertTriangle className="w-8 h-8 text-red-400" />
      <p className="text-xs text-red-700">Could not load this widget.</p>
      <Button onClick={onRetry} variant="destructive" size="sm" className="text-xs h-7">
        Retry
      </Button>
    </div>
  );
}
