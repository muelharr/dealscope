"use client";

import * as React from "react";
import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface SpecificationGroup {
  id: string;
  title: string;
  items: SpecificationItem[];
}

export interface SpecificationsSectionProps {
  className?: string;
}

const MOCK_SPECS: SpecificationGroup[] = [
  {
    id: "hardware",
    title: "Core Hardware Specs",
    items: [
      { label: "Manufacturer", value: "ASUS" },
      { label: "Boost Clock", value: "2565 MHz" },
      { label: "Memory Size", value: "12 GB GDDR6X" },
    ],
  },
  {
    id: "power-ports",
    title: "Power & Connectivity",
    items: [
      { label: "Power Connectors", value: "1x 16-pin" },
      { label: "Interface", value: "PCIe 4.0 x16" },
      { label: "Outputs", value: "3x DP, 1x HDMI" },
    ],
  },
];

export function SpecificationsSection({ className }: SpecificationsSectionProps) {
  return (
    <section className={cn("bg-card border border-border p-6 rounded-xl shadow-sm space-y-6", className)}>
      <div className="flex items-center gap-2 pb-2 border-b border-border/40 select-none">
        <ListChecks className="size-4 text-primary" />
        <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-ink-muted">
          Specifications
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_SPECS.map((group) => (
          <div key={group.id} className="space-y-3">
            <h4 className="font-sans text-xs font-bold text-ink-muted/80 uppercase tracking-wider select-none">
              {group.title}
            </h4>
            <div className="space-y-2">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-border/30 text-body-sm"
                >
                  <span className="text-ink-muted font-sans">{item.label}</span>
                  <span className="text-ink-primary font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
