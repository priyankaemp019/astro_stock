// "use client";

// import {
//   createChart,
//   CrosshairMode,
//   CandlestickSeries,
//   CandlestickData,
//   ISeriesApi,
//   UTCTimestamp,
//   MouseEventParams,
//   SeriesMarker
// } from "lightweight-charts";
// import { useEffect, useRef } from "react";
// import { fetchChartData, fetchChartTableData } from "./chart_api";
// import * as SunCalc from 'suncalc';
// type Props = {
//   interval: string;
//   fromDate: string;
//   toDate: string;
//   onTimeChange: (time: UTCTimestamp | null) => void;
// };

// function mapInterval(interval: string) {
//   switch (interval) {
//     case "1m":
//       return "1minute";
//     case "30m":
//       return "30minute";
//     case "1D":
//       return "day";
//     case "1W":
//       return "week";
//     case "1M":
//       return "month";
//     default:
//       return "1minute";
//   }
// }

// export default function TradingChart({ interval, fromDate, toDate, onTimeChange }: Props) {
//   const ref = useRef<HTMLDivElement>(null);
//   const chartRef = useRef<ReturnType<typeof createChart> | null>(null);
//   const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
//   const tooltipRef = useRef<HTMLDivElement | null>(null);

//   // -------------------------
//   // FETCH & SET CHART DATA
//   // -------------------------
//   const fetchData = async () => {
//     if (!seriesRef.current) return;

//     try {
//       const fDate = new Date(fromDate);
//       const tDate = new Date(toDate);
//       const apiInterval = mapInterval(interval);
//       // const res = await fetchChartData(
//       //   tDate,
//       //   fDate,
//       //   "NSE_INDEX%7CNifty Bank",
//       //   apiInterval
//       // );

//       // const candles: CandlestickData<UTCTimestamp>[] = res
//       //   .map((c) => ({
//       //     time: Math.floor(c[0] / 1000) as UTCTimestamp, // ✅ ms → sec
//       //     open: c[1],
//       //     high: c[2],
//       //     low: c[3],
//       //     close: c[4],
//       //   }))
//       //   .sort((a, b) => a.time - b.time);

//       const res = await fetchChartTableData();
//       const candles: CandlestickData<UTCTimestamp>[] = res.data.map((c) => ({
//         time: Math.floor(new Date(`${c.date}T${c.time}`).getTime() / 1000) as UTCTimestamp,
//         open: c.open,
//         high: c.high,
//         low: c.low,
//         close: c.close,
//       }))

//       seriesRef.current.setData(candles);
//       // --- MOON LOGIC ---
//       const markers: SeriesMarker<UTCTimestamp>[] = [];
//       let lastMarkedDay = "";

//       candles.forEach((candle, index) => {
//         const date = new Date((candle.time as number) * 1000);
//         const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD

//         const moon = SunCalc.getMoonIllumination(date);
//         const phase = moon.phase;

//         // Only mark once per calendar day to avoid cluttering intraday charts
//         if (dateString !== lastMarkedDay) {
//           // Full Moon (approx 0.5)
//           if (phase >= 0.48 && phase <= 0.52) {
//             markers.push({
//               time: candle.time,
//               position: "aboveBar",
//               color: "#fde047",
//               shape: "circle",
//               text: "Purnima 🌕",
//             });
//             lastMarkedDay = dateString;
//           }
//           // New Moon (approx 0 or 1)
//           else if (phase <= 0.02 || phase >= 0.98) {
//             markers.push({
//               time: candle.time,
//               position: "belowBar",
//               color: "#94a3b8",
//               shape: "circle",
//               text: "Amavasya 🌑",
//             });
//             lastMarkedDay = dateString;
//           }
//         }
//       });

//       // ✅ FIXED CALL: Use type assertion if TS complains
//       (seriesRef.current as any).setMarkers(markers);
//     } catch (err) {
//       console.error("Error fetching chart data:", err);
//     }
//   };

//   // -------------------------
//   // INIT CHART (RUNS ONCE)
//   // -------------------------
//   useEffect(() => {
//     if (!ref.current) return;

//     const chart = createChart(ref.current, {
//       autoSize: true,
//       layout: {
//         background: { color: "#0b1220" },
//         textColor: "#cbd5e1",
//       },
//       grid: {
//         vertLines: { color: "#1e293b" },
//         horzLines: { color: "#1e293b" },
//       },
//       crosshair: { mode: CrosshairMode.Normal },
//       timeScale: { timeVisible: true },
//       rightPriceScale: { borderColor: "#334155" },


//     });

//     chartRef.current = chart;

//     const series = chart.addSeries(CandlestickSeries, {
//       upColor: "#22c55e",
//       downColor: "#ef4444",
//       wickUpColor: "#22c55e",
//       wickDownColor: "#ef4444",
//       borderVisible: false,

//       // ✅ REMOVE RED LAST PRICE LINE
//       // priceLineVisible: false,
//       // lastValueVisible: false,
//     });

//     seriesRef.current = series;

//     // -------------------------
//     // TOOLTIP
//     // -------------------------
//     tooltipRef.current = document.createElement("div");
//     Object.assign(tooltipRef.current.style, {
//       position: "absolute",
//       backgroundColor: "#1e293b",
//       color: "#fff",
//       padding: "4px 8px",
//       borderRadius: "4px",
//       fontSize: "12px",
//       pointerEvents: "none",
//       zIndex: "1000",
//       right: "10px",
//       top: "10px",
//       display: "none",
//     });

//     ref.current.appendChild(tooltipRef.current);

//     chart.subscribeCrosshairMove((param: MouseEventParams) => {
//       if (!param.point || !param.time || !seriesRef.current) {
//         tooltipRef.current!.style.display = "none";
//         onTimeChange(null);
//         return;
//       }
//       onTimeChange(param.time as UTCTimestamp);
//       const data = param.seriesData.get(seriesRef.current);
//       if (!data) return;

//       const candle = data as CandlestickData<UTCTimestamp>;

//       tooltipRef.current!.innerHTML = `
//         <div>O: ${candle.open}</div>
//         <div>H: ${candle.high}</div>
//         <div>L: ${candle.low}</div>
//         <div>C: ${candle.close}</div>
//       `;

//       tooltipRef.current!.style.display = "block";
//     });

//     // ✅ INITIAL FETCH
//     fetchData();

//     return () => {
//       chart.remove();
//       chartRef.current = null;
//       seriesRef.current = null;
//     };
//   }, []);

//   // -------------------------
//   // RE-FETCH ON PARAM CHANGE
//   // -------------------------
//   useEffect(() => {
//     if (!seriesRef.current) return;
//     fetchData();
//   }, [interval, fromDate, toDate]);

//   return <div ref={ref} className="w-full h-full relative" />;
// }



"use client";

import {
  createChart,
  CrosshairMode,
  UTCTimestamp,
  ISeriesApi,
  CandlestickSeries,
  CandlestickData,
} from "lightweight-charts";
import { useEffect, useRef, useState } from "react"; // Added useState
import { fetchChartTableData, ChartTableData } from "./chart_api";

type Props = {
  interval: string;
  visibleRange: { from: UTCTimestamp; to: UTCTimestamp } | null;
  onRangeChange: (range: { from: UTCTimestamp; to: UTCTimestamp } | null) => void;
  startDate: Date | null;
  endDate: Date | null;
  activeTime: UTCTimestamp | null;
  onTimeChange: (time: UTCTimestamp | null) => void;
};

export default function TradingChart({
  interval,
  visibleRange,
  onRangeChange,
  activeTime,
  onTimeChange,
  startDate,
  endDate,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // State to hold the hovered candle data
  const [hoverData, setHoverData] = useState<CandlestickData | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: "#020617" },
        textColor: "#cbd5e1",
      },
      grid: {
        vertLines: { color: "#1e293b" },
        horzLines: { color: "#1e293b" },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
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
    });

    chartRef.current = chart;

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
      borderVisible: false,
    });

    seriesRef.current = candleSeries;

    fetchChartTableData(interval, startDate!, endDate!).then((res) => {
      if (!res.data?.length) return;
      const candles: CandlestickData[] = res.data.map((d: ChartTableData) => ({
        time: Math.floor(new Date(`${d.date}T${d.time}`).getTime() / 1000) as UTCTimestamp,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      candleSeries.setData(candles);
      chart.timeScale().scrollToRealTime();
    });

    chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
      if (!range) return;
      onRangeChange({
        from: range.from as UTCTimestamp,
        to: range.to as UTCTimestamp,
      });
    });

    // 🟢 UPDATED: Capture OHLC data on move
    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.seriesData.get(candleSeries)) {
        onTimeChange(null);
        setHoverData(null); // Clear overlay
      } else {
        const data = param.seriesData.get(candleSeries) as CandlestickData;
        setHoverData(data);
        onTimeChange(param.time as UTCTimestamp);
      }
    });

    return () => chart.remove();
  }, [interval]);

  // (Sync logic remains the same...)
  useEffect(() => {
    if (!chartRef.current || !visibleRange) return;
    const current = chartRef.current.timeScale().getVisibleRange();
    if (JSON.stringify(current) !== JSON.stringify(visibleRange)) {
      chartRef.current.timeScale().setVisibleRange(visibleRange);
    }
  }, [visibleRange]);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;
    try {
      if (activeTime) {
        chartRef.current.setCrosshairPosition(0, activeTime, seriesRef.current);
      } else {
        chartRef.current.clearCrosshairPosition();
      }
    } catch {}
  }, [activeTime]);

  return (
    <div className="relative w-full h-full group">
      {/* 🟢 OHLC Overlay */}
      {hoverData && (
        <div className="absolute top-2 left-4 z-10 flex gap-4 text-xs font-mono pointer-events-none bg-slate-900/80 p-2 rounded border border-slate-700">
          <div className="flex gap-1">
            <span className="text-slate-400">O</span>
            <span className={hoverData.close >= hoverData.open ? "text-green-400" : "text-red-400"}>
              {hoverData.open.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-slate-400">H</span>
            <span className={hoverData.close >= hoverData.open ? "text-green-400" : "text-red-400"}>
              {hoverData.high.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-slate-400">L</span>
            <span className={hoverData.close >= hoverData.open ? "text-green-400" : "text-red-400"}>
              {hoverData.low.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-slate-400">C</span>
            <span className={hoverData.close >= hoverData.open ? "text-green-400" : "text-red-400"}>
              {hoverData.close.toFixed(2)}
            </span>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}