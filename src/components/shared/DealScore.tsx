import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface DealScoreProps extends Omit<React.ComponentProps<"div">, "children"> {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function DealScore({
  score,
  size = "md",
  showLabel = false,
  className,
  ...props
}: DealScoreProps) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);

  // Determine semantic variant and qualitative rating label
  const rating = React.useMemo(() => {
    if (normalizedScore >= 80) {
      return { variant: "positive" as const, label: "Excellent" };
    }
    if (normalizedScore >= 50) {
      return { variant: "caution" as const, label: "Fair" };
    }
    return { variant: "negative" as const, label: "Poor" };
  }, [normalizedScore]);

  // Handle sizing class modifiers
  const sizeClasses = {
    sm: "text-[10px] h-4.5 px-1.5",
    md: "text-xs h-5 px-2",
    lg: "text-sm h-7 px-3 rounded-md",
  }[size];

  return (
    <div
      className={cn("inline-flex items-center gap-spacing-2", className)}
      {...props}
    >
      <Badge
        variant={rating.variant}
        className={cn(
          "font-mono font-bold leading-none select-none tracking-tight",
          sizeClasses
        )}
      >
        {normalizedScore}
      </Badge>
      {showLabel && (
        <span
          className={cn(
            "font-sans font-medium text-ink-primary",
            {
              sm: "text-[10px]",
              md: "text-xs",
              lg: "text-sm",
            }[size]
          )}
        >
          {rating.label}
        </span>
      )}
    </div>
  );
}
