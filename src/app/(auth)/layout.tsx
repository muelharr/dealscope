import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-spacing-4 font-sans">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
