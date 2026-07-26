import React from "react";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex justify-center">
          <Logo size="lg" href="/" />
        </div>
        {children}
      </div>
    </div>
  );
}
