import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="h-[calc(100vh-3rem)] grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr]">
      <div className="border-r p-5 space-y-3"><Skeleton className="h-6 w-2/3" /><Skeleton className="h-24 w-full" /></div>
      <Skeleton className="rounded-none" />
      <Skeleton className="rounded-none border-l" />
    </div>
  );
}
