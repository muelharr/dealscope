export default function PricingPage() {
  return (
    <div className="mx-auto max-w-container px-spacing-4 py-16 lg:px-spacing-8 text-center flex flex-col items-center">
      <h1 className="font-sans font-bold text-4xl tracking-tight text-ink-primary">
        Pricing Plans
      </h1>
      <p className="mt-spacing-3 text-lg text-ink-muted max-w-xl">
        Get premium shopping intelligence tools to help you save more on every single purchase.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-6 mt-12 max-w-4xl w-full">
        {/* Free Plan */}
        <div className="p-spacing-6 rounded-xl bg-surface border border-border text-left flex flex-col justify-between">
          <div>
            <h2 className="font-sans font-bold text-xl text-ink-primary">Free</h2>
            <p className="mt-2 text-ink-muted text-body-sm">Essential comparison tools.</p>
            <p className="mt-4 text-3xl font-bold font-mono text-ink-primary">Rp 0</p>
            <ul className="mt-6 space-y-2 text-body-sm text-ink-muted">
              <li>• Search across all marketplaces</li>
              <li>• Up to 3 active alerts</li>
              <li>• Basic deal score insights</li>
            </ul>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="p-spacing-6 rounded-xl bg-surface border-2 border-accent text-left flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <div>
            <h2 className="font-sans font-bold text-xl text-ink-primary">Pro</h2>
            <p className="mt-2 text-ink-muted text-body-sm">AI-driven predictive shopping features.</p>
            <p className="mt-4 text-3xl font-bold font-mono text-ink-primary">Rp 49.000<span className="text-body-sm font-sans font-normal text-ink-muted">/mo</span></p>
            <ul className="mt-6 space-y-2 text-body-sm text-ink-muted">
              <li>• Unlimited price alerts</li>
              <li>• AI price trend predictions</li>
              <li>• Instant seller trust analysis</li>
              <li>• Early access to browser extension</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
