import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-8 space-y-8">
      <Skeleton className="h-7 w-44" />
      <div className="grid grid-cols-3 gap-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-20" />)}</div>
      <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-5 w-full" />)}</div>
      <Skeleton className="h-40 w-full" />
    </main>
  );
}
