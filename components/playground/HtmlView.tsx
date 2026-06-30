export function HtmlView({ srcdoc }: { srcdoc: string | null }) {
  if (!srcdoc) return <p className="p-4 text-sm text-gray-400">Run your code to see the rendered HTML.</p>;
  return (
    <iframe title="HTML preview" sandbox="allow-scripts" srcDoc={srcdoc} className="w-full h-full min-h-75 bg-white" />
  );
}
