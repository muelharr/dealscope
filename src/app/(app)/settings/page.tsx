"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Sun,
  Moon,
  Laptop,
  Bell,
  Sparkles,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const currentUser = useCurrentUser();

  const [fullName, setFullName] = React.useState(currentUser?.username || "Admin User");
  const [email, setEmail] = React.useState(currentUser?.email || "admin@dealscope.com");
  const [activeTab, setActiveTab] = React.useState("general");

  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [pushAlerts, setPushAlerts] = React.useState(true);
  const [weeklyDigest, setWeeklyDigest] = React.useState(false);

  // AI Preferences
  const [aiSensitivity, setAiSensitivity] = React.useState("Strict");
  const [minDiscountThreshold, setMinDiscountThreshold] = React.useState("10");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings updated successfully!");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-container mx-auto pb-16">
      {/* Page Header */}
      <div>
        <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
          Platform Settings
        </h1>
        <p className="text-ink-muted text-sm mt-1">
          Manage your profile credentials, theme appearance, and AI Shopping Intelligence preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Inner Settings Navigation */}
        <nav className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-border pr-0 md:pr-4">
          {[
            { id: "general", label: "General & Profile", icon: User },
            { id: "appearance", label: "Appearance", icon: Sun },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "ai-preferences", label: "AI Preferences", icon: Sparkles },
            { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold font-sans transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-ink-muted hover:bg-secondary hover:text-ink-primary"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Forms Container */}
        <form onSubmit={handleSaveSettings} className="flex-1 space-y-8 w-full max-w-2xl">
          {/* General Section */}
          {(activeTab === "general" || activeTab === "all") && (
            <Card id="general" className="border border-border bg-surface shadow-sm rounded-xl p-6">
              <CardContent className="p-0 space-y-6">
                <div>
                  <h2 className="font-sans font-bold text-lg text-ink-primary">General Profile</h2>
                  <p className="text-xs text-ink-muted mt-0.5">Manage your personal account credentials.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Full Name</label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-surface text-sm h-10 rounded-lg border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Email Address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-surface text-sm h-10 rounded-lg border-border"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border">
                  <div>
                    <span className="text-xs font-bold text-ink-primary">Account Subscription</span>
                    <p className="text-[11px] text-ink-muted">Pro Shopping Intelligence License</p>
                  </div>
                  <Badge variant="default" className="bg-primary text-primary-foreground font-mono">PRO ACTIVE</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Section */}
          {(activeTab === "appearance" || activeTab === "all") && (
            <Card id="appearance" className="border border-border bg-surface shadow-sm rounded-xl p-6">
              <CardContent className="p-0 space-y-6">
                <div>
                  <h2 className="font-sans font-bold text-lg text-ink-primary">Appearance</h2>
                  <p className="text-xs text-ink-muted mt-0.5">Customize theme theme for optimal visual contrast.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "light", label: "Light Mode", icon: Sun },
                    { id: "dark", label: "Dark Mode", icon: Moon },
                    { id: "system", label: "System Auto", icon: Laptop },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = theme === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setTheme(item.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/60 bg-secondary/20 text-ink-muted hover:border-border"
                        }`}
                      >
                        <Icon className="h-6 w-6 mb-2" />
                        <span className="text-xs font-bold font-sans">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Section */}
          {(activeTab === "notifications" || activeTab === "all") && (
            <Card id="notifications" className="border border-border bg-surface shadow-sm rounded-xl p-6">
              <CardContent className="p-0 space-y-6">
                <div>
                  <h2 className="font-sans font-bold text-lg text-ink-primary">Notification Channels</h2>
                  <p className="text-xs text-ink-muted mt-0.5">Configure when and where you receive price drop alerts.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                    <div>
                      <p className="text-xs font-bold text-ink-primary">Email Notifications</p>
                      <p className="text-[11px] text-ink-muted">Receive price drops directly in your inbox.</p>
                    </div>
                    <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                    <div>
                      <p className="text-xs font-bold text-ink-primary">Browser Push Alerts</p>
                      <p className="text-[11px] text-ink-muted">Instant popups when monitored prices hit target.</p>
                    </div>
                    <Switch checked={pushAlerts} onCheckedChange={setPushAlerts} />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                    <div>
                      <p className="text-xs font-bold text-ink-primary">Weekly Deal Summary</p>
                      <p className="text-[11px] text-ink-muted">A weekly breakdown of market trends & savings.</p>
                    </div>
                    <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Preferences */}
          {(activeTab === "ai-preferences" || activeTab === "all") && (
            <Card id="ai-preferences" className="border border-border bg-surface shadow-sm rounded-xl p-6">
              <CardContent className="p-0 space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <h2 className="font-sans font-bold text-lg text-ink-primary">AI Shopping Advisor</h2>
                    <p className="text-xs text-ink-muted mt-0.5">Adjust DealScore confidence calculation thresholds.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">AI Sensitivity Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Conservative", "Balanced", "Strict"].map((lvl) => (
                        <button
                          type="button"
                          key={lvl}
                          onClick={() => setAiSensitivity(lvl)}
                          className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                            aiSensitivity === lvl
                              ? "bg-purple-600/10 text-purple-600 dark:text-purple-300 border-purple-300"
                              : "border-border text-ink-muted hover:bg-secondary"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ink-muted uppercase tracking-wider">Minimum Price Drop % Trigger</label>
                    <Input
                      type="number"
                      value={minDiscountThreshold}
                      onChange={(e) => setMinDiscountThreshold(e.target.value)}
                      className="bg-surface text-sm h-10 rounded-lg border-border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Action */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-primary text-primary-foreground font-sans font-bold text-xs uppercase tracking-wider h-10 px-6 rounded-lg gap-2">
              <Check className="h-4 w-4" /> Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
