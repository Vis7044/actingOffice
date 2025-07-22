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
      itemStyle: { color: '#8884d8' },
      markPoint: { data: [{ type: 'max', name: 'Max' }] },
      markLine: { data: [{ type: 'average', name: 'Avg' }] },
    },
    {
      name: 'Accepted',
      type: 'bar',
      barMaxWidth: 30,
      data: dailyQuoteData.map((d) => Number(d.acceptedCountAmount)),
      itemStyle: { color: '#82ca9d' },
      markPoint: { data: [{ type: 'max', name: 'Max' }] },
      markLine: { data: [{ type: 'average', name: 'Avg' }] },
    },
    {
      name: 'Rejected',
      type: 'bar',
      barMaxWidth: 30,
      data: dailyQuoteData.map((d) => Number(d.rejectedCountAmount)),
      itemStyle: { color: '#da5b35' },
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

