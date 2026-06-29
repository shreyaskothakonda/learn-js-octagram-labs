import Link from "next/link";
import { getProblemsByTrack } from "@/content";

export default function Home() {
  const js = getProblemsByTrack("javascript").length;
  const ds = getProblemsByTrack("data-structures").length;
  const react = getProblemsByTrack("react").length;
  const cards = [
    { href: "/learn/javascript", title: "JavaScript", desc: "Core language topics: arrays, closures, async, and the DOM.", count: js },
    { href: "/learn/data-structures", title: "Data Structures in JS", desc: "Stacks, queues, linked lists, trees, graphs, and more.", count: ds },
    { href: "/learn/react", title: "JavaScript for React", desc: "Immutable updates, reducers, selectors, and list rendering patterns.", count: react },
  ];
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-4xl font-bold mb-2">Octagram Labs: Learn JavaScript</h1>
      <p className="text-gray-500 mb-8">Practice in the browser. Run code, pass tests, track progress.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl border p-6 hover:border-blue-500 transition">
            <h2 className="text-xl font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
            <p className="text-xs text-gray-400 mt-3">{c.count} problems</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
