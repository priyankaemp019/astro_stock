// import * as SunCalc from "suncalc";

// export function getMoonIcon(date: Date) {
//   const phase = SunCalc.getMoonIllumination(date).phase;

//   if (phase < 0.03 || phase > 0.97) return "🌑";
//   if (phase < 0.28) return "🌒";
//   if (phase < 0.53) return "🌓";
//   if (phase < 0.78) return "🌕";
//   return "🌗";
// }

import * as SunCalc from "suncalc";
import {
  createChart,
  UTCTimestamp,
  CandlestickData,
  CandlestickSeriesOptions,
  ISeriesApi,
  SeriesMarker,
} from "lightweight-charts";

// Moon phase logic
export function getMoonIcon(date: Date) {
  const phase = SunCalc.getMoonIllumination(date).phase;
  if (phase < 0.03 || phase > 0.97) return "🌑";
  if (phase < 0.28) return "🌒";
  if (phase < 0.53) return "🌓";
  if (phase < 0.78) return "🌕";
  return "🌗";
}

// TS workaround: cast series to any to access setMarkers
export function addMoonMarkers(
  series: ISeriesApi<
    "Candlestick",
    UTCTimestamp,
    CandlestickData<UTCTimestamp>
  >,
  data: CandlestickData<UTCTimestamp>[]
) {
  const markers: SeriesMarker<UTCTimestamp>[] = data.map((bar) => ({
    time: bar.time,
    position: "aboveBar",
    color: "#FFD700",
    shape: "circle",
    text: getMoonIcon(new Date(bar.time * 1000)),
  }));

  // ✅ TypeScript workaround: cast to any
  (series as any).setMarkers(markers);
}
