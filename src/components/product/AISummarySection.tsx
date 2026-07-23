"use client";

import * as React from "react";
import { Sparkles, CheckCircle, Info, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AISummarySectionProps {
  className?: string;
}

export function AISummarySection({ className }: AISummarySectionProps) {
  const insights = [
    { id: "low", text: "Price is currently near its historical low.", type: "positive" },
    { id: "amazon", text: "Amazon price decreased 8% in two weeks.", type: "info" },
    { id: "supply", text: "Secondary market supply is shrinking, suggesting price floor stability.", type: "warning" },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="size-5 text-positive shrink-0" />;
      case "info":
        return <Info className="size-5 text-primary shrink-0" />;
      case "warning":
        return <TrendingDown className="size-5 text-caution shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-6 w-full", className)}>
      {/* 1. AI Decision Panel (Vivid Blue exact styling) */}
      <section className="bg-primary text-primary-foreground p-6 rounded-xl shadow-xl relative overflow-hidden">
        {/* Decorative blur backdrop */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-16 -translate-y-16 pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-sans text-[10px] font-bold text-white/70 uppercase tracking-widest">
                Deal Score
              </h3>
              <div className="text-[48px] font-sans font-bold leading-none mt-1">
                94<span className="text-xl text-white/60">/100</span>
              </div>
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-bold mt-2 inline-block">
                Exceptional
              </span>
            </div>
            <div className="text-right">
              <h3 className="font-sans text-[10px] font-bold text-white/70 uppercase tracking-widest">
                AI Verdict
              </h3>
              <div className="text-2xl font-sans font-bold text-white mt-1">BUY NOW</div>
              <div className="text-xs text-white/80 mt-1">Confidence 98%</div>
            </div>
          </div>

          <p className="font-sans text-body-md leading-relaxed text-white/95">
            The current price is <span className="font-bold underline decoration-white/50">12% below the 180-day average</span> and is close to its historical minimum.
          </p>

          <div className="bg-white/10 rounded-lg p-4 flex items-center gap-3 border border-white/15">
            <TrendingUp className="size-5 text-caution" />
            <div>
              <div className="font-sans text-[10px] font-bold text-white/70 uppercase tracking-wider">
                Price Forecast
              </div>
              <div className="text-body-sm font-bold">Likely to increase next week (+4-6%)</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI Intelligence list */}
      <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2 select-none">
          <Sparkles className="size-4 text-primary" />
          <h3 className="font-sans font-bold text-base text-ink-primary">AI Intelligence</h3>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={cn(
                "p-3 border rounded-lg flex items-start gap-3 text-ink-primary",
                insight.type === "positive"
                  ? "bg-positive/5 border-positive/10"
                  : "bg-surface-subtle border-border"
              )}
            >
              {renderIcon(insight.type)}
              <p className="text-body-sm leading-relaxed">{insight.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
