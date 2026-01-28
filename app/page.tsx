// "use client";

// import TradingChart from "@/app/components/TradingChart";
// import IntervalBar from "@/app/components/IntervalBar";
// import { useEffect, useState } from "react";
// import { UTCTimestamp } from "lightweight-charts";
// import AstroIndicatorPanel from "./components/AstroIndicatorPanel";
// import { ChartTableData, fetchChartTableData } from "./components/chart_api";
// import AstroBottomIndicator from "./components/AstroIndicatorPanel";

// export default function Home() {
//   const [interval, setInterval] = useState("1m");

//   // ✅ Fixed dates: 2025-12-24
//   const [fromDate] = useState<Date>(new Date("2025-12-24"));
//   const [toDate] = useState<Date>(new Date("2025-12-24"));
//   const [activeTime, setActiveTime] = useState<UTCTimestamp | null>(null);
//   const [tableData, setTableData] = useState<ChartTableData[]>([]);
//   const [activeAstro, setActiveAstro] = useState<ChartTableData | undefined>();
//   const [lastDate, setLastDate] = useState<string | null>(null);
//   const [apiFromDate, setApiFromDate] = useState<string | null>(null);
//   const [apiToDate, setApiToDate] = useState<string | null>(null);
//   const [visibleRange, setVisibleRange] = useState<{
//     from: UTCTimestamp;
//     to: UTCTimestamp;
//   } | null>(null);


//   useEffect(() => {
//     fetchChartTableData(interval).then((res) => {
//       const data = res.data;
//       if (!data || data.length === 0) return;

//       const first = data[0];
//       const last = data[data.length - 1];

//       setTableData(data);
//       setActiveAstro(last);

//       // ✅ API dates
//       setApiFromDate(first.date);
//       setApiToDate(last.date);

//       // keep chart synced to last candle
//       setActiveTime(
//         Math.floor(
//           new Date(`${last.date}T${last.time}`).getTime() / 1000
//         ) as UTCTimestamp
//       );
//     });
//   }, [interval]);



//   const handleIntervalSelect = (selectedOptions: string) => {
//     setInterval(selectedOptions);
//   }


//   return (
//     <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
//       {/* Header */}
//       <div className="px-3 py-2 border-b border-slate-700">
//         <h1 className="text-sm font-medium">
//           TradingView-Style Chart · Interval: {interval}
//         </h1>
//         <p className="text-xs text-slate-400">
//           Date: {apiFromDate ?? "--"} → {apiToDate ?? "--"}
//         </p>
//       </div>

//       {/* Interval bar */}
//       <IntervalBar interval={interval} onChange={handleIntervalSelect} />

//       {/* Chart */}
//       <div className="flex-1 overflow-hidden">
//         <TradingChart
//           interval={interval}
//           fromDate={fromDate.toISOString().split("T")[0]}
//           toDate={toDate.toISOString().split("T")[0]}
//           onTimeChange={setActiveTime}
//           onRangeChange={setVisibleRange}
//           visibleRange={visibleRange}
//           activeTime={activeTime}
//         />
//       </div>

//       {/* Bottom panel */}
//       <div className="h-40 w-full mt-3 bg-white text-black flex items-center justify-center">
//         <AstroBottomIndicator data={tableData} visibleRange={visibleRange} onRangeChange={setVisibleRange} activeTime={activeTime} onTimeChange={setActiveTime}/>
//       </div>
//     </div>
//   );
// }

"use client";

import TradingChart from "@/app/components/TradingChart";
import IntervalBar from "@/app/components/IntervalBar";
import { use, useEffect, useState } from "react";
import { UTCTimestamp } from "lightweight-charts";
import { ChartTableData, fetchChartTableData } from "./components/chart_api";
import AstroBottomIndicator from "./components/AstroIndicatorPanel";
import { DatePickerComponent } from "./components/DatePicker/page";

export default function Home() {
  const [interval, setInterval] = useState("1m");
  const [activeTime, setActiveTime] = useState<UTCTimestamp | null>(null);
  const [tableData, setTableData] = useState<ChartTableData[]>([]);
  const [visibleRange, setVisibleRange] = useState<{
    from: UTCTimestamp;
    to: UTCTimestamp;
  } | null>(null);

  const [apiFromDate, setApiFromDate] = useState<Date | null>(null);
  const [apiToDate, setApiToDate] = useState<Date | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  // 🔹 INITIAL LOAD (NO DATE FILTER)
  useEffect(() => {
    if (initialized) return;

    fetchChartTableData(interval).then((res) => {
      if (!res.data?.length) return;

      setTableData(res.data);

      const first = res.data[0];
      const last = res.data[res.data.length - 1];

      const from = new Date(`${first.date}T${first.time}`);
      const to = new Date(`${last.date}T${last.time}`);

      setApiFromDate(from);
      setApiToDate(to);

      setActiveTime(
        Math.floor(to.getTime() / 1000) as UTCTimestamp
      );

      setInitialized(true);
    });
  }, [interval, initialized]);

  // 🔹 DATE CHANGE → API CALL
  useEffect(() => {
    if (!apiFromDate || !apiToDate || !initialized) return;
    console.log("API CALL FROM MAIN PAGE")
    api();
  }, [interval, initialized]);


  const api = () => {
    console.log("start date : ", apiFromDate)
    fetchChartTableData(interval, apiFromDate, apiToDate!).then((res) => {
      if (!res.data?.length) return;
      setTableData(res.data);
    });
  }
  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-slate-700">
        <div className="flex items-center gap-6">
          <h1 className="text-sm font-medium whitespace-nowrap">
            TradingView-Style Chart
          </h1>

          <div className="flex items-center gap-4 bg-gray-700 px-3 py-1 rounded-lg shadow-md text-white ">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">From:</span>
              <DatePickerComponent
                selectedDate={apiFromDate}
                handleChange={setApiFromDate}
                setIsDatePickerOpen={setIsDatePickerOpen}
              />
            </div>

            <div className="flex items-center gap-2 text-sm ">
              <span className="font-semibold">To:</span>
              <DatePickerComponent
                selectedDate={apiToDate}
                handleChange={setApiToDate}
                setIsDatePickerOpen={setIsDatePickerOpen}
              />
            </div>
            <button onClick={api} className="bg-white text-black text-sm py-1 rounded px-2 cursor-pointer hover:bg-blue-600 hover:text-white">
              Apply
            </button>
          </div>
        </div>
      </div>

      <IntervalBar interval={interval} onChange={setInterval} />

      <div className="flex-1 overflow-hidden" style={{ pointerEvents: isDatePickerOpen ? "none" : "auto" }}>
        <TradingChart
          interval={interval}
          visibleRange={visibleRange}
          onRangeChange={setVisibleRange}
          activeTime={activeTime}
          onTimeChange={setActiveTime}
          startDate={apiFromDate}
          endDate={apiToDate}
        />
      </div>

      <div className="h-30 bg-slate-950">
        <AstroBottomIndicator
          data={tableData}
          visibleRange={visibleRange}
          onRangeChange={setVisibleRange}
          activeTime={activeTime}
          onTimeChange={setActiveTime}
        />
      </div>
    </div>
  );
}
