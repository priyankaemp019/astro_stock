import { SeriesMarker, UTCTimestamp } from "lightweight-charts";
import { getMoonIcon } from "./moonPhases";

export function createMoonMarkers(
  candles: { time: UTCTimestamp }[]
): SeriesMarker<UTCTimestamp>[] {
  return candles.map((c) => {
    const date = new Date(c.time * 1000);

    return {
      time: c.time,
      position: "aboveBar",
      color: "#a78bfa",
      shape: "circle",
      text: getMoonIcon(date),
    };
  });
}
