'use client';

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

interface ProductDetailErrorProps {
  error: Error;
  onRetry: () => void;
}

export function ProductDetailError({ onRetry }: ProductDetailErrorProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center p-12 text-center border border-red-200 border-dashed rounded-2xl bg-red-50/30 max-w-lg mx-auto my-12"
    >
      <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-2xl font-sans font-bold text-ink-primary mb-2">
        Error Loading Product
      </h2>
      <p className="text-ink-muted text-body-md mb-6">
        We encountered a problem loading the product details. This might be a temporary network issue.
      </p>
      <div className="flex gap-4">
        <Button onClick={onRetry} variant="default">
          Try Again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
