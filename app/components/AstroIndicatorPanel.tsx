// import { UTCTimestamp } from "lightweight-charts";
// import { rashis } from "../data/candles";

// type Props = {
//   time: UTCTimestamp | null;
//   activeRashi?: string; 
// };

// export default function AstroIndicatorPanel({ time, activeRashi }: Props) {
//   return (
//     <div className="h-full bg-slate-900 text-sm flex w-full">

//       {/* 🔹 LEFT RASHI PANEL */}
//       <div className="w-40 border-r border-slate-700 overflow-y-auto">

//         {/* 📌 PINNED FIRST 3 RASHIS */}
//         <div className="sticky top-0 bg-slate-900 z-10">
//           {rashis.slice(0, 3).map((rashi) => (
//             <div
//               key={rashi}
//               className={`px-3 py-2 text-xs font-semibold border-b
//                 ${
//                   rashi === activeRashi
//                     ? "bg-yellow-500/20 text-yellow-400"
//                     : "text-white border-slate-700"
//                 }`}
//             >
//               {rashi}
//             </div>
//           ))}
//         </div>

//         {/* 🔽 SCROLLABLE RASHIS */}
//         {rashis.slice(3).map((rashi) => (
//           <div
//             key={rashi}
//             className={`px-3 py-2 text-xs border-b cursor-pointer
//               ${
//                 rashi === activeRashi
//                   ? "bg-yellow-500/20 text-yellow-400 font-semibold"
//                   : "text-slate-300 border-slate-800 hover:bg-slate-800"
//               }`}
//           >
//             {rashi}
//           </div>
//         ))}
//       </div>

//       {/* 🔹 RIGHT INFO PANEL */}
//       <div className="flex-1 p-4 text-slate-400 text-xs">
//         {time ? (
//           <div>
//             Active Time:
//             <div className="text-white mt-1">
//               {new Date((time as number) * 1000).toLocaleString()}
//             </div>

//             {activeRashi && (
//               <div className="mt-3">
//                 Moon Rashi:
//                 <div className="text-yellow-400 font-semibold">
//                   {activeRashi}
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           "Hover on chart to see astro indicators"
//         )}
//       </div>
//     </div>
//   );
// }

//   import { UTCTimestamp } from "lightweight-charts";
// import { rashis } from "../data/candles";
// import { ChartTableData } from "./chart_api";

// type Props = {
//   time: UTCTimestamp | null;
//   astro?: ChartTableData;
// };

// export default function AstroIndicatorPanel({ time, astro }: Props) {
//   const activeRashis = astro
//     ? new Set([
//         astro.moonRashi,
//         astro.sunRashi,
//         astro.marsRashi,
//         astro.mercuryRashi,
//         astro.jupiterRashi,
//         astro.venusRashi,
//         astro.saturnRashi,
//         astro.rahuRashi,
//         astro.ketuRashi,
//       ])
//     : new Set();

//   return (
//     <div className="h-full bg-slate-900 flex text-xs text-slate-300">

//       {/* LEFT RASHI LIST */}
//       <div className="w-40 border-r border-slate-700 overflow-y-auto">
//         {rashis.map((rashi) => (
//           <div
//             key={rashi}
//             className={`px-3 py-2 border-b
//               ${
//                 activeRashis.has(rashi)
//                   ? "bg-yellow-500/20 text-yellow-400 font-semibold"
//                   : "border-slate-800"
//               }`}
//           >
//             {rashi}
//           </div>
//         ))}
//       </div>

//       {/* RIGHT DETAILS */}
//       <div className="flex-1 p-4 space-y-1">
//         {time && (
//           <div className="text-white mb-2">
//             {new Date((time as number) * 1000).toLocaleString()}
//           </div>
//         )}

//         {astro ? (
//           <>
//             <div>🌙 Moon: <span className="text-yellow-400">{astro.moonRashi}</span></div>
//             <div>☀️ Sun: <span className="text-orange-400">{astro.sunRashi}</span></div>
//             <div>♂ Mars: <span className="text-red-400">{astro.marsRashi}</span></div>
//             <div>☿ Mercury: <span className="text-green-400">{astro.mercuryRashi}</span></div>
//             <div>♃ Jupiter: <span className="text-blue-400">{astro.jupiterRashi}</span></div>
//             <div>♀ Venus: <span className="text-pink-400">{astro.venusRashi}</span></div>
//             <div>♄ Saturn: <span className="text-indigo-400">{astro.saturnRashi}</span></div>
//             <div>☊ Rahu: <span className="text-purple-400">{astro.rahuRashi}</span></div>
//             <div>☋ Ketu: <span className="text-cyan-400">{astro.ketuRashi}</span></div>
//           </>
//         ) : (
//           "No astro data"
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useRef } from "react";
// import {
//   createChart,
//   LineSeries,
//   UTCTimestamp,
//   SeriesMarker,
//   createSeriesMarkers,
// } from "lightweight-charts";
// import { ChartTableData } from "./chart_api";

// type Props = {
//   data: ChartTableData[];
//   activeTime: UTCTimestamp | null;
// };

// export default function AstroBottomIndicator({ data, activeTime }: Props) {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const chartApiRef = useRef<ReturnType<typeof createChart> | null>(null);
//   const seriesRef = useRef<any>(null);
//   const markerCtrlRef = useRef<any>(null);


//   useEffect(() => {
//     if (!chartRef.current || !data.length) return;

//     const chart = createChart(chartRef.current, {
//       autoSize: true,
//       layout: {
//         background: { color: "#0b1220" },
//         textColor: "#94a3b8",
//       },
//       grid: {
//         vertLines: { visible: false },
//         horzLines: { visible: false },
//       },
//       timeScale: {
//         timeVisible: true,
//         borderVisible: false,
//       },
//       rightPriceScale: {
//         visible: false,
//       },
//       crosshair: {
//         vertLine: { visible: true },
//         horzLine: { visible: false }
//       }
//     });

//     // 🔹 Dummy invisible series
//     const series = chart.addSeries(LineSeries, {
//       color: "transparent",
//       lineWidth: 1,
//     });
//     seriesRef.current = series;

//     series.setData(
//       data.map((c) => ({
//         time: Math.floor(
//           new Date(`${c.date}T${c.time}`).getTime() / 1000
//         ) as UTCTimestamp,
//         value: 0,
//       }))
//     );

//     // 🔹 Rashi change markers
//     const markers: SeriesMarker<UTCTimestamp>[] = [];
//     let prevRashi: string | null = null;

//     data.forEach((c) => {
//       if (c.moonRashi !== prevRashi) {
//         markers.push({
//           time: Math.floor(
//             new Date(`${c.date}T${c.time}`).getTime() / 1000
//           ) as UTCTimestamp,
//           position: "aboveBar",
//           shape: "circle",
//           color: "#facc15",
//           text: c.moonRashi,
//         });
//         prevRashi = c.moonRashi;
//       }
//     });

//     // ✅ v5 marker API
//     const markerController = createSeriesMarkers(series);
//     markerController.setMarkers(markers);
//     markerCtrlRef.current = markerCtrlRef;
//     chart.timeScale().fitContent();

//     return () => chart.remove();
//   }, [data]);

//   useEffect(() => {
//     if (!chartApiRef.current || !activeTime) return;

//     chartApiRef.current.timeScale().setVisibleRange({
//       from: activeTime,
//       to: activeTime,
//     });
//   }, [activeTime]);

//   return <div ref={chartRef} className="w-full h-full" />;
// }

"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  UTCTimestamp,
  LineSeries,
  SeriesMarker,
  createSeriesMarkers,
  CrosshairMode,
} from "lightweight-charts";
import { ChartTableData } from "./chart_api";

type Props = {
  data: ChartTableData[];
  visibleRange: { from: UTCTimestamp; to: UTCTimestamp } | null;
  onRangeChange: (range: { from: UTCTimestamp; to: UTCTimestamp } | null) => void;
  activeTime: UTCTimestamp | null;
  onTimeChange: (time: UTCTimestamp | null) => void;
};

export default function AstroBottomIndicator({
  data,
  visibleRange,
  onRangeChange,
  activeTime,
  onTimeChange,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  // 🔹 INIT
  useEffect(() => {
    if (!ref.current || !data.length) return;

    const chart = createChart(ref.current, {
      autoSize: true,
      layout: {
        background: { color: "#020617" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },
      // rightPriceScale: { visible: false },
      // leftPriceScale: { visible: false },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        borderVisible: false,
        rightBarStaysOnScroll: true,
        fixLeftEdge: true,
        fixRightEdge: true,
        rightOffset: 5,
        barSpacing: 9,
      },
      crosshair: {
        vertLine: { visible: true },
        horzLine: { visible: false },
        // mode: CrosshairMode.Normal,
      },
    });

    chartRef.current = chart;

    // invisible baseline
    const series = chart.addSeries(LineSeries, {
      color: "transparent",
    });

    seriesRef.current = series;

    // baseline data
    const timeline = data.map((d) => ({
      time: Math.floor(
        new Date(`${d.date}T${d.time}`).getTime() / 1000
      ) as UTCTimestamp,
      value: 1,
    }));

    series.setData(timeline);

    // 🌙 Moon Rashi markers (clean)
    const markers: SeriesMarker<UTCTimestamp>[] = [];
    let last: string | null = null;

    data.forEach((d) => {
      if (d.moonRashi !== last) {
        markers.push({
          time: Math.floor(
            new Date(`${d.date}T${d.time}`).getTime() / 1000
          ) as UTCTimestamp,
          position: "inBar",
          shape: "circle",
          color: "#facc15",
          text: d.moonRashi,
        });
        last = d.moonRashi;
      }
    });

    const markerCtrl = createSeriesMarkers(series);
    markerCtrl.setMarkers(markers);

    // sync → parent
    chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
      if (!range) return;
      onRangeChange({
        from: range.from as UTCTimestamp,
        to: range.to as UTCTimestamp,
      });
    });

    chart.subscribeCrosshairMove((param) => {
      if (!param.time) onTimeChange(null);
      else onTimeChange(param.time as UTCTimestamp);
    });

    // chart.timeScale().fitContent();
    chart.timeScale().scrollToRealTime();
    return () => chart.remove();
  }, [data]);

  // 🔗 RANGE SYNC
  useEffect(() => {
    if (!chartRef.current || !visibleRange) return;
    const current = chartRef.current.timeScale().getVisibleRange();
    if (JSON.stringify(current) !== JSON.stringify(visibleRange)) {
      chartRef.current.timeScale().setVisibleRange(visibleRange);
    }
  }, [visibleRange]);

  // 🔗 CROSSHAIR SYNC
  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;
    try {
      if (activeTime) {
        chartRef.current.setCrosshairPosition(
          1,
          activeTime,
          seriesRef.current
        );
      } else {
        chartRef.current.clearCrosshairPosition();
      }
    } catch { }
  }, [activeTime]);

  return <div ref={ref} className="w-full h-30" />;
}
