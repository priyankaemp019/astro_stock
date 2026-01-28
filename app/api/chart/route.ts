import { fetchChartData } from "@/app/components/chart_api";
import { NextResponse } from "next/server";




export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const symbol = searchParams.get("symbol")!;
  const interval = searchParams.get("interval")!;
  const from = searchParams.get("from")!;
  const to = searchParams.get("to")!;

  const data = await fetchChartData(
    new Date(to),
    new Date(from),
    symbol,
    interval
  );

  return NextResponse.json(data);
}
