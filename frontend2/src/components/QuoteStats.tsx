import { Stack, Text } from "@fluentui/react";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { ProgressBar } from "react-bootstrap";
import { LuSquare } from "react-icons/lu";
import { IoSendSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";

interface IQuoteStat {
  totalQuotes: number;
  totalAmount: number;
  totalDrafted: number;
  draftedPercentage: number;
  acceptedPercentage: number;
  rejectedPercentage: number;
  totalAccepted: number;
  totalRejected: number;
}

export const QuoteStats = ({refreshList}:{refreshList: boolean}) => {
  const [quoteStats, setQuoteStats] = useState<IQuoteStat | null>(null);
  const fetchData = async () => {
    const resp = await axiosInstance.get("/Quote/get/stats");
    setQuoteStats(resp.data);
  };
  
  useEffect(() => {
    fetchData();
  }, [refreshList]);
  return (
    <div className="ms-Grid">
      <Stack horizontal className="ms-Grid-row">
        <Stack
          verticalAlign="space-between"
          className="ms-Grid-col  ms-md4 ms-lg4 border"
          styles={{root: {padding: '6px 6px'}}}
          tokens={{childrenGap: 10}}
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <LuSquare color=" #f19b4aff" /> <Text>{quoteStats?.totalDrafted}</Text>
          </Stack>
          <Stack styles={{ root: { marginBottom: "10px" } }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text>Draft</Text>
              <Text>{quoteStats?.draftedPercentage || 0}%</Text>
            </Stack>
            <ProgressBar variant="info"  style={{height: 10}} now={quoteStats?.draftedPercentage} />
          </Stack>
        </Stack>
        <Stack
          verticalAlign="space-between"
          className="ms-Grid-col  ms-md4 ms-lg4 border"
          styles={{root: {padding: '6px 6px'}}}
          tokens={{childrenGap: 10}}
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <IoSendSharp color=" #215f12ff"/> <Text>{quoteStats?.totalAccepted}</Text>
          </Stack>
          <Stack styles={{ root: { marginBottom: "10px" } }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text>Accepted</Text>
              <Text>{quoteStats?.acceptedPercentage || 0}%</Text>
            </Stack>
            <ProgressBar variant="success"  style={{height: 10}} className="" now={quoteStats?.acceptedPercentage} />
          </Stack>
        </Stack>
        <Stack
          verticalAlign="space-between"
          className="ms-Grid-col  ms-md4 ms-lg4 border"
          styles={{root: {padding: '6px 6px'}}}
          tokens={{childrenGap: 10}}
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <RxCross2 color=" #f84d36ff"/> <Text>{quoteStats?.totalRejected}</Text>
          </Stack>
          <Stack styles={{ root: { marginBottom: "10px" } }}>
            <Stack horizontal horizontalAlign="space-between">
              <Text>Rejected</Text>
              <Text>{quoteStats?.rejectedPercentage || 0}%</Text>
            </Stack>
            <ProgressBar variant="danger" style={{height: 10}} now={quoteStats?.rejectedPercentage} />
          </Stack>
        </Stack>

        <Stack
          className="ms-Grid-col ms-md4 ms-lg4 border"
          tokens={{ childrenGap: 10 }}
          styles={{root: {padding: '6px 6px'}}}
         
        >
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
            <LiaMoneyBillWaveSolid color=" #21690fff"/> <Text>{quoteStats?.totalAmount}</Text>
          </Stack>
          <Stack horizontal horizontalAlign="space-between">
            <Text>Success days</Text>
            <Text>1.0</Text>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};
