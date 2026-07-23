"use client";

import * as React from "react";
import { Download, Share2, Save, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ComparisonAction {
  id: string;
  label: string;
  variant: "default" | "secondary" | "outline";
  iconName: "export" | "share" | "save" | "reset" | "back";
  disabled?: boolean;
}

export interface BottomActionsSectionProps {
  onActionTrigger?: (actionId: string) => void;
  className?: string;
}

const MOCK_ACTIONS: ComparisonAction[] = [
  { id: "export", label: "Export Comparison", variant: "default", iconName: "export" },
  { id: "share", label: "Share Comparison", variant: "outline", iconName: "share" },
  { id: "save", label: "Save Parameters", variant: "outline", iconName: "save" },
  { id: "reset", label: "Reset Comparison", variant: "outline", iconName: "reset" },
  { id: "continue", label: "Continue Shopping", variant: "secondary", iconName: "back" },
];

export function BottomActionsSection({
  onActionTrigger,
  className,
}: BottomActionsSectionProps) {
  // Map icon names to Lucide react icon elements
  const renderIcon = (iconName: ComparisonAction["iconName"]) => {
    switch (iconName) {
      case "export":
        return <Download className="size-4" />;
      case "share":
        return <Share2 className="size-4" />;
      case "save":
        return <Save className="size-4" />;
      case "reset":
        return <RotateCcw className="size-4" />;
      case "back":
        return <ArrowLeft className="size-4" />;
    }
  };

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm select-none",
        className
      )}
    >
      <div className="flex flex-wrap gap-3">
        {MOCK_ACTIONS.filter((act) => act.id !== "continue").map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={() => onActionTrigger && onActionTrigger(action.id)}
            disabled={action.disabled}
            className="font-sans text-xs font-bold uppercase tracking-wider gap-2 rounded-lg transition-all active:scale-95"
          >
            {renderIcon(action.iconName)}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>

      <div>
        {MOCK_ACTIONS.filter((act) => act.id === "continue").map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={() => onActionTrigger && onActionTrigger(action.id)}
            className="font-sans text-xs font-bold uppercase tracking-wider gap-2 rounded-lg transition-all active:scale-95 border border-border"
          >
            {renderIcon(action.iconName)}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
