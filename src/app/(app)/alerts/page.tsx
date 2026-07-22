export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-spacing-4">
      <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
        Price Alerts
      </h1>
      <p className="text-ink-muted text-body-md">
        Configure thresholds and receive instant notifications via email or push notification.
      </p>
      <div className="mt-spacing-6 p-12 rounded-xl bg-surface border border-border border-dashed text-center">
        <p className="text-ink-muted">No price alerts configured yet.</p>
      </div>
    </div>
  );
}
