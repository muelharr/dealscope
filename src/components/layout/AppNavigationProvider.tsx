"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AppNavigationContextValue = {
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

const AppNavigationContext = createContext<AppNavigationContextValue | null>(null);

export function AppNavigationProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppNavigationContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
      {children}
    </AppNavigationContext.Provider>
  );
}

export function useAppNavigation() {
  const context = useContext(AppNavigationContext);
  if (!context) throw new Error("useAppNavigation must be used within AppNavigationProvider");
  return context;
}
