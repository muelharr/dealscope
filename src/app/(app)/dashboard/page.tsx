export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-spacing-4">
      <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
        Dashboard
      </h1>
      <p className="text-ink-muted text-body-md">
        Welcome to your shopping intelligence hub. Here you will see your savings analytics, recent alerts, and monitored products.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-4 mt-spacing-4">
        <div className="p-spacing-4 rounded-xl bg-surface border border-border">
          <h2 className="font-sans font-semibold text-body-lg text-ink-primary">Savings Summary</h2>
          <p className="mt-2 text-3xl font-mono font-bold text-positive">Rp 0</p>
        </div>
        <div className="p-spacing-4 rounded-xl bg-surface border border-border">
          <h2 className="font-sans font-semibold text-body-lg text-ink-primary">Active Alerts</h2>
          <p className="mt-2 text-3xl font-mono font-bold text-ink-primary">0</p>
        </div>
        <div className="p-spacing-4 rounded-xl bg-surface border border-border">
          <h2 className="font-sans font-semibold text-body-lg text-ink-primary">Monitored Items</h2>
          <p className="mt-2 text-3xl font-mono font-bold text-ink-primary">0</p>
        </div>
      </div>
    </div>
  );
}
