"use server";
import axios from "axios";
import { UTCTimestamp } from "lightweight-charts";

export type ChartData = number[][];

export async function fetchChartData(
  toDate: Date,
  fromDate: Date,
  selectedSymbol: string,
  interval: string
): Promise<ChartData> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const isTodaySelected =
      toDate.toISOString().split("T")[0] === today &&
      fromDate.toISOString().split("T")[0] === today;
    // const url = isTodaySelected ? `http://192.168.1.115:8000/stock/candle?instrumentKey=${selectedSymbol}&interval=${interval}` : `http://192.168.1.115:8000/stock/historicalCandle?instrumentKey=${selectedSymbol}&interval=${interval}&toDate=${toDate.toISOString().split('T')[0]}&fromDate=${fromDate.toISOString().split('T')[0]}`;

    // const url = `http://192.168.1.111:8000/stock/historicalCandle?instrumentKey=NSE_INDEX%7CNifty%20Bank&interval=${interval}&toDate=2025-12-24&fromDate=2025-12-24`;
    const url = `http://192.168.1.111:8000/stock/historicalCandle?instrumentKey=NSE_INDEX%7CNifty%20Bank&interval=${interval}&toDate=2025-12-24&fromDate=2025-01-24`;

    console.log("Fetching chart data from URL:", url);
    const response = await axios.get<ChartData>(url);
    // console.log("Chart data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
}

export interface ChartTableDataResponse {
  success: boolean;
  successCode: string;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLastPage: boolean;
  data: ChartTableData[];
}

export interface ChartTableData {
  id: number;
  date: string;
  time: string;
  tithi: string;
  paksha: string;
  horaPlanet: string;
  moonRashi: string;
  moonNakshatra: string;
  moonPada: string;
  sunRashi: string;
  sunNakshatra: string;
  sunPada: string;
  marsRashi: string;
  marsNakshatra: string;
  marsPada: string;
  mercuryRashi: string;
  mercuryNakshatra: string;
  mercuryPada: string;
  jupiterRashi: string;
  jupiterNakshatra: string;
  jupiterPada: string;
  venusRashi: string;
  venusNakshatra: string;
  venusPada: string;
  saturnRashi: string;
  saturnNakshatra: string;
  saturnPada: string;
  rahuRashi: string;
  rahuNakshatra: string;
  rahuPada: string;
  ketuRashi: string;
  ketuNakshatra: string;
  ketuPada: string;
  open: number;
  high: number;
  low: number;
  close: number;
  changeRs: number;
  changePer: string;
  timeAsLocalTime: string;
  dateAsLocalDate: string;
}

function mapInterval(interval: string) {
  switch (interval) {
    case "1m":
      return "1minute";
    case "5m":
      return "5minute";
    case "15m":
      return "15minute";
    case "30m":
      return "30minute";
    case "1h":
      return "1hour";
    case "1D":
      return "1day";
    default:
      return "1minute";
  }
}

export async function fetchChartTableData(
  interval: string,
  startDate?: Date|null,
  endDate?: Date | null
): Promise<ChartTableDataResponse> {
  try {
    const apiInterval = mapInterval(interval);
    let url = `http://192.168.1.113:8083/api/data?interval=${apiInterval}`;

    if (startDate) {
      url += `&startDate=${startDate.toISOString().split("T")[0]}`;
    }
    if (endDate) {
      url += `&endDate=${endDate.toISOString().split("T")[0]}`;
    }

    console.log("URL :", url);
    const response = await axios.get<ChartTableDataResponse>(url);
    console.log("Chart data fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
}

export type AstroMap = Map<UTCTimestamp, ChartTableData>;
