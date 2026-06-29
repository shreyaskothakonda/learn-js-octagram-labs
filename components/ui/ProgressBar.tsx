import { Progress } from "./progress";

export function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return <Progress value={pct} className="h-1.5" />;
}
