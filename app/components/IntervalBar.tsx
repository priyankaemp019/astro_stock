    "use client";

    type Props = {
    interval: string;
    onChange: (i: string) => void;
    };

    export default function IntervalBar({ interval, onChange }: Props) {
    const intervals = ["1m", "5m", "15m","30m", "1h", "1D"];

    return (
        <div className="flex gap-2 border-b px-2 py-1 border-slate-700 bg-slate-900">
        {intervals.map((i) => (
            <button
            key={i}
            onClick={() => onChange(i)}
            className={`px-3 py-1 text-xs rounded ${
                interval === i
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
            >
            {i}
            </button>
        ))}
        </div>
    );
    }
