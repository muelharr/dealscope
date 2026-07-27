"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩", short: "ID" },
  { code: "en", label: "English (US)", flag: "🇺🇸", short: "EN" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<string>("id");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Read current locale from cookie or document lang
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match && match[1]) {
      setCurrentLocale(match[1]);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    setCurrentLocale(newLocale);
    setIsOpen(false);
    router.refresh();
  };

  const activeObj = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0];

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch Language"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/70 hover:bg-secondary border border-border text-xs font-medium text-ink-primary transition-all active:scale-95"
      >
        <Globe className="h-3.5 w-3.5 text-ink-muted" />
        <span className="font-mono text-xs font-bold">{activeObj.short}</span>
        <span className="text-xs">{activeObj.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 w-44 rounded-xl border border-border bg-surface shadow-lg z-50 p-1 animate-in fade-in-50 slide-in-from-top-1 duration-150">
          {LOCALES.map((locale) => {
            const isSelected = locale.code === currentLocale;
            return (
              <button
                key={locale.code}
                onClick={() => changeLocale(locale.code)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors",
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-ink-primary hover:bg-muted/60"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{locale.flag}</span>
                  <span>{locale.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
