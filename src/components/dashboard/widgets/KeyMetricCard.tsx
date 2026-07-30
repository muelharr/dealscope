import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface KeyMetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: "default" | "gradient";
  className?: string;
}

export function KeyMetricCard({ label, value, icon, variant = "default", className }: KeyMetricCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between p-4 rounded-xl border border-border overflow-hidden",
        variant === "default" && "bg-surface",
        variant === "gradient" && "bg-gradient-to-br from-primary/80 to-primary text-white",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className={cn("text-xs font-bold uppercase tracking-wider", variant === 'gradient' ? 'text-white/80' : 'text-ink-muted')}>
          {label}
        </p>
        <div className={cn('h-5 w-5', variant === 'gradient' ? 'text-white/80' : 'text-ink-muted')}>
          {icon}
        </div>
      </div>
      <p className={cn(
        "text-3xl font-bold font-mono tracking-tight",
        variant === 'gradient' ? 'text-white' : 'text-ink-primary'
      )}>
        {value}
      </p>
    </div>
  );
}

export function KeyMetricCardSkeleton() {
  return <Skeleton className="h-[88px] w-full rounded-xl" />;
}
