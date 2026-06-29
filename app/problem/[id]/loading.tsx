export default function Loading() {
  return (
    <div className="h-[calc(100vh-3rem)] grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] animate-pulse">
      <div className="border-r p-5 space-y-3"><div className="h-6 w-2/3 rounded bg-gray-500/15" /><div className="h-24 w-full rounded bg-gray-500/10" /></div>
      <div className="bg-gray-500/5" />
      <div className="border-l bg-gray-500/5" />
    </div>
  );
}
