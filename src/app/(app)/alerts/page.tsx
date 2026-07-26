"use client";

import * as React from "react";
import {
  TrendingDown,
  CheckCircle2,
  Percent,
  DollarSign,
  Plus,
  Trash2,
  SlidersHorizontal,
  Mail,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { formatPrice } from "@/lib/format";

interface PriceAlertItem {
  id: string;
  productName: string;
  marketplace: string;
  currentPrice: number;
  targetPrice: number;
  originalPrice: number;
  channel: "Email" | "Push" | "SMS";
  status: "Active" | "Triggered" | "Paused";
  lastChecked: string;
}

const MOCK_ALERTS: PriceAlertItem[] = [
  {
    id: "alert-1",
    productName: "Apple MacBook Pro 14\" M3 (16GB, 512GB)",
    marketplace: "Amazon",
    currentPrice: 1499,
    targetPrice: 1450,
    originalPrice: 1799,
    channel: "Email",
    status: "Active",
    lastChecked: "10 minutes ago",
  },
  {
    id: "alert-2",
    productName: "Apple iPhone 15 Pro Max (256GB, Natural Titanium)",
    marketplace: "Best Buy",
    currentPrice: 1099,
    targetPrice: 1100,
    originalPrice: 1199,
    channel: "Push",
    status: "Triggered",
    lastChecked: "Just now",
  },
  {
    id: "alert-3",
    productName: "NVIDIA GeForce RTX 4080 Super OC",
    marketplace: "Newegg",
    currentPrice: 999,
    targetPrice: 950,
    originalPrice: 1099,
    channel: "Email",
    status: "Active",
    lastChecked: "1 hour ago",
  },
  {
    id: "alert-4",
    productName: "Sony WH-1000XM5 Wireless Headphones",
    marketplace: "B&H Photo",
    currentPrice: 348,
    targetPrice: 320,
    originalPrice: 399,
    channel: "SMS",
    status: "Paused",
    lastChecked: "Yesterday",
  },
];

export default function AlertsPage() {
  const [filterTab, setFilterTab] = React.useState<"All" | "Active" | "Triggered">("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [alerts, setAlerts] = React.useState<PriceAlertItem[]>(MOCK_ALERTS);

  const toggleAlertStatus = (id: string) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Paused" ? "Active" : "Paused" }
          : item
      )
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredAlerts = React.useMemo(() => {
    return alerts.filter((item) => {
      const matchesTab = filterTab === "All" || item.status === filterTab;
      const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [alerts, filterTab, searchQuery]);

  const activeCount = alerts.filter((a) => a.status === "Active").length;
  const triggeredCount = alerts.filter((a) => a.status === "Triggered").length;

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
        <Button className="bg-primary text-primary-foreground font-sans font-bold text-xs uppercase tracking-wider rounded-lg gap-2 h-10 px-4">
          <Plus className="h-4 w-4" /> Create New Alert
        </Button>
      </div>

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
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Triggered (24h)</p>
            <p className="text-2xl font-bold font-mono text-positive mt-1">{triggeredCount}</p>
          </div>
          <div className="p-2.5 bg-positive/10 text-positive rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </Card>

        <Card className="border border-border bg-surface shadow-sm rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Avg. Drop Target</p>
            <p className="text-2xl font-bold font-mono text-ink-primary mt-1">14.2%</p>
          </div>
          <div className="p-2.5 bg-caution/10 text-caution rounded-lg">
            <Percent className="h-5 w-5" />
          </div>
        </Card>

        <Card className="border border-border bg-surface shadow-sm rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase tracking-wider">Est. Potential Savings</p>
            <p className="text-2xl font-bold font-mono text-ink-primary mt-1">$420.00</p>
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
            const isTriggered = item.status === "Triggered";
            const isPaused = item.status === "Paused";

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
                        {item.marketplace}
                      </span>
                      <span>•</span>
                      <span>Last checked: {item.lastChecked}</span>
                    </div>

                    <h3 className="font-sans font-bold text-base text-ink-primary leading-snug truncate">
                      {item.productName}
                    </h3>

                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-ink-muted">Current:</span>
                        <span className="font-mono font-bold text-sm text-ink-primary">
                          {formatPrice(item.currentPrice)}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs text-ink-muted">Target:</span>
                        <span className="font-mono font-bold text-sm text-primary">
                          {formatPrice(item.targetPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Channel, Status & Actions */}
                  <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-border justify-between md:justify-end">
                    <Badge variant="outline" className="gap-1 text-[11px] font-sans border-border">
                      {item.channel === "Email" ? (
                        <Mail className="h-3 w-3 text-primary" />
                      ) : (
                        <Smartphone className="h-3 w-3 text-primary" />
                      )}
                      <span>{item.channel} Notification</span>
                    </Badge>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!isPaused}
                        onCheckedChange={() => toggleAlertStatus(item.id)}
                        aria-label="Toggle alert active state"
                      />
                      <span className="text-xs text-ink-muted w-14">
                        {isPaused ? "Paused" : "Active"}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert(item.id)}
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
    </div>
  );
}
