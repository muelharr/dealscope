"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SimilarProductsSectionProps {
  className?: string;
}

export function SimilarProductsSection({ className }: SimilarProductsSectionProps) {
  const alternatives = [
    {
      id: "msi-ventus",
      title: "MSI Ventus 3X RTX 5070",
      price: "Rp 10.949.000",
      score: 88,
      scoreType: "positive" as const,
      desc: "More affordable, lower cooling headroom.",
    },
    {
      id: "gigabyte-eagle",
      title: "Gigabyte Eagle RTX 5070",
      price: "Rp 11.999.000",
      score: 72,
      scoreType: "warning" as const,
      desc: "Premium build but higher current premium.",
    },
    {
      id: "asus-dual",
      title: "ASUS Dual RTX 5070",
      price: "Rp 10.799.000",
      score: 91,
      scoreType: "positive" as const,
      desc: "Compact design, excellent value-to-score.",
    },
  ];

  return (
    <section className={cn("space-y-6 w-full", className)}>
      <h2 className="font-sans font-bold text-headline-lg text-ink-primary">
        Market Alternatives
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alternatives.map((alt) => {
          const scoreClass = {
            positive: "bg-positive/10 text-positive",
            warning: "bg-caution/10 text-caution",
            critical: "bg-negative/10 text-negative",
          }[alt.scoreType];

          return (
            <div
              key={alt.id}
              className="bg-card border border-border rounded-xl p-5 group hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video bg-muted/20 rounded-lg mb-4 flex items-center justify-center p-4 border border-border/40 select-none">
                  <span className="text-ink-muted text-xs font-semibold">Image Placeholder</span>
                </div>
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h4 className="font-sans font-bold text-sm text-ink-primary truncate">
                    {alt.title}
                  </h4>
                  <div className={cn("px-2 py-0.5 rounded text-[9px] font-bold shrink-0 select-none", scoreClass)}>
                    {alt.score} SCORE
                  </div>
                </div>
                <div className="font-mono font-bold text-sm text-ink-primary">{alt.price}</div>
              </div>
              <p className="text-body-sm text-ink-muted mt-2 leading-relaxed">
                {alt.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
