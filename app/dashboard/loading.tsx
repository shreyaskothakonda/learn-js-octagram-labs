export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-8 animate-pulse space-y-8">
      <div className="h-7 w-44 rounded bg-gray-500/15" />
      <div className="grid grid-cols-3 gap-4">{[0, 1, 2].map((i) => <div key={i} className="h-20 rounded-xl bg-gray-500/10" />)}</div>
      <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-5 w-full rounded bg-gray-500/15" />)}</div>
      <div className="h-40 w-full rounded-lg bg-gray-500/10" />
    </main>
  );
}
