export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-500/15" role="progressbar" aria-valuenow={value} aria-valuemax={total}>
      <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}
