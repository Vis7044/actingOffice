import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Stack } from '@fluentui/react';
import ReactECharts from 'echarts-for-react';

interface IUserQuoteStat {
  draftCountAmount: string;
  acceptedCountAmount: string;
  totalCountAmount: string;
  rejectedCountAmount: string;
  name: string;
}

export default function BarQuoteChart2({ offset }: { offset: number }) {
  const [dailyQuoteData, setDailyQuoteData] = useState<IUserQuoteStat[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axiosInstance.get(`/Admin/user-quote-amount-stats?offset=${offset}`);
        setDailyQuoteData(resp.data);
      } catch (err) {
        console.error('Failed to fetch quote stats:', err);
      }
    };
    fetchData();
  }, [offset]);

  const option = {
  tooltip: {
    trigger: 'axis',
    formatter: (params: any) => {
      const lines = [`<strong>${params[0].axisValue}</strong>`];
      for (const p of params) {
        lines.push(`${p.seriesName}: € ${p.value}`);
      }
      return lines.join('<br/>');
    },
  },
  legend: {
    data: ['Drafted', 'Accepted', 'Rejected'],
  },
  toolbox: {
    show: true,
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ['line', 'bar'] },
      saveAsImage: { show: true }
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '8%',
    containLabel: true, // prevents overflow
  },
  xAxis: {
    type: 'category',
    data: dailyQuoteData.map((d) => d.name),
    
  },
  yAxis: {
    type: 'value',
  },
  series: [
  {
    name: 'Drafted',
    type: 'bar',
    barMaxWidth: 30,
    data: dailyQuoteData.map((d) => Number(d.draftCountAmount)),
    smooth: true,
    itemStyle: {color: '#0084c2ff'},
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#f3f1f8ff' }, // top
          { offset: 1, color: '#4c8faaff' }, // bottom
        ],
      },
    },
    markPoint: { data: [{ type: 'max', name: 'Max' }] },
    markLine: { data: [{ type: 'average', name: 'Avg' }] },
  },
  {
    name: 'Accepted',
    type: 'bar',
    barMaxWidth: 30,
    data: dailyQuoteData.map((d) => Number(d.acceptedCountAmount)),
    smooth: true,
    itemStyle: {color: '#00443dff'},
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#ceecf1ff' },
          { offset: 1, color: '#22534eff' },
        ],
      },
    },
    markPoint: { data: [{ type: 'max', name: 'Max' }] },
    markLine: { data: [{ type: 'average', name: 'Avg' }] },
  },
  {
    name: 'Rejected',
    type: 'bar',
    barMaxWidth: 30,
    data: dailyQuoteData.map((d) => Number(d.rejectedCountAmount)),
    smooth: true,
    itemStyle: {color: '#03a038ff'},
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          { offset: 0, color: '#d2e2e9ff' },
          { offset: 1, color: '#71d492ff' },
        ],
      },
    },
    markPoint: { data: [{ type: 'max', name: 'Max' }] },
    markLine: { data: [{ type: 'average', name: 'Avg' }] },
  },
]

};


  return (
    <Stack styles={{ root: { height: '400px' } }}>
      
      <ReactECharts option={option} style={{ height: '400px'}} />
    </Stack>
  );
}

