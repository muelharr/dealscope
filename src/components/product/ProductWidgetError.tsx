'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ProductWidgetErrorProps {
  onRetry: () => void;
  className?: string;
}

export function ProductWidgetError({ onRetry, className }: ProductWidgetErrorProps) {
  return (
    <div
      role="alert"
      className={`p-6 text-center border border-caution/30 border-dashed rounded-xl bg-caution-light/10 flex flex-col items-center justify-center gap-2 ${className}`}
    >
      <AlertTriangle className="w-8 h-8 text-caution" />
      <p className="text-sm font-sans font-medium text-ink-primary">
        Failed to load this section
      </p>
      <p className="text-xs text-ink-muted mb-2">
        You can try reloading this specific widget.
      </p>
      <Button onClick={onRetry} variant="outline" size="sm" className="text-xs">
        Retry Section
      </Button>
    </div>
  );
}
