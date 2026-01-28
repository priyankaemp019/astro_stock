import {
  LineSeries,
  IChartApi,
  UTCTimestamp,
} from "lightweight-charts";

type Candle = {
  time: UTCTimestamp;
  close: number;
};

export function addIndicators(
  chart: IChartApi,
  candleSeries: any,
  data: Candle[]
) {
  if (!data.length) return;

  // 🔹 EMA
  const emaSeries = chart.addSeries(LineSeries, {
    color: "#facc15",
    lineWidth: 2,
  });

  emaSeries.setData(calculateEMA(data, 20));

  // 🔹 SMA
  const smaSeries = chart.addSeries(LineSeries, {
    color: "#38bdf8",
    lineWidth: 2,
  });

  smaSeries.setData(calculateSMA(data, 50));
}

/* ---------------- INDICATOR MATH ---------------- */

function calculateEMA(data: Candle[], period: number) {
  const k = 2 / (period + 1);
  let ema = data[0].close;

  return data.map((c) => {
    ema = c.close * k + ema * (1 - k);
    return { time: c.time, value: ema };
  });
}

function calculateSMA(data: Candle[], period: number) {
  const result: { time: UTCTimestamp; value: number }[] = [];

  for (let i = period; i < data.length; i++) {
    const slice = data.slice(i - period, i);
    const avg =
      slice.reduce((sum, c) => sum + c.close, 0) / period;

    result.push({
      time: data[i].time,
      value: avg,
    });
  }

  return result;
}
