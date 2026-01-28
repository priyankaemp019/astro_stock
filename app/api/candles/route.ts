import { NextResponse } from "next/server";

export async function GET() {
  const candles = Array.from({ length: 200 }).map((_, i) => ({
    time: Math.floor(Date.now() / 1000) - (200 - i) * 60,
    open: 100 + Math.random() * 10,
    high: 110 + Math.random() * 10,
    low: 90 + Math.random() * 10,
    close: 100 + Math.random() * 10,
  }));

  return NextResponse.json(candles);
}
