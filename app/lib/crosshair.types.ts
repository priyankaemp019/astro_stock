import { IRange, Time, UTCTimestamp } from "lightweight-charts";

export function toUtcRange(
  range: IRange<Time> | null
): { from: UTCTimestamp; to: UTCTimestamp } | null {
  if (!range) return null;

  if (typeof range.from !== "number" || typeof range.to !== "number") {
    return null;
  }

  return {
    from: range.from as UTCTimestamp,
    to: range.to as UTCTimestamp,
  };
}
