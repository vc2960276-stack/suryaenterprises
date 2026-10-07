export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-line bg-white p-3" aria-hidden="true">
      <div className="skeleton aspect-square w-full" />
      <div className="skeleton mt-3 h-3.5 w-11/12" />
      <div className="skeleton mt-1.5 h-3.5 w-2/3" />
      <div className="skeleton mt-3 h-4 w-12" />
      <div className="skeleton mt-2 h-5 w-20" />
      <div className="skeleton mt-3 h-8 w-full" />
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <main className="shell py-3" aria-busy="true" aria-label="Loading products">
      <div className="skeleton mb-2 h-3 w-48" />
      <div className="grid gap-3 lg:grid-cols-[264px_minmax(0,1fr)]">
        <div className="hidden rounded-lg border border-line bg-white p-4 lg:block">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="mb-6">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton mt-3 h-3 w-full" />
              <div className="skeleton mt-2 h-3 w-5/6" />
              <div className="skeleton mt-2 h-3 w-4/6" />
            </div>
          ))}
        </div>
        <div>
          <div className="rounded-lg border border-line bg-white p-4">
            <div className="skeleton h-5 w-56" />
            <div className="skeleton mt-3 h-3 w-80 max-w-full" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {Array.from({ length: 10 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export function ProductSkeleton() {
  return (
    <main className="shell py-3" aria-busy="true" aria-label="Loading product">
      <div className="skeleton mb-2 h-3 w-64" />
      <div className="grid gap-3 rounded-lg border border-line bg-white p-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <div className="skeleton aspect-square w-full" />
        <div>
          <div className="skeleton h-3 w-28" />
          <div className="skeleton mt-3 h-6 w-11/12" />
          <div className="skeleton mt-2 h-6 w-2/3" />
          <div className="skeleton mt-4 h-5 w-16" />
          <div className="skeleton mt-5 h-8 w-32" />
          <div className="mt-5 flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton h-9 w-20" />
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <div className="skeleton h-12 w-44" />
            <div className="skeleton h-12 w-44" />
          </div>
          <div className="skeleton mt-6 h-24 w-full" />
        </div>
      </div>
    </main>
  );
}
