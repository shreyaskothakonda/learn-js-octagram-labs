import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-5">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-1.5 w-full" />
      <Skeleton className="h-9 w-full" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
      ))}
    </main>
  );
}
