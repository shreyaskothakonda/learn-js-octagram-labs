export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-6 animate-pulse space-y-5">
      <div className="h-8 w-48 rounded bg-gray-500/15" />
      <div className="h-1.5 w-full rounded bg-gray-500/15" />
      <div className="h-9 w-full rounded bg-gray-500/15" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 w-40 rounded bg-gray-500/15" />
          <div className="h-24 w-full rounded-lg bg-gray-500/10" />
        </div>
      ))}
    </main>
  );
}
