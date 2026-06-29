export type Status = "solved" | "attempted" | undefined;

export function StatusIcon({ status }: { status: Status }) {
  if (status === "solved") return <span title="Solved" aria-label="Solved" className="text-green-500">✓</span>;
  if (status === "attempted") return <span title="Attempted" aria-label="Attempted" className="text-amber-500">●</span>;
  return <span title="Not started" aria-label="Not started" className="text-gray-300 dark:text-gray-600">○</span>;
}
