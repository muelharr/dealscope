import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-container px-spacing-4 py-16 lg:px-spacing-8 text-center flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="font-sans font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-ink-primary max-w-3xl leading-tight">
        Search Once. Compare Everywhere.
      </h1>
      <p className="mt-spacing-4 text-lg md:text-xl text-ink-muted max-w-2xl">
        Know Before You Buy. The Shopping Intelligence Platform that aggregates price data, maps trends, and uses AI to find the best value for you.
      </p>
      <div className="mt-spacing-6 flex flex-wrap justify-center gap-spacing-4">
        <Link 
          href="/dashboard"
          className="px-spacing-6 py-3 rounded-lg font-sans font-medium text-body-medium bg-accent text-white hover:bg-accent/90 transition-all active:scale-98"
        >
          Enter Platform
        </Link>
        <Link 
          href="/pricing"
          className="px-spacing-6 py-3 rounded-lg font-sans font-medium text-body-medium bg-secondary text-ink-primary hover:bg-accent-subtle transition-all active:scale-98 border border-border"
        >
          View Plans
        </Link>
      </div>
    </div>
  );
}
