"use client";

import { UTCTimestamp } from "lightweight-charts";
import { ChartTableData } from "./chart_api";

type Props = {
  astroData: ChartTableData[]; // API response
  visibleRange: { from: UTCTimestamp; to: UTCTimestamp } | null;
  activeTime: UTCTimestamp | null;
};

const RASHI_COLORS: Record<string, string> = {
  Aries: "#ef4444",
  Taurus: "#22c55e",
  Gemini: "#38bdf8",
  Cancer: "#a855f7",
  Leo: "#f59e0b",
  Virgo: "#14b8a6",
  Libra: "#e879f9",
  Scorpio: "#fb7185",
  Sagittarius: "#f97316",
  Capricorn: "#64748b",
  Aquarius: "#0ea5e9",
  Pisces: "#6366f1",
};

export default function AstroBottomBar({ astroData, visibleRange, activeTime }: Props) {
  if (!visibleRange || astroData.length === 0) return null;

  // 1️⃣ Convert API time string → UTCTimestamp (seconds)
  const processedAstroData = astroData.map((d) => ({
    ...d,
    time: typeof d.time === "string" ? new Date(d.time).getTime() / 1000 : d.time,
  }));

  const total = visibleRange.to - visibleRange.from;

  // 2️⃣ Filter visible range
  const visibleAstro = processedAstroData.filter(
    (d) => d.time >= visibleRange.from && d.time <= visibleRange.to
  );

  if (visibleAstro.length === 0) return null;

  return (
    <div className="h-24 w-full bg-slate-950 border-t border-slate-800 relative overflow-hidden">
      <div className="flex h-full w-full">
        {visibleAstro.map((item, i) => {
          const start = Math.max(item.time, visibleRange.from);
          const end =
            i < visibleAstro.length - 1
              ? Math.min(visibleAstro[i + 1].time, visibleRange.to)
              : visibleRange.to;

          const width = ((end - start) / total) * 100;

          return (
            <div
              key={i}
              style={{
                width: `${width}%`,
                background: RASHI_COLORS[item.moonRashi] ?? "#334155",
              }}
              className="flex items-center justify-center text-xs text-white border-r border-black/20"
            >
              {item.moonRashi}
            </div>
          );
        })}
      </div>

      {/* ACTIVE TIME MARKER */}
      {activeTime &&
        activeTime >= visibleRange.from &&
        activeTime <= visibleRange.to && (
          <div
            className="absolute top-0 bottom-0 w-px bg-yellow-400"
            style={{
              left: `${((activeTime - visibleRange.from) / total) * 100}%`,
            }}
          />
        )}
    </div>
  );
}
