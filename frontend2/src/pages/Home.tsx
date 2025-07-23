import {
  ShimmeredDetailsList,
  Stack,
  Text,
  Dropdown,
  type IDropdownOption,
  type IDropdownStyles,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { DetailsListLayoutMode, SelectionMode } from "@fluentui/react";
import "@fluentui/react/dist/css/fabric.css";
import type { IColumn } from "@fluentui/react/lib/DetailsList";
import axiosInstance from "../utils/axiosInstance";
import { Button } from "react-bootstrap";
import BarQuoteChart2 from "../components/BarQuoteChart2";
import AreaQuoteChart2 from "../components/AreaQuoteChar2";

export interface IQuoteSummary {
  firstName: string;
  lastName: string;
  totalCount: number;
  acceptedCount: number;
  draftCount: number;
  rejectedCount: number;
}

const columns: IColumn[] = [
  {
    key: "Users",
    name: "Users",
    onRenderHeader: () => (
      <Text
        variant="mediumPlus"
        styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
      >
        Users
      </Text>
    ),
    fieldName: "key",
    minWidth: 150,
    maxWidth: 200,
    isResizable: true,
    onRender: (item: IQuoteSummary) => (
      <Text variant="mediumPlus">
        {item.firstName} {item.lastName}
      </Text>
    ),
  },
  {
    key: "totalQuote",
    name: "Total Quote",
    onRenderHeader: () => (
      <Text
        variant="mediumPlus"
        styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
      >
        Total Quote
      </Text>
    ),
    fieldName: "key",
    minWidth: 100,
    maxWidth: 120,
    isResizable: true,
    onRender: (item: IQuoteSummary) => (
      <Text variant="mediumPlus">{item.totalCount}</Text>
    ),
  },
  {
    key: "draftCount",
    name: "Draft Count",
    onRenderHeader: () => (
      <Text
        variant="mediumPlus"
        styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
      >
        Total Draft
      </Text>
    ),
    fieldName: "key",
    minWidth: 100,
    maxWidth: 120,
    isResizable: true,
    onRender: (item: IQuoteSummary) => (
      <Text variant="mediumPlus">{item.draftCount}</Text>
    ),
  },
  {
    key: "acceptedCount",
    name: "Accepted Count",
    onRenderHeader: () => (
      <Text
        variant="mediumPlus"
        styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
      >
        Total Accepted
      </Text>
    ),
    fieldName: "key",
    minWidth: 100,
    maxWidth: 120,
    isResizable: true,
    onRender: (item: IQuoteSummary) => (
      <Text variant="mediumPlus">{item.acceptedCount}</Text>
    ),
  },
  {
    key: "rejectedCount",
    name: "Rejected Count",
    onRenderHeader: () => (
      <Text
        variant="mediumPlus"
        styles={{ root: { color: "rgb(2, 91, 150)", fontWeight: 500 } }}
      >
        Total Rejected
      </Text>
    ),
    fieldName: "key",
    minWidth: 100,
    maxWidth: 120,
    isResizable: true,
    onRender: (item: IQuoteSummary) => (
      <Text variant="mediumPlus">{item.rejectedCount}</Text>
    ),
  },
];

const pageSizeOptions: IDropdownOption[] = [
  { key: 5, text: "5 per page" },
  { key: 10, text: "10 per page" },
  { key: 15, text: "15 per page" },
];

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: 200, border: "0px" },
  root: { border: "0px" },
};

const Home = () => {
  const [userQuoteData, setUserQuoteData] = useState<IQuoteSummary[]>([]);
  const [refreshList, setRefreshList] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [monthOffset, setMonthOffset] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      setRefreshList(true);
      const resp = await axiosInstance.get(
        `/Admin/users-quote-status?page=${currentPage}&pageSize=${pageSize}`
      );
      setUserQuoteData(resp.data.data);
      setTotalCount(resp.data.totalCount);
      setRefreshList(false);
    };
    fetchData();
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (_, option?: IDropdownOption) => {
    if (option) {
      setPageSize(Number(option.key));
      setCurrentPage(1);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const options: IDropdownOption[] = [
    { key: 0, text: "This Month" },
    { key: -1, text: "Previous Month" },
  ];

  const handleMonthChange = (_: unknown, option?: IDropdownOption) => {
    if (option) {
      setMonthOffset(Number(option.key));
      console.log(option.key);
    }
  };

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{
        root: { maxHeight: "90vh", overflowY: "auto", paddingBottom: "30px" },
      }}
    >
      <Stack
        horizontal
        horizontalAlign="end"
        styles={{ root: { width: "100%", paddingRight: "5%" } }}
      >
        <Dropdown
          placeholder="This Month"
          label="Select Month"
          options={options}
          styles={dropdownStyles}
          onChange={handleMonthChange}
        />
      </Stack>

      <Stack
        styles={{ root: { height: "450px", width: "90%", margin: "auto" } }}
      >
        <Text
          variant="large"
          styles={{
            root: {
              fontWeight: 500,
              paddingBottom: "10px",
              paddingLeft: "10px",
            },
          }}
        >
          quote
        </Text>
        <AreaQuoteChart2 offset={monthOffset} />
      </Stack>
      <Stack
        styles={{ root: { height: "450px", width: "90%", margin: "auto" } }}
      >
        <Text
          variant="large"
          styles={{
            root: {
              fontWeight: 500,
              paddingBottom: "10px",
              paddingLeft: "10px",
            },
          }}
        >
          Quotes Detail of Users
        </Text>
        <BarQuoteChart2 offset={monthOffset} />
      </Stack>
      <Stack styles={{ root: { width: "50%", margin: 'auto' } }}>
        <ShimmeredDetailsList
          items={userQuoteData}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
          isHeaderVisible={true}
          enableShimmer={refreshList}
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
        <Stack
          horizontal
          horizontalAlign="space-between"
          tokens={{ childrenGap: 10 }}
          styles={{ root: {margin: '2px 5px'}}}
          verticalAlign="center"
        >
          <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
            tokens={{ childrenGap: 10 }}
          >
            <Dropdown
              label="Page Size"
              options={pageSizeOptions}
              selectedKey={pageSize}
              onChange={handlePageSizeChange}
              styles={{ root: { width: 150 } }}
            />
          </Stack>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 5 }}
            styles={{ root: { margin: "10px" } }}
          >
            <Button
              variant="outline-primary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text variant="medium">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              variant="outline-primary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
