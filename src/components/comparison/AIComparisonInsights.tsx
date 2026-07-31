"use client";

import * as React from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ComparisonInsightItem {
  id: string;
  title: string;
  description: string;
}

export interface AIRecommendation {
  winner: string;
  confidence: number;
  summary: string;
  insights: ComparisonInsightItem[];
}

export interface AIComparisonInsightsProps {
  data?: AIRecommendation;
  onExportPdf?: () => void;
  className?: string;
}

export function AIComparisonInsights({
  data,
  onExportPdf,
  className,
}: AIComparisonInsightsProps) {
  if (!data) {
    return (
      <div className={cn("py-16 text-center text-ink-muted border border-border border-dashed rounded-lg bg-muted/10 font-sans text-xs", className)}>
        AI comparison insights are not yet available.
      </div>
    );
  }

  const { winner, confidence, summary, insights } = data;

  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground p-6 rounded-xl h-full flex flex-col justify-between shadow-xl relative overflow-hidden",
        className
      )}
    >
      {/* Decorative backdrop blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-16 -translate-y-16 pointer-events-none"></div>

      <div className="relative z-10 space-y-6 flex-grow flex flex-col justify-between">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="size-5" />
            <h3 className="font-sans font-bold text-base text-white">AI Insights</h3>
          </div>

          {/* Winner and Confidence badges */}
          <div className="flex justify-between items-center bg-white/10 p-3 rounded-lg border border-white/10">
            <div>
              <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Top Pick</span>
              <p className="font-sans font-bold text-sm text-white">{winner}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/70 uppercase font-bold tracking-wider">Confidence</span>
              <p className="font-sans font-bold text-sm text-white">{confidence}%</p>
            </div>
          </div>

          <p className="text-body-sm text-white/95 leading-relaxed">{summary}</p>
        </div>

        {/* Insight Card list mapped from typed array */}
        <div className="space-y-4 my-4 flex-grow">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 space-y-1 text-white"
            >
              <p className="font-sans text-xs font-bold">{insight.title}</p>
              <p className="font-sans text-xs opacity-90 leading-relaxed">{insight.description}</p>
            </div>
          ))}
        </div>

        {/* Export Button */}
        <Button
          onClick={onExportPdf}
          className="w-full py-3 bg-white text-primary hover:bg-white/95 rounded-lg font-bold font-sans text-xs uppercase tracking-widest transition-transform active:scale-95 duration-150 shadow-md mt-auto"
        >
          Export Analysis PDF
        </Button>
      </div>
    </div>
  );
}
