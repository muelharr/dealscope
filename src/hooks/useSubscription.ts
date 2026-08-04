"use client";

import { useMemo } from "react";
import { useSession } from "@/auth/hooks";

export const FREE_ALERT_LIMIT = 10;

export type ProFeature = "AI_INSIGHTS" | "UNLIMITED_ALERTS" | "ADVANCED_ANALYTICS";

export function useSubscription() {
  const { user, upgradePlan, isLoading } = useSession();

  const plan = (user?.plan === "PRO" ? "PRO" : "FREE") as "FREE" | "PRO";
  const isPro = plan === "PRO";

  const canUseFeature = (feature: ProFeature): boolean => {
    if (isPro) return true;
    switch (feature) {
      case "AI_INSIGHTS":
      case "ADVANCED_ANALYTICS":
      case "UNLIMITED_ALERTS":
        return false;
      default:
        return true;
    }
  };

  const canCreateAlert = (activeCount: number): boolean => {
    if (isPro) return true;
    return activeCount < FREE_ALERT_LIMIT;
  };

  return useMemo(
    () => ({
      plan,
      isPro,
      isLoading,
      freeAlertLimit: FREE_ALERT_LIMIT,
      canUseFeature,
      canCreateAlert,
      upgradeToPro: async () => {
        if (!upgradePlan) throw new Error("upgradePlan is unavailable");
        await upgradePlan("PRO");
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plan, isPro, isLoading, upgradePlan]
  );
}
