'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SearchErrorProps {
  error: Error;
  onRetry: () => void;
}

export function SearchError({ onRetry }: SearchErrorProps) {
  return (
    <div
      role="alert"
      className="p-8 text-center text-red-600 border border-red-200 border-dashed rounded-xl bg-red-50"
    >
      <div className="flex flex-col items-center gap-4">
        <AlertTriangle className="w-12 h-12 text-red-400" />
        <h3 className="text-xl font-bold text-red-800">Something went wrong</h3>
        <p className="text-red-700">
          We couldn&apos;t load your search results. Please try again.
        </p>
        <Button onClick={onRetry} variant="destructive">
          Retry
        </Button>
      </div>
    </div>
  );
}
