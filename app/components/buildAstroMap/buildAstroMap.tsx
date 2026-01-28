import { UTCTimestamp } from "lightweight-charts";
import { AstroMap, ChartTableData } from "../chart_api";

export function buildAstroMap(data: ChartTableData[]): AstroMap {
    const map: AstroMap = new Map();

    data.forEach((row) => {
        const ts =
            new Date(`${row.date}T${row.time}`).getTime() / 1000;

        map.set(ts as UTCTimestamp, row);
    });

    return map;
}
