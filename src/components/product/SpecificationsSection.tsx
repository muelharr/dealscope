"use client";

import * as React from "react";
import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpecificationsSectionProps {
  className?: string;
}

export function SpecificationsSection({ className }: SpecificationsSectionProps) {
  const specs = [
    { name: "Manufacturer", value: "ASUS" },
    { name: "Boost Clock", value: "2565 MHz" },
    { name: "Memory Size", value: "12 GB GDDR6X" },
    { name: "Power Connectors", value: "1x 16-pin" },
  ];

  return (
    <section className={cn("bg-card border border-border rounded-xl p-6 shadow-sm", className)}>
      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-border/40 select-none">
        <ListChecks className="size-4 text-primary" />
        <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-ink-muted">
          Specifications
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specs.map((spec, idx) => (
          <div key={idx} className="flex justify-between items-center py-2 border-b border-border/40 text-body-sm">
            <span className="text-ink-muted font-sans">{spec.name}</span>
            <span className="text-ink-primary font-bold">{spec.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
