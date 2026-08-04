"use client";

import * as React from "react";
import { Check, Sparkles, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";

const BENEFITS = [
  "Advanced price tracking",
  "More price alerts",
  "Extended price history",
  "Advanced product comparison",
  "Priority notifications",
  "Advanced analytics",
];

export interface UpgradeProModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: string;
}

export function UpgradeProModal({ open, onOpenChange, reason }: UpgradeProModalProps) {
  const { upgradeToPro, isPro } = useSubscription();
  const [isUpgrading, setIsUpgrading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isPro && open) onOpenChange(false);
  }, [isPro, open, onOpenChange]);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setError(null);
    try {
      await upgradeToPro();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upgrade failed. Try again.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0" showCloseButton>
        <div className="bg-primary text-primary-foreground p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 pointer-events-none" />
          <DialogHeader className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <DialogTitle className="text-xl font-bold text-white">DealScope Pro</DialogTitle>
            </div>
            <DialogDescription className="text-white/85 text-sm">
              {reason || "Unlock the full DealScope experience."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5">
          <ul className="space-y-2.5">
            {BENEFITS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-primary">
                <Check className="h-4 w-4 text-positive shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-lg border border-border bg-secondary/40 px-4 py-3 flex items-baseline justify-between">
            <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">Billed monthly</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-ink-primary">$12</span>
              <span className="text-xs text-ink-muted">/month</span>
            </div>
          </div>

          {error && <p className="text-xs text-negative">{error}</p>}

          <div className="flex flex-col gap-2">
            <Button
              id="upgrade-pro-cta"
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full h-11 font-bold uppercase tracking-wider gap-2"
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Upgrading…
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </Button>
            <Button
              id="upgrade-pro-later"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isUpgrading}
              className="w-full text-ink-muted"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
