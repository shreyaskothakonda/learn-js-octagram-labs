import Link from "next/link";
import { TOPICS } from "@/content/manifest";
import { getProblemsByTopic } from "@/content";
import type { Track } from "@/content/types";

export function ProblemList({ track }: { track: Track }) {
  return (
    <div className="space-y-8">
      {TOPICS[track].map((t) => {
        const problems = getProblemsByTopic(track, t.topic);
        if (problems.length === 0) return null;
        return (
          <section key={t.topic}>
            <h2 className="text-lg font-semibold mb-2">{t.label}</h2>
            <ul className="divide-y rounded-lg border">
              {problems.map((p) => (
                <li key={p.id}>
                  <Link href={`/problem/${p.id}`} className="flex justify-between px-4 py-3 hover:bg-gray-500/5">
                    <span>{p.title}</span>
                    <span className="text-xs uppercase text-gray-400">{p.difficulty}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
