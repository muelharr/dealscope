export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-spacing-4">
      <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
        Settings
      </h1>
      <p className="text-ink-muted text-body-md">
        Manage your DealScope profile, subscription status, and notification channels.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-6 mt-spacing-4">
        <div className="p-spacing-6 rounded-xl bg-surface border border-border flex flex-col gap-spacing-2">
          <h2 className="font-sans font-semibold text-body-lg text-ink-primary border-b border-border pb-spacing-2">Profile Details</h2>
          <p className="text-body-sm text-ink-muted">Name: John Doe</p>
          <p className="text-body-sm text-ink-muted">Email: john.doe@example.com</p>
        </div>
        <div className="p-spacing-6 rounded-xl bg-surface border border-border flex flex-col gap-spacing-2">
          <h2 className="font-sans font-semibold text-body-lg text-ink-primary border-b border-border pb-spacing-2">Plan Details</h2>
          <p className="text-body-sm text-ink-muted">Current Plan: Pro Member</p>
          <p className="text-body-sm text-ink-muted">Status: Active</p>
        </div>
      </div>
    </div>
  );
}
