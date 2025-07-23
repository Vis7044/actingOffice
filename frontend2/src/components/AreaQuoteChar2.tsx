import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Stack } from "@fluentui/react";
import ReactECharts from "echarts-for-react";

interface IMonthlyQuote {
  id: string;
  total: number;
}

export default function AreaQuoteChart2({ offset = 0 }: { offset: number }) {
  const [dailyQuoteData, setDailyQuoteData] = useState<IMonthlyQuote[]>([]);
  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        const lines = [`<strong>${params[0].axisValue}</strong>`];
        for (const p of params) {
          lines.push(`${p.seriesName}: € ${p.value}`);
        }
        return lines.join("<br/>");
      },
    },
    legend: {
      data: ["Total"],
    },
    toolbox: {
      show: true,
      feature: {
        dataView: { show: true, readOnly: false },
        dataZoom: {
        yAxisIndex: 'none'
      },
        magicType: { show: true, type: ["line", "bar"] },
        saveAsImage: { show: true },
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dailyQuoteData.map((d) => Number(d.id)),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: dailyQuoteData.map((d) => Number(d.total)),
        type: "line",
        name: "Total",
        barMaxWidth: 30,
        smooth: 1,
        itemStyle: { color: "#0084c2ff" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#f3f1f8ff" }, // top
              { offset: 1, color: "#4c8faaff" }, // bottom
            ],
          },
        },
        markPoint: { data: [
          { type: 'max', name: 'Max' },
          { type: 'min', name: 'Min' }
        ] },
       
        markLine: { data: [{ type: "average", name: "Avg" }] },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axiosInstance.get(
          `/Admin/daily-quote-stats?offset=${offset}`
        );
        setDailyQuoteData(resp.data);
      } catch (err) {
        console.error("Failed to fetch quote stats:", err);
      }
    };
    fetchData();
  }, [offset]);

  return (
    <Stack styles={{ root: { height: "400px" } }}>
      <ReactECharts option={option} style={{ height: "400px" }} />
    </Stack>
  );
}
