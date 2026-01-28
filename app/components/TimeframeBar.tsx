export default function TimeframeBar({ onChange }: any) {
  const frames = ["1D", "1W", "1M"];

  return (
    <div className="flex gap-2 mb-2">
      {frames.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-sm"
        >
          {f}
        </button>
      ))}
    </div>
  );
}
