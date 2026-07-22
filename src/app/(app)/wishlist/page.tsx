export default function WishlistPage() {
  return (
    <div className="flex flex-col gap-spacing-4">
      <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
        Wishlist
      </h1>
      <p className="text-ink-muted text-body-md">
        Your monitored products. We track their price movements and send you notifications when they drop.
      </p>
      <div className="mt-spacing-6 p-12 rounded-xl bg-surface border border-border border-dashed text-center">
        <p className="text-ink-muted">Your wishlist is empty. Start searching for items to monitor!</p>
      </div>
    </div>
  );
}
