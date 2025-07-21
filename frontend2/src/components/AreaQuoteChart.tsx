import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axiosInstance from '../utils/axiosInstance';

interface IMonthlyQuote {
  _id: string;
  total: number;
}

export default function AreaQuoteChart({ offset = 0 }: { offset: number }) {
  const [dailyQuoteData, setDailyQuoteData] = useState<IMonthlyQuote[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await axiosInstance.get(`/Admin/daily-quote-stats?offset=${offset}`);
        setDailyQuoteData(resp.data);
      } catch (err) {
        console.error('Failed to fetch quote stats:', err);
      }
    };
    fetchData();
  }, [offset]);

  return (
    <ResponsiveContainer width="100%"  height={300}>
      <AreaChart
      
      
        data={dailyQuoteData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="_id" />
        <YAxis allowDecimals={false} />
        <CartesianGrid  strokeDasharray="3 3" />
        <Tooltip content={<CustomizedTooltip/>}/>
        
        <Area
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          fillOpacity={1}
          name='Total Quotes'
          fill="url(#colorTotal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
/* eslint-disable */

const CustomizedTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload.reduce((acc: any, cur: any) => {
    acc[cur.name] = cur.value;
    return acc;
  }, {});

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
    }}>
      <p><strong>Day: {label}</strong></p>
      <p>Total quotes: {data['Total Quotes'] || 0}</p>
    </div>
  );
};
