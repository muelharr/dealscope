"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ComparisonValue {
  productId: string;
  value: string;
  highlight?: "best" | "equal" | "different";
}

export interface ComparisonRow {
  id: string;
  label: string;
  values: ComparisonValue[];
}

export interface ComparisonCategory {
  id: string;
  title: string;
  rows: ComparisonRow[];
}

export interface ComparisonProductHeader {
  id: string;
  name: string;
  badgeLabel?: string;
  isTopPick?: boolean;
}

export interface ComparisonMatrixProps {
  products: ComparisonProductHeader[];
  categories: ComparisonCategory[];
  onActionClick?: (productId: string, actionType: "analysis" | "marketplace") => void;
  className?: string;
}

export function ComparisonMatrix({
  products,
  categories,
  onActionClick,
  className,
}: ComparisonMatrixProps) {
  // Helpers to resolve semantic cell highlight styles
  const getHighlightClass = (highlight?: ComparisonValue["highlight"]) => {
    switch (highlight) {
      case "best":
        return "text-primary font-bold bg-primary-container/5";
      case "equal":
        return "text-ink-primary font-medium";
      case "different":
        return "text-ink-muted";
      default:
        return "text-ink-primary";
    }
  };

  return (
    <div className={cn("overflow-x-auto scrollbar-hide w-full", className)}>
      <div className="bg-card rounded-xl border border-border min-w-[900px] overflow-hidden shadow-sm">
        {/* Table Column Headers */}
        <div className="grid grid-cols-4 border-b border-border bg-muted/20 select-none">
          <div className="p-4 border-r border-border flex items-center">
            <span className="font-sans text-xs font-bold text-ink-muted uppercase tracking-widest">
              Specifications
            </span>
          </div>
          {products.map((product) => (
            <div
              key={product.id}
              className={cn(
                "p-4 text-center border-r last:border-r-0 border-border flex flex-col justify-center items-center gap-1",
                product.isTopPick && "bg-primary-container/5"
              )}
            >
              {product.badgeLabel ? (
                <span
                  className={cn(
                    "font-sans text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded",
                    product.isTopPick
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-ink-muted"
                  )}
                >
                  {product.badgeLabel}
                </span>
              ) : (
                <div className="h-4"></div>
              )}
              <p className="font-sans font-bold text-body-md text-ink-primary">{product.name}</p>
            </div>
          ))}
        </div>

        {/* Dynamic Comparison Category Rows */}
        {categories.map((category) => (
          <div key={category.id} className="divide-y divide-border/60">
            {/* Category title row */}
            <div className="grid grid-cols-4 bg-muted/5 border-b border-border/40 select-none">
              <div className="col-span-4 px-4 py-2 text-[10px] font-bold text-ink-muted uppercase tracking-widest">
                {category.title}
              </div>
            </div>

            {/* Spec value rows */}
            {category.rows.map((row) => (
              <div key={row.id} className="grid grid-cols-4 items-center border-b last:border-b-0 border-border/40">
                {/* Attribute label */}
                <div className="p-4 border-r border-border font-sans text-body-sm text-ink-muted select-none">
                  {row.label}
                </div>

                {/* Compared values */}
                {row.values.map((cell, idx) => {
                  const isCurrentPrice = row.id === "current-price";
                  const isDealScore = row.id === "deal-score";
                  const isVerdict = row.id === "ai-verdict";

                  return (
                    <div
                      key={idx}
                      className={cn(
                        "p-4 border-r last:border-r-0 border-border text-center font-sans text-body-sm",
                        getHighlightClass(cell.highlight)
                      )}
                    >
                      {/* Price Cell formatting */}
                      {isCurrentPrice && (
                        <span className="font-mono font-bold text-base">
                          {formatPrice(parseFloat(cell.value))}
                        </span>
                      )}

                      {/* Deal Score formatting */}
                      {isDealScore && (
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold border select-none inline-block",
                            cell.value.toLowerCase().includes("exceptional")
                              ? "bg-positive/10 text-positive border-positive/20"
                              : cell.value.toLowerCase().includes("great")
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-caution/10 text-caution border-caution/20"
                          )}
                        >
                          {cell.value}
                        </span>
                      )}

                      {/* AI Verdict formatting */}
                      {isVerdict && (
                        <span
                          className={cn(
                            "font-sans text-[10px] font-bold tracking-wider select-none",
                            cell.value === "BUY NOW"
                              ? "text-positive"
                              : cell.value === "WAIT"
                              ? "text-ink-muted"
                              : "text-caution"
                          )}
                        >
                          {cell.value}
                        </span>
                      )}

                      {/* Standard text values */}
                      {!isCurrentPrice && !isDealScore && !isVerdict && (
                        <span>{cell.value}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}

        {/* CTA Actions Row */}
        <div className="grid grid-cols-4 items-center bg-muted/5">
          <div className="p-4 border-r border-border"></div>
          {products.map((product) => (
            <div
              key={product.id}
              className="p-4 border-r last:border-r-0 border-border flex justify-center items-center"
            >
              {product.isTopPick ? (
                <Button
                  onClick={() => onActionClick && onActionClick(product.id, "analysis")}
                  className="font-sans text-xs font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition-all active:scale-95"
                >
                  View Analysis
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => onActionClick && onActionClick(product.id, "marketplace")}
                  className="font-sans text-xs font-bold uppercase tracking-wider border-border px-4 py-2 rounded-lg transition-all active:scale-95 hover:bg-muted bg-card"
                >
                  View Marketplace
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
