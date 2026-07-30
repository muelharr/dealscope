import React from "react";
import Footer from "@/components/layout/Footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      {/* Ambient decorative background blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-4 md:px-0 py-8">
        {children}
      </main>

      {/* Footer */}
      <Footer variant="minimal" />
    </div>
  );
}
