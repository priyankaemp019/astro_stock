export function SMA(data: any[], period: number) {
  return data.map((d, i) => {
    if (i < period) return null;
    const slice = data.slice(i - period, i);
    const avg =
      slice.reduce((s, v) => s + v.close, 0) / period;
    return { time: d.time, value: avg };
  }).filter(Boolean);
}

export function EMA(data: any[], period: number) {
  const k = 2 / (period + 1);
  let ema = data[0].close;

  return data.map((d) => {
    ema = d.close * k + ema * (1 - k);
    return { time: d.time, value: ema };
  });
}
