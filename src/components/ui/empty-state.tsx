import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends Omit<React.ComponentProps<"div">, "title"> {
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  className,
  icon: Icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface p-spacing-8 text-center animate-fade-in",
        className
      )}
      {...props}
    >
      {/* Icon Area */}
      {Icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-ink-muted mb-spacing-4">
          {typeof Icon === "function" ? (
            <Icon className="h-6 w-6 shrink-0" />
          ) : (
            Icon
          )}
        </div>
      )}

      {/* Text Area */}
      <h3 className="font-sans font-bold text-body-lg text-ink-primary max-w-sm">
        {title}
      </h3>
      {description && (
        <p className="mt-spacing-2 font-sans text-body-sm text-ink-muted max-w-sm">
          {description}
        </p>
      )}

      {/* Optional Action Button */}
      {action && <div className="mt-spacing-6">{action}</div>}
    </div>
  );
}
