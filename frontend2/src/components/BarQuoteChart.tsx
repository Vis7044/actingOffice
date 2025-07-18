import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axiosInstance from '../utils/axiosInstance';
import { Stack, Text } from '@fluentui/react';

interface IUserQuoteStat {
  draftCountAmount: string;
  acceptedCountAmount: string;
  totalCountAmount: string;
  rejectedCountAmount: string;
  name: string;
}

export default function BarQuoteChart({offset}:{offset: number}) {
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

  const [counter, setcounter] = useState({
    first:true,
    second:true,
    thrid:true
  });

  return (
    <Stack styles={{root: {height: '350px'}}}>
        <Stack horizontalAlign='center' horizontal tokens={{childrenGap: 20}}>
            <Stack horizontal verticalAlign='center' tokens={{childrenGap: 5}}><Stack onClick={()=>{setcounter((prev)=>{
                return {...prev,first: !counter.first}
            })}} styles={{root: {width: 30,height: 16,borderRadius: '5px',backgroundColor:`${counter.first===true? '#8884d8':'grey'}`,cursor: 'pointer'}}}></Stack><Text>Drafted</Text></Stack>
            <Stack horizontal verticalAlign='center' tokens={{childrenGap: 5}}><Stack onClick={()=>{setcounter((prev)=>{
                return {...prev,second: !counter.second}
            })}} styles={{root: {width: 30,height: 16,borderRadius: '5px',backgroundColor: `${counter.second===true? '#82ca9d':'grey'}`,cursor: 'pointer'}}}></Stack><Text>Accepted</Text></Stack>
            <Stack horizontal verticalAlign='center' tokens={{childrenGap: 5}}><Stack onClick={()=>{setcounter((prev)=>{
                return {...prev,thrid: !counter.thrid}
            })}} styles={{root: {width: 30,height: 16,borderRadius: '5px',backgroundColor: `${counter.thrid==true? '#da5b35ff':'grey'}`,cursor: 'pointer'}}}></Stack><Text>Rejected</Text></Stack>
       
        </Stack>
    <ResponsiveContainer height={350}>
      <BarChart
        data={dailyQuoteData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name"/>
        <YAxis />
        <Tooltip content={<CustomizedTooltip />} />
        
        <Bar dataKey="draftCountAmount" fill="#8884d8" name="Drafted" hide={!counter.first}/>
        <Bar dataKey="acceptedCountAmount" fill="#82ca9d" name="Accepted" hide={!counter.second}/>
        <Bar dataKey="rejectedCountAmount" fill="#da5b35ff" name="Rejected" hide={!counter.thrid}/>
      </BarChart>
    </ResponsiveContainer>
    </Stack>
  );
}

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
      <p><strong>{label}</strong></p>
      {data['Drafted'] && <p>Drafted: € {data['Drafted']}</p>}
      {data['Accepted'] && <p>Accepted: € {data['Accepted']}</p>}
      {data['Rejected'] && <p>Rejected: € {data['Rejected']}</p>}
   
    </div>
  );
};
