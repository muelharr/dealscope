"use client";

import * as React from "react";
import {
  TrendingDown,
  CheckCircle2,
  Percent,
  DollarSign,
  Trash2,
  SlidersHorizontal,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/format";
import { usePriceAlerts } from "@/hooks/queries/usePriceAlerts";
import { useTogglePriceAlert, useDeletePriceAlert } from "@/hooks/mutations/usePriceAlertMutations";
import { useSubscription } from "@/hooks/useSubscription";
import { UpgradeProModal } from "@/components/shared/UpgradeProModal";

export default function AlertsPage() {
  const [filterTab, setFilterTab] = React.useState<"All" | "Active" | "Triggered">("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [upgradeOpen, setUpgradeOpen] = React.useState(false);

  const { data: alerts = [], isLoading, isError, refetch } = usePriceAlerts();
  const toggleAlertMutation = useTogglePriceAlert();
  const deleteAlertMutation = useDeletePriceAlert();
  const { isPro, freeAlertLimit, canCreateAlert } = useSubscription();

  const toggleAlertStatus = (id: string, currentEnabled: boolean) => {
    toggleAlertMutation.mutate({ id, isEnabled: !currentEnabled });
  };

  const handleDeleteAlert = (id: string) => {
    if (confirm("Are you sure you want to delete this price alert?")) {
      deleteAlertMutation.mutate(id);
    }
  };

  const filteredAlerts = React.useMemo(() => {
    return alerts.filter((item) => {
      const isItemTriggered = item.lastTriggeredAt !== null;

      const matchesTab =
        filterTab === "All" ||
        (filterTab === "Active" && item.isEnabled) ||
        (filterTab === "Triggered" && isItemTriggered);

      const productName = item.productSummary?.name || "Unknown Product";
      const matchesSearch = productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [alerts, filterTab, searchQuery]);

  const activeCount = alerts.filter((a) => a.isEnabled).length;
  const triggeredCount = alerts.filter((a) => a.lastTriggeredAt !== null).length;

  // Calculate dynamic average drop target
  const avgDropTarget = React.useMemo(() => {
    if (alerts.length === 0) return 0;
    let totalDropPercentage = 0;
    let count = 0;

    alerts.forEach((item) => {
      if (item.targetDiscountPercentage !== null) {
        totalDropPercentage += item.targetDiscountPercentage;
        count++;
      } else if (item.targetPrice !== null && item.currentPrice) {
        const current = Number(item.currentPrice);
        const target = Number(item.targetPrice);
        if (current > 0) {
          totalDropPercentage += ((current - target) / current) * 100;
          count++;
        }
      }
    });

    return count > 0 ? Number((totalDropPercentage / count).toFixed(1)) : 0;
  }, [alerts]);

  // Calculate dynamic potential savings
  const estSavings = React.useMemo(() => {
    return alerts.reduce((acc, item) => {
      if (item.targetPrice !== null && item.currentPrice) {
        const current = Number(item.currentPrice);
        const target = Number(item.targetPrice);
        if (current > target) {
          return acc + (current - target);
        }
      }
      return acc;
    }, 0);
  }, [alerts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <p className="text-ink-muted">Failed to load price alerts.</p>
        <Button onClick={() => refetch()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  const atFreeLimit = !isPro && !canCreateAlert(activeCount);

  return (
    <div className="flex flex-col gap-6 w-full max-w-container mx-auto pb-16">
      {/* 1. Header Title & Main Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
            Price Alerts Monitoring
          </h1>
          <p className="text-ink-muted text-sm mt-1">
            Real-time automated price drop tracking with instant notifications.
          </p>
        </div>
      </div>

      {!isPro && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-ink-primary">
            Free plan: <span className="font-bold font-mono">{activeCount}/{freeAlertLimit}</span> active alerts
            {atFreeLimit ? " — limit reached." : "."}
          </p>
          <Button
            id="alerts-upgrade-cta"
            size="sm"
            variant={atFreeLimit ? "default" : "outline"}
            onClick={() => setUpgradeOpen(true)}
            className="font-bold uppercase tracking-wider shrink-0"
          >
            Upgrade to Pro
          </Button>
        </div>
      )}

      {/* 2. Overview Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-border bg-surface shadow-sm rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Active Alerts</p>
            <p className="text-2xl font-bold font-mono text-ink-primary mt-1">{activeCount}</p>
          </div>
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <TrendingDown className="h-5 w-5" />
          </div>
        </Card>

        <Card className="border border-border bg-surface shadow-sm rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Triggered Alerts</p>
            <p className="text-2xl font-bold font-mono text-positive mt-1">{triggeredCount}</p>
          </div>
          <div className="p-2.5 bg-positive/10 text-positive rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </Card>

        <Card className="border border-border bg-surface shadow-sm rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Avg. Drop Target</p>
            <p className="text-2xl font-bold font-mono text-ink-primary mt-1">{avgDropTarget}%</p>
          </div>
          <div className="p-2.5 bg-caution/10 text-caution rounded-lg">
            <Percent className="h-5 w-5" />
          </div>
        </Card>

        <Card className="border border-border bg-surface shadow-sm rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Est. Potential Savings</p>
            <p className="text-2xl font-bold font-mono text-ink-primary mt-1">{formatPrice(estSavings)}</p>
          </div>
          <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
            <DollarSign className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(["All", "Active", "Triggered"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
                filterTab === tab
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-ink-muted hover:bg-secondary hover:text-ink-primary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <SlidersHorizontal className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <Input
            placeholder="Search alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs rounded-lg bg-surface"
          />
        </div>
      </div>

      {/* 4. Active Alerts Monitoring Cards List */}
      <div className="flex flex-col gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center text-ink-muted border border-border border-dashed rounded-xl bg-surface">
            No price alerts found for selected filter.
          </div>
        ) : (
          filteredAlerts.map((item) => {
            const isTriggered = item.lastTriggeredAt !== null;
            const isPaused = !item.isEnabled;
            const productName = item.productSummary?.name || "Unknown Product";
            const marketplaceName = item.bestOffer?.marketplace?.name || "Marketplace";
            const currentPrice = item.currentPrice || 0;
            const targetPrice = item.targetPrice || 0;

            return (
              <Card
                key={item.id}
                className={`border bg-surface shadow-sm rounded-xl p-4 transition-all ${
                  isTriggered ? "border-positive/50 bg-positive/5" : "border-border"
                }`}
              >
                <CardContent className="p-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Product Metadata */}
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                      <span className="font-semibold uppercase tracking-wider text-primary">
                        {marketplaceName}
                      </span>
                      <span>•</span>
                      <span>Target Discount: {item.targetDiscountPercentage ? `${item.targetDiscountPercentage}%` : "N/A"}</span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-ink-primary leading-snug truncate">
                      {productName}
                    </h3>

                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-ink-muted">Current:</span>
                        <span className="font-mono font-bold text-sm text-ink-primary">
                          {formatPrice(currentPrice)}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-ink-muted">Target:</span>
                        <span className="font-mono font-bold text-sm text-primary">
                          {formatPrice(targetPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Channel, Status & Actions */}
                  <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border justify-between md:justify-end">
                    <Badge variant="outline" className="gap-1 text-[11px] font-sans border-border">
                      <Mail className="h-3 w-3 text-primary" />
                      <span>Email Notification</span>
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!isPaused}
                        onCheckedChange={() => toggleAlertStatus(item.id, item.isEnabled)}
                        aria-label="Toggle alert active state"
                      />
                      <span className="text-xs text-ink-muted w-14">
                        {isPaused ? "Paused" : "Active"}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAlert(item.id)}
                      className="text-ink-muted hover:text-negative hover:bg-negative/10 rounded-lg h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <UpgradeProModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        reason={atFreeLimit
          ? "You've reached the Free plan limit. Upgrade to Pro to track unlimited items."
          : "Unlock unlimited price alerts with DealScope Pro."}
      />
    </div>
  );
}
