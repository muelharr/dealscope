export default function SearchPage() {
  return (
    <div className="flex flex-col gap-spacing-4">
      <h1 className="font-sans font-bold text-3xl tracking-tight text-ink-primary">
        Search
      </h1>
      <p className="text-ink-muted text-body-md">
        Find products and compare prices across all connected marketplaces.
      </p>
      <div className="mt-spacing-4 max-w-xl">
        <input
          type="text"
          placeholder="Search for products (e.g. RTX 5070, ThinkPad)..."
          disabled
          className="w-full px-spacing-4 py-3 rounded-lg bg-surface border border-border-interactive focus:outline-none cursor-not-allowed opacity-80"
        />
      </div>
    </div>
  );
}
